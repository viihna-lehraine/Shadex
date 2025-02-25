// File: core/utils/color.ts

import {
	AdjustmentUtilities,
	BrandingUtilities,
	ColorUtilities,
	FormattingUtilities,
	Helpers,
	SanitationUtilities,
	Services,
	ValidationUtilities
} from '../../types/index.js';

export async function colorUtilitiesFactory(
	adjust: AdjustmentUtilities,
	brand: BrandingUtilities,
	format: FormattingUtilities,
	helpers: Helpers,
	sanitize: SanitationUtilities,
	services: Services,
	validate: ValidationUtilities
): Promise<ColorUtilities> {
	const { errors, log } = services;
	const caller = '[COLOR_UTILS_FACTORY]';

	log.info('Executing colorUtilitiesFactory.', `${caller} constructor`);

	return errors.handleAsync(async () => {
		const { colorBrandingUtilitiesFactory } = await import(
			'./partials/color/brand.js'
		);
		const { colorConversionUtilitiesFactory } = await import(
			'./partials/color/conversion.js'
		);
		const { colorFormattingUtilitiesFactory } = await import(
			'./partials/color/format.js'
		);
		const { colorGenerationUtilitiesFactory } = await import(
			'./partials/color/generate.js'
		);
		const { colorParsingUtilitiesFactory } = await import(
			'./partials/color/parse.js'
		);

		const colorBrandUtils = colorBrandingUtilitiesFactory(
			brand,
			helpers,
			services
		);
		const colorFormatUtils = colorFormattingUtilitiesFactory(
			format,
			helpers,
			services
		);
		const colorGenerationUtils = colorGenerationUtilitiesFactory(
			sanitize,
			services,
			validate
		);
		const colorParseUtils = colorParsingUtilitiesFactory(services);
		const colorConversionUtils = colorConversionUtilitiesFactory(
			adjust,
			brand,
			format,
			helpers,
			sanitize,
			services,
			validate
		);

		const colorUtilities: ColorUtilities = {
			...colorBrandUtils,
			...colorConversionUtils,
			...colorFormatUtils,
			...colorParseUtils,
			...colorGenerationUtils
		};

		console.log(`${caller}: Color utilities group created`, colorUtilities);

		return colorUtilities;
	}, 'Error occurred while creating color utilities group');
}
