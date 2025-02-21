// File: common/factories/utils.js
async function utilitiesFactory(helpers, services) {
    const utilities = {};
    // dynamically import factories without calling them
    const { adjustmentUtilsFactory } = await import('../utils/adjust.js');
    const { brandingUtilsFactory } = await import('../utils/brand.js');
    const { colorUtilsFactory } = await import('../utils/color.js');
    const { domUtilsFactory } = await import('../utils/dom.js');
    const { formattingUtilsFactory } = await import('../utils/format.js');
    const { paletteUtilsFactory } = await import('../utils/palette.js');
    const { sanitationUtilsFactory } = await import('../utils/sanitize.js');
    const { validationUtilsFactory } = await import('../utils/validate.js');
    utilities.color = await colorUtilsFactory(helpers, services, utilities);
    utilities.dom = await domUtilsFactory(helpers, services, utilities);
    utilities.adjust = adjustmentUtilsFactory(services, utilities);
    utilities.brand = brandingUtilsFactory(utilities);
    utilities.format = formattingUtilsFactory(services, utilities);
    utilities.palette = paletteUtilsFactory(helpers, services, utilities);
    utilities.sanitize = sanitationUtilsFactory(utilities);
    utilities.validate = validationUtilsFactory(helpers);
    return utilities;
}

export { utilitiesFactory };
//# sourceMappingURL=utils.js.map
