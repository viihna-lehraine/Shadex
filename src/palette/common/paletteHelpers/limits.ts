// File: src/palette/common/paletteHelpers/limits.ts

import { HSL } from '../../../index';
import { core } from '../../../common';
import { config } from '../../../config';

const mode = config.mode;

function isColorInBounds(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		if (mode.logErrors)
			console.error(
				`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`
			);

		return false;
	}

	return isTooDark(hsl) || isTooGray(hsl) || isTooLight(hsl);
}

function isTooDark(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		if (mode.logErrors)
			console.error(
				`isTooDark: Invalid HSL value ${JSON.stringify(hsl)}`
			);

		return false;
	}

	return core.clone(hsl).value.lightness < config.consts.thresholds.dark;
}

function isTooGray(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		if (mode.logErrors)
			console.error(
				`isTooGray: Invalid HSL value ${JSON.stringify(hsl)}`
			);

		return false;
	}

	return core.clone(hsl).value.saturation < config.consts.thresholds.gray;
}

function isTooLight(hsl: HSL): boolean {
	if (!core.validateColorValues(hsl)) {
		if (mode.logErrors)
			console.error(
				`isTooLight: Invalid HSL value ${JSON.stringify(hsl)}`
			);

		return false;
	}

	return core.clone(hsl).value.lightness > config.consts.thresholds.light;
}

export const limits = {
	isColorInBounds,
	isTooDark,
	isTooGray,
	isTooLight
} as const;
