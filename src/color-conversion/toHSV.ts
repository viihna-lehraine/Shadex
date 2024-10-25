import { convert } from './conversion-index';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { core } from '../utils/core';
import { defaults } from '../utils/defaults';

function cmykToHSV(cmyk: types.CMYK): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.defaultHSV());
		}

		const rgb = convert.cmykToRGB(core.clone(cmyk));

		return rgbToHSV(rgb);
	} catch (error) {
		console.error(`cmykToHSV() error: ${error}`);

		return core.clone(defaults.defaultHSV());
	}
}

function hexToHSV(hex: types.Hex): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.defaultHSV());
		}

		const rgb = convert.hexToRGB(core.clone(hex));

		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`hexToHSV() error: ${error}`);

		return defaults.defaultHSV();
	}
}

function hslToHSV(hsl: types.HSL): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(hsl)) {
			console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

			return core.clone(defaults.defaultHSV());
		}

		const clonedHSL = core.clone(hsl);

		const s = clonedHSL.value.saturation / 100;
		const l = clonedHSL.value.lightness / 100;

		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			value: {
				hue: Math.round(clonedHSL.value.hue),
				saturation: Math.round(newSaturation * 100),
				value: Math.round(value * 100)
			},
			format: 'hsv'
		};
	} catch (error) {
		console.error(`hslToHSV() error: ${error}`);

		return core.clone(defaults.defaultHSV());
	}
}

function labToHSV(lab: types.LAB): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.defaultHSV());
		}

		const rgb = convert.labToRGB(core.clone(lab));

		return rgbToHSV(rgb);
	} catch (error) {
		console.error(`labToHSV() error: ${error}`);

		return core.clone(defaults.defaultHSV());
	}
}

function rgbToHSV(rgb: types.RGB): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.defaultHSV());
		}

		const clonedRGB = core.clone(rgb);

		clonedRGB.value.red /= 255;
		clonedRGB.value.green /= 255;
		clonedRGB.value.blue /= 255;

		const max = Math.max(
			clonedRGB.value.red,
			clonedRGB.value.green,
			clonedRGB.value.blue
		);
		const min = Math.min(
			clonedRGB.value.red,
			clonedRGB.value.green,
			clonedRGB.value.blue
		);
		const delta = max - min;

		let hue = 0;
		const value = max;
		const saturation = max === 0 ? 0 : delta / max;

		if (max !== min) {
			switch (max) {
				case clonedRGB.value.red:
					hue =
						(clonedRGB.value.green - clonedRGB.value.blue) / delta +
						(clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
					break;
				case clonedRGB.value.green:
					hue =
						(clonedRGB.value.blue - clonedRGB.value.red) / delta +
						2;
					break;
				case clonedRGB.value.blue:
					hue =
						(clonedRGB.value.red - clonedRGB.value.green) / delta +
						4;
					break;
			}

			hue *= 60;
		}

		return {
			value: {
				hue: Math.round(hue),
				saturation: Math.round(saturation * 100),
				value: Math.round(value * 100)
			},
			format: 'hsv'
		};
	} catch (error) {
		console.error(`rgbToHSV() error: ${error}`);

		return core.clone(defaults.defaultHSV());
	}
}

function xyzToHSV(xyz: types.XYZ): types.HSV {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultHSV());
		}

		return conversionHelpers.xyzToHSVHelper(core.clone(xyz));
	} catch (error) {
		console.error(`xyzToHSV() error: ${error}`);

		return core.clone(defaults.defaultHSV());
	}
}

export const toHSV: fnObjects.ToHSV = {
	cmykToHSV,
	hexToHSV,
	hslToHSV,
	labToHSV,
	rgbToHSV,
	xyzToHSV
};
