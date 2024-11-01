import { IDBPObjectStore } from 'idb';
import * as idb from './database';
import * as colors from './colors';
import * as domTypes from './dom-types';
import * as palette from './palette';

export interface ConversionHelpers {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: colors.RGB): colors.RGB;
	hslAddFormat(value: colors.HSLValue): colors.HSL;
	hueToRGB(p: number, q: number, t: number): number;
}

export interface Convert {
	cmykToHSL(cmyk: colors.CMYK): colors.HSL;
	hexToHSL(hex: colors.Hex): colors.HSL;
	hslToCMYK(hsl: colors.HSL): colors.CMYK;
	hslToHex(hsl: colors.HSL): colors.Hex;
	hslToHSV(hsl: colors.HSL): colors.HSV;
	hslToLAB(hsl: colors.HSL): colors.LAB;
	hslToRGB(hsl: colors.HSL): colors.RGB;
	hslToSL(hsl: colors.HSL): colors.SL;
	hslToSV(hsl: colors.HSL): colors.SV;
	hslToXYZ(hsl: colors.HSL): colors.XYZ;
	hsvToHSL(hsv: colors.HSV): colors.HSL;
	hsvToSV(hsv: colors.HSV): colors.SV;
	labToHSL(lab: colors.LAB): colors.HSL;
	labToXYZ(lab: colors.LAB): colors.XYZ;
	rgbToCMYK(rgb: colors.RGB): colors.CMYK;
	rgbToHex(rgb: colors.RGB): colors.Hex;
	rgbToHSL(rgb: colors.RGB): colors.HSL;
	rgbToHSV(rgb: colors.RGB): colors.HSV;
	rgbToXYZ(rgb: colors.RGB): colors.XYZ;
	xyzToHSL(xyz: colors.XYZ): colors.HSL;
	xyzToLAB(xyz: colors.XYZ): colors.LAB;
}

export interface ColorUtils {
	addHashToHex(hex: colors.Hex): colors.Hex;
	colorStringToColor(colorString: colors.ColorString): colors.Color;
	colorToColorString(
		color: Exclude<colors.Color, colors.Hex | colors.LAB | colors.RGB>
	): colors.ColorString | null;
	componentToHex(componment: number): string;
	ensureHash(value: string): string;
	formatColor(
		color: colors.Color,
		asColorString: boolean,
		asCSSString: boolean
	): {
		baseColor: colors.Color;
		formattedString?: colors.ColorString | string;
	};
	formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
	getAlphaFromHex(hex: string): number;
	getColorString(color: colors.Color): string | null;
	getCSSColorString(color: colors.Color): string;
	hexAlphaToNumericAlpha(hexAlpha: string): number;
	isCMYKColor(value: unknown): value is colors.CMYK;
	isCMYKFormat(color: colors.Color): color is colors.CMYK;
	isCMYKString(value: unknown): value is colors.CMYKString;
	isColor(value: unknown): value is colors.Color;
	isColorFormat<T extends colors.Color>(
		color: colors.Color,
		format: T['format']
	): color is T;
	isColorSpace(value: string): boolean;
	isColorSpaceExtended(value: string): boolean;
	isColorString(value: unknown): value is colors.ColorString;
	isConvertibleColor(color: colors.Color): boolean;
	isFormat(format: unknown): boolean;
	isHex(color: colors.Color | colors.ColorString): color is colors.Hex;
	isHexFormat(color: colors.Color): color is colors.Hex;
	isHSLColor(value: unknown): value is colors.HSL;
	isHSLFormat(color: colors.Color): color is colors.HSL;
	isHSLString(value: unknown): value is colors.HSLString;
	isHSVColor(value: unknown): value is colors.HSV;
	isHSVFormat(color: colors.Color): color is colors.HSV;
	isHSVString(value: unknown): value is colors.HSVString;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isLAB(color: colors.Color | colors.ColorString): color is colors.LAB;
	isLABFormat(color: colors.Color): color is colors.LAB;
	isRGB(color: colors.Color | colors.ColorString): color is colors.RGB;
	isRGBFormat(color: colors.Color): color is colors.RGB;
	isSLColor(value: unknown): value is colors.SL;
	isSLFormat(color: colors.Color): color is colors.SL;
	isSLString(value: unknown): value is colors.SLString;
	isStoredPalette(obj: unknown): obj is idb.StoredPalette;
	isSVColor(value: unknown): value is colors.SV;
	isSVFormat(color: colors.Color): color is colors.SV;
	isSVString(value: unknown): value is colors.SVString;
	isXYZ(color: colors.Color | colors.ColorString): color is colors.XYZ;
	isXYZFormat(color: colors.Color): color is colors.XYZ;
	narrowToColor(
		color: colors.Color | colors.ColorString
	): colors.Color | null;
	parseColor(
		colorSpace: colors.ColorSpace,
		value: string
	): colors.Color | null;
	parseComponents(value: string, count: number): number[];
	parseCustomColor(rawValue: string): colors.Color | null;
	parseHexWithAlpha(hexValue: string): colors.HexValue | null;
	stripHashFromHex(hex: colors.Hex): colors.Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
	toHexWithAlpha(rgbValue: colors.RGBValue): string;
}

