import { Helpers } from '../../../../src/types/index.js';

export const mockRandomHelpers: Helpers['random'] = {
	selectRandomFromWeights: jest
		.fn()
		.mockImplementation(({ weights, values }) => {
			console.log(
				`[Mock selectRandomFromWeights]: Called with weights=${weights}, values=${values}`
			);

			if (weights.length !== values.length || weights.length === 0) {
				throw new Error(
					'[Mock selectRandomFromWeights]: Weights and values must have the same non-zero length.'
				);
			}

			// always return the first value for predictability in tests
			return values[0];
		}),

	selectWeightedRandom: jest.fn().mockImplementation((weights, values) => {
		console.log(
			`[Mock selectWeightedRandom]: Called with weights=${weights}, values=${values}`
		);

		if (weights.length !== values.length || weights.length === 0) {
			throw new Error(
				'[Mock selectWeightedRandom]: Weights and values must have the same non-zero length.'
			);
		}

		// always return the value with the highest weight for predictability
		const maxWeightIndex = weights.indexOf(Math.max(...weights));
		return values[maxWeightIndex];
	})
};

export const mockRandomHelpersFactory = jest.fn(() => mockRandomHelpers);
