// File: src/index/colors/colors.js

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
} from '../index.js';

export type Color = CMYK | Hex | HSL | HSV | LAB | RGB | SL | SV | XYZ;

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
