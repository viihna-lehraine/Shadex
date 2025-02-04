// File: db/dbUtils.js

import {
	ConfigDataInterface,
	DBUtilsInterface,
	PaletteDB,
	PaletteSchema
} from '../types/index.js';
import { createLogger } from '../logger/factory.js';
import { configData as config } from '../data/config.js';
import { getIDBInstance } from './instance.js';
import { modeData as mode } from '../data/mode.js';

const logMode = mode.logging;

const defaultSettings = config.db.DEFAULT_SETTINGS;

const logger = await createLogger();

export function getDefaultKey(
	key: keyof ConfigDataInterface['db']['STORE_NAMES']
): string {
	const defaultKey = defaultSettings[key as keyof typeof defaultSettings];

	if (!defaultKey) throw new Error(`[getDefaultKey()]: Invalid key ${key}`);

	return defaultKey as keyof PaletteSchema;
}

export async function handleData<T>(
	store: keyof PaletteSchema,
	key: string,
	action: 'get' | 'put' | 'delete',
	data?: T
): Promise<T | void | null> {
	return withDB(async db => {
		const storeRef = db.transaction(store, 'readwrite').objectStore(store);

		if (action === 'get') return (await storeRef.get(key)) ?? null;
		if (action === 'put' && data) await storeRef.put({ key, ...data });
		if (action === 'delete') await storeRef.delete(key);
	});
}

function log(
	level: 'debug' | 'warn' | 'error',
	message: string,
	method: string,
	verbosityRequirement?: number
): void {
	if (logMode[level] && logMode.verbosity >= (verbosityRequirement ?? 0)) {
		logger[level](`${message}`, `${method}`);
	}
}

async function updateData<T extends object>(
	store: keyof PaletteSchema,
	key: string,
	updateFn: (existing: T) => T
): Promise<void> {
	const existing = await handleData<T>(store, key, 'get');

	if (!existing)
		throw new Error(
			`${store} entry not found\ndb/IDBManager.js > updateData()`
		);

	await dbUtils.handleData(store, key, 'put', updateFn(existing));
}

async function withDB<T>(callback: (db: PaletteDB) => Promise<T>): Promise<T> {
	const db = await (await getIDBInstance()).getDB();

	return callback(db);
}

export const dbUtils: DBUtilsInterface = {
	getDefaultKey,
	handleData,
	log,
	updateData,
	withDB
};
