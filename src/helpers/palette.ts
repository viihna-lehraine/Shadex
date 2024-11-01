import { config } from '../config/constants';
import { defaults } from '../config/defaults';
import * as fnObjects from '../index/fn-objects';
import * as colors from '../index/colors';
import { notification } from './notification';
import { convert } from '../palette-gen/conversion-index';
import { colorUtils } from '../utils/color-utils';
import { commonUtils } from '../utils/common-utils';
import { core } from '../utils/core-utils';

function adjustSL(color: colors.HSL): colors.HSL {
	try {
		if (!commonUtils.validateColorValues(color)) {
			console.error('Invalid color valus for adjustment.');

			notification.showToast('Invalid color values');

			return color;
		}

		const adjustedSaturation = Math.min(
			Math.max(color.value.saturation + config.adjustSLAmount, 0),
			100
		);
		const adjustedLightness = Math.min(100);

		return {
			value: {
				hue: color.value.hue,
				saturation: adjustedSaturation,
				lightness: adjustedLightness,
				alpha: color.value.alpha
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`Error adjusting saturation and lightness: ${error}`);

		return color;
	}
}

function getWeightedRandomInterval(): number {
	try {
		const weights: number[] = config.weights;
		const probabilities: number[] = config.probabilities;
		const cumulativeProbabilities: number[] = probabilities.reduce(
			(acc: number[], prob: number, i: number) => {
				acc[i] = (acc[i - 1] || 0) + prob;
				return acc;
			},
			[]
		);
		const random = Math.random();

		for (let i = 0; i < cumulativeProbabilities.length; i++) {
			if (random < cumulativeProbabilities[i]) {
				return weights[i];
			}
		}

		return weights[weights.length - 1];
	} catch (error) {
		console.error(`Error generating weighted random interval: ${error}`);

		return 50;
	}
}

function hexToHSLWrapper(input: string | colors.Hex): colors.HSL {
	try {
		const clonedInput = core.clone(input);
		const hex: colors.Hex =
			typeof clonedInput === 'string'
				? {
						value: {
							hex: clonedInput,
							alpha: clonedInput.slice(-2),
							numericAlpha: colorUtils.hexAlphaToNumericAlpha(
								clonedInput.slice(-2)
							)
						},
						format: 'hex'
					}
				: {
						...clonedInput,
						value: {
							...clonedInput.value,
							numericAlpha: colorUtils.hexAlphaToNumericAlpha(
								clonedInput.value.alpha
							)
						}
					};

		return convert.hexToHSL(hex);
	} catch (error) {
		console.error(`Error converting hex to HSL: ${error}`);

		return defaults.hsl;
	}
}

export const paletteHelpers: fnObjects.PaletteHelpers = {
	adjustSL,
	getWeightedRandomInterval,
	hexToHSLWrapper
};
