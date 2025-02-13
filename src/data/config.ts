// File: src/data/config.js

import { ConfigDataInterface, ColorSpace } from '../types/index.js';

const DEFAULT_KEYS: ConfigDataInterface['storage']['DEFAULT_KEYS'] = {
	SETTINGS: 'settings'
};

const DEFAULT_SETTINGS: ConfigDataInterface['storage']['DEFAULT_SETTINGS'] = {
	colorSpace: 'hsl' as ColorSpace,
	lastPaletteID: 0,
	theme: 'light' as 'light' | 'dark',
	loggingEnabled: true
};

const storage: ConfigDataInterface['storage'] = {
	DEFAULT_KEYS,
	DEFAULT_SETTINGS
};

const regex: ConfigDataInterface['regex'] = {
	brand: {
		hex: /^#[0-9A-Fa-f]{8}$/
	},
	colors: {
		cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
		hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
		hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
	},
	css: {
		cmyk: /^cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)$/,
		hsl: /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/,
		hsv: /^hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/,
		lab: /^lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)$/,
		rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
		xyz: /^xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)$/
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
	},
	userInput: {
		hex: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i,
		hsl: /^hsl\(\s*(\d{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/i,
		rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
	},
	validation: {
		hex: /^#[0-9A-Fa-f]{6}$/,
		hexComponent: /^#[0-9a-fA-F]{2}$/
	}
};

export const configData: ConfigDataInterface = { regex, storage } as const;
