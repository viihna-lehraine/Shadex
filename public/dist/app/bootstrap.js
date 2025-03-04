async function bootstrap() {
    console.log('[BOOTSTRAP]: Starting bootstrap process.');
    try {
        const { helpersFactory } = await import('../core/factories/helpers.js');
        const helpers = await helpersFactory();
        console.log('[BOOTSTRAP]: Helpers registered.');
        const { serviceFactory } = await import('../core/factories/services.js');
        console.log('[BOOTSTRAP]: Service factory successfully imported.');
        console.log(`[BOOSTRAP]: Registering services.`);
        const services = serviceFactory(helpers);
        console.log(`[BOOTSTRAP]: Bootstrap process complete.`);
        return { helpers, services };
    }
    catch (error) {
        console.error(`[BOOTSTRAP-ERR] Error: ${error instanceof Error ? error.message : error}`);
        throw error;
    }
}

export { bootstrap };
//# sourceMappingURL=bootstrap.js.map
