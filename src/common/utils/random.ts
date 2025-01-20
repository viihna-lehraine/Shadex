// File: src/common/utils/random.js

import { CommonUtilsFnRandom, HSL, SL } from '../../types/index.js';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { logger } from '../../logger/index.js';

const defaults = data.defaults;
const logMode = data.mode.logging;
const mode = data.mode;

function hsl(enableAlpha: boolean): HSL {
	try {
		const alpha = enableAlpha ? Math.round(Math.random() * 100) / 100 : 1;
		const hsl: HSL = {
			value: {
				hue: core.sanitize.radial(Math.floor(Math.random() * 360)),
				saturation: core.sanitize.percentile(
					Math.floor(Math.random() * 101)
				),
				lightness: core.sanitize.percentile(
					Math.floor(Math.random() * 101)
				),
				alpha: core.brand.asAlphaRange(alpha)
			},
			format: 'hsl'
		};

		if (!core.validate.colorValues(hsl)) {
			if (logMode.errors)
				logger.error(
					`Invalid random HSL color value ${JSON.stringify(hsl)}`
				);

			const unbrandedHSL = core.base.clone(
				defaults.colors.base.unbranded.hsl
			);

			return core.brandColor.asHSL(unbrandedHSL);
		}

		if (!mode.quiet && !logMode.info)
			logger.info(`Generated randomHSL: ${JSON.stringify(hsl)}`);

		return hsl;
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error generating random HSL color: ${error}`);

		const unbrandedHSL = core.base.clone(
			defaults.colors.base.unbranded.hsl
		);

		return core.brandColor.asHSL(unbrandedHSL);
	}
}

function sl(enableAlpha: boolean): SL {
	try {
		const alpha = enableAlpha ? Math.round(Math.random() * 100) / 100 : 1;
		const sl: SL = {
			value: {
				saturation: core.sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				lightness: core.sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				alpha: core.brand.asAlphaRange(alpha)
			},
			format: 'sl'
		};

		if (!core.validate.colorValues(sl as SL)) {
			if (logMode.errors)
				logger.error(
					`Invalid random SV color value ${JSON.stringify(sl)}`
				);

			const unbrandedSL = core.base.clone(
				defaults.colors.base.unbranded.sl
			);

			return core.brandColor.asSL(unbrandedSL);
		}

		if (!mode.quiet && logMode.info)
			logger.info(`Generated randomSL: ${JSON.stringify(sl)}`);

		return sl;
	} catch (error) {
		if (logMode.errors)
			logger.error(`Error generating random SL color: ${error}`);

		const unbrandedSL = core.base.clone(defaults.colors.base.unbranded.sl);

		return core.brandColor.asSL(unbrandedSL);
	}
}

export const random: CommonUtilsFnRandom = {
	hsl,
	sl
} as const;
