// File: state/StateManager.ts

import {
	Helpers,
	History,
	Palette,
	Services,
	State,
	StateManagerInterface,
	Utilities
} from '../types/index.js';
import { Mutex } from '../common/services/Mutex.js';
import { Observer } from '../common/services/Observer.js';
import { StorageManager } from '../storage/StorageManager.js';
import { defaults, domConfig, domIndex, env } from '../config/index.js';

const defaultState = defaults.state;
const maxReadyAttempts = env.state.maxReadyAttempts;

/**
 * @class StateManager
 * @author Viihna Lehraine
 * @description Manages the application state, including undo/redo functionality, state persistance, and state locking.
 * @implements {StateManagerInterface}
 * @property {Map<keyof State, Mutex>} #dataLocks - fine-grained locks per state property
 * @property {History} #history - history of state changes
 * @property {Observer<State>} #observer - data observer
 * @property {(() => void) | null} #onStateLoadCallback - callback to run after state is loaded
 * @property {State} #state - current state
 * @property {Mutex} #stateLock - global lock for the entire state object
 * @property {StorageManager} #storage - storage manager
 * @property {History} #undoStack - undo stack
 */
export class StateManager implements StateManagerInterface {
	static #instance: StateManager | null = null;

	#dataLocks: Map<keyof State, Mutex> = new Map();
	#history: History;
	#observer: Observer<State>;
	#onStateLoadCallback: (() => void) | null = null;
	#saveThrottleTimer: NodeJS.Timeout | null = null;
	#state: State;
	#stateLock: Mutex;
	#storage: StorageManager;
	#undoStack: History;

	#log: Services['log'];
	#errors: Services['errors'];
	#helpers: Helpers;
	#services: Services;
	#utils: Utilities;

	private constructor(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	) {
		this.#log = services.log;
		this.#errors = services.errors;
		this.#helpers = helpers;
		this.#services = services;
		this.#utils = utils;
		this.#storage = new StorageManager(services);

		this.#state = {} as State;
		this.#observer = new Observer<State>(
			this.#state,
			{ delay: env.observer.debounce },
			this.#helpers,
			this.#services
		);

