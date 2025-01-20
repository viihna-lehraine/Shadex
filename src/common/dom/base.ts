// File: src/common/dom/base.js

import { CommonDOMBase } from '../../types/index.js';
import { logger } from '../../logger/index.js';
import { data } from '../../data/index.js';

const logMode = data.mode.logging;
const mode = data.mode;

function getElement<T extends HTMLElement>(id: string): T | null {
	const element = document.getElementById(id) as T | null;

	if (mode.debugLevel === 5) console.trace('getElement() was called');

	if (!element) {
		if (logMode.warnings) {
			logger.warning(`Element with ID ${id} not found`);
		}
	}

	return element;
}

export const base: CommonDOMBase = {
	getElement
} as const;
