// File: services/app.js

import { AppServicesInterface } from '../types/index.js';
import { createLogger } from '../logger/factory.js';
import { modeData as mode } from '../data/mode.js';

const logger = await createLogger();

async function handleAsyncErrors<T>(
	action: () => Promise<T>,
	errorMessage: string,
	caller: string,
	context?: Record<string, unknown>
): Promise<T | null> {
	try {
		return await action();
	} catch (error) {
		if (mode.logging.error)
			if (error instanceof Error) {
				logger.error(
					`${errorMessage}: ${error.message}. Context: ${context}`,
					`${caller}`
				);
			} else {
				logger.error(
					`${errorMessage}: ${error}. Context: ${context}`,
					`${caller}`
				);
			}

		return null;
	}
}

function log(
	level: 'debug' | 'info' | 'warn' | 'error',
	message: string,
	method: string,
	verbosityRequirement?: number
): void {
	if (
		mode.logging[level] &&
		mode.logging.verbosity >= (verbosityRequirement ?? 0)
	) {
		logger[level](`${message}`, `${method}`);
	}

	if (level === 'error' && mode.showAlerts) {
		alert(message);
	}
}

export const appServices: AppServicesInterface = {
	handleAsyncErrors,
	log
};
