// File: src/db/storeUtils.ts

import { IDBPDatabase, IDBPObjectStore } from 'idb';
import { PaletteSchema, StoreUtilsFnInterface } from '../types/index.js';

async function withStore<
	StoreName extends keyof PaletteSchema,
	Mode extends 'readonly' | 'readwrite'
>(
	db: IDBPDatabase<PaletteSchema>,
	storeName: StoreName,
	mode: Mode,
	callback: (
		store: IDBPObjectStore<PaletteSchema, [StoreName], StoreName, Mode>
	) => void
): Promise<void> {
	const tx = db.transaction(storeName, mode);
	const store = tx.objectStore(storeName);

	callback(store);

	await tx.done;
}

export const storeUtils: StoreUtilsFnInterface = {
	withStore
};
