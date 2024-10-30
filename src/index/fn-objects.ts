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

export interface ColorLimits {
	isCMYKTooBright(
		cmyk: colors.CMYK,
		cmykBrightnessThreshold?: number
	): boolean;
	isCMYKTooDark(cmyk: colors.CMYK, cmykDarknessThreshold?: number): boolean;
	isCMYKTooGray(cmyk: colors.CMYK, cmykGrayThreshold?: number): boolean;
	isHexTooBright(hex: colors.Hex, hexBrightnessThreshold?: number): boolean;
	isHexTooDark(hex: colors.Hex, hexDarknessThreshold?: number): boolean;
	isHexTooGray(hex: colors.Hex, hexGrayThreshold?: number): boolean;
	isHSLTooBright(hsl: colors.HSL, hslBrightnessThreshold?: number): boolean;
	isHSLTooDark(hsl: colors.HSL, hslDarknessThreshold?: number): boolean;
	isHSLTooGray(hsl: colors.HSL, hslGrayThreshold?: number): boolean;
	isHSVTooBright(hsv: colors.HSV, hsvBrightnessThreshold?: number): boolean;
	isHSVTooDark(hsv: colors.HSV, hsvDarknessThreshold?: number): boolean;
	isHSVTooGray(hsv: colors.HSV, hsvGrayThreshold?: number): boolean;
	isLABTooBright(lab: colors.LAB, labBrightnessThreshold?: number): boolean;
	isLABTooDark(lab: colors.LAB, labDarknessThreshold?: number): boolean;
	isLABTooGray(lab: colors.LAB, labGrayThreshold?: number): boolean;
	isRGBTooBright(rgb: colors.RGB, rgbBrightnessThreshold?: number): boolean;
	isRGBTooDark(rgb: colors.RGB, rgbDarknessThreshold?: number): boolean;
	isRGBTooGray(rgb: colors.RGB, rgbGrayThreshold?: number): boolean;
	getLimitChecker<K extends keyof ColorLimits>(limit: K): ColorLimits[K];
	isColorInBounds(color: colors.ColorDataAssertion): boolean;
}

export interface ConversionHelpers {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: colors.RGB): colors.RGB;
	cmykToHSLHelper(cmyk: colors.CMYK): colors.HSL;
	cmykToHSVHelper(cmyk: colors.CMYK): colors.HSV;
	cmykToXYZHelper(cmyk: colors.CMYK): colors.XYZ;
	convertColorToCMYK(color: colors.Color): colors.CMYK | null;
	convertColorToHex(color: colors.Color): colors.Hex | null;
	convertColorToHSL(color: colors.Color): colors.HSL | null;
	convertColorToHSV(color: colors.Color): colors.HSV | null;
	convertColorToLAB(color: colors.Color): colors.LAB | null;
	convertColorToRGB(color: colors.Color): colors.RGB | null;
	hexToCMYKHelper(hex: colors.Hex): colors.CMYK;
	hexToHSLHelper(hex: colors.Hex): colors.HSL;
	hexToHSVHelper(hex: colors.Hex): colors.HSV;
	hexToXYZHelper(hex: colors.Hex): colors.XYZ;
	hueToRGB(p: number, q: number, t: number): number;
	hslAddFormat(value: colors.HSLValue): colors.HSL;
	hslToCMYKHelper(hsl: colors.HSL): colors.CMYK;
	hslToHexHelper(hsl: colors.HSL): colors.Hex;
	hslToHSVHelper(hsl: colors.HSL): colors.HSV;
	hslToXYZHelper(hsl: colors.HSL): colors.XYZ;
	hsvToCMYKHelper(hsv: colors.HSV): colors.CMYK;
	hsvToHSLHelper(hsv: colors.HSV): colors.HSL;
	hsvToXYZHelper(hsv: colors.HSV): colors.XYZ;
	labToCMYKHelper(lab: colors.LAB): colors.CMYK;
	labToHSLHelper(lab: colors.LAB): colors.HSL;
	labToHSVHelper(lab: colors.LAB): colors.HSV;
	labToXYZHelper(lab: colors.LAB): colors.XYZ;
	rgbToHSLHelper(rgb: colors.RGB): colors.HSL;
	rgbToHSVHelper(rgb: colors.RGB): colors.HSV;
	xyzToCMYKHelper(xyz: colors.XYZ): colors.CMYK;
	xyzToHexHelper(xyz: colors.XYZ): colors.Hex;
	xyzToHSLHelper(xyz: colors.XYZ): colors.HSL;
	xyzToHSVHelper(xyz: colors.XYZ): colors.HSV;
}

