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
import { DataObserver } from '../common/services/DataObserver.js';
import { Semaphore } from '../common/services/Semaphore.js';
import { StorageManager } from '../storage/StorageManager.js';
import { defaults, domConfig, domIndex } from '../config/index.js';

const defaultState = defaults.state;
const maxStateReadyAttempts = 20;

export class StateManager implements StateManagerInterface {
	static #instance: StateManager | null = null;
	#onStateLoadCallback: (() => void) | null = null;
	#history: History;
	#state: State;
	#undoStack: History;
	#log: Services['log'];
	#errors: Services['errors'];
	#helpers: Helpers;
	#observer: DataObserver<State>;
	#utils: Utilities;
	#stateLock: Semaphore;
	#storage: StorageManager;

	private constructor(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	) {
		this.#log = services.log;
		this.#errors = services.errors;
		this.#helpers = helpers;
		this.#utils = utils;
		this.#storage = new StorageManager(services);

		this.#state = {} as State;
		this.#observer = new DataObserver<State>(
			this.#state,
			{ delay: 50 },
			this.#helpers
		);
		this.#observer.on('paletteHistory', (newVal, oldVal) => {
			this.#log(`paletteHistory updated.\nNew Value: ${JSON.stringify(newVal)}. `, {
				caller: '[StateManager #observer]',
				level: 'debug'
			});
		});
		this.#observer.on('appMode', newVal => {
			this.#log(`App mode canged to ${newVal}`, {
				caller: '[StateManager]',
				level: 'debug'
			});
		});
		this.#state.paletteHistory = [];
		this.#history = [this.#state];
		this.#stateLock = new Semaphore(services.errors, services.log);
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

	async ensureStateReady(): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				let attempts = 0;

				while (!this.#state || !this.#state.paletteContainer) {
					if (attempts++ >= maxStateReadyAttempts) {
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
			{ context: { maxStateReadyAttempts } }
		);
	}

	getState(): State {
		return (
			this.#errors.handleSync(() => {
				if (!this.#state) {
					throw new Error('State accessed before initialization.');
				}
				if (!this.#state.preferences) {
					this.#log(
						'State.preferences is undefined. Adding default preferences.',
						{
							caller: '[StateManager.getState]',
							level: 'warn'
						}
					);
					this.#state.preferences = defaultState.preferences;
				}
				return this.#state;
			}, 'Error retrieving state') ?? defaultState
		);
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

	async setState(state: State, track: boolean): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				this.#stateLock.acquire();
				try {
					if (track) this.#trackAction();
					this.#state = state;
					this.#log('App state has been updated', {
						caller: '[StateManager.setState]',
						level: 'debug'
					});
					await this.#saveState();
				} finally {
					this.#stateLock.release();
				}
			},
			'Failed to set state',
			{ context: { state, track } }
		);
	}

	undo(): void {
		return this.#errors.handleSync(
			() => {
				if (this.#history.length < 1) {
					throw new Error('No previous state to revert to.');
				}
				this.#trackAction();
				this.#undoStack.push(this.#history.pop() as State);
				this.#state = { ...this.#history[this.#history.length - 1] };
				this.#log('Undo action performed.', {
					caller: '[StateManager.undo]',
					level: 'debug'
				});
				this.#saveStateAndLog('undo', 3);
			},
			'Undo operation failed',
			{ fallback: { undo: null } }
		);
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
				this.#state.selections = {
					...this.#state.selections,
					...selections
				};
				this.#log(`Updated selections`, {
					caller: '[StateManager.updateSelections]',
					level: 'debug'
				});
				this.#saveStateAndLog('selections', 2);
			},
			'Failed to update selections',
			{ context: { selections, track } }
		);
	}

	#generateInitialState(): State {
		return (
			this.#errors.handleSync(() => {
				this.#log(
					'[StateManager.#generateInitialState] Generating initial state...',
					{
						caller: '[StateManager.#generateInitialState]',
						level: 'debug'
					}
				);
				const columnData = this.#utils.dom.scanPaletteColumns();
				if (!columnData || columnData.length === 0) {
					this.#log('No palette columns found!', {
						caller: '[StateManager.#generateInitialState]',
						level: 'error'
					});
				}
				this.#log(
					`Scanned ${columnData!.length} columns in Palette Container element`,
					{
						caller: '[StateManager.#generateInitialState]',
						level: 'debug'
					}
				);
				return {
					appMode: 'edit',
					paletteContainer: { columns: columnData ?? [] },
					paletteHistory: [],
					preferences: {
						colorSpace: 'hsl',
						distributionType: 'soft',
						maxHistory: 20,
						maxPaletteHistory: 10,
						theme: 'light'
					},
					selections: {
						paletteColumnCount: columnData!.length ?? 0,
						paletteType: 'complementary',
						targetedColumnPosition: 1
					},
					timestamp: this.#helpers.data.getFormattedTimestamp()
				};
			}, 'Failed to generate initial state') ?? ({} as State)
		);
	}

	#saveStateAndLog(property: string, verbosity?: number): void {
		this.#log(`StateManager Updated ${property}`, {
			caller: '[StateManager.#saveStateAndLog]',
			verbosity: verbosity ?? 0
		});
		this.#saveState();
	}

	async #saveState(): Promise<void> {
		return await this.#errors.handleAsync(
			() => this.#storage.setItem('appState', this.#state),
			'Failed to save app state.'
		);
	}

	#trackAction(): void {
		// push a copy of the current state before making changes
		this.#history.push({ ...this.#state });
	}
}
