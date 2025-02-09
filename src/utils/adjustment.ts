// File: utils/adjustment.js

import {
	AdjustmentUtilsInterface,
	BrandingUtilsInterface,
	CoreUtilsInterface,
	ValidationUtilsInterface,
	HSL,
	RGB
} from '../types/index.js';
import { appServices } from '../services/app.js';
import { brandingUtils } from './branding.js';
import { constsData as consts } from '../data/consts.js';
import { defaultData as defaults } from '../data/defaults.js';
import { validationUtils } from './validation.js';

function adjustSL(
	color: HSL,
	brandingUtils: BrandingUtilsInterface,
	validationUtils: ValidationUtilsInterface
): HSL {
	const adjustments = consts.adjustments;
	const log = appServices.log;

	try {
		if (!validationUtils.colorValue(color)) {
			log(
				'error',
				'Invalid color valus for adjustment.',
				'adjustmentUtils.adjustSL()'
			);

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
				saturation: brandingUtils.asPercentile(
					adjustedSaturation,
					validationUtils.range
				),
				lightness: brandingUtils.asPercentile(
					adjustedLightness,
					validationUtils.range
				)
			},
			format: 'hsl'
		};
	} catch (error) {
		log(
			'error',
			`Error adjusting saturation and lightness: ${error}`,
			'adjustmentUtils.adjustSL()'
		);

		return color;
	}
}

function applyGammaCorrection(value: number): number {
	const log = appServices.log;

	try {
		return value > 0.0031308
			? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
			: 12.92 * value;
	} catch (error) {
		log(
			'error',
			`Error applying gamma correction: ${error}`,
			'adjustmentUtils.applyGammaCorrection()'
		);

		return value;
	}
}

function clampRGB(
	rgb: RGB,
	brand: BrandingUtilsInterface,
	validationUtils: ValidationUtilsInterface
): RGB {
	const defaultRGB = defaults.colors.base.branded.rgb;

	const log = appServices.log;

	if (!validationUtils.colorValue(rgb)) {
		log(
			'error',
			`Invalid RGB value ${JSON.stringify(rgb)}`,
			'adjustmentUtils.clampRGB()'
		);

		return defaultRGB;
	}

	try {
		return {
			value: {
				red: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255),
					validationUtils.range
				),
				green: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255),
					validationUtils.range
				),
				blue: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255),
					validationUtils.range
				)
			},
			format: 'rgb'
		};
	} catch (error) {
		log(
			'error',
			`Error clamping RGB values: ${error}`,
			'adjustmentUtils.clampRGB()'
		);

		return rgb;
	}
}

export const adjustmentUtils: AdjustmentUtilsInterface = {
	adjustSL,
	applyGammaCorrection,
	clampRGB
};
