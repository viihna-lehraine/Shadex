// File: dom/validate.js

import { DOMFn_MasterInterface } from '../types/index.js';
import { domData } from '../data/dom.js';
import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';

const logMode = mode.logging;
const thisModule = 'dom/validate.js';

const logger = await createLogger();

export function validateStaticElements(): void {
	const thisFunction = 'validateElements()';
	const ids = domData.ids.static;
	const missingElements: string[] = [];

	// flattens the nested structure into a single array of IDs, then extracts their values
	const allIDs: string[] = Object.values(ids).flatMap(category =>
		Object.values(category)
	);

	allIDs.forEach((id: string) => {
		const element = document.getElementById(id);

		if (!element) {
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
	staticElements: validateStaticElements
};
