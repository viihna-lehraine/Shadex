// File: src/data/defaults/colors/colors.js

import {
	CMYK,
	CMYKUnbranded,
	DefaultBaseColorsData,
	DefaultBaseColorsDataBranded,
	Hex,
	HexUnbranded,
	HSL,
	HSLUnbranded,
	HSV,
	HSVUnbranded,
	LAB,
	LABUnbranded,
	RGB,
	RGBUnbranded,
	SL,
	SLUnbranded,
	SV,
	SVUnbranded,
	XYZ,
	XYZUnbranded
} from '../../../index/index.js';
import { brand } from '../../../common/core/base.js';

const cmyk: CMYKUnbranded = {
	value: {
		cyan: 0,
		magenta: 0,
		yellow: 0,
		key: 0,
		alpha: 1
	},
	format: 'cmyk'
};

const cmykBranded: CMYK = {
	value: {
		cyan: brand.asPercentile(0),
		magenta: brand.asPercentile(0),
		yellow: brand.asPercentile(0),
		key: brand.asPercentile(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'cmyk'
};

const hex: HexUnbranded = {
	value: {
		hex: '#000000FF',
		alpha: 'FF',
		numAlpha: 1
	},
	format: 'hex'
};

const hexBranded: Hex = {
	value: {
		hex: brand.asHexSet('#000000'),
		alpha: brand.asHexComponent('FF'),
		numAlpha: brand.asAlphaRange(1)
	},
	format: 'hex'
};

const hsl: HSLUnbranded = {
	value: {
		hue: 0,
		saturation: 0,
		lightness: 0,
		alpha: 1
	},
	format: 'hsl'
};

const hslBranded: HSL = {
	value: {
		hue: brand.asRadial(0),
		saturation: brand.asPercentile(0),
		lightness: brand.asPercentile(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'hsl'
};

const hsv: HSVUnbranded = {
	value: {
		hue: 0,
		saturation: 0,
		value: 0,
		alpha: 1
	},
	format: 'hsv'
};

const hsvBranded: HSV = {
	value: {
		hue: brand.asRadial(0),
		saturation: brand.asPercentile(0),
		value: brand.asPercentile(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'hsv'
};

const lab: LABUnbranded = {
	value: {
		l: 0,
		a: 0,
		b: 0,
		alpha: 1
	},
	format: 'lab'
};

const labBranded: LAB = {
	value: {
		l: brand.asLAB_L(0),
		a: brand.asLAB_A(0),
		b: brand.asLAB_B(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'lab'
};

const rgb: RGBUnbranded = {
	value: {
		red: 0,
		green: 0,
		blue: 0,
		alpha: 1
	},
	format: 'rgb'
};

const rgbBranded: RGB = {
	value: {
		red: brand.asByteRange(0),
		green: brand.asByteRange(0),
		blue: brand.asByteRange(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'rgb'
};

const sl: SLUnbranded = {
	value: {
		saturation: 0,
		lightness: 0,
		alpha: 1
	},
	format: 'sl'
};

const slBranded: SL = {
	value: {
		saturation: brand.asPercentile(0),
		lightness: brand.asPercentile(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'sl'
};

const sv: SVUnbranded = {
	value: {
		saturation: 0,
		value: 0,
		alpha: 1
	},
	format: 'sv'
};

const svBranded: SV = {
	value: {
		saturation: brand.asPercentile(0),
		value: brand.asPercentile(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'sv'
};

const xyz: XYZUnbranded = {
	value: {
		x: 0,
		y: 0,
		z: 0,
		alpha: 1
	},
	format: 'xyz'
};

const xyzBranded: XYZ = {
	value: {
		x: brand.asXYZ_X(0),
		y: brand.asXYZ_Y(0),
		z: brand.asXYZ_Z(0),
		alpha: brand.asAlphaRange(1)
	},
	format: 'xyz'
};

export const brandedColors: DefaultBaseColorsDataBranded = {
	cmyk: cmykBranded,
	hex: hexBranded,
	hsl: hslBranded,
	hsv: hsvBranded,
	lab: labBranded,
	rgb: rgbBranded,
	sl: slBranded,
	sv: svBranded,
	xyz: xyzBranded
};

export const colors: DefaultBaseColorsData = {
	cmyk,
	hex,
	hsl,
	hsv,
	lab,
	rgb,
	sl,
	sv,
	xyz
} as const;
