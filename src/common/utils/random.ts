// File: common/utils/random.js

import { CommonFn_MasterInterface, HSL, SL } from '../../types/index.js';
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { defaultData as defaults } from '../../data/defaults.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/utils/random.js';

const logger = await createLogger();

function hsl(enableAlpha: boolean): HSL {
	const thisMethod = 'hsl()';

	try {
		const alpha = enableAlpha ? Math.round(Math.random() * 100) / 100 : 1;
		const hsl: HSL = {
			value: {
				hue: coreUtils.sanitize.radial(Math.floor(Math.random() * 360)),
				saturation: coreUtils.sanitize.percentile(
					Math.floor(Math.random() * 101)
				),
				lightness: coreUtils.sanitize.percentile(
					Math.floor(Math.random() * 101)
				),
				alpha: coreUtils.brand.asAlphaRange(alpha)
			},
			format: 'hsl'
		};

		if (!coreUtils.validate.colorValues(hsl)) {
			if (logMode.error)
				logger.error(
					`Invalid random HSL color value ${JSON.stringify(hsl)}`,
					`${thisModule} > ${thisMethod}`
				);

			const unbrandedHSL = coreUtils.base.clone(
				defaults.colors.base.unbranded.hsl
			);

			return coreUtils.brandColor.asHSL(unbrandedHSL);
		}

		if (!mode.quiet && !logMode.info)
			logger.info(
				`Generated randomHSL: ${JSON.stringify(hsl)}`,
				`${thisModule} > ${thisMethod}`
			);

		return hsl;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating random HSL color: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		const unbrandedHSL = coreUtils.base.clone(
			defaults.colors.base.unbranded.hsl
		);

		return coreUtils.brandColor.asHSL(unbrandedHSL);
	}
}

function sl(enableAlpha: boolean): SL {
	const thisMethod = 'sl()';

	try {
		const alpha = enableAlpha ? Math.round(Math.random() * 100) / 100 : 1;
		const sl: SL = {
			value: {
				saturation: coreUtils.sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				lightness: coreUtils.sanitize.percentile(
					Math.max(0, Math.min(100, Math.random() * 100))
				),
				alpha: coreUtils.brand.asAlphaRange(alpha)
			},
			format: 'sl'
		};

		if (!coreUtils.validate.colorValues(sl as SL)) {
			if (logMode.error)
				logger.error(
					`Invalid random SV color value ${JSON.stringify(sl)}`,
					`${thisModule} > ${thisMethod}`
				);

			const unbrandedSL = coreUtils.base.clone(
				defaults.colors.base.unbranded.sl
			);

			return coreUtils.brandColor.asSL(unbrandedSL);
		}

		if (!mode.quiet && logMode.info)
			logger.info(
				`Generated randomSL: ${JSON.stringify(sl)}`,
				`${thisModule} > ${thisMethod}`
			);

		return sl;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error generating random SL color: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		const unbrandedSL = coreUtils.base.clone(
			defaults.colors.base.unbranded.sl
		);

		return coreUtils.brandColor.asSL(unbrandedSL);
	}
}

export const randomUtils: CommonFn_MasterInterface['utils']['random'] = {
	hsl,
	sl
} as const;
