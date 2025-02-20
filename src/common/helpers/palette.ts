// File: common/helpers/palette.ts

import {
	PaletteConfig,
	PaletteHelpers,
	ProbabilityProperties
} from '../../types/index.js';
import { paletteConfig } from '../../config/index.js';

export const createPaletteHelpers = (): PaletteHelpers =>
	({
		getWeightsAndValues(
			distributionType: keyof PaletteConfig['probabilities']
		): { weights: readonly number[]; values: readonly number[] } {
			const probabilityProps: ProbabilityProperties =
				paletteConfig.probabilities[distributionType];

			if (!probabilityProps) {
				throw new Error(
					`Invalid distribution type: ${distributionType}`
				);
			}

			const { weights, values } = probabilityProps;
			return { weights, values };
		}
	}) as const;
