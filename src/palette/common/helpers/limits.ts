// File: palette/common/helpers/limits.js

import { HSL } from '../../../types/index.js';
import { coreUtils } from '../../../common/index.js';
import { constsData as consts } from '../../../data/consts.js';
import { createLogger } from '../../../logger/index.js';
import { modeData as mode } from '../../../data/mode.js';

const logMode = mode.logging;
const thisModule = 'palette/common/helpers/limits.js';

const logger = await createLogger();

function isColorInBounds(hsl: HSL): boolean {
	const thisFunction = 'paletteHelpers > limits > isColorInBounds()';

	if (!coreUtils.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`,
				`${thisModule} > ${thisFunction}`
			);

		return false;
	}

	return isTooDark(hsl) || isTooGray(hsl) || isTooLight(hsl);
}

function isTooDark(hsl: HSL): boolean {
	const thisFunction = 'isTooDark()';

	if (!coreUtils.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isTooDark: Invalid HSL value ${JSON.stringify(hsl)}`,
				`${thisModule} > ${thisFunction}`
			);

		return false;
	}

	return coreUtils.base.clone(hsl).value.lightness < consts.thresholds.dark;
}

function isTooGray(hsl: HSL): boolean {
	const thisFunction = 'isTooGray()';

	if (!coreUtils.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isTooGray: Invalid HSL value ${JSON.stringify(hsl)}`,
				`${thisModule} > ${thisFunction}`
			);

		return false;
	}

	return coreUtils.base.clone(hsl).value.saturation < consts.thresholds.gray;
}

function isTooLight(hsl: HSL): boolean {
	const thisFunction = 'isTooLight()';

	if (!coreUtils.validate.colorValues(hsl)) {
		if (logMode.error)
			logger.error(
				`isTooLight: Invalid HSL value ${JSON.stringify(hsl)}`,
				`${thisModule} > ${thisFunction}`
			);

		return false;
	}

	return coreUtils.base.clone(hsl).value.lightness > consts.thresholds.light;
}

export const limits = {
	isColorInBounds,
	isTooDark,
	isTooGray,
	isTooLight
} as const;
