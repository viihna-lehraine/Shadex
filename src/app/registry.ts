import {
	AppDependencies,
	CommonFunctions,
	Helpers,
	Services,
	Utilities
} from '../types/index.js';

export async function registerDependencies(
	helpers: Helpers,
	services: Services
): Promise<AppDependencies> {
	const { errors, log } = services;
	const caller = '[REGISTER_DEPENDENCIES]';

	log.info(`Executing registerDependencies...`, `${caller}`);

	return await errors.handleAsync(async () => {
		const utils = {} as Utilities;

		const { initializeUtilities } = await import('./init.js');
		Object.assign(utils, await initializeUtilities(helpers, services));

		const common: Required<CommonFunctions> = {
			helpers,
			services,
			utils
		};

		return {
			common
		} as AppDependencies;
	}, 'Error registering dependencies');
}
