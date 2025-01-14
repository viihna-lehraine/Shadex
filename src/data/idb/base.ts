// File: src/data/idb/base.js

const DEFAULT_KEYS: Record<string, string> = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor'
} as const;

const STORE_NAMES: Record<string, string> = {
	CUSTOM_COLOR: 'customColor',
	MUTATIONS: 'mutations',
	PALLETES: 'palettes',
	SETTINGS: 'settings',
	TABLES: 'tables'
} as const;

export const base: Readonly<{
	DEFAULT_KEYS: Readonly<Record<string, string>>;
	STORE_NAMES: Readonly<Record<string, string>>;
}> = {
	DEFAULT_KEYS,
	STORE_NAMES
} as const;
