import { conversionMap } from './color-conversion/conversion';

// ***** Interface and Type Unions *****

export type Color = CMYK | Hex | HSL | HSV | LAB | RGB | XYZ;

export interface ColorData {
	cmyk?: CMYK;
	hex?: Hex;
	hsl?: HSL;
	hsv?: HSV;
	lab?: LAB;
	rgb?: RGB;
	xyz?: XYZ;
}

export interface ConversionData {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	xyz: XYZ;
}

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb';

export type ConversionMapIndex = keyof typeof conversionMap;

export type Format = keyof ColorSpace | 'sl' | 'sv';

// ***** Color Interfaces (value as object with number props) *****

export interface CMYK {
	value: CMYKValue;
	format: 'cmyk';
}

export interface Hex {
	value: HexValue;
	format: 'hex';
}

export interface HSL {
	value: HSLValue;
	format: 'hsl';
}

export interface HSV {
	value: HSVValue;
	format: 'hsv';
}

export interface LAB {
	value: LABValue;
	format: 'lab';
}

export interface RGB {
	value: RGBValue;
	format: 'rgb';
}

export interface SL {
	value: SLValue;
	format: 'sl';
}

export interface SV {
	value: SVValue;
	format: 'sv';
}

export interface XYZ {
	value: XYZValue;
	format: 'xyz';
}

// ***** Color Value Types *****

export type CMYKValue = {
	cyan: number;
	magenta: number;
	yellow: number;
	key: number;
};

export type HexValue = {
	hex: string;
};

export type HSLValue = {
	hue: number;
	saturation: number;
	lightness: number;
};

export type HSVValue = {
	hue: number;
	saturation: number;
	value: number;
};

export type LABValue = {
	l: number;
	a: number;
	b: number;
};

export type RGBValue = {
	red: number;
	green: number;
	blue: number;
};

export type SLValue = {
	saturation: number;
	lightness: number;
};

export type SVValue = {
	saturation: number;
	value: number;
};

export type XYZValue = {
	x: number;
	y: number;
	z: number;
};

// ***** DOM Interfaces and Types *****

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}

export interface GenButtonParams {
	numBoxes: number;
	paletteType: number;
	initialColorSpace: ColorSpace;
	customColor: Color | null;
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
	initialColorSpace: ColorSpace | undefined;
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

// ***** Color Conversion *****

export type ConversionFunction<From, To> = (input: From) => To;

export type ConversionMapping<From, To> = {
	[K in keyof To]: ConversionFunction<From, To[K]>;
};

export type ConversionMap = {
	cmyk: Partial<ConversionMapping<CMYK, ConversionData>>;
	hex: Partial<ConversionMapping<Hex, ConversionData>>;
	hsl: Partial<ConversionMapping<HSL, ConversionData>>;
	hsv: Partial<ConversionMapping<HSV, ConversionData>>;
	lab: Partial<ConversionMapping<LAB, ConversionData>>;
	rgb: Partial<ConversionMapping<RGB, ConversionData>>;
	xyz: Partial<ConversionMapping<XYZ, ConversionData>>;
};

// ***** Storage *****

export type Key = 'AppStorage';

export interface AppStorage {
	customColor?: Color | null;
	initialColorSpace?: ColorSpace;
	theme?: string;
	[key: string]: unknown;
}

export interface StorageInterface {
	clearStorage(): void;
	getAppStorage(): AppStorage | null;
	getCookie<T>(name: string): T | null;
	setAppStorage(value: AppStorage): void;
	setCookie<T>(name: string, value: T, days: number): void;
	updateAppStorage(updates: Partial<AppStorage>): void;
}
