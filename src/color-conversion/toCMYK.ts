import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { defaults } from '../utils/defaults';

function hexToCMYK(hex: types.Hex): types.CMYK {
	try {
		const clonedHex = paletteHelpers.clone(hex);
		return conversionHelpers.hexToCMYKHelper(clonedHex);
	} catch (error) {
		console.error(`Error converting hex to CMYK: ${error}`);
		return paletteHelpers.clone(defaults.defaultCMYK());
	}
}

function hslToCMYK(hsl: types.HSL): types.CMYK {
	try {
		const clonedHSL = paletteHelpers.clone(hsl);
		return conversionHelpers.hslToCMYKHelper(clonedHSL);
	} catch (error) {
		console.error(`Error converting HSL to CMYK: ${error}`);
		return paletteHelpers.clone(defaults.defaultCMYK());
	}
}

function hsvToCMYK(hsv: types.HSV): types.CMYK {
	try {
		const clonedHSV = paletteHelpers.clone(hsv);
		return conversionHelpers.hsvToCMYKHelper(clonedHSV);
	} catch (error) {
		console.error(`Error converting HSV to CMYK: ${error}`);
		return paletteHelpers.clone(defaults.defaultCMYK());
	}
}

function labToCMYK(lab: types.LAB): types.CMYK {
	try {
		const clonedLAB = paletteHelpers.clone(lab);
		return conversionHelpers.labToCMYKHelper(lab);
	} catch (error) {
		console.error(`Error converting Lab to CMYK: ${error}`);
		return paletteHelpers.clone(defaults.defaultCMYK());
	}
}

function rgbToCMYK(rgb: types.RGB): types.CMYK {
	try {
		const clonedRGB = paletteHelpers.clone(rgb);
		const redPrime = clonedRGB.value.red / 255;
		const greenPrime = clonedRGB.value.green / 255;
		const bluePrime = clonedRGB.value.blue / 255;

		const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
		const cyan = (1 - redPrime - key) / (1 - key) || 0;
		const magenta = (1 - greenPrime - key) / (1 - key) || 0;
		const yellow = (1 - bluePrime - key) / (1 - key) || 0;

		return {
			value: {
				cyan: Math.round(cyan * 100),
				magenta: Math.round(magenta * 100),
				yellow: Math.round(yellow * 100),
				key: Math.round(key * 100)
			},
			format: 'cmyk'
		};
	} catch (error) {
		console.error(`Error converting RGB to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

function xyzToCMYK(xyz: types.XYZ): types.CMYK {
	try {
		const cmyk: types.CMYK = conversionHelpers.xyzToCMYKHelper(xyz);
		return cmyk;
	} catch (error) {
		console.error(`Error converting XYZ to CMYK: ${error}`);
		return defaults.defaultCMYK();
	}
}

export const toCMYK: fnObjects.ToCMYK = {
	hexToCMYK,
	hslToCMYK,
	hsvToCMYK,
	labToCMYK,
	rgbToCMYK,
	xyzToCMYK
};
