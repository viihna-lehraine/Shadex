// File: common/factories/logger.js

import { AppLogger } from '../logger/AppLogger.js';

export const createLogger = async () => {
	console.log('[FACTORIES.logger] Loading createLogger...');
	const appLogger = AppLogger.getInstance();
	console.log(
		`[FACTORIES.logger] AppLogger.getInstance() returned:`,
		appLogger
	);

	return {
		debug: appLogger.log.bind(appLogger, 'debug'),
		info: appLogger.log.bind(appLogger, 'info'),
		warn: appLogger.log.bind(appLogger, 'warn'),
		error: appLogger.log.bind(appLogger, 'error'),
		mutation: appLogger.logMutation.bind(appLogger)
	};
};

export const createAsyncLogger = async () => {
	const appLogger = AppLogger.getInstance();

	return {
		debug: appLogger.logAsync.bind(appLogger, 'debug'),
		info: appLogger.logAsync.bind(appLogger, 'info'),
		warn: appLogger.logAsync.bind(appLogger, 'warn'),
		error: appLogger.logAsync.bind(appLogger, 'error'),
		mutation: appLogger.logMutation.bind(appLogger)
	};
};
