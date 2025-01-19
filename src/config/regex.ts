// File: src/config/regex.ts

import { ConfigRegexInterface } from '../index/index.js';

export const regex: ConfigRegexInterface = {
	colors: {
		cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
		hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
		hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
		lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
		xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
	},
	file: {
		palette: {
			css: {
				header: /\/\* CSS Palette File ID:\s*(.+?)\s*\*\//,
				class: /\.color-(\d+)/,
				colorProperty: /(\w+-color):\s*(.+);/,
				settings: {
					enableAlpha: /\/\* EnableAlpha Value: (\w+) \*\//i,
					limitDarkness: /\/\* LimitDarkness Value: (\w+) \*\//i,
					limitGrayness: /\/\* LimitGrayness Value: (\w+) \*\//i,
					limitLightness: /\/\* LimitLightness Value: (\w+) \*\//i
				}
			}
		}
	}
};
