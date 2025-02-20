import { getCallerInfo } from './helpers.js';
import { config } from '../../config/index.js';

// File: common/services/AppLogger.js
const mode = config.mode;
const debugLevel = mode.debugLevel;
class AppLogger {
    static instance = null;
    constructor() {
        console.log('[AppLogger] AppLogger constructor executed.');
    }
    static getInstance() {
        console.log('[AppLogger] Executing getInstance().');
        if (!AppLogger.instance) {
            console.log('[AppLogger] No instance found. Creating new instance.');
            AppLogger.instance = new AppLogger();
            console.log('[AppLogger] Instance created.');
        }
        console.log('[AppLogger] Returning existing instance.');
        return AppLogger.instance;
    }
    log(message, level = 'info', caller) {
        this.logMessage(message, level, caller);
    }
    logMutation(data, logCallback = () => { }) {
        this.log(this.formatMutationLog(data), 'info');
        logCallback(data);
    }
    logMessage(message, level, caller) {
        if (level === 'info' || debugLevel < this.getDebugThreshold(level)) {
            return;
        }
        const callerInfo = caller || getCallerInfo();
        const timestamp = this.getFormattedTimestamp();
        try {
            console.log(`%c[${level.toUpperCase()}]%c ${timestamp} [${callerInfo}] %c${message}`, this.getLevelColor(level), 'color: gray', 'color: inherit');
        }
        catch (error) {
            console.error(`AppLogger encountered an unexpected error: ${error}`);
        }
        if (callerInfo === 'Unknown caller' &&
            debugLevel > 1 &&
            mode.stackTrace) {
            console.trace('Full Stack Trace:');
        }
    }
    formatMutationLog(data) {
        return `Mutation logged: ${JSON.stringify(data)}`;
    }
    getDebugThreshold(level) {
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
    getFormattedTimestamp() {
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
    getLevelColor(level) {
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
}

export { AppLogger };
//# sourceMappingURL=AppLogger.js.map
