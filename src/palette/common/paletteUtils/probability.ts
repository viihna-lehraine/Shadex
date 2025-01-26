// File: src/paelette/common/paletteUtils/probability.js

import { consts, mode } from '../../../common/data/base.js';
import { createLogger } from '../../../logger/index.js';

const logger = await createLogger();

const logMode = mode.logging;
const probabilities = consts.probabilities;

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
			if (random < cumulativeProbabilities[i]) return weights[i];
		}

		return weights[weights.length - 1];
	} catch (error) {
		if (logMode.error)
			// eslint-disable-next-line prettier/prettier
			logger.error(`Error generating weighted random interval: ${error}`, 'palette > common > paletteUtils > getWeightedRandomInterval()');

		return 50;
	}
}

export const probability = {
	getWeightedRandomInterval
} as const;
