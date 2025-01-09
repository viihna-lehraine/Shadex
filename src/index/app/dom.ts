// File: src/index/app/dom.js

import {
	ColorSpace,
	GetElementsForSelectedColor,
	HSL,
	Palette,
	PullParamsFromUI,
	UIElements
} from '../index.js';

export interface DOMBaseFnInterface {
	applyCustomColor: () => void;
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): UIElements;
	desaturateColor(selectedColor: number): void;
	getElementsForSelectedColor(
		selectedColor: number
	): GetElementsForSelectedColor;
	initializeUI: () => Promise<void>;
	pullParamsFromUI(): PullParamsFromUI;
	saturateColor(selectedColor: number): void;
}

export interface DOMElementsInterface {
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

export interface DOMFnMasterInterface {
	applyCustomColor: () => void;
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): UIElements;
	desaturateColor(selectedColor: number): void;
	getElementsForSelectedColor(
		selectedColor: number
	): GetElementsForSelectedColor;
	initializeUI: () => Promise<void>;
	pullParamsFromUI(): PullParamsFromUI;
	saturateColor(selectedColor: number): void;
	elements: DOMElementsInterface;
	exportPalette: DOMExportPaletteFnInterface;
	history: DOMHistoryFnInterface;
}
