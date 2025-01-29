// File: types/app/io.ts

import {
	CMYK,
	Color,
	Hex,
	HSL,
	HSV,
	LAB,
	Palette,
	RGB,
	XYZ
} from '../index.js';

export interface ColorParser {
	parse(input: string): Color;
}

export interface IOFn_MasterInterface {
	deserialize: {
		fromCSS(data: string): Promise<Palette>;
		fromJSON(data: string): Promise<Palette>;
		fromXML(data: string): Promise<Palette>;
	};
	exportPalette: (
		palette: Palette,
		format: 'css' | 'json' | 'xml'
	) => Promise<string>;
	file: {
		importFromFile(file: File): Promise<Palette>;
		exportToFile(
			palette: Palette,
			format: 'css' | 'json' | 'xml'
		): Promise<void>;
	};
	importPalette(data: string): Promise<Palette>;
	parse: {
		asColorValue: {
			cmyk: (colorString: string) => CMYK['value'];
			hex: (colorValue: string) => Hex['value'];
			hsl: (colorValue: string) => HSL['value'];
			hsv: (colorValue: string) => HSV['value'];
			lab: (colorValue: string) => LAB['value'];
			rgb: (colorValue: string) => RGB['value'];
			xyz: (colorValue: string) => XYZ['value'];
		};
		asColorString(format: string, input: string): Color;
		asCSSColorString(format: string, input: string): string;
		color: {
			cmyk: (rawCMYK: string | null) => CMYK['value'];
			hex: (rawHex: string | null) => Hex['value'];
			hsl: (rawHSL: string | null) => HSL['value'];
			hsv: (rawHSV: string | null) => HSV['value'];
			lab: (rawLAB: string | null) => LAB['value'];
			rgb: (rawRGB: string | null) => RGB['value'];
			xyz: (rawXYZ: string | null) => XYZ['value'];
		};
		json: {
			file(jsonData: string): Promise<Palette | null>;
		};
	};
	serialize: {
		toCSS(palette: Palette): Promise<string>;
		toJSON(palette: Palette): Promise<string>;
		toXML(palette: Palette): Promise<string>;
	};
}
