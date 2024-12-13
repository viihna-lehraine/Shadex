// File: src/index/colors/colorStrings.js

import { Hex, LAB, RGB, XYZ } from './index.js';

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

// ******** Color Strings ********

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

// ColorString Values

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
