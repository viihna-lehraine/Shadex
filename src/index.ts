import { conversionMap } from './color-conversion/conversion';

// ***** Interface and Type Unions *****

export interface Color {
	cmyk?: CMYK;
	hex?: Hex;
	hsl?: HSL;
	hsv?: HSV;
	lab?: LAB;
	rgb?: RGB;
	sl?: SL;
	sv?: SV;
	xyz?: XYZ;
}

export interface ColorBareString {
	cmyk?: CMYKBareString;
	hex?: Hex;
	hsl?: HSLBareString;
	hsv?: HSVBareString;
	lab?: LABBareString;
	rgb?: RGBBareString;
	sl?: SLBareString;
	sv?: SVBareString;
	xyz?: XYZBareString;
}

export interface ColorString {
	cmyk?: CMYKString;
	hex?: Hex;
	hsl?: HSLString;
	hsv?: HSVString;
	lab?: LABString;
	rgb?: RGBString;
	sl?: SLString;
	sv?: SVString;
	xyz?: XYZString;
}

export type ConversionMapIndex = keyof typeof conversionMap;

export type ColorBareStringIndex = ColorBareString[keyof ColorBareString];

export type ColorDataIndex = ColorData[keyof ColorData];

export type ColorIndex = Color[keyof Color];

export type ColorStringIndex = ColorString[keyof ColorString];

export interface ColorObject<T> {
	value: T;
	format?: 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb' | 'xyz';
}

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb';

export type CustomColor = ColorData | null;

export interface ColorObjectGeneric<T> {
	value: T;
	format?: string;
}

export type ColorData = CMYK | Hex | HSL | HSV | LAB | RGB | XYZ;

export type ColorFormats =
	| 'cmyk'
	| 'hex'
	| 'hsl'
	| 'hsv'
	| 'lab'
	| 'rgb'
	| 'sl'
	| 'sv'
	| 'xyz';

export type ColorSpaceFormats =
	| 'cmyk'
	| 'hex'
	| 'hsl'
	| 'hsv'
	| 'lab'
	| 'rgb'
	| 'xyz';

export type ColorObjectData =
	| CMYKObject
	| HexObject
	| HSLObject
	| HSVObject
	| LABObject
	| RGBObject
	| XYZObject;

export interface ColorBaseInterface {
	cmyk: CMYKBase;
	hex: HexBase;
	hsl: HSLBase;
	hsv: HSVBase;
	lab: LABBase;
	rgb: RGBBase;
	xyz: XYZBase;
}

export interface ColorDataInterface {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	xyz: XYZ;
}

export interface ColorObjectDataInterface {
	cmyk: CMYKObject;
	hex: HexObject;
	hsl: HSLObject;
	hsv: HSVObject;
	lab: LABObject;
	rgb: RGBObject;
	xyz: XYZObject;
}

// ***** Color Interfaces (default: props as numbers) *****

export interface CMYK {
	cyan: number;
	magenta: number;
	yellow: number;
	key: number;
	format: 'cmyk';
}

export interface Hex {
	hex: string;
	format: 'hex';
}

export interface HSL {
	hue: number;
	saturation: number;
	lightness: number;
	format: 'hsl';
}

export interface HSV {
	hue: number;
	saturation: number;
	value: number;
	format: 'hsv';
}

export interface LAB {
	l: number;
	a: number;
	b: number;
	format: 'lab';
}

export interface RGB {
	red: number;
	green: number;
	blue: number;
	format: 'rgb';
}

export interface SL {
	saturation: number;
	lightness: number;
	format: 'sl';
}

export interface SV {
	saturation: number;
	value: number;
	format: 'sv';
}

export interface XYZ {
	x: number;
	y: number;
	z: number;
	format: 'xyz';
}

// ***** Color Interfaces (number props without format) *****

export interface CMYKBase {
	cyan: number;
	magenta: number;
	yellow: number;
	key: number;
}

export interface HexBase {
	hex: string;
}

export interface HSLBase {
	hue: number;
	saturation: number;
	lightness: number;
}

export interface HSVBase {
	hue: number;
	saturation: number;
	value: number;
}

export interface LABBase {
	l: number;
	a: number;
	b: number;
}

export interface RGBBase {
	red: number;
	green: number;
	blue: number;
}

export interface SLBase {
	saturation: number;
	lightness: number;
}

export interface SVBase {
	saturation: number;
	value: number;
}

export interface XYZBase {
	x: number;
	y: number;
	z: number;
}

// ***** Color Interfaces (string props) *****

export interface CMYKString {
	cyan: string;
	magenta: string;
	yellow: string;
	key: string;
	format: 'cmyk';
}

