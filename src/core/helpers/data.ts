import { DataHelpers, TypeGuards } from '../../types/index.js';
import { regex } from '../../config/index.js';

export function dataHelpersFactory(typeGuards: TypeGuards): DataHelpers {
	const { isObject } = typeGuards;

	function deepClone<T>(value: T): T {
		if (!isObject(value)) return value;

		return structuredClone(value) as T;
	}

	function deepFreeze<T>(obj: T): T {
		if (!isObject(obj) || Object.isFrozen(obj)) {
			return obj;
		}

		(Object.keys(obj) as Array<keyof T>).forEach(key => {
			const value = obj[key];
			if (typeof value === 'object' && value !== null) {
				deepFreeze(value);
			}
		});

		return Object.freeze(obj);
	}

	function getCallerInfo(): string {
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
	}

	function getFormattedTimestamp(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	function parseValue(value: string | number): number {
		return typeof value === 'string' && value.endsWith('%')
			? parseFloat(value.slice(0, -1))
			: Number(value);
	}

	async function tracePromise(
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

	const dataHelpers: DataHelpers = {
		deepClone,
		deepFreeze,
		getCallerInfo,
		getFormattedTimestamp,
		parseValue,
		tracePromise
	};

	return dataHelpers;
}
