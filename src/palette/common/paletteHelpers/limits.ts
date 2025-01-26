// File: src/palette/common/paletteHelpers/limits.js

import { HSL } from '../../../types/index.js';
import { core } from '../../../common/index.js';
import { consts, mode } from '../../../common/data/base.js';
import { createLogger } from '../../../logger/index.js';

const logger = await createLogger();

const logMode = mode.logging;

function isColorInBounds(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`,
				'paletteHelpers > limits > isColorInBounds()'
			);

		return false;
	}

	return isTooDark(hsl) || isTooGray(hsl) || isTooLight(hsl);
}

function isTooDark(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isTooDark: Invalid HSL value ${JSON.stringify(hsl)}`,
				'paletteHelpers > limits > isTooDark()'
			);

		return false;
	}

	return core.base.clone(hsl).value.lightness < consts.thresholds.dark;
}

function isTooGray(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isTooGray: Invalid HSL value ${JSON.stringify(hsl)}`,
				'paletteHelpers > limits > isTooGray()'
			);

		return false;
	}

	return core.base.clone(hsl).value.saturation < consts.thresholds.gray;
}

function isTooLight(hsl: HSL): boolean {
	if (!core.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isTooLight: Invalid HSL value ${JSON.stringify(hsl)}`,
				'paletteHelpers > limits > isTooLight()'
			);

		return false;
	}

	return core.base.clone(hsl).value.lightness > consts.thresholds.light;
}

export const limits = {
	isColorInBounds,
	isTooDark,
	isTooGray,
	isTooLight
} as const;
