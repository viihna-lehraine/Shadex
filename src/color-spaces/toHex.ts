import { convert } from '../color-spaces/color-space-index';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { defaults } from '../config/defaults';
import { core } from '../utils/core';
import { transform } from '../utils/transform';

function cmykToHex(cmyk: colors.CMYK): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid hex value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.hex);
		}

		const hex = rgbToHex(convert.cmykToRGB(core.clone(cmyk)));

		console.log(
			`Converted CMYK ${JSON.stringify(core.clone(cmyk))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`cmykToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function hslToHex(hsl: colors.HSL): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.hex);
		}

		const hex = rgbToHex(convert.hslToRGB(core.clone(hsl)));

		console.log(
			`Converted HSL ${JSON.stringify(core.clone(hsl))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`hslToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function hsvToHex(hsv: colors.HSV): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.hex);
		}

		const hex = rgbToHex(convert.hsvToRGB(core.clone(hsv)));

		console.log(
			`Converted HSV ${JSON.stringify(core.clone(hsv))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`hsvToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function labToHex(lab: colors.LAB): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.hex);
		}

		const hex = rgbToHex(convert.labToRGB(core.clone(lab)));

		console.log(
			`Converted LAB ${JSON.stringify(core.clone(lab))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`labToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function rgbToHex(rgb: colors.RGB): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.hex);
		}

		const clonedRGB = core.clone(rgb);

		if (
			[
				clonedRGB.value.red,
				clonedRGB.value.green,
				clonedRGB.value.blue
			].some(v => isNaN(v) || v < 0 || v > 255)
		) {
			console.warn(
				`Invalid RGB values: R=${JSON.stringify(clonedRGB.value.red)}, G=${JSON.stringify(clonedRGB.value.green)}, B=${JSON.stringify(clonedRGB.value.blue)}`
			);

			return { value: { hex: '#000000' }, format: 'hex' };
		}

		return {
			value: {
				hex: `#${transform.componentToHex(clonedRGB.value.red)}${transform.componentToHex(clonedRGB.value.green)}${transform.componentToHex(clonedRGB.value.blue)}`
			},
			format: 'hex'
		};
	} catch (error) {
		console.warn(`rgbToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

function xyzToHex(xyz: colors.XYZ): colors.Hex {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.hex);
		}

		return conversionHelpers.xyzToHexHelper(core.clone(xyz));
	} catch (error) {
		console.warn(`xyzToHex error: ${error}`);

		return core.clone(defaults.hex);
	}
}

export const toHex: fnObjects.ToHex = {
	cmykToHex,
	hslToHex,
	hsvToHex,
	labToHex,
	rgbToHex,
	xyzToHex
};
