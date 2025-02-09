// File: common/helpers/conversion.js

import { CommonFn_MasterInterface, HSL, RGB } from '../../types/index.js';
import { createLogger } from '../../logger/index.js';
import { coreUtils } from '../core/core.js';
import { defaultData as defaults } from '../../data/defaults.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/helpers/conversion.js';

const logger = await createLogger();

export function applyGammaCorrection(value: number): number {
	const thisMethod = 'applyGammaCorrection()';

	try {
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error applying gamma correction: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return value;
	}
}

export function clampRGB(rgb: RGB): RGB {
	const thisMethod = 'clampRGB()';
	const defaultRGBUnbranded = coreUtils.base.clone(
		defaults.colors.base.unbranded.rgb
	);
	const defaultRGBBranded = coreUtils.brandColor.asRGB(defaultRGBUnbranded);

	if (!coreUtils.validate.colorValues(rgb)) {
		if (logMode.error)
			logger.error(
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				`${thisModule} > ${thisMethod}`
			);

		return defaultRGBBranded;
	}

	try {
		return {
			value: {
				red: coreUtils.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255)
				),
				green: coreUtils.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255)
				),
				blue: coreUtils.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255)
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error clamping RGB values: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return rgb;
	}
}

export function hueToRGB(p: number, q: number, t: number): number {
	const thisMethod = 'hueToRGB()';

	try {
		const clonedP = coreUtils.base.clone(p);
		const clonedQ = coreUtils.base.clone(q);

		let clonedT = coreUtils.base.clone(t);

		if (clonedT < 0) clonedT += 1;
		if (clonedT > 1) clonedT -= 1;
		if (clonedT < 1 / 6) return clonedP + (clonedQ - clonedP) * 6 * clonedT;
		if (clonedT < 1 / 2) return clonedQ;
		if (clonedT < 2 / 3)
			return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;

		return clonedP;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error converting hue to RGB: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return 0;
	}
}

export function hslAddFormat(value: HSL['value']): HSL {
	const thisMethod = 'hslAddFormat()';
	const defaultHSLUnbranded = coreUtils.base.clone(
		defaults.colors.base.unbranded.hsl
	);
	const defaultHSLBranded = coreUtils.brandColor.asHSL(defaultHSLUnbranded);

	try {
		if (!coreUtils.validate.colorValues({ value: value, format: 'hsl' })) {
			if (logMode.error)
				logger.error(
					`Invalid HSL value ${JSON.stringify(value)}`,
					`${thisModule} > ${thisMethod}`
				);

			return defaultHSLBranded;
		}

		return { value: value, format: 'hsl' } as HSL;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error adding HSL format: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return defaultHSLBranded;
	}
}

export const conversionHelpers: CommonFn_MasterInterface['helpers']['conversion'] =
	{
		applyGammaCorrection,
		clampRGB,
		hslAddFormat,
		hueToRGB
	} as const;
