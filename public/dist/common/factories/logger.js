import { AppLogger } from '../services/AppLogger.js';
import { data } from '../../data/index.js';

// File: common/factories/logger.js
const debugLevel = data.mode.debugLevel;
const createLogger = async () => {
    console.log('[FACTORIES.logger] Loading createLogger...');
    const appLogger = AppLogger.getInstance();
    console.log(`[FACTORIES.logger] AppLogger.getInstance() returned:`, Object.getOwnPropertyNames(Object.getPrototypeOf(appLogger)));
    return {
        debug: (message, caller) => appLogger.log(message, 'debug', debugLevel, caller),
        info: (message, caller) => appLogger.log(message, 'info', debugLevel, caller),
        warn: (message, caller) => appLogger.log(message, 'warn', debugLevel, caller),
        error: (message, caller) => appLogger.log(message, 'error', debugLevel, caller),
        mutation: (data, logCallback, caller) => {
            appLogger.logMutation(data, logCallback);
            if (caller) {
                appLogger.log(`Mutation logged by ${caller}`, 'debug');
            }
        }
    };
};

export { createLogger };
//# sourceMappingURL=logger.js.map
