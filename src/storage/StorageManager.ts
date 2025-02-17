// File: storage/StorageManager.js

import { ServicesInterface } from '../types/index.js';
import { IDBManager } from './IDBManager.js';
import { LocalStorageManager } from './LocalStorageManager.js';

export async function createStorageManager(
	dbName: string,
	storeName: string,
	version: number,
	services: ServicesInterface
) {
	const idbManager = new IDBManager(dbName, storeName, version, services);
	const isIDBAvailable = await idbManager.init();

	return isIDBAvailable ? idbManager : new LocalStorageManager(services);
}
