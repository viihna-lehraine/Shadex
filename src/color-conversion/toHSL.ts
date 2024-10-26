import { convert } from './conversion-index';
import { conversionHelpers } from '../helpers/conversion';
import { paletteHelpers } from '../helpers/palette';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { core } from '../utils/core';
import { defaults } from '../utils/defaults';

function cmykToHSL(cmyk: colors.CMYK): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(cmyk)) {
			console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);

			return core.clone(defaults.defaultHSL());
		}

		const rgb = convert.cmykToRGB(core.clone(cmyk));

		return rgbToHSL(rgb);
	} catch (error) {
		console.error(`cmykToHSL() error: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function hexToHSL(hex: colors.Hex): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(hex)) {
			console.error(`Invalid Hex value ${JSON.stringify(hex)}`);

			return core.clone(defaults.defaultHSL());
		}

		const rgb = convert.hexToRGB(core.clone(hex));

		return rgbToHSL(rgb);
	} catch (error) {
		console.error(`hexToHSL() error: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function hsvToHSL(hsv: colors.HSV): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(hsv)) {
			console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);

			return core.clone(defaults.defaultHSL());
		}

		const clonedHSV = core.clone(hsv);

		const newSaturation =
			clonedHSV.value.value * (1 - clonedHSV.value.saturation / 100) ===
				0 || clonedHSV.value.value === 0
				? 0
				: (clonedHSV.value.value -
						clonedHSV.value.value *
							(1 - clonedHSV.value.saturation / 100)) /
					Math.min(
						clonedHSV.value.value,
						100 - clonedHSV.value.value
					);

		const lightness =
			clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);

		return {
			value: {
				hue: Math.round(clonedHSV.value.hue),
				saturation: Math.round(newSaturation * 100),
				lightness: Math.round(lightness)
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`hsvToHSL() error: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function labToHSL(lab: colors.LAB): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(lab)) {
			console.error(`Invalid LAB value ${JSON.stringify(lab)}`);

			return core.clone(defaults.defaultHSL());
		}

		const rgb = convert.labToRGB(core.clone(lab));
		return rgbToHSL(rgb);
	} catch (error) {
		console.error(`labToHSL() error: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function rgbToHSL(rgb: colors.RGB): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(rgb)) {
			console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

			return core.clone(defaults.defaultHSL());
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

		let hue = 0,
			saturation = 0,
			lightness = (max + min) / 2;

		if (max !== min) {
			const delta = max - min;

			saturation =
				lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

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
				lightness: Math.round(lightness * 100)
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`rgbToHSL() error: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

function xyzToHSL(xyz: colors.XYZ): colors.HSL {
	try {
		if (!paletteHelpers.validateColorValues(xyz)) {
			console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);

			return core.clone(defaults.defaultHSL());
		}

		return conversionHelpers.xyzToHSLHelper(core.clone(xyz));
	} catch (error) {
		console.error(`xyzToHSL() error: ${error}`);

		return core.clone(defaults.defaultHSL());
	}
}

export const toHSL: fnObjects.ToHSL = {
	cmykToHSL,
	hexToHSL,
	hsvToHSL,
	rgbToHSL,
	labToHSL,
	xyzToHSL
};
