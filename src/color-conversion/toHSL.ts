import { convert } from './conversion-index';
import { conversionHelpers } from '../helpers/conversion';
import * as types from '../index';
import { defaults } from '../utils/defaults';

export function hexToHSL(hex: types.Hex): types.HSL {
	try {
		const rgb = convert.hexToRGB(hex);
		return rgbToHSL(rgb);
	} catch (error) {
		console.error(`hexToHSL() error: ${error}`);
		return defaults.defaultHSL();
	}
}

export function rgbToHSL(rgb: types.RGB): types.HSL {
	try {
		rgb.value.red /= 255;
		rgb.value.green /= 255;
		rgb.value.blue /= 255;

		const max = Math.max(rgb.value.red, rgb.value.green, rgb.value.blue);
		const min = Math.min(rgb.value.red, rgb.value.green, rgb.value.blue);

		let hue = 0,
			saturation = 0,
			lightness = (max + min) / 2;

		if (max !== min) {
			const delta = max - min;

			saturation =
				lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

			switch (max) {
				case rgb.value.red:
					hue =
						(rgb.value.green - rgb.value.blue) / delta +
						(rgb.value.green < rgb.value.blue ? 6 : 0);
					break;
				case rgb.value.green:
					hue = (rgb.value.blue - rgb.value.red) / delta + 2;
					break;
				case rgb.value.blue:
					hue = (rgb.value.red - rgb.value.green) / delta + 4;
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
		return defaults.defaultHSL();
	}
}

export function hsvToHSL(hsv: types.HSV): types.HSL {
	try {
		const newSaturation =
			hsv.value.value * (1 - hsv.value.saturation / 100) === 0 ||
			hsv.value.value === 0
				? 0
				: (hsv.value.value -
						hsv.value.value * (1 - hsv.value.saturation / 100)) /
					Math.min(hsv.value.value, 100 - hsv.value.value);

		const lightness = hsv.value.value * (1 - hsv.value.saturation / 200);

		return {
			value: {
				hue: Math.round(hsv.value.hue),
				saturation: Math.round(newSaturation * 100),
				lightness: Math.round(lightness)
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`hsvToHSL() error: ${error}`);
		return defaults.defaultHSL();
	}
}

export function cmykToHSL(cmyk: types.CMYK): types.HSL {
	try {
		const rgb = convert.cmykToRGB(cmyk);
		return rgbToHSL(rgb);
	} catch (error) {
		console.error(`cmykToHSL() error: ${error}`);
		return defaults.defaultHSL();
	}
}

export function labToHSL(lab: types.LAB): types.HSL {
	try {
		const rgb = convert.labToRGB(lab);
		return rgbToHSL(rgb);
	} catch (error) {
		console.error(`labToHSL() error: ${error}`);
		return defaults.defaultHSL();
	}
}

export function xyzToHSL(xyz: types.XYZ): types.HSL {
	try {
		const hsl = conversionHelpers.xyzToHSLTryCaseHelper(xyz);
		return hsl;
	} catch (error) {
		console.error(`xyzToHSL() error: ${error}`);
		return defaults.defaultHSL();
	}
}
