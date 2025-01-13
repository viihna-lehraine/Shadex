// File: src/common/dom/base.js

import { CommonDOMBase } from '../../index/index.js';
import { mode } from '../../data/mode/index.js';

function getElement<T extends HTMLElement>(id: string): T | null {
	const element = document.getElementById(id) as T | null;

	// if (mode.stackTrace) console.trace('getElement() was called');

	if (!element) {
		if (mode.warnLogs) {
			console.warn(`Element with ID ${id} not found`);
		}
	}

	return element;
}

export const base: CommonDOMBase = {
	getElement
} as const;
