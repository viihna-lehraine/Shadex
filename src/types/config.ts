// File: types/config.ts

import { config } from '../config/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sets = config.sets;

// ***********************************************************
/// *********************************************************
//// ******************* 1. DOM INDEX **********************
/// *********************************************************
// ***********************************************************

export interface DOMIndex {
	classes: {
		colorDisplay: string;
		colorInput: string;
		colorInputBtn: string;
		colorInputModal: string;
		colorStripe: string;
		colorSwatch: string;
		dragHandle: string;
		hidden: string;
		lockBtn: string;
		locked: string;
		modal: string;
		modalTrigger: string;
		paletteColumn: string;
		resizeHandle: string;
		tooltipContainer: string;
		tooltipTrigger: string;
	};
	dynamicIDs: { globalTooltipDiv: string };
	ids: {
		btns: {
			desaturate: string;
			export: string;
			generate: string;
			helpMenu: string;
			historyMenu: string;
			import: string;
			saturate: string;
			showAsCMYK: string;
			showAsHex: string;
			showAsHSL: string;
			showAsHSV: string;
			showAsLAB: string;
			showAsRGB: string;
		};
		divs: {
			helpMenu: string;
			historyMenu: string;
			paletteContainer: string;
			paletteHistory: string;
		};
		inputs: {
			columnCount: string;
			limitDarkChkbx: string;
			limitGrayChkbx: string;
			limitLightChkbx: string;
			paletteColumn: string;
			paletteType: string;
		};
	};
}

// ********************************************************
/// ******************************************************
//// **************** 2. DOM CONFIGURARTION *************
/// ******************************************************
// ********************************************************

export interface DOMConfig {
	btnDebounce: number;
	copyButtonTextTimeout: number;
	inputDebounce: number;
	minColumnSize: 5;
	maxColumnSize: 70;
	toastTimer: number;
	tooltipFadeIn: number;
	tooltipFadeOut: number;
}

// ***********************************************************
/// *********************************************************
//// **************** 3. PALETTE CONFIGURARTION *************
/// *********************************************************
// ***********************************************************

export interface ProbabilityProperties {
	values: readonly number[];
	weights: readonly number[];
}

interface PaletteShiftRange {
	hue: number;
	sat: number;
	light: number;
}

export interface PaletteConfig {
	adjustment: {
		slaValue: number;
	};
	probabilities: {
		base: ProbabilityProperties;
		chaotic: ProbabilityProperties;
		soft: ProbabilityProperties;
		strong: ProbabilityProperties;
	};
	shiftRanges: Record<PaletteType, PaletteShiftRange>;
	thresholds: {
		dark: number;
		gray: number;
		light: number;
	};
}

// ****************************************************
/// **************************************************
//// ******************* 4. REGEX *******************
/// **************************************************
// ****************************************************

