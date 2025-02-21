import { DataObserver } from '../services/DataObserver.js';
import { DOMStore } from '../services/DOMStore.js';
import { ErrorHandler } from '../services/ErrorHandler.js';
import { Logger } from '../services/Logger.js';
import { Semaphore } from '../services/Semaphore.js';
import { config } from '../../config/index.js';

// File: common/factories/services.ts
function serviceFactory(helpers, initialData) {
    console.log('[ServiceFactory-1] Loading createServices...');
    const services = {};
    const logger = Logger.getInstance(helpers);
    services.errors = ErrorHandler.getInstance(helpers, logger);
    if (!logger || !services.errors) {
        throw new Error('[ServiceFactory-2] Logger or ErrorHandler failed to initialize.');
    }
    services.log = (message, level = 'info', verbosityRequirement = 0) => {
        if (config.mode.log[level] &&
            config.mode.log.verbosity >= verbosityRequirement) {
            const caller = helpers.data.getCallerInfo();
            logger.log(message, level, caller);
        }
    };
    services.domStore = DOMStore.getInstance(services.errors, helpers, services.log);
    services.observer = new DataObserver(initialData);
    services.setObserverData = (newData) => {
        services.observer.setData(newData);
        services.log(`DataObserver updated with new data: ${JSON.stringify(newData)}`, 'debug', 2);
    };
    services.semaphore = new Semaphore();
    return services;
}

export { serviceFactory };
//# sourceMappingURL=services.js.map
