// File: src/scripts/core/utils/adjust.ts

import {
	AdjustmentUtilities,
	BrandingUtilities,
	HSL,
	RGB,
	Services,
	ValidationUtilities
} from '../../types/index.js';
import { defaults, paletteConfig } from '../../config/index.js';

const adjustments = paletteConfig.adjustment;
const defaultColors = defaults.colors;

export function adjustmentUtilitiesFactory(
	brand: BrandingUtilities,
	services: Services,
	validate: ValidationUtilities
): AdjustmentUtilities {
	const { errors, log } = services;

	function applyGammaCorrection(value: number): number {
		return errors.handleSync(() => {
			return value > 0.0031308
				? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
				: 12.92 * value;
		}, 'Error occurred while applying gamma correction.');
	}

	function clampRGB(rgb: RGB): RGB {
		return errors.handleSync(() => {
			const defaultRGB = defaultColors.rgb;

			if (!validate.colorValue(rgb)) {
				log.error(
					`Invalid RGB value ${JSON.stringify(rgb)}`,
					'adjustmentUtils.clampRGB'
				);

				return defaultRGB;
			}

			return {
				value: {
					red: brand.asByteRange(
						Math.round(
							Math.min(Math.max(0, rgb.value.red), 1) * 255
						)
					),
					green: brand.asByteRange(
						Math.round(
							Math.min(Math.max(0, rgb.value.green), 1) * 255
						)
					),
					blue: brand.asByteRange(
						Math.round(
							Math.min(Math.max(0, rgb.value.blue), 1) * 255
						)
					)
				},
				format: 'rgb'
			};
		}, 'Error occurred while clamping RGB value.');
	}

	function sl(color: HSL): HSL {
		return errors.handleSync(() => {
			if (!validate.colorValue(color)) {
				log.error(
					'Invalid color valus for adjustment.',
					`adjustmentUtils.sl`
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
					saturation: brand.asPercentile(adjustedSaturation),
					lightness: brand.asPercentile(adjustedLightness)
				},
				format: 'hsl'
			};
		}, 'Error occurred while adjusting saturation and lightness.');
	}

	const adjustmentUtilities: AdjustmentUtilities = {
		applyGammaCorrection,
		clampRGB,
		sl
	};

	return errors.handleSync(() => {
		return adjustmentUtilities;
	}, 'Error occurred while creating adjustment utils.');
}
