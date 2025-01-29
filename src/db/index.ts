// File: db/storeUtils.js

import { DBFn_MasterInterface } from '../types/index.js';
import { initializeDB } from './initialize.js';
import { dbUtils } from './utils.js';

export { IDBManager } from './IDBManager.js';

export const dbFn: DBFn_MasterInterface = {
	initializeDB,
	utils: dbUtils
};
