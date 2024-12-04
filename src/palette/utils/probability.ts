// File: src/paelette/utils/probability.ts

import { config } from '../../config';

const probabilities = config.consts.probabilities;

function getWeightedRandomInterval(): number {
	try {
		const weights: number[] = probabilities.weights;
		const probabilityValues: number[] = probabilities.values;
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
		console.error(`Error generating weighted random interval: ${error}`);

		return 50;
	}
}

export const probability = { getWeightedRandomInterval };
