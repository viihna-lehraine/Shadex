import { convert } from './color-space-index';
import { paletteHelpers } from '../helpers/palette';
import { wrappers } from '../helpers/wrappers';
import * as colors from '../index/colors';
import * as conversion from '../index/conversion';
import { core } from '../utils/core';

export function getConversionFn<
	From extends keyof colors.ColorDataAssertion,
	To extends keyof colors.ColorDataAssertion
>(
	from: From,
	to: To
):
	| ((
			value: colors.ColorDataAssertion[From]
	  ) => colors.ColorDataAssertion[To])
	| undefined {
	try {
		const fromMap = conversionMap[from];

		if (!fromMap || !(to in fromMap)) return undefined;

		const conversionFn = fromMap[to] as unknown as (
			input: colors.ColorDataAssertion[From]
		) => colors.ColorDataAssertion[To];

		return (
			value: colors.ColorDataAssertion[From]
		): colors.ColorDataAssertion[To] =>
			structuredClone(conversionFn(value));
	} catch (error) {
		console.error(`Error getting conversion function: ${error}`);
		return undefined;
	}
}

export const conversionMap: conversion.ConversionMap = core.clone({
	cmyk: {
		hex: convert.cmykToHex,
		hsl: convert.cmykToHSL,
		hsv: convert.cmykToHSV,
		lab: convert.cmykToLAB,
		rgb: convert.cmykToRGB,
		sl: convert.cmykToSL,
		sv: convert.cmykToSV,
		xyz: convert.cmykToXYZ
	},
	hex: {
		cmyk: wrappers.hexToCMYKWrapper,
		hsl: wrappers.hexToHSLWrapper,
		hsv: wrappers.hexToHSVWrapper,
		lab: wrappers.hexToLABWrapper,
		rgb: wrappers.hexToRGBWrapper,
		sl: wrappers.hexToSLWrapper,
		sv: wrappers.hexToSVWrapper,
		xyz: wrappers.hexToXYZWrapper
	},
	hsl: {
		cmyk: convert.hslToCMYK,
		hex: convert.hslToHex,
		hsv: convert.hslToHSV,
		lab: convert.hslToLAB,
		rgb: convert.hslToRGB,
		sl: convert.hslToSL,
		sv: convert.hslToSV,
		xyz: convert.hslToXYZ
	},
	hsv: {
		cmyk: convert.hsvToCMYK,
		hex: convert.hsvToHex,
		hsl: convert.hsvToHSL,
		lab: convert.hsvToLAB,
		rgb: convert.hsvToRGB,
		sl: convert.hsvToSL,
		sv: convert.hsvToSV,
		xyz: convert.hsvToXYZ
	},
	lab: {
		cmyk: convert.labToCMYK,
		hex: convert.labToHex,
		hsl: convert.labToHSL,
		hsv: convert.labToHSV,
		rgb: convert.labToRGB,
		sl: convert.labToSL,
		sv: convert.labToSV,
		xyz: convert.labToXYZ
	},
	rgb: {
		cmyk: convert.rgbToCMYK,
		hex: convert.rgbToHex,
		hsl: convert.rgbToHSL,
		hsv: convert.rgbToHSV,
		lab: convert.rgbToLAB,
		sl: convert.rgbToSL,
		sv: convert.rgbToSV,
		xyz: convert.rgbToXYZ
	},
	xyz: {
		cmyk: convert.xyzToCMYK,
		hex: convert.xyzToHex,
		hsl: convert.xyzToHSL,
		hsv: convert.xyzToHSV,
		lab: convert.xyzToLAB,
		sl: convert.xyzToSL,
		sv: convert.xyzToSV,
		rgb: convert.xyzToRGB
	}
});

