// File: common/utils/errors.js

import { CommonFn_MasterInterface } from '../../types/index.js';
import { createLogger } from '../../logger/index.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'common/utils/errors.ts';

const logger = await createLogger();

async function handleAsync<T>(
	action: () => Promise<T>,
	errorMessage: string,
	context?: Record<string, unknown>
): Promise<T | null> {
	const thisMethod = 'handleAsync()';

	try {
		return await action();
	} catch (error) {
		if (logMode.error)
			if (error instanceof Error) {
				logger.error(
					`${errorMessage}: ${error.message}. Context: ${context}`,
					`${thisModule} > ${thisMethod}`
				);
			} else {
				logger.error(
					`${errorMessage}: ${error}. Context: ${context}`,
					`${thisModule} > ${thisMethod}`
				);
			}

		return null;
	}
}

export const errorUtils: CommonFn_MasterInterface['utils']['errors'] = {
	handleAsync
};
