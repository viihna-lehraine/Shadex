// File: src/data/idb/base.js

import {
	IDBData,
	IDB_DEFAULT_KEYS_Data,
	IDB_STORE_NAMES_Data
} from '../../index/index.js';

const DEFAULT_KEYS: IDB_DEFAULT_KEYS_Data = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor'
} as const;

const STORE_NAMES: IDB_STORE_NAMES_Data = {
	CUSTOM_COLOR: 'customColor',
	MUTATIONS: 'mutations',
	PALLETES: 'palettes',
	SETTINGS: 'settings',
	TABLES: 'tables'
} as const;

export const base: IDBData = {
	DEFAULT_KEYS,
	STORE_NAMES
} as const;
