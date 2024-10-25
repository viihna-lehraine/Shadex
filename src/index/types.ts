import { conversionMap } from '../color-conversion/conversion';
import * as interfaces from './interfaces';

export type Color = CMYK | Hex | HSL | HSV | LAB | RGB | SL | SV | XYZ;

export type ColorPartial = SL | SV;

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb';

export type ColorSpaceExtended = ColorSpace | 'sl' | 'sv';

export type ColorString =
	| CMYKString
	| HSLString
	| HSVString
	| SLString
	| SVString;

export type ColorStringExtended = ColorString | Hex | LAB | RGB | XYZ;

export type ConversionFunction<From, To> = (input: From) => To;

export type ConversionMap = {
	cmyk: Partial<ConversionMapping<CMYK, interfaces.ConversionData>>;
	hex: Partial<ConversionMapping<Hex, interfaces.ConversionData>>;
	hsl: Partial<ConversionMapping<HSL, interfaces.ConversionData>>;
	hsv: Partial<ConversionMapping<HSV, interfaces.ConversionData>>;
	lab: Partial<ConversionMapping<LAB, interfaces.ConversionData>>;
	rgb: Partial<ConversionMapping<RGB, interfaces.ConversionData>>;
	xyz: Partial<ConversionMapping<XYZ, interfaces.ConversionData>>;
};

export type ConversionMapIndex = keyof typeof conversionMap;

export type ConversionMapping<From, To> = {
	[K in keyof To]: ConversionFunction<From, To[K]>;
};

export type Format = keyof ColorSpace | 'sl' | 'sv';

export type Key = 'AppStorage';

// ***** Color Values *****

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

// ***** Color Values (relevant props as strings, will have leading '%' character) *****

export type CMYKValueString = {
	cyan: string;
	magenta: string;
	yellow: string;
	key: string;
};

export type HSLValueString = {
	hue: number;
	saturation: string;
	lightness: string;
};

export type HSVValueString = {
	hue: number;
	saturation: string;
	value: string;
};

export type SLValueString = {
	saturation: string;
	lightness: string;
};

export type SVValueString = {
	saturation: string;
	value: string;
};

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

export type HSLString = {
	value: HSLValueString;
	format: 'hsl';
};

export type HSVString = {
	value: HSVValueString;
	format: 'hsv';
};

export type SLString = {
	value: SLValueString;
	format: 'sl';
};

export type SVString = {
	value: SVValueString;
	format: 'sv';
};
