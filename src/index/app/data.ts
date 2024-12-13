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
	Settings,
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
	advancedMenuButton: HTMLButtonElement | null;
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	closeAdvancedMenuButton: HTMLButtonElement | null;
	closeCustomColorMenuButton: HTMLButtonElement | null;
	closeHelpMenuButton: HTMLButtonElement | null;
	closeHistoryMenuButton: HTMLButtonElement | null;
	customColorElement: HTMLInputElement | null;
	customColorMenuButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	helpMenuButton: HTMLButtonElement | null;
	historyMenuButton: HTMLButtonElement | null;
	limitDarknessCheckbox: HTMLInputElement | null;
	limitGraynessCheckbox: HTMLInputElement | null;
	limitLightnessCheckbox: HTMLInputElement | null;
	paletteNumberOptions: HTMLInputElement | null;
	paletteTypeOptions: HTMLSelectElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColorOption: HTMLSelectElement | null;
	showAsCMYKButton: HTMLButtonElement | null;
	showAsHexButton: HTMLButtonElement | null;
	showAsHSLButton: HTMLButtonElement | null;
	showAsHSVButton: HTMLButtonElement | null;
	showAsLABButton: HTMLButtonElement | null;
	showAsRGBButton: HTMLButtonElement | null;
}

export type DOMFilesData = readonly [
	'./html/advanced-menu.html',
	'./html/custom-color-menu.html',
	'./html/help-menu.html',
	'./html/history-menu.html'
];

export interface DOM_ID_Data {
	advancedMenuButton: string;
	applyCustomColorButton: string;
	clearCustomColorButton: string;
	closeAdvancedMenuButton: string;
	closeCustomColorMenuButton: string;
	closeHelpMenuButton: string;
	closeHistoryMenuButton: string;
	customColorElement: string;
	customColorMenuButton: string;
	desaturateButton: string;
	enableAlphaCheckbox: string;
	generateButton: string;
	helpMenuButton: string;
	historyMenuButton: string;
	limitDarknessCheckbox: string;
	limitGraynessCheckbox: string;
	limitLightnessCheckbox: string;
	paletteNumberOptions: string;
	paletteTypeOptions: string;
	saturateButton: string;
	selectedColorOption: string;
	showAsCMYKButton: string;
	showAsHexButton: string;
	showAsHSLButton: string;
	showAsHSVButton: string;
	showAsLABButton: string;
	showAsRGBButton: string;
}

export interface IDB_DEFAULT_KEYS_Data {
	APP_SETTINGS: string;
	CUSTOM_COLOR: string;
}

export interface IDB_STORE_NAMES_Data {
	CUSTOM_COLOR: string;
	MUTATIONS: string;
	PALLETES: string;
	SETTINGS: string;
	TABLES: string;
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
	errorLogs: boolean;
	gracefulErrors: boolean;
	infoLogs: boolean;
	quiet: boolean;
	verbose: boolean;
	warnLogs: boolean;
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
	files: DOMFilesData;
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

export interface IDBData {
	DEFAULT_KEYS: IDB_DEFAULT_KEYS_Data;
	STORE_NAMES: IDB_STORE_NAMES_Data;
}

export interface IDBDefaultsData {
	settings: Settings;
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
	idb: IDBData;
	mode: ModeData;
	sets: SetsData;
}
