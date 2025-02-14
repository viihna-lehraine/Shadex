// File: utils/adjustment.js

import {
	AdjustmentUtilsInterface,
	HSL,
	RGB,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { constsData as consts } from '../data/consts.js';
import { defaultData as defaults } from '../data/defaults.js';

const adjustments = consts.adjustments;
const defaultColors = defaults.colors;

function adjustSL(
	color: HSL,
	services: ServicesInterface,
	utils: UtilitiesInterface
): HSL {
	const log = services.app.log;

	try {
		if (!utils.validate.colorValue(color, utils)) {
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
				saturation: utils.brand.asPercentile(adjustedSaturation, utils),
				lightness: utils.brand.asPercentile(adjustedLightness, utils)
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
	services: ServicesInterface
): number {
	const log = services.app.log;

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
	services: ServicesInterface,
	utils: UtilitiesInterface
): RGB {
	const log = services.app.log;
	const defaultRGB = defaultColors.rgb;

	if (!utils.validate.colorValue(rgb, utils)) {
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
				red: utils.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255),
					utils
				),
				green: utils.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255),
					utils
				),
				blue: utils.brand.asByteRange(
					Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255),
					utils
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
