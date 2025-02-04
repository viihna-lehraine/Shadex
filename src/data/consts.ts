// File: data/consts.js

import { ConstsDataInterface } from '../types/index.js';

const adjustments: ConstsDataInterface['adjustments'] = {
	slaValue: 10
};

const debounce: ConstsDataInterface['debounce'] = {
	btn: 300,
	input: 200
};

const limits: ConstsDataInterface['limits'] = {
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
};

const maxHistory: ConstsDataInterface['maxHistory'] = 10;

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
	values: [40, 45, 50, 55, 60, 65, 70],
	weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
};

const thresholds: ConstsDataInterface['thresholds'] = {
	dark: 25,
	gray: 20,
	light: 75
};

const timeouts: ConstsDataInterface['timeouts'] = {
	copyButtonText: 1000,
	toast: 3000,
	tooltip: 1000
};

export const constsData: ConstsDataInterface = {
	adjustments,
	debounce,
	limits,
	maxHistory,
	paletteRanges,
	probabilities,
	thresholds,
	timeouts
} as const;
