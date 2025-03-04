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

			utilities.validate = validationUtilitiesFactory(helpers, services);
			utilities.brand = brandingUtilitiesFactory(
				services,
				utilities.validate
			);
			utilities.adjust = adjustmentUtilitiesFactory(
				utilities.brand,
				services,
				utilities.validate
			);
			utilities.format = formattingUtilitiesFactory(
				utilities.brand,
				services,
				utilities.validate
			);
			utilities.sanitize = sanitationUtilitiesFactory(
				utilities.brand,
				services,
				utilities.validate
			);
			utilities.color = await colorUtilitiesFactory(
				utilities.adjust,
				utilities.brand,
				utilities.format,
				helpers,
				utilities.sanitize,
				services,
				utilities.validate
			);
			utilities.dom = await domUtilitiesFactory(
				utilities.brand,
				utilities.color,
				helpers,
				services,
				utilities.validate
			);
			utilities.palette = paletteUtilitiesFactory(
				utilities.brand,
				utilities.color,
				utilities.dom,
				helpers,
				services,
				utilities.validate
			);

			return utilities as Required<Utilities>;
		},
		'Error initializing utilities',
		{ context: { utilities } }
	);
}
