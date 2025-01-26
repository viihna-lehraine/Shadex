// File: src/dom/shared.ts

import { createLogger } from '../logger/index.js';
import { mode } from '../common/data/base.js';

const logger = await createLogger();

const logMode = mode.logging;

export function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (logMode.warn) {
		if (mode.debug && logMode.warn && logMode.verbosity > 2)
			logger.warn(`Element with id "${id}" not found.`, 'dom > shared > addEventListener()');
	}
}
