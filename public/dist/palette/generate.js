import { config } from '../config/index.js';

// File: palette/generate.js
const defaultPalette = config.defaults.palette;
function generatePalette(options, common, generateHuesFns, generatePaletteFns) {
    const { log, errors } = common.services;
    try {
        log(`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, 'debug');
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
                log(`Invalid palette type ${options.paletteType}`, 'error');
                return defaultPalette;
        }
    }
    catch (error) {
        errors.handle(error, 'Error occurred during palette generation');
        return defaultPalette;
    }
}

export { generatePalette };
//# sourceMappingURL=generate.js.map
