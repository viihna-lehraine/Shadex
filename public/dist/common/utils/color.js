// File: common/utils/color.ts
async function colorUtilsFactory(adjust, brand, format, helpers, sanitize, services, validate) {
    const { errors, log } = services;
    const caller = '[COLOR_UTILS_FACTORY]';
    log('Executing colorUtilsFactory...', { caller });
    console.log(`${caller}: colorUtilsFactory dependencies`, {
        brand,
        helpers,
        services
    });
    return errors.handleAsync(async () => {
        // 1. Import color utility sub-factories
        log('Importing color utility sub-factories', { caller });
        const { colorBrandingUtilsFactory } = await import('./partials/color/brand.js');
        const { colorConversionUtilsFactory } = await import('./partials/color/conversion.js');
        const { colorFormattingUtilsFactory } = await import('./partials/color/format.js');
        const { colorGenerationUtilsFactory } = await import('./partials/color/generate.js');
        const { colorParsingUtilsFactory } = await import('./partials/color/parse.js');
        if (!colorBrandingUtilsFactory ||
            !colorConversionUtilsFactory ||
            !colorFormattingUtilsFactory ||
            !colorGenerationUtilsFactory ||
            !colorParsingUtilsFactory) {
            log('Error importing color utility sub-factories.', {
                caller,
                level: 'error'
            });
        }
        log('Initializing color branding sub-utilities.', { caller });
        const colorBrandUtils = colorBrandingUtilsFactory(brand, helpers, services);
        log('Initializing color formatting sub-utilities.', { caller });
        const colorFormatUtils = colorFormattingUtilsFactory(format, helpers, services);
        log('Initializing color generation sub-utilities.', { caller });
        const colorGenerationUtils = colorGenerationUtilsFactory(sanitize, services, validate);
        log('Initializing color parsing sub-utilities.', { caller });
        const colorParseUtils = colorParsingUtilsFactory(services);
        log('Initializing color conversion sub-utilities.', { caller });
        const colorConversionUtils = colorConversionUtilsFactory(adjust, brand, format, helpers, sanitize, services, validate);
        const colorUtils = {
            ...colorBrandUtils,
            ...colorConversionUtils,
            ...colorFormatUtils,
            ...colorParseUtils,
            ...colorGenerationUtils
        };
        console.log(`${caller}: Color utilities created`, colorUtils);
        return colorUtils;
    }, 'Error occurred while creating color utilities group');
}

export { colorUtilsFactory };
//# sourceMappingURL=color.js.map
