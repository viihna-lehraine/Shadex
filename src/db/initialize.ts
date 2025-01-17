// File: src/db/initialize.ts

import { openDB, IDBPDatabase } from 'idb';
import { PaletteSchema } from '../index/index.js';
import { config } from '../config/index.js';

const dbConfig = config.db;

export async function initializeDB(): Promise<IDBPDatabase<PaletteSchema>> {
	return openDB<PaletteSchema>('paletteDB', 1, {
		upgrade: db => {
			const storeNames = Object.values(dbConfig.STORE_NAMES);

			storeNames.forEach(storeName => {
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: 'key' });
				}
			});
		}
	});
}
