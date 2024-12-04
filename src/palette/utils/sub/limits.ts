// File: src/palette/utils/sub/limits.ts

import { HSL } from '../../../index';
import { core } from '../../../common';
import { config } from '../../../config';

export function isColorInBounds(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return isTooGray(hsl) || isTooDark(hsl) || isTooBright(hsl);
}

export function isTooBright(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness > config.consts.thresholds.light;
}

export function isTooDark(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.lightness < config.consts.thresholds.dark;
}

export function isTooGray(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.clone(hsl).value.saturation < config.consts.thresholds.gray;
}

export const limits = {
	isColorInBounds,
	isTooBright,
	isTooDark,
	isTooGray
};
