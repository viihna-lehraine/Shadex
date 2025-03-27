// File: src/scripts/core/utils/partials/color/generate.ts

import {
	ColorGenerationUtilities,
	HSL,
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

	const colorGenerationUtilities: ColorGenerationUtilities = {
		generateRandomHSL
	};

	return errors.handleSync(
		() => colorGenerationUtilities,
		'Error creating color generation sub-utilities group.'
	);
}
