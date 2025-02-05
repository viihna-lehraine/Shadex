// File: app/appUtils.js

import { AppUtilsInterface } from '../types/index.js';
import { createLogger } from '../logger/factory.js';
import { modeData as mode } from '../data/mode.js';

const logMode = mode.logging;

const logger = await createLogger();

async function handleAsync<T>(
	action: () => Promise<T>,
	errorMessage: string,
	caller: string = 'unknown caller',
	context?: Record<string, unknown>
): Promise<T | null> {
	try {
		return await action();
	} catch (error) {
		if (logMode.error)
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
	level: 'debug' | 'warn' | 'error',
	message: string,
	method: string,
	verbosityRequirement?: number
): void {
	if (logMode[level] && logMode.verbosity >= (verbosityRequirement ?? 0)) {
		logger[level](`${message}`, `${method}`);
	}
}

export const appUtils: AppUtilsInterface = {
	handleAsync,
	log
};
