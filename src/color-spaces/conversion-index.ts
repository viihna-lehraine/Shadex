import { convert } from './convert-all';
import { defaults } from '../config/defaults';
import * as colors from '../index/colors';
import { core } from '../utils/core';

export function toCMYK(color: colors.Color): colors.CMYK {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return clonedColor as colors.CMYK;
		case 'hex':
			return convert.hexToCMYK(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToCMYK(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToCMYK(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToCMYK(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToCMYK(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToCMYK(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.cmyk);
	}
}

export function toHex(color: colors.Color): colors.Hex {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToHex(clonedColor as colors.CMYK);
		case 'hex':
			return clonedColor as colors.Hex;
		case 'hsl':
			return convert.hslToHex(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToHex(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToHex(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToHex(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToHex(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.hex);
	}
}

export function toHSL(color: colors.Color): colors.HSL {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToHSL(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToHSL(clonedColor as colors.Hex);
		case 'hsl':
			return clonedColor as colors.HSL;
		case 'hsv':
			return convert.hsvToHSL(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToHSL(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToHSL(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToHSL(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.hsl);
	}
}

export function toHSV(color: colors.Color): colors.HSV {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToHSV(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToHSV(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToHSV(clonedColor as colors.HSL);
		case 'hsv':
			return clonedColor as colors.HSV;
		case 'lab':
			return convert.labToHSV(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToHSV(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToHSV(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.hsv);
	}
}

export function toLAB(color: colors.Color): colors.LAB {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToLAB(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToLAB(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToLAB(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToLAB(clonedColor as colors.HSV);
		case 'lab':
			return clonedColor as colors.LAB;
		case 'rgb':
			return convert.rgbToLAB(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToLAB(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.lab);
	}
}

export function toRGB(color: colors.Color): colors.RGB {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToRGB(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToRGB(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToRGB(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToRGB(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToRGB(clonedColor as colors.LAB);
		case 'rgb':
			return clonedColor as colors.RGB;
		case 'xyz':
			return convert.xyzToRGB(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.rgb);
	}
}

export function toSL(color: colors.Color): colors.SL {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToSL(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToSL(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToSL(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToSL(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToSL(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToSL(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToSL(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.sl);
	}
}

export function toSV(color: colors.Color): colors.SV {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToSV(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToSV(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToSV(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToSV(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToSV(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToSV(clonedColor as colors.RGB);
		case 'xyz':
			return convert.xyzToSV(clonedColor as colors.XYZ);
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.sv);
	}
}

export function toXYZ(color: colors.Color): colors.XYZ {
	const clonedColor: colors.Color = core.clone(color);

	switch (color.format) {
		case 'cmyk':
			return convert.cmykToXYZ(clonedColor as colors.CMYK);
		case 'hex':
			return convert.hexToXYZ(clonedColor as colors.Hex);
		case 'hsl':
			return convert.hslToXYZ(clonedColor as colors.HSL);
		case 'hsv':
			return convert.hsvToXYZ(clonedColor as colors.HSV);
		case 'lab':
			return convert.labToXYZ(clonedColor as colors.LAB);
		case 'rgb':
			return convert.rgbToXYZ(clonedColor as colors.RGB);
		case 'xyz':
			return clonedColor as colors.XYZ;
		default:
			console.error(`Invalid color format: ${color.format}`);

			return core.clone(defaults.xyz);
	}
}
