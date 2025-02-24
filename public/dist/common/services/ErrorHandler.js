import { UserFacingError } from './ErrorClasses.js';
import { config } from '../../config/partials/base.js';
import '../../config/partials/defaults.js';
import '../../config/partials/regex.js';

// File: common/services/ErrorHandler.ts
const caller = 'ErrorHandler';
const mode = config.mode;
class ErrorHandler {
    static #instance = null;
    #getCallerInfo;
    #logger;
    constructor(helpers, logger) {
        try {
            console.log(`[${caller}]: Constructing ErrorHandler instance`);
            this.#getCallerInfo = helpers.data.getCallerInfo;
            this.#logger = logger;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, logger) {
        try {
            if (!ErrorHandler.#instance) {
                console.debug(`[${caller}] No ErrorHandler instance exists yet. Creating new instance.`);
                ErrorHandler.#instance = new ErrorHandler(helpers, logger);
            }
            console.debug(`[${caller}] Returning existing ErrorHandler instance.`);
            return ErrorHandler.#instance;
        }
        catch (error) {
            throw new Error(`[${caller}.getInstance]: ${error instanceof Error ? error.message : error}`);
        }
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
        try {
            return error instanceof Error
                ? `${message}: ${error.message}. Context: ${JSON.stringify(context)}`
                : `${message}: ${error}. Context: ${JSON.stringify(context)}`;
        }
        catch (error) {
            throw new Error(`[${caller}]: Error formatting error message: ${error instanceof Error ? error.message : error}`);
        }
    }
    #getStackTrace(error) {
        try {
            return (error?.stack ??
                new Error().stack ??
                `[${caller}]: No stack trace available.`);
        }
        catch (error) {
            throw new Error(`[${caller}]: Error getting stack trace: ${error instanceof Error ? error.message : error}`);
        }
    }
    #handle(error, errorMessage, options = {}) {
        try {
            const caller = this.#getCallerInfo();
            const formattedError = this.#formatError(error, errorMessage, options.context ?? {});
            this.#logger.log(formattedError, 'error', caller);
            if (mode.stackTrace) {
                this.#logger.log(`Stack trace:\n${this.#getStackTrace(error instanceof Error ? error : undefined)}`, 'debug', `[${caller}]`);
            }
            const userMessage = options.userMessage ??
                (error instanceof UserFacingError
                    ? error.userMessage
                    : undefined);
            if (userMessage) {
                alert(userMessage);
            }
        }
        catch (error) {
            throw new Error(`[${caller}]: Error handling error: ${error instanceof Error ? error.message : error}`);
        }
    }
}

export { ErrorHandler };
//# sourceMappingURL=ErrorHandler.js.map
