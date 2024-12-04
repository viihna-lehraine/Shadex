// File: src/index/colors.ts

import { Color, HSL } from '../index';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}

export interface GenButtonParams {
	numBoxes: number;
	paletteType: number;
	customColor: HSL | null;
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
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
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
}

export interface UIElements {
	advancedMenuButton: HTMLButtonElement | null;
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	closeCustomColorMenuButton: HTMLButtonElement | null;
	closeHelpMenuButton: HTMLButtonElement | null;
	closeHistoryMenuButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	helpMenuButton: HTMLButtonElement | null;
	historyMenuButton: HTMLButtonElement | null;
	limitDarknessCheckbox: HTMLInputElement | null;
	limitGraynessCheckbox: HTMLInputElement | null;
	limitLightnessCheckbox: HTMLInputElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColor: number;
	showAsCMYKButton: HTMLButtonElement | null;
	showAsHexButton: HTMLButtonElement | null;
	showAsHSLButton: HTMLButtonElement | null;
	showAsHSVButton: HTMLButtonElement | null;
	showAsLABButton: HTMLButtonElement | null;
	showAsRGBButton: HTMLButtonElement | null;
}
