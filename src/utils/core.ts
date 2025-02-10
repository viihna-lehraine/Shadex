// File: utils/core.js

import {
	CoreUtilsInterface,
	DataSetsInterface,
	NumericRangeKey
} from '../types/index.js';

function clampToRange(
	value: number,
	rangeKey: NumericRangeKey,
	sets: DataSetsInterface
): number {
	const [min, max] = sets[rangeKey];

	return Math.min(Math.max(value, min), max);
}

function clone<T>(value: T): T {
	return structuredClone(value);
}

function debounce<T extends (...args: Parameters<T>) => void>(
	func: T,
	delay: number
) {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>): void => {
		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

export const coreUtils: CoreUtilsInterface = {
	clampToRange,
	clone,
	debounce
} as const;
