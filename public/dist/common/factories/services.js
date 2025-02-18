import { createErrorHandler } from './errorHandler.js';
import { createLogger } from './logger.js';
import { data } from '../../data/index.js';

// File: common/factories/services.js
const mode = data.mode;
async function createServices() {
    console.log('[FACTORIES.service] Loading createServices...');
    const logger = await createLogger();
    const errors = await createErrorHandler();
    if (!logger || !errors) {
        throw new Error('[FACTORIES.service] Logger or ErrorHandler failed to initialize.');
    }
    // Define logging function
    const log = (level, message, method, verbosityRequirement) => {
        if (mode.logging[level] &&
            mode.logging.verbosity >= (verbosityRequirement ?? 0)) {
            logger[level](message, method);
        }
    };
    // Return flattened services object
    return { log, errors };
}

export { createServices };
//# sourceMappingURL=services.js.map
