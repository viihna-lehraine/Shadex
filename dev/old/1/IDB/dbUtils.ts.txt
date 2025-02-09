// File: app/db/dbUtils.js

import {
	ConfigDataInterface,
	DBUtilsInterface,
	PaletteDB,
	PaletteSchema
} from '../../types/index.js';
import { IDBManager } from './IDBManager.js';
import { configData as config } from '../../data/config.js';

const defaultSettings = config.db.DEFAULT_SETTINGS;

let idbManager: IDBManager | null = null;

export function setIDBManagerInstance(instance: IDBManager) {
	idbManager = instance;
}

function getDefaultKey(
	key: keyof ConfigDataInterface['db']['STORE_NAMES']
): string {
	const defaultKey = defaultSettings[key as keyof typeof defaultSettings];

	if (!defaultKey) throw new Error(`[getDefaultKey()]: Invalid key ${key}`);

	return defaultKey as keyof PaletteSchema;
}

async function handleData<T>(
	store: keyof PaletteSchema,
	key: string,
	action: 'get' | 'put' | 'delete',
	data?: T
): Promise<T | null> {
	return await dbUtils.withDB(async db => {
		const storeRef = db.transaction(store, 'readwrite').objectStore(store);

		if (action === 'get') {
			const result = await storeRef.get(key);
			return result ?? null;
		}
		if (action === 'put' && data) {
			await storeRef.put({ key, ...data });
			return data;
		}
		if (action === 'delete') {
			await storeRef.delete(key);
			return null;
		}

		return null;
	});
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
	if (!idbManager) throw new Error('IDBManager instance is not set.');

	const db = await idbManager.getDB();

	return callback(db);
}

export const dbUtils: DBUtilsInterface = {
	getDefaultKey,
	handleData,
	updateData,
	withDB
};
