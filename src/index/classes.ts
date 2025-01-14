// File: src/index/classes.js

import { IDBPObjectStore } from 'idb';
import {
	HSL,
	Palette,
	PaletteItem,
	PaletteSchema,
	Settings,
	StoredPalette
} from './index.js';

export interface IDBManagerInterface {
	createMutationLogger<T extends object>(obj: T, key: string): T;
	deleteEntry(
		storeName: keyof PaletteSchema,
		key: string
	): Promise<void | null>;
	deleteEntries(
		storeName: keyof PaletteSchema,
		keys: string[]
	): Promise<void | null>;
	deleteDatabase(): Promise<void>;
	getCustomColor(): Promise<HSL | null>;
	getCurrentPaletteID(): Promise<number>;
	getLoggedObject<T extends object>(obj: T | null, key: string): T | null;
	getNextTableID(): Promise<string | null>;
	getNextPaletteID(): Promise<number | null>;
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
	renderPalette(tableId: string): Promise<void | null>;
	resetDatabase(): Promise<void | null>;
	resetPaletteID(): Promise<void | null>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void | null>;
	saveData<T>(
		storeName: keyof PaletteSchema,
		key: string,
		data: T,
		oldValue?: T
	): Promise<void | null>;
	savePalette(id: string, newPalette: StoredPalette): Promise<void | null>;
	savePaletteToDB(
		type: string,
		items: PaletteItem[],
		baseColor: HSL,
		numBoxes: number,
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<Palette | null>;
	saveSettings(newSettings: Settings): Promise<void | null>;
}
