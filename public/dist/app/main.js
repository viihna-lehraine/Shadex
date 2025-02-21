import { EventManager } from '../events/EventManager.js';
import { initializeServices, initializeApp } from './init.js';
import '../config/index.js';

// File: app/main.ts
async function startApp(helpers) {
    console.log('[MAIN-1] Loading main.js...');
    console.log('[MAIN-2] Calling initializeServices');
    const services = initializeServices(helpers);
    const { log } = services;
    log(`[MAIN-3] Calling initialize`, 'info');
    const init = (await initializeApp(helpers, services));
    const { common: { services: { errors } } } = init;
    log('[MAIN-4] Initialization complete.');
    log(`[MAIN-5] Executing main loop...`);
    errors.handleSync(() => {
        if (log) {
            log('[MAIN-6] Executing main application script', 'debug');
            if (document.readyState === 'loading') {
                log('[MAIN-7A] DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...');
                document.addEventListener('DOMContentLoaded', () => main(errors, log));
            }
            else {
                log('[MAIN-7B] DOM content already loaded. Initializing application immediately.');
                main(errors, log);
            }
        }
        else {
            console.error('[main-5E] > log function is undefined.');
        }
    }, 'Application initialization failed');
}
async function main(errors, log) {
    await errors.handleAsync(async () => {
        log('[1] DOM content loaded - Application initialized.');
        {
            setTimeout(() => {
                EventManager.listAll();
            }, 100);
        }
    }, 'Application initialization failed');
}

export { startApp };
//# sourceMappingURL=main.js.map
