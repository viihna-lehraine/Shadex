// File: src/data/defaults/colors/colors.ts

import {
	CMYKUnbranded,
	DefaultBaseColorsData,
	HexUnbranded,
	HSLUnbranded,
	HSVUnbranded,
	LABUnbranded,
	RGBUnbranded,
	SLUnbranded,
	SVUnbranded,
	XYZUnbranded
} from '../../../index/index.js';

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

const hex: HexUnbranded = {
	value: {
		hex: '#000000FF',
		alpha: 'FF',
		numAlpha: 1
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

const hsv: HSVUnbranded = {
	value: {
		hue: 0,
		saturation: 0,
		value: 0,
		alpha: 1
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

const rgb: RGBUnbranded = {
	value: {
		red: 0,
		green: 0,
		blue: 0,
		alpha: 1
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

const sv: SVUnbranded = {
	value: {
		saturation: 0,
		value: 0,
		alpha: 1
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
