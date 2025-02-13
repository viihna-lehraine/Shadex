// File: app/utils/partials.js

import {
	AppServicesInterface,
	ByteRange,
	CMYK,
	CMYK_StringProps,
	Color,
	ColorDataAssertion,
	ColorDataExtended,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	Color_StringProps,
	ColorUtilHelpersInterface,
	DataSetsInterface,
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
	XYZ_Z
} from '../../../types/index.js';

export interface AdjustmentUtilsInterface {
	adjustSL(
		color: HSL,
		appServices: AppServicesInterface,
		brandingUtils: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	applyGammaCorrection(
		value: number,
		appServices: AppServicesInterface
	): number;
	clampRGB(
		rgb: RGB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB;
}

export interface AppUtilsInterface {
	generateRandomHSL(
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	generateRandomSL(
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): SL;
	getFormattedTimestamp(): string;
}

export interface BrandingUtilsInterface {
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T,
		validate: ValidationUtilsInterface
	): RangeKeyMap[T];
	asByteRange(value: number, validate: ValidationUtilsInterface): ByteRange;
	asCMYK(color: UnbrandedCMYK, validate: ValidationUtilsInterface): CMYK;
	asHex(
		color: UnbrandedHex,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Hex;
	asHexSet(value: string, validate: ValidationUtilsInterface): HexSet;
	asHSL(color: UnbrandedHSL, validate: ValidationUtilsInterface): HSL;
	asHSV(color: UnbrandedHSV, validate: ValidationUtilsInterface): HSV;
	asLAB(color: UnbrandedLAB, validate: ValidationUtilsInterface): LAB;
	asLAB_A(value: number, validate: ValidationUtilsInterface): LAB_A;
	asLAB_B(value: number, validate: ValidationUtilsInterface): LAB_B;
	asLAB_L(value: number, validate: ValidationUtilsInterface): LAB_L;
	asPercentile(value: number, validate: ValidationUtilsInterface): Percentile;
	asRadial(value: number, validate: ValidationUtilsInterface): Radial;
	asRGB(color: UnbrandedRGB, validate: ValidationUtilsInterface): RGB;
	asSL(color: UnbrandedSL, validate: ValidationUtilsInterface): SL;
	asSV(color: UnbrandedSV, validate: ValidationUtilsInterface): SV;
	asXYZ(color: UnbrandedXYZ, validate: ValidationUtilsInterface): XYZ;
	asXYZ_X(value: number, validate: ValidationUtilsInterface): XYZ_X;
	asXYZ_Y(value: number, validate: ValidationUtilsInterface): XYZ_Y;
	asXYZ_Z(value: number, validate: ValidationUtilsInterface): XYZ_Z;
	brandColor(
		color: UnbrandedColor,
		validate: ValidationUtilsInterface
	): Color;
	brandPalette(
		data: UnbrandedPalette,
		validate: ValidationUtilsInterface
	): Palette;
}

export interface ColorUtilsInterface {
	convertCMYKStringToValue(
		cmyk: CMYK_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): CMYK['value'];
	convertCMYKValueToString(cmyk: CMYK['value']): CMYK_StringProps['value'];
	convertColorStringToColor(
		colorString: Color_StringProps,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): Color;
	convertColorToColorString(
		color: Color,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		formattingUtils: FormattingUtilsInterface,
		typeGuards: TypeGuardUtilsInterface
	): Color_StringProps;
	convertColorToCSS(color: Color): string;
	convertCSSToColor(
		color: string,
		format: FormattingUtilsInterface
	): Exclude<Color, SL | SV> | null;
	convertHexStringToValue(
		hex: Hex_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Hex['value'];
	convertHexValueToString(hex: Hex['value']): Hex_StringProps['value'];
	convertHSL(
		color: HSL,
		colorSpace: ColorSpaceExtended,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): Color;
	convertHSLStringToValue(
		hsl: HSL_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL['value'];
	convertHSLValueToString(hsl: HSL['value']): HSL_StringProps['value'];
	convertHSVStringToValue(
		hsv: HSV_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): HSV['value'];
	convertHSVValueToString(hsv: HSV['value']): HSV_StringProps['value'];
	convertLABStringToValue(
		lab: LAB_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): LAB['value'];
	convertLABValueToString(lab: LAB['value']): LAB_StringProps['value'];
	convertRGBStringToValue(
		rgb: RGB_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB['value'];
	convertRGBValueToString(rgb: RGB['value']): RGB_StringProps['value'];
	convertToHSL(
		color: Exclude<Color, SL | SV>,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	convertXYZStringToValue(
		xyz: XYZ_StringProps['value'],
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): XYZ['value'];
	convertXYZValueToString(xyz: XYZ['value']): XYZ_StringProps['value'];
	getColorString(
		color: Color,
		log: AppServicesInterface['log']
	): string | null;
	getConversionFn<
		From extends keyof ColorDataAssertion,
		To extends keyof ColorDataAssertion
	>(
		from: From,
		to: To,
		conversionUtils: ColorUtilHelpersInterface,
		log: AppServicesInterface['log']
	):
		| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
		| undefined;
	hueToRGB(
		p: number,
		q: number,
		t: number,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log']
	): number;
	narrowToColor(
		color: Color | Color_StringProps,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		typeGuards: TypeGuardUtilsInterface,
		validate: ValidationUtilsInterface
	): Color | null;
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): RangeKeyMap[T];
	validateAndConvertColor(
		color: Color | Color_StringProps | null,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		typeGuards: TypeGuardUtilsInterface,
		validate: ValidationUtilsInterface
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
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		conversionUtils: ColorUtilHelpersInterface,
		coreUtils: CoreUtilsInterface,
		typeGuards: TypeGuardUtilsInterface,
		validate: ValidationUtilsInterface
	) => void;
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void,
		appServices: AppServicesInterface
	): void;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(
		minSwatches: number,
		maxSwatches: number,
		appServices: AppServicesInterface
	): void;
	getCheckboxState(id: string): boolean | void;
	readFile(file: File): Promise<string>;
	switchColorSpaceInDOM(
		targetFormat: ColorSpace,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		conversionUtils: ColorUtilHelpersInterface,
		coreUtils: CoreUtilsInterface,
		typeGuards: TypeGuardUtilsInterface,
		validate: ValidationUtilsInterface
	): void;
	updateColorBox(
		color: HSL,
		boxId: string,
		colorUtils: ColorUtilsInterface
	): void;
	updateHistory(history: Palette[]): void;
	validateStaticElements(appServices: AppServicesInterface): void;
}

export interface FormattingUtilsInterface {
	addHashToHex(
		hex: Hex,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Hex;
	componentToHex(
		component: number,
		appServices: AppServicesInterface
	): string;
	convertShortHexToLong(hex: string): string;
	formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
	hslAddFormat(
		value: HSL['value'],
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	parseColor(
		colorSpace: ColorSpace,
		value: string,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Color | null;
	parseComponents(
		value: string,
		count: number,
		appServices: AppServicesInterface
	): number[];
	stripHashFromHex(
		hex: Hex,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
}

export interface PaletteUtilsInterface {
	createPaletteItem(
		color: HSL,
		itemID: number,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		sanitize: SanitationUtilsInterface,
		typeGuards: TypeGuardUtilsInterface,
		validate: ValidationUtilsInterface
	): PaletteItem;
	createPaletteItemArray(
		baseColor: HSL,
		hues: number[],
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		sanitize: SanitationUtilsInterface,
		typeGuards: TypeGuardUtilsInterface,
		validate: ValidationUtilsInterface
	): PaletteItem[];
	createPaletteObject(
		args: PaletteArgs,
		appUtils: AppUtilsInterface
	): Palette;
	generateAllColorValues(
		color: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): Partial<ColorDataExtended>;
}

export interface SanitationUtilsInterface {
	lab(
		value: number,
		output: 'l' | 'a' | 'b',
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): LAB_L | LAB_A | LAB_B;
	percentile(
		value: number,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Percentile;
	radial(
		value: number,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): Radial;
	rgb(
		value: number,
		colorUtils: ColorUtilsInterface,
		brand: BrandingUtilsInterface,
		validate: ValidationUtilsInterface
	): ByteRange;
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
	colorValue(color: Color | SL | SV, coreUtils: CoreUtilsInterface): boolean;
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
