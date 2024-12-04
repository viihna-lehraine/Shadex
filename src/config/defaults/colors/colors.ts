// File: src/config/defaults/colors/main.ts

import { CMYK, Hex, HSL, HSV, LAB, RGB, SL, SV, XYZ } from '../../../index';

const cmyk: CMYK = {
	value: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
	format: 'cmyk'
};

const hex: Hex = {
	value: {
		hex: '#000000FF',
		alpha: 'FF',
		numAlpha: 1
	},
	format: 'hex'
};

const hsl: HSL = {
	value: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
	format: 'hsl'
};

const hsv: HSV = {
	value: { hue: 0, saturation: 0, value: 0, alpha: 1 },
	format: 'hsv'
};

const lab: LAB = {
	value: { l: 0, a: 0, b: 0, alpha: 1 },
	format: 'lab'
};

const rgb: RGB = {
	value: { red: 0, green: 0, blue: 0, alpha: 1 },
	format: 'rgb'
};

const sl: SL = {
	value: { saturation: 0, lightness: 0, alpha: 1 },
	format: 'sl'
};

const sv: SV = {
	value: { saturation: 0, value: 0, alpha: 1 },
	format: 'sv'
};

const xyz: XYZ = {
	value: { x: 0, y: 0, z: 0, alpha: 1 },
	format: 'xyz'
};

export const colors = { cmyk, hex, hsl, hsv, lab, rgb, sl, sv, xyz };
