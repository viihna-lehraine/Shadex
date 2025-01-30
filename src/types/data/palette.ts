// File: types/colors.js

import {
	CMYK,
	CMYK_StringProps,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	RGB,
	RGB_StringProps,
	XYZ,
	XYZ_StringProps,
	UnbrandedCMYK,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedRGB,
	UnbrandedXYZ
} from '../index.js';

export interface Palette {
	id: string;
	items: PaletteItem[]; // [ color1, color2, color3, color4 ]
	metadata: {
		name?: string;
		timestamp: string;
		swatches: number;
		type: string;
		customColor: PaletteItem | false;
		flags: {
			limitDarkness: boolean;
			limitGrayness: boolean;
			limitLightness: boolean;
		};
	};
}

export interface PaletteItem {
	id?: number;
	colors: {
		main: {
			cmyk: CMYK['value'];
			hex: Hex['value'];
			hsl: HSL['value'];
			hsv: HSV['value'];
			lab: LAB['value'];
			rgb: RGB['value'];
			xyz: XYZ['value'];
		};
		stringProps: {
			cmyk: CMYK_StringProps['value'];
			hex: Hex_StringProps['value'];
			hsl: HSL_StringProps['value'];
			hsv: HSV_StringProps['value'];
			lab: LAB_StringProps['value'];
			rgb: RGB_StringProps['value'];
			xyz: XYZ_StringProps['value'];
		};
		css: {
			cmyk: string;
			hex: string;
			hsl: string;
			hsv: string;
			lab: string;
			rgb: string;
			xyz: string;
		};
	};
}

export interface PaletteOptions {
	customColor: HSL | null;
	flags: {
		limitDark: boolean;
		limitGray: boolean;
		limitLight: boolean;
	};
	swatches: number;
	type: number;
}

export interface UnbrandedPaletteItem {
	colors: {
		main: {
			cmyk: UnbrandedCMYK['value'];
			hex: UnbrandedHex['value'];
			hsl: UnbrandedHSL['value'];
			hsv: UnbrandedHSV['value'];
			lab: UnbrandedLAB['value'];
			rgb: UnbrandedRGB['value'];
			xyz: UnbrandedXYZ['value'];
		};
		stringProps: {
			cmyk: CMYK_StringProps['value'];
			hex: Hex_StringProps['value'];
			hsl: HSL_StringProps['value'];
			hsv: HSV_StringProps['value'];
			lab: LAB_StringProps['value'];
			rgb: RGB_StringProps['value'];
			xyz: XYZ_StringProps['value'];
		};
		css: {
			cmyk: string;
			hex: string;
			hsl: string;
			hsv: string;
			lab: string;
			rgb: string;
			xyz: string;
		};
	};
}

export interface UnbrandedPalette {
	id: string;
	items: UnbrandedPaletteItem[];
	metadata: {
		customColor?: UnbrandedPaletteItem | false;
		flags: {
			enableAlpha: boolean;
			limitDarkness: boolean;
			limitGrayness: boolean;
			limitLightness: boolean;
		};
		name?: string;
		swatches: number;
		type: string;
		timestamp: string;
	};
}
