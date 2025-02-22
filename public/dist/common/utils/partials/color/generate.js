import { defaults } from '../../../../config/index.js';

// File: common/utils/partials/color/generate.ts
const defaultColors = defaults.colors;
function colorGenerationUtilsFactory(sanitize, services, validate) {
    const { errors, log } = services;
    function generateRandomHSL() {
        return errors.handleSync(() => {
            const hsl = {
                value: {
                    hue: sanitize.radial(Math.floor(Math.random() * 360)),
                    saturation: sanitize.percentile(Math.floor(Math.random() * 101)),
                    lightness: sanitize.percentile(Math.floor(Math.random() * 101))
                },
                format: 'hsl'
            };
            if (!validate.colorValue(hsl)) {
                log(`Invalid random HSL color value ${JSON.stringify(hsl)}`, {
                    caller: 'generateRandomHSL',
                    level: 'error'
                });
                return defaultColors.hsl;
            }
            log(`Generated randomHSL: ${JSON.stringify(hsl)}`, {
                caller: 'generateRandomHSL',
                level: 'debug'
            });
            return hsl;
        }, 'Error generating random HSL color');
    }
    function generateRandomSL() {
        return errors.handleSync(() => {
            const sl = {
                value: {
                    saturation: sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100))),
                    lightness: sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100)))
                },
                format: 'sl'
            };
            if (!validate.colorValue(sl)) {
                log(`Invalid random SV color value ${JSON.stringify(sl)}`, {
                    caller: 'generateRandomSL',
                    level: 'error'
                });
                return defaultColors.sl;
            }
            log(`Generated randomSL: ${JSON.stringify(sl)}`, {
                caller: 'generateRandomSL',
                level: 'debug'
            });
            return sl;
        }, 'Error generating random SL color');
    }
    const colorGenerationUtils = {
        generateRandomHSL,
        generateRandomSL
    };
    return errors.handleSync(() => colorGenerationUtils, 'Error creating colorGenerationUtils.');
}

export { colorGenerationUtilsFactory };
//# sourceMappingURL=generate.js.map
