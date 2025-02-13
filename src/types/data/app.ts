// File: types/app.js

import {
	CMYK,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	XYZ,
	UnbrandedCMYK,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedRGB,
	UnbrandedXYZ
} from '../index.js';

export interface MutationLog {
	timestamp: string;
	key: string;
	action: 'add' | 'delete' | 'update';
	newValue: unknown;
	oldValue: unknown;
	origin: string;
}

export interface Palette {
	id: string;
	items: PaletteItem[]; // [ color1, color2, color3, color4 ]
	metadata: {
		name?: string;
		timestamp: string;
		swatches: number;
		type: string;
		flags: {
			limitDark: boolean;
			limitGray: boolean;
			limitLight: boolean;
		};
	};
}

export type PaletteType =
	| 'analogous'
	| 'complementary'
	| 'diadic'
	| 'monochromatic'
	| 'hexadic'
	| 'random'
	| 'split-complementary'
	| 'tetradic'
	| 'triadic';

export interface PaletteItem {
	itemID: number;
	colors: {
		cmyk: CMYK['value'];
		hex: Hex['value'];
		hsl: HSL['value'];
		hsv: HSV['value'];
		lab: LAB['value'];
		rgb: RGB['value'];
		xyz: XYZ['value'];
	};
	cssColors: {
		cmyk: string;
		hex: string;
		hsl: string;
		hsv: string;
		lab: string;
		rgb: string;
		xyz: string;
	};
}

export interface UnbrandedPaletteItem {
	itemID: number;
	colors: {
		cmyk: UnbrandedCMYK['value'];
		hex: UnbrandedHex['value'];
		hsl: UnbrandedHSL['value'];
		hsv: UnbrandedHSV['value'];
		lab: UnbrandedLAB['value'];
		rgb: UnbrandedRGB['value'];
		xyz: UnbrandedXYZ['value'];
	};
	cssColors: {
		cmyk: string;
		hex: string;
		hsl: string;
		hsv: string;
		lab: string;
		rgb: string;
		xyz: string;
	};
}

export interface UnbrandedPalette {
	id: string;
	items: UnbrandedPaletteItem[];
	metadata: {
		flags: {
			limitDark: boolean;
			limitGray: boolean;
			limitLight: boolean;
		};
		name?: string;
		swatches: number;
		type: string;
		timestamp: string;
	};
}
