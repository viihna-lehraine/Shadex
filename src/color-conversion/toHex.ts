import { convert } from '../color-conversion/conversion-index';
import * as types from '../index';
import { componentToHex } from '../utils/transforms';
import { conversionHelpers } from '../helpers/conversion';

export function hslToHex(hsl: types.HSL): types.Hex {
	try {
		const rgb: types.RGB = convert.hslToRGB(hsl);
		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`hslToHex error: ${error}`);
		return { hex: '#000000', format: 'hex' };
	}
}

export function hsvToHex(hsv: types.HSV): types.Hex {
	try {
		const rgb: types.RGB = convert.hsvToRGB(hsv);
		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`hsvToHex error: ${error}`);
		return { hex: '#000000', format: 'hex' };
	}
}

export function cmykToHex(cmyk: types.CMYK): types.Hex {
	try {
		const rgb: types.RGB = convert.cmykToRGB(cmyk);
		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`cmykToHex error: ${error}`);
		return { hex: '#000000', format: 'hex' };
	}
}

export function labToHex(lab: types.LAB): types.Hex {
	try {
		const rgb: types.RGB = convert.labToRGB(lab);

		return rgbToHex(rgb);
	} catch (error) {
		console.warn(`labToHex error: ${error}`);
		return { hex: '#000000', format: 'hex' };
	}
}

export function rgbToHex(rgb: types.RGB): types.Hex {
	try {
		if (
			[rgb.red, rgb.green, rgb.blue].some(
				v => isNaN(v) || v < 0 || v > 255
			)
		) {
			console.warn(
				`Invalid RGB values: R=${rgb.red}, G=${rgb.green}, B=${rgb.blue}`
			);
			return { hex: '#000000', format: 'hex' };
		}

		return {
			hex: `#${componentToHex(rgb.red)}${componentToHex(rgb.green)}${componentToHex(rgb.blue)}`,
			format: 'hex'
		};
	} catch (error) {
		console.warn(`rgbToHex error: ${error}`);
		return { hex: '#000000', format: 'hex' };
	}
}

export function xyzToHex(xyz: types.XYZ): types.Hex {
	try {
		return conversionHelpers.xyzToHexTryCaseHelper(xyz);
	} catch (error) {
		console.warn(`xyzToHex error: ${error}`);
		return { hex: '#000000', format: 'hex' };
	}
}
