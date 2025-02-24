// File: common/helpers/data.ts

import { DataHelpers } from '../../types/index.js';
import { regex } from '../../config/index.js';

export const dataHelpersFactory = (): DataHelpers =>
	({
		clone<T>(value: T): T {
			return structuredClone(value);
		},
		getCallerInfo: (): string => {
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
			const callerLine = stackLines.find(
				line => !skipPatterns.some(pattern => line.includes(pattern))
			);

			if (!callerLine) return 'UNKNOWN CALLER';

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
		getFormattedTimestamp(): string {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		parseValue: (value: string | number): number =>
			typeof value === 'string' && value.endsWith('%')
				? parseFloat(value.slice(0, -1))
				: Number(value),
		async tracePromise(
			promise: Promise<unknown>,
			label: string
		): Promise<unknown> {
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
	}) as const;
