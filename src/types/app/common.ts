// File: src/types/app/common.js

import {
	AlphaRange,
	ByteRange,
	CMYK,
	CMYKString,
	CMYKUnbranded,
	CMYKValue,
	CMYKValueString,
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
	HexValueString,
	HSL,
	HSLString,
	HSLUnbranded,
	HSLValue,
	HSLValueString,
	HSV,
	HSVUnbranded,
	HSVString,
	HSVValue,
	HSVValueString,
	LAB,
	LABUnbranded,
	LABValue,
	LABValueString,
	LAB_L,
	LAB_A,
	LAB_B,
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
	RGBValueString,
	SL,
	SLString,
	SLUnbranded,
	StoredPalette,
	SV,
	SVString,
	SVUnbranded,
	XYZ,
	XYZUnbranded,
	XYZValue,
	XYZValueString,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../index.js';
import { sets } from '../../common/data/sets.js';

const _sets = sets;

export interface CommonDOMBase {
	getElement<T extends HTMLElement>(
		id: string,
		mode: { logging: { warn: boolean }; debugLevel: number }
	): Promise<T | null>;
}

export interface CommonDOMFnMasterInterface extends CommonDOMBase {}

// ******** Final Bundle ********

export interface CommonFunctionsMasterInterface {
	convert: {
		hslTo(color: HSL, colorSpace: ColorSpaceExtended): Color;
		toHSL(color: Exclude<Color, SL | SV>): HSL;
		wrappers: {
			hexToHSL(input: string | Hex): HSL;
		};
	};
	core: {
		base: {
			clampToRange(value: number, rangeKey: NumericRangeKey): number;
			clone<T>(value: T): T;
			debounce<T extends (...args: Parameters<T>) => void>(
				func: T,
				delay: number
			): (...args: Parameters<T>) => void;
			parseCustomColor(rawValue: string): HSL | null;
		};
		brand: {
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
		};
		brandColor: {
			asCMYK(color: CMYKUnbranded): CMYK;
			asHex(color: HexUnbranded): Hex;
			asHSL(color: HSLUnbranded): HSL;
			asHSV(color: HSVUnbranded): HSV;
			asLAB(color: LABUnbranded): LAB;
			asRGB(color: RGBUnbranded): RGB;
			asSL(color: SLUnbranded): SL;
			asSV(color: SVUnbranded): SV;
			asXYZ(color: XYZUnbranded): XYZ;
		};
		convert: {
			colorStringToColor(colorString: ColorString): Promise<Color>;
			colorToCSSColorString(color: Color): Promise<string>;
			hexAlphaToNumericAlpha(hexAlpha: string): number;
			stringToValue: {
				cmyk(cmyk: CMYKValueString): CMYKValue;
				hex(hex: HexValueString): HexValue;
				hsl(hsl: HSLValueString): HSLValue;
				hsv(hsv: HSVValueString): HSVValue;
				lab(lab: LABValueString): LABValue;
				rgb(rgb: RGBValueString): RGBValue;
				xyz(xyz: XYZValueString): XYZValue;
			};
			toColorValueRange<T extends keyof RangeKeyMap>(
				value: string | number,
				rangeKey: T
			): RangeKeyMap[T];
			valueToString: {
				cmyk(cmyk: CMYKValue): CMYKValueString;
				hex(hex: HexValue): HexValueString;
				hsl(hsl: HSLValue): HSLValueString;
				hsv(hsv: HSVValue): HSVValueString;
				lab(lab: LABValue): LABValueString;
				rgb(rgb: RGBValue): RGBValueString;
				xyz(xyz: XYZValue): XYZValueString;
			};
		};
		getFormattedTimestamp(): string;
		guards: {
			isColor(value: unknown): value is Color;
			isColorSpace(value: unknown): value is ColorSpace;
			isColorString(value: unknown): value is ColorString;
			isInRange<T extends keyof typeof _sets>(
				value: number | string,
				rangeKey: T
			): boolean;
		};
		sanitize: {
			lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
			percentile(value: number): Percentile;
			radial(value: number): Radial;
			rgb(value: number): ByteRange;
		};
		validate: {
			colorValues(color: Color | SL | SV): boolean;
			hex(value: string, pattern: RegExp): boolean;
			hexComponent(value: string): boolean;
			hexSet(value: string): boolean;
			range<T extends keyof typeof _sets>(
				value: number | string,
				rangeKey: T
			): void;
		};
	};
	helpers: {
		conversion: {
			applyGammaCorrection(value: number): number;
			clampRGB(rgb: RGB): RGB;
			hslAddFormat(value: HSLValue): HSL;
			hueToRGB(p: number, q: number, t: number): number;
		};
		dom: {
			attachDragAndDropListeners(element: HTMLElement | null): void;
			handle: {
				dragStart(e: DragEvent): void;
				dragOver(e: DragEvent): boolean;
				dragEnd(e: DragEvent): void;
				drop(e: DragEvent): void;
			};
			makePaletteBox(
				color: Color,
				paletteBoxCount: number
			): Promise<MakePaletteBox>;
			showToast(message: string): void;
			showTooltip(tooltipElement: HTMLElement): void;
			validateAndConvertColor(
				color: Color | ColorString | null
			): Promise<Color | null>;
		};
	};
	superUtils: {
		dom: {
			getGenButtonArgs(): GenButtonArgs | null;
			switchColorSpace(targetFormat: ColorSpace): Promise<void>;
		};
	};
	transform: {
		addHashToHex(hex: Hex): Hex;
		componentToHex(component: number): string;
		brandPalette(data: PaletteUnbranded): Palette;
		defaultColorValue(color: ColorUnbranded): Color;
	};
	utils: {
		color: {
			colorToColorString(color: Color): ColorString;
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
			narrowToColor(color: Color | ColorString): Promise<Color | null>;
			formatPercentageValues<T extends Record<string, unknown>>(
				value: T
			): T;
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
		};
		conversion: {
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
		};
		errors: {
			handleAsync<T>(
				action: () => Promise<T>,
				errorMessage: string,
				context?: Record<string, unknown>
			): Promise<T | null>;
		};
		palette: {
			createObject(
				type: string,
				items: PaletteItem[],
				swatches: number,
				paletteID: number,
				enableAlpha: boolean,
				limitDark: boolean,
				limitGray: boolean,
				limitLight: boolean
			): Palette;
			populateOutputBox(
				color: Color | ColorString,
				boxNumber: number
			): Promise<void>;
		};
		random: {
			hsl(enableAlpha: boolean): HSL;
			sl(enableAlpha: boolean): SL;
		};
	};
}
