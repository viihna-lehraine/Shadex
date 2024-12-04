// File: src/palette/common/paletteUtils/adjust.ts

import { HSL } from '../../../index/index';
import { core, helpers } from '../../../common';
import { config } from '../../../config';

const adjustments = config.consts.adjustments;
const mode = config.mode;

function sl(color: HSL): HSL {
	try {
		if (!core.validateColorValues(color)) {
			if (mode.logErrors)
				console.error('Invalid color valus for adjustment.');

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
				saturation: adjustedSaturation,
				lightness: adjustedLightness,
				alpha: color.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		if (mode.logErrors)
			console.error(`Error adjusting saturation and lightness: ${error}`);

		return color;
	}
}

export const adjust = { sl } as const;
