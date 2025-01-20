// File: src/index/classes.js

import { IDBPObjectStore } from 'idb';
import {
	HSL,
	MutationLog,
	Palette,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings,
	StoredPalette
} from './index.js';

// ******** Class Interfaces ********

export interface AppLoggerInterface {
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

export interface CacheManagerInterface<T> {
	get(key: string): T | undefined;
	set(key: string, value: T): void;
	clear(): void;
}

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
	getDB(): Promise<PaletteDB>;
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

export interface MutationTrackerInterface {
	persistMutation(data: MutationLog): Promise<void>;
}

export interface UIManagerInterface {
	addPaletteToHistory(palette: Palette): void;
	applyCustomColor(): HSL;
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	createPaletteTable(palette: StoredPalette): HTMLElement;
	getCurrentPalette(): Promise<Palette | null>;
	getID(): number;
	handleExport(format: 'css' | 'json' | 'xml'): Promise<void>;
	renderPalette(tableId: string): Promise<void | null>;
}

// ******** Factory Interfaces ********

export interface AsyncLoggerFactory {
	debug(message: string): Promise<void>;
	info(message: string): Promise<void>;
	warning(message: string): Promise<void>;
	error(message: string): Promise<void>;
	mutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): Promise<void>;
}

export interface SyncLoggerFactory {
	debug(message: string): void;
	info(message: string): void;
	warning(message: string): void;
	error(message: string): void;
	mutation(data: MutationLog, logCallback: (data: MutationLog) => void): void;
}
