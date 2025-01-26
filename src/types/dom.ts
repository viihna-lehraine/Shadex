// File: src/types/colors.js

import { Color, HSL } from './index.js';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}

export interface GenButtonArgs {
	swatches: number;
	type: number;
	customColor: HSL | null;
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
}

export interface MakePaletteBox {
	colorStripe: HTMLDivElement;
	paletteBoxCount: number;
}
