// File: src/index/colors.js

import { Color, HSL } from './index.js';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}

export interface GenButtonArgs {
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
	advancedMenu: HTMLDivElement | null;
	advancedMenuButton: HTMLButtonElement | null;
	advancedMenuContent: HTMLDivElement | null;
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	customColorDisplay: HTMLSpanElement | null;
	customColorInput: HTMLInputElement | null;
	customColorMenu: HTMLDivElement | null;
	customColorMenuButton: HTMLButtonElement | null;
	deleteDatabaseButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	developerMenuButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	helpMenu: HTMLDivElement | null;
	helpMenuButton: HTMLButtonElement | null;
	helpMenuContent: HTMLDivElement | null;
	historyMenu: HTMLDivElement | null;
	historyMenuButton: HTMLButtonElement | null;
	historyMenuContent: HTMLDivElement | null;
	limitDarknessCheckbox: HTMLInputElement | null;
	limitGraynessCheckbox: HTMLInputElement | null;
	limitLightnessCheckbox: HTMLInputElement | null;
	paletteNumberOptions: HTMLInputElement | null;
	paletteTypeOptions: HTMLSelectElement | null;
	resetDatabaseButton: HTMLButtonElement | null;
	resetPaletteIDButton: HTMLButtonElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColor: number;
	selectedColorOption: HTMLSelectElement | null;
	showAsCMYKButton: HTMLButtonElement | null;
	showAsHexButton: HTMLButtonElement | null;
	showAsHSLButton: HTMLButtonElement | null;
	showAsHSVButton: HTMLButtonElement | null;
	showAsLABButton: HTMLButtonElement | null;
	showAsRGBButton: HTMLButtonElement | null;
}
