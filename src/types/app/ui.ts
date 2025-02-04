// File: types/app/ui.js

import {
	HSL,
	Palette,
	PaletteItem,
	PaletteOptions
} from '../../types/index.js';

export interface UIFn_MasterInterface {
	generateLimitedHSL(
		baseHue: number,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): HSL;
	generateSelectedPalette(options: PaletteOptions): Promise<Palette>;
	processPaletteGeneration: () => void;
	startPaletteGeneration(options: PaletteOptions): Promise<void>;
	startPaletteDomBoxGeneration(
		items: PaletteItem[],
		numBoxes: number,
		tableId: string
	): Promise<void>;
}

export interface PaletteFn_MasterInterface {
	generate: {
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
