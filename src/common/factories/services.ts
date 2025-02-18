// File: common/factories/services.js

import { ServicesInterface } from '../../types/index.js';
import { createErrorHandler } from './errorHandler.js';
import { createLogger } from './logger.js';
import { data } from '../../data/index.js';

const mode = data.mode;

export async function createServices(): Promise<ServicesInterface> {
	console.log('[FACTORIES.service] Loading createServices...');

	const logger = await createLogger();
	const errors = await createErrorHandler();

	if (!logger || !errors) {
		throw new Error(
			'[FACTORIES.service] Logger or ErrorHandler failed to initialize.'
		);
	}

	// Define logging function
	const log: ServicesInterface['log'] = (
		level,
		message,
		method,
		verbosityRequirement
	) => {
		if (
			mode.logging[level] &&
			mode.logging.verbosity >= (verbosityRequirement ?? 0)
		) {
			logger[level](message, method);
		}

		if (level === 'error' && mode.showAlerts) {
			alert(message);
		}
	};

	// Return flattened services object
	return { log, errors };
}