export interface CommonUtils {
	sanitizeLAB(value: number): number;
	sanitizePercentage(value: number): number;
	sanitizeRadial(value: number): number;
	sanitizeRGB(value: number): number;
	validateColorValues(color: colors.Color | colors.SL | colors.SV): boolean;
}

export interface Core {
	clone<T>(value: T): T;
	debounce: <T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	) => (...args: Parameters<T>) => void;
	isInRange(value: number, min: number, max: number): boolean;
}

export interface Database {
	createMutationLogger<T extends object>(obj: T, key: string): T;
	deleteTable(id: string): Promise<void>;
	getCurrentPaletteID(): Promise<number>;
	getCustomColor(): Promise<colors.HSL | null>;
	getDB(): Promise<idb.PaletteDB>;
	getLoggedObject<T extends object>(obj: T | null, key: string): T | null;
	getNextPaletteID(): Promise<number>;
	getNextTableID(): Promise<string>;
	getSettings(): Promise<{ colorSpace: colors.ColorSpace } | null>;
	getStore<StoreName extends keyof idb.PaletteSchema>(
		storeName: StoreName,
		mode: 'readonly' | 'readwrite'
	): Promise<
		IDBPObjectStore<
			idb.PaletteSchema,
			[StoreName],
			StoreName,
			'readonly' | 'readwrite'
		>
	>;
	getTable(id: string): Promise<idb.StoredPalette | null>;
	initializeCurrentPaletteID(): Promise<number>;
	listTables(): Promise<string[]>;
	logMutation(mutation: idb.MutationLog): Promise<void>;
	renderPalette(tableId: string): Promise<void>;
	saveData<T>(
		storeName: keyof idb.PaletteSchema,
		key: string,
		data: T,
		oldValue?: T
	): Promise<void>;
	savePalette(id: string, newPalette: idb.StoredPalette): Promise<void>;
	savePaletteToDB(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.HSL,
		numBoxes: number,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	saveSettings(newSettings: idb.Settings): Promise<void>;
	trackedTransaction<StoreName extends keyof idb.PaletteSchema>(
		storeName: StoreName,
		mode: 'readonly' | 'readwrite',
		callback: (
			store: IDBPObjectStore<
				idb.PaletteSchema,
				[StoreName],
				StoreName,
				typeof mode
			>
		) => Promise<void>
	): Promise<void>;
	updateCurrentPaletteID(newID: number): Promise<void>;
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: palette.PaletteItem
	): Promise<void>;
}

export interface DOMFn {
	addConversionButtonEventListeners(): void;
	applyCustomColor(): colors.HSL;
	applyFirstColorToUI(color: colors.HSL): colors.HSL;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIElements(): domTypes.UIElements;
	desaturateColor(selectedColor: number): void;
	getElementsForSelectedColor(
		selectedColor: number
	): domTypes.GetElementsForSelectedColor;
	getGenerateButtonParams(): domTypes.GenButtonParams | null;
	handleGenButtonClick(): void;
	pullParamsFromUI(): domTypes.PullParamsFromUI;
	saturateColor(selectedColor: number): void;
	showCustomColorPopupDiv(): void;
	switchColorSpace(targetFormat: colors.ColorSpace): void;
}

export interface DOMHelpers {
	makePaletteBox(
		color: colors.Color,
		paletteBoxCount: number
	): domTypes.MakePaletteBox;
	showTooltip(tooltipElement: HTMLElement): void;
}

