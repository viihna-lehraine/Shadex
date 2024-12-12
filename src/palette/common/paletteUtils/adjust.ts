// File: src/palette/common/paletteUtils/adjust.ts

import { HSL, PaletteCommon_Utils_Adjust } from '../../../index/index.js';
import { core, helpers } from '../../../common/index.js';
import { data } from '../../../data/index.js';

const adjustments = data.consts.adjustments;
const mode = data.mode;

function sl(color: HSL): HSL {
	try {
		if (!core.validate.colorValues(color)) {
			if (mode.errorLogs)
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
				saturation: core.brand.asPercentile(adjustedSaturation),
				lightness: core.brand.asPercentile(adjustedLightness),
				alpha: color.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		if (mode.errorLogs)
			console.error(`Error adjusting saturation and lightness: ${error}`);

		return color;
	}
}

export const adjust: PaletteCommon_Utils_Adjust = {
	sl
} as const;
