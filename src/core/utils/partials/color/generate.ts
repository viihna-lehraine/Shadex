// File: core/utils/partials/color/generate.ts

import {
	ColorGenerationUtilities,
	HSL,
	SL,
	SanitationUtilities,
	Services,
	ValidationUtilities
} from '../../../../types/index.js';
import { defaults } from '../../../../config/index.js';

const defaultColors = defaults.colors;

export function colorGenerationUtilitiesFactory(
	sanitize: SanitationUtilities,
	services: Services,
	validate: ValidationUtilities
): ColorGenerationUtilities {
	const { errors, log } = services;

	function generateRandomHSL(): HSL {
		return errors.handleSync(() => {
			const hsl: HSL = {
				value: {
					hue: sanitize.radial(Math.floor(Math.random() * 360)),
					saturation: sanitize.percentile(
						Math.floor(Math.random() * 101)
					),
					lightness: sanitize.percentile(
						Math.floor(Math.random() * 101)
					)
				},
				format: 'hsl'
			};

			if (!validate.colorValue(hsl)) {
				log.error(
					`Invalid random HSL color value ${JSON.stringify(hsl)}`,
					`generateRandomHSL`
				);

				return defaultColors.hsl;
			}

			log.debug(
				`Generated randomHSL: ${JSON.stringify(hsl)}`,
				`generateRandomHSL`
			);

			return hsl;
		}, 'Error generating random HSL color.');
	}

	function generateRandomSL(): SL {
		return errors.handleSync(() => {
			const sl: SL = {
				value: {
					saturation: sanitize.percentile(
						Math.max(0, Math.min(100, Math.random() * 100))
					),
					lightness: sanitize.percentile(
						Math.max(0, Math.min(100, Math.random() * 100))
					)
				},
				format: 'sl'
			};

			if (!validate.colorValue(sl as SL)) {
				log.error(
					`Invalid random SV color value ${JSON.stringify(sl)}`,
					`generateRandomSL`
				);

				return defaultColors.sl;
			}

			log.debug(
				`Generated randomSL: ${JSON.stringify(sl)}`,
				`generateRandomSL`
			);

			return sl;
		}, 'Error generating random SL color');
	}

	const colorGenerationUtilities: ColorGenerationUtilities = {
		generateRandomHSL,
		generateRandomSL
	};

	return errors.handleSync(
		() => colorGenerationUtilities,
		'Error creating color generation sub-utilities group.'
	);
}
