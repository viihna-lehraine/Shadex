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

export interface ColorDataExtended {
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

export interface ColorDataAssertion {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	xyz: XYZ;
}

export type ColorPartial = SL | SV;

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb' | 'xyz';

export type ColorSpaceExtended = ColorSpace | 'sl' | 'sv';

export type ColorString =
	| CMYKString
	| Hex
	| HSLString
	| HSVString
	| LABString
	| RGBString
	| SLString
	| SVString
	| XYZString;

export type ColorStringExtended = ColorString | Hex | LAB | RGB | XYZ;

export type Format = keyof ColorSpace | 'sl' | 'sv';

export interface PaletteOptions {
	numBoxes: number;
	customColor: HSL | null;
	paletteType: number;
	enableAlpha: boolean;
	limitBright: boolean;
	limitDark: boolean;
	limitGray: boolean;
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

export type HexString = Hex;

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

// ***** Color Values *****

export type CMYKValue = {
	cyan: number;
	magenta: number;
	yellow: number;
	key: number;
	alpha: number;
};

export type HexValue = {
	hex: string;
	alpha: string;
	numericAlpha: number;
};

export type HSLValue = {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
};

export type HSVValue = {
	hue: number;
	saturation: number;
	value: number;
	alpha: number;
};

export type LABValue = {
	l: number;
	a: number;
	b: number;
	alpha: number;
};

export type RGBValue = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type SLValue = {
	saturation: number;
	lightness: number;
	alpha: number;
};

export type SVValue = {
	saturation: number;
	value: number;
	alpha: number;
};

export type XYZValue = {
	x: number;
	y: number;
	z: number;
	alpha: number;
};

// ***** Color Values (relevant props as strings, will have leading '%' character) *****

export type CMYKValueString = {
	cyan: string;
	magenta: string;
	yellow: string;
	key: string;
	alpha: string;
};

export type HexValueString = HexValue;

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
