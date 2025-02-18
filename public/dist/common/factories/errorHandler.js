import { AppLogger } from '../services/AppLogger.js';
import { ErrorHandler } from '../services/ErrorHandler.js';

// File: common/factories/errorHandler.js
async function createErrorHandler() {
    console.log(`[FACTORIES.errorHandler] Executing createErrorHandler()...`);
    const logger = AppLogger.getInstance();
    const errorHandler = ErrorHandler.getInstance(logger);
    console.log('[FACTORIES.errorHandler] Created error handler:', errorHandler);
    return errorHandler;
}

export { createErrorHandler };
//# sourceMappingURL=errorHandler.js.map
