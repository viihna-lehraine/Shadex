// File: src/common/utils/errors.ts

import { CommonFunctionsMasterInterface } from '../../types/index.js';
import { createLogger } from '../../logger/index.js';
import { mode } from '../data/base.js';

const logger = await createLogger();

const logMode = mode.logging;

async function handleAsync<T>(
	action: () => Promise<T>,
	errorMessage: string,
	context?: Record<string, unknown>
): Promise<T | null> {
	try {
		return await action();
	} catch (error) {
		if (logMode.error)
			if (error instanceof Error) {
				logger.error(
					`${errorMessage}: ${error.message}. Context: ${context}`,
					'common > utils > errors > handleAsync()'
				);
			} else {
				logger.error(
					`${errorMessage}: ${error}. Context: ${context}`,
					'common > utils > errors > handleAsync()'
				);
			}

		return null;
	}
}

export const errors: CommonFunctionsMasterInterface['utils']['errors'] = {
	handleAsync
};
