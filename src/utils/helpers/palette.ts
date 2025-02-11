// File: utils/helpers/palette.js

import {
	AppServicesInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	HSL,
	PaletteUtilHelpersInterface,
	ValidationUtilsInterface
} from '../../types/index.js';
import { constsData as consts } from '../../data/consts.js';

const probabilityConsts = consts.probabilities;

function getWeightedRandomInterval(
	distributionType: keyof ConstsDataInterface['probabilities'],
	appServices: AppServicesInterface
): number {
	const log = appServices.log;

	try {
		// select appropriate type
		const { weights, values } = probabilityConsts[distributionType];

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
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): boolean {
	const log = appServices.log;

	if (!validate.colorValue(hsl, coreUtils)) {
		log(
			'error',
			`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`,
			'paletteUtils.isHSLInBounds()'
		);

		return false;
	}

	return (
		isHSLTooDark(hsl, appServices, coreUtils, validate) ||
		isHSLTooGray(hsl, appServices, coreUtils, validate) ||
		isHSLTooLight(hsl, appServices, coreUtils, validate)
	);
}

function isHSLTooDark(
	hsl: HSL,
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): boolean {
	const log = appServices.log;

	if (!validate.colorValue(hsl, coreUtils)) {
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
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): boolean {
	const log = appServices.log;

	if (!validate.colorValue(hsl, coreUtils)) {
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
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): boolean {
	const log = appServices.log;

	if (!validate.colorValue(hsl, coreUtils)) {
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
