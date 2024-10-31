import { convert } from '../color-spaces/convert-all';
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
	color: colors.HSL
): Partial<colors.ColorDataExtended> {
	const result: Partial<colors.ColorDataExtended> = {};

	try {
		const clonedColor = core.clone(color);

		if (!paletteHelpers.validateColorValues(clonedColor)) {
			console.error(`Invalid color: ${JSON.stringify(clonedColor)}`);

			return {};
		}

		result.cmyk = convert.hslToCMYK(clonedColor);
		result.hex = convert.hslToHex(clonedColor);
		result.hsl = clonedColor;
		result.hsv = convert.hslToHSV(clonedColor);
		result.lab = convert.hslToLAB(clonedColor);
		result.rgb = convert.hslToRGB(clonedColor);
		result.sl = convert.hslToSL(clonedColor);
		result.sv = convert.hslToSV(clonedColor);
		result.xyz = convert.hslToXYZ(clonedColor);

		return result;
	} catch (error) {
		console.error(`Error generating all color values: ${error}`);

		return {};
	}
}
