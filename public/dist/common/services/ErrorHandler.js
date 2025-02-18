import { data } from '../../data/index.js';

// File: common/services/ErrorHandler.js
const mode = data.mode;
const debugLevel = mode.debugLevel;
class ErrorHandler {
    static instance = null;
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    static getInstance(logger) {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler(logger);
        }
        return ErrorHandler.instance;
    }
    handle(error, errorMessage, caller, context, severity) {
        if (!context)
            context = {};
        if (!severity)
            severity = 'warn';
        const formattedError = this.formatError(error, errorMessage, context);
        this.logger.log(formattedError, severity, debugLevel, caller);
        {
            this.logger.log(`Stack trace:\n${this.getStackTrace(error instanceof Error ? error : undefined)}`, 'debug', 3, '[ErrorHandler]');
        }
    }
    async handleAsync(action, errorMessage, caller = 'Unknown caller', context, severity) {
        if (!context)
            context = {};
        if (!severity)
            severity = 'warn';
        try {
            return await action();
        }
        catch (error) {
            this.handle(error, errorMessage, caller, context, severity);
            throw error;
        }
    }
    formatError(error, message, context) {
        return error instanceof Error
            ? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
            : `${message}: ${error}. Context: ${JSON.stringify(context)}`;
    }
    getStackTrace(error) {
        return error?.stack ?? new Error().stack ?? 'No stack trace available';
    }
}

export { ErrorHandler };
//# sourceMappingURL=ErrorHandler.js.map
