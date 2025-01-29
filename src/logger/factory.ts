// File: logger/factory.js

import { MutationLog } from '../types/index.js';
import { AppLogger } from './AppLogger.js';
import { modeData as mode } from '../data/mode.js';

export const createLogger = async () => {
	const debugLevel = mode.debugLevel;
	const appLogger = AppLogger.getInstance(mode);

	return {
		debug: (message: string, caller?: string) =>
			appLogger.log(message, 'debug', debugLevel, caller),
		info: (message: string, caller?: string) =>
			appLogger.log(message, 'info', debugLevel, caller),
		warn: (message: string, caller?: string) =>
			appLogger.log(message, 'warn', debugLevel, caller),
		error: (message: string, caller?: string) =>
			appLogger.log(message, 'error', debugLevel, caller),
		mutation: (
			data: MutationLog,
			logCallback: (data: MutationLog) => void,
			caller?: string
		) => {
			appLogger.logMutation(data, logCallback);

			if (caller) {
				appLogger.log(
					`Mutation logged by ${caller}`,
					'debug',
					debugLevel
				);
			}
		}
	};
};

export const createAsyncLogger = async () => {
	const debugLevel = mode.debugLevel;
	const appLogger = AppLogger.getInstance(mode);

	return {
		debug: (message: string, caller?: string) =>
			appLogger.logAsync(message, 'debug', debugLevel, caller),
		info: (message: string, caller?: string) =>
			appLogger.logAsync(message, 'info', debugLevel, caller),
		warn: (message: string, caller?: string) =>
			appLogger.logAsync(message, 'warn', debugLevel, caller),
		error: (message: string, caller?: string) =>
			appLogger.logAsync(message, 'error', debugLevel, caller),
		mutation: (
			data: MutationLog,
			logCallback: (data: MutationLog) => void,
			caller?: string
		) => {
			appLogger.logMutation(data, logCallback);

			if (caller) {
				appLogger.logAsync(
					`Mutation logged by ${caller}`,
					'debug',
					debugLevel
				);
			}
		}
	};
};
