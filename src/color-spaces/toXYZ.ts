import { defaults } from '../config/defaults';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { core } from '../utils/core';

function cmykToXYZ(cmyk: colors.CMYK): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.xyz);
		}

		return conversionHelpers.cmykToXYZHelper(core.clone(cmyk));
	} catch (error) {
		console.error(`cmykToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function hexToXYZ(hex: colors.Hex): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.xyz);
		}

		return conversionHelpers.hexToXYZHelper(core.clone(hex));
	} catch (error) {
		console.error(`hexToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function hslToXYZ(hsl: colors.HSL): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.xyz);
		}

		return conversionHelpers.hslToXYZHelper(core.clone(hsl));
	} catch (error) {
		console.error(`hslToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function hsvToXYZ(hsv: colors.HSV): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.xyz);
		}

		return conversionHelpers.hsvToXYZHelper(core.clone(hsv));
	} catch (error) {
		console.error(`hsvToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function labToXYZ(lab: colors.LAB): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.xyz);
		}

		const clonedLAB = core.clone(lab);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		let y = (clonedLAB.value.l + 16) / 116;
		let x = clonedLAB.value.a / 500 + y;
		let z = y - clonedLAB.value.b / 200;

		const pow = Math.pow;

		return {
			value: {
				x:
					refX *
					(pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787),
				y:
					refY *
					(pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787),
				z:
					refZ *
					(pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787)
			},
			format: 'xyz'
		};
	} catch (error) {
		console.error(`labToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

function rgbToXYZ(rgb: colors.RGB): colors.XYZ {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.xyz);
		}

		const clonedRGB = core.clone(rgb);

		clonedRGB.value.red = clonedRGB.value.red / 255;
		clonedRGB.value.green = clonedRGB.value.green / 255;
		clonedRGB.value.blue = clonedRGB.value.blue / 255;

		clonedRGB.value.red =
			clonedRGB.value.red > 0.04045
				? Math.pow((clonedRGB.value.red + 0.055) / 1.055, 2.4)
				: clonedRGB.value.red / 12.92;
		clonedRGB.value.green =
			clonedRGB.value.green > 0.04045
				? Math.pow((clonedRGB.value.green + 0.055) / 1.055, 2.4)
				: clonedRGB.value.green / 12.92;
		clonedRGB.value.blue =
			clonedRGB.value.blue > 0.04045
				? Math.pow((clonedRGB.value.blue + 0.055) / 1.055, 2.4)
				: clonedRGB.value.blue / 12.92;

		clonedRGB.value.red = clonedRGB.value.red * 100;
		clonedRGB.value.green = clonedRGB.value.green * 100;
		clonedRGB.value.blue = clonedRGB.value.blue * 100;

		return {
			value: {
				x:
					clonedRGB.value.red * 0.4124 +
					clonedRGB.value.green * 0.3576 +
					clonedRGB.value.blue * 0.1805,
				y:
					clonedRGB.value.red * 0.2126 +
					clonedRGB.value.green * 0.7152 +
					clonedRGB.value.blue * 0.0722,
				z:
					clonedRGB.value.red * 0.0193 +
					clonedRGB.value.green * 0.1192 +
					clonedRGB.value.blue * 0.9505
			},
			format: 'xyz'
		};
	} catch (error) {
		console.error(`rgbToXYZ error: ${error}`);

		return core.clone(defaults.xyz);
	}
}

export const toXYZ: fnObjects.ToXYZ = {
	cmykToXYZ,
	hexToXYZ,
	hslToXYZ,
	hsvToXYZ,
	labToXYZ,
	rgbToXYZ
};
