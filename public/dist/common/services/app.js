import { createLogger } from '../factories/logger.js';
import { modeData } from '../../data/mode.js';

// File: services/app.js
async function createAppServices() {
    console.log('[FACTORIES.service] Loading createAppServices...');
    console.log('[FACTORIES.service] Awaiting createLogger()...');
    const logger = await createLogger();
    console.log(`[FACTORIES.service] Logger created:`, logger);
    async function handleAsyncErrors(action, errorMessage, caller, context) {
        try {
            return await action();
        }
        catch (error) {
            {
                const errorMessageFormatted = error instanceof Error
                    ? `${errorMessage}: ${error.message}. Context: ${JSON.stringify(context)}`
                    : `${errorMessage}: ${error}. Context: ${JSON.stringify(context)}`;
                logger.error(errorMessageFormatted, caller);
            }
            return null;
        }
    }
    function log(level, message, method, verbosityRequirement) {
        if (modeData.logging[level] &&
            modeData.logging.verbosity >= (verbosityRequirement ?? 0)) {
            logger[level](message, method);
        }
        if (level === 'error' && modeData.showAlerts) {
            alert(message);
        }
    }
    const appServices = { handleAsyncErrors, log };
    console.log('[FACTORIES.service] Created appServices:', appServices);
    return {
        handleAsyncErrors,
        log
    };
}

export { createAppServices };
//# sourceMappingURL=app.js.map
