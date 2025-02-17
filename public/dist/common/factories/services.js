// File: common/factories/services.js
async function createServices() {
    console.log(`[FACTORIES.service] Executing createServices()...`);
    const services = {};
    const { createAppServices } = await import('../services/app.js');
    console.log('FACTORIES.service] Extracted createAppServices:', createAppServices);
    const app = await createAppServices();
    console.log('[FACTORIES.service] Created app services:', app);
    if (!app || Object.keys(app).length === 0) {
        console.error(`[FACTORIES.service] ERROR: 'app' is EMPTY before assignment!`);
    }
    services.app = Object.assign({}, app);
    console.log(`[FACTORIES.service] After explicit assignment:`, services.app);
    services.app.log(`debug`, 'The log function is working properly!.', '[FACTORIES.service]');
    console.log(`[FACTORIES.service] Final Service Functions Object: ${services}`);
    return Object.freeze(services);
}

export { createServices };
//# sourceMappingURL=services.js.map
