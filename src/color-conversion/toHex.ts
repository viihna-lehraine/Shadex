import { convert } from '../color-conversion/conversion-index';
import { conversionHelpers } from '../helpers/conversion';
import * as types from '../index/types';
import * as fnObjects from '../index/fn-objects';
import { defaults } from '../utils/defaults';
import { transforms } from '../utils/transforms';

function cmykToHex(cmyk: types.CMYK): types.Hex {
	try {
		const rgb: types.RGB = convert.cmykToRGB(cmyk);
		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`cmykToHex error: ${error}`);
		return defaults.defaultHex();
	}
}

function hslToHex(hsl: types.HSL): types.Hex {
	try {
		const rgb: types.RGB = convert.hslToRGB(hsl);
		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`hslToHex error: ${error}`);
		return defaults.defaultHex();
	}
}

function hsvToHex(hsv: types.HSV): types.Hex {
	try {
		const rgb: types.RGB = convert.hsvToRGB(hsv);
		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`hsvToHex error: ${error}`);
		return defaults.defaultHex();
	}
}

function labToHex(lab: types.LAB): types.Hex {
	try {
		const rgb: types.RGB = convert.labToRGB(lab);

		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`labToHex error: ${error}`);
		return defaults.defaultHex();
	}
}

function rgbToHex(rgb: types.RGB): types.Hex {
	try {
		if (
			[rgb.value.red, rgb.value.green, rgb.value.blue].some(
				v => isNaN(v) || v < 0 || v > 255
			)
		) {
			console.warn(
				`Invalid RGB values: R=${rgb.value.red}, G=${rgb.value.green}, B=${rgb.value.blue}`
			);
			return { value: { hex: '#000000' }, format: 'hex' };
		}

		return {
			value: {
				hex: `#${transforms.componentToHex(rgb.value.red)}${transforms.componentToHex(rgb.value.green)}${transforms.componentToHex(rgb.value.blue)}`
			},
			format: 'hex'
		};
	} catch (error) {
		console.warn(`rgbToHex error: ${error}`);
		return defaults.defaultHex();
	}
}

function xyzToHex(xyz: types.XYZ): types.Hex {
	try {
		return conversionHelpers.xyzToHexHelper(xyz);
	} catch (error) {
		console.warn(`xyzToHex error: ${error}`);
		return defaults.defaultHex();
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
