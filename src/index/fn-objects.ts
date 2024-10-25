import * as interfaces from './interfaces';
import * as types from './types';

export interface ColorLimits {
	isCMYKTooBright(
		cmyk: types.CMYK,
		cmykBrightnessThreshold?: number
	): boolean;
	isCMYKTooDark(cmyk: types.CMYK, cmykDarknessThreshold?: number): boolean;
	isCMYKTooGray(cmyk: types.CMYK, cmykGrayThreshold?: number): boolean;
	isHexTooBright(hex: types.Hex, hexBrightnessThreshold?: number): boolean;
	isHexTooDark(hex: types.Hex, hexDarknessThreshold?: number): boolean;
	isHexTooGray(hex: types.Hex, hexGrayThreshold?: number): boolean;
	isHSLTooBright(hsl: types.HSL, hslBrightnessThreshold?: number): boolean;
	isHSLTooDark(hsl: types.HSL, hslDarknessThreshold?: number): boolean;
	isHSLTooGray(hsl: types.HSL, hslGrayThreshold?: number): boolean;
	isHSVTooBright(hsv: types.HSV, hsvBrightnessThreshold?: number): boolean;
	isHSVTooDark(hsv: types.HSV, hsvDarknessThreshold?: number): boolean;
	isHSVTooGray(hsv: types.HSV, hsvGrayThreshold?: number): boolean;
	isLABTooBright(lab: types.LAB, labBrightnessThreshold?: number): boolean;
	isLABTooDark(lab: types.LAB, labDarknessThreshold?: number): boolean;
	isLABTooGray(lab: types.LAB, labGrayThreshold?: number): boolean;
	isRGBTooBright(rgb: types.RGB, rgbBrightnessThreshold?: number): boolean;
	isRGBTooDark(rgb: types.RGB, rgbDarknessThreshold?: number): boolean;
	isRGBTooGray(rgb: types.RGB, rgbGrayThreshold?: number): boolean;
	getLimitChecker<K extends keyof ColorLimits>(limit: K): ColorLimits[K];
	isColorInBounds(color: interfaces.ConversionData): boolean;
}

export interface ConversionHelpers {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: types.RGB): types.RGB;
	cmykToXYZHelper(cmyk: types.CMYK): types.XYZ;
	convertColorToCMYK(color: types.Color): types.CMYK | null;
	convertColorToHex(color: types.Color): types.Hex | null;
	convertColorToHSL(color: types.Color): types.HSL | null;
	convertColorToHSV(color: types.Color): types.HSV | null;
	convertColorToLAB(color: types.Color): types.LAB | null;
	convertColorToRGB(color: types.Color): types.RGB | null;
	hexToCMYKHelper(hex: types.Hex): types.CMYK;
	hexToXYZHelper(hex: types.Hex): types.XYZ;
	hueToRGB(p: number, q: number, t: number): number;
	hslAddFormat(value: types.HSLValue): types.HSL;
	hslToCMYKHelper(hsl: types.HSL): types.CMYK;
	hslToHexHelper(hsl: types.HSL): types.Hex;
	hslToXYZHelper(hsl: types.HSL): types.XYZ;
	hsvToCMYKHelper(hsv: types.HSV): types.CMYK;
	hsvToXYZHelper(hsv: types.HSV): types.XYZ;
	labToCMYKHelper(lab: types.LAB): types.CMYK;
	labToXYZHelper(lab: types.LAB): types.XYZ;
	xyzToCMYKHelper(xyz: types.XYZ): types.CMYK;
	xyzToHexHelper(xyz: types.XYZ): types.Hex;
	xyzToHSLHelper(xyz: types.XYZ): types.HSL;
	xyzToHSVHelper(xyz: types.XYZ): types.HSV;
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
	defaultCMYK(): types.CMYK;
	defaultHex(): types.Hex;
	defaultHSL(): types.HSL;
	defaultHSV(): types.HSV;
	defaultLAB(): types.LAB;
	defaultRGB(): types.RGB;
	defaultSL(): types.SL;
	defaultSV(): types.SV;
	defaultXYZ(): types.XYZ;
}

