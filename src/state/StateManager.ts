// File: state/StateManager.js

import {
	History,
	Palette,
	ServicesInterface,
	State,
	StateManagerInterface,
	UtilitiesInterface
} from '../types/index.js';
import { StorageManager } from '../storage/StorageManager.js';
import { config } from '../config/index.js';

const defaultState = config.defaults.state;

export class StateManager implements StateManagerInterface {
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
		this.log('Initializing State Manager', 'debug');

		await this.storage.init();

		this.state =
			(await this.errors.handleAsync(
				() => this.loadState(),
				'Failed to load state. Generating initial state.'
			)) ?? this.generateInitialState();

		this.log('StateManager initialized successfully.', 'debug');

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
			{ palette }
		);
	}

	public async ensureStateReady(): Promise<void> {
		let attempts = 0;
		const maxAttempts = 20; // prevent infinite loop

		while (!this.state || !this.state.paletteContainer) {
			if (attempts++ >= maxAttempts) {
				this.log('State initialization timed out.', 'error');
				break;
			}

			this.log(
				`Waiting for state to initialize... (Attempt ${attempts})`,
				'debug',
				3
			);
			await new Promise(resolve => setTimeout(resolve, 50));
		}

		this.log('State is now initialized.');
	}

	public getState(): State {
		return (
			this.errors.handle(() => {
				if (!this.state) {
					throw new Error('State accessed before initialization.');
				}
				if (!this.state.preferences) {
					this.log(
						'State.preferences is undefined. Adding default preferences.',
						'warn'
					);
					this.state.preferences = defaultState.preferences;
				}
				return this.state;
			}, 'Error retrieving state') ?? defaultState
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
			this.log('No stored state found.', 'warn');
			return this.generateInitialState();
		}
	}

	public redo(): void {
		this.errors.handle(() => {
			if (this.undoStack.length > 0) {
				const redoState = this.undoStack.pop();
				if (!redoState) {
					this.log('Cannot redo: No redoState found.', 'debug');
					return;
				}

				this.history.push(redoState);
				this.state = { ...redoState };

				this.log('Redo action performed.', 'debug');
				this.saveStateAndLog('redo', 3);
			} else {
				throw new Error('No state to redo.');
			}
		}, 'Redo operation failed');
	}

	public async resetState(): Promise<void> {
		await this.errors.handleAsync(async () => {
			this.trackAction();
			this.state = defaultState;
			await this.saveState();
			this.log('App state has been reset', 'debug');
		}, 'Failed to reset state');
	}

	public setOnStateLoad(callback: () => void): void {
		this.errors.handle(() => {
			this.onStateLoadCallback = callback;
		}, 'Failed to set onStateLoad callback');
	}

	public async setState(state: State, track: boolean): Promise<void> {
		if (track) this.trackAction();
		this.state = state;
		this.log('App state has been updated', 'debug');
		await this.saveState();
	}

	public undo(): void {
		this.errors.handle(() => {
			if (this.history.length < 1) {
				throw new Error('No previous state to revert to.');
			}
			this.trackAction();
			this.undoStack.push(this.history.pop() as State);
			this.state = { ...this.history[this.history.length - 1] };
			this.log('Undo action performed.', 'debug');
			this.saveStateAndLog('undo', 3);
		}, 'Undo operation failed');
	}

	public updateAppModeState(appMode: State['appMode'], track: boolean): void {
		this.errors.handle(
			() => {
				if (track) this.trackAction();
				this.state.appMode = appMode;
				this.log(`Updated appMode: ${appMode}`);
				this.saveStateAndLog('appMode', 3);
			},
			'Failed to update app mode state',
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
						config.dom.ids.divs.paletteContainer
					)
				) {
					this.log('Palette Container not found in the DOM.', 'warn');
				}

				if (track) this.trackAction();
				this.state.paletteContainer.columns = columns;
				this.log(`Updated paletteContainer columns`, 'debug');
				this.saveStateAndLog('paletteColumns', verbosity);
			},
			'Failed to update palette columns',
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

				const minSize = config.env.ui.minColumnSize;
				const maxSize = config.env.ui.maxColumnSize;
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

				this.log(`Updated column size`, 'debug');
				this.saveStateAndLog('paletteColumnSize', 3);
			},
			'Failed to update palette column size',
			{ columnID, newSize }
		);
	}

	public updatePaletteHistory(updatedHistory: Palette[]): void {
		this.errors.handle(
			() => {
				this.trackAction();
				this.state.paletteHistory = updatedHistory;
				this.saveState();
				this.log('Updated palette history');
			},
			'Failed to update palette history',
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
				this.log(`Updated selections`, 'debug');
				this.saveStateAndLog('selections', 2);
			},
			'Failed to update selections',
			{ selections, track }
		);
	}

	private generateInitialState(): State {
		return (
			this.errors.handle(() => {
				const columnData = this.utils.dom.scanPaletteColumns();
				this.log(
					`Scanned ${columnData.length} columns in Palette Container element`,
					'debug'
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
			}, 'Failed to generate initial state') ?? defaultState
		);
	}

	private saveStateAndLog(property: string, verbosity?: number): void {
		this.log(`StateManager Updated ${property}`, 'debug', verbosity);
		this.saveState();
	}

	private async saveState(): Promise<void> {
		await this.errors.handleAsync(
			() => this.storage.setItem('appState', this.state),
			'Failed to save app state.'
		);
	}

	private trackAction(): void {
		// push a copy of the current state before making changes
		this.history.push({ ...this.state });
	}
}
