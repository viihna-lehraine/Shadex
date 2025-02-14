// File: state/StateManager.js

import {
	AppServicesInterface,
	History,
	Palette,
	State,
	StateManagerClassInterface
} from '../types/index.js';
import { defaultData as defaults } from '../data/defaults.js';

const defaultState = defaults.state;

export class StateManager implements StateManagerClassInterface {
	private static instance: StateManager | null = null;
	private history: History;
	private state: State;
	private undoStack: History;
	private log: AppServicesInterface['log'];

	private constructor(appServices: AppServicesInterface) {
		this.state = defaultState;
		this.history = [defaultState];
		this.undoStack = [];
		this.log = appServices.log;
		this.saveToStorage('appState', this.state);
		this.log(
			'info',
			'StateManager initialized with default app state.',
			'StateManager.constructor()',
			1
		);
	}

	public static getInstance(appServices: AppServicesInterface): StateManager {
		if (!StateManager.instance) {
			StateManager.instance = new StateManager(appServices);
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
			`State retrieved: ${this.state}`,
			'StateManager.getState()',
			2
		);
		return this.state;
	}

	public resetState(): void {
		this.trackAction();
		this.state = defaultState;
		this.saveToStorage('appState', this.state);
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

	public updateDnDAttachedState(dndAttached: boolean): void {
		this.state.paletteContainer.dndAttached = dndAttached;
		this.log(
			'info',
			`Updated dndAttached: ${dndAttached}`,
			'StateManager.updateDnDAttached()',
			1
		);
		this.saveStateAndLog('dndAttached', 4);
	}

	public updatePaletteColumns(
		columns: State['paletteContainer']['columns'],
		track: boolean,
		verbosity: number
	): void {
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
		const minSize = 5; // minimum width in %
		const maxSize = 70; // maximum width in %
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
		this.saveToStorage('paletteHistory', updatedHistory);
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

	private saveStateAndLog(property: string, verbosity: number): void {
		this.log(
			'info',
			`Updated ${property}`,
			`StateManager.update${property}()`,
			verbosity
		);
		this.saveToStorage('appState', this.state);
	}

	private saveToStorage<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}
}
