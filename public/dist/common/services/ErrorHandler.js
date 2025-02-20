import '../../config/index.js';

// File: common/services/ErrorHandler.ts
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
    handle(error, errorMessage, context = {}) {
        const caller = this.getCallerInfo();
        const formattedError = this.formatError(error, errorMessage, context);
        this.logger.log(formattedError, 'error', caller);
        {
            this.logger.log(`Stack trace:\n${this.getStackTrace(error instanceof Error ? error : undefined)}`, 'debug', '[ErrorHandler]');
        }
    }
    async handleAsync(action, errorMessage, context = {}) {
        try {
            return await action();
        }
        catch (error) {
            this.handle(error, errorMessage, context);
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
    getCallerInfo() {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            for (const line of stackLines) {
                if (!line.includes('AppLogger') &&
                    !line.includes('ErrorHandler') &&
                    line.includes('at ')) {
                    const match = line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
                        line.match(/at\s+(.*):(\d+):(\d+)/);
                    if (match) {
                        return match[1]
                            ? `${match[1]} (${match[2]}:${match[3]})`
                            : `${match[2]}:${match[3]}`;
                    }
                }
            }
        }
        return 'Unknown caller';
    }
}

export { ErrorHandler };
//# sourceMappingURL=ErrorHandler.js.map
