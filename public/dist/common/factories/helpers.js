// File: common/factories/helpers.js
async function createHelpers(services, utils) {
    const helpers = {};
    const { createColorHelpers } = await import('../helpers/color.js');
    const { createPaletteHelpers } = await import('../helpers/palette.js');
    helpers.color = createColorHelpers(services, utils);
    helpers.palette = createPaletteHelpers(services, utils);
    return helpers;
}

export { createHelpers };
//# sourceMappingURL=helpers.js.map
