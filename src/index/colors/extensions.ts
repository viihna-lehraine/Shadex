// File: src/index/colors/extensions.js

import { CMYK, Hex, HSL, HSV, LAB, RGB, SL, SV, XYZ } from './index.js';

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

export type Format = keyof ColorSpace | 'sl' | 'sv';
