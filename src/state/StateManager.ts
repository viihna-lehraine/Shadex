// File: state/StateManager.js

import {
	History,
	Palette,
	ServicesInterface,
	State,
	StateManagerClassInterface,
	UtilitiesInterface
} from '../types/index.js';
import { StorageManager } from '../storage/StorageManager.js';
import { data } from '../data/index.js';

const defaultState = data.defaults.state;

export class StateManager implements StateManagerClassInterface {
	private static instance: StateManager | null = null;
	private onStateLoadCallback: (() => void) | null = null;
	private history: History;
	private state: State;
	private undoStack: History;
	private log: ServicesInterface['log'];
	private errors: ServicesInterface['errors'];
	private utils: UtilitiesInterface;
	private storage: StorageManager;

	private constructor(
		services: ServicesInterface,
		utils: UtilitiesInterface
	) {
		this.log = services.log;
		this.errors = services.errors;
		this.utils = utils;
		this.storage = new StorageManager(services);

		this.state = {} as State;
		this.state.paletteHistory = [];
		this.history = [this.state];
		this.undoStack = [];
		this.init();
		this.saveStateAndLog('init', 3);
	}

	public static getInstance(
		services: ServicesInterface,
		utils: UtilitiesInterface
	): StateManager {
		if (!StateManager.instance) {
			StateManager.instance = new StateManager(services, utils);
		}

		return StateManager.instance;
	}

	public async init(): Promise<void> {
		this.log(
			'debug',
			'Initializing State Manager',
			'StateManager.init()',
			2
		);

		await this.storage.init();

		this.state =
			(await this.errors.handleAsync(
				() => this.loadState(),
				'Failed to load state. Generating initial state.',
				'StateManager.init()'
			)) ?? this.generateInitialState();

		this.log(
			'info',
			'StateManager initialized successfully.',
			'StateManager.init()',
			2
		);

		await this.saveState();
	}

	public addPaletteToHistory(palette: Palette): void {
		this.errors.handle(
			() => {
				this.trackAction();
				this.state.paletteHistory.push(palette);
				this.saveStateAndLog('paletteHistory', 3);
			},
			'Failed to add palette to history',
			'StateManager.addPaletteToHistory()',
			{ palette }
		);
	}

