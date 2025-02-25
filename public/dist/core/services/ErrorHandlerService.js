// File: core/services/ErrorHandlerService.ts
import { UserFacingError } from './ErrorClasses.js';
import { config } from '../../config/index.js';
const caller = 'ErrorHandlerService';
const mode = config.mode;
export class ErrorHandlerService {
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
            if (!ErrorHandlerService.#instance) {
                console.debug(`[${caller}] No ErrorHandler instance exists yet. Creating new instance.`);
                ErrorHandlerService.#instance = new ErrorHandlerService(helpers, logger);
            }
            console.debug(`[${caller}] Returning existing ErrorHandler instance.`);
            return ErrorHandlerService.#instance;
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
            this.#logger.error(formattedError, caller);
            if (mode.stackTrace) {
                this.#logger.debug(`Stack trace:\n${this.#getStackTrace(error instanceof Error ? error : undefined)}`, `${caller}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JIYW5kbGVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL3NlcnZpY2VzL0Vycm9ySGFuZGxlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkNBQTZDO0FBTzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsTUFBTSxNQUFNLEdBQUcscUJBQXFCLENBQUM7QUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUV6QixNQUFNLE9BQU8sbUJBQW1CO0lBQy9CLE1BQU0sQ0FBQyxTQUFTLEdBQStCLElBQUksQ0FBQztJQUNwRCxjQUFjLENBQW1DO0lBQ2pELE9BQU8sQ0FBZ0I7SUFFdkIsWUFBb0IsT0FBZ0IsRUFBRSxNQUFxQjtRQUMxRCxJQUFJLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSx1Q0FBdUMsQ0FBQyxDQUFDO1lBRS9ELElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7WUFFakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FDZCxJQUFJLE1BQU0sa0JBQWtCLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUM1RSxDQUFDO1FBQ0gsQ0FBQztJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUNqQixPQUFnQixFQUNoQixNQUFxQjtRQUVyQixJQUFJLENBQUM7WUFDSixJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3BDLE9BQU8s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U0FBUyxDQUFDLENBQUM7WUFFZixJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUNqQixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEIsQ0FBQztRQUNGLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQ2QsSUFBSSxNQUFNLDRCQUNULEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQzFDLEVBQUUsQ0FDRixDQUFDO1FBQ0gsQ0FBQztJQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb3JlL3NlcnZpY2VzL0Vycm9ySGFuZGxlclNlcnZpY2UudHNcblxuaW1wb3J0IHtcblx0RXJyb3JIYW5kbGVyQ29udHJhY3QsXG5cdEVycm9ySGFuZGxlck9wdGlvbnMsXG5cdEhlbHBlcnNcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgVXNlckZhY2luZ0Vycm9yIH0gZnJvbSAnLi9FcnJvckNsYXNzZXMuanMnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vTG9nZ2VyU2VydmljZS5qcyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBjYWxsZXIgPSAnRXJyb3JIYW5kbGVyU2VydmljZSc7XG5jb25zdCBtb2RlID0gY29uZmlnLm1vZGU7XG5cbmV4cG9ydCBjbGFzcyBFcnJvckhhbmRsZXJTZXJ2aWNlIGltcGxlbWVudHMgRXJyb3JIYW5kbGVyQ29udHJhY3Qge1xuXHRzdGF0aWMgI2luc3RhbmNlOiBFcnJvckhhbmRsZXJTZXJ2aWNlIHwgbnVsbCA9IG51bGw7XG5cdCNnZXRDYWxsZXJJbmZvOiBIZWxwZXJzWydkYXRhJ11bJ2dldENhbGxlckluZm8nXTtcblx0I2xvZ2dlcjogTG9nZ2VyU2VydmljZTtcblxuXHRwcml2YXRlIGNvbnN0cnVjdG9yKGhlbHBlcnM6IEhlbHBlcnMsIGxvZ2dlcjogTG9nZ2VyU2VydmljZSkge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zb2xlLmxvZyhgWyR7Y2FsbGVyfV06IENvbnN0cnVjdGluZyBFcnJvckhhbmRsZXIgaW5zdGFuY2VgKTtcblxuXHRcdFx0dGhpcy4jZ2V0Q2FsbGVySW5mbyA9IGhlbHBlcnMuZGF0YS5nZXRDYWxsZXJJbmZvO1xuXG5cdFx0XHR0aGlzLiNsb2dnZXIgPSBsb2dnZXI7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn0gY29uc3RydWN0b3JdOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3J9YFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoXG5cdFx0aGVscGVyczogSGVscGVycyxcblx0XHRsb2dnZXI6IExvZ2dlclNlcnZpY2Vcblx0KTogRXJyb3JIYW5kbGVyU2VydmljZSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghRXJyb3JIYW5kbGVyU2VydmljZS4jaW5zdGFuY2UpIHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhcblx0XHRcdFx0XHRgWyR7Y2FsbGVyfV0gTm8gRXJyb3JIYW5kbGVyIGluc3RhbmNlIGV4aXN0cyB5ZXQuIENyZWF0aW5nIG5ldyBpbnN0YW5jZS5gXG5cdFx0XHRcdCk7XG5cdFx0XHRcdEVycm9ySGFuZGxlclNlcnZpY2UuI2luc3RhbmNlID0gbmV3IEVycm9ySGFuZGxlclNlcnZpY2UoXG5cdFx0XHRcdFx0aGVscGVycyxcblx0XHRcdFx0XHRsb2dnZXJcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5kZWJ1Zyhcblx0XHRcdFx0YFske2NhbGxlcn1dIFJldHVybmluZyBleGlzdGluZyBFcnJvckhhbmRsZXIgaW5zdGFuY2UuYFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIEVycm9ySGFuZGxlclNlcnZpY2UuI2luc3RhbmNlO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdGBbJHtjYWxsZXJ9LmdldEluc3RhbmNlXTogJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IGVycm9yfWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlQW5kUmV0dXJuPFQ+KFxuXHRcdGFjdGlvbjogKCkgPT4gVCB8IFByb21pc2U8VD4sXG5cdFx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdFx0b3B0aW9uczogRXJyb3JIYW5kbGVyT3B0aW9ucyA9IHt9XG5cdCk6IFQgfCBQcm9taXNlPFQ+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYWN0aW9uKCk7XG5cblx0XHRcdGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHRoaXMuI2hhbmRsZShlcnJvciwgZXJyb3JNZXNzYWdlLCBvcHRpb25zKTtcblxuXHRcdFx0XHRcdHJldHVybiAob3B0aW9ucy5mYWxsYmFjayBhcyBUKSA/PyBQcm9taXNlLnJlamVjdChlcnJvcik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLiNoYW5kbGUoZXJyb3IsIGVycm9yTWVzc2FnZSwgb3B0aW9ucyk7XG5cblx0XHRcdHJldHVybiBvcHRpb25zLmZhbGxiYWNrIGFzIFQ7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgaGFuZGxlQXN5bmM8VD4oXG5cdFx0YWN0aW9uOiAoKSA9PiBQcm9taXNlPFQ+LFxuXHRcdGVycm9yTWVzc2FnZTogc3RyaW5nLFxuXHRcdG9wdGlvbnM6IEVycm9ySGFuZGxlck9wdGlvbnMgPSB7fVxuXHQpOiBQcm9taXNlPFQ+IHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IGFjdGlvbigpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLiNoYW5kbGUoZXJyb3IsIGVycm9yTWVzc2FnZSwgb3B0aW9ucyk7XG5cblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZVN5bmM8VD4oXG5cdFx0YWN0aW9uOiAoKSA9PiBULFxuXHRcdGVycm9yTWVzc2FnZTogc3RyaW5nLFxuXHRcdG9wdGlvbnM6IEVycm9ySGFuZGxlck9wdGlvbnMgPSB7fVxuXHQpOiBUIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGFjdGlvbigpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLiNoYW5kbGUoZXJyb3IsIGVycm9yTWVzc2FnZSwgb3B0aW9ucyk7XG5cblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fVxuXG5cdCNmb3JtYXRFcnJvcihcblx0XHRlcnJvcjogdW5rbm93bixcblx0XHRtZXNzYWdlOiBzdHJpbmcsXG5cdFx0Y29udGV4dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cblx0KTogc3RyaW5nIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0PyBgJHttZXNzYWdlfTogJHtlcnJvci5tZXNzYWdlfS4gQ29udGV4dDogJHtKU09OLnN0cmluZ2lmeShjb250ZXh0KX1gXG5cdFx0XHRcdDogYCR7bWVzc2FnZX06ICR7ZXJyb3J9LiBDb250ZXh0OiAke0pTT04uc3RyaW5naWZ5KGNvbnRleHQpfWA7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn1dOiBFcnJvciBmb3JtYXR0aW5nIGVycm9yIG1lc3NhZ2U6ICR7XG5cdFx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvclxuXHRcdFx0XHR9YFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQjZ2V0U3RhY2tUcmFjZShlcnJvcj86IEVycm9yKTogc3RyaW5nIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0ZXJyb3I/LnN0YWNrID8/XG5cdFx0XHRcdG5ldyBFcnJvcigpLnN0YWNrID8/XG5cdFx0XHRcdGBbJHtjYWxsZXJ9XTogTm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlLmBcblx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn1dOiBFcnJvciBnZXR0aW5nIHN0YWNrIHRyYWNlOiAke1xuXHRcdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3Jcblx0XHRcdFx0fWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0I2hhbmRsZShcblx0XHRlcnJvcjogdW5rbm93bixcblx0XHRlcnJvck1lc3NhZ2U6IHN0cmluZyxcblx0XHRvcHRpb25zOiBFcnJvckhhbmRsZXJPcHRpb25zID0ge31cblx0KTogdm9pZCB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNhbGxlciA9IHRoaXMuI2dldENhbGxlckluZm8oKTtcblx0XHRcdGNvbnN0IGZvcm1hdHRlZEVycm9yID0gdGhpcy4jZm9ybWF0RXJyb3IoXG5cdFx0XHRcdGVycm9yLFxuXHRcdFx0XHRlcnJvck1lc3NhZ2UsXG5cdFx0XHRcdG9wdGlvbnMuY29udGV4dCA/PyB7fVxuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy4jbG9nZ2VyLmVycm9yKGZvcm1hdHRlZEVycm9yLCBjYWxsZXIpO1xuXG5cdFx0XHRpZiAobW9kZS5zdGFja1RyYWNlKSB7XG5cdFx0XHRcdHRoaXMuI2xvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0XHRgU3RhY2sgdHJhY2U6XFxuJHt0aGlzLiNnZXRTdGFja1RyYWNlKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvciA6IHVuZGVmaW5lZCl9YCxcblx0XHRcdFx0XHRgJHtjYWxsZXJ9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB1c2VyTWVzc2FnZSA9XG5cdFx0XHRcdG9wdGlvbnMudXNlck1lc3NhZ2UgPz9cblx0XHRcdFx0KGVycm9yIGluc3RhbmNlb2YgVXNlckZhY2luZ0Vycm9yXG5cdFx0XHRcdFx0PyBlcnJvci51c2VyTWVzc2FnZVxuXHRcdFx0XHRcdDogdW5kZWZpbmVkKTtcblxuXHRcdFx0aWYgKHVzZXJNZXNzYWdlKSB7XG5cdFx0XHRcdGFsZXJ0KHVzZXJNZXNzYWdlKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgWyR7Y2FsbGVyfV06IEVycm9yIGhhbmRsaW5nIGVycm9yOiAke1xuXHRcdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3Jcblx0XHRcdFx0fWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=