// File: types/config.ts

import { sets } from '../config/index.js';

export interface DOMIndex {
	readonly classes: {
		readonly colorDisplay: string;
		readonly colorInput: string;
		readonly colorInputBtn: string;
		readonly colorInputModal: string;
		readonly colorStripe: string;
		readonly colorSwatch: string;
		readonly dragHandle: string;
		readonly hidden: string;
		readonly lockBtn: string;
		readonly locked: string;
		readonly modal: string;
		readonly modalTrigger: string;
		readonly paletteColumn: string;
		readonly resizeHandle: string;
		readonly tooltipContainer: string;
		readonly tooltipTrigger: string;
	};
	readonly dynamicIDs: { globalTooltipDiv: string };
	readonly ids: {
		readonly btns: {
			readonly desaturate: string;
			readonly export: string;
			readonly generate: string;
			readonly helpMenu: string;
			readonly historyMenu: string;
			readonly import: string;
			readonly saturate: string;
			readonly showAsCMYK: string;
			readonly showAsHex: string;
			readonly showAsHSL: string;
			readonly showAsHSV: string;
			readonly showAsLAB: string;
			readonly showAsRGB: string;
		};
		readonly divs: {
			readonly helpMenu: string;
			readonly historyMenu: string;
			readonly paletteContainer: string;
			readonly paletteHistory: string;
		};
		readonly inputs: {
			readonly columnCount: string;
			readonly limitDarkChkbx: string;
			readonly limitGrayChkbx: string;
			readonly limitLightChkbx: string;
			readonly paletteColumn: string;
			readonly paletteType: string;
		};
	};
}

// ********************************************************
/// ******************************************************
//// **************** 2. DOM CONFIGURARTION *************
/// ******************************************************
// ********************************************************

export interface DOMConfig {
	readonly btnDebounce: number;
	readonly copyButtonTextTimeout: number;
	readonly inputDebounce: number;
	readonly minColumnSize: 5;
	readonly maxColumnSize: 70;
	readonly toastTimer: number;
	readonly tooltipFadeIn: number;
	readonly tooltipFadeOut: number;
}

// ***********************************************************
/// *********************************************************
//// **************** 3. PALETTE CONFIGURARTION *************
/// *********************************************************
// ***********************************************************

export interface ProbabilityProperties {
	readonly values: readonly number[];
	readonly weights: readonly number[];
}

interface PaletteShiftRange {
	readonly hue: number;
	readonly sat: number;
	readonly light: number;
}

export interface PaletteConfig {
	readonly adjustment: {
		readonly slaValue: number;
	};
	readonly probabilities: {
		readonly base: ProbabilityProperties;
		readonly chaotic: ProbabilityProperties;
		readonly soft: ProbabilityProperties;
		readonly strong: ProbabilityProperties;
	};
	readonly shiftRanges: Record<PaletteType, PaletteShiftRange>;
	readonly thresholds: {
		readonly dark: number;
		readonly gray: number;
		readonly light: number;
	};
}

// ****************************************************
/// **************************************************
//// ************ 5. ENVIRONMENT DATA ***************
/// **************************************************
// ****************************************************

export interface Environment {
	readonly app: {
		readonly historyLimit: number;
		readonly maxColumns: number;
		readonly paletteHistoryLimit: number;
	};
	readonly idb: {
		readonly maxReadyAttempts: number;
		readonly retryDelay: number;
	};
	readonly mutex: {
		readonly contentionHistoryLimit: number;
		readonly timeout: number;
	};
	readonly state: {
		readonly maxReadyAttempts: number;
		readonly maxSaveRetries: number;
		readonly readyTimeout: number;
		readonly saveThrottleDelay: number;
	};
	readonly timers: {
		readonly columnInitializationDebounce: number;
	};
}

// *******************************************************
/// *****************************************************
//// **************** 6. FEATURE FLAGS *****************
/// *****************************************************
// *******************************************************

export interface FeatureFlags {
	readonly loadStateFromStorage: boolean;
}

// ****************************************************
/// **************************************************
//// ******************* 7. REGEX *******************
/// **************************************************
// ****************************************************

export interface RegexConfig {
	readonly brand: { readonly hex: RegExp };
	readonly colors: {
		readonly cmyk: RegExp;
		readonly hex: RegExp;
		readonly hsl: RegExp;
		readonly hsv: RegExp;
		readonly lab: RegExp;
		readonly rgb: RegExp;
		readonly xyz: RegExp;
	};
	readonly css: {
		readonly cmyk: RegExp;
		readonly hsl: RegExp;
		readonly hsv: RegExp;
		readonly lab: RegExp;
		readonly rgb: RegExp;
		readonly xyz: RegExp;
	};
	readonly dom: {
		readonly hex: RegExp;
		readonly hsl: RegExp;
		readonly rgb: RegExp;
	};
	readonly stackTrace: {
		readonly anon: RegExp;
		readonly chrome: RegExp;
		readonly electron: RegExp;
		readonly fallback: RegExp;
		readonly firefox: RegExp;
		readonly node: RegExp;
		readonly safari: RegExp;
		readonly workers: RegExp;
	};
	readonly userInput: {
		readonly hex: RegExp;
		readonly hsl: RegExp;
		readonly rgb: RegExp;
	};
	readonly validation: {
		readonly hex: RegExp;
		readonly hexComponent: RegExp;
	};
}

