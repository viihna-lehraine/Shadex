// File: common/services/AppLogger.js
import { getCallerInfo } from './helpers.js';
import { data } from '../../config/index.js';
const mode = data.mode;
const debugLevel = mode.debugLevel;
export class AppLogger {
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
        if (debugLevel >= 5) {
            console.log(`[AppLogger.log] Log function CALLED with:`, {
                message,
                level,
                debugLevel,
                caller
            });
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zZXJ2aWNlcy9BcHBMb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBR3JDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDN0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTdDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUVuQyxNQUFNLE9BQU8sU0FBUztJQUNiLE1BQU0sQ0FBQyxRQUFRLEdBQXFCLElBQUksQ0FBQztJQUVqRDtRQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVc7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FDVix1REFBdUQsQ0FDdkQsQ0FBQztZQUNGLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUN4RCxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLEdBQUcsQ0FDVCxPQUFlLEVBQ2YsUUFBNkMsTUFBTSxFQUNuRCxNQUFlO1FBRWYsSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsRUFBRTtnQkFDeEQsT0FBTztnQkFDUCxLQUFL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Z2VyLmpzXG5cbmltcG9ydCB7IEFwcExvZ2dlckludGVyZmFjZSwgTXV0YXRpb25Mb2cgfSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBnZXRDYWxsZXJJbmZvIH0gZnJvbSAnLi9oZWxwZXJzLmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgZGVidWdMZXZlbCA9IG1vZGUuZGVidWdMZXZlbDtcblxuZXhwb3J0IGNsYXNzIEFwcExvZ2dlciBpbXBsZW1lbnRzIEFwcExvZ2dlckludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBBcHBMb2dnZXIgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuXHRcdGNvbnNvbGUubG9nKCdbQXBwTG9nZ2VyXSBBcHBMb2dnZXIgY29uc3RydWN0b3IgZXhlY3V0ZWQuJyk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IEFwcExvZ2dlciB7XG5cdFx0Y29uc29sZS5sb2coJ1tBcHBMb2dnZXJdIEV4ZWN1dGluZyBnZXRJbnN0YW5jZSgpLicpO1xuXG5cdFx0aWYgKCFBcHBMb2dnZXIuaW5zdGFuY2UpIHtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHQnW0FwcExvZ2dlcl0gTm8gaW5zdGFuY2UgZm91bmQuIENyZWF0aW5nIG5ldyBpbnN0YW5jZS4nXG5cdFx0XHQpO1xuXHRcdFx0QXBwTG9nZ2VyLmluc3RhbmNlID0gbmV3IEFwcExvZ2dlcigpO1xuXHRcdFx0Y29uc29sZS5sb2coJ1tBcHBMb2dnZXJdIEluc3RhbmNlIGNyZWF0ZWQuJyk7XG5cdFx0fVxuXG5cdFx0Y29uc29sZS5sb2coJ1tBcHBMb2dnZXJdIFJldHVybmluZyBleGlzdGluZyBpbnN0YW5jZS4nKTtcblx0XHRyZXR1cm4gQXBwTG9nZ2VyLmluc3RhbmNlO1xuXHR9XG5cblx0cHVibGljIGxvZyhcblx0XHRtZXNzYWdlOiBzdHJpbmcsXG5cdFx0bGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InID0gJ2luZm8nLFxuXHRcdGNhbGxlcj86IHN0cmluZ1xuXHQpOiB2b2lkIHtcblx0XHRpZiAoZGVidWdMZXZlbCA+PSA1KSB7XG5cdFx0XHRjb25zb2xlLmxvZyhgW0FwcExvZ2dlci5sb2ddIExvZyBmdW5jdGlvbiBDQUxMRUQgd2l0aDpgLCB7XG5cdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdGxldmVsLFxuXHRcdFx0XHRkZWJ1Z0xldmVsLFxuXHRcdFx0XHRjYWxsZXJcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0aGlzLmxvZ01lc3NhZ2UobWVzc2FnZSwgbGV2ZWwsIGNhbGxlcik7XG5cdH1cblxuXHRwdWJsaWMgbG9nTXV0YXRpb24oXG5cdFx0ZGF0YTogTXV0YXRpb25Mb2csXG5cdFx0bG9nQ2FsbGJhY2s6IChkYXRhOiBNdXRhdGlvbkxvZykgPT4gdm9pZCA9ICgpID0+IHt9XG5cdCk6IHZvaWQge1xuXHRcdHRoaXMubG9nKHRoaXMuZm9ybWF0TXV0YXRpb25Mb2coZGF0YSksICdpbmZvJyk7XG5cblx0XHRsb2dDYWxsYmFjayhkYXRhKTtcblx0fVxuXG5cdHByaXZhdGUgbG9nTWVzc2FnZShcblx0XHRtZXNzYWdlOiBzdHJpbmcsXG5cdFx0bGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InLFxuXHRcdGNhbGxlcj86IHN0cmluZ1xuXHQpOiB2b2lkIHtcblx0XHRpZiAobGV2ZWwgPT09ICdpbmZvJyB8fCBkZWJ1Z0xldmVsIDwgdGhpcy5nZXREZWJ1Z1RocmVzaG9sZChsZXZlbCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjYWxsZXJJbmZvID0gY2FsbGVyIHx8IGdldENhbGxlckluZm8oKTtcblx0XHRjb25zdCB0aW1lc3RhbXAgPSB0aGlzLmdldEZvcm1hdHRlZFRpbWVzdGFtcCgpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgJWNbJHtsZXZlbC50b1VwcGVyQ2FzZSgpfV0lYyAke3RpbWVzdGFtcH0gWyR7Y2FsbGVySW5mb31dICVjJHttZXNzYWdlfWAsXG5cdFx0XHRcdHRoaXMuZ2V0TGV2ZWxDb2xvcihsZXZlbCksXG5cdFx0XHRcdCdjb2xvcjogZ3JheScsXG5cdFx0XHRcdCdjb2xvcjogaW5oZXJpdCdcblx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBBcHBMb2dnZXIgZW5jb3VudGVyZWQgYW4gdW5leHBlY3RlZCBlcnJvcjogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdGNhbGxlckluZm8gPT09ICdVbmtub3duIGNhbGxlcicgJiZcblx0XHRcdGRlYnVnTGV2ZWwgPiAxICYmXG5cdFx0XHRtb2RlLnN0YWNrVHJhY2Vcblx0XHQpIHtcblx0XHRcdGNvbnNvbGUudHJhY2UoJ0Z1bGwgU3RhY2sgVHJhY2U6Jyk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBmb3JtYXRNdXRhdGlvbkxvZyhkYXRhOiBNdXRhdGlvbkxvZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGBNdXRhdGlvbiBsb2dnZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9YDtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVidWdUaHJlc2hvbGQoXG5cdFx0bGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InXG5cdCk6IG51bWJlciB7XG5cdFx0c3dpdGNoIChsZXZlbCkge1xuXHRcdFx0Y2FzZSAnZGVidWcnOlxuXHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdGNhc2UgJ2Vycm9yJzpcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGdldEZvcm1hdHRlZFRpbWVzdGFtcCgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHtcblx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdG1pbnV0ZTogJzItZGlnaXQnLFxuXHRcdFx0c2Vjb25kOiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyMTI6IGZhbHNlXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGdldExldmVsQ29sb3IobGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InKTogc3RyaW5nIHtcblx0XHRzd2l0Y2ggKGxldmVsKSB7XG5cdFx0XHRjYXNlICdkZWJ1Zyc6XG5cdFx0XHRcdHJldHVybiAnY29sb3I6IGdyZWVuJztcblx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiBibHVlJztcblx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiBvcmFuZ2UnO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiByZWQnO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuICdjb2xvcjogYmxhY2snO1xuXHRcdH1cblx0fVxufVxuIl19