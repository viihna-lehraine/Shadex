// File: core/helpers/data.ts
import { regex } from '../../config/index.js';
export const dataHelpersFactory = () => ({
    clone(value) {
        return structuredClone(value);
    },
    getCallerInfo: () => {
        const error = new Error();
        const stackLines = error.stack?.split('\n') ?? [];
        const skipPatterns = [
            'getCallerInfo',
            'ErrorHandler',
            'Logger',
            'handleSync',
            'handleAsync',
            'Module._compile',
            'Object.<anonymous>',
            'processTicksAndRejections'
        ];
        // find the first frame that isn't internal
        const callerLine = stackLines.find(line => !skipPatterns.some(pattern => line.includes(pattern)));
        if (!callerLine)
            return 'UNKNOWN CALLER';
        for (const pattern of Object.values(regex.stackTrace)) {
            const match = callerLine.match(pattern);
            if (match) {
                const functionName = match[1]?.trim() || 'anonymous';
                const fileName = match[3] ?? match[2] ?? 'unknown';
                const lineNumber = match[4] ?? '0';
                const columnNumber = match[5] ?? '0';
                return `${functionName} (${fileName}:${lineNumber}:${columnNumber})`;
            }
        }
        return 'UNKNOWN CALLER';
    },
    getFormattedTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    parseValue: (value) => typeof value === 'string' && value.endsWith('%')
        ? parseFloat(value.slice(0, -1))
        : Number(value),
    async tracePromise(promise, label) {
        return promise
            .then(result => {
            console.log(`[TRACE SUCCESS] ${label}:`, result);
            return result;
        })
            .catch(error => {
            console.error(`[TRACE ERROR] ${label}:`, error);
            throw error;
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2hlbHBlcnMvZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2QkFBNkI7QUFHN0IsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTlDLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLEdBQWdCLEVBQUUsQ0FDbkQsQ0FBQztJQUNBLEtBQUssQ0FBSSxLQUFRO1FBQ2hCLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxhQUFhLEVBQUUsR0FBVyxFQUFFO1FBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWxELE1BQU0sWUFBWSxHQUFHO1lBQ3BCLGVBQWU7WUFDZixjQUFjO1lBQ2QsUUFBUTtZQUNSLFlBQVk7WUFDWixhQUFhO1lBQ2IsaUJBQWlCO1lBQ2pCLG9CQUFvQjtZQUNwQiwyQkFBMkI7U0FDM0IsQ0FBQztRQUVGLDJDQUEyQztRQUMzQyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUNqQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDN0QsQ0FBQztRQUVGLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTyxnQkFBZ0IsQ0FBQztRQUV6QyxLQUFLLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDdkQsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QyxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUNYLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxXQUFXLENBQUM7Z0JBQ3JELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO2dCQUNuRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO2dCQUNuQyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO2dCQUVyQyxPQUFPLEdBQUcsWUFBWSxLQUFLLFFBQVEsSUFBSSxVQUFVLElBQUksWUFBWSxHQUFHLENBQUM7WUFDdEUsQ0FBQztRQUNGLENBQUM7UUFFRCxPQUFPLGdCQUFnQixDQUFDO0lBQ3pCLENBQUM7SUFDRCxxQkFBcUI7UUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN2QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTFELE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFDRCxVQUFVLEVBQUUsQ0FBQyxLQUFzQixFQUFVLEVBQUUsQ0FDOUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixLQUFLLENBQUMsWUFBWSxDQUNqQixPQUF5QixFQUN6QixLQUFhO1FBRWIsT0FBTyxPQUFPO2FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsS0FBSyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakQsT0FBTyxNQUFNLENBQUM7UUFDZixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixLQUFLLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRCxNQUFNLEtBQUssQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNELENBQVUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvcmUvaGVscGVycy9kYXRhLnRzXG5cbmltcG9ydCB7IERhdGFIZWxwZXJzIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgcmVnZXggfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5leHBvcnQgY29uc3QgZGF0YUhlbHBlcnNGYWN0b3J5ID0gKCk6IERhdGFIZWxwZXJzID0+XG5cdCh7XG5cdFx0Y2xvbmU8VD4odmFsdWU6IFQpOiBUIHtcblx0XHRcdHJldHVybiBzdHJ1Y3R1cmVkQ2xvbmUodmFsdWUpO1xuXHRcdH0sXG5cdFx0Z2V0Q2FsbGVySW5mbzogKCk6IHN0cmluZyA9PiB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpO1xuXHRcdFx0Y29uc3Qgc3RhY2tMaW5lcyA9IGVycm9yLnN0YWNrPy5zcGxpdCgnXFxuJykgPz8gW107XG5cblx0XHRcdGNvbnN0IHNraXBQYXR0ZXJucyA9IFtcblx0XHRcdFx0J2dldENhbGxlckluZm8nLFxuXHRcdFx0XHQnRXJyb3JIYW5kbGVyJyxcblx0XHRcdFx0J0xvZ2dlcicsXG5cdFx0XHRcdCdoYW5kbGVTeW5jJyxcblx0XHRcdFx0J2hhbmRsZUFzeW5jJyxcblx0XHRcdFx0J01vZHVsZS5fY29tcGlsZScsXG5cdFx0XHRcdCdPYmplY3QuPGFub255bW91cz4nLFxuXHRcdFx0XHQncHJvY2Vzc1RpY2tzQW5kUmVqZWN0aW9ucydcblx0XHRcdF07XG5cblx0XHRcdC8vIGZpbmQgdGhlIGZpcnN0IGZyYW1lIHRoYXQgaXNuJ3QgaW50ZXJuYWxcblx0XHRcdGNvbnN0IGNhbGxlckxpbmUgPSBzdGFja0xpbmVzLmZpbmQoXG5cdFx0XHRcdGxpbmUgPT4gIXNraXBQYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gbGluZS5pbmNsdWRlcyhwYXR0ZXJuKSlcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY2FsbGVyTGluZSkgcmV0dXJuICdVTktOT1dOIENBTExFUic7XG5cblx0XHRcdGZvciAoY29uc3QgcGF0dGVybiBvZiBPYmplY3QudmFsdWVzKHJlZ2V4LnN0YWNrVHJhY2UpKSB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gY2FsbGVyTGluZS5tYXRjaChwYXR0ZXJuKTtcblx0XHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdFx0Y29uc3QgZnVuY3Rpb25OYW1lID0gbWF0Y2hbMV0/LnRyaW0oKSB8fCAnYW5vbnltb3VzJztcblx0XHRcdFx0XHRjb25zdCBmaWxlTmFtZSA9IG1hdGNoWzNdID8/IG1hdGNoWzJdID8/ICd1bmtub3duJztcblx0XHRcdFx0XHRjb25zdCBsaW5lTnVtYmVyID0gbWF0Y2hbNF0gPz8gJzAnO1xuXHRcdFx0XHRcdGNvbnN0IGNvbHVtbk51bWJlciA9IG1hdGNoWzVdID8/ICcwJztcblxuXHRcdFx0XHRcdHJldHVybiBgJHtmdW5jdGlvbk5hbWV9ICgke2ZpbGVOYW1lfToke2xpbmVOdW1iZXJ9OiR7Y29sdW1uTnVtYmVyfSlgO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAnVU5LTk9XTiBDQUxMRVInO1xuXHRcdH0sXG5cdFx0Z2V0Rm9ybWF0dGVkVGltZXN0YW1wKCk6IHN0cmluZyB7XG5cdFx0XHRjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0Y29uc3QgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuXHRcdFx0Y29uc3QgbW9udGggPSBTdHJpbmcobm93LmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuXHRcdFx0Y29uc3QgZGF5ID0gU3RyaW5nKG5vdy5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdFx0XHRjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblx0XHRcdGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblx0XHRcdGNvbnN0IHNlY29uZHMgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblxuXHRcdFx0cmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJzfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xuXHRcdH0sXG5cdFx0cGFyc2VWYWx1ZTogKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXIgPT5cblx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0XHQ6IE51bWJlcih2YWx1ZSksXG5cdFx0YXN5bmMgdHJhY2VQcm9taXNlKFxuXHRcdFx0cHJvbWlzZTogUHJvbWlzZTx1bmtub3duPixcblx0XHRcdGxhYmVsOiBzdHJpbmdcblx0XHQpOiBQcm9taXNlPHVua25vd24+IHtcblx0XHRcdHJldHVybiBwcm9taXNlXG5cdFx0XHRcdC50aGVuKHJlc3VsdCA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYFtUUkFDRSBTVUNDRVNTXSAke2xhYmVsfTpgLCByZXN1bHQpO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgW1RSQUNFIEVSUk9SXSAke2xhYmVsfTpgLCBlcnJvcik7XG5cdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fSkgYXMgY29uc3Q7XG4iXX0=