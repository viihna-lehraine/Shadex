// File: types/app/common.js

import {
	ByteRange,
	CMYK,
	CMYK_StringProps,
	Color,
	ColorDataExtended,
	ColorDataAssertion,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	Color_StringProps,
	Hex,
	HexSet,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	LAB_L,
	LAB_A,
	LAB_B,
	MakePaletteBox,
	NumericRangeKey,
	Palette,
	PaletteGenerationArgs,
	PaletteItem,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	RGB_StringProps,
	SL,
	SL_StringProps,
	StoredPalette,
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
} from '../index.js';
import { dataSets as sets } from '../../data/sets.js';

const _sets = sets;

export interface CommonFn_MasterInterface {
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
			asBranded<T extends keyof RangeKeyMap>(
				value: number,
				rangeKey: T
			): RangeKeyMap[T];
			asByteRange(value: number): ByteRange;
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
			asCMYK(color: UnbrandedCMYK): CMYK;
			asHex(color: UnbrandedHex): Hex;
			asHSL(color: UnbrandedHSL): HSL;
			asHSV(color: UnbrandedHSV): HSV;
			asLAB(color: UnbrandedLAB): LAB;
			asRGB(color: UnbrandedRGB): RGB;
			asSL(color: UnbrandedSL): SL;
			asSV(color: UnbrandedSV): SV;
			asXYZ(color: UnbrandedXYZ): XYZ;
		};
		convert: {
			colorStringToColor(colorString: Color_StringProps): Promise<Color>;
			colorToCSSColorString(color: Color): Promise<string>;
			stringToValue: {
				cmyk(cmyk: CMYK_StringProps['value']): CMYK['value'];
				hex(hex: Hex_StringProps['value']): Hex['value'];
				hsl(hsl: HSL_StringProps['value']): HSL['value'];
				hsv(hsv: HSV_StringProps['value']): HSV['value'];
				lab(lab: LAB_StringProps['value']): LAB['value'];
				rgb(rgb: RGB_StringProps['value']): RGB['value'];
				xyz(xyz: XYZ_StringProps['value']): XYZ['value'];
			};
			toColorValueRange<T extends keyof RangeKeyMap>(
				value: string | number,
				rangeKey: T
			): RangeKeyMap[T];
			valueToString: {
				cmyk(cmyk: CMYK['value']): CMYK_StringProps['value'];
				hex(hex: Hex['value']): Hex_StringProps['value'];
				hsl(hsl: HSL['value']): HSL_StringProps['value'];
				hsv(hsv: HSV['value']): HSV_StringProps['value'];
				lab(lab: LAB['value']): LAB_StringProps['value'];
				rgb(rgb: RGB['value']): RGB_StringProps['value'];
				xyz(xyz: XYZ['value']): XYZ_StringProps['value'];
			};
		};
		getFormattedTimestamp(): string;
		guards: {
			isColor(value: unknown): value is Color;
			isColorSpace(value: unknown): value is ColorSpace;
			isColorString(value: unknown): value is Color_StringProps;
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
			hslAddFormat(value: HSL['value']): HSL;
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
				color: Color | Color_StringProps | null
			): Promise<Color | null>;
		};
	};
	superUtils: {
		dom: {
			getPaletteGenerationArgs(): PaletteGenerationArgs | null;
			switchColorSpace(targetFormat: ColorSpace): Promise<void>;
		};
	};
	transform: {
		addHashToHex(hex: Hex): Hex;
		componentToHex(component: number): string;
		brandPalette(data: UnbrandedPalette): Palette;
		defaultColorValue(color: UnbrandedColor): Color;
	};
	utils: {
		color: {
			colorToColorString(color: Color): Color_StringProps;
			isColorFormat<T extends Color>(
				color: Color,
				format: T['format']
			): color is T;
			isColorSpace(value: string): value is ColorSpace;
			isColorSpaceExtended(value: string): value is ColorSpaceExtended;
			isColorString(value: unknown): value is Color_StringProps;
			isFormat(format: unknown): format is ColorFormat;
			isCMYKColor(value: unknown): value is CMYK;
			isCMYKFormat(color: Color): color is CMYK;
			isCMYKString(value: unknown): value is CMYK_StringProps;
			isHex(value: unknown): value is Hex;
			isHexFormat(color: Color): color is Hex;
			isHSLColor(value: unknown): value is HSL;
			isHSLFormat(color: Color): color is HSL;
			isHSLString(value: unknown): value is HSL_StringProps;
			isHSVColor(value: unknown): value is HSV;
			isHSVFormat(color: Color): color is HSV;
			isHSVString(value: unknown): value is HSV_StringProps;
			isLAB(value: unknown): value is LAB;
			isLABFormat(color: Color): color is LAB;
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
			ensureHash(value: string): string;
			isConvertibleColor(
				color: Color
			): color is CMYK | Hex | HSL | HSV | LAB | RGB;
			isInputElement(element: HTMLElement | null): element is HTMLElement;
			isStoredPalette(obj: unknown): obj is StoredPalette;
			narrowToColor(
				color: Color | Color_StringProps
			): Promise<Color | null>;
			formatPercentageValues<T extends Record<string, unknown>>(
				value: T
			): T;
			getColorString(color: Color): string | null;
			parseColor(color: ColorSpace, value: string): Color | null;
			parseComponents(value: string, count: number): number[];
			stripHashFromHex(hex: Hex): Hex;
			stripPercentFromValues<T extends Record<string, number | string>>(
				value: T
			): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
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
				limitDark: boolean,
				limitGray: boolean,
				limitLight: boolean
			): Palette;
			populateOutputBox(
				color: Color | Color_StringProps,
				boxNumber: number
			): Promise<void>;
		};
		random: {
			hsl(): HSL;
			sl(): SL;
		};
	};
}
