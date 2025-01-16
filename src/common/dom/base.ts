// File: src/common/dom/base.js

import { CommonDOMBase } from '../../index/index.js';
import { log } from '../../classes/logger/index.js';
import { mode } from '../../data/mode/index.js';

const logMode = mode.logging;

function getElement<T extends HTMLElement>(id: string): T | null {
	const element = document.getElementById(id) as T | null;

	if (mode.debugLevel === 5) console.trace('getElement() was called');

	if (!element) {
		if (logMode.warnings) {
			log.warn(`Element with ID ${id} not found`);
		}
	}

	return element;
}

export const base: CommonDOMBase = {
	getElement
} as const;
