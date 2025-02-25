// File: core/services/LoggerService.ts
import { config } from '../../config/index.js';
const caller = 'LoggerService';
const mode = config.mode;
const debugLevel = mode.debugLevel;
export class LoggerService {
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
                console.log(`[${caller}]: No existing ${caller} instance found. Creating new singleton instance.`);
            }
            console.log(`[${caller}]: Returning existing LoggerService instance.`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdUNBQXVDO0FBR3ZDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUM7QUFDL0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBRW5DLE1BQU0sT0FBTyxhQUFhO0lBQ3pCLE1BQU0sQ0FBQyxTQUFTLEdBQXlCLElBQUksQ0FBQztJQUU5QztRQUNDLElBQUksQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLG1CQUFtQixNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQ2QsSUFBSSxNQUFNLGtCQUFrQixLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FDNUUsQ0FBQztRQUNILENBQUM7SUFDRixDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVc7UUFDakIsSUFBSSxDQUFDO1lBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDOUIsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO2dCQUU5QyxPQUFPLENBQUMsR0FBRyxDQUNWLElBQUksTUFBTSxrQkFBa0IsTUFBTSxtREFBbUQsQ0FDckYsQ0FBQztZQUNILENBQUM7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUNWLElBQUksTUFBTSwrQ0FBK0MsQ0FDekQsQ0FBQztZQUVGLE9BQU8sYUFBYSxDQUFD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QjtZQUMvQixVQUFVLEdBQUcsQ0FBQztZQUNkLElBQUksQ0FBQyxVQUFVLEVBQ2QsQ0FBQztZQUNGLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLHNCQUFzQixDQUFDLENBQUM7UUFDakQsQ0FBQztJQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb3JlL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2UudHNcblxuaW1wb3J0IHsgTG9nZ2VyQ29udHJhY3QgfSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBjYWxsZXIgPSAnTG9nZ2VyU2VydmljZSc7XG5jb25zdCBtb2RlID0gY29uZmlnLm1vZGU7XG5jb25zdCBkZWJ1Z0xldmVsID0gbW9kZS5kZWJ1Z0xldmVsO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyU2VydmljZSBpbXBsZW1lbnRzIExvZ2dlckNvbnRyYWN0IHtcblx0c3RhdGljICNpbnN0YW5jZTogTG9nZ2VyU2VydmljZSB8IG51bGwgPSBudWxsO1xuXG5cdHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnNvbGUubG9nKGBbJHtjYWxsZXJ9XTogQ29uc3RydWN0aW5nICR7Y2FsbGVyfS5gKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgWyR7Y2FsbGVyfSBjb25zdHJ1Y3Rvcl06ICR7ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvcn1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBMb2dnZXJTZXJ2aWNlIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKCFMb2dnZXJTZXJ2aWNlLiNpbnN0YW5jZSkge1xuXHRcdFx0XHRMb2dnZXJTZXJ2aWNlLiNpbnN0YW5jZSA9IG5ldyBMb2dnZXJTZXJ2aWNlKCk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdFx0YFske2NhbGxlcn1dOiBObyBleGlzdGluZyAke2NhbGxlcn0gaW5zdGFuY2UgZm91bmQuIENyZWF0aW5nIG5ldyBzaW5nbGV0b24gaW5zdGFuY2UuYFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0YFske2NhbGxlcn1dOiBSZXR1cm5pbmcgZXhpc3RpbmcgTG9nZ2VyU2VydmljZSBpbnN0YW5jZS5gXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gTG9nZ2VyU2VydmljZS4jaW5zdGFuY2U7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn0uZ2V0SW5zdGFuY2VdOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3J9YFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRkZWJ1ZyhtZXNzYWdlOiBzdHJpbmcsIGNhbGxlcjogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy4jbG9nTWVzc2FnZShtZXNzYWdlLCAnZGVidWcnLCBjYWxsZXIpO1xuXHR9XG5cblx0ZXJyb3IobWVzc2FnZTogc3RyaW5nLCBjYWxsZXI6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMuI2xvZ01lc3NhZ2UobWVzc2FnZSwgJ2Vycm9yJywgY2FsbGVyKTtcblx0fVxuXG5cdGluZm8obWVzc2FnZTogc3RyaW5nLCBjYWxsZXI6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMuI2xvZ01lc3NhZ2UobWVzc2FnZSwgJ2luZm8nLCBjYWxsZXIpO1xuXHR9XG5cblx0d2FybihtZXNzYWdlOiBzdHJpbmcsIGNhbGxlcjogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy4jbG9nTWVzc2FnZShtZXNzYWdlLCAnd2FybicsIGNhbGxlcik7XG5cdH1cblxuXHQjZ2V0RGVidWdUaHJlc2hvbGQobGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InKTogbnVtYmVyIHtcblx0XHRzd2l0Y2ggKGxldmVsKSB7XG5cdFx0XHRjYXNlICdkZWJ1Zyc6XG5cdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0Y2FzZSAnaW5mbyc6XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0Y2FzZSAnd2Fybic6XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0fVxuXG5cdCNnZXRGb3JtYXR0ZWRUaW1lc3RhbXAoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7XG5cdFx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0XHRtaW51dGU6ICcyLWRpZ2l0Jyxcblx0XHRcdHNlY29uZDogJzItZGlnaXQnLFxuXHRcdFx0aG91cjEyOiBmYWxzZVxuXHRcdH0pO1xuXHR9XG5cblx0I2dldExldmVsQ29sb3IobGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InKTogc3RyaW5nIHtcblx0XHRzd2l0Y2ggKGxldmVsKSB7XG5cdFx0XHRjYXNlICdkZWJ1Zyc6XG5cdFx0XHRcdHJldHVybiAnY29sb3I6IGdyZWVuJztcblx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiBibHVlJztcblx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiBvcmFuZ2UnO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiByZWQnO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuICdjb2xvcjogYmxhY2snO1xuXHRcdH1cblx0fVxuXG5cdCNsb2dNZXNzYWdlKFxuXHRcdG1lc3NhZ2U6IHN0cmluZyxcblx0XHRsZXZlbDogJ2RlYnVnJyB8ICdpbmZvJyB8ICd3YXJuJyB8ICdlcnJvcicsXG5cdFx0Y2FsbGVyPzogc3RyaW5nXG5cdCk6IHZvaWQge1xuXHRcdGlmIChkZWJ1Z0xldmVsIDwgdGhpcy4jZ2V0RGVidWdUaHJlc2hvbGQobGV2ZWwpKSByZXR1cm47XG5cblx0XHRjb25zdCBjYWxsZXJJbmZvID0gY2FsbGVyO1xuXHRcdGNvbnN0IHRpbWVzdGFtcCA9IHRoaXMuI2dldEZvcm1hdHRlZFRpbWVzdGFtcCgpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgJWNbJHtsZXZlbC50b1VwcGVyQ2FzZSgpfV0lYyAke3RpbWVzdGFtcH0gWyR7Y2FsbGVySW5mb31dICVjJHttZXNzYWdlfWAsXG5cdFx0XHRcdHRoaXMuI2dldExldmVsQ29sb3IobGV2ZWwpLFxuXHRcdFx0XHQnY29sb3I6IGdyYXknLFxuXHRcdFx0XHQnY29sb3I6IGluaGVyaXQnXG5cdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgWyR7Y2FsbGVyfS4jbG9nTWVzc2FnZV06IEVuY291bnRlcmVkIGFuIHVuZXhwZWN0ZWQgZXJyb3I6ICR7ZXJyb3J9LmBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0Y2FsbGVySW5mbyA9PT0gJ1Vua25vd24gY2FsbGVyJyAmJlxuXHRcdFx0ZGVidWdMZXZlbCA+IDEgJiZcblx0XHRcdG1vZGUuc3RhY2tUcmFjZVxuXHRcdCkge1xuXHRcdFx0Y29uc29sZS50cmFjZShgWyR7Y2FsbGVyfV06IEZ1bGwgU3RhY2sgVHJhY2U6YCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=