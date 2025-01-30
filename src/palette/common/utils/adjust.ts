// File: palette/common/utils/adjust.js

import { HSL } from '../../../types/index.js';
import { constsData as consts } from '../../../data/consts.js';
import { coreUtils, helpers } from '../../../common/index.js';
import { createLogger } from '../../../logger/index.js';
import { modeData as mode } from '../../../data/mode.js';

const adjustments = consts.adjustments;
const logMode = mode.logging;

const thisModule = 'palette/common/utils/adjust.js';

const logger = await createLogger();

function sl(color: HSL): HSL {
	const thisFunction = 'sl()';

	try {
		if (!coreUtils.validate.colorValues(color)) {
			if (logMode.error)
				logger.error(
					'Invalid color valus for adjustment.',
					`${thisModule} > ${thisFunction}`
				);

			helpers.dom.showToast('Invalid color values');

			return color;
		}

		const adjustedSaturation = Math.min(
			Math.max(color.value.saturation + adjustments.slaValue, 0),
			100
		);
		const adjustedLightness = Math.min(100);

		return {
			value: {
				hue: color.value.hue,
				saturation: coreUtils.brand.asPercentile(adjustedSaturation),
				lightness: coreUtils.brand.asPercentile(adjustedLightness)
			},
			format: 'hsl'
		};
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error adjusting saturation and lightness: ${error}`,
				`${thisModule} > ${thisFunction}`
			);

		return color;
	}
}

export const adjust = { sl } as const;
