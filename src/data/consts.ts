// File: data/consts.js

import { ConstsDataInterface } from '../types/index.js';

const adjustments = { slaValue: 10 };

const debounce = { button: 300, input: 200 };

const limits = {
	xyz: { max: { x: 95.047, y: 100, z: 108.883 }, min: { x: 0, y: 0, z: 0 } }
};

const paletteRanges = {
	comp: { hueShift: 10, lightShift: 0, satShift: 0 },
	diadic: { hueShift: 30, lightShift: 30, satShift: 30 },
	hexad: { hueShift: 0, lightShift: 30, satShift: 30 },
	random: { hueShift: 0, lightShift: 0, satShift: 0 },
	splitComp: { hueShift: 30, lightShift: 30, satShift: 30 },
	tetra: { hueShift: 0, lightShift: 30, satShift: 30 },
	triad: { hueShift: 0, lightShift: 30, satShift: 30 }
};

const probabilities = {
	values: [40, 45, 50, 55, 60, 65, 70],
	weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
};

const thresholds = { dark: 25, gray: 20, light: 75 };

const timeouts = { copyButtonText: 1000, toast: 3000, tooltip: 1000 };

export const constsData: ConstsDataInterface = {
	adjustments,
	debounce,
	limits,
	paletteRanges,
	probabilities,
	thresholds,
	timeouts
} as const;
