async function initializeUtilities(helpers, services) {
    const { errors } = services;
    return await errors.handleAsync(async () => {
        const { utilitiesFactory } = await import('../core/factories/utils.js');
        const utils = await utilitiesFactory(helpers, services);
        return utils;
    }, 'Error initializing utils');
}

export { initializeUtilities };
//# sourceMappingURL=init.js.map