export interface HSLString {
	hue: string;
	saturation: string;
	lightness: string;
	format: 'hsl';
}

export interface HSVString {
	hue: string;
	saturation: string;
	value: string;
	format: 'hsv';
}

export interface LABString {
	l: string;
	a: string;
	b: string;
	format: 'lab';
}

export interface RGBString {
	red: string;
	green: string;
	blue: string;
	format: 'rgb';
}

export interface SLString {
	saturation: string;
	lightness: string;
	format: 'sl';
}

export interface SVString {
	saturation: string;
	value: string;
	format: 'sv';
}

export interface XYZString {
	x: string;
	y: string;
	z: string;
	format: 'xyz';
}

// ***** Color Interfaces (string props) *****

export interface CMYKBareString {
	cmyk: string;
	format: 'cmyk';
}

export interface HSLBareString {
	hsl: string;
	format: 'hsl';
}

export interface HSVBareString {
	hsv: string;
	format: 'hsv';
}

export interface LABBareString {
	lab: string;
	format: 'lab';
}

export interface RGBBareString {
	rgb: string;
	format: 'rgb';
}

export interface SLBareString {
	sl: string;
	format: 'sl';
}

export interface SVBareString {
	sv: string;
	format: 'sv';
}

export interface XYZBareString {
	xyz: string;
	format: 'xyz';
}

// ***** Color Interfaces (value as object with number props) *****

export interface CMYKObject {
	value: {
		cyan: number;
		magenta: number;
		yellow: number;
		key: number;
	};
	format: 'cmyk';
}

export interface HexObject {
	value: {
		hex: string;
	};
	format: 'hex';
}

export interface HSLObject {
	value: {
		hue: number;
		saturation: number;
		lightness: number;
	};
	format: 'hsl';
}

export interface HSVObject {
	value: {
		hue: number;
		saturation: number;
		value: number;
	};
	format: 'hsv';
}

export interface LABObject {
	value: {
		l: number;
		a: number;
		b: number;
	};
	format: 'lab';
}

export interface RGBObject {
	value: {
		red: number;
		green: number;
		blue: number;
	};
	format: 'rgb';
}

export interface SLObject {
	value: {
		saturation: number;
		lightness: number;
	};
	format: 'sl';
}

export interface SVObject {
	value: {
		saturation: number;
		value: number;
	};
	format: 'sv';
}

export interface XYZObject {
	value: {
		x: number;
		y: number;
		z: number;
	};
	format: 'xyz';
}

// ***** Color Interfaces (value as object with string props) ******

export interface CMYKObject_String {
	value: {
		cyan: string;
		magenta: string;
		yellow: string;
		black: string;
	};
	format: 'cmyk';
}

export interface HSLObject_String {
	value: {
		hue: string;
		saturation: string;
		lightness: string;
	};
	format: 'hsl';
}

export interface HSVObject_String {
	value: {
		hue: string;
		saturation: string;
		value: string;
	};
	format: 'hsv';
}

export interface LABObject_String {
	value: {
		l: string;
		a: string;
		b: string;
	};
	format: 'lab';
}

export interface RGBObject_String {
	value: {
		red: string;
		green: string;
		blue: string;
	};
	format: 'rgb';
}

export interface SLObject_String {
	value: {
		saturation: string;
		lightness: string;
	};
	format: 'sl';
}

export interface SVObject_String {
	value: {
		saturation: string;
		value: string;
	};
	format: 'sv';
}

export interface XYZObject_String {
	value: {
		x: string;
		y: string;
		z: string;
	};
	format: 'xyz';
}

// ***** DOM Interfaces and Types *****

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: ColorObject<Color> | ColorObjectData;
}

export interface GenButtonParams {
	numBoxes: number;
	paletteType: number;
	initialColorSpace?: ColorSpace;
	customColor?: CustomColor;
}

export interface GenPaletteColors {
	value: {
		cmyk?: { cyan: number; magenta: number; yellow: number; key: number };
		hex?: { hex: string };
		hsl?: { hue: number; saturation: number; lightness: number };
		hsv?: { hue: number; saturation: number; value: number };
		lab?: { l: number; a: number; b: number };
		rgb?: { red: number; green: number; blue: number };
	};
	format?: string;
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
	[K in keyof ColorDataInterface]: Partial<{
		[P in keyof ColorDataInterface]: (
			value: ColorDataInterface[K]
		) => ColorDataInterface[P];
	}>;
};

// ***** Storage *****

export type Key = 'AppStorage';

export interface AppStorage {
	customColor?: CustomColor;
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
