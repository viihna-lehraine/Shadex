// File: src/common/helpers/conversion.js

import {
	CommonFunctionsMasterInterface,
	HSL,
	HSLValue,
	RGB
} from '../../types/index.js';
import { createLogger } from '../../logger/index.js';
import { defaults, mode } from '../data/base.js';
import { core } from '../core/index.js';

const logger = await createLogger();

const logMode = mode.logging;

export function applyGammaCorrection(value: number): number {
	try {
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error applying gamma correction: ${error}`,
				'applyGammaCorrection()'
			);

		return value;
	}
}

export function clampRGB(rgb: RGB): RGB {
	const defaultRGBUnbranded = core.base.clone(
		defaults.colors.base.unbranded.rgb
	);
	const defaultRGBBranded = core.brandColor.asRGB(defaultRGBUnbranded);

	if (!core.validate.colorValues(rgb)) {
		if (logMode.error)
			logger.error(
				`Invalid RGB value ${JSON.stringify(rgb)}`,
				'clampRGB()'
			);

		return defaultRGBBranded;
	}

	try {
		return {
			value: {
				red: core.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255)
				),
				green: core.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255)
				),
				blue: core.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255)
				),
				alpha: core.brand.asAlphaRange(
					parseFloat(
						Math.min(Math.max(0, rgb.value.alpha), 1).toFixed(2)
					)
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		if (logMode.error)
			logger.error(`Error clamping RGB values: ${error}`, 'clampRGB()');

		return rgb;
	}
}

export function hueToRGB(p: number, q: number, t: number): number {
	try {
		const clonedP = core.base.clone(p);
		const clonedQ = core.base.clone(q);

		let clonedT = core.base.clone(t);

		if (clonedT < 0) clonedT += 1;
		if (clonedT > 1) clonedT -= 1;
		if (clonedT < 1 / 6) return clonedP + (clonedQ - clonedP) * 6 * clonedT;
		if (clonedT < 1 / 2) return clonedQ;
		if (clonedT < 2 / 3)
			return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;

		return clonedP;
	} catch (error) {
		if (logMode.error)
			logger.error(`Error converting hue to RGB: ${error}`, 'hueToRGB()');

		return 0;
	}
}

export function hslAddFormat(value: HSLValue): HSL {
	const defaultHSLUnbranded = core.base.clone(
		defaults.colors.base.unbranded.hsl
	);
	const defaultHSLBranded = core.brandColor.asHSL(defaultHSLUnbranded);

	try {
		if (!core.validate.colorValues({ value: value, format: 'hsl' })) {
			if (logMode.error)
				logger.error(
					`Invalid HSL value ${JSON.stringify(value)}`,
					'hslAddFormat()'
				);

			return defaultHSLBranded;
		}

		return { value: value, format: 'hsl' } as HSL;
	} catch (error) {
		if (logMode.error)
			logger.error(`Error adding HSL format: ${error}`, 'hslAddFormat()');

		return defaultHSLBranded;
	}
}

export const conversion: CommonFunctionsMasterInterface['helpers']['conversion'] =
	{
		applyGammaCorrection,
		clampRGB,
		hslAddFormat,
		hueToRGB
	} as const;
