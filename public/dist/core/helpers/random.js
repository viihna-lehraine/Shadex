// File: core/helpers/random.ts
const randomHelpersFactory = () => ({
    selectRandomFromWeights(obj) {
        return this.selectWeightedRandom(obj.weights, obj.values);
    },
    selectWeightedRandom(weights, values) {
        try {
            if (weights.length !== values.length || weights.length === 0) {
                throw new Error('Weights and values must have the same non-zero length.');
            }
            const cumulativeProbabilities = values.reduce((acc, value, i) => {
                acc[i] = (acc[i - 1] ?? 0) + value;
                return acc;
            }, []);
            const random = Math.random();
            const selectedIndex = cumulativeProbabilities.findIndex(prob => random < prob);
            return weights[selectedIndex >= 0 ? selectedIndex : weights.length - 1];
        }
        catch (error) {
            throw new Error(`[getWeightedRandomValue-ERR]: Error generating weighted random value: ${error instanceof Error ? error.message : error}`);
        }
    }
});

export { randomHelpersFactory };
//# sourceMappingURL=random.js.map