export interface DOM {
	addConversionButtonEventListeners(): void;
	applyCustomColor(): types.Color;
	applyFirstColorToUI(colorSpace: types.ColorSpace): types.Color;
	applyUIColorSpace(): types.ColorSpace;
	convertColors(targetFormat: types.ColorSpace): void;
	copyToClipboard(text: string, tooltipElement: HTMLElement): void;
	defineUIButtons(): interfaces.UIButtons;
	desaturateColor(selectedColor: number): void;
	getElementsForSelectedColor(
		selectedColor: number
	): interfaces.GetElementsForSelectedColor;
	getGenerateButtonParams(): interfaces.GenButtonParams | null;
	handleGenButtonClick(): void;
	populateColorTextOutputBox(color: types.Color, boxNumber: number): void;
	pullParamsFromUI(): interfaces.PullParamsFromUI;
	saturateColor(selectedColor: number): void;
	showCustomColorPopupDiv(): void;
}

export interface DOMHelpers {
	attachDragAndDropEventListeners(element: HTMLElement | null): void;
	getElement<T extends HTMLElement>(id: string): T | null;
	makePaletteBox(
		color: types.Color,
		paletteBoxCount: number
	): interfaces.MakePaletteBox;
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
	genPaletteBox(colors: types.Color[], numBoxes: number): void;
	genSelectedPaletteType(
		paletteType: number,
		numBoxes: number,
		baseColor: types.Color,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	startPaletteGen(
		paletteType: number,
		numBoxes: number,
		colorSpace: types.ColorSpace,
		customColor: types.Color | null
	): void;
}

export interface Guards {
	ensureHash(value: string): string;
	isCMYK(
		color: types.Color | types.ColorString
	): color is types.CMYK | types.CMYKString;
	isCMYKColor(value: unknown): value is types.CMYK;
	isCMYKString(value: unknown): value is types.CMYKString;
	isColor(value: unknown): value is types.Color;
	isColorSpace(value: string): boolean;
	isColorSpaceExtended(value: string): boolean;
	isColorString(value: unknown): value is types.ColorString;
	isConversion(
		from: keyof types.ConversionMap,
		to: keyof types.Color
	): boolean;
	isConvertibleColor(color: types.Color): boolean;
	isFormat(format: unknown): boolean;
	isHex(color: types.Color | types.ColorString): color is types.Hex;
	isHexColor(value: unknown): boolean;
	isHSL(
		color: types.Color | types.ColorString
	): color is types.HSL | types.HSLString;
	isHSLColor(value: unknown): value is types.HSL;
	isHSLString(value: unknown): value is types.HSLString;
	isHSV(
		color: types.Color | types.ColorString
	): color is types.HSV | types.HSVString;
	isHSVColor(value: unknown): value is types.HSV;
	isHSVString(value: unknown): value is types.HSVString;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isLAB(color: types.Color | types.ColorString): color is types.LAB;
	isRGB(color: types.Color | types.ColorString): color is types.RGB;
	isSL(
		color: types.Color | types.ColorString
	): color is types.SL | types.SLString;
	isSLColor(value: unknown): value is types.SL;
	isSLString(value: unknown): value is types.SLString;
	isSV(
		color: types.Color | types.ColorString
	): color is types.SV | types.SVString;
	isSVColor(value: unknown): value is types.SV;
	isSVString(value: unknown): value is types.SVString;
	isXYZ(color: types.Color | types.ColorString): color is types.XYZ;
	narrowToColor(color: types.Color | types.ColorString): types.Color | null;
}

export interface Palette {
	genAnalogousHues(color: types.Color, numBoxes: number): number[];
	genDiadicHues(baseHue: number): number[];
	genHexadicHues(hsl: types.HSL): number[];
	genSplitComplementaryHues(baseHue: number): number[];
	genTetradicHues(baseHue: number): number[];
	genTriadicHues(baseHue: number): number[];
	genAnalogousPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genComplementaryPalette(
		numBoxes: number,
		baseColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genDiadicPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genHexadicPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genMonochromaticPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genRandomPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genSplitComplementaryPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genTetradicPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
	genTriadicPalette(
		numBoxes: number,
		customColor: types.Color | null,
		colorSpace: types.ColorSpace
	): types.Color[];
}

export interface PaletteHelpers {
	adjustSL(color: types.HSL): types.HSL;
	getWeightedRandomInterval(): number;
	sanitizeLAB(value: number): number;
	sanitizePercentage(value: number): number;
	sanitizeRadial(value: number): number;
	sanitizeRGB(value: number): number;
	validateColorValues(color: types.Color | types.SL | types.SV): boolean;
}

export interface Random {
	randomCMYK(): types.CMYK;
	randomHex(): types.Hex;
	randomHSL(): types.HSL;
	randomHSV(): types.HSV;
	randomLAB(): types.LAB;
	randomRGB(): types.RGB;
	randomSL(): types.SL;
	randomSV(): types.SV;
	randomColor(colorSpace: types.ColorSpace): types.Color;
}

export interface ToCMYK {
	hexToCMYK(hex: types.Hex): types.CMYK;
	hslToCMYK(hsl: types.HSL): types.CMYK;
	hsvToCMYK(hsv: types.HSV): types.CMYK;
	labToCMYK(lab: types.LAB): types.CMYK;
	rgbToCMYK(rgb: types.RGB): types.CMYK;
	xyzToCMYK(xyz: types.XYZ): types.CMYK;
}

export interface ToHex {
	cmykToHex(cmyk: types.CMYK): types.Hex;
	hslToHex(hsl: types.HSL): types.Hex;
	hsvToHex(hsv: types.HSV): types.Hex;
	labToHex(lab: types.LAB): types.Hex;
	rgbToHex(rgb: types.RGB): types.Hex;
	xyzToHex(xyz: types.XYZ): types.Hex;
}

export interface ToHSL {
	cmykToHSL(cmyk: types.CMYK): types.HSL;
	hexToHSL(hex: types.Hex): types.HSL;
	hsvToHSL(hsv: types.HSV): types.HSL;
	labToHSL(lab: types.LAB): types.HSL;
	rgbToHSL(rgb: types.RGB): types.HSL;
	xyzToHSL(xyz: types.XYZ): types.HSL;
}

export interface ToHSV {
	cmykToHSV(cmyk: types.CMYK): types.HSV;
	hexToHSV(hex: types.Hex): types.HSV;
	hslToHSV(hsl: types.HSL): types.HSV;
	labToHSV(lab: types.LAB): types.HSV;
	rgbToHSV(rgb: types.RGB): types.HSV;
	xyzToHSV(xyz: types.XYZ): types.HSV;
}

export interface ToLAB {
	cmykToLAB(cmyk: types.CMYK): types.LAB;
	hexToLAB(hex: types.Hex): types.LAB;
	hslToLAB(hsl: types.HSL): types.LAB;
	hsvToLAB(hsv: types.HSV): types.LAB;
	rgbToLAB(rgb: types.RGB): types.LAB;
	xyzToLAB(xyz: types.XYZ): types.LAB;
}

export interface ToRGB {
	cmykToRGB(cmyk: types.CMYK): types.RGB;
	hexToRGB(hex: types.Hex): types.RGB;
	hslToRGB(hsl: types.HSL): types.RGB;
	hsvToRGB(hsv: types.HSV): types.RGB;
	labToRGB(lab: types.LAB): types.RGB;
	xyzToRGB(xyz: types.XYZ): types.RGB;
}

export interface ToXYZ {
	cmykToXYZ(cmyk: types.CMYK): types.XYZ;
	hexToXYZ(hex: types.Hex): types.XYZ;
	hslToXYZ(hsl: types.HSL): types.XYZ;
	hsvToXYZ(hsv: types.HSV): types.XYZ;
	labToXYZ(lab: types.LAB): types.XYZ;
	rgbToXYZ(rgb: types.RGB): types.XYZ;
}

export interface Transforms {
	addHashToHex(hex: types.Hex): types.Hex;
	colorStringToColor(
		color: types.ColorString
	): Exclude<types.Color, types.Hex | types.LAB | types.RGB>;
	colorToColorString(
		color: Exclude<types.Color, types.Hex | types.LAB | types.RGB>
	): types.ColorString;
	componentToHex(componment: number): string;
	getColorString(color: types.Color): string | null;
	getCSSColorString(color: types.Color): string;
	parseColor(colorSpace: types.ColorSpace, value: string): types.Color | null;
	parseColorComponents(value: string, expectedLength: number): number[];
	parseCustomColor(
		colorSpace: types.ColorSpace,
		rawValue: string
	): types.Color | null;
	stripHashFromHex(hex: types.Hex): types.Hex;
}

export interface Wrappers {
	hexToCMYKWrapper(input: string | types.Hex): types.CMYK;
	hexToHSLWrapper(input: string | types.Hex): types.HSL;
	hexToHSVWrapper(input: string | types.Hex): types.HSV;
	hexToLABWrapper(input: string | types.Hex): types.LAB;
	hexToRGBWrapper(input: string | types.Hex): types.RGB;
	hexToXYZWrapper(input: string | types.Hex): types.XYZ;
}
