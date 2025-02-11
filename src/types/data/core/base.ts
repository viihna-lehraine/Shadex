// File: types/data/core/base.js

import {
	CMYK,
	CMYK_StringProps,
	ColorSpace,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	MutationLog,
	Palette,
	PaletteItem,
	PaletteOptions,
	SL,
	SL_StringProps,
	SV,
	SV_StringProps,
	RGB,
	RGB_StringProps,
	StoredPalette,
	UnbrandedCMYK,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedSL,
	UnbrandedSV,
	UnbrandedRGB,
	UnbrandedPalette,
	UnbrandedPaletteItem,
	UnbrandedStoredPalette,
	UnbrandedXYZ,
	XYZ,
	XYZ_StringProps
} from '../../index.js';

export type AppModeData = 'dev' | 'prod';

export interface ConfigDataInterface {
	regex: {
		brand: {
			hex: RegExp;
		};
		colors: {
			cmyk: RegExp;
			hex: RegExp;
			hsl: RegExp;
			hsv: RegExp;
			lab: RegExp;
			rgb: RegExp;
			xyz: RegExp;
		};
		dom: {
			hex: RegExp;
			hsl: RegExp;
			rgb: RegExp;
		};
		file: {
			palette: {
				css: {
					color: RegExp;
					metadata: RegExp;
				};
			};
		};
		validation: {
			hex: RegExp;
			hexComponent: RegExp;
		};
	};
	storage: {
		DEFAULT_KEYS: {
			SETTINGS: string;
		};
		DEFAULT_SETTINGS: {
			colorSpace: ColorSpace;
			lastPaletteID: number;
			theme: 'light' | 'dark';
			loggingEnabled: boolean;
		};
	};
}

interface PaletteRangeShiftProperties {
	hue: number;
	sat: number;
	light: number;
}

export interface ConstsDataInterface {
	adjustments: {
		slaValue: number;
	};
	debounce: {
		btn: number;
		input: number;
	};
	limits: {
		xyz: {
			max: {
				x: number;
				y: number;
				z: number;
			};
			min: {
				x: number;
				y: number;
				z: number;
			};
		};
	};
	maxHistory: number;
	paletteRanges: {
		shift: {
			comp: PaletteRangeShiftProperties;
			diadic: PaletteRangeShiftProperties;
			hexad: PaletteRangeShiftProperties;
			random: PaletteRangeShiftProperties;
			splitComp: PaletteRangeShiftProperties;
			tetra: PaletteRangeShiftProperties;
			triad: PaletteRangeShiftProperties;
		};
	};
	probabilities: {
		base: {
			values: readonly number[];
			weights: readonly number[];
		};
		chaotic: {
			values: readonly number[];
			weights: readonly number[];
		};
		soft: {
			values: readonly number[];
			weights: readonly number[];
		};
		strong: {
			values: readonly number[];
			weights: readonly number[];
		};
	};
	thresholds: {
		dark: number;
		gray: number;
		light: number;
	};
	timeouts: {
		copyButtonText: number;
		toast: number;
		tooltip: number;
	};
}

export interface DataSetsInterface {
	ByteRange: readonly [0, 255];
	HexSet: 'HexSet';
	LAB_L: readonly [0, 100];
	LAB_A: readonly [-128, 127];
	LAB_B: readonly [-128, 127];
	Percentile: readonly [0, 100];
	Radial: readonly [0, 360];
	XYZ_X: readonly [number, number];
	XYZ_Y: readonly [number, number];
	XYZ_Z: readonly [number, number];
}

export interface DefaultDataInterface {
	colors: {
		base: {
			branded: {
				cmyk: CMYK;
				hex: Hex;
				hsl: HSL;
				hsv: HSV;
				lab: LAB;
				rgb: RGB;
				sl: SL;
				sv: SV;
				xyz: XYZ;
			};
			unbranded: {
				cmyk: UnbrandedCMYK;
				hex: UnbrandedHex;
				hsl: UnbrandedHSL;
				hsv: UnbrandedHSV;
				lab: UnbrandedLAB;
				rgb: UnbrandedRGB;
				sl: UnbrandedSL;
				sv: UnbrandedSV;
				xyz: UnbrandedXYZ;
			};
		};
		strings: {
			cmyk: CMYK_StringProps;
			hex: Hex_StringProps;
			hsl: HSL_StringProps;
			hsv: HSV_StringProps;
			lab: LAB_StringProps;
			rgb: RGB_StringProps;
			sl: SL_StringProps;
			sv: SV_StringProps;
			xyz: XYZ_StringProps;
		};
		css: {
			cmyk: string;
			hex: string;
			hsl: string;
			hsv: string;
			lab: string;
			rgb: string;
			sl: string;
			sv: string;
			xyz: string;
		};
	};
	idb: {
		mutation: MutationLog;
	};
	palette: {
		branded: {
			data: Palette;
			item: PaletteItem;
			stored: StoredPalette;
		};
		unbranded: {
			data: UnbrandedPalette;
			item: UnbrandedPaletteItem;
			stored: UnbrandedStoredPalette;
		};
	};
	paletteOptions: PaletteOptions;
}

export interface ModeDataInterface {
	debug: boolean;
	debugLevel: 0 | 1 | 2 | 3 | 4 | 5;
	environment: 'dev' | 'prod' | 'test';
	expose: {
		idbManager: boolean;
		logger: boolean;
		uiManager: boolean;
	};
	gracefulErrors: boolean;
	logging: {
		args: boolean;
		clicks: boolean;
		debug: boolean;
		error: boolean;
		verbosity: 0 | 1 | 2 | 3 | 4 | 5;
		warn: boolean;
	};
	showAlerts: boolean;
	stackTrace: boolean;
}

export interface StorageDataInterface {
	HISTORY_KEY: string;
	MUTATIONS_KEY: string;
}
