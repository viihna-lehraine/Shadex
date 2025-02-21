import '../../config/index.js';

// File: common/services/ErrorHandler.ts
class ErrorHandler {
    static #instance = null;
    #getCallerInfo;
    #logger;
    constructor(helpers, logger) {
        this.#getCallerInfo = helpers.data.getCallerInfo;
        this.#logger = logger;
    }
    static getInstance(helpers, logger) {
        if (!ErrorHandler.#instance) {
            console.debug('[ErrorHandler] No ErrorHandler instance exists yet. Creating new instance.');
            ErrorHandler.#instance = new ErrorHandler(helpers, logger);
        }
        console.debug('[ErrorHandler] Returning existing ErrorHandler instance.');
        return ErrorHandler.#instance;
    }
    async handleAsync(action, errorMessage, options = {}) {
        try {
            return await action();
        }
        catch (error) {
            this.#handle(error, errorMessage, options);
            throw error;
        }
    }
    handleSync(action, errorMessage, options = {}) {
        try {
            return action();
        }
        catch (error) {
            this.#handle(error, errorMessage, options);
            throw error;
        }
    }
    #formatError(error, message, context) {
        return error instanceof Error
            ? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
            : `${message}: ${error}. Context: ${JSON.stringify(context)}`;
    }
    #getStackTrace(error) {
        return error?.stack ?? new Error().stack ?? 'No stack trace available';
    }
    #handle(error, errorMessage, options = {}) {
        const caller = this.#getCallerInfo();
        const formattedError = this.#formatError(error, errorMessage, options.context ?? {});
        this.#logger.log(formattedError, 'error', caller);
        {
            this.#logger.log(`Stack trace:\n${this.#getStackTrace(error instanceof Error ? error : undefined)}`, 'debug', '[ErrorHandler]');
        }
        if (options.userMessage) {
            alert(options.userMessage);
        }
    }
}

export { ErrorHandler };
//# sourceMappingURL=ErrorHandler.js.map
