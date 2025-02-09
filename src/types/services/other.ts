// File: types/services/other.js

import { MutationLog } from '../index.js';

export interface AppLoggerServiceInterface {
	log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: 0 | 1
	): void;
	logAsync(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: 0 | 1
	): Promise<void>;
	logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): void;
}
