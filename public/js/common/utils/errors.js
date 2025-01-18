// File: src/common/utils/errors.ts
import { data } from '../../data/index.js';
import { log } from '../../classes/logger/index.js';
const logMode = data.mode.logging;
async function handleAsync(action, errorMessage, context) {
    try {
        return await action();
    }
    catch (error) {
        if (logMode.errors)
            if (error instanceof Error) {
                log.error(`${errorMessage}: ${error.message}. Context: ${context}`);
            }
            else {
                log.error(`${errorMessage}: ${error}. Context: ${context}`);
            }
        return null;
    }
}
export const errors = {
    handleAsync
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi91dGlscy9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbUNBQW1DO0FBR25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFcEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFbEMsS0FBSyxVQUFVLFdBQVcsQ0FDekIsTUFBd0IsRUFDeEIsWUFBb0IsRUFDcEIsT0FBaUM7SUFFakMsSUFBSSxDQUFDO1FBQ0osT0FBTyxNQUFNLE1BQU0sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLE1BQU07WUFDakIsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxLQUFLLENBQ1IsR0FBRyxZQUFZLEtBQUssS0FBSyxDQUFDLE9BQU8sY0FBYyxPQUFPLEVBQUUsQ0FDeEQsQ0FBQztZQUNILENBQUM7aUJBQU0sQ0FBQztnQkFDUCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxLQUFLLEtBQUssY0FBYyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdELENBQUM7UUFFRixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUF3QjtJQUMxQyxXQUFXO0NBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vdXRpbHMvZXJyb3JzLnRzXG5cbmltcG9ydCB7IENvbW1vblV0aWxzRm5FcnJvcnMgfSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IGxvZ01vZGUgPSBkYXRhLm1vZGUubG9nZ2luZztcblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQXN5bmM8VD4oXG5cdGFjdGlvbjogKCkgPT4gUHJvbWlzZTxUPixcblx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdGNvbnRleHQ/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuKTogUHJvbWlzZTxUIHwgbnVsbD4ge1xuXHR0cnkge1xuXHRcdHJldHVybiBhd2FpdCBhY3Rpb24oKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0YCR7ZXJyb3JNZXNzYWdlfTogJHtlcnJvci5tZXNzYWdlfS4gQ29udGV4dDogJHtjb250ZXh0fWBcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZy5lcnJvcihgJHtlcnJvck1lc3NhZ2V9OiAke2Vycm9yfS4gQ29udGV4dDogJHtjb250ZXh0fWApO1xuXHRcdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGVycm9yczogQ29tbW9uVXRpbHNGbkVycm9ycyA9IHtcblx0aGFuZGxlQXN5bmNcbn07XG4iXX0=