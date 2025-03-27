// File: src/scripts/core/utils/dom.ts

import {
	BrandingUtilities,
	ColorUtilities,
	DOMUtilities,
	Helpers,
	Services,
	ValidationUtilities
} from '../../types/index.js';

export async function domUtilitiesFactory(
	brand: BrandingUtilities,
	colorUtils: ColorUtilities,
	helpers: Helpers,
	services: Services,
	validate: ValidationUtilities
): Promise<DOMUtilities> {
	const { errors } = services;

	return errors.handleAsync(async () => {
		const { domParsingUtilitiesFactory } = await import(
			'./partials/dom/parse.js'
		);
		const { partialDOMUtilitiesFactory } = await import(
			'./partials/dom/main.js'
		);

		const domParsingUtilities = domParsingUtilitiesFactory(brand, services);
		const domUtilities = partialDOMUtilitiesFactory(
			colorUtils,
			helpers,
			services,
			validate
		);

		return {
			...domParsingUtilities,
			...domUtilities
		};
	}, 'Error occurred while creating DOM utilities group');
}
