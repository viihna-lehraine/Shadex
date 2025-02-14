// File: types/app/classes.js

import { MutationLog, Palette, State } from '../index.js';

export interface AppLoggerClassInterface {
	log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: number,
		caller?: string
	): void;
	logAsync(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: number,
		caller?: string
	): Promise<void>;
	logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): void;
}

export interface StateManagerClassInterface {
	addPaletteToHistory(palette: Palette): void;
	getState(): State;
	redo(): void;
	resetState(): void;
	setState(state: State, track: boolean): void;
	undo(): void;
	updateAppModeState(appMode: State['appMode'], track: boolean): void;
	updateDnDAttachedState(dndAttached: boolean): void;
	updatePaletteColumns(
		columns: State['paletteContainer']['columns'],
		track: boolean,
		verbosity: number
	): void;
	updatePaletteColumnSize(columnID: number, newSize: number): void;
	updatePaletteHistory(updatedHistory: Palette[]): void;
	updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): void;
}
