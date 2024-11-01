import { config } from '../config/constants';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { commonUtils } from '../utils/common-utils';
import { core } from '../utils/core-utils';

function isColorInBounds(hsl: colors.HSL): boolean {
	if (!commonUtils.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return isTooGray(hsl) || isTooDark(hsl) || isTooBright(hsl);
}

function isTooBright(hsl: colors.HSL): boolean {
	if (!commonUtils.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness > config.brightnessThreshold;
}

function isTooDark(hsl: colors.HSL): boolean {
	if (!commonUtils.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness < config.darknessThreshold;
}

function isTooGray(hsl: colors.HSL): boolean {
	if (!commonUtils.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.saturation < config.grayThreshold;
}

export const limits: fnObjects.Limits = {
	isColorInBounds,
	isTooBright,
	isTooDark,
	isTooGray
};
