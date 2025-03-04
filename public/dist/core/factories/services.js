import { ErrorHandlerService } from '../services/ErrorHandlerService.js';
import { LoggerService } from '../services/LoggerService.js';

function serviceFactory(helpers) {
    console.log('[SERVICE_FACTORY]: Executing createServices.');
    const services = {};
    console.log(`[SERVICE_FACTORY]: Initializing Logger and ErrorHandler services.`);
    services.log = LoggerService.getInstance();
    services.errors = ErrorHandlerService.getInstance(helpers, services.log);
    if (!services.log || !services.errors) {
        throw new Error('[SERVICE_FACTORY]: Logger and/or ErrorHandler failed to initialize.');
    }
    return services;
}

export { serviceFactory };
//# sourceMappingURL=services.js.map
