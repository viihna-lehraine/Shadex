import { DataObserver } from '../services/DataObserver.js';
import { DOMStore } from '../services/DOMStore.js';
import { ErrorHandler } from '../services/ErrorHandler.js';
import { Logger } from '../services/Logger.js';
import { Semaphore } from '../services/Semaphore.js';
import { config } from '../../config/index.js';

// File: common/factories/services.ts
function serviceFactory(helpers, initialData) {
    console.log('[SERVICE_FACTORY]: Executing createServices.');
    console.log(`[SERVICE_FACTORY]: Initializing services with empty placeholder object.`);
    const services = {};
    console.log(`[SERVICE_FACTORY]: Initializing Logger and ErrorHandler (creating instances).`);
    const logger = Logger.getInstance(helpers);
    services.errors = ErrorHandler.getInstance(helpers, logger);
    if (!logger || !services.errors) {
        throw new Error('[SERVICE_FACTORY]: Logger or ErrorHandler failed to initialize.');
    }
    services.log = (message, options) => {
        options.level ??= 'info';
        options.verbosity ??= 1;
        if (config.mode.log[options.level] &&
            config.mode.log.verbosity >= options.verbosity) {
            logger.log(message, options.level, options.caller);
        }
        if (options.level === 'error' && config.mode.showAlerts) ;
    };
    console.log(`[SERVICE_FACTORY]: Initializing DOMStore, DataObserver, and Semaphore.`);
    services.domStore = DOMStore.getInstance(services.errors, helpers, services.log);
    services.observer = new DataObserver(initialData);
    services.setObserverData = (newData) => {
        services.observer.setData(newData);
        services.log(`DataObserver updated with new data: ${JSON.stringify(newData)}`, {
            caller: '[SERVICE_FACTORY.setObserverData]',
            level: 'debug',
            verbosity: 2
        });
    };
    services.semaphore = new Semaphore(services.errors, services.log);
    return services;
}

export { serviceFactory };
//# sourceMappingURL=services.js.map
