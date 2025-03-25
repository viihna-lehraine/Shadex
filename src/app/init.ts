import type { Helpers, Services, Utilities } from '../types/index.js';

async function initializeUtilities(
	helpers: Helpers,
	services: Services
): Promise<Utilities> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const { utilitiesFactory } = await import('../core/factories/utils.js');

		const utils = await utilitiesFactory(helpers, services);

		return utils;
	}, 'Error initializing utils');
}

export { initializeUtilities };
