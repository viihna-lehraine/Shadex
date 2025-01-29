// File: types/colors/main.js

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
} from '../sets.js';

// ***** 1. Colors *****

export type CMYK = {
	value: {
		cyan: Percentile;
		magenta: Percentile;
		yellow: Percentile;
		key: Percentile;
		alpha: AlphaRange;
	};
	format: 'cmyk';
};

export type Hex = {
	value: {
		hex: HexSet;
		alpha: HexComponent;
		numAlpha: AlphaRange;
	};
	format: 'hex';
};

export type HSL = {
	value: {
		hue: Radial;
		saturation: Percentile;
		lightness: Percentile;
		alpha: AlphaRange;
	};
	format: 'hsl';
};

export type HSV = {
	value: {
		hue: Radial;
		saturation: Percentile;
		value: Percentile;
		alpha: AlphaRange;
	};
	format: 'hsv';
};

export type LAB = {
	value: {
		l: LAB_L;
		a: LAB_A;
		b: LAB_B;
		alpha: AlphaRange;
	};
	format: 'lab';
};

export type RGB = {
	value: {
		red: ByteRange;
		green: ByteRange;
		blue: ByteRange;
		alpha: AlphaRange;
	};
	format: 'rgb';
};

export type SL = {
	value: {
		saturation: Percentile;
		lightness: Percentile;
		alpha: AlphaRange;
	};
	format: 'sl';
};

export type SV = {
	value: {
		saturation: Percentile;
		value: Percentile;
		alpha: AlphaRange;
	};
	format: 'sv';
};

export type XYZ = {
	value: {
		x: XYZ_X;
		y: XYZ_Y;
		z: XYZ_Z;
		alpha: AlphaRange;
	};
	format: 'xyz';
};

// ***** 2. Colors w/ String Properties *****

export type CMYK_StringProps = {
	value: {
		cyan: string;
		magenta: string;
		yellow: string;
		key: string;
		alpha: string;
	};
	format: 'cmyk';
};

export type Hex_StringProps = {
	value: {
		hex: string;
		alpha: string;
		numAlpha: string;
	};
	format: 'hex';
};

export type HSL_StringProps = {
	value: {
		hue: string;
		saturation: string;
		lightness: string;
		alpha: string;
	};
	format: 'hsl';
};

export type HSV_StringProps = {
	value: {
		hue: string;
		saturation: string;
		value: string;
		alpha: string;
	};
	format: 'hsv';
};

export type LAB_StringProps = {
	value: {
		l: string;
		a: string;
		b: string;
		alpha: string;
	};
	format: 'lab';
};

export type RGB_StringProps = {
	value: {
		red: string;
		green: string;
		blue: string;
		alpha: string;
	};
	format: 'rgb';
};

export type SL_StringProps = {
	value: {
		saturation: string;
		lightness: string;
		alpha: string;
	};
	format: 'sl';
};

export type SV_StringProps = {
	value: {
		saturation: string;
		value: string;
		alpha: string;
	};
	format: 'sv';
};

export type XYZ_StringProps = {
	value: {
		x: string;
		y: string;
		z: string;
		alpha: string;
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
		alpha: number;
	};
	format: 'cmyk';
};

export type UnbrandedHex = {
	value: {
		hex: string;
		alpha: string;
		numAlpha: number;
	};
	format: 'hex';
};

export type UnbrandedHSL = {
	value: {
		hue: number;
		saturation: number;
		lightness: number;
		alpha: number;
	};
	format: 'hsl';
};

export type UnbrandedHSV = {
	value: {
		hue: number;
		saturation: number;
		value: number;
		alpha: number;
	};
	format: 'hsv';
};

export type UnbrandedLAB = {
	value: {
		l: number;
		a: number;
		b: number;
		alpha: number;
	};
	format: 'lab';
};

export type UnbrandedRGB = {
	value: {
		red: number;
		green: number;
		blue: number;
		alpha: number;
	};
	format: 'rgb';
};

export type UnbrandedSL = {
	value: {
		saturation: number;
		lightness: number;
		alpha: number;
	};
	format: 'sl';
};

export type UnbrandedSV = {
	value: {
		saturation: number;
		value: number;
		alpha: number;
	};
	format: 'sv';
};

export type UnbrandedXYZ = {
	value: {
		x: number;
		y: number;
		z: number;
		alpha: number;
	};
	format: 'xyz';
};
