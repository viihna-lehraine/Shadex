// File: types/data/core.js

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
	SL,
	SL_StringProps,
	SV,
	SV_StringProps,
	RGB,
	RGB_StringProps,
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
} from '../index.js';

export type AppModeData = 'dev' | 'prod';

export interface ConfigDataInterface {
	db: {
		DEFAULT_KEYS: {
			APP_SETTINGS: string;
			CUSTOM_COLOR: string;
		};
		DEFAULT_SETTINGS: {
			colorSpace: ColorSpace;
			lastTableID: number;
			theme: 'light' | 'dark';
			loggingEnabled: boolean;
		};
		STORE_NAMES: {
			APP_SETTINGS: string;
			CUSTOM_COLOR: string;
			MUTATIONS: string;
			PALLETES: string;
			SETTINGS: string;
			TABLES: string;
		};
	};
	regex: {
		colors: {
			cmyk: RegExp;
			hex: RegExp;
			hsl: RegExp;
			hsv: RegExp;
			lab: RegExp;
			rgb: RegExp;
			xyz: RegExp;
		};
		file: {
			palette: { css: { color: RegExp; metadata: RegExp } };
		};
	};
}

export interface ConstsDataInterface {
	adjustments: Record<string, number>;
	debounce: Record<string, number>;
	limits: {
		xyz: {
			max: { x: number; y: number; z: number };
			min: { x: number; y: number; z: number };
		};
	};
	paletteRanges: {
		comp: Record<string, number>;
		diadic: Record<string, number>;
		hexad: Record<string, number>;
		random: Record<string, number>;
		splitComp: Record<string, number>;
		tetra: Record<string, number>;
		triad: Record<string, number>;
	};
	probabilities: {
		values: readonly number[];
		weights: readonly number[];
	};
	thresholds: Record<string, number>;
	timeouts: Record<string, number>;
}

export interface DataSetsInterface {
	AlphaRange: readonly [0, 1];
	ByteRange: readonly [0, 255];
	HexComponent: 'HexComponent';
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
		unbranded: {
			data: UnbrandedPalette;
			item: UnbrandedPaletteItem;
			stored: UnbrandedStoredPalette;
		};
	};
}

export interface DOMDataInterface {
	elements: {
		buttons: Record<string, HTMLButtonElement | null>;
		divs: Record<string, HTMLDivElement | null>;
		spans: Record<string, HTMLSpanElement | null>;
		inputs: Record<string, HTMLInputElement | null>;
		select: Record<string, HTMLSelectElement | null>;
	};
	ids: Record<string, string>;
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
		info: boolean;
		verbosity: 0 | 1 | 2 | 3 | 4 | 5;
		warn: boolean;
	};
	quiet: boolean;
	showAlerts: boolean;
	stackTrace: boolean;
}
