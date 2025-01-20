// File: src/common/utils/errors.ts

import { CommonUtilsFnErrors } from '../../types/index.js';
import { data } from '../../data/index.js';
import { logger } from '../../logger/index.js';

const logMode = data.mode.logging;

async function handleAsync<T>(
	action: () => Promise<T>,
	errorMessage: string,
	context?: Record<string, unknown>
): Promise<T | null> {
	try {
		return await action();
	} catch (error) {
		if (logMode.errors)
			if (error instanceof Error) {
				logger.error(
					`${errorMessage}: ${error.message}. Context: ${context}`
				);
			} else {
				logger.error(`${errorMessage}: ${error}. Context: ${context}`);
			}

		return null;
	}
}

export const errors: CommonUtilsFnErrors = {
	handleAsync
};
