// File: src/index/app/io.ts

import {
	CMYKValue,
	Color,
	HexValue,
	HSLValue,
	HSVValue,
	LABValue,
	Palette,
	RGBValue,
	XYZValue
} from '../index.js';

export interface ColorParser {
	parse(input: string): Color;
}

export interface IO_Interface {
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
			cmyk: (colorString: string) => CMYKValue;
			hex: (colorValue: string) => HexValue;
			hsl: (colorValue: string) => HSLValue;
			hsv: (colorValue: string) => HSVValue;
			lab: (colorValue: string) => LABValue;
			rgb: (colorValue: string) => RGBValue;
			xyz: (colorValue: string) => XYZValue;
		};
		asColorString(format: string, input: string): Color;
		asCSSColorString(format: string, input: string): string;
		color: {
			cmyk: (rawCMYK: string | null) => CMYKValue;
			hex: (rawHex: string | null) => HexValue;
			hsl: (rawHSL: string | null) => HSLValue;
			hsv: (rawHSV: string | null) => HSVValue;
			lab: (rawLAB: string | null) => LABValue;
			rgb: (rawRGB: string | null) => RGBValue;
			xyz: (rawXYZ: string | null) => XYZValue;
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
