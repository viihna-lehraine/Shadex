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

import { createLogger } from '../../logger/index.js';
import { coreUtils } from '../core/core.js';
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

export const conversionUtils: CommonFn_MasterInterface['utils']['conversion'] =
	{
		genAllColorValues,
		getConversionFn
	} as const;
