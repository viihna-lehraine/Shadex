import { convert } from '../color-conversion/conversion-index';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as types from '../index/types';
import * as fnObjects from '../index/fn-objects';
import { defaults } from '../utils/defaults';
import { core } from '../utils/core';
import { transforms } from '../utils/transforms';

function cmykToHex(cmyk: types.CMYK): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid hex value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.defaultHex());
		}

		const hex = rgbToHex(convert.cmykToRGB(core.clone(cmyk)));

		console.log(
			`Converted CMYK ${JSON.stringify(core.clone(cmyk))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`cmykToHex error: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function hslToHex(hsl: types.HSL): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.defaultHex());
		}

		const hex = rgbToHex(convert.hslToRGB(core.clone(hsl)));

		console.log(
			`Converted HSL ${JSON.stringify(core.clone(hsl))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`hslToHex error: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function hsvToHex(hsv: types.HSV): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.defaultHex());
		}

		const hex = rgbToHex(convert.hsvToRGB(core.clone(hsv)));

		console.log(
			`Converted HSV ${JSON.stringify(core.clone(hsv))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`hsvToHex error: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function labToHex(lab: types.LAB): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.defaultHex());
		}

		const hex = rgbToHex(convert.labToRGB(core.clone(lab)));

		console.log(
			`Converted LAB ${JSON.stringify(core.clone(lab))} to hex: ${JSON.stringify(core.clone(hex))}`
		);

		return hex;
	} catch (error) {
		console.warn(`labToHex error: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function rgbToHex(rgb: types.RGB): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.defaultHex());
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
				hex: `#${transforms.componentToHex(clonedRGB.value.red)}${transforms.componentToHex(clonedRGB.value.green)}${transforms.componentToHex(clonedRGB.value.blue)}`
			},
			format: 'hex'
		};
	} catch (error) {
		console.warn(`rgbToHex error: ${error}`);

		return core.clone(defaults.defaultHex());
	}
}

function xyzToHex(xyz: types.XYZ): types.Hex {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultHex());
		}

		return conversionHelpers.xyzToHexHelper(core.clone(xyz));
	} catch (error) {
		console.warn(`xyzToHex error: ${error}`);

		return core.clone(defaults.defaultHex());
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
