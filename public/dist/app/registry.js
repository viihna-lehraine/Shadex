async function registerDependencies(helpers, services) {
    const { errors, log } = services;
    const caller = '[REGISTER_DEPENDENCIES]';
    log.info(`Executing registerDependencies...`, `${caller}`);
    return await errors.handleAsync(async () => {
        const utils = {};
        const { initializeUtilities } = await import('./init.js');
        Object.assign(utils, await initializeUtilities(helpers, services));
        const common = {
            helpers,
            services,
            utils
        };
        return {
            common
        };
    }, 'Error registering dependencies');
}

export { registerDependencies };
//# sourceMappingURL=registry.js.map
