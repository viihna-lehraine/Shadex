// File: src/config/idb/base.ts

const DEFAULT_KEYS = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor'
} as const;

const STORE_NAMES = {
	CUSTOM_COLOR: 'customColor',
	MUTATIONS: 'mutations',
	PALLETES: 'palettes',
	SETTINGS: 'settings',
	TABLES: 'tables'
} as const;

export const base = { DEFAULT_KEYS, STORE_NAMES } as const;
