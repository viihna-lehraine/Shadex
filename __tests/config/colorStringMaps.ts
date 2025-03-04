import {
	CMYKStringMap,
	HexStringMap,
	HSLStringMap,
	HSVStringMap,
	LABStringMap,
	RGBStringMap,
	SLStringMap,
	SVStringMap,
	XYZStringMap
} from '../../src/types/index.js';

const validCMYKStringMap: CMYKStringMap = {
	value: { cyan: '50', magenta: '25', yellow: '15', key: '80' },
	format: 'cmyk' as 'cmyk'
};

const validHexStringMap: HexStringMap = {
	value: { hex: '#ABCDEF' },
	format: 'hex' as 'hex'
};

const validHSLStringMap: HSLStringMap = {
	value: { hue: '200', saturation: '50', lightness: '50' },
	format: 'hsl' as 'hsl'
};

const validHSVStringMap: HSVStringMap = {
	value: { hue: '200', saturation: '50', value: '50' },
	format: 'hsv' as 'hsv'
};

const validLABStringMap: LABStringMap = {
	value: { l: '50', a: '20', b: '20' },
	format: 'lab' as 'lab'
};

const validRGBStringMap: RGBStringMap = {
	value: { red: '135', green: '206', blue: '250' },
	format: 'rgb' as 'rgb'
};

const validSLStringMap: SLStringMap = {
	value: { saturation: '50', lightness: '50' },
	format: 'sl' as 'sl'
};

const validSVStringMap: SVStringMap = {
	value: { saturation: '50', value: '50' },
	format: 'sv' as 'sv'
};

const validXYZStringMap: XYZStringMap = {
	value: { x: '0.3127', y: '0.329', z: '0.3583' },
	format: 'xyz' as 'xyz'
};

const validStringMaps = {
	cmyk: validCMYKStringMap,
	hex: validHexStringMap,
	hsl: validHSLStringMap,
	hsv: validHSVStringMap,
	lab: validLABStringMap,
	rgb: validRGBStringMap,
	sl: validSLStringMap,
	sv: validSVStringMap,
	xyz: validXYZStringMap
};

// ****************************************************************
// ****************************************************************

export const stringMaps = {
	valid: validStringMaps
};
