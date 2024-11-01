import { commonUtils } from './common-utils';
import { core } from './core-utils';
import * as colors from '../index/colors';
import { convert } from '../palette-gen/conversion-index';

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
		const fnName =
			`${from}To${to[0].toUpperCase() + to.slice(1)}` as keyof typeof convert;

		if (!(fnName in convert)) return undefined;

		const conversionFn = convert[fnName] as unknown as (
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

export function genAllColorValues(
	color: colors.HSL
): Partial<colors.ColorDataExtended> {
	const result: Partial<colors.ColorDataExtended> = {};

	try {
		const clonedColor = core.clone(color);

		if (!commonUtils.validateColorValues(clonedColor)) {
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
