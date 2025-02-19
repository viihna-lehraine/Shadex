// File: common/utils/core.js

import { CoreUtilsInterface, NumericRangeKey } from '../../types/index.js';
import { config } from '../../config/index.js';

const sets = config.sets;

function clampToRange(value: number, rangeKey: NumericRangeKey): number {
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

function getAllElements<T extends HTMLElement>(
	selector: string
): NodeListOf<T> {
	return document.querySelectorAll(selector) as NodeListOf<T>;
}

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

export const coreUtils: CoreUtilsInterface = {
	clampToRange,
	clone,
	debounce,
	getAllElements,
	getElement
} as const;
