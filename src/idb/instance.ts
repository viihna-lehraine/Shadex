// File: src/idb/instance.ts

import { IDBManager } from './IDBManager.js';

export const idbInstance = await IDBManager.createInstance();
