// File: src/scrips/app/registry.ts

import {
	AppDependencies,
	CommonFunctions,
	Helpers,
	Services,
	Utilities
} from '../types/index.js';
import { StorageManager } from '../core/services/storage/StorageManager.js';

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
			services: services as Services & { storage: StorageManager },
			utils
		};

		return {
			common
		} as AppDependencies;
	}, 'Error registering dependencies');
}
