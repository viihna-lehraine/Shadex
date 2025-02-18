import { data } from '../../data/index.js';

// File: common/helpers/palette.js
const config = data.config;
const probabilityConsts = config.probabilities;
function createPaletteHelpers(services, utils) {
    function isHSLTooDark(hsl) {
        const log = services.log;
        if (!utils.validate.colorValue(hsl)) {
            log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'paletteUtils.isHSLTooDark()');
            return false;
        }
        return utils.core.clone(hsl).value.lightness < config.thresholds.dark;
    }
    function isHSLTooGray(hsl) {
        const log = services.log;
        if (!utils.validate.colorValue(hsl)) {
            log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'paletteUtils.isHSLTooGray()');
            return false;
        }
        return utils.core.clone(hsl).value.saturation < config.thresholds.gray;
    }
    function isHSLTooLight(hsl) {
        const log = services.log;
        if (!utils.validate.colorValue(hsl)) {
            log('error', 'Invalid HSL value ${JSON.stringify(hsl)}', 'paletteUtils.isHSLTooLight()');
            return false;
        }
        return utils.core.clone(hsl).value.lightness > config.thresholds.light;
    }
    return {
        isHSLTooDark,
        isHSLTooGray,
        isHSLTooLight,
        getWeightedRandomInterval(distributionType) {
            const log = services.log;
            try {
                // select appropriate type
                const { weights, values } = probabilityConsts[distributionType];
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
                log('error', `Error generating weighted random interval: ${error}`, 'paletteUtils.getWeightedRandomInterval()');
                return 50; // default fallback value
            }
        },
        isHSLInBounds(hsl) {
            const log = services.log;
            if (!utils.validate.colorValue(hsl)) {
                log('error', `isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`, 'paletteUtils.isHSLInBounds()');
                return false;
            }
            return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
        }
    };
}

export { createPaletteHelpers };
//# sourceMappingURL=palette.js.map
