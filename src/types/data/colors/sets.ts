// File: index/colors/sets.js

import {
	CMYK,
	CMYK_StringProps,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	RGB,
	RGB_StringProps,
	SL,
	SL_StringProps,
	SV,
	SV_StringProps,
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
	XYZ_StringProps
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

export type Color_StringProps =
	| CMYK_StringProps
	| Hex_StringProps
	| HSL_StringProps
	| HSV_StringProps
	| LAB_StringProps
	| RGB_StringProps
	| SL_StringProps
	| SV_StringProps
	| XYZ_StringProps;

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
