// File: services/app.js

import { AppServicesInterface } from '../../types/index.js';
import { createLogger } from '../factories/logger.js';
import { modeData as mode } from '../../data/mode.js';

async function createAppServices(): Promise<AppServicesInterface> {
	console.log('[FACTORIES.service] Loading createAppServices...');

	console.log('[FACTORIES.service] Awaiting createLogger()...');
	const logger = await createLogger();
	console.log(`[FACTORIES.service] Logger created:`, logger);

	async function handleAsyncErrors<T>(
		action: () => Promise<T>,
		errorMessage: string,
		caller: string,
		context?: Record<string, unknown>
	): Promise<T | null> {
		try {
			return await action();
		} catch (error) {
			if (mode.logging.error) {
				const errorMessageFormatted =
					error instanceof Error
						? `${errorMessage}: ${error.message}. Context: ${JSON.stringify(context)}`
						: `${errorMessage}: ${error}. Context: ${JSON.stringify(context)}`;

				logger.error(errorMessageFormatted, caller);
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
			logger as Record<string, Function>;
			logger[level](message, method);
		}

		if (level === 'error' && mode.showAlerts) {
			alert(message);
		}
	}

	const appServices = { handleAsyncErrors, log };

	console.log('[FACTORIES.service] Created appServices:', appServices);

	return {
		handleAsyncErrors,
		log
	};
}

export { createAppServices };
