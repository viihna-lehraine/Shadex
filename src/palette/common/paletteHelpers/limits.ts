// File: src/palette/common/paletteHelpers/limits.js

import { HSL, PaletteCommon_Helpers_Limits } from '../../../types/index.js';
import { core } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { logger } from '../../../logger/index.js';

const logMode = data.mode.logging;

function isColorInBounds(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.errors)
			logger.error(
				`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`
			);

		return false;
	}

	return isTooDark(hsl) || isTooGray(hsl) || isTooLight(hsl);
}

function isTooDark(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.errors)
			logger.error(`isTooDark: Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.base.clone(hsl).value.lightness < data.consts.thresholds.dark;
}

function isTooGray(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.errors)
			logger.error(`isTooGray: Invalid HSL value ${JSON.stringify(hsl)}`);

		return false;
	}

	return core.base.clone(hsl).value.saturation < data.consts.thresholds.gray;
}

function isTooLight(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.errors)
			logger.error(
				`isTooLight: Invalid HSL value ${JSON.stringify(hsl)}`
			);

		return false;
	}

	return core.base.clone(hsl).value.lightness > data.consts.thresholds.light;
}

export const limits: PaletteCommon_Helpers_Limits = {
	isColorInBounds,
	isTooDark,
	isTooGray,
	isTooLight
} as const;
