// File: common/factories/logger.js

import { LoggerInterface } from '../../types/index.js';
import { AppLogger } from '../services/AppLogger.js';
import { data } from '../../data/index.js';

const debugLevel = data.mode.debugLevel;

export const createLogger = async (): Promise<LoggerInterface> => {
	console.log('[FACTORIES.logger] Loading createLogger...');
	const appLogger = AppLogger.getInstance();
	console.log(
		`[FACTORIES.logger] AppLogger.getInstance() returned:`,
		Object.getOwnPropertyNames(Object.getPrototypeOf(appLogger))
	);

	return {
		debug: (message, caller) =>
			appLogger.log(message, 'debug', debugLevel, caller),
		info: (message, caller) =>
			appLogger.log(message, 'info', debugLevel, caller),
		warn: (message, caller) =>
			appLogger.log(message, 'warn', debugLevel, caller),
		error: (message, caller) =>
			appLogger.log(message, 'error', debugLevel, caller),
		mutation: (data, logCallback, caller) => {
			appLogger.logMutation(data, logCallback);
			if (caller) {
				appLogger.log(`Mutation logged by ${caller}`, 'debug');
			}
		}
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