export function genAllColorValues(
	color: Exclude<colors.Color, colors.SL | colors.SV>
): Partial<colors.ColorDataExtended> {
	const result: Partial<colors.ColorDataExtended> = {};

	try {
		const clonedColor = core.clone(color);

		if (!paletteHelpers.validateColorValues(clonedColor)) {
			console.error(`Invalid color: ${JSON.stringify(clonedColor)}`);

			return {};
		}

		switch (clonedColor.format) {
			case 'cmyk':
				result.cmyk = clonedColor;
				result.hex = convert.cmykToHex(clonedColor);
				result.hsl = convert.cmykToHSL(clonedColor);
				result.hsv = convert.cmykToHSV(clonedColor);
				result.lab = convert.cmykToLAB(clonedColor);
				result.rgb = convert.cmykToRGB(clonedColor);
				result.sl = convert.cmykToSL(clonedColor);
				result.sv = convert.cmykToSV(clonedColor);
				result.xyz = convert.cmykToXYZ(clonedColor);
				break;
			case 'hex':
				result.cmyk = convert.hexToCMYK(clonedColor);
				result.hex = clonedColor;
				result.hsl = convert.hexToHSL(clonedColor);
				result.hsv = convert.hexToHSV(clonedColor);
				result.lab = convert.hexToLAB(clonedColor);
				result.rgb = convert.hexToRGB(clonedColor);
				result.sl = convert.hexToSL(clonedColor);
				result.sv = convert.hexToSV(clonedColor);
				result.xyz = convert.hexToXYZ(clonedColor);
				break;
			case 'hsl':
				result.cmyk = convert.hslToCMYK(clonedColor);
				result.hex = convert.hslToHex(clonedColor);
				result.hsl = clonedColor;
				result.hsv = convert.hslToHSV(clonedColor);
				result.lab = convert.hslToLAB(clonedColor);
				result.rgb = convert.hslToRGB(clonedColor);
				result.sl = convert.hslToSL(clonedColor);
				result.sv = convert.hslToSV(clonedColor);
				result.xyz = convert.hslToXYZ(clonedColor);
				break;
			case 'hsv':
				result.cmyk = convert.hsvToCMYK(clonedColor);
				result.hex = convert.hsvToHex(clonedColor);
				result.hsl = convert.hsvToHSL(clonedColor);
				result.hsv = clonedColor;
				result.lab = convert.hsvToLAB(clonedColor);
				result.rgb = convert.hsvToRGB(clonedColor);
				result.sl = convert.hsvToSL(clonedColor);
				result.sv = convert.hsvToSV(clonedColor);
				result.xyz = convert.hsvToXYZ(clonedColor);
				break;
			case 'lab':
				result.cmyk = convert.labToCMYK(clonedColor);
				result.hex = convert.labToHex(clonedColor);
				result.hsl = convert.labToHSL(clonedColor);
				result.hsv = convert.labToHSV(clonedColor);
				result.lab = clonedColor;
				result.rgb = convert.labToRGB(clonedColor);
				result.sl = convert.labToSL(clonedColor);
				result.sv = convert.labToSV(clonedColor);
				result.xyz = convert.labToXYZ(clonedColor);
				break;
			case 'rgb':
				result.cmyk = convert.rgbToCMYK(clonedColor);
				result.hex = convert.rgbToHex(clonedColor);
				result.hsl = convert.rgbToHSL(clonedColor);
				result.hsv = convert.rgbToHSV(clonedColor);
				result.lab = convert.rgbToLAB(clonedColor);
				result.rgb = clonedColor;
				result.sl = convert.rgbToSL(clonedColor);
				result.sv = convert.rgbToSV(clonedColor);
				result.xyz = convert.rgbToXYZ(clonedColor);
				break;
			case 'xyz':
				result.cmyk = convert.xyzToCMYK(clonedColor);
				result.hex = convert.xyzToHex(clonedColor);
				result.hsl = convert.xyzToHSL(clonedColor);
				result.hsv = convert.xyzToHSV(clonedColor);
				result.lab = convert.xyzToLAB(clonedColor);
				result.rgb = convert.xyzToRGB(clonedColor);
				result.sl = convert.xyzToSL(clonedColor);
				result.sv = convert.xyzToSV(clonedColor);
				result.xyz = clonedColor;
		}

		return result;
	} catch (error) {
		console.error(`Error generating all color values: ${error}`);
		return {};
	}
}
