// File: common/factories/helpers.ts
async function helpersFactory() {
    const helpers = {};
    const { colorHelpersFactory } = await import('../helpers/color.js');
    const { dataHelpersFactory } = await import('../helpers/data.js');
    const { domHelpersFactory } = await import('../helpers/dom.js');
    const { mathHelpersFactory } = await import('../helpers/math.js');
    const { timeHelpersFactory } = await import('../helpers/time.js');
    const { typeguardsFactory } = await import('../helpers/typeguards/main.js');
    helpers.color = colorHelpersFactory(helpers);
    helpers.data = dataHelpersFactory();
    helpers.dom = domHelpersFactory();
    helpers.math = mathHelpersFactory();
    helpers.time = timeHelpersFactory();
    helpers.typeguards = typeguardsFactory();
    return helpers;
}

export { helpersFactory };
//# sourceMappingURL=helpers.js.map
