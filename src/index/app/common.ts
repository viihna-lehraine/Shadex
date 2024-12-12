// File: src/index/app/common.ts

import {
	AlphaRange,
	ByteRange,
	CMYK,
	CMYKString,
	CMYKUnbranded,
	Color,
	ColorDataExtended,
	ColorDataAssertion,
	ColorSpace,
	ColorSpaceExtended,
	ColorString,
	ColorUnbranded,
	Format,
	GenButtonArgs,
	Hex,
	HexComponent,
	HexSet,
	HexUnbranded,
	HexValue,
	HSL,
	HSLString,
	HSLUnbranded,
	HSLValue,
	HSV,
	HSVUnbranded,
	HSVString,
	LAB,
	LAB_L,
	LAB_A,
	LAB_B,
	LABUnbranded,
	MakePaletteBox,
	NumericRangeKey,
	Palette,
	PaletteItem,
	PaletteUnbranded,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	RGBUnbranded,
	RGBValue,
	SL,
	SLString,
	SLUnbranded,
	StoredPalette,
	SV,
	SVString,
	SVUnbranded,
	XYZ,
	XYZUnbranded,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../index.js';
import { data } from '../../data/index.js';

const _sets = data.sets;

// ******** CORE ********

export interface CommonCoreFnBase {
	clampToRange(value: number, rangeKey: NumericRangeKey): number;
	clone<T>(value: T): T;
	debounce<T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void;
	parseCustomColor(rawValue: string): HSL | null;
}

export interface CommonCoreFnBrand {
	asAlphaRange(value: number): AlphaRange;
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T
	): RangeKeyMap[T];
	asHexComponent(value: string): HexComponent;
	asHexSet(value: string): HexSet;
	asByteRange(value: number): ByteRange;
	asHexComponent(value: string): HexComponent;
	asHexSet(value: string): HexSet;
	asLAB_L(value: number): LAB_L;
	asLAB_A(value: number): LAB_A;
	asLAB_B(value: number): LAB_B;
	asPercentile(value: number): Percentile;
	asRadial(value: number): Radial;
	asXYZ_X(value: number): XYZ_X;
	asXYZ_Y(value: number): XYZ_Y;
	asXYZ_Z(value: number): XYZ_Z;
}

export interface CommonCoreFnBrandColor {
	asCMYK(color: CMYKUnbranded): CMYK;
	asHex(color: HexUnbranded): Hex;
	asHSL(color: HSLUnbranded): HSL;
	asHSV(color: HSVUnbranded): HSV;
	asLAB(color: LABUnbranded): LAB;
	asRGB(color: RGBUnbranded): RGB;
	asSL(color: SLUnbranded): SL;
	asSV(color: SVUnbranded): SV;
	asXYZ(color: XYZUnbranded): XYZ;
}

export interface CommonCoreFnConvert {
	hexAlphaToNumericAlpha(hexAlpha: string): number;
	toColor(colorString: ColorString): Color;
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T
	): RangeKeyMap[T];
	toCSSColorString(color: Color): string;
}

export interface CommonCoreFnGuards {
	isColor(value: unknown): value is Color;
	isColorString(value: unknown): value is ColorString;
	isInRange<T extends keyof typeof _sets>(
		value: number | string,
		rangeKey: T
	): boolean;
}

export interface CommonCoreFnSanitize {
	lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
	percentile(value: number): Percentile;
	radial(value: number): Radial;
	rgb(value: number): ByteRange;
}

export interface CommonCoreFnValidate {
	colorValues(color: Color | SL | SV): boolean;
	hex(value: string, pattern: RegExp): boolean;
	hexComponent(value: string): boolean;
	hexSet(value: string): boolean;
	range<T extends keyof typeof _sets>(
		value: number | string,
		rangeKey: T
	): void;
}

export interface CommonCoreFnMasterInterface {
	base: CommonCoreFnBase;
	brand: CommonCoreFnBrand;
	brandColor: CommonCoreFnBrandColor;
	convert: CommonCoreFnConvert;
	guards: CommonCoreFnGuards;
	sanitize: CommonCoreFnSanitize;
	validate: CommonCoreFnValidate;
}

// ******** DOM ********

export interface CommonDOMBase {
	getElement<T extends HTMLElement>(id: string): T | null;
}

export interface CommonDOMFnMasterInterface extends CommonDOMBase {}

// ******** Helpers ********

export interface CommonHelpersConversion {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: RGB): RGB;
	hueToRGB(p: number, q: number, t: number): number;
	hslAddFormat(value: HSLValue): HSL;
}

export interface CommonHelpersDOM_Handle {
	dragStart(e: DragEvent): void;
	dragOver(e: DragEvent): boolean;
	dragEnd(e: DragEvent): void;
	drop(e: DragEvent): void;
}

