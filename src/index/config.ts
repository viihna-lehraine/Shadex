import * as colors from './colors';
import * as idb from './database';
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
	applyCustomColorButton: HTMLButtonElement | null;
	clearCustomColorButton: HTMLButtonElement | null;
	closeHelpMenuButton: HTMLButtonElement | null;
	closeHistoryMenuButton: HTMLButtonElement | null;
	closeSubMenuAButton: HTMLButtonElement | null;
	closeSubMenuBButton: HTMLButtonElement | null;
	customColorElement: HTMLInputElement | null;
	customColorToggleButton: HTMLButtonElement | null;
	desaturateButton: HTMLButtonElement | null;
	enableAlphaCheckbox: HTMLInputElement | null;
	generateButton: HTMLButtonElement | null;
	helpMenu: HTMLDivElement | null;
	historyMenu: HTMLDivElement | null;
	limitBrightCheckbox: HTMLInputElement | null;
	limitDarkCheckbox: HTMLInputElement | null;
	limitGrayCheckbox: HTMLInputElement | null;
	paletteNumberOptions: HTMLInputElement | null;
	paletteTypeOptions: HTMLSelectElement | null;
	popupDivButton: HTMLButtonElement | null;
	saturateButton: HTMLButtonElement | null;
	selectedColorOptions: HTMLSelectElement | null;
	showAsCMYKButton: HTMLButtonElement | null;
	showAsHexButton: HTMLButtonElement | null;
	showAsHSLButton: HTMLButtonElement | null;
	showAsHSVButton: HTMLButtonElement | null;
	showAsLABButton: HTMLButtonElement | null;
	showAsRGBButton: HTMLButtonElement | null;
	showHelpMenuButton: HTMLButtonElement | null;
	showHistoryMenuButton: HTMLButtonElement | null;
	subMenuA: HTMLDivElement | null;
	subMenuB: HTMLDivElement | null;
	subMenuToggleButtonA: HTMLButtonElement | null;
	subMenuToggleButtonB: HTMLButtonElement | null;
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
	labString: colors.LABString;
	mutation: idb.MutationLog;
	paletteData: palette.Palette;
	paletteItem: palette.PaletteItem;
	rgb: colors.RGB;
	rgbString: colors.RGBString;
	settings: idb.Settings;
	sl: colors.SL;
	slString: colors.SLString;
	storedPalette: idb.StoredPalette;
	sv: colors.SV;
	svString: colors.SVString;
	xyz: colors.XYZ;
	xyzString: colors.XYZString;
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
