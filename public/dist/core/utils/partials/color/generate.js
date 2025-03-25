import { defaults } from '../../../../config/partials/defaults.js';
import '../../../../config/partials/regex.js';

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
    const colorGenerationUtilities = {
        generateRandomHSL
    };
    return errors.handleSync(() => colorGenerationUtilities, 'Error creating color generation sub-utilities group.');
}

export { colorGenerationUtilitiesFactory };
//# sourceMappingURL=generate.js.map
