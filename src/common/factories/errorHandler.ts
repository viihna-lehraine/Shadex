// File: common/factories/errorHandler.js

import { AppLogger } from '../services/AppLogger.js';
import { ErrorHandler } from '../services/ErrorHandler.js';

export async function createErrorHandler(): Promise<ErrorHandler> {
	console.log(`[FACTORIES.errorHandler] Executing createErrorHandler()...`);

	const logger = AppLogger.getInstance();
	const errorHandler = ErrorHandler.getInstance(logger);

	console.log(
		'[FACTORIES.errorHandler] Created error handler:',
		errorHandler
	);

	return errorHandler;
}