export interface DOMUtils {
	genPaletteBox(
		items: palette.PaletteItem[],
		numBoxes: number,
		tableId: string
	): Promise<void>;
}

export interface DragAndDrop {
	attachDragAndDropEventListeners(element: HTMLElement | null): void;
	handleDragEnd(e: DragEvent): void;
	handleDragOver(e: DragEvent): void;
	handleDragStart(e: DragEvent): void;
	handleDrop(e: DragEvent): void;
}

export interface ExportPalette {
	asCSS(palette: palette.Palette, colorSpace: colors.ColorSpace): void;
	asJSON(palette: palette.Palette): void;
	asPNG(palette: palette.Palette, colorSpace: colors.ColorSpace): void;
	asXML(palette: palette.Palette): void;
}

export interface Generate {
	genLimitedHSL(
		baseHue: number,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean,
		alpha: number | null
	): colors.HSL;
	genSelectedPalette(
		options: colors.PaletteOptions
	): Promise<palette.Palette>;
	startPaletteGen(options: colors.PaletteOptions): Promise<void>;
	validateAndConvertColor(
		color: colors.Color | colors.ColorString | null
	): colors.Color | null;
}

export interface GenHues {
	analogous(color: colors.Color, numBoxes: number): number[];
	diadic(baseHue: number): number[];
	hexadic(color: colors.Color): number[];
	splitComplementary(baseHue: number): number[];
	tetradic(baseHue: number): number[];
	triadic(baseHue: number): number[];
}

export interface GenPalette {
	createPaletteItem(
		color: colors.HSL,
		enableAlpha: boolean
	): palette.PaletteItem;
	generatePaletteItems(
		baseColor: colors.HSL,
		hues: number[],
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitBright: boolean
	): palette.PaletteItem[];
	getBaseColor(
		customColor: colors.HSL | null,
		enableAlpha: boolean
	): colors.HSL;
	updateColorBox(color: colors.Color, index: number): void;
	analogous(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	complementary(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	diadic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	hexadic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	monochromatic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	random(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	splitComplementary(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	tetradic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
	triadic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette>;
}

export interface History {
	addPaletteToHistory(palette: palette.Palette): void;
	renderPaletteHistory(displayFormat: colors.ColorSpace): void;
}

export interface Limits {
	isColorInBounds(color: colors.HSL): boolean;
	isTooBright(hsl: colors.HSL, hslBrightnessThreshold?: number): boolean;
	isTooDark(hsl: colors.HSL, hslDarknessThreshold?: number): boolean;
	isTooGray(hsl: colors.HSL, hslGrayThreshold?: number): boolean;
}

export interface Notification {
	showToast(message: string): void;
}

export interface PaletteHelpers {
	adjustSL(color: colors.HSL): colors.HSL;
	getWeightedRandomInterval(): number;
	hexToHSLWrapper(input: string | colors.Hex): colors.HSL;
}

export interface PaletteUtils {
	createPaletteObject(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.HSL,
		numBoxes: number,
		paletteID: number,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): palette.Palette;
	populateColorTextOutputBox(color: colors.Color, boxNumber: number): void;
}

export interface Wrappers {
	hexToCMYKWrapper(input: string | colors.Hex): colors.CMYK;
	hexToHSLWrapper(input: string | colors.Hex): colors.HSL;
	hexToHSVWrapper(input: string | colors.Hex): colors.HSV;
	hexToLABWrapper(input: string | colors.Hex): colors.LAB;
	hexToRGBWrapper(input: string | colors.Hex): colors.RGB;
	hexToSLWrapper(input: string | colors.Hex): colors.SL;
	hexToSVWrapper(input: string | colors.Hex): colors.SV;
	hexToXYZWrapper(input: string | colors.Hex): colors.XYZ;
}

export interface XYZTo {
	xyzToCMYK(xyz: colors.XYZ): colors.CMYK;
	xyzToHex(xyz: colors.XYZ): colors.Hex;
	xyzToHSL(xyz: colors.XYZ): colors.HSL;
	xyzToHSV(xyz: colors.XYZ): colors.HSV;
	xyzToLAB(xyz: colors.XYZ): colors.LAB;
	xyzToSL(xyz: colors.XYZ): colors.SL;
	xyzToSV(xyz: colors.XYZ): colors.SV;
	xyzToRGB(xyz: colors.XYZ): colors.RGB;
}
