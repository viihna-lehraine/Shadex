// File: logger/factory.js
import { AppLogger } from './AppLogger.js';
import { modeData as mode } from '../data/mode.js';
export const createLogger = async () => {
    const debugLevel = mode.debugLevel;
    const appLogger = AppLogger.getInstance(mode);
    return {
        debug: (message, caller) => appLogger.log(message, 'debug', debugLevel, caller),
        info: (message, caller) => appLogger.log(message, 'info', debugLevel, caller),
        warn: (message, caller) => appLogger.log(message, 'warn', debugLevel, caller),
        error: (message, caller) => appLogger.log(message, 'error', debugLevel, caller),
        mutation: (data, logCallback, caller) => {
            appLogger.logMutation(data, logCallback);
            if (caller) {
                appLogger.log(`Mutation logged by ${caller}`, 'debug', debugLevel);
            }
        }
    };
};
export const createAsyncLogger = async () => {
    const debugLevel = mode.debugLevel;
    const appLogger = AppLogger.getInstance(mode);
    return {
        debug: (message, caller) => appLogger.logAsync(message, 'debug', debugLevel, caller),
        info: (message, caller) => appLogger.logAsync(message, 'info', debugLevel, caller),
        warn: (message, caller) => appLogger.logAsync(message, 'warn', debugLevel, caller),
        error: (message, caller) => appLogger.logAsync(message, 'error', debugLevel, caller),
        mutation: (data, logCallback, caller) => {
            appLogger.logMutation(data, logCallback);
            if (caller) {
                appLogger.logAsync(`Mutation logged by ${caller}`, 'debug', debugLevel);
            }
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dnZXIvZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEI7QUFHMUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ3RDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDbkMsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU5QyxPQUFPO1FBQ04sS0FBSyxFQUFFLENBQUMsT0FBZSxFQUFFLE1BQWUsRUFBRSxFQUFFLENBQzNDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDO1FBQ3BELElBQUksRUFBRSxDQUFDLE9BQWUsRUFBRSxNQUFlLEVBQUUsRUFBRSxDQUMxQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQztRQUNuRCxJQUFJLEVBQUUsQ0FBQyxPQUFlLEVBQUUsTUFBZSxFQUFFLEVBQUUsQ0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFDbkQsS0FBSyxFQUFFLENBQUMsT0FBZSxFQUFFLE1BQWUsRUFBRSxFQUFFLENBQzNDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDO1FBQ3BELFFBQVEsRUFBRSxDQUNULElBQWlCLEVBQ2pCLFdBQXdDLEVBQ3hDLE1BQWUsRUFDZCxFQUFFO1lBQ0gsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFekMsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDWixTQUFTLENBQUMsR0FBRyxDQUNaLHNCQUFzQixNQUFNLEVBQUUsRUFDOUIsT0FBTyxFQUNQLFVBQVUsQ0FDVixDQUFDO1lBQ0gsQ0FBQztRQUNGLENBQUM7S0FDRCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDM0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNuQyxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlDLE9BQU87UUFDTixLQUFLLEVBQUUsQ0FBQyxPQUFlLEVBQUUsTUFBZSxFQUFFLEVBQUUsQ0FDM0MsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFDekQsSUFBSSxFQUFFLENBQUMsT0FBZSxFQUFFLE1BQWUsRUFBRSxFQUFFLENBQzFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDO1FBQ3hELElBQUksRUFBRSxDQUFDLE9BQWUsRUFBRSxNQUFlLEVBQUUsRUFBRSxDQUMxQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQztRQUN4RCxLQUFLLEVBQUUsQ0FBQyxPQUFlLEVBQUUsTUFBZSxFQUFFLEVBQUUsQ0FDM0MsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFDekQsUUFBUSxFQUFFLENBQ1QsSUFBaUIsRUFDakIsV0FBd0MsRUFDeEMsTUFBZSxFQUNkLEVBQUU7WUFDSCxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUV6QyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNaLFNBQVMsQ0FBQyxRQUFRLENBQ2pCLHNCQUFzQixNQUFNLEVBQUUsRUFDOUIsT0FBTyxFQUNQLFVBQVUsQ0FDVixDQUFDO1lBQ0gsQ0FBQztRQUNGLENBQUM7S0FDRCxDQUFDO0FBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogbG9nZ2VyL2ZhY3RvcnkuanNcblxuaW1wb3J0IHsgTXV0YXRpb25Mb2cgfSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBBcHBMb2dnZXIgfSBmcm9tICcuL0FwcExvZ2dlci5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vZGF0YS9tb2RlLmpzJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxvZ2dlciA9IGFzeW5jICgpID0+IHtcblx0Y29uc3QgZGVidWdMZXZlbCA9IG1vZGUuZGVidWdMZXZlbDtcblx0Y29uc3QgYXBwTG9nZ2VyID0gQXBwTG9nZ2VyLmdldEluc3RhbmNlKG1vZGUpO1xuXG5cdHJldHVybiB7XG5cdFx0ZGVidWc6IChtZXNzYWdlOiBzdHJpbmcsIGNhbGxlcj86IHN0cmluZykgPT5cblx0XHRcdGFwcExvZ2dlci5sb2cobWVzc2FnZSwgJ2RlYnVnJywgZGVidWdMZXZlbCwgY2FsbGVyKSxcblx0XHRpbmZvOiAobWVzc2FnZTogc3RyaW5nLCBjYWxsZXI/OiBzdHJpbmcpID0+XG5cdFx0XHRhcHBMb2dnZXIubG9nKG1lc3NhZ2UsICdpbmZvJywgZGVidWdMZXZlbCwgY2FsbGVyKSxcblx0XHR3YXJuOiAobWVzc2FnZTogc3RyaW5nLCBjYWxsZXI/OiBzdHJpbmcpID0+XG5cdFx0XHRhcHBMb2dnZXIubG9nKG1lc3NhZ2UsICd3YXJuJywgZGVidWdMZXZlbCwgY2FsbGVyKSxcblx0XHRlcnJvcjogKG1lc3NhZ2U6IHN0cmluZywgY2FsbGVyPzogc3RyaW5nKSA9PlxuXHRcdFx0YXBwTG9nZ2VyLmxvZyhtZXNzYWdlLCAnZXJyb3InLCBkZWJ1Z0xldmVsLCBjYWxsZXIpLFxuXHRcdG11dGF0aW9uOiAoXG5cdFx0XHRkYXRhOiBNdXRhdGlvbkxvZyxcblx0XHRcdGxvZ0NhbGxiYWNrOiAoZGF0YTogTXV0YXRpb25Mb2cpID0+IHZvaWQsXG5cdFx0XHRjYWxsZXI/OiBzdHJpbmdcblx0XHQpID0+IHtcblx0XHRcdGFwcExvZ2dlci5sb2dNdXRhdGlvbihkYXRhLCBsb2dDYWxsYmFjayk7XG5cblx0XHRcdGlmIChjYWxsZXIpIHtcblx0XHRcdFx0YXBwTG9nZ2VyLmxvZyhcblx0XHRcdFx0XHRgTXV0YXRpb24gbG9nZ2VkIGJ5ICR7Y2FsbGVyfWAsXG5cdFx0XHRcdFx0J2RlYnVnJyxcblx0XHRcdFx0XHRkZWJ1Z0xldmVsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUFzeW5jTG9nZ2VyID0gYXN5bmMgKCkgPT4ge1xuXHRjb25zdCBkZWJ1Z0xldmVsID0gbW9kZS5kZWJ1Z0xldmVsO1xuXHRjb25zdCBhcHBMb2dnZXIgPSBBcHBMb2dnZXIuZ2V0SW5zdGFuY2UobW9kZSk7XG5cblx0cmV0dXJuIHtcblx0XHRkZWJ1ZzogKG1lc3NhZ2U6IHN0cmluZywgY2FsbGVyPzogc3RyaW5nKSA9PlxuXHRcdFx0YXBwTG9nZ2VyLmxvZ0FzeW5jKG1lc3NhZ2UsICdkZWJ1ZycsIGRlYnVnTGV2ZWwsIGNhbGxlciksXG5cdFx0aW5mbzogKG1lc3NhZ2U6IHN0cmluZywgY2FsbGVyPzogc3RyaW5nKSA9PlxuXHRcdFx0YXBwTG9nZ2VyLmxvZ0FzeW5jKG1lc3NhZ2UsICdpbmZvJywgZGVidWdMZXZlbCwgY2FsbGVyKSxcblx0XHR3YXJuOiAobWVzc2FnZTogc3RyaW5nLCBjYWxsZXI/OiBzdHJpbmcpID0+XG5cdFx0XHRhcHBMb2dnZXIubG9nQXN5bmMobWVzc2FnZSwgJ3dhcm4nLCBkZWJ1Z0xldmVsLCBjYWxsZXIpLFxuXHRcdGVycm9yOiAobWVzc2FnZTogc3RyaW5nLCBjYWxsZXI/OiBzdHJpbmcpID0+XG5cdFx0XHRhcHBMb2dnZXIubG9nQXN5bmMobWVzc2FnZSwgJ2Vycm9yJywgZGVidWdMZXZlbCwgY2FsbGVyKSxcblx0XHRtdXRhdGlvbjogKFxuXHRcdFx0ZGF0YTogTXV0YXRpb25Mb2csXG5cdFx0XHRsb2dDYWxsYmFjazogKGRhdGE6IE11dGF0aW9uTG9nKSA9PiB2b2lkLFxuXHRcdFx0Y2FsbGVyPzogc3RyaW5nXG5cdFx0KSA9PiB7XG5cdFx0XHRhcHBMb2dnZXIubG9nTXV0YXRpb24oZGF0YSwgbG9nQ2FsbGJhY2spO1xuXG5cdFx0XHRpZiAoY2FsbGVyKSB7XG5cdFx0XHRcdGFwcExvZ2dlci5sb2dBc3luYyhcblx0XHRcdFx0XHRgTXV0YXRpb24gbG9nZ2VkIGJ5ICR7Y2FsbGVyfWAsXG5cdFx0XHRcdFx0J2RlYnVnJyxcblx0XHRcdFx0XHRkZWJ1Z0xldmVsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiJdfQ==