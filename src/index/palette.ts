import * as colors from './colors';

export interface Palette {
	id: string;
	items: PaletteItem[];
	flags: {
		enableAlpha: boolean;
		limitDark: boolean;
		limitGray: boolean;
		limitLight: boolean;
	};
	metadata: {
		customColor?: {
			hslColor: colors.HSL;
			convertedColors: PaletteItem['colors'];
		};
		numBoxes: number;
		paletteType: string;
	};
}

export interface PaletteItem {
	id: string;
	colors: {
		cmyk: colors.CMYKValue;
		hex: colors.HexValue;
		hsl: colors.HSLValue;
		hsv: colors.HSVValue;
		lab: colors.LABValue;
		rgb: colors.RGBValue;
		xyz: colors.XYZValue;
	};
	colorStrings: {
		cmykString: colors.CMYKValueString;
		hexString: colors.HexValueString;
		hslString: colors.HSLValueString;
		hsvString: colors.HSVValueString;
		labString: colors.LABValueString;
		rgbString: colors.RGBValueString;
		xyzString: colors.XYZValueString;
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
