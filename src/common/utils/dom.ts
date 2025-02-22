// File: common/utils/dom.ts

import {
	BrandingUtils,
	ColorUtils,
	DOMUtils,
	Helpers,
	Services,
	ValidationUtils
} from '../../types/index.js';

export async function domUtilsFactory(
	brand: BrandingUtils,
	colorUtils: ColorUtils,
	helpers: Helpers,
	services: Services,
	validate: ValidationUtils
): Promise<DOMUtils> {
	const { errors } = services;

	return errors.handleAsync(async () => {
		const { domParsingUtilsFactory } = await import(
			'./partials/dom/parse.js'
		);
		const { partialDOMUtilsFactory } = await import(
			'./partials/dom/main.js'
		);

		const domParsingUtils = domParsingUtilsFactory(brand, services);
		const domUtils = partialDOMUtilsFactory(
			colorUtils,
			helpers,
			services,
			validate
		);

		return {
			...domParsingUtils,
			...domUtils
		};
	}, 'Error occurred while creating DOM utilities group');
}
