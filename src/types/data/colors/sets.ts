// File: index/colors/sets.js

import {
	CMYK,
	CMYKStringObject,
	Hex,
	HexStringObject,
	HSL,
	HSLStringObject,
	HSV,
	HSVStringObject,
	LAB,
	LABStringObject,
	RGB,
	RGBStringObject,
	SL,
	SLStringObject,
	SV,
	SVStringObject,
	UnbrandedCMYK,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedRGB,
	UnbrandedSL,
	UnbrandedSV,
	UnbrandedXYZ,
	XYZ,
	XYZStringObject
} from './main.js';

export interface AllColors {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	sl: SL;
	sv: SV;
	xyz: XYZ;
}

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

export type ColorFormat = keyof ColorSpace | 'sl' | 'sv';

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb' | 'xyz';

export type ColorSpaceExtended = ColorSpace | 'sl' | 'sv';

export type ColorStringObject =
	| CMYKStringObject
	| HexStringObject
	| HSLStringObject
	| HSVStringObject
	| LABStringObject
	| RGBStringObject
	| SLStringObject
	| SVStringObject
	| XYZStringObject;

export type UnbrandedColor =
	| UnbrandedCMYK
	| UnbrandedHex
	| UnbrandedHSL
	| UnbrandedHSV
	| UnbrandedLAB
	| UnbrandedRGB
	| UnbrandedSL
	| UnbrandedSV
	| UnbrandedXYZ;
