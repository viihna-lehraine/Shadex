// File: data/consts.js

import { ConstsDataInterface } from '../types/index.js';

const adjustments: ConstsDataInterface['adjustments'] = {
	slaValue: 10
} as const;

const appLimits: ConstsDataInterface['appLimits'] = {
	history: 100,
	paletteHistory: 20
} as const;

const debounce: ConstsDataInterface['debounce'] = {
	btn: 300,
	input: 200
} as const;

const colorLimits: ConstsDataInterface['colorLimits'] = {
	xyz: {
		max: {
			x: 95.047,
			y: 100,
			z: 108.883
		},
		min: {
			x: 0,
			y: 0,
			z: 0
		}
	}
} as const;

const paletteRanges: ConstsDataInterface['paletteRanges'] = {
	shift: {
		comp: { hue: 10, sat: 0, light: 0 },
		diadic: { hue: 30, sat: 30, light: 30 },
		hexad: { hue: 0, sat: 30, light: 30 },
		random: { hue: 0, sat: 0, light: 0 },
		splitComp: { hue: 30, sat: 30, light: 30 },
		tetra: { hue: 0, sat: 30, light: 30 },
		triad: { hue: 0, sat: 30, light: 30 }
	}
};

const probabilities: ConstsDataInterface['probabilities'] = {
	base: {
		values: [40, 45, 50, 55, 60, 65, 70],
		weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
	},
	chaotic: {
		values: [20, 25, 30, 35, 40],
		weights: [0.1, 0.15, 0.3, 0.25, 0.2]
		// big gaps possible, but favoring mid-range (45°-60°)
		// occasional extreme shifts (120°-150°)
		// useful for abstract or experimental palettes.
	},
	soft: {
		values: [20, 25, 30, 35, 40],
		weights: [0.2, 0.25, 0.3, 0.15, 0.1]
		// most common variations: 30°
		// rare to see anything above 40°
		// creates gentle color differences.
	},
	strong: {
		values: [20, 25, 30, 35, 40],
		weights: [0.1, 0.15, 0.3, 0.25, 0.2]
		// most common variation: 60°
		// rare to see shifts beyond 80°
		// feels bolder but still maintains balance.
	}
} as const;

const thresholds: ConstsDataInterface['thresholds'] = {
	dark: 25,
	gray: 20,
	light: 75
} as const;

const timeouts: ConstsDataInterface['timeouts'] = {
	copyButtonText: 1000,
	toast: 3000,
	tooltip: 1000
} as const;

export const constsData: ConstsDataInterface = {
	adjustments,
	appLimits,
	colorLimits,
	debounce,
	paletteRanges,
	probabilities,
	thresholds,
	timeouts
} as const;
