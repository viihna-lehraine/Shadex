// File: types/app/palette.js

import { ConstsDataInterface, Palette, PaletteType } from '../index.js';

export interface PaletteGenerationInterface {
	[key: string]: (args: SelectedPaletteOptions) => Promise<Palette>;
}

export interface SelectedPaletteOptions {
	columnCount: number;
	distributionType: keyof ConstsDataInterface['probabilities'];
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
	paletteType: PaletteType;
}
