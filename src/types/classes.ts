// File: types/classes.js

import { IDBPObjectStore } from 'idb';
import {
	MutationLog,
	Palette,
	PaletteArgs,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings
} from './index.js';

export interface IDBManager_ClassInterface {
	addPaletteToHistory(palette: Palette): Promise<void>;
	createMutationLogger<T extends object>(obj: T, key: string): Promise<T>;
	deleteDatabase(): Promise<void>;
	deleteEntries(store: keyof PaletteSchema, keys: string[]): Promise<void>;
	getCurrentPaletteID(): Promise<number>;
	getCachedSettings(): Promise<Settings>;
	getDB(): Promise<PaletteDB>;
	getNextTableID(): Promise<string>;
	getMutations(): Promise<MutationLog[]>;
	getPaletteHistory(): Promise<Palette[]>;
	getSettings(): Promise<Settings>;
	getStore<StoreName extends keyof PaletteSchema>(
		storeName: StoreName,
		mode: 'readonly'
	): Promise<
		IDBPObjectStore<PaletteSchema, [StoreName], StoreName, 'readonly'>
	>;
	getStore<StoreName extends keyof PaletteSchema>(
		storeName: StoreName,
		mode: 'readwrite'
	): Promise<
		IDBPObjectStore<PaletteSchema, [StoreName], StoreName, 'readwrite'>
	>;
	getStore<StoreName extends keyof PaletteSchema>(
		storeName: StoreName,
		mode: 'readonly' | 'readwrite'
	): Promise<
		IDBPObjectStore<PaletteSchema, [StoreName], StoreName, typeof mode>
	>;
	persistMutation(data: MutationLog): Promise<void>;
	resetDatabase(): Promise<void>;
	resetPaletteID(): Promise<void>;
	savePalette(id: string, newPalette: Palette): Promise<void>;
	savePaletteToDB(args: PaletteArgs): Promise<Palette>;
	savePaletteHistory(paletteHistory: Palette[]): Promise<void>;
	saveSettings(newSettings: Settings): Promise<void>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void>;
}
