import {
	CMYK,
	CMYKNumMap,
	Hex,
	HexNumMap,
	HSLNumMap,
	HSVNumMap,
	LAB,
	LABNumMap,
	LAB_A,
	LAB_B,
	LAB_L,
	RGB,
	RGBNumMap,
	SL,
	SLNumMap,
	SV,
	SVNumMap,
	XYZ,
	XYZNumMap
} from '../../src/types/index.js';
import { NumberBrand, StringBrand } from './other.js';

const validCMYKNumMap: CMYKNumMap = {
	value: {
		cyan: 50,
		magenta: 25,
		yellow: 15,
		key: 80
	},
	format: 'cmyk' as 'cmyk'
};

const validHexNumMap: HexNumMap = {
	value: { hex: '#ABCDEF' },
	format: 'hex' as 'hex'
};

const validHSLNumMap: HSLNumMap = {
	value: { hue: 200, saturation: 50, lightness: 50 },
	format: 'hsl' as 'hsl'
};

const validHSVNumMap: HSVNumMap = {
	value: { hue: 200, saturation: 50, value: 50 },
	format: 'hsv' as 'hsv'
};

const validLABNumMap: LABNumMap = {
	value: { l: 50, a: 20, b: 20 },
	format: 'lab' as 'lab'
};

const validRGBNumMap: RGBNumMap = {
	value: { red: 135, green: 206, blue: 250 },
	format: 'rgb' as 'rgb'
};

const validSLNumMap: SLNumMap = {
	value: { saturation: 50, lightness: 50 },
	format: 'sl' as 'sl'
};

const validSVNumMap: SVNumMap = {
	value: { saturation: 50, value: 50 },
	format: 'sv' as 'sv'
};

const validXYZNumMap: XYZNumMap = {
	value: { x: 0.3127, y: 0.329, z: 0.3583 },
	format: 'xyz' as 'xyz'
};

const validNumMaps = {
	cmyk: validCMYKNumMap,
	hex: validHexNumMap,
	hsl: validHSLNumMap,
	hsv: validHSVNumMap,
	lab: validLABNumMap,
	rgb: validRGBNumMap,
	sl: validSLNumMap,
	sv: validSVNumMap,
	xyz: validXYZNumMap
};

// ****************************************************************
// ****************************************************************

export const numMaps = {
	valid: validNumMaps
};
