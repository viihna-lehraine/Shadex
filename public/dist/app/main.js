import { EventManager } from '../events/EventManager.js';
import { initializeServices, initializeApp } from './init.js';
import '../config/index.js';

// File: app/main.ts
console.log('[MAIN-1] Loading main.js...');
console.log('[MAIN-2] Calling initializeServices()');
const services = initializeServices();
const { log } = services;
log(`[MAIN-3] Calling initialize()`, 'info');
const init = (await initializeApp(services));
const { errors } = init.common.services;
log('[MAIN-4] Initialization complete.');
log(`[MAIN-5] Executing main loop...`);
if (log) {
    log('[MAIN-6] Executing main application script', 'debug');
    if (document.readyState === 'loading') {
        log('[MAIN-7A] DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...');
        document.addEventListener('DOMContentLoaded', () => main());
    }
    else {
        log('[MAIN-7B] DOM content already loaded. Initializing application immediately.');
        main();
    }
}
else {
    console.error('[main-5E] > log function is undefined.');
}
async function main() {
    await errors.handleAsync(async () => {
        log('[1] DOM content loaded - Application initialized.');
        {
            setTimeout(() => {
                EventManager.listAll();
            }, 100);
        }
    }, 'Application initialization failed');
}
//# sourceMappingURL=main.js.map
