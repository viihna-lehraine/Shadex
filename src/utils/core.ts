import * as fnObjects from '../index/fn-objects';

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

function isInRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}

export const core: fnObjects.Core = { clone, debounce, isInRange };
