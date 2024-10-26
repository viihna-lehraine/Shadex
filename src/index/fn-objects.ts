import { IDBPObjectStore } from 'idb';
import * as colors from './colors';
import * as conversion from './conversion';
import * as domTypes from './dom-types';
import * as idb from './idb';

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
	cmykToXYZHelper(cmyk: colors.CMYK): colors.XYZ;
	convertColorToCMYK(color: colors.Color): colors.CMYK | null;
	convertColorToHex(color: colors.Color): colors.Hex | null;
	convertColorToHSL(color: colors.Color): colors.HSL | null;
	convertColorToHSV(color: colors.Color): colors.HSV | null;
	convertColorToLAB(color: colors.Color): colors.LAB | null;
	convertColorToRGB(color: colors.Color): colors.RGB | null;
	hexToCMYKHelper(hex: colors.Hex): colors.CMYK;
	hexToXYZHelper(hex: colors.Hex): colors.XYZ;
	hueToRGB(p: number, q: number, t: number): number;
	hslAddFormat(value: colors.HSLValue): colors.HSL;
	hslToCMYKHelper(hsl: colors.HSL): colors.CMYK;
	hslToHexHelper(hsl: colors.HSL): colors.Hex;
	hslToXYZHelper(hsl: colors.HSL): colors.XYZ;
	hsvToCMYKHelper(hsv: colors.HSV): colors.CMYK;
	hsvToXYZHelper(hsv: colors.HSV): colors.XYZ;
	labToCMYKHelper(lab: colors.LAB): colors.CMYK;
	labToXYZHelper(lab: colors.LAB): colors.XYZ;
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
		ToXYZ {}

export interface Core {
	clone<T>(value: T): T;
	debounce: <T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	) => (...args: Parameters<T>) => void;
	isInRange(value: number, min: number, max: number): boolean;
}

export interface Defaults {
	defaultCMYK(): colors.CMYK;
	defaultHex(): colors.Hex;
	defaultHSL(): colors.HSL;
	defaultHSV(): colors.HSV;
	defaultLAB(): colors.LAB;
	defaultRGB(): colors.RGB;
	defaultSL(): colors.SL;
	defaultSV(): colors.SV;
	defaultXYZ(): colors.XYZ;
}

export interface DOM {
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
		colors: colors.Color[],
		numBoxes: number,
		tableId: string
	): Promise<void>;
	genSelectedPaletteType(options: colors.PaletteOptions): colors.Color[];
	startPaletteGen(options: colors.PaletteOptions): Promise<void>;
	validateAndConvertColor(
		color: colors.Color | colors.ColorString | null
	): colors.Color | null;
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
	isSVColor(value: unknown): value is colors.SV;
	isSVString(value: unknown): value is colors.SVString;
	isXYZ(color: colors.Color | colors.ColorString): color is colors.XYZ;
	narrowToColor(
		color: colors.Color | colors.ColorString
	): colors.Color | null;
}

export interface IDBFn {
	createMutationLogger<T extends object>(obj: T, key: string): T;
	deleteTable(id: string): Promise<void>;
	getCustomColor(): Promise<colors.Color | null>;
	getDB(): Promise<idb.PaletteDB>;
	getNextTableID(): Promise<string>;
	getSettings(): Promise<{ colorSpace: colors.ColorSpace } | null>;
	getTable(id: string): Promise<idb.PaletteEntry[] | null>;
	listTables(): Promise<string[]>;
	logMutation(mutation: idb.MutationLog): Promise<void>;
	renderPalette(tableId: string): Promise<void>;
	saveData<T>(
		storeName: keyof idb.PaletteSchema,
		key: string,
		data: T
	): Promise<void>;
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
	updatePalette(
		id: string,
		entryIndex: number,
		newEntry: idb.PaletteEntry
	): Promise<void>;
	updateTableEntry(
		tableId: string,
		entryIndex: number,
		newEntry: idb.PaletteEntry
	): Promise<void>;
}

export interface Palette {
	genAnalogousHues(color: colors.Color, numBoxes: number): number[];
	genDiadicHues(baseHue: number): number[];
	genHexadicHues(hsl: colors.HSL): number[];
	genSplitComplementaryHues(baseHue: number): number[];
	genTetradicHues(baseHue: number): number[];
	genTriadicHues(baseHue: number): number[];
	genAnalogousPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genComplementaryPalette(
		numBoxes: number,
		baseColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genDiadicPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genHexadicPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genMonochromaticPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genRandomPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genSplitComplementaryPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genTetradicPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
	genTriadicPalette(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): colors.Color[];
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

export interface Random {
	randomCMYK(): colors.CMYK;
	randomHex(): colors.Hex;
	randomHSL(): colors.HSL;
	randomHSV(): colors.HSV;
	randomLAB(): colors.LAB;
	randomRGB(): colors.RGB;
	randomSL(): colors.SL;
	randomSV(): colors.SV;
	randomColor(colorSpace: colors.ColorSpace): colors.Color;
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

export interface ToXYZ {
	cmykToXYZ(cmyk: colors.CMYK): colors.XYZ;
	hexToXYZ(hex: colors.Hex): colors.XYZ;
	hslToXYZ(hsl: colors.HSL): colors.XYZ;
	hsvToXYZ(hsv: colors.HSV): colors.XYZ;
	labToXYZ(lab: colors.LAB): colors.XYZ;
	rgbToXYZ(rgb: colors.RGB): colors.XYZ;
}

export interface Transforms {
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
}

export interface Wrappers {
	hexToCMYKWrapper(input: string | colors.Hex): colors.CMYK;
	hexToHSLWrapper(input: string | colors.Hex): colors.HSL;
	hexToHSVWrapper(input: string | colors.Hex): colors.HSV;
	hexToLABWrapper(input: string | colors.Hex): colors.LAB;
	hexToRGBWrapper(input: string | colors.Hex): colors.RGB;
	hexToXYZWrapper(input: string | colors.Hex): colors.XYZ;
}
