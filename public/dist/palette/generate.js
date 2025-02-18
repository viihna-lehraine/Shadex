import { data } from '../data/index.js';

// File: palette/generate.js
const defaultPalette = data.defaults.palette;
function generatePalette(options, common, generateHuesFns, generatePaletteFns) {
    const log = common.services.log;
    const errors = common.services.errors;
    try {
        log('debug', `Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, 'generatePalette()', 2);
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
            case 'split-complementary':
                return generatePaletteFns.splitComplementary(options, common);
            case 'tetradic':
                return generatePaletteFns.tetradic(options, common, generateHuesFns);
            case 'triadic':
                return generatePaletteFns.triadic(options, common, generateHuesFns);
            default:
                log('error', `Invalid palette type ${options.paletteType}`, 'generatePalette()');
                return defaultPalette;
        }
    }
    catch (error) {
        errors.handle(error, 'Error occurred during palette generation', 'generatePalette()');
        return defaultPalette;
    }
}

export { generatePalette };
//# sourceMappingURL=generate.js.map
