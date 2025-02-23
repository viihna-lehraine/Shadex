// File: config/partials/paletteConfig.ts

import { PaletteConfig } from '../../types/index.js';

export const paletteConfig: PaletteConfig = {
	adjustment: { slaValue: 10 },
	probabilities: {
		base: {
			values: [40, 45, 50, 55, 60, 65, 70],
			weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
		},
		chaotic: {
			values: [20, 25, 30, 35, 40],
			weights: [0.1, 0.15, 0.3, 0.25, 0.2]
		},
		soft: {
			values: [20, 25, 30, 35, 40],
			weights: [0.2, 0.25, 0.3, 0.15, 0.1]
		},
		strong: {
			values: [20, 25, 30, 35, 40],
			weights: [0.1, 0.15, 0.3, 0.25, 0.2]
		}
	},
	shiftRanges: {
		analogous: { hue: 30, sat: 30, light: 30 },
		complementary: { hue: 10, sat: 0, light: 0 },
		custom: { hue: 0, sat: 0, light: 0 },
		diadic: { hue: 30, sat: 30, light: 30 },
		hexadic: { hue: 0, sat: 30, light: 30 },
		monochromatic: { hue: 0, sat: 0, light: 10 },
		random: { hue: 0, sat: 0, light: 0 },
		splitComplementary: { hue: 30, sat: 30, light: 30 },
		tetradic: { hue: 0, sat: 30, light: 30 },
		triadic: { hue: 0, sat: 30, light: 30 }
	},
	thresholds: { dark: 25, gray: 20, light: 75 }
};
