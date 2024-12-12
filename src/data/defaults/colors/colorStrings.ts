// File: src/data/defaults/colors/colorStrings.ts

import {
	CMYKString,
	DefaultColorStringsData,
	HSLString,
	HSVString,
	LABString,
	RGBString,
	SLString,
	SVString,
	XYZString
} from '../../../index/index.js';

const cmyk: CMYKString = {
	value: { cyan: '0%', magenta: '0%', yellow: '0%', key: '0%', alpha: '1' },
	format: 'cmyk'
};

const hsl: HSLString = {
	value: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
	format: 'hsl'
};

const hsv: HSVString = {
	value: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
	format: 'hsv'
};

const lab: LABString = {
	value: { l: '0', a: '0', b: '0', alpha: '1' },
	format: 'lab'
};

const rgb: RGBString = {
	value: { red: '0', green: '0', blue: '0', alpha: '1' },
	format: 'rgb'
};

const sl: SLString = {
	value: { saturation: '0%', lightness: '0%', alpha: '1' },
	format: 'sl'
};

const sv: SVString = {
	value: { saturation: '0%', value: '0%', alpha: '1' },
	format: 'sv'
};

const xyz: XYZString = {
	value: { x: '0', y: '0', z: '0', alpha: '1' },
	format: 'xyz'
};

export const colorStrings: DefaultColorStringsData = {
	cmyk,
	hsl,
	hsv,
	lab,
	rgb,
	sl,
	sv,
	xyz
} as const;
