// File: src/dom/validate.ts

import { DOMValidateFnInterface } from '../index/index.js';
import { data } from '../data/index.js';
import { log } from '../classes/logger/index.js';

const logMode = data.mode.logging;
const mode = data.mode;

function validateElements(): void {
	const ids = data.consts.dom.ids;
	const missingElements: string[] = [];

	Object.values(ids).forEach(id => {
		const element = document.getElementById(id);

		if (!element) {
			if (logMode.errors) log.error(`Element with ID "${id}" not found`);
			missingElements.push(id);
		}
	});

	if (missingElements.length) {
		if (logMode.warnings)
			log.warning(
				`Some DOM elements are missing (${missingElements.length}): ${missingElements.join(
					', '
				)}`
			);
	} else {
		if (logMode.info && mode.debug && logMode.verbosity > 1)
			log.info('All required DOM elements are present.');
	}
}

export const validate: DOMValidateFnInterface = {
	elements: validateElements
};
