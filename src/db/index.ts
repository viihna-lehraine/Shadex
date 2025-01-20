// File: src/db/storeUtils.ts

import { DBMasterFnInterface } from '../types/index.js';
import { initializeDB } from './initialize.js';
import { storeUtils } from '../db/storeUtils.js';

export { IDBManager } from './IDBManager.js';

export const dbFn: DBMasterFnInterface = {
	initializeDB,
	storeUtils
};
