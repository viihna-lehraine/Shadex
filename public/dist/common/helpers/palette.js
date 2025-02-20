import { paletteConfig } from '../../config/index.js';

// File: common/helpers/palette.js
function createPaletteHelpers(services, utils) {
    function isHSLTooDark(hsl) {
        const log = services.log;
        if (!utils.validate.colorValue(hsl)) {
            log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
            return false;
        }
        return (utils.core.clone(hsl).value.lightness <
            paletteConfig.thresholds.dark);
    }
    function isHSLTooGray(hsl) {
        const log = services.log;
        if (!utils.validate.colorValue(hsl)) {
            log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
            return false;
        }
        return (utils.core.clone(hsl).value.saturation <
            paletteConfig.thresholds.gray);
    }
    function isHSLTooLight(hsl) {
        const log = services.log;
        if (!utils.validate.colorValue(hsl)) {
            log('Invalid HSL value ${JSON.stringify(hsl)}', 'error');
            return false;
        }
        return (utils.core.clone(hsl).value.lightness >
            paletteConfig.thresholds.light);
    }
    return {
        isHSLTooDark,
        isHSLTooGray,
        isHSLTooLight,
        getWeightedRandomInterval(distributionType) {
            const log = services.log;
            try {
                // select appropriate type
                const { weights, values } = paletteConfig.probabilities[distributionType];
                // compute cumulative probabilities
                const cumulativeProbabilities = values.reduce((acc, prob, i) => {
                    acc[i] = (acc[i - 1] || 0) + prob;
                    return acc;
                }, []);
                const random = Math.random();
                // find corresponding weighted value
                for (let i = 0; i < cumulativeProbabilities.length; i++) {
                    if (random < cumulativeProbabilities[i])
                        return weights[i];
                }
                // fallback in case of error
                return weights[weights.length - 1];
            }
            catch (error) {
                log(`Error generating weighted random interval: ${error}`, 'error');
                return 50; // default fallback value
            }
        },
        isHSLInBounds(hsl) {
            const log = services.log;
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return false;
            }
            return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
        }
    };
}

export { createPaletteHelpers };
//# sourceMappingURL=palette.js.map
