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
	enableAlpha: boolean;
	limitBright: boolean;
	limitDark: boolean;
	limitGray: boolean;
}

export interface UIElements {
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	closeHelpMenuButton: HTMLButtonElement | null;
	closeHistoryMenuButton: HTMLButtonElement | null;
	closeSubMenuAButton: HTMLButtonElement | null;
	closeSubMenuBButton: HTMLButtonElement | null;
	customColorToggleButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	limitBrightCheckbox: HTMLInputElement | null;
	limitDarkCheckbox: HTMLInputElement | null;
	limitGrayCheckbox: HTMLInputElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColor: number;
	showAsCMYKButton: HTMLButtonElement | null;
	showAsHexButton: HTMLButtonElement | null;
	showAsHSLButton: HTMLButtonElement | null;
	showAsHSVButton: HTMLButtonElement | null;
	showAsLABButton: HTMLButtonElement | null;
	showAsRGBButton: HTMLButtonElement | null;
	showHelpMenuButton: HTMLButtonElement | null;
	showHistoryMenuButton: HTMLButtonElement | null;
	subMenuToggleButtonA: HTMLButtonElement | null;
	subMenuToggleButtonB: HTMLButtonElement | null;
}
