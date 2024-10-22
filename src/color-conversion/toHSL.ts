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
		rgb.red /= 255;
		rgb.green /= 255;
		rgb.blue /= 255;

		const max = Math.max(rgb.red, rgb.green, rgb.blue);
		const min = Math.min(rgb.red, rgb.green, rgb.blue);

		let hue = 0,
			saturation = 0,
			lightness = (max + min) / 2;

		if (max !== min) {
			const delta = max - min;

			saturation =
				lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

			switch (max) {
				case rgb.red:
					hue =
						(rgb.green - rgb.blue) / delta +
						(rgb.green < rgb.blue ? 6 : 0);
					break;
				case rgb.green:
					hue = (rgb.blue - rgb.red) / delta + 2;
					break;
				case rgb.blue:
					hue = (rgb.red - rgb.green) / delta + 4;
					break;
			}
			hue *= 60;
		}

		return {
			hue: Math.round(hue),
			saturation: Math.round(saturation * 100),
			lightness: Math.round(lightness * 100),
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
			hsv.value * (1 - hsv.saturation / 100) === 0 || hsv.value === 0
				? 0
				: (hsv.value - hsv.value * (1 - hsv.saturation / 100)) /
					Math.min(hsv.value, 100 - hsv.value);

		const lightness = hsv.value * (1 - hsv.saturation / 200);

		return {
			hue: Math.round(hsv.hue),
			saturation: Math.round(newSaturation * 100),
			lightness: Math.round(lightness),
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
