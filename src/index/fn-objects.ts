import { IDBPObjectStore } from 'idb';
import * as idb from './idb';
import * as colors from './colors';
import * as conversion from './conversion';
import * as domTypes from './dom-types';
import * as palette from './palette';

export interface CMYKTo {
	cmykToHex(cmyk: colors.CMYK): colors.Hex;
	cmykToHSL(cmyk: colors.CMYK): colors.HSL;
	cmykToHSV(cmyk: colors.CMYK): colors.HSV;
	cmykToLAB(cmyk: colors.CMYK): colors.LAB;
	cmykToRGB(cmyk: colors.CMYK): colors.RGB;
	cmykToSL(cmyk: colors.CMYK): colors.SL;
	cmykToSV(cmyk: colors.CMYK): colors.SV;
	cmykToXYZ(cmyk: colors.CMYK): colors.XYZ;
}

export interface ConversionHelpers {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: colors.RGB): colors.RGB;
	hslAddFormat(value: colors.HSLValue): colors.HSL;
	hueToRGB(p: number, q: number, t: number): number;
}

export interface Convert {
	cmykToHex(cmyk: colors.CMYK): colors.Hex;
	cmykToHSL(cmyk: colors.CMYK): colors.HSL;
	cmykToHSV(cmyk: colors.CMYK): colors.HSV;
	cmykToLAB(cmyk: colors.CMYK): colors.LAB;
	cmykToRGB(cmyk: colors.CMYK): colors.RGB;
	cmykToSL(cmyk: colors.CMYK): colors.SL;
	cmykToSV(cmyk: colors.CMYK): colors.SV;
	cmykToXYZ(cmyk: colors.CMYK): colors.XYZ;
	hexToCMYK(hex: colors.Hex): colors.CMYK;
	hexToHSL(hex: colors.Hex): colors.HSL;
	hexToHSV(hex: colors.Hex): colors.HSV;
	hexToLAB(hex: colors.Hex): colors.LAB;
	hexToRGB(hex: colors.Hex): colors.RGB;
	hexToSL(hex: colors.Hex): colors.SL;
	hexToSV(hex: colors.Hex): colors.SV;
	hexToXYZ(hex: colors.Hex): colors.XYZ;
	hslToCMYK(hsl: colors.HSL): colors.CMYK;
	hslToHex(hsl: colors.HSL): colors.Hex;
	hslToHSV(hsl: colors.HSL): colors.HSV;
	hslToLAB(hsl: colors.HSL): colors.LAB;
	hslToRGB(hsl: colors.HSL): colors.RGB;
	hslToSL(hsl: colors.HSL): colors.SL;
	hslToSV(hsl: colors.HSL): colors.SV;
	hslToXYZ(hsl: colors.HSL): colors.XYZ;
	hsvToCMYK(hsv: colors.HSV): colors.CMYK;
	hsvToHex(hsv: colors.HSV): colors.Hex;
	hsvToHSL(hsv: colors.HSV): colors.HSL;
	hsvToLAB(hsv: colors.HSV): colors.LAB;
	hsvToRGB(hsv: colors.HSV): colors.RGB;
	hsvToSL(hsv: colors.HSV): colors.SL;
	hsvToSV(hsv: colors.HSV): colors.SV;
	hsvToXYZ(hsv: colors.HSV): colors.XYZ;
	labToCMYK(lab: colors.LAB): colors.CMYK;
	labToHex(lab: colors.LAB): colors.Hex;
	labToHSL(lab: colors.LAB): colors.HSL;
	labToHSV(lab: colors.LAB): colors.HSV;
	labToRGB(lab: colors.LAB): colors.RGB;
	labToSL(lab: colors.LAB): colors.SL;
	labToSV(lab: colors.LAB): colors.SV;
	labToXYZ(lab: colors.LAB): colors.XYZ;
	rgbToCMYK(rgb: colors.RGB): colors.CMYK;
	rgbToHex(rgb: colors.RGB): colors.Hex;
	rgbToHSL(rgb: colors.RGB): colors.HSL;
	rgbToHSV(rgb: colors.RGB): colors.HSV;
	rgbToLAB(rgb: colors.RGB): colors.LAB;
	rgbToSL(rgb: colors.RGB): colors.SL;
	rgbToSV(rgb: colors.RGB): colors.SV;
	rgbToXYZ(rgb: colors.RGB): colors.XYZ;
	xyzToCMYK(xyz: colors.XYZ): colors.CMYK;
	xyzToHex(xyz: colors.XYZ): colors.Hex;
	xyzToHSL(xyz: colors.XYZ): colors.HSL;
	xyzToHSV(xyz: colors.XYZ): colors.HSV;
	xyzToLAB(xyz: colors.XYZ): colors.LAB;
	xyzToRGB(xyz: colors.XYZ): colors.RGB;
	xyzToSL(xyz: colors.XYZ): colors.SL;
	xyzToSV(xyz: colors.XYZ): colors.SV;
}

