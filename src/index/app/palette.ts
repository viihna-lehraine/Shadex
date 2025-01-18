// File: src/index/app/palette.js

import {
	ColorSpace,
	HSL,
	Palette,
	PaletteItem,
	PaletteOptions
} from '../index.js';

// ******** SORT ME ********

export interface PaletteDeserializeFnInterface {
	fromCSS(data: string): Palette | void;
	fromJSON(data: string): Palette | void;
	fromXML(data: string): Palette | void;
}

export interface PaletteSerializeFnInterface {
	toCSS(palette: Palette, colorSpace: ColorSpace): string;
	toJSON(palette: Palette): string;
	toXML(palette: Palette): string;
}

export interface PaletteFnIOInterface {
	deserialize: PaletteDeserializeFnInterface;
	serialize: PaletteSerializeFnInterface;
}

// ******** COMMON UTILITIES ********

export interface PaletteCommon_Helpers_Limits {
	isColorInBounds(hsl: HSL): boolean;
	isTooDark(hsl: HSL): boolean;
	isTooGray(hsl: HSL): boolean;
	isTooLight(hsl: HSL): boolean;
}

export interface PaletteCommon_Helpers_Update {
	colorBox(color: HSL, index: number): void;
}

export interface PaletteCommon_SuperUtils_Create {
	baseColor(customColor: HSL | null, enableAlpha: boolean): HSL;
	paletteItem(color: HSL, enableAlpha: boolean): Promise<PaletteItem>;
	paletteItemArray(
		baseColor: HSL,
		hues: number[],
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<PaletteItem[]>;
}

export interface PaletteCommon_SuperUtils_GenHues {
	analogous(color: HSL, numBoxes: number): number[];
	diadic(baseHue: number): number[];
	hexadic(color: HSL): number[];
	splitComplementary(baseHue: number): number[];
	tetradic(baseHue: number): number[];
	triadic(baseHue: number): number[];
}

export interface PaletteCommon_Utils_Adjust {
	sl(color: HSL): HSL;
}

export interface PaletteCommon_Utils_Probability {
	getWeightedRandomInterval(): number;
}

// ******** HELPERS, UTILS, SUPERUTILS BUNDLES ********

export interface PaletteCommon_Helpers {
	limits: PaletteCommon_Helpers_Limits;
	update: PaletteCommon_Helpers_Update;
}

export interface PaletteCommon_SuperUtils {
	create: PaletteCommon_SuperUtils_Create;
	genHues: PaletteCommon_SuperUtils_GenHues;
}

export interface PaletteCommon_Utils {
	adjust: PaletteCommon_Utils_Adjust;
	probability: PaletteCommon_Utils_Probability;
}

// ******** COMMON UTILS BUNDLE ********

export interface PaletteCommon {
	helpers: PaletteCommon_Helpers;
	superUtils: PaletteCommon_SuperUtils;
	utils: PaletteCommon_Utils;
}

// ******** MAIN MODULES ********

export interface GenPaletteArgs {
	numBoxes: number;
	customColor: HSL | null;
	enableAlpha: boolean;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface GenPaletteFnInterface {
	analogous(args: GenPaletteArgs): Promise<Palette>;
	complementary(args: GenPaletteArgs): Promise<Palette>;
	diadic(args: GenPaletteArgs): Promise<Palette>;
	hexadic(args: GenPaletteArgs): Promise<Palette>;
	monochromatic(args: GenPaletteArgs): Promise<Palette>;
	random(args: GenPaletteArgs): Promise<Palette>;
	splitComplementary(args: GenPaletteArgs): Promise<Palette>;
	tetradic(args: GenPaletteArgs): Promise<Palette>;
	triadic(args: GenPaletteArgs): Promise<Palette>;
}

export interface PaletteGenerateFnInterface {
	limitedHSL(
		baseHue: number,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean,
		alphaValue: number | null
	): HSL;
	selectedPalette(options: PaletteOptions): Promise<Palette>;
}

export interface PaletteStartFnInterface {
	genPalette(options: PaletteOptions): Promise<void>;
	genPaletteDOMBox(
		items: PaletteItem[],
		numBoxes: number,
		tableId: string
	): Promise<void>;
}

// ******** TOP-LEVEL BUNDLE INTERFACE ********

export interface PaletteFnMasterInterface {
	generate: PaletteGenerateFnInterface;
	serialize: PaletteSerializeFnInterface;
	start: PaletteStartFnInterface;
}
