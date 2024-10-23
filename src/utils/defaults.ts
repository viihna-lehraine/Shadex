import * as types from '../index';

function defaultCMYK(): types.CMYK {
	return {
		value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
		format: 'cmyk'
	};
}

function defaultHex(): types.Hex {
	return { value: { hex: '#000000' }, format: 'hex' };
}

function defaultHSL(): types.HSL {
	return { value: { hue: 0, saturation: 0, lightness: 0 }, format: 'hsl' };
}

function defaultHSV(): types.HSV {
	return { value: { hue: 0, saturation: 0, value: 0 }, format: 'hsv' };
}

function defaultLAB(): types.LAB {
	return { value: { l: 0, a: 0, b: 0 }, format: 'lab' };
}

function defaultRGB(): types.RGB {
	return { value: { red: 0, green: 0, blue: 0 }, format: 'rgb' };
}

function defaultSL(): types.SL {
	return { value: { saturation: 0, lightness: 0 }, format: 'sl' };
}

function defaultSV(): types.SV {
	return { value: { saturation: 0, value: 0 }, format: 'sv' };
}

function defaultXYZ(): types.XYZ {
	return { value: { x: 0, y: 0, z: 0 }, format: 'xyz' };
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
