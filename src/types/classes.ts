// File: types/classes.js

import { IDBPObjectStore } from 'idb';
import {
	Color,
	HSL,
	MutationLog,
	Palette,
	PaletteDB,
	PaletteItem,
	PaletteBoxObject,
	PaletteSchema,
	Settings,
	StoredPalette
} from './index.js';

export interface AppLogger_ClassInterface {
	log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: 0 | 1
	): void;
	logAsync(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: 0 | 1
	): Promise<void>;
	logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): void;
}

export interface DBService_ClassInterface {
	deleteDatabase(): Promise<void>;
	deleteEntries(store: keyof PaletteSchema, keys: string[]): Promise<void>;
}

export interface HistoryService_ClassInterface {
	getPaletteHistory(): Promise<Palette[]>;
	savePaletteHistory(paletteHistory: Palette[]): Promise<void>;
}

export interface IDBManager_ClassInterface {
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
	savePaletteToDB(
		type: string,
		items: PaletteItem[],
		paletteID: number,
		numBoxes: number,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<Palette>;
	savePaletteHistory(paletteHistory: Palette[]): Promise<void>;
	saveSettings(newSettings: Settings): Promise<void>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void>;
}

export interface MutationService_ClassInterface {
	createMutationLogger<T extends object>(obj: T, key: string): Promise<T>;
	getMutations(): Promise<MutationLog[]>;
	persistMutation(data: MutationLog): Promise<void>;
}

export interface PaletteService_ClassInterface {
	getCurrentPaletteID(): Promise<number>;
	getNextTableID(): Promise<string>;
	getPalette(id: string): Promise<Palette | void | null>;
	savePalette(id: string, palette: Palette): Promise<void>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void>;
}

export interface SettingsService_ClassInterface {
	get maxHistory(): number;
	set maxHistory(value: number);
	getCachedSettings(): Promise<Settings>;
	getSettings(): Promise<Settings>;
	saveSettings(newSettings: Settings): Promise<void>;
}

export interface UIManager_ClassInterface {
	addPaletteToHistory(palette: Palette): Promise<void>;
	applyCustomColor(): HSL;
	applyFirstColorToUI(color: HSL): Promise<HSL>;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	createPaletteTable(palette: StoredPalette): HTMLElement;
	getCurrentPalette(): Promise<Palette | null>;
	getID(): number;
	handleExport(format: 'css' | 'json' | 'xml'): Promise<void>;
	makePaletteBox(
		color: Color,
		swatchCount: number
	): Promise<PaletteBoxObject>;
	removePaletteFromHistory(paletteID: string): Promise<void>;
	renderPalette(tableId: string): Promise<void | null>;
}
