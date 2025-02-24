// File: common/factories/services.ts

import { Helpers, LoggerOptions, Services } from '../../types/index.js';
import { DOMStore, ErrorHandler, Logger } from '../services/index.js';
import { config } from '../../config/index.js';

export function serviceFactory(helpers: Helpers): Services {
	console.log('[SERVICE_FACTORY]: Executing createServices.');

	const services = {} as Services;

	console.log(
		`[SERVICE_FACTORY]: Initializing Logger and ErrorHandler (creating instances).`
	);
	const logger = Logger.getInstance(helpers);
	services.errors = ErrorHandler.getInstance(helpers, logger);

	if (!logger || !services.errors) {
		throw new Error(
			'[SERVICE_FACTORY]: Logger or ErrorHandler failed to initialize.'
		);
	}

	services.log = (message: string, options: LoggerOptions) => {
		options.level ??= 'info';
		options.verbosity ??= 1;

		if (
			config.mode.log[options.level] &&
			config.mode.log.verbosity >= options.verbosity
		) {
			logger.log(message, options.level, options.caller);
		}

		if (options.level === 'error' && config.mode.showAlerts) {
			alert(message);
		}
	};

	console.log(`[SERVICE_FACTORY]: Initializing DOMStore.`);

	services.domStore = DOMStore.getInstance(
		services.errors,
		helpers,
		services.log
	);

	return services;
}
