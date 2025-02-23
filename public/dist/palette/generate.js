import { defaults } from '../config/partials/defaults.js';
import '../config/partials/regex.js';

// File: palette/generate.js
const defaultPalette = defaults.palette;
function generatePalette(options, common, generateHuesFns, generatePaletteFns) {
    const { log, errors } = common.services;
    return errors.handleSync(() => {
        log(`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, {
            caller: '[generatePalette]',
            level: 'debug'
        });
        switch (options.paletteType) {
            case 'analogous':
                return generatePaletteFns.analogous(options, common, generateHuesFns);
            case 'complementary':
                return generatePaletteFns.complementary(options, common);
            case 'diadic':
                return generatePaletteFns.diadic(options, common, generateHuesFns);
            case 'hexadic':
                return generatePaletteFns.hexadic(options, common, generateHuesFns);
            case 'monochromatic':
                return generatePaletteFns.monochromatic(options, common);
            case 'random':
                return generatePaletteFns.random(options, common);
            case 'splitComplementary':
                return generatePaletteFns.splitComplementary(options, common);
            case 'tetradic':
                return generatePaletteFns.tetradic(options, common, generateHuesFns);
            case 'triadic':
                return generatePaletteFns.triadic(options, common, generateHuesFns);
            default:
                log(`Invalid palette type ${options.paletteType}`, {
                    caller: '[generatePalette]',
                    level: 'error'
                });
                return defaultPalette;
        }
    }, 'Error generating palette', { context: { options } });
}

export { generatePalette };
//# sourceMappingURL=generate.js.map
