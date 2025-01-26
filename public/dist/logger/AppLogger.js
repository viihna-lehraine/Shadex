export class AppLogger {
    static instance = null;
    mode;
    constructor(mode) {
        this.mode = mode;
    }
    static getInstance(mode) {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger(mode);
        }
        return AppLogger.instance;
    }
    log(message, level = 'info', debugLevel = 0, caller) {
        this.logMessage(message, level, debugLevel, caller);
    }
    async logAsync(message, level = 'info', debugLevel = 0, caller) {
        await this.logMessage(message, level, debugLevel, caller);
    }
    logMutation(data, logCallback = () => { }) {
        this.log(this.formatMutationLog(data), 'info');
        logCallback(data);
    }
    logMessage(message, level, debugLevel, caller) {
        if ((level === 'info' && this.mode.quiet) ||
            debugLevel < this.getDebugThreshold(level)) {
            return;
        }
        const callerInfo = caller || this.getCallerInfo();
        const timestamp = this.getFormattedTimestamp();
        try {
            console.log(`%c[${level.toUpperCase()}]%c ${timestamp} [${callerInfo}] %c${message}`, this.getLevelColor(level), 'color: gray', 'color: inherit');
        }
        catch (error) {
            console.error(`AppLogger encountered an unexpected error: ${error}`);
        }
        if (callerInfo === 'Unknown caller' &&
            debugLevel > 1 &&
            this.mode.stackTrace) {
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
    getCallerInfo() {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            for (const line of stackLines) {
                if (!line.includes('AppLogger') && line.includes('at ')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xvZ2dlci9BcHBMb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsTUFBTSxPQUFPLFNBQVM7SUFDYixNQUFNLENBQUMsUUFBUSxHQUFxQixJQUFJLENBQUM7SUFDekMsSUFBSSxDQUFvQjtJQUVoQyxZQUFvQixJQUF1QjtRQUMxQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUF1QjtRQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sR0FBRyxDQUNULE9BQWUsRUFDZixRQUE2QyxNQUFNLEVBQ25ELGFBQXFCLENBQUMsRUFDdEIsTUFBZTtRQUVmLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQ3BCLE9BQWUsRUFDZixRQUE2QyxNQUFNLEVBQ25ELGFBQXFCLENBQUMsRUFDdEIsTUFBZTtRQUVmLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sV0FBVyxDQUNqQixJQUFpQixFQUNqQixjQUEyQyxHQUFHLEVBQUUsR0FBRSxDQUFDO1FBRW5ELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLFdBQVcsQ0FBQyxJQUFJLENB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QWMsQ0FBQyxPQUFPLEVBQUU7WUFDekMsSUFBSSxFQUFFLFNBQVM7WUFDZixLQUFLLEVBQUUsU0FBUztZQUNoQixHQUFHLEVBQUUsU0FBUztZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUM7SUFDSixDQUFDO0lBRU8sYUFBYSxDQUFDLEtBQTBDO1FBQy9ELFFBQVEsS0FBSyxFQUFFLENBQUM7WUFDZixLQUFLLE9BQU87Z0JBQ1gsT0FBTyxjQUFjLENBQUM7WUFDdkIsS0FBSyxNQUFNO2dCQUNWLE9BQU8sYUFBYSxDQUFDO1lBQ3RCLEtBQUssTUFBTTtnQkFDVixPQUFPLGVBQWUsQ0FBQztZQUN4QixLQUFLLE9BQU87Z0JBQ1gsT0FBTyxZQUFZLENBQUM7WUFDckI7Z0JBQ0MsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQztJQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBcHBMb2dnZXJJbnRlcmZhY2UsXG5cdE1vZGVEYXRhSW50ZXJmYWNlLFxuXHRNdXRhdGlvbkxvZ1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBBcHBMb2dnZXIgaW1wbGVtZW50cyBBcHBMb2dnZXJJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQXBwTG9nZ2VyIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGFJbnRlcmZhY2U7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3Rvcihtb2RlOiBNb2RlRGF0YUludGVyZmFjZSkge1xuXHRcdHRoaXMubW9kZSA9IG1vZGU7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKG1vZGU6IE1vZGVEYXRhSW50ZXJmYWNlKTogQXBwTG9nZ2VyIHtcblx0XHRpZiAoIUFwcExvZ2dlci5pbnN0YW5jZSkge1xuXHRcdFx0QXBwTG9nZ2VyLmluc3RhbmNlID0gbmV3IEFwcExvZ2dlcihtb2RlKTtcblx0XHR9XG5cdFx0cmV0dXJuIEFwcExvZ2dlci5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBsb2coXG5cdFx0bWVzc2FnZTogc3RyaW5nLFxuXHRcdGxldmVsOiAnZGVidWcnIHwgJ2luZm8nIHwgJ3dhcm4nIHwgJ2Vycm9yJyA9ICdpbmZvJyxcblx0XHRkZWJ1Z0xldmVsOiBudW1iZXIgPSAwLFxuXHRcdGNhbGxlcj86IHN0cmluZ1xuXHQpOiB2b2lkIHtcblx0XHR0aGlzLmxvZ01lc3NhZ2UobWVzc2FnZSwgbGV2ZWwsIGRlYnVnTGV2ZWwsIGNhbGxlcik7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgbG9nQXN5bmMoXG5cdFx0bWVzc2FnZTogc3RyaW5nLFxuXHRcdGxldmVsOiAnZGVidWcnIHwgJ2luZm8nIHwgJ3dhcm4nIHwgJ2Vycm9yJyA9ICdpbmZvJyxcblx0XHRkZWJ1Z0xldmVsOiBudW1iZXIgPSAwLFxuXHRcdGNhbGxlcj86IHN0cmluZ1xuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmxvZ01lc3NhZ2UobWVzc2FnZSwgbGV2ZWwsIGRlYnVnTGV2ZWwsIGNhbGxlcik7XG5cdH1cblxuXHRwdWJsaWMgbG9nTXV0YXRpb24oXG5cdFx0ZGF0YTogTXV0YXRpb25Mb2csXG5cdFx0bG9nQ2FsbGJhY2s6IChkYXRhOiBNdXRhdGlvbkxvZykgPT4gdm9pZCA9ICgpID0+IHt9XG5cdCk6IHZvaWQge1xuXHRcdHRoaXMubG9nKHRoaXMuZm9ybWF0TXV0YXRpb25Mb2coZGF0YSksICdpbmZvJyk7XG5cblx0XHRsb2dDYWxsYmFjayhkYXRhKTtcblx0fVxuXG5cdHByaXZhdGUgbG9nTWVzc2FnZShcblx0XHRtZXNzYWdlOiBzdHJpbmcsXG5cdFx0bGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InLFxuXHRcdGRlYnVnTGV2ZWw6IG51bWJlcixcblx0XHRjYWxsZXI/OiBzdHJpbmdcblx0KTogdm9pZCB7XG5cdFx0aWYgKFxuXHRcdFx0KGxldmVsID09PSAnaW5mbycgJiYgdGhpcy5tb2RlLnF1aWV0KSB8fFxuXHRcdFx0ZGVidWdMZXZlbCA8IHRoaXMuZ2V0RGVidWdUaHJlc2hvbGQobGV2ZWwpXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2FsbGVySW5mbyA9IGNhbGxlciB8fCB0aGlzLmdldENhbGxlckluZm8oKTtcblx0XHRjb25zdCB0aW1lc3RhbXAgPSB0aGlzLmdldEZvcm1hdHRlZFRpbWVzdGFtcCgpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgJWNbJHtsZXZlbC50b1VwcGVyQ2FzZSgpfV0lYyAke3RpbWVzdGFtcH0gWyR7Y2FsbGVySW5mb31dICVjJHttZXNzYWdlfWAsXG5cdFx0XHRcdHRoaXMuZ2V0TGV2ZWxDb2xvcihsZXZlbCksXG5cdFx0XHRcdCdjb2xvcjogZ3JheScsXG5cdFx0XHRcdCdjb2xvcjogaW5oZXJpdCdcblx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBBcHBMb2dnZXIgZW5jb3VudGVyZWQgYW4gdW5leHBlY3RlZCBlcnJvcjogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdGNhbGxlckluZm8gPT09ICdVbmtub3duIGNhbGxlcicgJiZcblx0XHRcdGRlYnVnTGV2ZWwgPiAxICYmXG5cdFx0XHR0aGlzLm1vZGUuc3RhY2tUcmFjZVxuXHRcdCkge1xuXHRcdFx0Y29uc29sZS50cmFjZSgnRnVsbCBTdGFjayBUcmFjZTonKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGZvcm1hdE11dGF0aW9uTG9nKGRhdGE6IE11dGF0aW9uTG9nKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gYE11dGF0aW9uIGxvZ2dlZDogJHtKU09OLnN0cmluZ2lmeShkYXRhKX1gO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWJ1Z1RocmVzaG9sZChcblx0XHRsZXZlbDogJ2RlYnVnJyB8ICdpbmZvJyB8ICd3YXJuJyB8ICdlcnJvcidcblx0KTogbnVtYmVyIHtcblx0XHRzd2l0Y2ggKGxldmVsKSB7XG5cdFx0XHRjYXNlICdkZWJ1Zyc6XG5cdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0Y2FzZSAnaW5mbyc6XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0Y2FzZSAnd2Fybic6XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZ2V0Q2FsbGVySW5mbygpOiBzdHJpbmcge1xuXHRcdGNvbnN0IHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG5cblx0XHRpZiAoc3RhY2spIHtcblx0XHRcdGNvbnN0IHN0YWNrTGluZXMgPSBzdGFjay5zcGxpdCgnXFxuJyk7XG5cblx0XHRcdGZvciAoY29uc3QgbGluZSBvZiBzdGFja0xpbmVzKSB7XG5cdFx0XHRcdGlmICghbGluZS5pbmNsdWRlcygnQXBwTG9nZ2VyJykgJiYgbGluZS5pbmNsdWRlcygnYXQgJykpIHtcblx0XHRcdFx0XHRjb25zdCBtYXRjaCA9XG5cdFx0XHRcdFx0XHRsaW5lLm1hdGNoKC9hdFxccysoLiopXFxzK1xcKCguKik6KFxcZCspOihcXGQrKVxcKS8pIHx8XG5cdFx0XHRcdFx0XHRsaW5lLm1hdGNoKC9hdFxccysoLiopOihcXGQrKTooXFxkKykvKTtcblx0XHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRcdHJldHVybiBtYXRjaFsxXVxuXHRcdFx0XHRcdFx0XHQ/IGAke21hdGNoWzFdfSAoJHttYXRjaFsyXX06JHttYXRjaFszXX0pYFxuXHRcdFx0XHRcdFx0XHQ6IGAke21hdGNoWzJdfToke21hdGNoWzNdfWA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuICdVbmtub3duIGNhbGxlcic7XG5cdH1cblxuXHRwcml2YXRlIGdldEZvcm1hdHRlZFRpbWVzdGFtcCgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHtcblx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdG1pbnV0ZTogJzItZGlnaXQnLFxuXHRcdFx0c2Vjb25kOiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyMTI6IGZhbHNlXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGdldExldmVsQ29sb3IobGV2ZWw6ICdkZWJ1ZycgfCAnaW5mbycgfCAnd2FybicgfCAnZXJyb3InKTogc3RyaW5nIHtcblx0XHRzd2l0Y2ggKGxldmVsKSB7XG5cdFx0XHRjYXNlICdkZWJ1Zyc6XG5cdFx0XHRcdHJldHVybiAnY29sb3I6IGdyZWVuJztcblx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiBibHVlJztcblx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiBvcmFuZ2UnO1xuXHRcdFx0Y2FzZSAnZXJyb3InOlxuXHRcdFx0XHRyZXR1cm4gJ2NvbG9yOiByZWQnO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuICdjb2xvcjogYmxhY2snO1xuXHRcdH1cblx0fVxufVxuIl19