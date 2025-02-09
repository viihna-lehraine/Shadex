// File: types/app/common/main.js

import {
	AdjustmentUtilsInterface,
	BrandingUtilsInterface,
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
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_A,
	LAB_B,
	LAB_L,
	NumericRangeKey,
	Palette,
	PaletteArgs,
	PaletteItem,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
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
	ValidateFn,
	ValidationUtilsInterface,
	XYZ,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from '../../index.js';
import { dataSets as sets } from '../../../data/sets.js';

export interface UtilitiesInterface {
	adjustment: {
		adjustSL(
			color: HSL,
			brandingUtils: BrandingUtilsInterface,
			validationUtils: ValidationUtilsInterface
		): HSL;
		applyGammaCorrection(value: number): number;
		clampRGB(rgb: RGB): RGB;
	};
	branding: {
		asBranded<T extends keyof RangeKeyMap>(
			value: number,
			rangeKey: T,
			validate: ValidateFn
		): RangeKeyMap[T];
		asByteRange(value: number, validate: ValidateFn): ByteRange;
		asCMYK(color: UnbrandedCMYK, validate: ValidateFn): CMYK;
		asHex(color: UnbrandedHex, validate: ValidateFn): Hex;
		asHexSet(
			value: string,
			validateHexSet: (value: string) => boolean
		): HexSet;
		asHSL(color: UnbrandedHSL, validate: ValidateFn): HSL;
		asHSV(color: UnbrandedHSV, validate: ValidateFn): HSV;
		asLAB(color: UnbrandedLAB, validate: ValidateFn): LAB;
		asLAB_L(value: number, validate: ValidateFn): LAB_L;
		asLAB_A(value: number, validate: ValidateFn): LAB_A;
		asLAB_B(value: number, validate: ValidateFn): LAB_B;
		asPercentile(value: number, validate: ValidateFn): Percentile;
		asRadial(value: number, validate: ValidateFn): Radial;
		asRGB(color: UnbrandedRGB, validate: ValidateFn): RGB;
		asSL(color: UnbrandedSL, validate: ValidateFn): SL;
		asSV(color: UnbrandedSV, validate: ValidateFn): SV;
		asXYZ(color: UnbrandedXYZ, validate: ValidateFn): XYZ;
		asXYZ_X(value: number, validate: ValidateFn): XYZ_X;
		asXYZ_Y(value: number, validate: ValidateFn): XYZ_Y;
		asXYZ_Z(value: number, validate: ValidateFn): XYZ_Z;
		brandColor(color: UnbrandedColor): Color;
		brandPalette(data: UnbrandedPalette): Palette;
	};
	color: {
		convertColorToColorString(color: Color): Color_StringProps;
		convertHSLTo(color: HSL, colorSpace: ColorSpaceExtended): Color;
		convertToHSL(color: Exclude<Color, SL | SV>): HSL;
		generateRandomHSL(): HSL;
		generateRandomSL(): SL;
		getColorString(color: Color): string | null;
		getConversionFn<
			From extends keyof ColorDataAssertion,
			To extends keyof ColorDataAssertion
		>(
			from: From,
			to: To
		):
			| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
			| undefined;
		narrowToColor(color: Color | Color_StringProps): Promise<Color | null>;
		hexToHSLWrapper(input: string | Hex): HSL;
		validateAndConvertColor(
			color: Color | Color_StringProps | null
		): Promise<Color | null>;
	};
	core: {
		clampToRange(value: number, rangeKey: NumericRangeKey): number;
		clone<T>(value: T): T;
		debounce<T extends (...args: Parameters<T>) => void>(
			func: T,
			delay: number
		): (...args: Parameters<T>) => void;
	};
	dom: {
		addConversionListener: (id: string, colorSpace: string) => void;
		addEventListener<K extends keyof HTMLElementEventMap>(
			id: string,
			eventType: K,
			callback: (ev: HTMLElementEventMap[K]) => void
		): void;
		downloadFile(data: string, filename: string, type: string): void;
		populateOutputBox(
			color: Color | Color_StringProps,
			boxNumber: number
		): Promise<void>;
		readFile(file: File): Promise<string>;
		switchColorSpaceInDOM(targetFormat: ColorSpace): Promise<void>;
		updateColorBox(color: HSL, index: number): void;
	};
	format: {
		addHashToHex(hex: Hex): Hex;
		componentToHex(component: number): string;
		formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
		hslAddFormat(value: HSL['value']): HSL;
		parseColor(color: ColorSpace, value: string): Color | null;
		parseComponents(value: string, count: number): number[];
		stripHashFromHex(hex: Hex): Hex;
		stripPercentFromValues<T extends Record<string, number | string>>(
			value: T
		): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
	};
	palette: {
		createPaletteObject(args: PaletteArgs): Palette;
		createPaletteItem: (color: HSL) => Promise<PaletteItem>;
		createPaletteItemArray(
			baseColor: HSL,
			hues: number[],
			limitDark: boolean,
			limitGray: boolean,
			limitLight: boolean
		): Promise<PaletteItem[]>;
		enforceSwatchRules(minSwatches: number, maxSwatches?: number): void;
		generateAllColorValuesHues(color: HSL): Partial<ColorDataExtended>;
		generateAnalogousHues: (color: HSL, numBoxes: number) => number[];
		generateDiadicHues: (baseHue: number) => number[];
		generateHexadicHues: (color: HSL) => number[];
		generateSplitComplementaryHues: (baseHue: number) => number[];
		generateTetradicHues: (baseHue: number) => number[];
		generateTriadicHues: (baseHue: number) => number[];
		getWeightedRandomInterval(): number;
		isHSLInBounds(hsl: HSL): boolean;
		isHSLTooDark(hsl: HSL): boolean;
		isHSLTooGray(hsl: HSL): boolean;
		isHSLTooLight(hsl: HSL): boolean;
	};
	sanitize: {
		lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
		percentile(value: number): Percentile;
		radial(value: number): Radial;
		rgb(value: number): ByteRange;
	};
	typeGuards: {
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
		isInputElement(element: HTMLElement | null): element is HTMLElement;
		isStoredPalette(obj: unknown): obj is StoredPalette;
	};
	validate: {
		colorValue(color: Color | SL | SV): Promise<boolean>;
		ensureHash(value: string): string;
		hex(value: string, pattern: RegExp): boolean;
		hexComponent(value: string): boolean;
		hexSet(value: string): boolean;
		range<T extends keyof typeof sets>(
			value: number | string,
			rangeKey: T
		): void;
	};
}
