// File: common/factories/utils.ts

import { Helpers, Services, Utilities } from '../../types/index.js';

export async function utilitiesFactory(
	helpers: Helpers,
	services: Services
): Promise<Utilities> {
	const { errors, log } = services;
	const utilities = {} as Utilities;

	log('Executing utilitiesFactory.', { caller: '[UTILITIES_FACTORY]' });

	return await errors.handleAndReturn(
		async () => {
			// 1. Import utility group sub-factories
			log('Importing utility group sub-factories.', {
				caller: '[UTILITIES_FACTORY]'
			});
			const [
				{ adjustmentUtilsFactory },
				{ brandingUtilsFactory },
				{ colorUtilsFactory },
				{ domUtilsFactory },
				{ formattingUtilsFactory },
				{ paletteUtilsFactory },
				{ sanitationUtilsFactory },
				{ validationUtilsFactory }
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
			log('Utility group sub-factories imported successfully.', {
				caller: '[UTILITIES_FACTORY]'
			});

			// 2. Initialize validation utilities
			log('Calling validationUtilsFactory.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.validate = validationUtilsFactory(helpers, services);

			// 3. Initialize branding utilities
			log('Initializing branding utilities.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.brand = brandingUtilsFactory(
				services,
				utilities.validate
			);

			// 4. Initialize adjustment utilities
			log('[UTILITIES_FACTORY]', {
				caller: 'Initializing adjustment utilities.'
			});
			utilities.adjust = adjustmentUtilsFactory(
				utilities.brand,
				services,
				utilities.validate
			);

			// 5. Initialize formatting utilities
			log('Initializing formatting utilities.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.format = formattingUtilsFactory(
				utilities.brand,
				services,
				utilities.validate
			);

			// 6. Initialize sanitation utilities
			log('Initializing sanitation utilities.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.sanitize = sanitationUtilsFactory(
				utilities.brand,
				services,
				utilities.validate
			);

			// 7. Initialize color utilities
			log('Initializing color utilities.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.color = await colorUtilsFactory(
				utilities.adjust,
				utilities.brand,
				utilities.format,
				helpers,
				utilities.sanitize,
				services,
				utilities.validate
			);

			// 8. Initialize DOM utilities
			log('Initializing DOM utilities.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.dom = await domUtilsFactory(
				utilities.brand,
				utilities.color,
				helpers,
				services,
				utilities.validate
			);

			// 9. Initialize palette utilities
			log('Initializing palette utilities.', {
				caller: '[UTILITIES_FACTORY]'
			});
			utilities.palette = paletteUtilsFactory(
				utilities.brand,
				utilities.color,
				utilities.dom,
				helpers,
				services,
				utilities.validate
			);

			// 10. Log success
			log('Utilities initialized successfully.', {
				caller: '[UTILITIES_FACTORY]'
			});

			// 11. Return utilities
			console.log(
				'[UTILITIES_FACTORY]: Utilities value before return.',
				utilities
			);
			return utilities as Required<Utilities>;
		},
		'Error initializing utilities',
		{ context: { utilities } }
	);
}