		Object.keys(this.#state).forEach(key => {
			this.#observer.on(key as keyof State, (newVal, oldVal) => {
				this.#log(
					`${key} updated. New: ${JSON.stringify(newVal)} | Old: ${JSON.stringify(oldVal)}`,
					{ caller: '[StateManager.#observer]', level: 'debug' }
				);
			});
		});

		this.#state.paletteHistory = [];
		this.#history = [this.#state];
		this.#stateLock = new Mutex(services.errors, services.log);
		this.#undoStack = [];

		this.init()
			.then(() => {
				this.#saveStateAndLog('init', 3);
			})
			.catch(error => {
				this.#log('StateManager init failed.', {
					caller: '[StateManager constructor]',
					level: 'error'
				});
				console.error(error);
			});
	}

	static getInstance(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	): StateManager {
		if (!StateManager.#instance) {
			services.log(`Creating new StateManager instance.`, {
				caller: '[StateManager.getInstance]',
				level: 'debug'
			});
			StateManager.#instance = new StateManager(helpers, services, utils);
		}

		services.log(`Returning StateManager instance.`, {
			caller: '[StateManager.getInstance]',
			level: 'debug'
		});
		return StateManager.#instance;
	}

	async init(): Promise<void> {
		this.#log('Initializing State Manager', {
			caller: '[StateManager.init]',
			level: 'debug'
		});

		await this.#storage.init();

		this.#state =
			(await this.#errors.handleAsync(
				() => this.loadState(),
				'Failed to load state. Generating initial state.'
			)) ?? this.#generateInitialState();

		this.#log('StateManager initialized successfully.', {
			caller: '[StateManager.init]',
			level: 'debug'
		});

		await this.#saveState();
	}

	addPaletteToHistory(palette: Palette): void {
		return this.#errors.handleSync(
			() => {
				this.#trackAction();
				this.#state.paletteHistory.push(palette);
				this.#saveStateAndLog('paletteHistory', 3);
			},
			'Failed to add palette to history',
			{ context: { palette } }
		);
	}

	async atomicUpdate(callback: (state: State) => void): Promise<void> {
		return this.#errors.handleAsync(async () => {
			return await this.#stateLock.runExclusive(async () => {
				callback(this.#observer['data']);
				this.#log('Performed atomic update.', {
					caller: '[StateManager.atomicUpdate]',
					level: 'debug'
				});
				await this.#saveState();
			});
		}, 'Failed to perform atomic update.');
	}

	async batchUpdate(
		callback: (state: State) => Partial<State>
	): Promise<void> {
		await this.#errors.handleAsync(async () => {
			await this.#withWriteLock(async () => {
				const partialUpdate = callback(this.#state);

				this.#observer.batchUpdate(partialUpdate);

				this.#log('Performed batch update.', {
					caller: '[StateManager.batchUpdate]',
					level: 'debug',
					verbosity: 2
				});

				await this.#saveState();
			});
		}, '[STATEMANAGER]: Failed to perform batch update.');
	}

	async ensureStateReady(): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				let attempts = 0;

				while (!this.#state || !this.#state.paletteContainer) {
					if (attempts++ >= maxReadyAttempts) {
						this.#log('State initialization timed out.', {
							caller: '[StateManager.ensureStateReady]',
							level: 'error'
						});
						throw new Error('State initialization timed out.');
					}

					this.#log(
						`Waiting for state to initialize... (Attempt ${attempts})`,
						{
							caller: '[StateManager.ensureStateReady]',
							level: 'debug',
							verbosity: 3
						}
					);

					await new Promise(resolve => setTimeout(resolve, 50));
				}

				this.#log('State is now initialized.', {
					caller: '[StateManager.ensureStateReady]'
				});
			},
			'Failed to ensure state readiness',
			{ context: { maxReadyAttempts } }
		);
	}

	async getState(): Promise<State> {
		return await (this.#errors.handleAsync(async () => {
			return this.#withReadLock(() => {
				if (!this.#state)
					this.#log('State accessed before initialization.', {
						caller: '[StateManager.getState]',
						level: 'warn'
					});

				if (!this.#state.preferences) {
					this.#log(
						'State.preferences is undefined. Setting as default.',
						{
							caller: '[StateManager.getState]',
							level: 'warn'
						}
					);

					this.#state.preferences = defaultState.preferences;
				}

				return this.#helpers.data.clone(this.#state);
			});
		}, 'Error retrieving state') ?? defaultState);
	}

	async loadState(): Promise<State> {
		return this.#errors.handleAsync(async () => {
			this.#log('Attempting to load state...', {
				caller: '[StateManager.loadState]',
				level: 'debug'
			});
			const storedState = await this.#storage.getItem<State>('appState');

			if (storedState) {
				this.#state = storedState;
				this.#log('Loaded stored state', {
					caller: '[StateManager.loadState]',
					level: 'debug'
				});
				this.#onStateLoadCallback?.();
				return storedState;
			}

			this.#log('No stored state found. Generating initial state.', {
				caller: '[StateManager.loadState]',
				level: 'warn'
			});
			return this.#generateInitialState();
		}, 'Failed to load state');
	}

	logContentionStats(): void {
		this.#errors.handleSync(() => {
			const contentionCount = this.#stateLock.getContentionCount();
			const contentionRate = this.#stateLock.getContentionRate();

			this.#log(
				`Current contention count: ${contentionCount}.\nCurrent contention rate: ${contentionRate}.`,
				{
					caller: '[StateManager.logContentionStats]',
					level: 'debug'
				}
			);
		}, 'Failed to log contention stats');
	}

	redo(): void {
		return this.#errors.handleSync(
			() => {
				if (this.#undoStack.length > 0) {
					const redoState = this.#undoStack.pop();
					if (!redoState) {
						this.#log('Cannot redo: No redoState found.', {
							caller: '[StateManager.redo]',
							level: 'warn'
						});
						return;
					}

					this.#history.push(redoState);
					this.#state = { ...redoState };

					this.#log('Redo action performed.', {
						caller: '[StateManager.redo]',
						level: 'debug'
					});
					this.#saveStateAndLog('redo', 3);
				} else {
					throw new Error('No state to redo.');
				}
			},
			'Redo operation failed',
			{ fallback: { redo: null } }
		);
	}

	async resetState(): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				this.#trackAction();
				this.#state = defaultState;
				await this.#saveState();
				this.#log('App state has been reset', {
					caller: '[StateManager.resetState]',
					level: 'debug'
				});
			},
			'Failed to reset state',
			{ fallback: defaultState }
		);
	}

	setOnStateLoad(callback: () => void): void {
		return this.#errors.handleSync(() => {
			this.#onStateLoadCallback = callback;
		}, 'Failed to set onStateLoad callback');
	}

	async setState(newState: State, track: boolean = true): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				return await this.#withWriteLock(async () => {
					if (track) this.#trackAction();

					this.#observer.batchUpdate(newState);

					this.#state = newState;

					this.#log('State updated.', {
						caller: '[StateManager.setState]',
						level: 'debug',
						verbosity: 2
					});

					await this.#saveState();

					this.logContentionStats();
				});
			},
			'Failed to set state',
			{ context: { newState, track } }
		);
	}

	undo(): void {
		this.#errors.handleSync(() => {
			if (this.#history.length <= 1) {
				this.#log('No previous state to revert to.', {
					caller: '[StateManager.undo]',
					level: 'warn'
				});
				return;
			}

			const previousState = this.#history.pop();
			if (!previousState) return;

			this.#undoStack.push(this.#helpers.data.clone(this.#state)); // for redo

			this.#state = previousState;
			this.#observer.batchUpdate(previousState);

			this.#log('Undo action performed.', {
				caller: '[StateManager.undo]',
				level: 'debug'
			});
			this.#saveStateAndLog('undo', 3);
		}, 'Undo operation failed');
	}

	updateAppModeState(appMode: State['appMode'], track: boolean): void {
		return this.#errors.handleSync(
			() => {
				if (track) this.#trackAction();

				this.#state.appMode = appMode;

				this.#log(`Updated appMode: ${appMode}`, {
					caller: '[StateManager.updateAppModeState]',
					level: 'debug'
				});

				this.#saveStateAndLog('appMode', 3);
			},
			'Failed to update app mode state',
			{ context: { appMode, track } }
		);
	}

	async updateLockedProperty<K extends keyof State>(
		key: K,
		value: State[K]
	): Promise<void> {
		return this.#errors.handleAsync(
			async () => {
				const lock = this.#getLockForKey(key);

				await lock.runExclusive(async () => {
					this.#observer.set(key, value);

					this.#log(
						`Updated ${String(this.#helpers.data.clone(key))} with locked property`,
						{
							caller: '[StateManager.updateLockedProperty]',
							level: 'debug'
						}
					);

					await this.#saveState();

					this.logContentionStats();
				});
			},
			'Failed to update locked property',
			{ context: { key, value } }
		);
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
						'updatePaletteColumns() called before state initialization.'
					);
				}

				if (
					!this.#helpers.dom.getElement<HTMLDivElement>(
						domIndex.ids.divs.paletteContainer
					)
				) {
					this.#log('Palette Container not found in the DOM.', {
						caller: '[StateManager.updatePaletteColumns]',
						level: 'warn'
					});
				}

				if (track) this.#trackAction();

				this.#state.paletteContainer.columns = columns;

				this.#log(`Updated paletteContainer columns`, {
					caller: '[StateManager.updatePaletteColumns]',
					level: 'debug'
				});
				this.#saveStateAndLog('paletteColumns', verbosity);
				this.logContentionStats();
			},
			'Failed to update palette columns',
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
					caller: '[StateManager.updatePaletteColumnSize]',
					level: 'debug'
				});

				this.#saveStateAndLog('paletteColumnSize', 3);

				this.logContentionStats();
			},
			'Failed to update palette column size',
			{ context: { columnID, newSize } }
		);
	}

	updatePaletteHistory(updatedHistory: Palette[]): void {
		return this.#errors.handleSync(
			() => {
				this.#trackAction();

				this.#state.paletteHistory = updatedHistory;

				this.#saveState();

				this.#log('Updated palette history', {
					caller: '[StateManager.updatePaletteHistory]',
					level: 'debug'
				});

				this.logContentionStats();
			},
			'Failed to update palette history',
			{ context: { updatedHistory } }
		);
	}

	updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): void {
		return this.#errors.handleSync(
			() => {
				if (track) this.#trackAction();

				this.#observer.set('selections', {
					...this.#observer.get('selections'),
					...selections
				});

				this.#log(`Updated selections`, {
					caller: '[StateManager.updateSelections]',
					level: 'debug'
				});

				this.#saveStateAndLog('selections', 2);

				this.logContentionStats();
			},
			'Failed to update selections',
			{ context: { selections, track } }
		);
	}

	#generateInitialState(): State {
		return (
			this.#errors.handleSync(() => {
				this.#log('Generating initial state.', {
					caller: '[StateManager.#generateInitialState]',
					level: 'debug'
				});

				const columns = this.#utils.dom.scanPaletteColumns() ?? [];

				if (!columns) {
					this.#log('No palette columns found!', {
						caller: '[StateManager.#generateInitialState]',
						level: 'error'
					});
				}

				this.#log(`Scanned palette columns.`, {
					caller: '[StateManager.#generateInitialState]',
					level: 'debug'
				});

				this.logContentionStats();

				return {
					appMode: 'edit',
					paletteContainer: { columns },
					paletteHistory: [],
					preferences: {
						colorSpace: 'hsl',
						distributionType: 'soft',
						maxHistory: 20,
						maxPaletteHistory: 10,
						theme: 'light'
					},
					selections: {
						paletteColumnCount: columns.length,
						paletteType: 'complementary',
						targetedColumnPosition: 1
					},
					timestamp: this.#helpers.data.getFormattedTimestamp()
				};
			}, '[StateManager]: Failed to generate initial state') ??
			({} as State)
		);
	}

	#getLockForKey(key: keyof State): Mutex {
		if (!this.#dataLocks.has(key)) {
			this.#dataLocks.set(key, new Mutex(this.#errors, this.#log));
		}

		return this.#dataLocks.get(key)!;
	}

	#saveStateAndLog(property: string, verbosity?: number): void {
		this.#log(`StateManager Updated ${property}`, {
			caller: '[StateManager.#saveStateAndLog]',
			verbosity: verbosity ?? 0
		});
		this.#saveState();
	}

	async #saveState(throttle: boolean = true): Promise<void> {
		const saveOperation = async (attempts = 0): Promise<void> => {
			try {
				await this.#storage.setItem('appState', this.#state);
				this.#log('State saved to storage.', {
					caller: '[StateManager.#saveState]',
					level: 'debug'
				});
			} catch (err) {
				if (attempts < env.state.maxSaveRetries) {
					this.#log(
						`Save attempt ${attempts + 1} failed. Retrying...`,
						{
							caller: '[StateManager.#saveState]',
							level: 'warn'
						}
					);
					await saveOperation(attempts + 1);
				} else {
					this.#log('Max save attempts reached. Save failed.', {
						caller: '[StateManager.#saveState]',
						level: 'error'
					});
				}
			}
		};

		if (throttle) {
			if (this.#saveThrottleTimer) clearTimeout(this.#saveThrottleTimer);

			this.#saveThrottleTimer = setTimeout(
				() => saveOperation(),
				env.state.saveThrottleDelay
			);
		} else {
			await saveOperation();
		}
	}

	// push a copy of the current state before making changes
	#trackAction(): void {
		return this.#errors.handleSync(() => {
			const clonedState = this.#helpers.data.clone(this.#state);

			this.#history.push(clonedState);

			if (this.#history.length > env.app.historyLimit)
				this.#history.shift();
		}, 'Failed to track action');
	}

	async withPropertyLock<K extends keyof State, T>(
		key: K,
		callback: (stateProperty: State[K]) => Promise<T>
	): Promise<T> {
		return this.#errors.handleAsync(
			async () => {
				const lock = this.#getLockForKey(key);
				const acquired = await lock.acquireWriteWithTimeout(
					env.mutex.timeout
				);

				if (!acquired) {
					this.#log(
						`Lock acquisition timed out for property: ${String(key)}`,
						{
							caller: '[StateManager.withPropertyLock]',
							level: 'warn'
						}
					);
					throw new Error(
						`Timeout acquiring lock for property ${String(key)}.`
					);
				}

				try {
					return await callback(this.#state[key]);
				} finally {
					await lock.release();
				}
			},
			'Failed to acquire property lock',
			{ context: { key } }
		);
	}

	async #withReadLock<T>(callback: () => T): Promise<T> {
		return this.#errors.handleAsync(async () => {
			const acquired = await this.#stateLock.acquireReadWithTimeout(
				env.mutex.timeout
			);
			if (!acquired) throw new Error('Read lock acquisition timed out.');

			try {
				return callback();
			} finally {
				await this.#stateLock.release();
			}
		}, '[StateManager]: Failed to acquire read lock');
	}

	async #withWriteLock<T>(callback: () => Promise<T>): Promise<T> {
		return this.#errors.handleAsync(async () => {
			const acquired = await this.#stateLock.acquireWriteWithTimeout(
				env.mutex.timeout
			);

			if (!acquired) throw new Error('Write lock acquisition timed out.');

			try {
				return await callback();
			} finally {
				await this.#stateLock.release();
			}
		}, '[StateManager]: Failed to acquire write lock');
	}
}
