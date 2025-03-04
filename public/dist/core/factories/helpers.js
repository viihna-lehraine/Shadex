async function helpersFactory() {
    console.log(`[HELPERS_FACTORY]: Creating helpers.`);
    const helpers = {};
    const [{ colorHelpersFactory }, { dataHelpersFactory }, { domHelpersFactory }, { mathHelpersFactory }, { randomHelpersFactory }, { timeHelpersFactory }, { typeGuardsFactory }] = await Promise.all([
        import('../helpers/color.js'),
        import('../helpers/data.js'),
        import('../helpers/dom.js'),
        import('../helpers/math.js'),
        import('../helpers/random.js'),
        import('../helpers/time.js'),
        import('../helpers/typeGuards.js')
    ]);
    const typeGuards = typeGuardsFactory();
    helpers.data = dataHelpersFactory(typeGuards);
    helpers.dom = domHelpersFactory();
    helpers.math = mathHelpersFactory();
    helpers.random = randomHelpersFactory();
    helpers.time = timeHelpersFactory();
    helpers.typeGuards = typeGuards;
    helpers.color = colorHelpersFactory(helpers);
    console.log(`[HELPERS_FACTORY]: Helpers creation complete.`);
    return helpers;
}

export { helpersFactory };
//# sourceMappingURL=helpers.js.map
