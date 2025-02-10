// File: utils/helpers/palette.js

import {
	AppServicesInterface,
	ConfigDataInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	HSL,
	PaletteUtilHelpersInterface,
	ValidationUtilsInterface
} from '../../types/index.js';

function getWeightedRandomInterval(
	type: keyof ConstsDataInterface['probabilities'],
	log: AppServicesInterface['log'],
	probabilityConsts: ConstsDataInterface['probabilities']
): number {
	try {
		// select appropriate type
		const { weights, values } = probabilityConsts[type];

		// compute cumulative probabilities
		const cumulativeProbabilities: number[] = values.reduce(
			(acc: number[], prob: number, i: number) => {
				acc[i] = (acc[i - 1] || 0) + prob;

				return acc;
			},
			[]
		);
		const random = Math.random();

		// find corresponding weighted value
		for (let i = 0; i < cumulativeProbabilities.length; i++) {
			if (random < cumulativeProbabilities[i]) return weights[i];
		}

		// fallback in case of error
		return weights[weights.length - 1];
	} catch (error) {
		log(
			'error',
			`Error generating weighted random interval: ${error}`,
			'paletteUtils.getWeightedRandomInterval()'
		);

		return 50; // default fallback value
	}
}

function isHSLInBounds(
	hsl: HSL,
	consts: ConstsDataInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): boolean {
	if (!validate.colorValue(hsl, coreUtils, regex)) {
		log(
			'error',
			`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`,
			'paletteUtils.isHSLInBounds()'
		);

		return false;
	}

	return (
		isHSLTooDark(hsl, consts, coreUtils, log, regex, validate) ||
		isHSLTooGray(hsl, consts, coreUtils, log, regex, validate) ||
		isHSLTooLight(hsl, consts, coreUtils, log, regex, validate)
	);
}

function isHSLTooDark(
	hsl: HSL,
	consts: ConstsDataInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): boolean {
	if (!validate.colorValue(hsl, coreUtils, regex)) {
		log(
			'error',
			`Invalid HSL value ${JSON.stringify(hsl)}`,
			'paletteUtils.isHSLTooDark()'
		);

		return false;
	}

	return coreUtils.clone(hsl).value.lightness < consts.thresholds.dark;
}

function isHSLTooGray(
	hsl: HSL,
	consts: ConstsDataInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): boolean {
	if (!validate.colorValue(hsl, coreUtils, regex)) {
		log(
			'error',
			`Invalid HSL value ${JSON.stringify(hsl)}`,
			'paletteUtils.isHSLTooGray()'
		);

		return false;
	}

	return coreUtils.clone(hsl).value.saturation < consts.thresholds.gray;
}

function isHSLTooLight(
	hsl: HSL,
	consts: ConstsDataInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): boolean {
	if (!validate.colorValue(hsl, coreUtils, regex)) {
		log(
			'error',
			'Invalid HSL value ${JSON.stringify(hsl)}',
			'paletteUtils.isHSLTooLight()'
		);

		return false;
	}

	return coreUtils.clone(hsl).value.lightness > consts.thresholds.light;
}

export const paletteHelpers: PaletteUtilHelpersInterface = {
	getWeightedRandomInterval,
	isHSLInBounds,
	isHSLTooDark,
	isHSLTooGray,
	isHSLTooLight
};
