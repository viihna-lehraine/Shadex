import { convert } from './conversion-index';
import * as types from '../index';
import { conversionHelpers } from '../helpers/conversion';

const defaultHSV: types.HSV = {
	hue: 0,
	saturation: 0,
	value: 0,
	format: 'hsv'
};

export function hexToHSV(hex: types.Hex): types.HSV {
	try {
		const rgb = convert.hexToRGB(hex);
		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`hexToHSV() error: ${error}`);
		return defaultHSV;
	}
}

export function rgbToHSV(rgb: types.RGB): types.HSV {
	try {
		rgb.red /= 255;
		rgb.green /= 255;
		rgb.blue /= 255;

		const max = Math.max(rgb.red, rgb.green, rgb.blue);
		const min = Math.min(rgb.red, rgb.green, rgb.blue);
		const delta = max - min;

		let hue = 0;
		const value = max;
		const saturation = max === 0 ? 0 : delta / max;

		if (max !== min) {
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
			value: Math.round(value * 100),
			format: 'hsv'
		};
	} catch (error) {
		console.error(`rgbToHSV() error: ${error}`);
		return defaultHSV;
	}
}

export function hslToHSV(hsl: types.HSL): types.HSV {
	try {
		const s = hsl.saturation / 100;
		const l = hsl.lightness / 100;

		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			hue: Math.round(hsl.hue),
			saturation: Math.round(newSaturation * 100),
			value: Math.round(value * 100),
			format: 'hsv'
		};
	} catch (error) {
		console.error(`hslToHSV() error: ${error}`);
		return defaultHSV;
	}
}

export function cmykToHSV(cmyk: types.CMYK): types.HSV {
	try {
		const rgb = convert.cmykToRGB(cmyk);
		return rgbToHSV(rgb);
	} catch (error) {
		console.error(`cmykToHSV() error: ${error}`);
		return defaultHSV;
	}
}

export function labToHSV(lab: types.LAB): types.HSV {
	try {
		const rgb = convert.labToRGB(lab);
		return rgbToHSV(rgb);
	} catch (error) {
		console.error(`labToHSV() error: ${error}`);
		return defaultHSV;
	}
}

export function xyzToHSV(xyz: types.XYZ): types.HSV {
	try {
		return conversionHelpers.xyzToHSVTryCaseHelper(xyz);
	} catch (error) {
		console.error(`xyzToHSV() error: ${error}`);
		return defaultHSV;
	}
}
