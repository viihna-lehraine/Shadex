import * as types from './types';

export interface AppStorage {
	customColor?: types.Color | null;
	initialColorSpace?: types.ColorSpace;
	theme?: string;
	[key: string]: unknown;
}

export interface ColorData {
	cmyk?: types.CMYK;
	hex?: types.Hex;
	hsl?: types.HSL;
	hsv?: types.HSV;
	lab?: types.LAB;
	rgb?: types.RGB;
	xyz?: types.XYZ;
}

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: types.Color;
}

export interface Config {
	adjustSLAmount: number;
	cmykBrightnessThreshold: number;
	cmykDarknessThreshold: number;
	cmykGrayThreshold: number;
	hslBrightnessThreshold: number;
	hslDarknessThreshold: number;
	hslGrayThreshold: number;
	hsvBrightnessValueThreshold: number;
	hsvBrightnessSaturationThreshold: number;
	hsvDarknessThreshold: number;
	hsvGrayThreshold: number;
	labBrightnessThreshold: number;
	labDarknessThreshold: number;
	labGrayThreshold: number;
	rgbMaxBrightness: number;
	rgbMinBrightness: number;
	rgbGrayThreshold: number;
	probabilities: number[];
	weights: number[];
}

export interface ConversionData {
	cmyk: types.CMYK;
	hex: types.Hex;
	hsl: types.HSL;
	hsv: types.HSV;
	lab: types.LAB;
	rgb: types.RGB;
	xyz: types.XYZ;
}

export interface Flags {
	enableAlpha: boolean;
}

export interface GenButtonParams {
	numBoxes: number;
	paletteType: number;
	initialColorSpace: types.ColorSpace;
	customColor: types.Color | null;
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
	initialColorSpace: types.ColorSpace | undefined;
}

export interface UIButtons {
	generateButton: HTMLElement | null;
	saturateButton: HTMLElement | null;
	desaturateButton: HTMLElement | null;
	popupDivButton: HTMLElement | null;
	applyCustomColorButton: HTMLElement | null;
	clearCustomColorButton: HTMLElement | null;
	advancedMenuToggleButton: HTMLElement | null;
	applyInitialColorSpaceButton: HTMLElement | null;
	selectedColor: number;
}

export interface StorageInterface {
	clearStorage(): void;
	getAppStorage(): AppStorage | null;
	getCookie<T>(name: string): T | null;
	setAppStorage(value: AppStorage): void;
	setCookie<T>(name: string, value: T, days: number): void;
	updateAppStorage(updates: Partial<AppStorage>): void;
}
