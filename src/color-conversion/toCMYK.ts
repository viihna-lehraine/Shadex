import { conversionHelpers } from '../helpers/conversion';
import * as types from '../index';
import { defaults } from '../utils/defaults';

export function hexToCMYK(hex: types.Hex): types.CMYK {
	try {
		return conversionHelpers.hexToCMYKTryCaseHelper(hex);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

export function hslToCMYK(hsl: types.HSL): types.CMYK {
	try {
		return conversionHelpers.hslToCMYKTryCaseHelper(hsl);
	} catch (error) {
		console.error(`Error converting HSL to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

export function hsvToCMYK(hsv: types.HSV): types.CMYK {
	try {
		return conversionHelpers.hsvToCMYKTryCaseHelper(hsv);
	} catch (error) {
		console.error(`Error converting HSV to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

export function labToCMYK(lab: types.LAB): types.CMYK {
	try {
		return conversionHelpers.labToCMYKTryCaseHelper(lab);
	} catch (error) {
		console.error(`Error converting Lab to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

export function rgbToCMYK(rgb: types.RGB): types.CMYK {
	try {
		const redPrime = rgb.red / 255;
		const greenPrime = rgb.green / 255;
		const bluePrime = rgb.blue / 255;

		const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
		const cyan = (1 - redPrime - key) / (1 - key) || 0;
		const magenta = (1 - greenPrime - key) / (1 - key) || 0;
		const yellow = (1 - bluePrime - key) / (1 - key) || 0;

		return {
			cyan: Math.round(cyan * 100),
			magenta: Math.round(magenta * 100),
			yellow: Math.round(yellow * 100),
			key: Math.round(key * 100),
			format: 'cmyk'
		};
	} catch (error) {
		console.error(`Error converting RGB to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

export function xyzToCMYK(xyz: types.XYZ): types.CMYK {
	try {
		const cmyk: types.CMYK = conversionHelpers.xyzToCMYKTryCaseHelper(xyz);
		return cmyk;
	} catch (error) {
		console.error(`Error converting XYZ to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}
