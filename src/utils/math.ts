export function getWeightedRandomInterval(): number {
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
