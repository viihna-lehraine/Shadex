// File: common/helpers/dom.js

import {
	Color,
	Color_StringProps,
	CommonFn_MasterInterface
} from '../../types/index.js';
import { coreUtils } from '../core/core.js';
import { createLogger } from '../../logger/index.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/helpers/dom.js';

const logger = await createLogger();

async function validateAndConvertColor(
	color: Color | Color_StringProps | null
): Promise<Color | null> {
	const thisMethod = 'validateAndConvertColor()';

	if (!color) return null;

	const convertedColor = coreUtils.guards.isColorString(color)
		? await coreUtils.convert.colorStringToColor(color)
		: color;

	if (!coreUtils.validate.colorValues(convertedColor)) {
		if (logMode.error)
			logger.error(
				`Invalid color: ${JSON.stringify(convertedColor)}`,
				`${thisModule} > ${thisMethod}`
			);

		return null;
	}

	return convertedColor;
}

export const domHelpers: CommonFn_MasterInterface['helpers']['dom'] = {
	validateAndConvertColor
} as const;
