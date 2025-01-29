// File: common/utils/conversion.js

import {
	CMYK,
	ColorDataAssertion,
	ColorDataExtended,
	CommonFn_MasterInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SL,
	SV,
	XYZ
} from '../../types/index.js';
import { coreConversionUtils } from '../convert.js';
import { createLogger } from '../../logger/index.js';
import { coreUtils } from '../core.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/utils/conversion.js';

const logger = await createLogger();

function getConversionFn<
	From extends keyof ColorDataAssertion,
	To extends keyof ColorDataAssertion
>(
	from: From,
	to: To
): ((value: ColorDataAssertion[From]) => ColorDataAssertion[To]) | undefined {
	const thisMethod = 'getConversionFn()';

	try {
		const fnName =
			`${from}To${to[0].toUpperCase() + to.slice(1)}` as keyof typeof conversionUtils;

		if (!(fnName in conversionUtils)) return undefined;

		const conversionFn = conversionUtils[fnName] as unknown as (
			input: ColorDataAssertion[From]
		) => ColorDataAssertion[To];

		return (value: ColorDataAssertion[From]): ColorDataAssertion[To] =>
			structuredClone(conversionFn(value));
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error getting conversion function: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return undefined;
	}
}

function genAllColorValues(color: HSL): Partial<ColorDataExtended> {
	const thisMethod = 'genAllColorValues()';
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = coreUtils.base.clone(color);

		if (!coreUtils.validate.colorValues(clonedColor)) {
			if (logMode.error)
				logger.error(
					`Invalid color: ${JSON.stringify(clonedColor)}`,
					`${thisModule} > ${thisMethod}`
				);

			return {};
		}

		result.cmyk = coreConversionUtils.hslTo(clonedColor, 'cmyk') as CMYK;
		result.hex = coreConversionUtils.hslTo(clonedColor, 'hex') as Hex;
		result.hsl = clonedColor;
		result.hsv = coreConversionUtils.hslTo(clonedColor, 'hsv') as HSV;
		result.lab = coreConversionUtils.hslTo(clonedColor, 'lab') as LAB;
		result.rgb = coreConversionUtils.hslTo(clonedColor, 'rgb') as RGB;
		result.sl = coreConversionUtils.hslTo(clonedColor, 'sl') as SL;
		result.sv = coreConversionUtils.hslTo(clonedColor, 'sv') as SV;
		result.xyz = coreConversionUtils.hslTo(clonedColor, 'xyz') as XYZ;

		return result;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating all color values: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return {};
	}
}

export const conversionUtils: CommonFn_MasterInterface['utils']['conversion'] =
	{
		genAllColorValues,
		getConversionFn
	} as const;
