// File: db/initialize.js

import { openDB, IDBPDatabase } from 'idb';
import { PaletteSchema } from '../types/index.js';
import { configData as config } from '../data/config.js';

export async function initializeDB(): Promise<IDBPDatabase<PaletteSchema>> {
	return openDB<PaletteSchema>('paletteDB', 1, {
		upgrade: db => {
			const storeNames = Object.values(config.db.STORE_NAMES);

			storeNames.forEach(storeName => {
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: 'key' });
				}
			});
		}
	});
}
