// File: src/index/app/dom.js

import { ColorSpace, Palette } from '../index.js';

export interface DOMEventsInterface {
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void
	): void;
	handlePaletteGen: () => void;
	initializeEventListeners(): void;
}

export interface DOMExportPaletteFnInterface {
	asCSS(palette: Palette, colorSpace: ColorSpace): void;
	asJSON(palette: Palette): void;
	asPNG(palette: Palette, colorSpace: ColorSpace, paletteName?: string): void;
	asXML(palette: Palette): void;
}

export interface DOMValidateFnInterface {
	elements(): void;
}

export interface DOMFnEventsInterface {
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void
	): void;
	handlePaletteGen: () => void;
	initializeEventListeners(): void;
}

export interface DOMFnMasterInterface {
	events: DOMFnEventsInterface;
	exportPalette: DOMExportPaletteFnInterface;
	validate: DOMValidateFnInterface;
}
