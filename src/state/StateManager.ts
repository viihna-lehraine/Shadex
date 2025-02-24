// File: state/StateManager.ts

import {
	Helpers,
	Palette,
	Services,
	State,
	StateManagerInterface,
	Utilities
} from '../types/index.js';
import { Mutex } from '../common/services/Mutex.js';
import { Observer } from '../common/services/Observer.js';
import {
	StateFactory,
	StateHistory,
	StateLock,
	StatePersistence
} from './index.js';
import { defaults, domConfig, domIndex, env } from '../config/index.js';

const caller = 'StateManager';
const defaultState = defaults.state;
const maxReadyAttempts = env.state.maxReadyAttempts;

export class StateManager implements StateManagerInterface {
	static #instance: StateManager | null = null;

	#observer: Observer<State>;
	#state: State;
	#mutex: Mutex;
	#stateFactory: StateFactory;
	#stateHistory: StateHistory;
	#stateLock: StateLock;
	#statePersistence: StatePersistence;

	#clone: Helpers['data']['clone'];
	#log: Services['log'];
	#errors: Services['errors'];
	#helpers: Helpers;
	#services: Services;

	private constructor(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	) {
		try {
			services.log(`Constructing StateManager instance.`, {
				caller: `${caller} constructor`,
				level: 'debug'
			});

			this.#clone = helpers.data.clone;
			this.#log = services.log;
			this.#errors = services.errors;
			this.#helpers = helpers;
			this.#services = services;

			this.#state = {} as State;
			this.#state.paletteHistory = [];

			this.#observer = new Observer<State>(
				this.#state,
				{ delay: env.observer.debounce },
				this.#helpers,
				this.#services
			);

			this.#mutex = new Mutex(services.errors, helpers, services.log);

			Object.keys(this.#state).forEach(key => {
				this.#observer.on(key as keyof State, (newVal, oldVal) => {
					this.#log(
						`${key} updated. New: ${JSON.stringify(newVal)} | Old: ${JSON.stringify(oldVal)}`,
						{ caller: `${caller}.#observer`, level: 'debug' }
					);
				});
			});

			this.#stateFactory = StateFactory.getInstance(
				helpers,
				services,
				utils
			);

			this.#stateHistory = StateHistory.getInstance(helpers, services);

			this.#stateLock = StateLock.getInstance(
				helpers,
				this.#mutex,
				this.#observer,
				services
			);

			this.#statePersistence = StatePersistence.getInstance(
				helpers,
				services,
				utils
			);

			this.init().catch(error => {
				this.#log('StateManager init failed.', {
					caller: `${caller} constructor`,
					level: 'error'
				});

				console.error(error);
			});
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static async getInstance(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	): Promise<StateManager> {
		return services.errors.handleSync(() => {
			if (!StateManager.#instance) {
				services.log(`Creating new StateManager instance.`, {
					caller: `${caller}.getInstance`,
					level: 'debug'
				});

				StateManager.#instance = new StateManager(
					helpers,
					services,
					utils
				);
			}

			services.log(`Returning StateManager instance.`, {
				caller: `${caller}.getInstance`,
				level: 'debug'
			});

			return StateManager.#instance;
		}, `[${caller}]: Error getting StateManager instance.`);
	}

	async init(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			this.#log('Initializing State Manager', {
				caller: `${caller}.init`,
				level: 'debug'
			});

			await this.#statePersistence.init();

			this.#state = await this.loadState();
		}, `[${caller}]: Failed to initialize State Manager.`);
	}

	async atomicUpdate(callback: (state: State) => void): Promise<void> {
		return this.#errors.handleAsync(async () => {
			return this.#stateLock.atomicUpdate(callback);
		}, `[${caller}]: Failed to perform atomic update.`);
	}

	async batchUpdate(
		callback: (state: State) => Partial<State>
	): Promise<void> {
		await this.#errors.handleAsync(async () => {
			await this.#stateLock.lockAndExecute('write', async () => {
				const updates = callback(this.#observer.getData());

				this.#observer.batchUpdate(updates);

				this.#log('Performed batch update.', {
					caller: `${caller}.batchUpdate`,
					level: 'debug'
				});
			});
		}, `[${caller}]: Failed to perform batch update.`);
	}

	async ensureStateReady(): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				let attempts = 0;

				while (!this.#state || !this.#state.paletteContainer) {
					if (attempts++ >= maxReadyAttempts) {
						this.#log('State initialization timed out.', {
							caller: `${caller}.ensureStateReady`,
							level: 'error'
						});

						throw new Error('State initialization timed out.');
					}

					this.#log(
						`Waiting for state to initialize... (Attempt ${attempts})`,
						{
							caller: `${caller}.ensureStateReady`,
							level: 'debug'
						}
					);

					await new Promise(resolve => setTimeout(resolve, 50));
				}

				this.#log('State is now initialized.', {
					caller: `${caller}.ensureStateReady`,
					level: 'debug'
				});
			},
			`[${caller}]: Failed to ensure state readiness.`,
			{ context: { maxReadyAttempts } }
		);
	}

	async getState(): Promise<State> {
		return await (this.#errors.handleAsync(async () => {
			return this.#stateLock.lockAndExecute('read', () => {
				if (!this.#state)
					this.#log('State accessed before initialization.', {
						caller: `${caller}.getState`,
						level: 'warn'
					});

				if (!this.#state.preferences) {
					this.#log(
						'State.preferences is undefined. Setting default preferences.',
						{
							caller: `${caller}.getState`,
							level: 'warn'
						}
					);

					this.#state.preferences = defaultState.preferences;
				}

				return this.#helpers.data.clone(this.#state);
			});
		}, `[${caller}]: Error retrieving state`) ?? defaultState);
	}

	async loadState(): Promise<State> {
		const state = await this.#statePersistence.loadState();

		if (state) {
			this.#log('State loaded from storage.', {
				caller: `${caller}.loadState`
			});

			return this.#clone(state);
		} else {
			this.#log(
				`State not found in storage. Creating initial state via State Factory.`,
				{
					caller: `${caller}.loadState`
				}
			);

			return await this.#stateFactory.createInitialState();
		}
	}

	logContentionStats(): void {
		this.#errors.handleSync(() => {
			const contentionCount = this.#mutex.getContentionCount();
			const contentionRate = this.#mutex.getContentionRate();

			this.#log(
				`Current contention count: ${contentionCount}.\nCurrent contention rate: ${contentionRate}.`,
				{
					caller: `${caller}.logContentionStats`,
					level: 'debug'
				}
			);
		}, `[${caller}]: Failed to log contention stats`);
	}

	redo(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			return await this.#stateHistory.redo();
		}, `[${caller}]: Redo operation failed.`);
	}

	async resetState(): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				this.#trackAction();

				await this.#saveState();

				this.#removeAllListeners();

				this.#log('App state has been reset', {
					caller: `${caller}.resetState`,
					level: 'debug'
				});
			},
			`[${caller}]: Failed to reset state`,
			{ fallback: defaultState }
		);
	}

	async saveState(): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			await this.#statePersistence.saveState(this.#state);

			this.#log('State saved to storage.', {
				caller: `${caller}.saveState`
			});
		}, `[${caller}]: Failed to save state`);
	}

	async setState(newState: State, track: boolean = true): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				return await this.#stateLock.lockAndExecute(
					'write',
					async () => {
						if (track) this.#trackAction();

						this.#observer.batchUpdate(newState);

						this.#log('State updated.', {
							caller: `${caller}.setState`,
							level: 'debug'
						});
						this.logContentionStats();
					}
				);
			},
			`[${caller}]: Failed to set state.`,
			{ context: { newState, track } }
		);
	}

	async undo(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			const previousState = await this.#stateHistory.undo(this.#state);

			if (!previousState) return;

			await this.#stateLock.lockAndExecute('write', async () => {
				this.#observer.batchUpdate(previousState);
				this.#state = previousState;

				this.#log('Undo action applied to state.', {
					caller: `${caller}.undo`,
					level: 'debug'
				});

				await this.#statePersistence.saveState(this.#state);
			});
		}, `[${caller}]: Failed to perform undo.`);
	}

	async updateLockedProperty<K extends keyof State>(
		key: K,
		value: State[K]
	): Promise<void> {
		return this.#stateLock.updateLockedProperty(key, value, async () => {
			await this.#statePersistence.saveState(this.#state);
			this.logContentionStats();
		});
	}

	updatePaletteColumns(
		columns: State['paletteContainer']['columns'],
		track: boolean,
		verbosity: number
	): void {
		return this.#errors.handleSync(
			() => {
				if (!this.#state || !this.#state.paletteContainer) {
					throw new Error(
						`[${caller}]: updatePaletteColumns called before state initialization.`
					);
				}

				if (
					!this.#helpers.dom.getElement<HTMLDivElement>(
						domIndex.ids.divs.paletteContainer
					)
				) {
					this.#log('Palette Container not found in the DOM.', {
						caller: `${caller}.updatePaletteColumns`,
						level: 'warn'
					});
				}

				if (track) this.#trackAction();

				this.#state.paletteContainer.columns = columns;

				this.#log(`Updated paletteContainer columns`, {
					caller: `${caller}.updatePaletteColumns`,
					level: 'debug'
				});

				this.#saveStateAndLog('paletteColumns', verbosity);

				this.logContentionStats();
			},
			`[${caller}]: Failed to update palette columns.`,
			{ context: { columns, track, verbosity } }
		);
	}

	updatePaletteColumnSize(columnID: number, newSize: number): void {
		return this.#errors.handleSync(
			() => {
				const columns = this.#state.paletteContainer.columns;
				const columnIndex = columns.findIndex(
					col => col.id === columnID
				);
				if (columnIndex === -1) return;

				const minSize = domConfig.minColumnSize;
				const maxSize = domConfig.maxColumnSize;
				const adjustedSize = Math.max(
					minSize,
					Math.min(newSize, maxSize)
				);

				const sizeDifference = adjustedSize - columns[columnIndex].size;
				columns[columnIndex].size = adjustedSize;

				const unlockedColumns = columns.filter(
					(col, index) => index !== columnIndex && !col.isLocked
				);
				const distributionAmount =
					sizeDifference / unlockedColumns.length;
				unlockedColumns.forEach(
					col => (col.size -= distributionAmount)
				);

				const finalTotalSize = columns.reduce(
					(sum, col) => sum + col.size,
					0
				);
				const correctionFactor = 100 / finalTotalSize;
				columns.forEach(col => (col.size *= correctionFactor));

				this.#log(`Updated column size`, {
					caller: `${caller}}.updatePaletteColumnSize`,
					level: 'debug'
				});

				this.#saveStateAndLog('paletteColumnSize', 3);

				this.logContentionStats();
			},
			`[${caller}]: Failed to update palette column size.`,
			{ context: { columnID, newSize } }
		);
	}

	async updatePaletteHistory(
		updatedHistory: Palette[],
		track: boolean
	): Promise<void> {
		return this.#errors.handleAsync(
			async () => {
				if (track) {
					this.#trackAction();
				}

				this.#state.paletteHistory = updatedHistory;

				await this.#statePersistence.saveState(this.#state);

				this.#log('Updated palette history', {
					caller: `${caller}.updatePaletteHistory`,
					level: 'debug'
				});

				this.logContentionStats();
			},
			`[${caller}]: Failed to update palette history.`,
			{ context: { updatedHistory } }
		);
	}

	async updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): Promise<void> {
		this.#errors.handleAsync(async () => {
			if (track) this.#trackAction();

			return this.#stateLock.updateLockedProperty(
				'selections',
				{
					...this.#observer.get('selections'),
					...selections
				},
				async () => await this.#statePersistence.saveState(this.#state)
			);
		}, `[${caller}]: Failed to update selections.`);
	}

	#removeAllListeners(): void {
		Object.keys(this.#state).forEach(key => {
			this.#observer.off(key as keyof State, () => {});
		});
	}

	#trackAction(): void {
		this.#stateHistory.trackAction(this.#state);
	}
}
