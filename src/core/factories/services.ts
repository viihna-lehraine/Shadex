// File: core/factories/services.ts

import { Helpers, Services } from '../../types/index.js';
import { ErrorHandlerService, LoggerService } from '../services/index.js';

export function serviceFactory(helpers: Helpers): Services {
	console.log('[SERVICE_FACTORY]: Executing createServices.');

	const services = {} as Services;

	console.log(
		`[SERVICE_FACTORY]: Initializing Logger and ErrorHandler (creating instances).`
	);
	services.log = LoggerService.getInstance();
	services.errors = ErrorHandlerService.getInstance(helpers, services.log);

	if (!services.log || !services.errors) {
		throw new Error(
			'[SERVICE_FACTORY]: Logger or ErrorHandler failed to initialize.'
		);
	}

	return services;
}