export interface Convert
	extends ToCMYK,
		ToHex,
		ToHSL,
		ToHSV,
		ToLAB,
		ToRGB,
		ToSL,
		ToSV,
		ToXYZ {}

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
	applyCustomColor(): colors.Color;
	applyFirstColorToUI(colorSpace: colors.ColorSpace): colors.Color;
	applySelectedColorSpace(): colors.ColorSpace;
	convertColors(targetFormat: colors.ColorSpace): void;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIButtons(): domTypes.UIButtons;
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
	getBaseColor(
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color;
	createPaletteItem(color: colors.Color): palette.PaletteItem;
	createPaletteObject(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.Color,
		numBoxes: number
	): palette.Palette;
	generatePaletteItems(
		baseColor: Exclude<colors.Color, colors.SL | colors.SV>,
		colorSpace: colors.ColorSpace,
		hues: number[]
	): palette.PaletteItem[];
	savePaletteToDB(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.Color,
		numBoxes: number
	): Promise<palette.Palette>;
	updateColorBox(
		color: colors.Color,
		colorSpace: colors.ColorSpace,
		index: number
	): void;
	analogous(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	complementary(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	diadic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	hexadic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	monochromatic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	random(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	splitComplementary(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	tetradic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
	triadic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette>;
}

export interface Guards {
	ensureHash(value: string): string;
	isCMYKColor(value: unknown): value is colors.CMYK;
	isCMYKString(value: unknown): value is colors.CMYKString;
	isColor(value: unknown): value is colors.Color;
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
	isHSLColor(value: unknown): value is colors.HSL;
	isHSLString(value: unknown): value is colors.HSLString;
	isHSVColor(value: unknown): value is colors.HSV;
	isHSVString(value: unknown): value is colors.HSVString;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isLAB(color: colors.Color | colors.ColorString): color is colors.LAB;
	isRGB(color: colors.Color | colors.ColorString): color is colors.RGB;
	isSLColor(value: unknown): value is colors.SL;
	isSLString(value: unknown): value is colors.SLString;
	isStoredPalette(obj: unknown): obj is idb.StoredPalette;
	isSVColor(value: unknown): value is colors.SV;
	isSVString(value: unknown): value is colors.SVString;
	isXYZ(color: colors.Color | colors.ColorString): color is colors.XYZ;
	narrowToColor(
		color: colors.Color | colors.ColorString
	): colors.Color | null;
}

export interface HexTo {
	hexToCMYK(hex: colors.Hex): colors.CMYK;
	hexToHSL(hex: colors.Hex): colors.HSL;
	hexToHSV(hex: colors.Hex): colors.HSV;
	hexToLAB(hex: colors.Hex): colors.LAB;
	hexToRGB(hex: colors.Hex): colors.RGB;
	hexToSL(hex: colors.Hex): colors.SL;
	hexToSV(hex: colors.Hex): colors.SV;
	hexToXYZ(hex: colors.Hex): colors.XYZ;
}

export interface HSLTo {
	hslToCMYK(hsl: colors.HSL): colors.CMYK;
	hslToHex(hsl: colors.HSL): colors.Hex;
	hslToHSV(hsl: colors.HSL): colors.HSV;
	hslToLAB(hsl: colors.HSL): colors.LAB;
	hslToRGB(hsl: colors.HSL): colors.RGB;
	hslToSL(hsl: colors.HSL): colors.SL;
	hslToSV(hsl: colors.HSL): colors.SV;
	hslToXYZ(hsl: colors.HSL): colors.XYZ;
}

export interface HSVTo {
	hsvToCMYK(hsv: colors.HSV): colors.CMYK;
	hsvToHex(hsv: colors.HSV): colors.Hex;
	hsvToHSL(hsv: colors.HSV): colors.HSL;
	hsvToLAB(hsv: colors.HSV): colors.LAB;
	hsvToRGB(hsv: colors.HSV): colors.RGB;
	hsvToSL(hsv: colors.HSV): colors.SL;
	hsvToSV(hsv: colors.HSV): colors.SV;
	hsvToXYZ(hsv: colors.HSV): colors.XYZ;
}

export interface IDBFn {
	createMutationLogger<T extends object>(obj: T, key: string): T;
	deleteTable(id: string): Promise<void>;
	getCustomColor(): Promise<colors.Color | null>;
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
	updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: palette.PaletteItem
	): Promise<void>;
}

export interface LABTo {
	labToCMYK(lab: colors.LAB): colors.CMYK;
	labToHex(lab: colors.LAB): colors.Hex;
	labToHSL(lab: colors.LAB): colors.HSL;
	labToHSV(lab: colors.LAB): colors.HSV;
	labToRGB(lab: colors.LAB): colors.RGB;
	labToSL(lab: colors.LAB): colors.SL;
	labToSV(lab: colors.LAB): colors.SV;
	labToXYZ(lab: colors.LAB): colors.XYZ;
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

export interface RGBTo {
	rgbToCMYK(rgb: colors.RGB): colors.CMYK;
	rgbToHex(rgb: colors.RGB): colors.Hex;
	rgbToHSL(rgb: colors.RGB): colors.HSL;
	rgbToHSV(rgb: colors.RGB): colors.HSV;
	rgbToLAB(rgb: colors.RGB): colors.LAB;
	rgbToSL(rgb: colors.RGB): colors.SL;
	rgbToSV(rgb: colors.RGB): colors.SV;
	rgbToXYZ(rgb: colors.RGB): colors.XYZ;
}

export interface ToCMYK {
	hexToCMYK(hex: colors.Hex): colors.CMYK;
	hslToCMYK(hsl: colors.HSL): colors.CMYK;
	hsvToCMYK(hsv: colors.HSV): colors.CMYK;
	labToCMYK(lab: colors.LAB): colors.CMYK;
	rgbToCMYK(rgb: colors.RGB): colors.CMYK;
	xyzToCMYK(xyz: colors.XYZ): colors.CMYK;
}

export interface ToHex {
	cmykToHex(cmyk: colors.CMYK): colors.Hex;
	hslToHex(hsl: colors.HSL): colors.Hex;
	hsvToHex(hsv: colors.HSV): colors.Hex;
	labToHex(lab: colors.LAB): colors.Hex;
	rgbToHex(rgb: colors.RGB): colors.Hex;
	xyzToHex(xyz: colors.XYZ): colors.Hex;
}

export interface ToHSL {
	cmykToHSL(cmyk: colors.CMYK): colors.HSL;
	hexToHSL(hex: colors.Hex): colors.HSL;
	hsvToHSL(hsv: colors.HSV): colors.HSL;
	labToHSL(lab: colors.LAB): colors.HSL;
	rgbToHSL(rgb: colors.RGB): colors.HSL;
	xyzToHSL(xyz: colors.XYZ): colors.HSL;
}

export interface ToHSV {
	cmykToHSV(cmyk: colors.CMYK): colors.HSV;
	hexToHSV(hex: colors.Hex): colors.HSV;
	hslToHSV(hsl: colors.HSL): colors.HSV;
	labToHSV(lab: colors.LAB): colors.HSV;
	rgbToHSV(rgb: colors.RGB): colors.HSV;
	xyzToHSV(xyz: colors.XYZ): colors.HSV;
}

export interface ToLAB {
	cmykToLAB(cmyk: colors.CMYK): colors.LAB;
	hexToLAB(hex: colors.Hex): colors.LAB;
	hslToLAB(hsl: colors.HSL): colors.LAB;
	hsvToLAB(hsv: colors.HSV): colors.LAB;
	rgbToLAB(rgb: colors.RGB): colors.LAB;
	xyzToLAB(xyz: colors.XYZ): colors.LAB;
}

export interface ToRGB {
	cmykToRGB(cmyk: colors.CMYK): colors.RGB;
	hexToRGB(hex: colors.Hex): colors.RGB;
	hslToRGB(hsl: colors.HSL): colors.RGB;
	hsvToRGB(hsv: colors.HSV): colors.RGB;
	labToRGB(lab: colors.LAB): colors.RGB;
	xyzToRGB(xyz: colors.XYZ): colors.RGB;
}

export interface ToSL {
	cmykToSL(cmyk: colors.CMYK): colors.SL;
	hexToSL(hex: colors.Hex): colors.SL;
	hslToSL(hsl: colors.HSL): colors.SL;
	hsvToSL(hsv: colors.HSV): colors.SL;
	labToSL(lab: colors.LAB): colors.SL;
	rgbToSL(rgb: colors.RGB): colors.SL;
	xyzToSL(xyz: colors.XYZ): colors.SL;
}

export interface ToSV {
	cmykToSV(cmyk: colors.CMYK): colors.SV;
	hexToSV(hex: colors.Hex): colors.SV;
	hslToSV(hsl: colors.HSL): colors.SV;
	hsvToSV(hsv: colors.HSV): colors.SV;
	labToSV(lab: colors.LAB): colors.SV;
	rgbToSV(rgb: colors.RGB): colors.SV;
	xyzToSV(xyz: colors.XYZ): colors.SV;
}

export interface ToXYZ {
	cmykToXYZ(cmyk: colors.CMYK): colors.XYZ;
	hexToXYZ(hex: colors.Hex): colors.XYZ;
	hslToXYZ(hsl: colors.HSL): colors.XYZ;
	hsvToXYZ(hsv: colors.HSV): colors.XYZ;
	labToXYZ(lab: colors.LAB): colors.XYZ;
	rgbToXYZ(rgb: colors.RGB): colors.XYZ;
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
	getColorString(color: colors.Color): string | null;
	getCSSColorString(color: colors.Color): string;
	getRawColorString(color: colors.Color): string;
	parseColor(
		colorSpace: colors.ColorSpace,
		value: string
	): colors.Color | null;
	parseColorComponents(value: string, expectedLength: number): number[];
	parseCustomColor(
		colorSpace: colors.ColorSpace,
		rawValue: string
	): colors.Color | null;
	stripHashFromHex(hex: colors.Hex): colors.Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
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
