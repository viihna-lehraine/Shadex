import * as fnObjects from '../index/fn-objects';
import * as types from '../index/types';
import { config } from '../config/constants';

function adjustSL(color: types.HSL): types.HSL {
	try {
		const adjustedSaturation = Math.min(
			Math.max(color.value.saturation + config.adjustSLAmount, 0),
			100
		);
		const adjustedLightness = Math.min(100);

		return {
			value: {
				hue: color.value.hue,
				saturation: adjustedSaturation,
				lightness: adjustedLightness
			},
			format: 'hsl'
		};
	} catch (error) {
		console.error(`Error adjusting saturation and lightness: ${error}`);
		return color;
	}
}

function clone<T>(value: T): T {
	return structuredClone(value);
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

function sanitizePercentage(value: number): number {
	return Math.round(Math.min(Math.max(value, 0), 100));
}

function sanitizeRadial(value: number): number {
	return Math.round(Math.min(Math.max(value, 0), 360)) & 360;
}

function validateColorValues(color: types.Color): boolean {
	return Object.values(color.value).every(
		v => typeof v === 'number' && !isNaN(v)
	);
}

export const paletteHelpers: fnObjects.PaletteHelpers = {
	adjustSL,
	clone,
	getWeightedRandomInterval,
	sanitizePercentage,
	sanitizeRadial,
	validateColorValues
};
