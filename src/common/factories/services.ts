// File: common/factories/services.ts

import { ServicesInterface } from '../../types/index.js';
import { AppLogger } from '../services/AppLogger.js';
import { ErrorHandler } from '../services/ErrorHandler.js';
import { config } from '../../config/index.js';
import { getCallerInfo } from '../services/helpers.js';

const mode = config.mode;

export function createServices(): ServicesInterface {
	console.log('[FACTORIES.service] Loading createServices...');

	const logger = AppLogger.getInstance();
	const errors = ErrorHandler.getInstance(logger);

	if (!logger || !errors) {
		throw new Error(
			'[FACTORIES.service] Logger or ErrorHandler failed to initialize.'
		);
	}

	const log: ServicesInterface['log'] = (
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error' = 'info',
		verbosityRequirement: number = 0
	) => {
		if (
			mode.logging[level] &&
			mode.logging.verbosity >= verbosityRequirement
		) {
			const caller = getCallerInfo();
			logger.log(message, level, caller);
		}

		if (level === 'error' && mode.showAlerts) {
			alert(message);
		}
	};

	return { log, errors };
}