export interface CommonHelpersDOM {
	attachDragAndDropListeners(element: HTMLElement | null): void;
	handle: CommonHelpersDOM_Handle;
	makePaletteBox(color: Color, paletteBoxCount: number): MakePaletteBox;
	showToast(message: string): void;
	showTooltip(tooltipElement: HTMLElement): void;
	validateAndConvertColor(color: Color | ColorString | null): Color | null;
}

export interface CommonHelpersFnMasterInterface {
	conversion: CommonHelpersConversion;
	dom: CommonHelpersDOM;
}

// ******** SuperUtils ********

export interface CommonSuperUtilsDOM {
	genPaletteBox(
		items: PaletteItem[],
		numBoxes: number,
		tableId: string
	): Promise<void>;
	getGenButtonArgs(): GenButtonArgs | null;
	switchColorSpace(targetFormat: ColorSpace): void;
}

export interface CommonSuperUtilsFnMasterInterface {
	dom: CommonSuperUtilsDOM;
}

// ******** UTILS ********

export interface CommonUtilsFnColor {
	isColorFormat<T extends Color>(
		color: Color,
		format: T['format']
	): color is T;
	isColorSpace(value: string): value is ColorSpace;
	isColorSpaceExtended(value: string): value is ColorSpaceExtended;
	isColorString(value: unknown): value is ColorString;
	isFormat(format: unknown): format is Format;
	isCMYKColor(value: unknown): value is CMYK;
	isCMYKFormat(color: Color): color is CMYK;
	isCMYKString(value: unknown): value is CMYKString;
	isHex(value: unknown): value is Hex;
	isHexFormat(color: Color): color is Hex;
	isHSLColor(value: unknown): value is HSL;
	isHSLFormat(color: Color): color is HSL;
	isHSLString(value: unknown): value is HSLString;
	isHSVColor(value: unknown): value is HSV;
	isHSVFormat(color: Color): color is HSV;
	isHSVString(value: unknown): value is HSVString;
	isLAB(value: unknown): value is LAB;
	isLABFormat(color: Color): color is LAB;
	isRGB(value: unknown): value is RGB;
	isRGBFormat(color: Color): color is RGB;
	isSLColor(value: unknown): value is SL;
	isSLFormat(color: Color): color is SL;
	isSLString(value: unknown): value is SLString;
	isSVColor(value: unknown): value is SV;
	isSVFormat(color: Color): color is SV;
	isSVString(value: unknown): value is SVString;
	isXYZ(value: unknown): value is XYZ;
	isXYZFormat(color: Color): color is XYZ;
	ensureHash(value: string): string;
	isConvertibleColor(
		color: Color
	): color is CMYK | Hex | HSL | HSV | LAB | RGB;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isStoredPalette(obj: unknown): obj is StoredPalette;
	narrowToColor(color: Color | ColorString): Color | null;
	addHashToHex(hex: Hex): Hex;
	colorToColorString(color: Color): ColorString;
	componentToHex(component: number): string;
	formatColor(
		color: Color,
		asColorString: boolean,
		asCSSString: boolean
	): { baseColor: Color; formattedString?: ColorString | string };
	formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
	getAlphaFromHex(hex: string): number;
	getColorString(color: Color): string | null;
	hexAlphaToNumericAlpha(hexAlpha: string): number;
	parseColor(color: ColorSpace, value: string): Color | null;
	parseComponents(value: string, count: number): number[];
	parseHexWithAlpha(hexValue: string): HexValue | null;
	stripHashFromHex(hex: Hex): Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
	toHexWithAlpha(rgbValue: RGBValue): string;
}

export interface CommonUtilsFnConversion {
	getConversionFn<
		From extends keyof ColorDataAssertion,
		To extends keyof ColorDataAssertion
	>(
		from: From,
		to: To
	):
		| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
		| undefined;
	genAllColorValues(color: HSL): Partial<ColorDataExtended>;
}

export interface CommonUtilsFnPalette {
	createObject(
		type: string,
		items: PaletteItem[],
		baseColor: HSL,
		numBoxes: number,
		paletteID: number,
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Palette;
	populateOutputBox(color: Color | ColorString, boxNumber: number): void;
}

export interface CommonUtilsFnRandom {
	hsl(enableAlpha: boolean): HSL;
	sl(enableAlpha: boolean): SL;
}

export interface CommonUtilsFnMasterInterface {
	color: CommonUtilsFnColor;
	conversion: CommonUtilsFnConversion;
	palette: CommonUtilsFnPalette;
	random: CommonUtilsFnRandom;
}

// ******** Transform ********

export interface CommonTransformFnBase {
	brandPalette(data: PaletteUnbranded): Palette;
	defaultColorValue(color: ColorUnbranded): Color;
}

export interface CommonTransformFnMasterInterface
	extends CommonTransformFnBase {}

// ******** Final Bundle ********

export interface CommonFnMasterInterface {
	core: CommonCoreFnMasterInterface;
	helpers: CommonHelpersFnMasterInterface;
	superUtils: CommonSuperUtilsFnMasterInterface;
	transform: CommonTransformFnMasterInterface;
	utils: CommonUtilsFnMasterInterface;
}
