// File: types/app/palette.js

import { HSL, Palette, PaletteItem } from '../index.js';

export interface Palette_CommonFn_MasterInterface {
	helpers: {
		enforce: {
			swatchRules(minSwatches: number, maxSwatches?: number): void;
		};
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
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface PaletteGenerationInterface {
	[key: string]: (args: PaletteGenerationArgs) => Promise<Palette>;
}
