// File: src/index/db.ts

import { IDBPDatabase, IDBPObjectStore } from 'idb';
import { PaletteSchema } from './index.js';

export interface DBMasterFnInterface {
	initializeDB(): Promise<IDBPDatabase<PaletteSchema>>;
	storeUtils: {
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
}
