import { convert } from './conversion-index';
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
		xyz: convert.cmykToXYZ
	},
	hex: {
		cmyk: wrappers.hexToCMYKWrapper,
		hsl: wrappers.hexToHSLWrapper,
		hsv: wrappers.hexToHSVWrapper,
		lab: wrappers.hexToLABWrapper,
		rgb: wrappers.hexToRGBWrapper,
		xyz: wrappers.hexToXYZWrapper
	},
	hsl: {
		cmyk: convert.hslToCMYK,
		hex: convert.hslToHex,
		hsv: convert.hslToHSV,
		lab: convert.hslToLAB,
		rgb: convert.hslToRGB,
		xyz: convert.hslToXYZ
	},
	hsv: {
		cmyk: convert.hsvToCMYK,
		hex: convert.hsvToHex,
		hsl: convert.hsvToHSL,
		lab: convert.hsvToLAB,
		rgb: convert.hsvToRGB,
		xyz: convert.hsvToXYZ
	},
	lab: {
		cmyk: convert.labToCMYK,
		hex: convert.labToHex,
		hsl: convert.labToHSL,
		hsv: convert.labToHSV,
		rgb: convert.labToRGB,
		xyz: convert.labToXYZ
	},
	rgb: {
		cmyk: convert.rgbToCMYK,
		hex: convert.rgbToHex,
		hsl: convert.rgbToHSL,
		hsv: convert.rgbToHSV,
		lab: convert.rgbToLAB,
		xyz: convert.rgbToXYZ
	},
	xyz: {
		cmyk: convert.xyzToCMYK,
		hex: convert.xyzToHex,
		hsl: convert.xyzToHSL,
		hsv: convert.xyzToHSV,
		lab: convert.xyzToLAB,
		rgb: convert.xyzToRGB
	}
});

export function genAllColorValues(
	color: colors.Color
): Partial<colors.ColorData> {
	const result: Partial<colors.ColorData> = {};

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
				break;
			case 'hex':
				result.hex = clonedColor;
				result.cmyk = convert.hexToCMYK(clonedColor);
				result.hsl = convert.hexToHSL(clonedColor);
				result.hsv = convert.hexToHSV(clonedColor);
				result.lab = convert.hexToLAB(clonedColor);
				result.rgb = convert.hexToRGB(clonedColor);
				break;
			case 'hsl':
				result.hsl = clonedColor;
				result.cmyk = convert.hslToCMYK(clonedColor);
				result.hex = convert.hslToHex(clonedColor);
				result.hsv = convert.hslToHSV(clonedColor);
				result.lab = convert.hslToLAB(clonedColor);
				result.rgb = convert.hslToRGB(clonedColor);
				break;
			case 'hsv':
				result.hsv = clonedColor;
				result.cmyk = convert.hsvToCMYK(clonedColor);
				result.hex = convert.hsvToHex(clonedColor);
				result.hsl = convert.hsvToHSL(clonedColor);
				result.lab = convert.hsvToLAB(clonedColor);
				result.rgb = convert.hsvToRGB(clonedColor);
				break;
			case 'lab':
				result.lab = clonedColor;
				result.cmyk = convert.labToCMYK(clonedColor);
				result.hex = convert.labToHex(clonedColor);
				result.hsl = convert.labToHSL(clonedColor);
				result.hsv = convert.labToHSV(clonedColor);
				result.rgb = convert.labToRGB(clonedColor);
				break;
			case 'rgb':
				result.rgb = clonedColor;
				result.cmyk = convert.rgbToCMYK(clonedColor);
				result.hex = convert.rgbToHex(clonedColor);
				result.hsl = convert.rgbToHSL(clonedColor);
				result.hsv = convert.rgbToHSV(clonedColor);
				result.lab = convert.rgbToLAB(clonedColor);
				break;
		}

		return core.clone(result);
	} catch (error) {
		console.error(`Error generating all color values: ${error}`);
		return {};
	}
}
