// File: src/palette/common/paletteUtils/adjust.js

import { HSL, PaletteCommon_Utils_Adjust } from '../../../types/index.js';
import { core, helpers } from '../../../common/index.js';
import { data } from '../../../data/index.js';
import { logger } from '../../../logger/index.js';

const adjustments = data.consts.adjustments;
const logMode = data.mode.logging;

function sl(color: HSL): HSL {
	try {
		if (!core.validate.colorValues(color)) {
			if (logMode.errors)
				logger.error('Invalid color valus for adjustment.');

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
				saturation: core.brand.asPercentile(adjustedSaturation),
				lightness: core.brand.asPercentile(adjustedLightness),
				alpha: color.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error adjusting saturation and lightness: ${error}`);

		return color;
	}
}

export const adjust: PaletteCommon_Utils_Adjust = {
	sl
} as const;
