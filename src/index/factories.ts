// File: src/index/factories.ts

import { MutationLog } from './index.js';

export interface AsyncLoggerFactory {
	debug(message: string): Promise<void>;
	info(message: string): Promise<void>;
	warning(message: string): Promise<void>;
	error(message: string): Promise<void>;
	mutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): Promise<void>;
}

export interface SyncLoggerFactory {
	debug(message: string): void;
	info(message: string): void;
	warning(message: string): void;
	error(message: string): void;
	mutation(data: MutationLog, logCallback: (data: MutationLog) => void): void;
}
