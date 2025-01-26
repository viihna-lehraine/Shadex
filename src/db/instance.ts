// File: src/db/instance.ts

import { IDBManager } from './IDBManager.js';

let idbInstance: IDBManager | null = null;

export const getIDBInstance = async (): Promise<IDBManager> => {
	if (!idbInstance) {
		idbInstance = await IDBManager.getInstance();
	}
	return idbInstance;
};
