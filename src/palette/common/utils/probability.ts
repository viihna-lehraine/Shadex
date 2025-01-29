// File: paelette/common/utils/probability.js

import { constsData as consts } from '../../../data/consts.js';
import { createLogger } from '../../../logger/index.js';
import { modeData as mode } from '../../../data/mode.js';

const logMode = mode.logging;
const probabilities = consts.probabilities;

const thisModule = 'common/utils/probabilities.js';

const logger = await createLogger();

function getWeightedRandomInterval(): number {
	const thisFunction = 'getWeightedRandomInterval()';

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
			logger.error(
				`Error generating weighted random interval: ${error}`,
				`${thisModule} > ${thisFunction}`
			);

		return 50;
	}
}

export const probability = {
	getWeightedRandomInterval
} as const;
