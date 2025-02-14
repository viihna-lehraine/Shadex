// File: app/utils/partials.js

import {
	AllColors,
	ByteRange,
	CMYK,
	CMYK_StringProps,
	Color,
	ColorDataAssertion,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	Color_StringProps,
	DataSetsInterface,
	HelpersInterface,
	Hex,
	HexSet,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_A,
	LAB_B,
	LAB_L,
	LAB_StringProps,
	NumericRangeKey,
	Palette,
	PaletteArgs,
	PaletteItem,
	PaletteType,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	RGB_StringProps,
	ServicesInterface,
	SL,
	SL_StringProps,
	SV,
	SV_StringProps,
	UnbrandedCMYK,
	UnbrandedColor,
	UnbrandedHex,
	UnbrandedHSL,
	UnbrandedHSV,
	UnbrandedLAB,
	UnbrandedPalette,
	UnbrandedRGB,
	UnbrandedSL,
	UnbrandedSV,
	UnbrandedXYZ,
	XYZ,
	XYZ_StringProps,
	XYZ_X,
	XYZ_Y,
	XYZ_Z,
	UtilitiesInterface
} from '../../../types/index.js';

export interface AdjustmentUtilsInterface {
	adjustSL(
		color: HSL,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	applyGammaCorrection(value: number, services: ServicesInterface): number;
	clampRGB(
		rgb: RGB,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): RGB;
}

export interface AppUtilsInterface {
	generateRandomHSL(
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	generateRandomSL(
		services: ServicesInterface,
		utils: UtilitiesInterface
	): SL;
	getFormattedTimestamp(): string;
}

export interface BrandingUtilsInterface {
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T,
		utils: UtilitiesInterface
	): RangeKeyMap[T];
	asByteRange(value: number, utils: UtilitiesInterface): ByteRange;
	asCMYK(color: UnbrandedCMYK, utils: UtilitiesInterface): CMYK;
	asHex(color: UnbrandedHex, utils: UtilitiesInterface): Hex;
	asHexSet(value: string, utils: UtilitiesInterface): HexSet;
	asHSL(color: UnbrandedHSL, utils: UtilitiesInterface): HSL;
	asHSV(color: UnbrandedHSV, utils: UtilitiesInterface): HSV;
	asLAB(color: UnbrandedLAB, utils: UtilitiesInterface): LAB;
	asLAB_A(value: number, utils: UtilitiesInterface): LAB_A;
	asLAB_B(value: number, utils: UtilitiesInterface): LAB_B;
	asLAB_L(value: number, utils: UtilitiesInterface): LAB_L;
	asPercentile(value: number, utils: UtilitiesInterface): Percentile;
	asRadial(value: number, utils: UtilitiesInterface): Radial;
	asRGB(color: UnbrandedRGB, utils: UtilitiesInterface): RGB;
	asSL(color: UnbrandedSL, utils: UtilitiesInterface): SL;
	asSV(color: UnbrandedSV, utils: UtilitiesInterface): SV;
	asXYZ(color: UnbrandedXYZ, utils: UtilitiesInterface): XYZ;
	asXYZ_X(value: number, utils: UtilitiesInterface): XYZ_X;
	asXYZ_Y(value: number, utils: UtilitiesInterface): XYZ_Y;
	asXYZ_Z(value: number, utils: UtilitiesInterface): XYZ_Z;
	brandColor(color: UnbrandedColor, utils: UtilitiesInterface): Color;
	brandPalette(data: UnbrandedPalette, utils: UtilitiesInterface): Palette;
}

export interface ColorUtilsInterface {
	convertCMYKStringToValue(
		cmyk: CMYK_StringProps['value'],
		utils: UtilitiesInterface
	): CMYK['value'];
	convertCMYKValueToString(cmyk: CMYK['value']): CMYK_StringProps['value'];
	convertColorStringToColor(
		colorString: Color_StringProps,
		utils: UtilitiesInterface
	): Color;
	convertColorToColorString(
		color: Color,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Color_StringProps;
	convertColorToCSS(color: Color): string;
	convertCSSToColor(
		color: string,
		utils: UtilitiesInterface
	): Exclude<Color, SL | SV> | null;
	convertHexStringToValue(
		hex: Hex_StringProps['value'],
		utils: UtilitiesInterface
	): Hex['value'];
	convertHexValueToString(hex: Hex['value']): Hex_StringProps['value'];
	convertHSL(
		color: HSL,
		colorSpace: ColorSpaceExtended,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Color;
	convertHSLStringToValue(
		hsl: HSL_StringProps['value'],
		utils: UtilitiesInterface
	): HSL['value'];
	convertHSLValueToString(hsl: HSL['value']): HSL_StringProps['value'];
	convertHSVStringToValue(
		hsv: HSV_StringProps['value'],
		utils: UtilitiesInterface
	): HSV['value'];
	convertHSVValueToString(hsv: HSV['value']): HSV_StringProps['value'];
	convertLABStringToValue(
		lab: LAB_StringProps['value'],
		utils: UtilitiesInterface
	): LAB['value'];
	convertLABValueToString(lab: LAB['value']): LAB_StringProps['value'];
	convertRGBStringToValue(
		rgb: RGB_StringProps['value'],
		utils: UtilitiesInterface
	): RGB['value'];
	convertRGBValueToString(rgb: RGB['value']): RGB_StringProps['value'];
	convertToHSL(
		color: Exclude<Color, SL | SV>,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	convertXYZStringToValue(
		xyz: XYZ_StringProps['value'],
		utils: UtilitiesInterface
	): XYZ['value'];
	convertXYZValueToString(xyz: XYZ['value']): XYZ_StringProps['value'];
	getColorString(color: Color, services: ServicesInterface): string | null;
	getConversionFn<
		From extends keyof ColorDataAssertion,
		To extends keyof ColorDataAssertion
	>(
		from: From,
		to: To,
		helpers: HelpersInterface,
		services: ServicesInterface
	):
		| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
		| undefined;
	hueToRGB(
		p: number,
		q: number,
		t: number,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): number;
	narrowToColor(
		color: Color | Color_StringProps,
		utils: UtilitiesInterface
	): Color | null;
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T,
		utils: UtilitiesInterface
	): RangeKeyMap[T];
	validateAndConvertColor(
		color: Color | Color_StringProps | null,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Color | null;
}

export interface CoreUtilsInterface {
	clampToRange(value: number, rangeKey: NumericRangeKey): number;
	clone<T>(value: T): T;
	debounce<T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void;
	getAllElements<T extends HTMLElement>(selector: string): NodeListOf<T>;
	getElement<T extends HTMLElement>(id: string): T | null;
}

export interface DOMUtilsInterface {
	addConversionListener: (
		id: string,
		colorSpace: string,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	) => void;
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void,
		services: ServicesInterface
	): void;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(
		minSwatches: number,
		maxSwatches: number,
		services: ServicesInterface
	): void;
	getCheckboxState(id: string): boolean | void;
	readFile(file: File): Promise<string>;
	switchColorSpaceInDOM(
		targetFormat: ColorSpace,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): void;
	updateColorBox(color: HSL, boxId: string, utils: UtilitiesInterface): void;
	updateHistory(history: Palette[]): void;
	validateStaticElements(services: ServicesInterface): void;
}

export interface FormattingUtilsInterface {
	addHashToHex(hex: Hex, utils: UtilitiesInterface): Hex;
	componentToHex(component: number, services: ServicesInterface): string;
	convertShortHexToLong(hex: string): string;
	formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
	hslAddFormat(
		value: HSL['value'],
		services: ServicesInterface,
		utils: UtilitiesInterface
	): HSL;
	parseColor(
		colorSpace: ColorSpace,
		value: string,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Color | null;
	parseComponents(
		value: string,
		count: number,
		services: ServicesInterface
	): number[];
	stripHashFromHex(
		hex: Hex,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
}

export interface PaletteUtilsInterface {
	createPaletteItem(
		color: HSL,
		itemID: number,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): PaletteItem;
	createPaletteItemArray(
		baseColor: HSL,
		hues: number[],
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): PaletteItem[];
	createPaletteObject(args: PaletteArgs, utils: UtilitiesInterface): Palette;
	generateAllColorValues(
		color: HSL,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): AllColors;
}

export interface SanitationUtilsInterface {
	lab(
		value: number,
		output: 'l' | 'a' | 'b',
		utils: UtilitiesInterface
	): LAB_L | LAB_A | LAB_B;
	percentile(value: number, utils: UtilitiesInterface): Percentile;
	radial(value: number, utils: UtilitiesInterface): Radial;
	rgb(value: number, utils: UtilitiesInterface): ByteRange;
}

export interface TypeGuardUtilsInterface {
	isCMYKColor(value: unknown): value is CMYK;
	isCMYKFormat(color: Color): color is CMYK;
	isCMYKString(value: unknown): value is CMYK_StringProps;
	isColor(value: unknown): value is Color;
	isColorFormat<T extends Color>(
		color: Color,
		format: T['format']
	): color is T;
	isColorSpace(value: unknown): value is ColorSpace;
	isColorSpaceExtended(value: string): value is ColorSpaceExtended;
	isColorString(value: unknown): value is Color_StringProps;
	isConvertibleColor(
		color: Color
	): color is CMYK | Hex | HSL | HSV | LAB | RGB;
	isFormat(format: unknown): format is ColorFormat;
	isHex(value: unknown): value is Hex;
	isHexFormat(color: Color): color is Hex;
	isHSLColor(value: unknown): value is HSL;
	isHSLFormat(color: Color): color is HSL;
	isHSLString(value: unknown): value is HSL_StringProps;
	isHSVColor(value: unknown): value is HSV;
	isHSVFormat(color: Color): color is HSV;
	isHSVString(value: unknown): value is HSV_StringProps;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isLAB(value: unknown): value is LAB;
	isLABFormat(color: Color): color is LAB;
	isPaletteType(value: string): value is PaletteType;
	isRGB(value: unknown): value is RGB;
	isRGBFormat(color: Color): color is RGB;
	isSLColor(value: unknown): value is SL;
	isSLFormat(color: Color): color is SL;
	isSLString(value: unknown): value is SL_StringProps;
	isSVColor(value: unknown): value is SV;
	isSVFormat(color: Color): color is SV;
	isSVString(value: unknown): value is SV_StringProps;
	isXYZ(value: unknown): value is XYZ;
	isXYZFormat(color: Color): color is XYZ;
}

export interface ValidationUtilsInterface {
	colorValue(color: Color | SL | SV, utils: UtilitiesInterface): boolean;
	ensureHash(value: string): string;
	hex(value: string, pattern: RegExp): boolean;
	hexComponent(value: string): boolean;
	hexSet(value: string): boolean;
	range<T extends keyof DataSetsInterface>(
		value: number | string,
		rangeKey: T
	): void;
	userColorInput(color: string): boolean;
}
