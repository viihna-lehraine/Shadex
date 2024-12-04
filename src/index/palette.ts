// File: src/index/colors.ts

import {
	CMYKValue,
	CMYKValueString,
	HexValue,
	HexValueString,
	HSL,
	HSLValue,
	HSLValueString,
	HSVValue,
	HSVValueString,
	LABValue,
	LABValueString,
	RGBValue,
	RGBValueString,
	XYZValue,
	XYZValueString
} from './index';

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
