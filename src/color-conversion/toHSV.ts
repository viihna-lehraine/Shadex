import { convert } from './conversion-index';
import { conversionHelpers } from '../helpers/conversion';
import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { defaults } from '../utils/defaults';

function cmykToHSV(cmyk: types.CMYK): types.HSV {
	try {
		const rgb = convert.cmykToRGB(cmyk);
		return rgbToHSV(rgb);
	} catch (error) {
		console.error(`cmykToHSV() error: ${error}`);
		return defaults.defaultHSV();
	}
}

function hexToHSV(hex: types.Hex): types.HSV {
	try {
		const rgb = convert.hexToRGB(hex);
		return convert.rgbToHSV(rgb);
	} catch (error) {
		console.error(`hexToHSV() error: ${error}`);
		return defaults.defaultHSV();
	}
}

function hslToHSV(hsl: types.HSL): types.HSV {
	try {
		const s = hsl.value.saturation / 100;
		const l = hsl.value.lightness / 100;

		const value = l + s * Math.min(l, 1 - 1);
		const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);

		return {
			value: {
				hue: Math.round(hsl.value.hue),
				saturation: Math.round(newSaturation * 100),
				value: Math.round(value * 100)
			},
			format: 'hsv'
		};
	} catch (error) {
		console.error(`hslToHSV() error: ${error}`);
		return defaults.defaultHSV();
	}
}

function labToHSV(lab: types.LAB): types.HSV {
	try {
		const rgb = convert.labToRGB(lab);
		return rgbToHSV(rgb);
	} catch (error) {
		console.error(`labToHSV() error: ${error}`);
		return defaults.defaultHSV();
	}
}

function rgbToHSV(rgb: types.RGB): types.HSV {
	try {
		rgb.value.red /= 255;
		rgb.value.green /= 255;
		rgb.value.blue /= 255;

		const max = Math.max(rgb.value.red, rgb.value.green, rgb.value.blue);
		const min = Math.min(rgb.value.red, rgb.value.green, rgb.value.blue);
		const delta = max - min;

		let hue = 0;
		const value = max;
		const saturation = max === 0 ? 0 : delta / max;

		if (max !== min) {
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
				value: Math.round(value * 100)
			},
			format: 'hsv'
		};
	} catch (error) {
		console.error(`rgbToHSV() error: ${error}`);
		return defaults.defaultHSV();
	}
}

function xyzToHSV(xyz: types.XYZ): types.HSV {
	try {
		return conversionHelpers.xyzToHSVHelper(xyz);
	} catch (error) {
		console.error(`xyzToHSV() error: ${error}`);
		return defaults.defaultHSV();
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
