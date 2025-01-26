// File: src/palette/common/paletteUtils/adjust.js

import { HSL } from '../../../types/index.js';
import { core, helpers } from '../../../common/index.js';
import { consts, mode } from '../../../common/data/base.js';
import { createLogger } from '../../../logger/index.js';

const logger = await createLogger();

const adjustments = consts.adjustments;
const logMode = mode.logging;

function sl(color: HSL): HSL {
	try {
		if (!core.validate.colorValues(color)) {
			if (logMode.error)
				logger.error(
					'Invalid color valus for adjustment.',
					'palette > common > paletteUtils > adjust > sl()'
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
				saturation: core.brand.asPercentile(adjustedSaturation),
				lightness: core.brand.asPercentile(adjustedLightness),
				alpha: color.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error adjusting saturation and lightness: ${error}`,
				'palette > common > paletteUtils > adjust > sl()'
			);

		return color;
	}
}

export const adjust = { sl } as const;
