import { defaults } from '../config/partials/defaults.js';
import '../config/partials/regex.js';

const defaultPalette = defaults.palette;
function generatePalette(options, common, generateHuesFns, generatePaletteFns) {
    const { log, errors } = common.services;
    return errors.handleSync(() => {
        log.debug(`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, `[generatePalette]`);
        const palette = (() => {
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
                    log.error(`Invalid palette type ${options.paletteType}`, `[generatePalette]`);
                    return defaultPalette;
            }
        })();
        // NEW: Show or hide palette columns based on the generated palette
        common.utils.palette.showPaletteColumns(palette.items.length);
        return palette;
    }, 'Error generating palette', { context: { options } });
}

export { generatePalette };
//# sourceMappingURL=generate.js.map
