// File: src/index/colors/colorsUnbranded.js

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

// ***** Colors (Unbranded) *****

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

// ******** Color Values (unbranded) ********

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
