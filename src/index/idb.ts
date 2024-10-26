import { IDBPDatabase } from 'idb';
import * as colors from './colors';

export interface MutationLog {
	timestamp: string;
	key: string;
	action: string;
	newValue: unknown;
	oldValue?: unknown;
	origin: string;
}

export type PaletteDB = IDBPDatabase<PaletteSchema>;

export interface PaletteEntry {
	tableID: number;
	colors: {
		[colorID: string]: {
			colorSpaces: {
				cmyk: colors.CMYK;
				cmykString: colors.CMYKString;
				hex: colors.Hex;
				hsl: colors.HSL;
				hslString: colors.HSLString;
				hsv: colors.HSV;
				hsvString: colors.HSVString;
				lab: colors.LAB;
				rgb: colors.RGB;
				xyz: colors.XYZ;
			};
			postSaturation?: colors.Color;
			preSaturation?: colors.Color;
		};
	};
	metadata: {
		paletteType: string;
		numBoxes: number;
		customColor?: {
			color: colors.Color;
			colorString: colors.ColorString;
		};
		flags: {
			enableAlpha: boolean;
			limitDark: boolean;
			limitGray: boolean;
			limitLight: boolean;
		};
	};
}

export interface PaletteSchema {
	customColor: {
		key: string;
		value: { color: colors.Color };
	};
	mutations: {
		timestamp: string;
		value: MutationLog;
	};
	settings: {
		key: string;
		value: Settings;
	};
	tables: {
		key: string;
		value: PaletteEntry[];
	};
}

export interface Settings {
	colorSpace: colors.ColorSpace;
	lastTableID: number;
}
