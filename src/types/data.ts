// File: types/data.js

import { data } from '../data/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sets = data.sets;

// ******** 1. APP CONFIGURATION ********

export type AppModeData = 'dev' | 'prod';

interface PaletteRangeShiftProperties {
	hue: number;
	sat: number;
	light: number;
}

export interface ConfigData {
	adjustments: {
		slaValue: number;
	};
	appLimits: {
		history: number;
		paletteHistory: number;
	};
	colorLimits: {
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
	debounce: {
		btn: number;
		input: number;
	};
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
		userInput: {
			hex: RegExp;
			hsl: RegExp;
			rgb: RegExp;
		};
		validation: {
			hex: RegExp;
			hexComponent: RegExp;
		};
	};
	thresholds: {
		dark: number;
		gray: number;
		light: number;
	};
	timers: {
		copyButtonTextTimeout: number;
		toast: number;
		tooltipFadeIn: number;
		tooltipFadeOut: number;
	};
	ui: {
		minColumnSize: 5;
		maxColumnSize: 70;
	};
}

export interface DefaultData {
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
		strings: {
			cmyk: CMYKStringObject;
			hex: HexStringObject;
			hsl: HSLStringObject;
			hsv: HSVStringObject;
			lab: LABStringObject;
			rgb: RGBStringObject;
			sl: SLStringObject;
			sv: SVStringObject;
			xyz: XYZStringObject;
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
	mutation: MutationLog;
	palette: Palette;
	paletteItem: PaletteItem;
	paletteOptions: SelectedPaletteOptions;
	state: State;
	unbrandedPalette: UnbrandedPalette;
	unbrandedPaletteItem: UnbrandedPaletteItem;
}

export interface DOMClasses {
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
}

export interface DOMDynamicIDs {
	divs: {
		globalTooltip: string;
	};
}

export interface DOM_IDs {
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
}

export interface DOMData {
	classes: DOMClasses;
	dynamicIDs: DOMDynamicIDs;
	ids: DOM_IDs;
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

export interface ModeData {
	debug: boolean;
	debugLevel: 0 | 1 | 2 | 3 | 4 | 5;
	env: 'dev' | 'prod' | 'test';
	exposeToWindow: boolean;
	logging: {
		args: boolean;
		clicks: boolean;
		debug: boolean;
		error: boolean;
		info: boolean;
		verbosity: 0 | 1 | 2 | 3 | 4 | 5;
		warn: boolean;
	};
	showAlerts: boolean;
	stackTrace: boolean;
}

export interface StorageData {
	idb: {
		dbName: string;
		defaultVersion: number;
		storeName: string;
	};
}

export interface DataInterface {
	config: ConfigData;
	defaults: DefaultData;
	dom: DOMData;
	mode: ModeData;
	sets: SetsData;
	storage: StorageData;
}

// ******** 2. SET DECLARATIONS ********

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

export interface SetsData {
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

export type Sets = typeof sets;

// ******** 3. BRANDED COLORS ********

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
	value: {
		hex: HexSet;
	};
	format: 'hex';
};

export type HSL = {
	value: {
		hue: Radial;
		saturation: Percentile;
		lightness: Percentile;
	};
	format: 'hsl';
};

export type HSV = {
	value: {
		hue: Radial;
		saturation: Percentile;
		value: Percentile;
	};
	format: 'hsv';
};

export type LAB = {
	value: {
		l: LAB_L;
		a: LAB_A;
		b: LAB_B;
	};
	format: 'lab';
};

export type RGB = {
	value: {
		red: ByteRange;
		green: ByteRange;
		blue: ByteRange;
	};
	format: 'rgb';
};

export type SL = {
	value: {
		saturation: Percentile;
		lightness: Percentile;
	};
	format: 'sl';
};

export type SV = {
	value: {
		saturation: Percentile;
		value: Percentile;
	};
	format: 'sv';
};

export type XYZ = {
	value: {
		x: XYZ_X;
		y: XYZ_Y;
		z: XYZ_Z;
	};
	format: 'xyz';
};

// ******** 4. COLORS (UNBRANDED PROPERTIES AS STRINGS) ********

export type CMYKStringObject = {
	value: {
		cyan: string;
		magenta: string;
		yellow: string;
		key: string;
	};
	format: 'cmyk';
};

export type HexStringObject = {
	value: {
		hex: string;
	};
	format: 'hex';
};

export type HSLStringObject = {
	value: {
		hue: string;
		saturation: string;
		lightness: string;
	};
	format: 'hsl';
};

export type HSVStringObject = {
	value: {
		hue: string;
		saturation: string;
		value: string;
	};
	format: 'hsv';
};

export type LABStringObject = {
	value: {
		l: string;
		a: string;
		b: string;
	};
	format: 'lab';
};

export type RGBStringObject = {
	value: {
		red: string;
		green: string;
		blue: string;
	};
	format: 'rgb';
};

export type SLStringObject = {
	value: {
		saturation: string;
		lightness: string;
	};
	format: 'sl';
};

export type SVStringObject = {
	value: {
		saturation: string;
		value: string;
	};
	format: 'sv';
};

export type XYZStringObject = {
	value: {
		x: string;
		y: string;
		z: string;
	};
	format: 'xyz';
};

// ******** 5. COLORS (UNBRANDED NUMERIC PROPERTIES) ********

export type UnbrandedCMYK = {
	value: {
		cyan: number;
		magenta: number;
		yellow: number;
		key: number;
	};
	format: 'cmyk';
};

export type UnbrandedHex = {
	value: {
		hex: string;
	};
	format: 'hex';
};

export type UnbrandedHSL = {
	value: {
		hue: number;
		saturation: number;
		lightness: number;
	};
	format: 'hsl';
};

export type UnbrandedHSV = {
	value: {
		hue: number;
		saturation: number;
		value: number;
	};
	format: 'hsv';
};

export type UnbrandedLAB = {
	value: {
		l: number;
		a: number;
		b: number;
	};
	format: 'lab';
};

export type UnbrandedRGB = {
	value: {
		red: number;
		green: number;
		blue: number;
	};
	format: 'rgb';
};

export type UnbrandedSL = {
	value: {
		saturation: number;
		lightness: number;
	};
	format: 'sl';
};

export type UnbrandedSV = {
	value: {
		saturation: number;
		value: number;
	};
	format: 'sv';
};

export type UnbrandedXYZ = {
	value: {
		x: number;
		y: number;
		z: number;
	};
	format: 'xyz';
};

// ******** 6. COMPOSITE COLOR INTERFACES AND TYPES ********

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

export type ColorFormat = keyof ColorSpace | 'sl' | 'sv';

export type ColorSpace = 'cmyk' | 'hex' | 'hsl' | 'hsv' | 'lab' | 'rgb' | 'xyz';

export type ColorSpaceExtended = ColorSpace | 'sl' | 'sv';

export type ColorStringObject =
	| CMYKStringObject
	| HexStringObject
	| HSLStringObject
	| HSVStringObject
	| LABStringObject
	| RGBStringObject
	| SLStringObject
	| SVStringObject
	| XYZStringObject;

export type UnbrandedColor =
	| UnbrandedCMYK
	| UnbrandedHex
	| UnbrandedHSL
	| UnbrandedHSV
	| UnbrandedLAB
	| UnbrandedRGB
	| UnbrandedSL
	| UnbrandedSV
	| UnbrandedXYZ;

// ******** 7. OTHER APPLICATION TYPES AND INTERFACES ********

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
	items: PaletteItem[]; // [ color1, color2, color3, color4 ]
	metadata: {
		name?: string;
		columnCount: number;
		flags: {
			limitDark: boolean;
			limitGray: boolean;
			limitLight: boolean;
		};
		timestamp: string;
		type: PaletteType;
	};
}

export type PaletteType =
	| 'analogous'
	| 'complementary'
	| 'diadic'
	| 'monochromatic'
	| 'hexadic'
	| 'random'
	| 'split-complementary'
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
	distributionType: keyof ConfigData['probabilities'];
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
	paletteType: PaletteType;
}

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
		distributionType: keyof ConfigData['probabilities'];
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
		cmyk: UnbrandedCMYK['value'];
		hex: UnbrandedHex['value'];
		hsl: UnbrandedHSL['value'];
		hsv: UnbrandedHSV['value'];
		lab: UnbrandedLAB['value'];
		rgb: UnbrandedRGB['value'];
		xyz: UnbrandedXYZ['value'];
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
		flags: {
			limitDark: boolean;
			limitGray: boolean;
			limitLight: boolean;
		};
		timestamp: string;
		type: PaletteType;
	};
}

// ******** 8. GENERICS ********

export type Listener<T> = (newValue: T, oldValue: T) => void;
