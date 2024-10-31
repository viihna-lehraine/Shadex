import { config } from '../config/constants';
import { paletteHelpers } from '../helpers/palette';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import { core } from '../utils/core';

function isColorInBounds(hsl: colors.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return isTooGray(hsl) || isTooDark(hsl) || isTooBright(hsl);
}

function isTooBright(hsl: colors.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness > config.brightnessThreshold;
}

function isTooDark(hsl: colors.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness < config.darknessThreshold;
}

function isTooGray(hsl: colors.HSL): boolean {
	if (!paletteHelpers.validateColorValues(hsl)) {
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
