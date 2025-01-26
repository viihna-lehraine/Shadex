// File: src/common/utils/errors.ts
import { createLogger } from '../../logger/index.js';
import { mode } from '../data/base.js';
const logger = await createLogger();
const logMode = mode.logging;
async function handleAsync(action, errorMessage, context) {
    try {
        return await action();
    }
    catch (error) {
        if (logMode.error)
            if (error instanceof Error) {
                logger.error(`${errorMessage}: ${error.message}. Context: ${context}`, 'common > utils > errors > handleAsync()');
            }
            else {
                logger.error(`${errorMessage}: ${error}. Context: ${context}`, 'common > utils > errors > handleAsync()');
            }
        return null;
    }
}
export const errors = {
    handleAsync
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi91dGlscy9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbUNBQW1DO0FBR25DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLEtBQUssVUFBVSxXQUFXLENBQ3pCLE1BQXdCLEVBQ3hCLFlBQW9CLEVBQ3BCLE9BQWlDO0lBRWpDLElBQUksQ0FBQztRQUNKLE9BQU8sTUFBTSxNQUFNLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLE9BQU8sQ0FBQyxLQUFLO1lBQ2hCLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRSxDQUFDO2dCQUM1QixNQUFNLENBQUMsS0FBSyxDQUNYLEdBQUcsWUFBWSxLQUFLLEtBQUssQ0FBQyxPQUFPLGNBQWMsT0FBTyxFQUFFLEVBQ3hELHlDQUF5QyxDQUN6QyxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLEtBQUssS0FBSyxjQUFjLE9BQU8sRUFBRSxFQUFFLHlDQUF5QyxDQUFDLENBQUM7WUFDM0csQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQXNEO0lBQ3hFLFdBQVc7Q0FDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9lcnJvcnMudHNcblxuaW1wb3J0IHsgQ29tbW9uRnVuY3Rpb25zTWFzdGVySW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi9kYXRhL2Jhc2UuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQXN5bmM8VD4oXG5cdGFjdGlvbjogKCkgPT4gUHJvbWlzZTxUPixcblx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdGNvbnRleHQ/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuKTogUHJvbWlzZTxUIHwgbnVsbD4ge1xuXHR0cnkge1xuXHRcdHJldHVybiBhd2FpdCBhY3Rpb24oKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgJHtlcnJvck1lc3NhZ2V9OiAke2Vycm9yLm1lc3NhZ2V9LiBDb250ZXh0OiAke2NvbnRleHR9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBlcnJvcnMgPiBoYW5kbGVBc3luYygpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKGAke2Vycm9yTWVzc2FnZX06ICR7ZXJyb3J9LiBDb250ZXh0OiAke2NvbnRleHR9YCwgJ2NvbW1vbiA+IHV0aWxzID4gZXJyb3JzID4gaGFuZGxlQXN5bmMoKScpO1xuXHRcdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGVycm9yczogQ29tbW9uRnVuY3Rpb25zTWFzdGVySW50ZXJmYWNlWyd1dGlscyddWydlcnJvcnMnXSA9IHtcblx0aGFuZGxlQXN5bmNcbn07XG4iXX0=