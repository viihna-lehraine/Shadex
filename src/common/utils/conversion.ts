// File: src/common/utils/conversion.js

import {
	CMYK,
	ColorDataAssertion,
	ColorDataExtended,
	CommonFunctionsMasterInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SL,
	SV,
	XYZ
} from '../../types/index.js';
import { convert } from '../convert/index.js';
import { createLogger } from '../../logger/index.js';
import { core } from '../core/index.js';
import { mode } from '../data/base.js';

const logger = await createLogger();

const logMode = mode.logging;

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
		if (logMode.error)
			logger.error(
				`Error getting conversion function: ${error}`,
				'common > utils > conversion > getConversionFn()'
			);

		return undefined;
	}
}

function genAllColorValues(color: HSL): Partial<ColorDataExtended> {
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = core.base.clone(color);

		if (!core.validate.colorValues(clonedColor)) {
			if (logMode.error)
				logger.error(
					`Invalid color: ${JSON.stringify(clonedColor)}`,
					'common > utils > conversion > genAllColorValues()'
				);

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
		if (logMode.error)
			logger.error(
				`Error generating all color values: ${error}`,
				'common > utils > conversion > genAllColorValues()'
			);

		return {};
	}
}

export const conversion: CommonFunctionsMasterInterface['utils']['conversion'] =
	{
		genAllColorValues,
		getConversionFn
	} as const;
