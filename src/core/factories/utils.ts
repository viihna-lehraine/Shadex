// File: core/factories/utils.ts

import { Helpers, Services, Utilities } from '../../types/index.js';

export async function utilitiesFactory(
	helpers: Helpers,
	services: Services
): Promise<Utilities> {
	const { errors, log } = services;
	const utilities = {} as Utilities;

	log.info('Executing utilitiesFactory.', `[UTILITIES_FACTORY]`);

	return await errors.handleAndReturn(
		async () => {
			log.info(
				'Importing utility group sub-factories.',
				`[UTILITIES_FACTORY]`
			);
			const [
				{ adjustmentUtilitiesFactory },
				{ brandingUtilitiesFactory },
				{ colorUtilitiesFactory },
				{ domUtilitiesFactory },
				{ formattingUtilitiesFactory },
				{ paletteUtilitiesFactory },
				{ sanitationUtilitiesFactory },
				{ validationUtilitiesFactory }
			] = await Promise.all([
				import('../utils/adjust.js'),
				import('../utils/brand.js'),
				import('../utils/color.js'),
				import('../utils/dom.js'),
				import('../utils/format.js'),
				import('../utils/palette.js'),
				import('../utils/sanitize.js'),
				import('../utils/validate.js')
			]);
			log.info(
				'Utility group sub-factories imported successfully.',
				`[UTILITIES_FACTORY]`
			);

			log.info('Calling validationUtilsFactory.', `[UTILITIES_FACTORY]`);
			utilities.validate = validationUtilitiesFactory(helpers, services);

			log.info('Initializing branding utilities.', `[UTILITIES_FACTORY]`);
			utilities.brand = brandingUtilitiesFactory(
				services,
				utilities.validate
			);

			log.info(
				'Initializing adjustment utilities.',
				`[UTILITIES_FACTORY]`
			);
			utilities.adjust = adjustmentUtilitiesFactory(
				utilities.brand,
				services,
				utilities.validate
			);

			log.info(
				'Initializing formatting utilities.',
				`[UTILITIES_FACTORY]`
			);
			utilities.format = formattingUtilitiesFactory(
				utilities.brand,
				services,
				utilities.validate
			);

			log.info(
				'Initializing sanitation utilities.',
				`[UTILITIES_FACTORY]`
			);
			utilities.sanitize = sanitationUtilitiesFactory(
				utilities.brand,
				services,
				utilities.validate
			);

			// 7. Initialize color utilities
			log.info('Initializing color utilities.', `[UTILITIES_FACTORY]`);
			utilities.color = await colorUtilitiesFactory(
				utilities.adjust,
				utilities.brand,
				utilities.format,
				helpers,
				utilities.sanitize,
				services,
				utilities.validate
			);

			// 8. Initialize DOM utilities
			log.info('Initializing DOM utilities.', `[UTILITIES_FACTORY]`);
			utilities.dom = await domUtilitiesFactory(
				utilities.brand,
				utilities.color,
				helpers,
				services,
				utilities.validate
			);

			log.info('Initializing palette utilities.', `[UTILITIES_FACTORY]`);
			utilities.palette = paletteUtilitiesFactory(
				utilities.brand,
				utilities.color,
				utilities.dom,
				helpers,
				services,
				utilities.validate
			);

			log.info(
				'Utilities initialized successfully.',
				`[UTILITIES_FACTORY]`
			);

			return utilities as Required<Utilities>;
		},
		'Error initializing utilities',
		{ context: { utilities } }
	);
}
