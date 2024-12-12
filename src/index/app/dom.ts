// File: src/index/app/dom.ts

import {
	ColorSpace,
	GetElementsForSelectedColor,
	HSL,
	Palette,
	PullParamsFromUI,
	UIElements
} from '../index.js';

export interface DOMBaseFnInterface {
	addConversionButtonEventListeners: () => void;
	applyCustomColor: () => void;
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): UIElements;
	desaturateColor(selectedColor: number): void;
	getElementsForSelectedColor(
		selectedColor: number
	): GetElementsForSelectedColor;
	pullParamsFromUI(): PullParamsFromUI;
	saturateColor(selectedColor: number): void;
	showCustomColorPopupDiv(): void;
}

export interface DOMButtonsFnInterface {
	handlePaletteGen: () => void;
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
	addConversionButtonEventListeners: () => void;
	applyCustomColor: () => void;
	applyFirstColorToUI(color: HSL): HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): UIElements;
	desaturateColor(selectedColor: number): void;
	getElementsForSelectedColor(
		selectedColor: number
	): GetElementsForSelectedColor;
	pullParamsFromUI(): PullParamsFromUI;
	saturateColor(selectedColor: number): void;
	showCustomColorPopupDiv(): void;
	buttons: DOMButtonsFnInterface;
	exportPalette: DOMExportPaletteFnInterface;
	history: DOMHistoryFnInterface;
}