export interface RegexConfig {
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
	css: {
		cmyk: RegExp;
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
	stackTrace: {
		anon: RegExp;
		chrome: RegExp;
		electron: RegExp;
		fallback: RegExp;
		firefox: RegExp;
		node: RegExp;
		safari: RegExp;
		workers: RegExp;
	};
	userInput: {
		hex: RegExp;
		hsl: RegExp;
		rgb: RegExp;
	};
	validation: {
		hex: RegExp;
		hexComponent: RegExp;
	};
}

export interface EnvData {
	appHistoryLimit: number;
	appPaletteHistoryLimit: number;
	idbRetryDelay: number;
	observerDebounce: number;
	semaphoreMaxLocks: number;
	semaphoreTimeout: number;
}

export interface Configuration {
	env: EnvData;
	math: {
		epsilon: number;
		maxXYZ_X: number;
		maxXYZ_Y: number;
		maxXYZ_Z: number;
		minXYZ_X: number;
		minXYZ_Y: number;
		minXYZ_Z: number;
	};
	mode: {
		debugLevel: 0 | 1 | 2 | 3 | 4 | 5;
		env: 'dev' | 'prod' | 'test';
		exposeClasses: boolean;
		log: {
			debug: boolean;
			error: boolean;
			info: boolean;
			verbosity: 0 | 1 | 2 | 3 | 4 | 5;
			warn: boolean;
		};
		showAlerts: boolean;
		stackTrace: boolean;
	};
	sets: {
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
	};
	storage: {
		idbDBName: string;
		idbDefaultVersion: number;
		idbStoreName: string;
	};
}

export interface Defaults {
	colors: {
		cmyk: CMYK;
		hex: Hex;
		hsl: HSL;
		hsv: HSV;
		lab: LAB;
		rgb: RGB;
		sl: SL;
		sv: SV;
		xyz: XYZ;
		cmykNum: CMYKNumMap;
		hslNum: HSLNumMap;
		hsvNum: HSVNumMap;
		labNum: LABNumMap;
		rgbNum: RGBNumMap;
		slNum: SLNumMap;
		svNum: SVNumMap;
		xyzNum: XYZNumMap;
		cmykString: CMYKStringMap;
		hexString: HexStringMap;
		hslString: HSLStringMap;
		hsvString: HSVStringMap;
		labString: LABStringMap;
		rgbString: RGBStringMap;
		slString: SLStringMap;
		svString: SVStringMap;
		xyzString: XYZStringMap;
		cmykCSS: string;
		hexCSS: string;
		hslCSS: string;
		hsvCSS: string;
		labCSS: string;
		rgbCSS: string;
		slCSS: string;
		svCSS: string;
		xyzCSS: string;
	};
	mutation: MutationLog;
	observerData: DefaultObserverData;
	palette: Palette;
	paletteItem: PaletteItem;
	paletteOptions: SelectedPaletteOptions;
	state: State;
	unbrandedPalette: UnbrandedPalette;
	unbrandedPaletteItem: UnbrandedPaletteItem;
}

export type DefaultObserverData = { count: number; name: string };

export type MathData = Configuration['math'];

export type ModeData = Configuration['mode'];

export type SetsData = Configuration['sets'];

export type StorageData = Configuration['storage'];

// ***************************************************************
/// *************************************************************
//// ******************* 5. SET DECLARATIONS *******************
/// *************************************************************
// ***************************************************************

export type ByteRange = number & { __brand: 'ByteRange' };

export type HexSet = string & { __brand: 'HexSet' };

export type LAB_L = number & { __brand: 'LAB_L' };

export type LAB_A = number & { __brand: 'LAB_A' };

export type LAB_B = number & { __brand: 'LAB_B' };

export type Percentile = number & { __brand: 'Percentile' };

export type Radial = number & { __brand: 'Radial' };

export type XYZ_X = number & { __brand: 'XYZ_X' };

export type XYZ_Y = number & { __brand: 'XYZ_Y' };

export type XYZ_Z = number & { __brand: 'XYZ_Z' };

export type RangeKeyMap = {
	ByteRange: ByteRange;
	HexSet: HexSet;
	LAB_L: LAB_L;
	LAB_A: LAB_A;
	LAB_B: LAB_B;
	Percentile: Percentile;
	Radial: Radial;
	XYZ_X: XYZ_X;
	XYZ_Y: XYZ_Y;
	XYZ_Z: XYZ_Z;
};

export type ColorValueRange = RangeKeyMap[keyof RangeKeyMap];

export type NumericRangeKey = {
	[K in keyof typeof sets]: (typeof sets)[K] extends readonly [number, number]
		? K
		: never;
}[keyof typeof sets & string];

export type NumericBrandedType =
	| ByteRange
	| LAB_A
	| LAB_B
	| LAB_L
	| Percentile
	| Radial
	| XYZ_X
	| XYZ_Y
	| XYZ_Z;

export type Sets = typeof sets;

// *********************************************************
/// *******************************************************
//// ***************** 6. BRANDED COLORS *****************
/// *******************************************************
// *********************************************************

export type CMYK = {
	value: {
		cyan: Percentile;
		magenta: Percentile;
		yellow: Percentile;
		key: Percentile;
	};
	format: 'cmyk';
};

export type Hex = {
	value: { hex: HexSet };
	format: 'hex';
};

export type HSL = {
	value: { hue: Radial; saturation: Percentile; lightness: Percentile };
	format: 'hsl';
};

export type HSV = {
	value: { hue: Radial; saturation: Percentile; value: Percentile };
	format: 'hsv';
};

export type LAB = {
	value: { l: LAB_L; a: LAB_A; b: LAB_B };
	format: 'lab';
};

export type RGB = {
	value: { red: ByteRange; green: ByteRange; blue: ByteRange };
	format: 'rgb';
};

export type SL = {
	value: { saturation: Percentile; lightness: Percentile };
	format: 'sl';
};

export type SV = {
	value: { saturation: Percentile; value: Percentile };
	format: 'sv';
};

export type XYZ = {
	value: { x: XYZ_X; y: XYZ_Y; z: XYZ_Z };
	format: 'xyz';
};

// *********************************************************************
/// *******************************************************************
//// ******** 7. COLORS (UNBRANDED PROPERTIES AS STRINGS) ************
/// *******************************************************************
// *********************************************************************

export type CMYKStringMap = {
	value: { cyan: string; magenta: string; yellow: string; key: string };
	format: 'cmyk';
};

export type HexStringMap = {
	value: { hex: string };
	format: 'hex';
};

export type HSLStringMap = {
	value: { hue: string; saturation: string; lightness: string };
	format: 'hsl';
};

export type HSVStringMap = {
	value: { hue: string; saturation: string; value: string };
	format: 'hsv';
};

export type LABStringMap = {
	value: { l: string; a: string; b: string };
	format: 'lab';
};

export type RGBStringMap = {
	value: { red: string; green: string; blue: string };
	format: 'rgb';
};

export type SLStringMap = {
	value: { saturation: string; lightness: string };
	format: 'sl';
};

export type SVStringMap = {
	value: { saturation: string; value: string };
	format: 'sv';
};

export type XYZStringMap = {
	value: { x: string; y: string; z: string };
	format: 'xyz';
};

// **********************************************************************
/// ********************************************************************
//// ************ 8. COLORS (UNBRANDED NUMERIC PROPERTIES) ************
/// ********************************************************************
// **********************************************************************

export type CMYKNumMap = {
	value: { cyan: number; magenta: number; yellow: number; key: number };
	format: 'cmyk';
};

export type HexNumMap = {
	value: { hex: string };
	format: 'hex';
};

export type HSLNumMap = {
	value: { hue: number; saturation: number; lightness: number };
	format: 'hsl';
};

export type HSVNumMap = {
	value: { hue: number; saturation: number; value: number };
	format: 'hsv';
};

export type LABNumMap = {
	value: { l: number; a: number; b: number };
	format: 'lab';
};

export type RGBNumMap = {
	value: { red: number; green: number; blue: number };
	format: 'rgb';
};

export type SLNumMap = {
	value: { saturation: number; lightness: number };
	format: 'sl';
};

export type SVNumMap = {
	value: { saturation: number; value: number };
	format: 'sv';
};

export type XYZNumMap = {
	value: {
		x: number;
		y: number;
		z: number;
	};
	format: 'xyz';
};

// ***********************************************************************
/// *********************************************************************
//// ************ 9. COMPOSITE COLOR INTERFACES AND TYPES **************
/// *********************************************************************
// ***********************************************************************

export interface AllColors {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	sl: SL;
	sv: SV;
	xyz: XYZ;
}

export type Color = CMYK | Hex | HSL | HSV | LAB | RGB | SL | SV | XYZ;

export interface ColorData {
	cmyk?: CMYK;
	hex?: Hex;
	hsl?: HSL;
	hsv?: HSV;
	lab?: LAB;
	rgb?: RGB;
	xyz?: XYZ;
}

export interface ColorDataAssertion {
	cmyk: CMYK;
	hex: Hex;
	hsl: HSL;
	hsv: HSV;
	lab: LAB;
	rgb: RGB;
	xyz: XYZ;
}

export interface ColorDataExtended extends ColorData {
	sl?: SL;
	sv?: SV;
}

export type ColorFormat =
	| 'cmyk'
	| 'hex'
	| 'hsl'
	| 'hsv'
	| 'lab'
	| 'rgb'
	| 'sl'
	| 'sv'
	| 'xyz';

export type ColorFormatMap = {
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

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb' | 'xyz';

export type ColorSpaceExtended = ColorSpace | 'sl' | 'sv';

export type ColorStringMap =
	| CMYKStringMap
	| HexStringMap
	| HSLStringMap
	| HSVStringMap
	| LABStringMap
	| RGBStringMap
	| SLStringMap
	| SVStringMap
	| XYZStringMap;

export type ColorNumMap =
	| CMYKNumMap
	| HexNumMap
	| HSLNumMap
	| HSVNumMap
	| LABNumMap
	| RGBNumMap
	| SLNumMap
	| SVNumMap
	| XYZNumMap;

// *****************************************************************
/// ***************************************************************
//// ******** 10. OTHER APPLICATION TYPES AND INTERFACES **********
/// ***************************************************************
// *****************************************************************

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}

export type History = State[];

export interface MutationLog {
	timestamp: string;
	key: string;
	action: 'add' | 'delete' | 'update';
	newValue: unknown;
	oldValue: unknown;
	origin: string;
}

export interface Palette {
	id: string;
	items: PaletteItem[];
	metadata: {
		name?: string;
		columnCount: number;
		limitDark: boolean;
		limitGray: boolean;
		limitLight: boolean;
		timestamp: string;
		type: PaletteType;
	};
}

export type PaletteType =
	| 'analogous'
	| 'complementary'
	| 'custom'
	| 'diadic'
	| 'monochromatic'
	| 'hexadic'
	| 'random'
	| 'splitComplementary'
	| 'tetradic'
	| 'triadic';

export interface PaletteItem {
	itemID: number;
	colors: {
		cmyk: CMYK['value'];
		hex: Hex['value'];
		hsl: HSL['value'];
		hsv: HSV['value'];
		lab: LAB['value'];
		rgb: RGB['value'];
		xyz: XYZ['value'];
	};
	css: {
		cmyk: string;
		hex: string;
		hsl: string;
		hsv: string;
		lab: string;
		rgb: string;
		xyz: string;
	};
}

export interface SelectedPaletteOptions {
	columnCount: number;
	distributionType: keyof PaletteConfig['probabilities'];
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
	paletteType: PaletteType;
}

export type AppModeData = 'dev' | 'prod';

export interface State {
	appMode: 'edit' | 'export' | 'preview';
	paletteHistory: Palette[];
	paletteContainer: {
		columns: {
			id: number;
			isLocked: boolean;
			position: number;
			size: number;
		}[];
	};
	preferences: {
		colorSpace: ColorSpace;
		distributionType: keyof PaletteConfig['probabilities'];
		maxHistory: number;
		maxPaletteHistory: number;
		theme: 'light' | 'dark';
	};
	selections: {
		paletteColumnCount: number;
		paletteType: PaletteType;
		targetedColumnPosition: number;
	};
	timestamp: string;
}

export interface UnbrandedPaletteItem {
	itemID: number;
	colors: {
		cmyk: CMYKNumMap['value'];
		hex: HexNumMap['value'];
		hsl: HSLNumMap['value'];
		hsv: HSVNumMap['value'];
		lab: LABNumMap['value'];
		rgb: RGBNumMap['value'];
		xyz: XYZNumMap['value'];
	};
	css: {
		cmyk: string;
		hex: string;
		hsl: string;
		hsv: string;
		lab: string;
		rgb: string;
		xyz: string;
	};
}

export interface UnbrandedPalette {
	id: string;
	items: UnbrandedPaletteItem[];
	metadata: {
		name?: string;
		columnCount: number;
		limitDark: boolean;
		limitGray: boolean;
		limitLight: boolean;
		timestamp: string;
		type: PaletteType;
	};
}

// ******************************************************************
/// ****************************************************************
//// ********************* 11. GENERICS ***************************
/// ****************************************************************
// ******************************************************************

export type Listener<T> = (newValue: T, oldValue: T) => void;

// ***********************************************************
/// *********************************************************
//// ******************* 12. DOM ELEMENTS *******************
/// *********************************************************
// ***********************************************************

export interface UnvalidatedDOMElements {
	btns: {
		desaturate: HTMLButtonElement | null;
		export: HTMLButtonElement | null;
		generate: HTMLButtonElement | null;
		helpMenu: HTMLButtonElement | null;
		historyMenu: HTMLButtonElement | null;
		import: HTMLButtonElement | null;
		saturate: HTMLButtonElement | null;
		showAsCMYK: HTMLButtonElement | null;
		showAsHex: HTMLButtonElement | null;
		showAsHSL: HTMLButtonElement | null;
		showAsHSV: HTMLButtonElement | null;
		showAsLAB: HTMLButtonElement | null;
		showAsRGB: HTMLButtonElement | null;
	};
	divs: {
		helpMenu: HTMLDivElement | null;
		historyMenu: HTMLDivElement | null;
		paletteContainer: HTMLDivElement | null;
		paletteHistory: HTMLDivElement | null;
	};
	inputs: {
		columnCount: HTMLInputElement | null;
		limitDarkChkbx: HTMLInputElement | null;
		limitGrayChkbx: HTMLInputElement | null;
		limitLightChkbx: HTMLInputElement | null;
		paletteColumn: HTMLInputElement | null;
		paletteType: HTMLInputElement | null;
	};
}

export interface DOMElements {
	btns: {
		desaturate: HTMLButtonElement;
		export: HTMLButtonElement;
		generate: HTMLButtonElement;
		helpMenu: HTMLButtonElement;
		historyMenu: HTMLButtonElement;
		import: HTMLButtonElement;
		saturate: HTMLButtonElement;
		showAsCMYK: HTMLButtonElement;
		showAsHex: HTMLButtonElement;
		showAsHSL: HTMLButtonElement;
		showAsHSV: HTMLButtonElement;
		showAsLAB: HTMLButtonElement;
		showAsRGB: HTMLButtonElement;
	};
	divs: {
		helpMenu: HTMLDivElement;
		historyMenu: HTMLDivElement;
		paletteContainer: HTMLDivElement;
		paletteHistory: HTMLDivElement;
	};
	inputs: {
		columnCount: HTMLInputElement;
		limitDarkChkbx: HTMLInputElement;
		limitGrayChkbx: HTMLInputElement;
		limitLightChkbx: HTMLInputElement;
		paletteColumn: HTMLInputElement;
		paletteType: HTMLInputElement;
	};
}
