// File: common/helpers/palette.js

import {
	EnvData,
	HSL,
	PaletteHelpersInterface,
	ServicesInterface,
	UtilitiesInterface
} from '../../types/index.js';
import { config } from '../../config/index.js';

const env = config.env;
const probabilityConsts = env.probabilities;

export function createPaletteHelpers(
	services: ServicesInterface,
	utils: UtilitiesInterface
): PaletteHelpersInterface {
	function isHSLTooDark(hsl: HSL): boolean {
		const log = services.log;

		if (!utils.validate.colorValue(hsl)) {
			log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');

			return false;
		}

		return utils.core.clone(hsl).value.lightness < env.thresholds.dark;
	}

	function isHSLTooGray(hsl: HSL): boolean {
		const log = services.log;

		if (!utils.validate.colorValue(hsl)) {
			log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');

			return false;
		}

		return utils.core.clone(hsl).value.saturation < env.thresholds.gray;
	}

	function isHSLTooLight(hsl: HSL): boolean {
		const log = services.log;

		if (!utils.validate.colorValue(hsl)) {
			log('Invalid HSL value ${JSON.stringify(hsl)}', 'error');

			return false;
		}

		return utils.core.clone(hsl).value.lightness > env.thresholds.light;
	}

	return {
		isHSLTooDark,
		isHSLTooGray,
		isHSLTooLight,
		getWeightedRandomInterval(
			distributionType: keyof EnvData['probabilities']
		): number {
			const log = services.log;

			try {
				// select appropriate type
				const { weights, values } = probabilityConsts[distributionType];

				// compute cumulative probabilities
				const cumulativeProbabilities: number[] = values.reduce(
					(acc: number[], prob: number, i: number) => {
						acc[i] = (acc[i - 1] || 0) + prob;

						return acc;
					},
					[]
				);
				const random = Math.random();

				// find corresponding weighted value
				for (let i = 0; i < cumulativeProbabilities.length; i++) {
					if (random < cumulativeProbabilities[i]) return weights[i];
				}

				// fallback in case of error
				return weights[weights.length - 1];
			} catch (error) {
				log(
					`Error generating weighted random interval: ${error}`,
					'error'
				);

				return 50; // default fallback value
			}
		},
		isHSLInBounds(hsl: HSL): boolean {
			const log = services.log;

			if (!utils.validate.colorValue(hsl)) {
				log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');

				return false;
			}

			return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
		}
	};
}
