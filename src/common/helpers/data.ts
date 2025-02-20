// File: common/helpers/data.ts

import { DataHelpers } from '../../types/index.js';
import { regex } from '../../config/index.js';

export const dataHelpersFactory = (): DataHelpers =>
	({
		clone<T>(value: T): T {
			return structuredClone(value);
		},
		getCallerInfo: (): string => {
			const stack = new Error().stack;

			if (stack) {
				const stackLines = stack.split('\n');
				for (const line of stackLines) {
					if (
						!line.includes('Logger') &&
						!line.includes('ErrorHandler') &&
						!line.includes('serviceFactory') &&
						line.includes('at ')
					) {
						const match =
							line.match(regex.stackTrace.withFn) ||
							line.match(regex.stackTrace.withoutFn);

						if (match) {
							return match[1]
								? `${match[1]} (${match[2]}:${match[3]})`
								: `${match[2]}:${match[3]}`;
						}
					}
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
