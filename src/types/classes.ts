// File: types/classes.js

import { IDBPObjectStore } from 'idb';
import {
	Color,
	HSL,
	MutationLog,
	Palette,
	PaletteItem,
	PaletteBoxObject,
	PaletteSchema,
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

export interface IDBManager_ClassInterface {
	getLoggedObject<T extends object>(obj: T | null, key: string): T | null;
	getNextTableID(): Promise<string | null>;
	ensureEntryExists(
		storeName: keyof PaletteSchema,
		key: string
	): Promise<boolean>;
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
	getTable(id: string): Promise<StoredPalette | null>;
	resetDatabase(): Promise<void | null>;
	savePaletteHistory(paletteHistory: Palette[]): Promise<void>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void | null>;
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
	setHistoryLimit(limit: number): Promise<void>;
}
