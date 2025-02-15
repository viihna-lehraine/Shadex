// File: types/colors/main.js

import type {
	ByteRange,
	HexSet,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../sets.js';

// ***** 1. Colors *****

export type CMYK = {
	value: {
		cyan: Percentile;
		magenta: Percentile;
		yellow: Percentile;
		key: Percentile;
	};
	format: 'cmyk';
};

export type Hex = {
	value: {
		hex: HexSet;
	};
	format: 'hex';
};

export type HSL = {
	value: {
		hue: Radial;
		saturation: Percentile;
		lightness: Percentile;
	};
	format: 'hsl';
};

export type HSV = {
	value: {
		hue: Radial;
		saturation: Percentile;
		value: Percentile;
	};
	format: 'hsv';
};

export type LAB = {
	value: {
		l: LAB_L;
		a: LAB_A;
		b: LAB_B;
	};
	format: 'lab';
};

export type RGB = {
	value: {
		red: ByteRange;
		green: ByteRange;
		blue: ByteRange;
	};
	format: 'rgb';
};

export type SL = {
	value: {
		saturation: Percentile;
		lightness: Percentile;
	};
	format: 'sl';
};

export type SV = {
	value: {
		saturation: Percentile;
		value: Percentile;
	};
	format: 'sv';
};

export type XYZ = {
	value: {
		x: XYZ_X;
		y: XYZ_Y;
		z: XYZ_Z;
	};
	format: 'xyz';
};

// ***** 2. Colors w/ String Properties *****

export type CMYKStringObject = {
	value: {
		cyan: string;
		magenta: string;
		yellow: string;
		key: string;
	};
	format: 'cmyk';
};

export type HexStringObject = {
	value: {
		hex: string;
	};
	format: 'hex';
};

export type HSLStringObject = {
	value: {
		hue: string;
		saturation: string;
		lightness: string;
	};
	format: 'hsl';
};

export type HSVStringObject = {
	value: {
		hue: string;
		saturation: string;
		value: string;
	};
	format: 'hsv';
};

export type LABStringObject = {
	value: {
		l: string;
		a: string;
		b: string;
	};
	format: 'lab';
};

export type RGBStringObject = {
	value: {
		red: string;
		green: string;
		blue: string;
	};
	format: 'rgb';
};

export type SLStringObject = {
	value: {
		saturation: string;
		lightness: string;
	};
	format: 'sl';
};

export type SVStringObject = {
	value: {
		saturation: string;
		value: string;
	};
	format: 'sv';
};

export type XYZStringObject = {
	value: {
		x: string;
		y: string;
		z: string;
	};
	format: 'xyz';
};

// ***** 3. Unbranded Colors *****

export type UnbrandedCMYK = {
	value: {
		cyan: number;
		magenta: number;
		yellow: number;
		key: number;
	};
	format: 'cmyk';
};

export type UnbrandedHex = {
	value: {
		hex: string;
	};
	format: 'hex';
};

export type UnbrandedHSL = {
	value: {
		hue: number;
		saturation: number;
		lightness: number;
	};
	format: 'hsl';
};

export type UnbrandedHSV = {
	value: {
		hue: number;
		saturation: number;
		value: number;
	};
	format: 'hsv';
};

export type UnbrandedLAB = {
	value: {
		l: number;
		a: number;
		b: number;
	};
	format: 'lab';
};

export type UnbrandedRGB = {
	value: {
		red: number;
		green: number;
		blue: number;
	};
	format: 'rgb';
};

export type UnbrandedSL = {
	value: {
		saturation: number;
		lightness: number;
	};
	format: 'sl';
};

export type UnbrandedSV = {
	value: {
		saturation: number;
		value: number;
	};
	format: 'sv';
};

export type UnbrandedXYZ = {
	value: {
		x: number;
		y: number;
		z: number;
	};
	format: 'xyz';
};
