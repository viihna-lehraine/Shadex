// File: src/config/consts/palette.ts

// *DEV-NOTE* IMPLEMENT RANDOM MIN RANGES

const ranges = {
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

export const palette = {
	ranges
} as const;
