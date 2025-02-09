// File: common/core/base.js

import { CoreUtilsInterface, NumericRangeKey } from '../../types/index.js';
import { dataSets as sets } from '../../data/sets.js';

const _sets = sets;

function clampToRange(value: number, rangeKey: NumericRangeKey): number {
	const [min, max] = _sets[rangeKey];

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

export const base: CoreUtilsInterface['base'] = {
	clampToRange,
	clone,
	debounce
} as const;
