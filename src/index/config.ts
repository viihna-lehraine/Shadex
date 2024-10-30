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
	cmykBrightnessThreshold: number;
	cmykDarknessThreshold: number;
	cmykGrayThreshold: number;
	hslBrightnessThreshold: number;
	hslDarknessThreshold: number;
	hslGrayThreshold: number;
	hsvBrightnessValueThreshold: number;
	hsvBrightnessSaturationThreshold: number;
	hsvDarknessThreshold: number;
	hsvGrayThreshold: number;
	labBrightnessThreshold: number;
	labDarknessThreshold: number;
	labGrayThreshold: number;
	rgbMaxBrightness: number;
	rgbMinBrightness: number;
	rgbGrayThreshold: number;
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
	PaletteShiftRanges &
	ProbabilityConstants &
	Thresholds &
	Timeouts;
