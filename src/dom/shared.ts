// File: dom/shared.ts

import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';

const logMode = mode.logging;

const thisModule = 'dom/shared.js';

const logger = await createLogger();

export function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const thisFunction = 'addEventListener()';
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (logMode.warn) {
		if (mode.debug && logMode.warn && logMode.verbosity > 2)
			logger.warn(`Element with id "${id}" not found.`, `${thisModule} > ${thisFunction}`);
	}
}
