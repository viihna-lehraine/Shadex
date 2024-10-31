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
			convertedColors: PaletteItem['colorConversions'];
		};
		numBoxes: number;
		paletteType: string;
	};
}

export interface PaletteItem {
	id: string;
	color: colors.Color;
	colorConversions: {
		cmyk: colors.CMYK;
		hex: colors.Hex;
		hsv: colors.HSV;
		lab: colors.LAB;
		rgb: colors.RGB;
		sl: colors.SL;
		sv: colors.SV;
		xyz: colors.XYZ;
	};
	colorStringConversions: {
		cmykString: colors.CMYKString;
		hslString: colors.HSLString;
		hsvString: colors.HSVString;
		slString: colors.SLString;
		svString: colors.SVString;
	};
	cssStrings: {
		cmykCSSString: string;
		hexCSSString: string;
		hslCSSString: string;
		hsvCSSString: string;
		labCSSString: string;
		xyzCSSString: string;
	};
	rawColorStrings: {
		cmykRawString: string;
		hexRawString: string;
		hslRawString: string;
		hsvRawString: string;
		labRawString: string;
		slRawString: string;
		svRawString: string;
		xyzRawString: string;
	};
}