	public async ensureStateReady(): Promise<void> {
		let attempts = 0;
		const maxAttempts = 20; // prevent infinite loop

		while (!this.state || !this.state.paletteContainer) {
			if (attempts++ >= maxAttempts) {
				this.log(
					'error',
					'State initialization timed out.',
					'StateManager.ensureStateReady()'
				);
				break;
			}

			this.log(
				'warn',
				`Waiting for state to initialize... (Attempt ${attempts})`,
				'StateManager.ensureStateReady()'
			);
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		this.log(
			'info',
			'State is now initialized.',
			'StateManager.ensureStateReady()'
		);
	}

	public getState(): State {
		return (
			this.errors.handle(
				() => {
					if (!this.state) {
						throw new Error(
							'State accessed before initialization.'
						);
					}
					if (!this.state.preferences) {
						this.log(
							'warn',
							'State.preferences is undefined. Adding default preferences.',
							'StateManager.getState()'
						);
						this.state.preferences = defaultState.preferences;
					}
					return this.state;
				},
				'Error retrieving state',
				'StateManager.getState()',
				{},
				'error'
			) ?? defaultState
		);
	}

	public async loadState(): Promise<State> {
		const storedState = await this.storage.getItem<State>('appState');

		if (storedState) {
			this.state = storedState;

			if (this.onStateLoadCallback) {
				this.onStateLoadCallback();
			}

			return storedState;
		} else {
			this.log(
				'warn',
				'No stored state found.',
				'StateManager.loadState()',
				3
			);
			return this.generateInitialState();
		}
	}

	public redo(): void {
		this.errors.handle(
			() => {
				if (this.undoStack.length > 0) {
					const redoState = this.undoStack.pop();
					if (!redoState) throw new Error('No state to redo.');

					this.history.push(redoState);
					this.state = { ...redoState };

					this.log(
						'info',
						'Redo action performed.',
						'StateManager.redo()',
						3
					);
					this.saveStateAndLog('redo', 3);
				} else {
					throw new Error('No state to redo.');
				}
			},
			'Redo operation failed',
			'StateManager.redo()'
		);
	}

	public async resetState(): Promise<void> {
		await this.errors.handleAsync(
			async () => {
				this.trackAction();
				this.state = defaultState;
				await this.saveState();
				this.log(
					'info',
					'App state has been reset',
					'StateManager.resetState()',
					3
				);
			},
			'Failed to reset state',
			'StateManager.resetState()'
		);
	}

	public setOnStateLoad(callback: () => void): void {
		this.errors.handle(
			() => {
				this.onStateLoadCallback = callback;
			},
			'Failed to set onStateLoad callback',
			'StateManager.setOnStateLoad()'
		);
	}

	public async setState(state: State, track: boolean): Promise<void> {
		if (track) this.trackAction();
		this.state = state;
		this.log(
			'info',
			'App state has been updated',
			'StateManager.setState()',
			1
		);
		await this.saveState();
	}

	public undo(): void {
		this.errors.handle(
			() => {
				if (this.history.length < 1) {
					throw new Error('No previous state to revert to.');
				}
				this.trackAction();
				this.undoStack.push(this.history.pop() as State);
				this.state = { ...this.history[this.history.length - 1] };

				this.log(
					'info',
					'Undo action performed.',
					'StateManager.undo()',
					3
				);
				this.saveStateAndLog('undo', 3);
			},
			'Undo operation failed',
			'StateManager.undo()'
		);
	}

	public updateAppModeState(appMode: State['appMode'], track: boolean): void {
		this.errors.handle(
			() => {
				if (track) this.trackAction();
				this.state.appMode = appMode;
				this.log(
					'info',
					`Updated appMode: ${appMode}`,
					'StateManager.updateAppMode()',
					1
				);
				this.saveStateAndLog('appMode', 3);
			},
			'Failed to update app mode state',
			'StateManager.updateAppModeState()',
			{ appMode, track }
		);
	}

	public updatePaletteColumns(
		columns: State['paletteContainer']['columns'],
		track: boolean,
		verbosity: number
	): void {
		this.errors.handle(
			() => {
				if (!this.state || !this.state.paletteContainer) {
					throw new Error(
						'updatePaletteColumns() called before state initialization.'
					);
				}

				if (
					!this.utils.core.getElement<HTMLDivElement>(
						data.dom.ids.divs.paletteContainer
					)
				) {
					this.log(
						'warn',
						'Palette Container not found in the DOM.',
						'StateManager.updatePaletteColumns()',
						3
					);
				}

				if (track) this.trackAction();
				this.state.paletteContainer.columns = columns;
				this.log(
					'info',
					`Updated paletteContainer columns`,
					'StateManager.updatePaletteColumns()',
					1
				);
				this.saveStateAndLog('paletteColumns', verbosity);
			},
			'Failed to update palette columns',
			'StateManager.updatePaletteColumns()',
			{ columns, track, verbosity }
		);
	}

	public updatePaletteColumnSize(columnID: number, newSize: number): void {
		this.errors.handle(
			() => {
				const columns = this.state.paletteContainer.columns;
				const columnIndex = columns.findIndex(
					col => col.id === columnID
				);
				if (columnIndex === -1) return;

				const minSize = data.config.ui.minColumnSize;
				const maxSize = data.config.ui.maxColumnSize;
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

				this.log(
					'info',
					`Updated column size`,
					'StateManager.updatePaletteColumnSize()',
					1
				);
				this.saveStateAndLog('paletteColumnSize', 3);
			},
			'Failed to update palette column size',
			'StateManager.updatePaletteColumnSize()',
			{ columnID, newSize }
		);
	}

	public updatePaletteHistory(updatedHistory: Palette[]): void {
		this.errors.handle(
			() => {
				this.trackAction();
				this.state.paletteHistory = updatedHistory;
				this.saveState();
				this.log(
					'info',
					'Updated palette history',
					'StateManager.updatePaletteHistory()',
					3
				);
			},
			'Failed to update palette history',
			'StateManager.updatePaletteHistory()',
			{ updatedHistory }
		);
	}

	public updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): void {
		this.errors.handle(
			() => {
				if (track) this.trackAction();
				this.state.selections = {
					...this.state.selections,
					...selections
				};
				this.log(
					'info',
					`Updated selections`,
					'StateManager.updateSelections()',
					1
				);
				this.saveStateAndLog('selections', 2);
			},
			'Failed to update selections',
			'StateManager.updateSelections()',
			{ selections, track }
		);
	}

	private generateInitialState(): State {
		return (
			this.errors.handle(
				() => {
					const columnData = this.utils.dom.scanPaletteColumns();
					this.log(
						'info',
						`Scanned ${columnData.length} columns in Palette Container element`,
						'StateManager.generateInitialState()',
						2
					);
					return {
						appMode: 'edit',
						paletteContainer: { columns: columnData || [] },
						paletteHistory: [],
						preferences: {
							colorSpace: 'hsl',
							distributionType: 'soft',
							maxHistory: 20,
							maxPaletteHistory: 10,
							theme: 'light'
						},
						selections: {
							paletteColumnCount: columnData.length,
							paletteType: 'complementary',
							targetedColumnPosition: 1
						},
						timestamp: this.utils.app.getFormattedTimestamp()
					};
				},
				'Failed to generate initial state',
				'StateManager.generateInitialState()'
			) ?? defaultState
		);
	}

	private saveStateAndLog(property: string, verbosity: number): void {
		this.log(
			'info',
			`Updated ${property}`,
			`StateManager.update${property}()`,
			verbosity
		);
		this.saveState();
	}

	private async saveState(): Promise<void> {
		await this.errors.handleAsync(
			() => this.storage.setItem('appState', this.state),
			'Failed to save app state.',
			'StateManager.saveState()'
		);
	}

	private trackAction(): void {
		// push a copy of the current state before making changes
		this.history.push({ ...this.state });
	}
}
