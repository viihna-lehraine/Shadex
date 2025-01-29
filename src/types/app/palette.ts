// File: types/app/palette.js

import { HSL, Palette, PaletteItem, PaletteOptions } from '../index.js';

export interface Palette_CommonFn_MasterInterface {
	helpers: {
		limits: {
			isColorInBounds(hsl: HSL): boolean;
			isTooDark(hsl: HSL): boolean;
			isTooGray(hsl: HSL): boolean;
			isTooLight(hsl: HSL): boolean;
		};
		update: {
			colorBox(color: HSL, index: number): void;
		};
	};
	superUtils: {
		create: {
			baseColor: (customColor: HSL | null, enableAlpha: boolean) => HSL;
			paletteItem: (
				color: HSL,
				enableAlpha: boolean
			) => Promise<PaletteItem>;
			paletteItemArray(
				baseColor: HSL,
				hues: number[],
				enableAlpha: boolean,
				limitDark: boolean,
				limitGray: boolean,
				limitLight: boolean
			): Promise<PaletteItem[]>;
		};
		genHues: {
			analogous: (color: HSL, numBoxes: number) => number[];
			diadic: (baseHue: number) => number[];
			hexadic: (color: HSL) => number[];
			splitComplementary: (baseHue: number) => number[];
			tetradic: (baseHue: number) => number[];
			triadic: (baseHue: number) => number[];
		};
	};
	utils: {
		adjust: {
			sl(color: HSL): HSL;
		};
		probability: {
			getWeightedRandomInterval(): number;
		};
	};
}

// ******** MAIN MODULES ********

export interface GenPaletteArgs {
	swatches: number;
	type: number;
	customColor: HSL | null;
	enableAlpha: boolean;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface GenPaletteFnInterface {
	[key: string]: (args: GenPaletteArgs) => Promise<Palette>;
}

// ******** TOP-LEVEL BUNDLE INTERFACE ********

export interface PaletteFn_MasterInterface {
	generate: {
		limitedHSL(
			baseHue: number,
			limitDark: boolean,
			limitGray: boolean,
			limitLight: boolean,
			alphaValue: number | null
		): HSL;
		selectedPalette(options: PaletteOptions): Promise<Palette>;
	};
	start: {
		genPalette(options: PaletteOptions): Promise<void>;
		genPaletteDOMBox(
			items: PaletteItem[],
			numBoxes: number,
			tableId: string
		): Promise<void>;
	};
}
