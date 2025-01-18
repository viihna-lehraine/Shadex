// File: src/index/colors.js

import { Color, HSL } from './index.js';

export interface ColorInputElement extends HTMLInputElement {
	colorValues?: Color;
}

export type IOFormat = 'CSS' | 'JSON' | 'XML';

export interface GenButtonArgs {
	numBoxes: number;
	paletteType: number;
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
