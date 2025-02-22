// File: common/factories/helpers.ts
async function helpersFactory() {
    console.log(`[HELPERS_FACTORY-1]: Creating helpers.`);
    const helpers = {};
    const [{ colorHelpersFactory }, { dataHelpersFactory }, { domHelpersFactory }, { mathHelpersFactory }, { randomHelpersFactory }, { timeHelpersFactory }, { typeguardsFactory }] = await Promise.all([
        import('../helpers/color.js'),
        import('../helpers/data.js'),
        import('../helpers/dom.js'),
        import('../helpers/math.js'),
        import('../helpers/random.js'),
        import('../helpers/time.js'),
        import('../helpers/typeguards.js')
    ]);
    console.log(`[HELPERS_FACTORY-2]: Imported helpers sub-factories.`, helpers);
    console.log(`[HELPERS_FACTORY-3]: Initializing data helpers.`);
    helpers.data = dataHelpersFactory();
    console.log(`[HELPERS_FACTORY-4]: Initializing DOM helpers.`);
    helpers.dom = domHelpersFactory();
    console.log(`[HELPERS_FACTORY-5]: Initializing math helpers.`);
    helpers.math = mathHelpersFactory();
    console.log(`[HELPERS_FACTORY-6]: Initializing random helpers.`);
    helpers.random = randomHelpersFactory();
    console.log(`[HELPERS_FACTORY-7]: Initializing time helpers.`);
    helpers.time = timeHelpersFactory();
    console.log(`[HELPERS_FACTORY-8]: Initializing typeguards helpers.`);
    helpers.typeguards = typeguardsFactory();
    console.log(`[HELPERS_FACTORY-9]: Initializing color helpers.`);
    helpers.color = colorHelpersFactory(helpers);
    console.log(`[HELPERS_FACTORY-10]: Helpers initialized.`, helpers);
    return helpers;
}

export { helpersFactory };
//# sourceMappingURL=helpers.js.map
