import * as colors from './colors';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: colors.Color;
}

export interface GenButtonParams {
	numBoxes: number;
	paletteType: number;
	colorSpace: colors.ColorSpace;
	customColor: colors.Color | null;
}

export interface GetElementsForSelectedColor {
	selectedColorTextOutputBox: HTMLElement | null;
	selectedColorBox: HTMLElement | null;
	selectedColorStripe: HTMLElement | null;
}

export interface MakePaletteBox {
	colorStripe: HTMLDivElement;
	paletteBoxCount: number;
}

export interface PullParamsFromUI {
	paletteType: number;
	numBoxes: number;
	colorSpace: colors.ColorSpace | undefined;
}

export interface UIButtons {
	generateButton: HTMLElement | null;
	saturateButton: HTMLElement | null;
	desaturateButton: HTMLElement | null;
	popupDivButton: HTMLElement | null;
	applyCustomColorButton: HTMLElement | null;
	clearCustomColorButton: HTMLElement | null;
	advancedMenuToggleButton: HTMLElement | null;
	applyColorSpaceButton: HTMLElement | null;
	selectedColor: number;
}
