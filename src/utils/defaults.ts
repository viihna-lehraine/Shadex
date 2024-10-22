import * as types from '../index';

function defaultCMYK(): types.CMYK {
	return { cyan: 0, magenta: 0, yellow: 0, key: 0, format: 'cmyk' };
}

function defaultHex(): types.Hex {
	return { hex: '#000000', format: 'hex' };
}

function defaultHSL(): types.HSL {
	return { hue: 0, saturation: 0, lightness: 0, format: 'hsl' };
}

function defaultHSV(): types.HSV {
	return { hue: 0, saturation: 0, value: 0, format: 'hsv' };
}

function defaultLAB(): types.LAB {
	return { l: 0, a: 0, b: 0, format: 'lab' };
}

function defaultRGB(): types.RGB {
	return { red: 0, green: 0, blue: 0, format: 'rgb' };
}

function defaultSL(): types.SL {
	return { saturation: 0, lightness: 0, format: 'sl' };
}

function defaultSV(): types.SV {
	return { saturation: 0, value: 0, format: 'sv' };
}

function defaultXYZ(): types.XYZ {
	return { x: 0, y: 0, z: 0, format: 'xyz' };
}

export const defaults = {
	defaultCMYK,
	defaultHex,
	defaultHSL,
	defaultHSV,
	defaultLAB,
	defaultRGB,
	defaultSL,
	defaultSV,
	defaultXYZ
};
