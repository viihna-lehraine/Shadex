// File: types/services/ui/ui.js

import {
	Color,
	Hex,
	HSL,
	Palette,
	PaletteBoxObject,
	RGB,
	Settings,
	StoredPalette
} from '../index.js';

export interface DOMSubServiceInterface {
	getCheckboxState(id: string): boolean | void;
	getElement<T extends HTMLElement>(id: string): T | null;
	getSelectedExportFormat(): string | void;
	updateColorBox(color: HSL, boxId: string): Promise<void>;
	updateHistory(history: Palette[]): void;
}

export interface EventServiceInterface {
	initialize(): void;
	showTooltip(tooltipElement: HTMLElement): void;
	saturateColor(): void;
	showToast(message: string): void;
}

export interface IOServiceInterface {
	exportPalette(palette: Palette, format: string): Promise<string>;
	importPalette(file: File, format: 'json' | 'xml' | 'css'): Promise<void>;
}

export interface PaletteEventSubServiceInterface {
	initialize(): void;
	saturateColor(): void;
}

export interface ParseServiceInterface {
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

export interface SettingsServiceInterface {
	get maxHistory(): number;
	set maxHistory(value: number);
	getCachedSettings(): Promise<Settings>;
	getSettings(): Promise<Settings>;
	saveSettings(newSettings: Settings): Promise<void>;
}

export interface UIManagerInterface {
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

export interface ValidationServiceInterface {
	validateStaticElements(): void;
}
