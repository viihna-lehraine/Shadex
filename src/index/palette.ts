// File: src/index/colors.js

import {
	CMYKValueUnbranded,
	CMYKValue,
	CMYKValueString,
	HexValueUnbranded,
	HexValue,
	HexValueString,
	HSL,
	HSLUnbranded,
	HSLValue,
	HSLValueString,
	HSLValueUnbranded,
	HSVValueUnbranded,
	HSVValue,
	HSVValueString,
	LABValueUnbranded,
	LABValue,
	LABValueString,
	RGBValueUnbranded,
	RGBValue,
	RGBValueString,
	XYZValueUnbranded,
	XYZValue,
	XYZValueString
} from './index.js';

export interface Palette {
	id: string;
	items: PaletteItem[];
	flags: {
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	};
	metadata: {
		customColor?: {
			hslColor: HSL;
			convertedColors: PaletteItem['colors'];
		};
		numBoxes: number;
		paletteType: string;
		timestamp: number;
	};
}

export interface PaletteUnbranded {
	id: string;
	items: PaletteItem[];
	flags: {
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	};
	metadata: {
		customColor?: {
			hslColor: HSLUnbranded;
			convertedColors: PaletteItemUnbranded['colors'];
		};
		numBoxes: number;
		paletteType: string;
		timestamp: number;
	};
}

export interface PaletteItem {
	id: string;
	colors: {
		cmyk: CMYKValue;
		hex: HexValue;
		hsl: HSLValue;
		hsv: HSVValue;
		lab: LABValue;
		rgb: RGBValue;
		xyz: XYZValue;
	};
	colorStrings: {
		cmykString: CMYKValueString;
		hexString: HexValueString;
		hslString: HSLValueString;
		hsvString: HSVValueString;
		labString: LABValueString;
		rgbString: RGBValueString;
		xyzString: XYZValueString;
	};
	cssStrings: {
		cmykCSSString: string;
		hexCSSString: string;
		hslCSSString: string;
		hsvCSSString: string;
		labCSSString: string;
		rgbCSSString: string;
		xyzCSSString: string;
	};
}

export interface PaletteItemUnbranded {
	id: string;
	colors: {
		cmyk: CMYKValueUnbranded;
		hex: HexValueUnbranded;
		hsl: HSLValueUnbranded;
		hsv: HSVValueUnbranded;
		lab: LABValueUnbranded;
		rgb: RGBValueUnbranded;
		xyz: XYZValueUnbranded;
	};
	colorStrings: {
		cmyk: CMYKValueString;
		hex: HexValueString;
		hsl: HSLValueString;
		hsv: HSVValueString;
		lab: LABValueString;
		rgb: RGBValueString;
		xyz: XYZValueString;
	};
	cssStrings: {
		cmykCSSString: string;
		hexCSSString: string;
		hslCSSString: string;
		hsvCSSString: string;
		labCSSString: string;
		rgbCSSString: string;
		xyzCSSString: string;
	};
}

export interface PaletteOptions {
	numBoxes: number;
	customColor: HSL | null;
	paletteType: number;
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
}

export type PaletteType =
	| 'analogous'
	| 'complementary'
	| 'diadic'
	| 'hexadic'
	| 'monochromatic'
	| 'random'
	| 'split-complementary'
	| 'triadic'
	| 'tetradic';
