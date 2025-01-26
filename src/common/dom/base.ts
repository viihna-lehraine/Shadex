// File: src/common/dom/base.js

import { CommonDOMBase } from '../../types/index.js';

async function getElement<T extends HTMLElement>(
	id: string,
	mode: { logging: { warn: boolean }; debugLevel: number }
): Promise<T | null> {
	const element = document.getElementById(id) as T | null;

	if (mode.debugLevel === 5) console.trace('getElement() was called');

	if (!element) {
		console.warn(`Element with ID ${id} not found.\nCaller: getElement()`);
	}

	return element;
}

export const base: CommonDOMBase = {
	getElement
} as const;
