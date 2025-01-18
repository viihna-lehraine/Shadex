// File: src/index/app/ui.ts

import { ColorSpace, Palette } from '../../index/index.js';

export interface UIFnBaseInterface {
	enforceSwatchRules(minimumSwatches: number, maximumSwatches?: number): void;
}

export interface UIFnIOInterface {
	exportPalette: {
		asCSS(palette: Palette, colorSpace: ColorSpace): void;
		asJSON(palette: Palette): void;
		asXML(palette: Palette): void;
	};
	importPalette: {
		fromCSS(cssString: string): Palette;
		fromJSON(jsonString: string): Palette;
		fromXML(xmlString: string): Palette;
	};
}

export interface UIFnMasterInterface {
	enforceSwatchRules(minimumSwatches: number, maximumSwatches?: number): void;
	io: UIFnIOInterface;
}
