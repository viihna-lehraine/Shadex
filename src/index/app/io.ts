// File: src/index/app/io.ts

import {
	CMYKValue,
	Color,
	HexValue,
	HSLValue,
	HSVValue,
	LABValue,
	Palette,
	PaletteItem,
	RGBValue,
	XYZValue
} from '../index.js';

export interface ColorParser {
	parse(input: string): Color;
}

export interface IO_Fn_DeserializeInterface {
	fromCSS(data: string): Promise<Palette>;
	fromJSON(data: string): Promise<Palette>;
	fromXML(data: string): Promise<Palette>;
}

export interface IO_Fn_ParseCSSInterface {
	header(cssData: string): Promise<string | null>;
	settings(data: string): Promise<{
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	} | void>;
	paletteItems(cssData: string): Promise<PaletteItem[]>;
}

export interface IO_Fn_ParseDataInterface {
	asColorValue: {
		cmyk: (colorString: string) => CMYKValue;
		hex: (colorValue: string) => HexValue;
		hsl: (colorValue: string) => HSLValue;
		hsv: (colorValue: string) => HSVValue;
		lab: (colorValue: string) => LABValue;
		rgb: (colorValue: string) => RGBValue;
		xyz: (colorValue: string) => XYZValue;
	};
	asColorString: (format: string, input: string) => Color;
	asCSSColorString: (format: string, input: string) => string;
}

export interface IO_Fn_ParseJSONInterface {
	file: (jsonData: string) => Promise<Palette | null>;
}

export interface IO_Fn_ParseXMLInterface {
	flags: (xmlString: string) => {
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	};
	paletteItems: (xmlData: string) => Promise<PaletteItem[]>;
}

export interface IO_Fn_SerializeInterface {
	toCSS(palette: Palette): Promise<string>;
	toJSON(palette: Palette): Promise<string>;
	toXML(palette: Palette): Promise<string>;
}

export interface IO_FnParseInterface {
	css: IO_Fn_ParseCSSInterface;
	data: IO_Fn_ParseDataInterface;
	json: IO_Fn_ParseJSONInterface;
	xml: IO_Fn_ParseXMLInterface;
}

export interface IO_Fn_MasterInterface {
	deserialize: IO_Fn_DeserializeInterface;
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
	parse: IO_FnParseInterface;
	serialize: {
		toCSS(palette: Palette): Promise<string>;
		toJSON(palette: Palette): Promise<string>;
		toXML(palette: Palette): Promise<string>;
	};
}
