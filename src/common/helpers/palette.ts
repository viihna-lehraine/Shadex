// File: common/helpers/palette.js

import {
	ConstsDataInterface,
	HSL,
	PaletteUtilHelpersInterface,
	ServicesInterface,
	UtilitiesInterface
} from '../../types/index.js';
import { constsData as consts } from '../../data/consts.js';

const probabilityConsts = consts.probabilities;

export function createPaletteHelpers(
	services: ServicesInterface,
	utils: UtilitiesInterface
): PaletteUtilHelpersInterface {
	function isHSLTooDark(hsl: HSL): boolean {
		const log = services.app.log;

		if (!utils.validate.colorValue(hsl)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'paletteUtils.isHSLTooDark()'
			);

			return false;
		}

		return utils.core.clone(hsl).value.lightness < consts.thresholds.dark;
	}

	function isHSLTooGray(hsl: HSL): boolean {
		const log = services.app.log;

		if (!utils.validate.colorValue(hsl)) {
			log(
				'error',
				`Invalid HSL value ${JSON.stringify(hsl)}`,
				'paletteUtils.isHSLTooGray()'
			);

			return false;
		}

		return utils.core.clone(hsl).value.saturation < consts.thresholds.gray;
	}

	function isHSLTooLight(hsl: HSL): boolean {
		const log = services.app.log;

		if (!utils.validate.colorValue(hsl)) {
			log(
				'error',
				'Invalid HSL value ${JSON.stringify(hsl)}',
				'paletteUtils.isHSLTooLight()'
			);

			return false;
		}

		return utils.core.clone(hsl).value.lightness > consts.thresholds.light;
	}

	return {
		isHSLTooDark,
		isHSLTooGray,
		isHSLTooLight,
		getWeightedRandomInterval(
			distributionType: keyof ConstsDataInterface['probabilities']
		): number {
			const log = services.app.log;

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
					'error',
					`Error generating weighted random interval: ${error}`,
					'paletteUtils.getWeightedRandomInterval()'
				);

				return 50; // default fallback value
			}
		},
		isHSLInBounds(hsl: HSL): boolean {
			const log = services.app.log;

			if (!utils.validate.colorValue(hsl)) {
				log(
					'error',
					`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`,
					'paletteUtils.isHSLInBounds()'
				);

				return false;
			}

			return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
		}
	};
}
