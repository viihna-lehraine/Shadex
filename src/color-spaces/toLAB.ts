import { convert } from './color-space-index';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { core } from '../utils/core';
import { defaults } from '../config/defaults';

function cmykToLAB(cmyk: colors.CMYK): colors.LAB {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.lab);
		}

		return xyzToLAB(convert.rgbToXYZ(convert.cmykToRGB(core.clone(cmyk))));
	} catch (error) {
		console.error(`cmykToLab() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

function hexToLAB(hex: colors.Hex): colors.LAB {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.lab);
		}

		return xyzToLAB(convert.rgbToXYZ(convert.hexToRGB(core.clone(hex))));
	} catch (error) {
		console.error(`hexToLAB() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

function hslToLAB(hsl: colors.HSL): colors.LAB {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.lab);
		}

		return xyzToLAB(convert.rgbToXYZ(convert.hslToRGB(core.clone(hsl))));
	} catch (error) {
		console.error(`hslToLab() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

function hsvToLAB(hsv: colors.HSV): colors.LAB {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.lab);
		}

		return xyzToLAB(convert.rgbToXYZ(convert.hsvToRGB(core.clone(hsv))));
	} catch (error) {
		console.error(`hsvToLab() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

function rgbToLAB(rgb: colors.RGB): colors.LAB {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.lab);
		}

		return xyzToLAB(convert.rgbToXYZ(core.clone(rgb)));
	} catch (error) {
		console.error(`rgbToLab() error: ${error}`);

		return defaults.lab;
	}
}

function xyzToLAB(xyz: colors.XYZ): colors.LAB {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.lab);
		}

		const clonedXYZ = core.clone(xyz);
		const refX = 95.047,
			refY = 100.0,
			refZ = 108.883;

		clonedXYZ.value.x = clonedXYZ.value.x / refX;
		clonedXYZ.value.y = clonedXYZ.value.y / refY;
		clonedXYZ.value.z = clonedXYZ.value.z / refZ;

		clonedXYZ.value.x =
			clonedXYZ.value.x > 0.008856
				? Math.pow(clonedXYZ.value.x, 1 / 3)
				: 7.787 * clonedXYZ.value.x + 16 / 116;
		clonedXYZ.value.y =
			clonedXYZ.value.y > 0.008856
				? Math.pow(clonedXYZ.value.y, 1 / 3)
				: 7.787 * clonedXYZ.value.y + 16 / 116;
		clonedXYZ.value.z =
			clonedXYZ.value.z > 0.008856
				? Math.pow(clonedXYZ.value.z, 1 / 3)
				: 7.787 * clonedXYZ.value.z + 16 / 116;

		const l = paletteHelpers.sanitizePercentage(
			parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2))
		);
		const a = paletteHelpers.sanitizeLAB(
			parseFloat(
				(500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)
			)
		);
		const b = paletteHelpers.sanitizeLAB(
			parseFloat(
				(200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)
			)
		);
		const lab: colors.LAB = { value: { l, a, b }, format: 'lab' };

		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.lab);
		}

		return { value: { l, a, b }, format: 'lab' };
	} catch (error) {
		console.error(`xyzToLab() error: ${error}`);

		return core.clone(defaults.lab);
	}
}

export const toLAB: fnObjects.ToLAB = {
	cmykToLAB,
	hexToLAB,
	hslToLAB,
	hsvToLAB,
	rgbToLAB,
	xyzToLAB
};
