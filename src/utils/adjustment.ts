// File: utils/adjustment.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	CoreUtilsInterface,
	HSL,
	RGB,
	ValidationUtilsInterface
} from '../types/index.js';
import { constsData as consts } from '../data/consts.js';
import { defaultData as defaults } from '../data/defaults.js';

const adjustments = consts.adjustments;
const defaultColors = defaults.colors.base.branded;

function adjustSL(
	color: HSL,
	appServices: AppServicesInterface,
	brandingUtils: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): HSL {
	const log = appServices.log;

	try {
		if (!validate.colorValue(color, coreUtils)) {
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
					validate
				),
				lightness: brandingUtils.asPercentile(
					adjustedLightness,
					validate
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

function applyGammaCorrection(
	value: number,
	appServices: AppServicesInterface
): number {
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
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	validate: ValidationUtilsInterface
): RGB {
	const log = appServices.log;
	const defaultRGB = defaultColors.rgb;

	if (!validate.colorValue(rgb, coreUtils)) {
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
					validate
				),
				green: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255),
					validate
				),
				blue: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255),
					validate
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
