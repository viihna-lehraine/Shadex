// File: utils/adjustment.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	ConfigDataInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	DataSetsInterface,
	DefaultDataInterface,
	HSL,
	RGB,
	ValidationUtilsInterface
} from '../types/index.js';

function adjustSL(
	color: HSL,
	adjustments: ConstsDataInterface['adjustments'],
	brandingUtils: BrandingUtilsInterface,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): HSL {
	try {
		if (!validate.colorValue(color, coreUtils, regex)) {
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
					sets,
					validate
				),
				lightness: brandingUtils.asPercentile(
					adjustedLightness,
					sets,
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
	log: AppServicesInterface['log']
): number {
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
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): RGB {
	const defaultRGB = defaultColors.rgb;

	if (!validate.colorValue(rgb, coreUtils, regex)) {
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
					sets,
					validate
				),
				green: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255),
					sets,
					validate
				),
				blue: brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255),
					sets,
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
