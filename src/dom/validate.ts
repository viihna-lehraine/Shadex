// File: src/dom/validate.ts

import { DOM_FunctionsMasterInterface } from '../types/index.js';
import { consts, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';

const logger = await createLogger();

const logMode = mode.logging;

function validateElements(): void {
	const ids = consts.dom.ids;
	const missingElements: string[] = [];

	Object.values(ids).forEach(id => {
		const element = document.getElementById(id);

		if (!element) {
			if (logMode.error)
				logger.error(
					`Element with ID "${id}" not found`,
					'dom > validate > validateElements()'
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
				'dom > validate > validateElements()'
			);
	} else {
		if (logMode.info && mode.debug && logMode.verbosity > 1)
			logger.info(
				'All required DOM elements are present.',
				'dom > validate > validateElements()'
			);
	}
}

export const validate: DOM_FunctionsMasterInterface['validate'] = {
	elements: validateElements
};
