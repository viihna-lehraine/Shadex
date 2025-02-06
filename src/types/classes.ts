// File: types/classes.js

import { IDBPObjectStore } from 'idb';
import {
	Color,
	Hex,
	HSL,
	MutationLog,
	Palette,
	PaletteArgs,
	PaletteBoxObject,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	RGB,
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
	resetDatabase(): Promise<void>;
}

export interface DOMSubService_ClassInterface {
	getCheckboxState(id: string): boolean | void;
	getElement<T extends HTMLElement>(id: string): T | null;
	getSelectedExportFormat(): string | void;
	updateColorBox(color: HSL, boxId: string): Promise<void>;
	updateHistory(history: Palette[]): void;
}

export interface EventService_ClassInterface {
	initialize(): void;
	showTooltip(tooltipElement: HTMLElement): void;
	saturateColor(): void;
	showToast(message: string): void;
}

export interface HistoryService_ClassInterface {
	addPaletteToHistory(palette: Palette): Promise<void>;
	getPaletteHistory(): Promise<Palette[]>;
	savePaletteHistory(paletteHistory: Palette[]): Promise<void>;
}

export interface IOService_ClassInterface {
	exportPalette(palette: Palette, format: string): Promise<string>;
	importPalette(file: File, format: 'json' | 'xml' | 'css'): Promise<void>;
}

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
	savePaletteToDB(args: PaletteArgs): Promise<Palette>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void>;
}

export interface PaletteEventSubService_ClassInterface {
	initialize(): void;
	saturateColor(): void;
}

export interface ParseService_ClassInterface {
	parseCheckbox(id: string): boolean | void;
	parseColorInput(input: HTMLInputElement): Hex | HSL | RGB | null;
	parseDropdownSelection(id: string, validOptions: string[]): string | void;
	parseNumberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null;
	parsePaletteExportFormat(): string | void;
	parseTextInput(input: HTMLInputElement, regex?: RegExp): string | null;
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
	applyCustomColor(swatch: number): HSL;
	applyFirstColorToUI(color: HSL): Promise<HSL>;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	createPaletteTable(palette: StoredPalette): HTMLElement;
	getCurrentPalette(): Promise<Palette | null>;
	getElementsForSelectedColorSwatch(swatch: number): {
		selectedColorTextOutputBox: HTMLElement | null;
		selectedColorBox: HTMLElement | null;
		selectedColorStripe: HTMLElement | null;
	};
	getInstanceID(): number;
	handleExport(format: 'css' | 'json' | 'xml'): Promise<void>;
	makePaletteBox(
		color: Color,
		swatchCount: number
	): Promise<PaletteBoxObject>;
	removePaletteFromHistory(paletteID: string): Promise<void>;
	renderPalette(tableId: string): Promise<void | null>;
	saturateColor(swatch: number): void;
	showToast(message: string): void;
	updateHistory(history?: Palette[]): void;
}

export interface ValidationService_ClassInterface {
	validateStaticElements(): void;
}
