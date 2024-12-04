// File: src/common/utils/conversion.ts

import {
	CMYK,
	ColorDataAssertion,
	ColorDataExtended,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SL,
	SV,
	XYZ
} from '../../index';
import { config } from '../../config';
import { core } from '../core';
import { paletteUtils } from '../../palette/common';

const convert = paletteUtils.convert;
const mode = config.mode;

function getConversionFn<
	From extends keyof ColorDataAssertion,
	To extends keyof ColorDataAssertion
>(
	from: From,
	to: To
): ((value: ColorDataAssertion[From]) => ColorDataAssertion[To]) | undefined {
	try {
		const fnName =
			`${from}To${to[0].toUpperCase() + to.slice(1)}` as keyof typeof convert;

		if (!(fnName in convert)) return undefined;

		const conversionFn = convert[fnName] as unknown as (
			input: ColorDataAssertion[From]
		) => ColorDataAssertion[To];

		return (value: ColorDataAssertion[From]): ColorDataAssertion[To] =>
			structuredClone(conversionFn(value));
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error getting conversion function: ${error}`);

		return undefined;
	}
}

function genAllColorValues(color: HSL): Partial<ColorDataExtended> {
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = core.clone(color);

		if (!core.validateColorValues(clonedColor)) {
			if (mode.logErrors)
				console.error(`Invalid color: ${JSON.stringify(clonedColor)}`);

			return {};
		}

		result.cmyk = convert.hslTo(clonedColor, 'cmyk') as CMYK;
		result.hex = convert.hslTo(clonedColor, 'hex') as Hex;
		result.hsl = clonedColor;
		result.hsv = convert.hslTo(clonedColor, 'hsv') as HSV;
		result.lab = convert.hslTo(clonedColor, 'lab') as LAB;
		result.rgb = convert.hslTo(clonedColor, 'rgb') as RGB;
		result.sl = convert.hslTo(clonedColor, 'sl') as SL;
		result.sv = convert.hslTo(clonedColor, 'sv') as SV;
		result.xyz = convert.hslTo(clonedColor, 'xyz') as XYZ;

		return result;
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error generating all color values: ${error}`);

		return {};
	}
}

export const conversion = {
	genAllColorValues,
	getConversionFn
} as const;
