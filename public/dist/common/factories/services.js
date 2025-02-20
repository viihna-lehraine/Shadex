import { AppLogger } from '../services/AppLogger.js';
import { ErrorHandler } from '../services/ErrorHandler.js';
import { config } from '../../config/index.js';
import { getCallerInfo } from '../services/helpers.js';

// File: common/factories/services.ts
const mode = config.mode;
function createServices() {
    console.log('[FACTORIES.service] Loading createServices...');
    const logger = AppLogger.getInstance();
    const errors = ErrorHandler.getInstance(logger);
    if (!logger || !errors) {
        throw new Error('[FACTORIES.service] Logger or ErrorHandler failed to initialize.');
    }
    const log = (message, level = 'info', verbosityRequirement = 0) => {
        if (mode.log[level] && mode.log.verbosity >= verbosityRequirement) {
            const caller = getCallerInfo();
            logger.log(message, level, caller);
        }
    };
    return { log, errors };
}

export { createServices };
//# sourceMappingURL=services.js.map
