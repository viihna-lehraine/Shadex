import { convert } from '../color-conversion/conversion-index';
import * as types from '../index';

function adjustSL(color: types.HSL, amount: number = 10): types.HSL {
	const adjustedSaturation = Math.min(
		Math.max(color.value.saturation + amount, 0),
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
}

function getWeightedRandomInterval(): number {
	const weights: number[] = [40, 45, 50, 55, 60, 65, 70];
	const probabilities: number[] = [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05];

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
}

function initialHSLColorGen(color: types.Color): types.HSL | null {
	switch (color.format) {
		case 'cmyk':
			return convert.cmykToHSL(color as types.CMYK);
		case 'hex':
			return convert.hexToHSL(color as types.Hex);
		case 'hsl':
			return color as types.HSL;
		case 'hsv':
			return convert.hsvToHSL(color as types.HSV);
		case 'lab':
			return convert.labToHSL(color as types.LAB);
		case 'rgb':
			return convert.rgbToHSL(color as types.RGB);
		default:
			return null;
	}
}

export const paletteHelpers = {
	adjustSL,
	getWeightedRandomInterval,
	initialHSLColorGen
};
