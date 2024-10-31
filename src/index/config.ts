import * as colors from './colors';
import * as idb from './idb';
import * as palette from './palette';

export interface Adjustments {
	adjustSLAmount: number;
}

export interface Boundaries {
	xyzMaxX: number;
	xyzMaxY: number;
	xyzMaxZ: number;
	xyzMinX: number;
	xyzMinY: number;
	xyzMinZ: number;
}

export interface Debounce {
	buttonDebounce: number;
	inputDebounce: number;
}

export interface DOMElements {
	advancedMenuToggleButton: HTMLButtonElement | null;
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	customColorElement: HTMLInputElement | null;
	customColorToggleButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	limitBrightCheckbox: HTMLInputElement | null;
	limitDarkCheckbox: HTMLInputElement | null;
	limitGrayCheckbox: HTMLInputElement | null;
	paletteNumberOptions: HTMLInputElement | null;
	paletteTypeOptions: HTMLSelectElement | null;
	popupDivButton: HTMLButtonElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColorOptions: HTMLSelectElement | null;
}

export interface Defaults {
	cmyk: colors.CMYK;
	cmykString: colors.CMYKString;
	hex: colors.Hex;
	hsl: colors.HSL;
	hslString: colors.HSLString;
	hsv: colors.HSV;
	hsvString: colors.HSVString;
	lab: colors.LAB;
	mutation: idb.MutationLog;
	paletteData: palette.Palette;
	paletteItem: palette.PaletteItem;
	rgb: colors.RGB;
	settings: idb.Settings;
	sl: colors.SL;
	slString: colors.SLString;
	storedPalette: idb.StoredPalette;
	sv: colors.SV;
	svString: colors.SVString;
	xyz: colors.XYZ;
}

export interface Flags {
	enableAlpha: boolean;
}

export interface PaletteShiftRanges {
	complementaryHueShiftRange: number;
	diadicLightnessShiftRange: number;
	diadicSaturationShiftRange: number;
	hexadicLightnessShiftRange: number;
	hexadicSaturationShiftRange: number;
	splitComplementaryLightnessShiftRange: number;
	splitComplementarySaturationShiftRange: number;
	tetradicLightnessShiftRange: number;
	tetradicSaturationShiftRange: number;
	triadicLightnessShiftRange: number;
	triadicSaturationShiftRange: number;
}

export interface ProbabilityConstants {
	probabilities: number[];
	weights: number[];
}

export interface Thresholds {
	brightnessThreshold: number;
	darknessThreshold: number;
	grayThreshold: number;
}

export interface Timeouts {
	copyButtonTextTimeout: number;
	toastTimeout: number;
	tooltipTimeout: number;
}

// ***** Composite Object *****

export type Config = Adjustments &
	Boundaries &
	Debounce &
	DOMElements &
	PaletteShiftRanges &
	ProbabilityConstants &
	Thresholds &
	Timeouts;
