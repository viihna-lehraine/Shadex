// File: src/common/helpers/conversion.js

import {
	CommonHelpersConversion,
	HSL,
	HSLValue,
	RGB
} from '../../index/index.js';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { log } from '../../classes/logger/index.js';

const logMode = data.mode.logging;

export function applyGammaCorrection(value: number): number {
	try {
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	} catch (error) {
		if (logMode.errors)
			log.error(`Error applying gamma correction: ${error}`);

		return value;
	}
}

export function clampRGB(rgb: RGB): RGB {
	const defaultRGBUnbranded = core.base.clone(data.defaults.colors.rgb);
	const defaultRGBBranded = core.brandColor.asRGB(defaultRGBUnbranded);

	if (!core.validate.colorValues(rgb)) {
		if (logMode.errors)
			log.error(`Invalid RGB value ${JSON.stringify(rgb)}`);

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
		if (logMode.errors) log.error(`Error clamping RGB values: ${error}`);

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
		if (logMode.errors) log.error(`Error converting hue to RGB: ${error}`);

		return 0;
	}
}

export function hslAddFormat(value: HSLValue): HSL {
	const defaultHSLUnbranded = core.base.clone(data.defaults.colors.hsl);
	const defaultHSLBranded = core.brandColor.asHSL(defaultHSLUnbranded);

	try {
		if (!core.validate.colorValues({ value: value, format: 'hsl' })) {
			if (logMode.errors)
				log.error(`Invalid HSL value ${JSON.stringify(value)}`);

			return defaultHSLBranded;
		}

		return { value: value, format: 'hsl' } as HSL;
	} catch (error) {
		if (logMode.errors) log.error(`Error adding HSL format: ${error}`);

		return defaultHSLBranded;
	}
}

export const conversion: CommonHelpersConversion = {
	applyGammaCorrection,
	clampRGB,
	hslAddFormat,
	hueToRGB
} as const;
