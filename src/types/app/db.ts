// File: types/app/db.js

import { IDBPDatabase, IDBPObjectStore } from 'idb';
import { PaletteSchema } from '../index.js';

export interface DBFn_MasterInterface {
	initializeDB(): Promise<IDBPDatabase<PaletteSchema>>;
	utils: {
		store: {
			withStore<
				StoreName extends keyof PaletteSchema,
				Mode extends 'readonly' | 'readwrite'
			>(
				db: IDBPDatabase<PaletteSchema>,
				storeName: StoreName,
				mode: Mode,
				callback: (
					store: IDBPObjectStore<
						PaletteSchema,
						[StoreName],
						StoreName,
						Mode
					>
				) => Promise<void>
			): Promise<void>;
		};
	};
}
