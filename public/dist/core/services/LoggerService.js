import { config } from '../../config/partials/base.js';
import '../../config/partials/defaults.js';
import '../../config/partials/regex.js';

const caller = 'LoggerService';
const mode = config.mode;
const debugLevel = mode.debugLevel;
class LoggerService {
    static #instance = null;
    constructor() {
        try {
            console.log(`[${caller}]: Constructing ${caller}.`);
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance() {
        try {
            if (!LoggerService.#instance) {
                LoggerService.#instance = new LoggerService();
                console.log(`[${caller}]: No existing ${caller} instance found. Creating new instance.`);
            }
            console.log(`[${caller}]: Returning LoggerService instance.`);
            return LoggerService.#instance;
        }
        catch (error) {
            throw new Error(`[${caller}.getInstance]: ${error instanceof Error ? error.message : error}`);
        }
    }
    debug(message, caller) {
        this.#logMessage(message, 'debug', caller);
    }
    error(message, caller) {
        this.#logMessage(message, 'error', caller);
    }
    info(message, caller) {
        this.#logMessage(message, 'info', caller);
    }
    warn(message, caller) {
        this.#logMessage(message, 'warn', caller);
    }
    #getDebugThreshold(level) {
        switch (level) {
            case 'debug':
                return 2;
            case 'info':
                return 1;
            case 'warn':
                return 0;
            case 'error':
                return 0;
            default:
                return 0;
        }
    }
    #getFormattedTimestamp() {
        return new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    #getLevelColor(level) {
        switch (level) {
            case 'debug':
                return 'color: green';
            case 'info':
                return 'color: blue';
            case 'warn':
                return 'color: orange';
            case 'error':
                return 'color: red';
            default:
                return 'color: black';
        }
    }
    #logMessage(message, level, caller) {
        if (debugLevel < this.#getDebugThreshold(level))
            return;
        const callerInfo = caller;
        const timestamp = this.#getFormattedTimestamp();
        try {
            console.log(`%c[${level.toUpperCase()}]%c ${timestamp} [${callerInfo}] %c${message}`, this.#getLevelColor(level), 'color: gray', 'color: inherit');
        }
        catch (error) {
            console.error(`[${caller}.#logMessage]: Encountered an unexpected error: ${error}.`);
        }
        if (callerInfo === 'Unknown caller' &&
            debugLevel > 1 &&
            mode.stackTrace) {
            console.trace(`[${caller}]: Full Stack Trace:`);
        }
    }
}

export { LoggerService };
//# sourceMappingURL=LoggerService.js.map
