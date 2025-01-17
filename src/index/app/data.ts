// File: src/index/data.js

import {
	CMYKUnbranded,
	CMYKString,
	HexUnbranded,
	HSLString,
	HSLUnbranded,
	HSVUnbranded,
	HSVString,
	LABString,
	LABUnbranded,
	MutationLog,
	PaletteItemUnbranded,
	PaletteUnbranded,
	SLString,
	SLUnbranded,
	SVString,
	SVUnbranded,
	RGBString,
	RGBUnbranded,
	StoredPaletteUnbranded,
	XYZString,
	XYZUnbranded
} from '../index.js';

export interface AdjustmentsData {
	slaValue: number;
}

export type AppModeData = 'dev' | 'prod';

export interface DebounceData {
	button: number;
	input: number;
}

export interface DefaultBaseColorsData {
	cmyk: CMYKUnbranded;
	hex: HexUnbranded;
	hsl: HSLUnbranded;
	hsv: HSVUnbranded;
	lab: LABUnbranded;
	rgb: RGBUnbranded;
	sl: SLUnbranded;
	sv: SVUnbranded;
	xyz: XYZUnbranded;
}

export interface DefaultColorStringsData {
	cmyk: CMYKString;
	hsl: HSLString;
	hsv: HSVString;
	lab: LABString;
	rgb: RGBString;
	sl: SLString;
	sv: SVString;
	xyz: XYZString;
}

export interface DOMElementData {
	advancedMenu: HTMLDivElement | null;
	advancedMenuButton: HTMLButtonElement | null;
	advancedMenuContent: HTMLDivElement | null;
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	colorBox1: HTMLDivElement | null;
	customColorDisplay: HTMLSpanElement | null;
	customColorInput: HTMLInputElement | null;
	customColorMenu: HTMLDivElement | null;
	customColorMenuButton: HTMLButtonElement | null;
	deleteDatabaseButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	developerMenu: HTMLDivElement | null;
	developerMenuButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	helpMenu: HTMLDivElement | null;
	helpMenuButton: HTMLButtonElement | null;
	helpMenuContent: HTMLDivElement | null;
	historyMenu: HTMLDivElement | null;
	historyMenuButton: HTMLButtonElement | null;
	historyMenuContent: HTMLDivElement | null;
	limitDarknessCheckbox: HTMLInputElement | null;
	limitGraynessCheckbox: HTMLInputElement | null;
	limitLightnessCheckbox: HTMLInputElement | null;
	paletteNumberOptions: HTMLInputElement | null;
	paletteTypeOptions: HTMLSelectElement | null;
	resetDatabaseButton: HTMLButtonElement | null;
	resetPaletteIDButton: HTMLButtonElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColorOption: HTMLSelectElement | null;
	showAsCMYKButton: HTMLButtonElement | null;
	showAsHexButton: HTMLButtonElement | null;
	showAsHSLButton: HTMLButtonElement | null;
	showAsHSVButton: HTMLButtonElement | null;
	showAsLABButton: HTMLButtonElement | null;
	showAsRGBButton: HTMLButtonElement | null;
}

export interface DOM_ID_Data {
	advancedMenu: string;
	advancedMenuButton: string;
	advancedMenuContent: string;
	applyCustomColorButton: string;
	clearCustomColorButton: string;
	colorBox1: string;
	customColorDisplay: string;
	customColorInput: string;
	customColorMenu: string;
	customColorMenuButton: string;
	deleteDatabaseButton: string;
	desaturateButton: string;
	developerMenu: string;
	developerMenuButton: string;
	enableAlphaCheckbox: string;
	generateButton: string;
	helpMenu: string;
	helpMenuButton: string;
	helpMenuContent: string;
	historyMenu: string;
	historyMenuButton: string;
	historyMenuContent: string;
	limitDarknessCheckbox: string;
	limitGraynessCheckbox: string;
	limitLightnessCheckbox: string;
	paletteNumberOptions: string;
	paletteTypeOptions: string;
	resetDatabaseButton: string;
	resetPaletteIDButton: string;
	saturateButton: string;
	selectedColorOption: string;
	showAsCMYKButton: string;
	showAsHexButton: string;
	showAsHSLButton: string;
	showAsHSVButton: string;
	showAsLABButton: string;
	showAsRGBButton: string;
}

export interface LimitsData {
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
}

export interface ModeData {
	debug: boolean;
	debugLevel: 0 | 1 | 2 | 3 | 4 | 5;
	environment: 'dev' | 'prod' | 'test';
	expose: {
		idbManager: boolean;
		appLogger: boolean;
	};
	gracefulErrors: boolean;
	logging: {
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
}

export interface PaletteRangesData {
	comp: {
		hueShift: number;
		lightShift: null;
		satShift: null;
	};
	diadic: {
		hueShift: number;
		lightShift: number;
		satShift: number;
	};
	hexad: {
		hueShift: null;
		lightShift: number;
		satShift: number;
	};
	random: {
		hueShift: null;
		lightShift: null;
		satShift: null;
	};
	splitComp: {
		hueShift: number;
		lightShift: number;
		satShift: number;
	};
	tetra: {
		hueShift: null;
		lightShift: number;
		satShift: number;
	};
	triad: {
		hueShift: null;
		lightShift: number;
		satShift: number;
	};
}

export interface ProbabilitiesData {
	values: number[];
	weights: number[];
}

export interface SetsData {
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

export interface ThresholdsData {
	dark: number;
	gray: number;
	light: number;
}

export interface TimeoutsData {
	copyButtonText: number;
	toast: number;
	tooltip: number;
}

// ******** INNER BUNDLE INTERFACES ********

export interface DOMData {
	elements: DOMElementData;
	ids: DOM_ID_Data;
}

// ******** BUNDLE INTERFACES ********

export interface ConstsData {
	adjustments: AdjustmentsData;
	debounce: DebounceData;
	dom: DOMData;
	limits: LimitsData;
	paletteRanges: PaletteRangesData;
	probabilities: ProbabilitiesData;
	thresholds: ThresholdsData;
	timeouts: TimeoutsData;
}

export interface DefaultColorsData {
	cmyk: CMYKUnbranded;
	hex: HexUnbranded;
	hsl: HSLUnbranded;
	hsv: HSVUnbranded;
	lab: LABUnbranded;
	rgb: RGBUnbranded;
	sl: SLUnbranded;
	sv: SVUnbranded;
	xyz: XYZUnbranded;
	strings: DefaultColorStringsData;
}

export interface Defaults {
	colors: DefaultBaseColorsData;
	colorStrings: DefaultColorStringsData;
	idb: IDBDefaultsData;
	palette: PaletteDefaultsData;
}

export interface IDBDefaultsData {
	mutation: MutationLog;
}

export interface PaletteDefaultsData {
	unbrandedData: PaletteUnbranded;
	unbrandedItem: PaletteItemUnbranded;
	unbrandedStored: StoredPaletteUnbranded;
}

// ******** FINAL BUNDLE ********

export interface DataInterface {
	consts: ConstsData;
	defaults: Defaults;
	idb: Readonly<{
		DEFAULT_KEYS: Readonly<Record<string, string>>;
		STORE_NAMES: Readonly<Record<string, string>>;
	}>;
	mode: ModeData;
	sets: SetsData;
}
