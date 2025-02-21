import { defaults } from '../../../../config/index.js';

// File: common/utils/partials/color/generate.js
const defaultColors = defaults.colors;
function colorGenerationUtilsFactory(services, utils) {
    const { log } = services;
    return {
        generateRandomHSL() {
            try {
                const hsl = {
                    value: {
                        hue: utils.sanitize.radial(Math.floor(Math.random() * 360)),
                        saturation: utils.sanitize.percentile(Math.floor(Math.random() * 101)),
                        lightness: utils.sanitize.percentile(Math.floor(Math.random() * 101))
                    },
                    format: 'hsl'
                };
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid random HSL color value ${JSON.stringify(hsl)}`, 'error');
                    return defaultColors.hsl;
                }
                log(`Generated randomHSL: ${JSON.stringify(hsl)}`, 'debug');
                return hsl;
            }
            catch (error) {
                log(`Error generating random HSL color: ${error}`, 'warn');
                return defaultColors.hsl;
            }
        },
        generateRandomSL() {
            try {
                const sl = {
                    value: {
                        saturation: utils.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100))),
                        lightness: utils.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100)))
                    },
                    format: 'sl'
                };
                if (!utils.validate.colorValue(sl)) {
                    log(`Invalid random SV color value ${JSON.stringify(sl)}`, 'error');
                    return defaultColors.sl;
                }
                log(`Generated randomSL: ${JSON.stringify(sl)}`, 'debug');
                return sl;
            }
            catch (error) {
                log(`Error generating random SL color: ${error}`, 'error');
                return defaultColors.sl;
            }
        }
    };
}

export { colorGenerationUtilsFactory };
//# sourceMappingURL=generate.js.map
