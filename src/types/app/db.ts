// File: types/app/db.js

import { ConfigDataInterface, PaletteDB, PaletteSchema } from '../index.js';

export interface DBUtilsInterface {
	getDefaultKey(key: keyof ConfigDataInterface['db']['STORE_NAMES']): string;
	handleData<T>(
		store: keyof PaletteSchema,
		key: string,
		action: 'get' | 'put' | 'delete',
		data?: T
	): Promise<T | void | null>;
	log(
		level: 'debug' | 'warn' | 'error',
		message: string,
		method: string,
		verbosityRequirement?: number
	): void;
	updateData<T extends object>(
		store: keyof PaletteSchema,
		key: string,
		updateFn: (existing: T) => T
	): Promise<void>;
	withDB<T>(callback: (db: PaletteDB) => Promise<T>): Promise<T>;
}
