import { AppLogger } from '../logger/AppLogger.js';
import { modeData } from '../../data/mode.js';

// File: common/factories/logger.js
const debugLevel = modeData.debugLevel;
const createLogger = async () => {
    console.log('[FACTORIES.logger] Loading createLogger...');
    const appLogger = AppLogger.getInstance();
    console.log(`[FACTORIES.logger] AppLogger.getInstance() returned:`, appLogger);
    return {
        debug: (message, caller) => appLogger.log(message, 'debug', debugLevel, caller),
        info: (message, caller) => appLogger.log(message, 'info', debugLevel, caller),
        warn: (message, caller) => appLogger.log(message, 'warn', debugLevel, caller),
        error: (message, caller) => appLogger.log(message, 'error', debugLevel, caller),
        mutation: (data, logCallback, caller) => {
            appLogger.logMutation(data, logCallback);
            if (caller) {
                appLogger.log(`Mutation logged by ${caller}`, 'debug', debugLevel);
            }
        }
    };
};

export { createLogger };
//# sourceMappingURL=logger.js.map
