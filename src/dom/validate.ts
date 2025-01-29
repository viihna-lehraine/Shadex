// File: dom/validate.js

import { DOMFn_MasterInterface } from '../types/index.js';
import { domData } from '../data/dom.js';
import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';

const logMode = mode.logging;
const thisModule = 'dom/validate.js';

const logger = await createLogger();

function validateElements(): void {
	const thisFunction = 'validateElements()';
	const ids = domData.ids;
	const allowedMissingElements = new Set([
		'color-box-1',
		'export-palette-input'
	]);
	const missingElements: string[] = [];

	Object.values(ids).forEach(id => {
		const element = document.getElementById(id);

		if (!element && !allowedMissingElements.has(id)) {
			if (logMode.error)
				logger.error(
					`Element with ID "${id}" not found`,
					`${thisModule} > ${thisFunction}`
				);

			missingElements.push(id);
		}
	});

	if (missingElements.length) {
		if (logMode.warn)
			logger.warn(
				`Some DOM elements are missing (${missingElements.length}): ${missingElements.join(
					', '
				)}`,
				`${thisModule} > ${thisFunction}`
			);
	} else {
		if (logMode.info && mode.debug && logMode.verbosity > 1)
			logger.info(
				'All required DOM elements are present.',
				`${thisModule} > ${thisFunction}`
			);
	}
}

export const validate: DOMFn_MasterInterface['validate'] = {
	elements: validateElements
};
