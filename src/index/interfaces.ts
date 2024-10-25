import * as types from './types';

export interface Adjustments {
	adjustSLAmount: number;
}

export interface AppStorage {
	customColor?: types.Color | null;
	colorSpace?: types.ColorSpace;
	theme?: string;
	[key: string]: unknown;
}

export interface Boundaries {
	xyzMaxX: number;
	xyzMaxY: number;
	xyzMaxZ: number;
	xyzMinX: number;
	xyzMinY: number;
	xyzMinZ: number;
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

export interface Debounce {
	buttonDebounce: number;
	inputDebounce: number;
}

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: types.Color;
}

export type Config = Adjustments &
	Boundaries &
	Debounce &
	ProbabilityConstants &
	Thresholds &
	Timeouts;

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
	colorSpace: types.ColorSpace;
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

export interface ProbabilityConstants {
	probabilities: number[];
	weights: number[];
}

export interface PullParamsFromUI {
	paletteType: number;
	numBoxes: number;
	colorSpace: types.ColorSpace | undefined;
}

export interface StorageInterface {
	clearStorage(): void;
	getAppStorage(): AppStorage | null;
	getCookie<T>(name: string): T | null;
	setAppStorage(value: AppStorage): void;
	setCookie<T>(name: string, value: T, days: number): void;
	updateAppStorage(updates: Partial<AppStorage>): void;
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

export interface Thresholds {
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
}

export interface Timeouts {
	copyButtonTextTimeout: number;
	toastTimeout: number;
	tooltipTimeout: number;
}
