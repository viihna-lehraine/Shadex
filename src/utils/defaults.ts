import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';

function defaultCMYK(): colors.CMYK {
	return {
		value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
		format: 'cmyk'
	};
}

function defaultHex(): colors.Hex {
	return { value: { hex: '#000000' }, format: 'hex' };
}

function defaultHSL(): colors.HSL {
	return { value: { hue: 0, saturation: 0, lightness: 0 }, format: 'hsl' };
}

function defaultHSV(): colors.HSV {
	return { value: { hue: 0, saturation: 0, value: 0 }, format: 'hsv' };
}

function defaultLAB(): colors.LAB {
	return { value: { l: 0, a: 0, b: 0 }, format: 'lab' };
}

function defaultRGB(): colors.RGB {
	return { value: { red: 0, green: 0, blue: 0 }, format: 'rgb' };
}

function defaultSL(): colors.SL {
	return { value: { saturation: 0, lightness: 0 }, format: 'sl' };
}

function defaultSV(): colors.SV {
	return { value: { saturation: 0, value: 0 }, format: 'sv' };
}

function defaultXYZ(): colors.XYZ {
	return { value: { x: 0, y: 0, z: 0 }, format: 'xyz' };
}

export const defaults: fnObjects.Defaults = {
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
