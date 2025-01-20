// File: src/data/consts/base.js

import {
	AdjustmentsData,
	DebounceData,
	LimitsData,
	PaletteRangesData,
	ProbabilitiesData,
	ThresholdsData,
	TimeoutsData
} from '../../types/index.js';

export const adjustments: AdjustmentsData = {
	slaValue: 10
} as const;

export const debounce: DebounceData = {
	button: 300,
	input: 200
} as const;

export const limits: LimitsData = {
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

export const paletteRanges: PaletteRangesData = {
	comp: {
		hueShift: 10,
		lightShift: null,
		satShift: null
	},
	diadic: {
		hueShift: 30,
		lightShift: 30,
		satShift: 30
	},
	hexad: {
		hueShift: null,
		lightShift: 30,
		satShift: 30
	},
	random: {
		hueShift: null,
		lightShift: null,
		satShift: null
	},
	splitComp: {
		hueShift: 30,
		lightShift: 30,
		satShift: 30
	},
	tetra: {
		hueShift: null,
		lightShift: 30,
		satShift: 30
	},
	triad: {
		hueShift: null,
		lightShift: 30,
		satShift: 30
	}
};

export const probabilities: ProbabilitiesData = {
	values: [40, 45, 50, 55, 60, 65, 70],
	weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
} as const;

export const thresholds: ThresholdsData = {
	dark: 25,
	gray: 20,
	light: 75
} as const;

export const timeouts: TimeoutsData = {
	copyButtonText: 1000,
	toast: 3000,
	tooltip: 1000
} as const;
