// File: src/data/config.js

import { ConfigDataInterface, ColorSpace } from '../types/index.js';

const DEFAULT_KEYS = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor'
};

const DEFAULT_SETTINGS = {
	colorSpace: 'hsl' as ColorSpace,
	lastTableID: 0,
	theme: 'light' as 'light' | 'dark',
	loggingEnabled: true
};

const STORE_NAMES = {
	APP_SETTINGS: 'appSettings',
	CUSTOM_COLOR: 'customColor',
	MUTATIONS: 'mutations',
	PALLETES: 'palettes',
	SETTINGS: 'settings',
	TABLES: 'tables'
};

const db = { DEFAULT_KEYS, DEFAULT_SETTINGS, STORE_NAMES };

const regex: ConfigDataInterface['regex'] = {
	colors: {
		cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
		hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
		hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
	},
	dom: {
		hex: /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i,
		hsl: /^hsl\(\s*(\d+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/,
		rgb: /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/
	},
	file: {
		palette: {
			css: {
				color: /\.color-\d+\s*{\s*([\s\S]*?)\s*}/i,
				metadata: /\.palette\s*{\s*([\s\S]*?)\s*}/i
			}
		}
	}
};

export const configData: ConfigDataInterface = { db, regex } as const;
