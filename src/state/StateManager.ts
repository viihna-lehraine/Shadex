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
	private history: History;
	private state: State;
	private undoStack: History;
	private log: ServicesInterface['log'];
	private utils: UtilitiesInterface;
	private storage: StorageManager;

	private constructor(
		services: ServicesInterface,
		utils: UtilitiesInterface
	) {
		this.log = services.log;
		this.log(
			'debug',
			'Initializing State Manager',
			'StateManager.constructor()',
			2
		);
		this.utils = utils;

		this.storage = new StorageManager(services);
		this.storage.init();

		this.state = {} as State;
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

	public addPaletteToHistory(palette: Palette): void {
		this.trackAction();
		this.state.paletteHistory.push(palette);
		this.saveStateAndLog('paletteHistory', 3);
	}

	public getState(): State {
		this.log(
			'debug',
			`Retrieving state: ${this.state}`,
			'StateManager.getState()',
			2
		);
		return this.state;
	}

	public resetState(): void {
		this.trackAction();
		this.state = defaultState;
		this.saveState();
		this.log(
			'info',
			'App state has been reset',
			'StateManager.resetState()',
			3
		);
	}

	public redo(): void {
		if (this.undoStack.length > 0) {
			// pop the last undone state from undoStack
			const redoState = this.undoStack.pop();

			if (!redoState || redoState === undefined) {
				this.log('warn', 'No state to redo.', 'StateManager.redo()', 3);
				return;
			}

			// push it back to history
			this.history.push(redoState);
			this.state = { ...redoState! };

			this.log(
				'info',
				'Redo action performed.',
				'StateManager.redo()',
				3
			);
			this.saveStateAndLog('redo', 3);
		} else {
			this.log('warn', 'No state to redo.', 'StateManager.redo()', 3);
		}
	}

	public setState(state: State, track: boolean): void {
		if (track) this.trackAction();
		this.state = state;

		this.log(
			'info',
			'App state has been updated',
			'StateManager.setState()',
			1
		);
	}

	private trackAction(): void {
		// push a copy of the current state before making changes
		this.history.push(JSON.parse(JSON.stringify(this.state)));
	}

	public undo(): void {
		// ensure there's at least 1 previous state
		if (this.history.length >= 1) {
			this.trackAction();
			// remove current state from history
			this.undoStack.push(this.history.pop() as State);
			// get previous state
			const previousState = this.history[this.history.length - 1];

			// restore previous state without merging
			this.state = { ...previousState };

			this.log(
				'info',
				'App State undo action prformed.',
				'StateManager.undo()',
				3
			);
			this.saveStateAndLog('undo', 3);
		} else {
			this.log(
				'warn',
				'Cannot perform Undo action. No previous state to revert to.',
				'StateManager.undo()',
				3
			);
		}
	}

	public updateAppModeState(appMode: State['appMode'], track: boolean): void {
		if (track) this.trackAction();
		this.state.appMode = appMode;
		this.log(
			'info',
			`Updated appMode: ${appMode}`,
			'StateManager.updateAppMode()',
			1
		);
		this.saveStateAndLog('appMode', 3);
	}

	public updatePaletteColumns(
		columns: State['paletteContainer']['columns'],
		track: boolean,
		verbosity: number
	): void {
		if (!this.state || !this.state.paletteContainer) {
			this.log(
				`error`,
				`updatePaletteColumns() called before state initialization.`,
				`StateManager.updatePaletteColumns()`,
				3
			);
			return;
		}
		if (
			!this.utils.core.getElement<HTMLDivElement>(
				data.dom.ids.divs.paletteContainer
			)
		) {
			this.log(
				`warn`,
				`Palette Container not found in the DOM.`,
				`StateManager.updatePaletteColumns()`,
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
	}

	public updatePaletteColumnSize(columnID: number, newSize: number): void {
		const columns = this.state.paletteContainer.columns;
		const columnIndex = columns.findIndex(col => col.id === columnID);

		if (columnIndex === -1) return; // column not found

		// ensure the new size isn't negative or too large
		const minSize = data.config.ui.minColumnSize; // minimum width in %
		const maxSize = data.config.ui.maxColumnSize; // maximum width in %
		const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));

		// determine how much space was added or removed
		const sizeDifference = adjustedSize - columns[columnIndex].size;
		columns[columnIndex].size = adjustedSize;

		// distribute the size difference across other unlocked columns
		const unlockedColumns = columns.filter(
			(col, index) => index !== columnIndex && !col.isLocked
		);
		const distributionAmount = sizeDifference / unlockedColumns.length;

		unlockedColumns.forEach(col => {
			col.size -= distributionAmount;
		});

		// ensure the total width remains at 100%
		const finalTotalSize = columns.reduce((sum, col) => sum + col.size, 0);
		const correctionFactor = 100 / finalTotalSize;
		columns.forEach(col => (col.size *= correctionFactor));

		this.log(
			'info',
			`Updated column size`,
			'StateManager.updatePaletteColumnSize()',
			1
		);
		this.saveStateAndLog('paletteColumnSize', 3);
	}

	public updatePaletteHistory(updatedHistory: Palette[]): void {
		this.trackAction();
		this.state.paletteHistory = updatedHistory;
		this.saveState();
		this.log(
			'info',
			'Updated palette history',
			'StateManager.updatePaletteHistory()',
			3
		);
	}

	public updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): void {
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
	}

	private generateInitialState(): State {
		const columnData = this.utils.dom.scanPaletteColumns();

		this.log(
			`info`,
			`Scanned ${columnData.length} columns in Palette Container element`,
			'StateManager.generateInitialState()',
			2
		);

		return {
			appMode: 'edit',
			paletteContainer: {
				columns: columnData || []
			},
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
	}

	private async init(): Promise<void> {
		const storedState = await this.loadState();
		if (storedState && storedState.paletteContainer) {
			this.state = storedState;
			this.log(
				'info',
				'State loaded from storage',
				'StateManager.init()',
				3
			);
		} else {
			this.log(
				'warn',
				'No valid stored state found. Generating initial state.',
				'StateManager.init()',
				3
			);
			this.state = this.generateInitialState();
			console.log('[StateManager] Generated initial state:', this.state);
			if (!this.state.paletteContainer) {
				this.log(
					'error',
					'State.paletteContainer is STILL undefined.',
					'StateManager.init()',
					3
				);
			}
		}

		await this.saveState();
	}

	private async loadState(): Promise<State> {
		const storedState = await this.storage.getItem<State>('appState');
		return storedState || defaultState;
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
		await this.storage.setItem('appState', this.state);
	}
}
