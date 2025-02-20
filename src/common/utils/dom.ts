// File: common/utils/dom.ts

import { DOMUtils, Helpers, Services, Utilities } from '../../types/index.js';

export async function domUtilsFactory(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): Promise<DOMUtils> {
	const { domParsingUtilsFactory } = await import('./partials/dom/parse.js');
	const { partialDOMUtilsFactory } = await import('./partials/dom/main.js');

	const domParsingUtils = domParsingUtilsFactory(services, utils);
	const domUtils = partialDOMUtilsFactory(helpers, services, utils);

	return {
		...domParsingUtils,
		...domUtils
	};
}
