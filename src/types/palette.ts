// File: src/types/colors.js

import {
	CMYKValueUnbranded,
	CMYKValue,
	CMYKValueString,
	HexValueUnbranded,
	HexValue,
	HexValueString,
	HSL,
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
	metadata: {
		name?: string;
		timestamp: string;
		swatches: number;
		type: string;
		customColor: PaletteItem | false;
		flags: {
			enableAlpha: boolean;
			limitDarkness: boolean;
			limitGrayness: boolean;
			limitLightness: boolean;
		};
	};
}

export interface PaletteUnbranded {
	id: string;
	items: PaletteItemUnbranded[];
	metadata: {
		customColor?: PaletteItemUnbranded | false;
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

export interface PaletteItem {
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
		cmyk: string;
		hex: string;
		hsl: string;
		hsv: string;
		lab: string;
		rgb: string;
		xyz: string;
	};
}

export interface PaletteOptions {
	customColor: HSL | null;
	flags: {
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	};
	swatches: number;
	type: number;
}
