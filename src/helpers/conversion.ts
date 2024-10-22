import { convert } from '../color-conversion/conversion-index';
import * as types from '../index';

function applyGammaCorrection(value: number): number {
	return value > 0.0031308
		? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
		: 12.92 * value;
}

function clampRGB(rgb: types.RGB): types.RGB {
	return {
		red: Math.round(Math.min(Math.max(0, rgb.red), 1) * 255),
		green: Math.round(Math.min(Math.max(0, rgb.green), 1) * 255),
		blue: Math.round(Math.min(Math.max(0, rgb.blue), 1) * 255),
		format: 'rgb'
	};
}

function cmykToXYZTryCaseHelper(cmy: types.CMYK): types.XYZ {
	const rgb: types.RGB = convert.cmykToRGB(cmy);
	return convert.rgbToXYZ(rgb);
}

function hexToCMYKTryCaseHelper(hex: types.Hex): types.CMYK {
	const rgb: types.RGB = convert.hexToRGB(hex);
	return convert.rgbToCMYK(rgb);
}

function hexToXYZTryCaseHelper(hex: types.Hex): types.XYZ {
	const lab: types.LAB = convert.hexToLAB(hex);
	const xyz: types.XYZ = convert.labToXYZ(lab);
	return xyz;
}

export function hueToRGB(p: number, q: number, t: number): number {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

	return p;
}

function hslAddFormat(
	hue: number,
	saturation: number,
	lightness: number
): types.HSL {
	return { hue, saturation, lightness, format: 'hsl' } as types.HSL;
}

function hslStringToHSL(hsl: Partial<types.HSLString>): types.HSL {
	return {
		hue: Number(hsl.hue),
		saturation: Number(hsl.saturation),
		lightness: Number(hsl.lightness),
		format: 'hsl'
	} as types.HSL;
}

function hslToCMYKTryCaseHelper(hsl: types.HSL): types.CMYK {
	const rgb: types.RGB = convert.hslToRGB(hsl);
	return convert.rgbToCMYK(rgb);
}

function hslToHexTryCaseHelper(hsl: types.HSL): types.Hex {
	const rgb: types.RGB = convert.hslToRGB(hsl);
	return convert.rgbToHex(rgb);
}

function hslToXYZTryCaseHelper(hsl: types.HSL): types.XYZ {
	const lab: types.LAB = convert.hslToLAB(hsl);
	return convert.labToXYZ(lab);
}

function hsvToCMYKTryCaseHelper(hsv: types.HSV): types.CMYK {
	const rgb: types.RGB = convert.hsvToRGB(hsv);
	return convert.rgbToCMYK(rgb);
}

function hsvToXYZTryCaseHelper(hsv: types.HSV): types.XYZ {
	const rgb: types.RGB = convert.hsvToRGB(hsv);
	return convert.rgbToXYZ(rgb);
}

function labToCMYKTryCaseHelper(lab: types.LAB): types.CMYK {
	const rgb: types.RGB = convert.labToRGB(lab);
	return convert.rgbToCMYK(rgb);
}

function xyzToCMYKTryCaseHelper(xyz: types.XYZ): types.CMYK {
	const lab: types.LAB = convert.xyzToLAB(xyz);
	return convert.labToCMYK(lab);
}

function xyzToHexTryCaseHelper(xyz: types.XYZ): types.Hex {
	const lab: types.LAB = convert.xyzToLAB(xyz);
	return convert.labToHex(lab);
}

function xyzToHSLTryCaseHelper(xyz: types.XYZ): types.HSL {
	const lab: types.LAB = convert.xyzToLAB(xyz);
	return convert.labToHSL(lab);
}

function xyzToHSVTryCaseHelper(xyz: types.XYZ): types.HSV {
	const lab: types.LAB = convert.xyzToLAB(xyz);
	return convert.labToHSV(lab);
}

export const conversionHelpers = {
	applyGammaCorrection,
	clampRGB,
	cmykToXYZTryCaseHelper,
	hexToCMYKTryCaseHelper,
	hexToXYZTryCaseHelper,
	hslAddFormat,
	hslStringToHSL,
	hslToCMYKTryCaseHelper,
	hslToHexTryCaseHelper,
	hslToXYZTryCaseHelper,
	hsvToCMYKTryCaseHelper,
	hsvToXYZTryCaseHelper,
	hueToRGB,
	labToCMYKTryCaseHelper,
	xyzToCMYKTryCaseHelper,
	xyzToHexTryCaseHelper,
	xyzToHSLTryCaseHelper,
	xyzToHSVTryCaseHelper
};
