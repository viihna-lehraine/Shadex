// File: src/index/app/dom.js

import { ColorSpace, HSL, Palette, UIElements } from '../index.js';

export interface DOMBaseFnInterface {
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): UIElements;
	initializeUI: () => Promise<void>;
}

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

export interface DOMHistoryFnInterface {
	addPalette(palette: Palette): void;
	renderPalette(displayFormat: ColorSpace): void;
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
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): UIElements;
	initializeUI: () => Promise<void>;
	events: DOMFnEventsInterface;
	exportPalette: DOMExportPaletteFnInterface;
	history: DOMHistoryFnInterface;
	validate: DOMValidateFnInterface;
}
