import * as colors from './colors';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: colors.Color;
}

export interface GenButtonParams {
	numBoxes: number;
	paletteType: number;
	customColor: colors.HSL | null;
	enableAlpha: boolean;
	limitBright: boolean;
	limitDark: boolean;
	limitGray: boolean;
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
}

export interface UIElements {
	advancedMenuToggleButton: HTMLElement | null;
	applyCustomColorButton: HTMLElement | null;
	clearCustomColorButton: HTMLElement | null;
	customColorToggleButton: HTMLElement | null;
	desaturateButton: HTMLElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLElement | null;
	limitBrightCheckbox: HTMLInputElement | null;
	limitDarkCheckbox: HTMLInputElement | null;
	limitGrayCheckbox: HTMLInputElement | null;
	popupDivButton: HTMLElement | null;
	saturateButton: HTMLElement | null;
	selectedColor: number;
}
