// File: src/types/app/data.js

import {
	CMYK,
	CMYKUnbranded,
	CMYKString,
	ColorSpace,
	Hex,
	HexString,
	HexUnbranded,
	HSL,
	HSLString,
	HSLUnbranded,
	HSV,
	HSVUnbranded,
	HSVString,
	LAB,
	LABString,
	LABUnbranded,
	MutationLog,
	Palette,
	PaletteItem,
	PaletteItemUnbranded,
	PaletteUnbranded,
	SL,
	SLString,
	SLUnbranded,
	StoredPalette,
	SV,
	SVString,
	SVUnbranded,
	RGB,
	RGBString,
	RGBUnbranded,
	StoredPaletteUnbranded,
	XYZ,
	XYZString,
	XYZUnbranded
} from '../index.js';

export type AppModeData = 'dev' | 'prod';

export interface DataInterface {
	config: {
		db: {
			DEFAULT_KEYS: Record<string, string>;
			DEFAULT_SETTINGS: {
				colorSpace: ColorSpace;
				lastTableID: number;
				theme: 'light' | 'dark';
				loggingEnabled: boolean;
			};
			STORE_NAMES: Record<string, string>;
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
	};
	consts: {
		adjustments: Record<string, number>;
		debounce: Record<string, number>;
		dom: {
			elements: {
				buttons: Record<string, HTMLButtonElement | null>;
				divs: Record<string, HTMLDivElement | null>;
				spans: Record<string, HTMLSpanElement | null>;
				inputs: Record<string, HTMLInputElement | null>;
				select: Record<string, HTMLSelectElement | null>;
			};
			ids: Record<string, string>;
		};
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
		probabilities: Record<string, number[]>;
		thresholds: Record<string, number>;
		timeouts: Record<string, number>;
	};
	defaults: {
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
					cmyk: CMYKUnbranded;
					hex: HexUnbranded;
					hsl: HSLUnbranded;
					hsv: HSVUnbranded;
					lab: LABUnbranded;
					rgb: RGBUnbranded;
					sl: SLUnbranded;
					sv: SVUnbranded;
					xyz: XYZUnbranded;
				};
			};
			strings: {
				cmyk: CMYKString;
				hex: HexString;
				hsl: HSLString;
				hsv: HSVString;
				lab: LABString;
				rgb: RGBString;
				sl: SLString;
				sv: SVString;
				xyz: XYZString;
			};
			cssColorStrings: {
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
			data: Palette;
			item: PaletteItem;
			stored: StoredPalette;
			unbranded: {
				data: PaletteUnbranded;
				item: PaletteItemUnbranded;
				stored: StoredPaletteUnbranded;
			};
		};
	};
	idb: Readonly<{
		DEFAULT_KEYS: Readonly<Record<string, string>>;
		STORE_NAMES: Readonly<Record<string, string>>;
	}>;
	mode: {
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
			errors: boolean;
			info: boolean;
			verbosity: 0 | 1 | 2 | 3 | 4 | 5;
			warnings: boolean;
		};
		quiet: boolean;
		showAlerts: boolean;
		stackTrace: boolean;
	};
	sets: {
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
	};
}
