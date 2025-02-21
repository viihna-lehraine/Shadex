// File: common/utils/color.ts
async function colorUtilsFactory(helpers, services, utils) {
    const { colorBrandingUtilsFactory } = await import('./partials/color/brand.js');
    const { colorConversionUtilsFactory } = await import('./partials/color/conversion.js');
    const { colorFormattingUtilsFactory } = await import('./partials/color/format.js');
    const { colorGenerationUtilsFactory } = await import('./partials/color/generate.js');
    const { colorParsingUtilsFactory } = await import('./partials/color/parse.js');
    const { colorValidationUtilsFactory } = await import('./partials/color/validate.js');
    const colorBrandUtils = colorBrandingUtilsFactory(helpers, utils);
    const colorConversionUtils = colorConversionUtilsFactory(helpers, services, utils);
    const colorFormatUtils = colorFormattingUtilsFactory(helpers, services, utils);
    const colorGenerationUtils = colorGenerationUtilsFactory(services, utils);
    const colorParseUtils = colorParsingUtilsFactory(helpers, utils);
    const colorValidationUtils = colorValidationUtilsFactory(utils);
    return {
        ...colorBrandUtils,
        ...colorConversionUtils,
        ...colorGenerationUtils,
        ...colorFormatUtils,
        ...colorParseUtils,
        ...colorValidationUtils
    };
}

export { colorUtilsFactory };
//# sourceMappingURL=color.js.map
