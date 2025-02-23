import { UserFacingError } from './ErrorClasses.js';
import '../../config/partials/defaults.js';
import '../../config/partials/regex.js';

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
    handleAndReturn(action, errorMessage, options = {}) {
        try {
            const result = action();
            if (result instanceof Promise) {
                return result.catch(error => {
                    this.#handle(error, errorMessage, options);
                    return options.fallback ?? Promise.reject(error);
                });
            }
            return result;
        }
        catch (error) {
            this.#handle(error, errorMessage, options);
            return options.fallback;
        }
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
        const userMessage = options.userMessage ??
            (error instanceof UserFacingError ? error.userMessage : undefined);
        if (userMessage) {
            alert(userMessage);
        }
    }
}

export { ErrorHandler };
//# sourceMappingURL=ErrorHandler.js.map
