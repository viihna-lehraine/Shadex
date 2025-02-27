import { defaults } from '../../../../config/partials/defaults.js';
import '../../../../config/partials/regex.js';

// File: core/utils/partials/color/generate.ts
const defaultColors = defaults.colors;
function colorGenerationUtilitiesFactory(sanitize, services, validate) {
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
                log.error(`Invalid random HSL color value ${JSON.stringify(hsl)}`, `generateRandomHSL`);
                return defaultColors.hsl;
            }
            log.debug(`Generated randomHSL: ${JSON.stringify(hsl)}`, `generateRandomHSL`);
            return hsl;
        }, 'Error generating random HSL color.');
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
                log.error(`Invalid random SV color value ${JSON.stringify(sl)}`, `generateRandomSL`);
                return defaultColors.sl;
            }
            log.debug(`Generated randomSL: ${JSON.stringify(sl)}`, `generateRandomSL`);
            return sl;
        }, 'Error generating random SL color');
    }
    const colorGenerationUtilities = {
        generateRandomHSL,
        generateRandomSL
    };
    return errors.handleSync(() => colorGenerationUtilities, 'Error creating color generation sub-utilities group.');
}

export { colorGenerationUtilitiesFactory };
//# sourceMappingURL=generate.js.map