export interface Configuration {
	readonly math: {
		readonly epsilon: number;
		readonly maxXYZ_X: number;
		readonly maxXYZ_Y: number;
		readonly maxXYZ_Z: number;
		readonly minXYZ_X: number;
		readonly minXYZ_Y: number;
		readonly minXYZ_Z: number;
	};
	readonly mode: {
		readonly debugLevel: 0 | 1 | 2 | 3 | 4 | 5;
		readonly env: 'dev' | 'prod' | 'test';
		readonly exposeClasses: boolean;
		readonly log: {
			readonly debug: boolean;
			readonly error: boolean;
			readonly info: boolean;
			readonly verbosity: 0 | 1 | 2 | 3 | 4 | 5;
			readonly warn: boolean;
		};
		readonly logExecution: {
			readonly deepClone: boolean;
		};
		readonly showAlerts: boolean;
		readonly stackTrace: boolean;
	};
	readonly storage: {
		readonly idbDBName: string;
		readonly idbDefaultVersion: number;
		readonly idbStoreName: string;
	};
}

export interface Defaults {
	readonly colors: {
		readonly cmyk: CMYK;
		readonly hex: Hex;
		readonly hsl: HSL;
		readonly hsv: HSV;
		readonly lab: LAB;
		readonly rgb: RGB;
		readonly sl: SL;
		readonly sv: SV;
		readonly xyz: XYZ;
		readonly cmykNum: CMYKNumMap;
		readonly hslNum: HSLNumMap;
		readonly hsvNum: HSVNumMap;
		readonly labNum: LABNumMap;
		readonly rgbNum: RGBNumMap;
		readonly slNum: SLNumMap;
		readonly svNum: SVNumMap;
		readonly xyzNum: XYZNumMap;
		readonly cmykString: CMYKStringMap;
		readonly hexString: HexStringMap;
		readonly hslString: HSLStringMap;
		readonly hsvString: HSVStringMap;
		readonly labString: LABStringMap;
		readonly rgbString: RGBStringMap;
		readonly slString: SLStringMap;
		readonly svString: SVStringMap;
		readonly xyzString: XYZStringMap;
		readonly cmykCSS: string;
		readonly hexCSS: string;
		readonly hslCSS: string;
		readonly hsvCSS: string;
		readonly labCSS: string;
		readonly rgbCSS: string;
		readonly slCSS: string;
		readonly svCSS: string;
		readonly xyzCSS: string;
	};
	readonly mutation: MutationLog;
	readonly palette: Palette;
	readonly paletteItem: PaletteItem;
	readonly paletteOptions: SelectedPaletteOptions;
	readonly state: State;
	readonly unbrandedPalette: UnbrandedPalette;
	readonly unbrandedPaletteItem: UnbrandedPaletteItem;
}

export type MathData = Configuration['math'];

export type ModeData = Configuration['mode'];

export interface SetsData {
	readonly ByteRange: readonly [0, 255];
	readonly HexSet: 'HexSet';
	readonly LAB_L: readonly [0, 100];
	readonly LAB_A: readonly [-128, 127];
	readonly LAB_B: readonly [-128, 127];
	readonly Percentile: readonly [0, 100];
	readonly Radial: readonly [0, 360];
	readonly XYZ_X: readonly [number, number];
	readonly XYZ_Y: readonly [number, number];
	readonly XYZ_Z: readonly [number, number];
}

export type StorageData = Configuration['storage'];

// ***************************************************************
/// *************************************************************
//// ******************* 7. SET DECLARATIONS *******************
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
	readonly ByteRange: ByteRange;
	readonly HexSet: HexSet;
	readonly LAB_L: LAB_L;
	readonly LAB_A: LAB_A;
	readonly LAB_B: LAB_B;
	readonly Percentile: Percentile;
	readonly Radial: Radial;
	readonly XYZ_X: XYZ_X;
	readonly XYZ_Y: XYZ_Y;
	readonly XYZ_Z: XYZ_Z;
};

export type ColorValueRange = RangeKeyMap[keyof RangeKeyMap];

export type NumericRangeKey = {
	[K in keyof typeof sets]: (typeof sets)[K] extends [number, number]
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
//// ***************** 8. BRANDED COLORS *****************
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
//// ******** 9. COLORS (UNBRANDED PROPERTIES AS STRINGS) ************
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
//// ************ 10. COLORS (UNBRANDED NUMERIC PROPERTIES) ***********
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
//// ************ 11. COMPOSITE COLOR INTERFACES AND TYPES *************
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
//// ******** 12. OTHER APPLICATION TYPES AND INTERFACES *********
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
	readonly appMode: 'edit' | 'export' | 'preview';
	readonly paletteContainer: {
		readonly columns: {
			readonly id: number;
			readonly isLocked: boolean;
			readonly position: number;
			readonly size: number;
		}[];
	};
	readonly preferences: {
		readonly colorSpace: ColorSpace;
		readonly distributionType: keyof PaletteConfig['probabilities'];
		readonly maxHistory: number;
		readonly maxPaletteHistory: number;
		readonly theme: 'light' | 'dark';
	};
	readonly selections: {
		readonly paletteColumnCount: number;
		readonly paletteType: PaletteType;
		readonly targetedColumnPosition: number;
	};
	readonly timestamp: string;
	readonly [key: string]: unknown;
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
//// ********************* 13. GENERICS ***************************
/// ****************************************************************
// ******************************************************************

// ***********************************************************
/// *********************************************************
//// ******************* 14. DOM ELEMENTS *******************
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
