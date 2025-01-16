// File: src/paelette/common/paletteUtils/probability.js

import { PaletteCommon_Utils_Probability } from '../../../index/index.js';
import { data } from '../../../data/index.js';
import { log } from '../../../classes/logger/index.js';

const logMode = data.mode.logging;
const probabilities = data.consts.probabilities;

function getWeightedRandomInterval(): number {
	try {
		const weights = probabilities.weights;
		const probabilityValues = probabilities.values;
		const cumulativeProbabilities: number[] = probabilityValues.reduce(
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
		if (logMode.errors)
			log.error(`Error generating weighted random interval: ${error}`);

		return 50;
	}
}

export const probability: PaletteCommon_Utils_Probability = {
	getWeightedRandomInterval
} as const;
