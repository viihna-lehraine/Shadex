// File: src/db/storeUtils.ts

import { DBMasterFnInterface } from '../index/index.js';
import { initializeDB } from './initialize.js';
import { storeUtils } from '../db/storeUtils.js';

export const dbFn: DBMasterFnInterface = {
	initializeDB,
	storeUtils
};