export interface Core {
	clone<T>(value: T): T;
	debounce: <T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	) => (...args: Parameters<T>) => void;
	isInRange(value: number, min: number, max: number): boolean;
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
	populateColorTextOutputBox(color: colors.Color, boxNumber: number): void;
	pullParamsFromUI(): domTypes.PullParamsFromUI;
	saturateColor(selectedColor: number): void;
	showCustomColorPopupDiv(): void;
	switchColorSpace(targetFormat: colors.ColorSpace): void;
}

export interface DOMHelpers {
	attachDragAndDropEventListeners(element: HTMLElement | null): void;
	getElement<T extends HTMLElement>(id: string): T | null;
	makePaletteBox(
		color: colors.Color,
		paletteBoxCount: number
	): domTypes.MakePaletteBox;
	showToast(message: string): void;
	showTooltip(tooltipElement: HTMLElement): void;
}

export interface DragAndDrop {
	handleDragEnd(e: DragEvent): void;
	handleDragOver(e: DragEvent): void;
	handleDragStart(e: DragEvent): void;
	handleDrop(e: DragEvent): void;
}

export interface Generate {
	genLimitedHSL(
		baseHue: number,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): colors.HSL;
	genPaletteBox(
		items: palette.PaletteItem[],
		numBoxes: number,
		tableId: string
	): Promise<void>;
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

export interface Guards {
	ensureHash(value: string): string;
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
	isConversion(
		from: keyof conversion.ConversionMap,
		to: keyof colors.Color
	): boolean;
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
}

export interface IDBFn {
	createMutationLogger<T extends object>(obj: T, key: string): T;
	deleteTable(id: string): Promise<void>;
	getCurrentPaletteID(): Promise<number>;
	getCustomColor(): Promise<colors.HSL | null>;
	getDB(): Promise<idb.PaletteDB>;
	getLoggedObject<T extends object>(obj: T | null, key: string): T | null;
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

export interface Limits {
	isColorInBounds(color: colors.HSL): boolean;
	isTooBright(hsl: colors.HSL, hslBrightnessThreshold?: number): boolean;
	isTooDark(hsl: colors.HSL, hslDarknessThreshold?: number): boolean;
	isTooGray(hsl: colors.HSL, hslGrayThreshold?: number): boolean;
}

export interface PaletteHelpers {
	adjustSL(color: colors.HSL): colors.HSL;
	getWeightedRandomInterval(): number;
	sanitizeLAB(value: number): number;
	sanitizePercentage(value: number): number;
	sanitizeRadial(value: number): number;
	sanitizeRGB(value: number): number;
	validateColorValues(color: colors.Color | colors.SL | colors.SV): boolean;
}

export interface Transform {
	addHashToHex(hex: colors.Hex): colors.Hex;
	colorStringToColor(
		color: colors.ColorString
	): Exclude<colors.Color, colors.Hex | colors.LAB | colors.RGB>;
	colorToColorString(
		color: Exclude<colors.Color, colors.Hex | colors.LAB | colors.RGB>
	): colors.ColorString;
	componentToHex(componment: number): string;
	getAlphaFromHex(hex: string): number;
	getColorString(color: colors.Color): string | null;
	getCSSColorString(color: colors.Color): string;
	getRawColorString(color: colors.Color): string;
	hexAlphaToNumericAlpha(hexAlpha: string): number;
	parseColor(
		colorSpace: colors.ColorSpace,
		value: string
	): colors.Color | null;
	parseColorComponents(value: string, expectedLength: number): number[];
	parseCustomColor(rawValue: string): colors.Color | null;
	parseHex(hexValue: string): colors.Hex;
	stripHashFromHex(hex: colors.Hex): colors.Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
	toHexWithAlpha(rgbValue: colors.RGBValue): string;
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
