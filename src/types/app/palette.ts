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
			baseColor: (customColor: HSL | null) => HSL;
			paletteItem: (color: HSL) => Promise<PaletteItem>;
			paletteItemArray(
				baseColor: HSL,
				hues: number[],
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

export interface PaletteGenerationArgs {
	swatches: number;
	type: number;
	customColor: HSL | null;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface PaletteGenerationInterface {
	[key: string]: (args: PaletteGenerationArgs) => Promise<Palette>;
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
		paletteDomBoxGeneration(
			items: PaletteItem[],
			numBoxes: number,
			tableId: string
		): Promise<void>;
		paletteGeneration(options: PaletteOptions): Promise<void>;
	};
}
