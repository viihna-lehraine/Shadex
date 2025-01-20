// File: src/data/config/db.ts

import {
	ConfigDBInterface,
	DefaultKeysInterface,
	DefaultSettingsInterface,
	StoreNamesInterface
} from '../../types/index.js';

const DEFAULT_KEYS: DefaultKeysInterface = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor'
} as const;

const DEFAULT_SETTINGS: DefaultSettingsInterface = {
	colorSpace: 'hsl',
	lastTableID: 0,
	theme: 'light',
	loggingEnabled: true
} as const;

const STORE_NAMES: StoreNamesInterface = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor',
	MUTATIONS: 'mutations',
	PALLETES: 'palettes',
	SETTINGS: 'settings',
	TABLES: 'tables'
} as const;

export const db: ConfigDBInterface = {
	DEFAULT_KEYS,
	DEFAULT_SETTINGS,
	STORE_NAMES
};
