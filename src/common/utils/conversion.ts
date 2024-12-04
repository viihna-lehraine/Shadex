// File: src/common/utils/conversion.ts

import { ColorDataAssertion, ColorDataExtended, HSL } from '../../index';
import { paletteUtils } from '../../palette/utils';
import { core } from '../index';

const convert = paletteUtils.convert;

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
		console.error(`Error getting conversion function: ${error}`);

		return undefined;
	}
}

function genAllColorValues(color: HSL): Partial<ColorDataExtended> {
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = core.clone(color);

		if (!core.validateColorValues(clonedColor)) {
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

export const conversion = {
	genAllColorValues,
	getConversionFn
};
