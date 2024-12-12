// File: src/index/colors.ts

import type {
	AlphaRange,
	ByteRange,
	HexComponent,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from './index.js';

export type Color = CMYK | Hex | HSL | HSV | LAB | RGB | SL | SV | XYZ;

export interface ColorData {
	cmyk?: CMYK;
	hex?: Hex;
	hsl?: HSL;
	hsv?: HSV;
	lab?: LAB;
	rgb?: RGB;
	xyz?: XYZ;
}

export interface ColorDataAssertion {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	xyz: XYZ;
}

export interface ColorDataExtended extends ColorData {
	sl?: SL;
	sv?: SV;
}

export type ColorPartial = SL | SV;

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb' | 'xyz';

export type ColorSpaceExtended = ColorSpace | 'sl' | 'sv';

export type ColorString =
	| CMYKString
	| HexString
	| HSLString
	| HSVString
	| LABString
	| RGBString
	| SLString
	| SVString
	| XYZString;

export type ColorStringExtended = ColorString | Hex | LAB | RGB | XYZ;

export type ColorUnbranded =
	| CMYKUnbranded
	| HexUnbranded
	| HSLUnbranded
	| HSVUnbranded
	| LABUnbranded
	| RGBUnbranded
	| SLUnbranded
	| SVUnbranded
	| XYZUnbranded;

export type Format = keyof ColorSpace | 'sl' | 'sv';

export interface PaletteOptions {
	numBoxes: number;
	customColor: HSL | null;
	paletteType: number;
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
}

// ***** Colors *****

export type CMYK = {
	value: CMYKValue;
	format: 'cmyk';
};

export type Hex = {
	value: HexValue;
	format: 'hex';
};

export type HSL = {
	value: HSLValue;
	format: 'hsl';
};

export type HSV = {
	value: HSVValue;
	format: 'hsv';
};

export type LAB = {
	value: LABValue;
	format: 'lab';
};

export type RGB = {
	value: RGBValue;
	format: 'rgb';
};

export type SL = {
	value: SLValue;
	format: 'sl';
};

export type SV = {
	value: SVValue;
	format: 'sv';
};

export type XYZ = {
	value: XYZValue;
	format: 'xyz';
};

// ***** Colors with String Values *****

export type CMYKString = {
	value: CMYKValueString;
	format: 'cmyk';
};

export type HexString = {
	value: HexValueString;
	format: 'hex';
};

export type HSLString = {
	value: HSLValueString;
	format: 'hsl';
};

export type HSVString = {
	value: HSVValueString;
	format: 'hsv';
};

export type LABString = {
	value: LABValueString;
	format: 'lab';
};

export type RGBString = {
	value: RGBValueString;
	format: 'rgb';
};

export type SLString = {
	value: SLValueString;
	format: 'sl';
};

export type SVString = {
	value: SVValueString;
	format: 'sv';
};

export type XYZString = {
	value: XYZValueString;
	format: 'xyz';
};

// ***** Colors with Unbranded Values *****

export type CMYKUnbranded = {
	value: CMYKValueUnbranded;
	format: 'cmyk';
};

export type HexUnbranded = {
	value: HexValueUnbranded;
	format: 'hex';
};

export type HSLUnbranded = {
	value: HSLValueUnbranded;
	format: 'hsl';
};

export type HSVUnbranded = {
	value: HSVValueUnbranded;
	format: 'hsv';
};

export type LABUnbranded = {
	value: LABValueUnbranded;
	format: 'lab';
};

export type RGBUnbranded = {
	value: RGBValueUnbranded;
	format: 'rgb';
};

export type SLUnbranded = {
	value: SLValueUnbranded;
	format: 'sl';
};

export type SVUnbranded = {
	value: SVValueUnbranded;
	format: 'sv';
};

export type XYZUnbranded = {
	value: XYZValueUnbranded;
	format: 'xyz';
};

// ***** Color Values *****

export type CMYKValue = {
	cyan: Percentile;
	magenta: Percentile;
	yellow: Percentile;
	key: Percentile;
	alpha: AlphaRange;
};

export type HexValue = {
	hex: HexSet;
	alpha: HexComponent;
	numAlpha: AlphaRange;
};

export type HSLValue = {
	hue: Radial;
	saturation: Percentile;
	lightness: Percentile;
	alpha: AlphaRange;
};

export type HSVValue = {
	hue: Radial;
	saturation: Percentile;
	value: Percentile;
	alpha: AlphaRange;
};

export type LABValue = {
	l: LAB_L;
	a: LAB_A;
	b: LAB_B;
	alpha: AlphaRange;
};

export type RGBValue = {
	red: ByteRange;
	green: ByteRange;
	blue: ByteRange;
	alpha: AlphaRange;
};

export type SLValue = {
	saturation: Percentile;
	lightness: Percentile;
	alpha: AlphaRange;
};

export type SVValue = {
	saturation: Percentile;
	value: Percentile;
	alpha: AlphaRange;
};

export type XYZValue = {
	x: XYZ_X;
	y: XYZ_Y;
	z: XYZ_Z;
	alpha: AlphaRange;
};

// ***** Color Values (relevant props as strings, will have leading '%' character) *****

export type CMYKValueString = {
	cyan: string;
	magenta: string;
	yellow: string;
	key: string;
	alpha: string;
};

export type HexValueString = {
	hex: string;
	alpha: string;
	numAlpha: string;
};

export type HSLValueString = {
	hue: string;
	saturation: string;
	lightness: string;
	alpha: string;
};

export type HSVValueString = {
	hue: string;
	saturation: string;
	value: string;
	alpha: string;
};

export type LABValueString = {
	l: string;
	a: string;
	b: string;
	alpha: string;
};

export type RGBValueString = {
	red: string;
	green: string;
	blue: string;
	alpha: string;
};

export type SLValueString = {
	saturation: string;
	lightness: string;
	alpha: string;
};

export type SVValueString = {
	saturation: string;
	value: string;
	alpha: string;
};

export type XYZValueString = {
	x: string;
	y: string;
	z: string;
	alpha: string;
};

// ***** Color Values (unbranded) *****

export type CMYKValueUnbranded = {
	cyan: number;
	magenta: number;
	yellow: number;
	key: number;
	alpha: number;
};

export type HexValueUnbranded = {
	hex: string;
	alpha: string;
	numAlpha: number;
};

export type HSLValueUnbranded = {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
};

export type HSVValueUnbranded = {
	hue: number;
	saturation: number;
	value: number;
	alpha: number;
};

export type LABValueUnbranded = {
	l: number;
	a: number;
	b: number;
	alpha: number;
};

export type RGBValueUnbranded = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type SLValueUnbranded = {
	saturation: number;
	lightness: number;
	alpha: number;
};

export type SVValueUnbranded = {
	saturation: number;
	value: number;
	alpha: number;
};

export type XYZValueUnbranded = {
	x: number;
	y: number;
	z: number;
	alpha: number;
};
