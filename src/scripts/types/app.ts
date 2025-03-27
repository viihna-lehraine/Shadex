// File: src/scripts/types/app.ts

import {
	AllColors,
	ByteRange,
	CMYK,
	CMYKNumMap,
	CMYKStringMap,
	Color,
	ColorNumMap,
	ColorDataAssertion,
	ColorFormat,
	ColorSpace,
	ColorStringMap,
	Hex,
	HexSet,
	HexNumMap,
	HexStringMap,
	HSL,
	HSLNumMap,
	HSLStringMap,
	NumericBrandedType,
	NumericRangeKey,
	Palette,
	PaletteItem,
	PaletteType,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	RGBNumMap,
	RGBStringMap,
	SelectedPaletteOptions,
	SetsData,
	UnbrandedPalette
} from './index.js';
import { LoggerService } from '../core/services/index.js';

// ******** 1. SERVICES ********

export interface Services {
	errors: ErrorHandlerContract;
	log: LoggerService;
	storage: StorageManagerContract;
}

// ******** 2. HELPERS ********

export interface ColorHelpers {
	getConversionFn<
		From extends keyof ColorDataAssertion,
		To extends keyof ColorDataAssertion
	>(
		from: From,
		to: To
	):
		| ((value: ColorDataAssertion[From]) => ColorDataAssertion[To])
		| undefined;
	hueToRGB(p: number, q: number, t: number): number;
}

export interface DataHelpers {
	deepClone<T>(value: T): T;
	deepFreeze<T>(obj: T): T;
	getCallerInfo: () => string;
	getFormattedTimestamp(): string;
	parseValue: (value: string | number) => number;
	tracePromise(promise: Promise<unknown>, label: string): Promise<unknown>;
}

export interface DOMHelpers {
	getAllElements<T extends HTMLElement>(selector: string): NodeListOf<T>;
	getElement<T extends HTMLElement>(id: string): T | null;
}

export interface MathHelpers {
	clampToRange: (value: number, rangeKey: NumericRangeKey) => number;
}

export interface RandomHelpers {
	selectRandomFromWeights(obj: {
		weights: readonly number[];
		values: readonly number[];
	}): number;
	selectWeightedRandom(
		weights: readonly number[],
		values: readonly number[]
	): number;
}

export interface TimeHelpers {
	debounce<T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void;
}

export interface TypeGuards {
	hasFormat<T extends { format: string }>(
		value: unknown,
		expectedFormat: string
	): value is T;
	hasNumericProperties(obj: Record<string, unknown>, keys: string[]): boolean;
	hasStringProperties(obj: Record<string, unknown>, keys: string[]): boolean;
	hasValueProperty<T extends { value: unknown }>(value: unknown): value is T;
	isByteRange(value: unknown): value is ByteRange;
	isCMYK(value: unknown): value is CMYK;
	isColor(value: unknown): value is Color;
	isColorNumMap(value: unknown, format?: ColorFormat): value is ColorNumMap;
	isColorSpace(value: unknown): value is ColorSpace;
	isColorStringMap(value: unknown): value is ColorStringMap;
	isConvertibleColor(color: Color): color is CMYK | Hex | HSL | RGB;
	isFormat(format: unknown): format is ColorFormat;
	isHex(value: unknown): value is Hex;
	isHexSet(value: unknown): value is HexSet;
	isHSL(value: unknown): value is HSL;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isObject(value: unknown): value is Record<string, unknown>;
	isPalette(value: unknown): value is Palette;
	isPaletteType(value: string): value is PaletteType;
	isPercentile(value: unknown): value is Percentile;
	isRadial(value: unknown): value is Radial;
	isRGB(value: unknown): value is RGB;
}

// ******** 3. HELPERS ********

export interface Helpers {
	color: ColorHelpers;
	data: DataHelpers;
	dom: DOMHelpers;
	math: MathHelpers;
	random: RandomHelpers;
	time: TimeHelpers;
	typeGuards: TypeGuards;
}

// ******** 4. UTILITIES ********

export interface AdjustmentUtilities {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: RGB): RGB;
	sl(color: HSL): HSL;
}

export interface BrandingUtilities {
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T
	): RangeKeyMap[T];
	asByteRange(value: number): ByteRange;
	asCMYK(color: CMYKNumMap): CMYK;
	asHex(color: HexNumMap): Hex;
	asHexSet(value: string): HexSet;
	asHSL(color: HSLNumMap): HSL;
	asPercentile(value: number): Percentile;
	asRadial(value: number): Radial;
	asRGB(color: RGBNumMap): RGB;
	brandColor(color: ColorNumMap | ColorStringMap): Color;
	brandPalette(data: UnbrandedPalette): Palette;
}

export interface ColorBrandUtilities {
	brandCMYKString(cmyk: CMYKStringMap['value']): CMYK['value'];
	brandColorString(color: ColorStringMap): Color;
	brandHexString(hex: HexStringMap['value']): Hex['value'];
	brandHSLString(hsl: HSLStringMap['value']): HSL['value'];
	brandRGBString(rgb: RGBStringMap['value']): RGB['value'];
}

export interface ColorConversionUtilities {
	cmykToHSL(cmyk: CMYK): HSL;
	cmykToRGB(cmyk: CMYK): RGB;
	convertHSL(color: HSL, colorSpace: ColorSpace): Color;
	convertToHSL(color: Color): HSL;
	hexToHSL(hex: Hex): HSL;
	hexToHSLWrapper(input: string | Hex): HSL;
	hexToRGB(hex: Hex): RGB;
	hslToCMYK(hsl: HSL): CMYK;
	hslToHex(hsl: HSL): Hex;
	hslToRGB(hsl: HSL): RGB;
	rgbToCMYK(rgb: RGB): CMYK;
	rgbToHex(rgb: RGB): Hex;
	rgbToHSL(rgb: RGB): HSL;
}

export interface ColorFormatUtilities {
	formatColorAsCSS(color: Color): string;
	formatColorAsStringMap(color: Color): ColorStringMap;
	formatCSSAsColor(color: string): Color | null;
}

export interface ColorGenerationUtilities {
	generateRandomHSL(): HSL;
}

export interface ColorParsingUtilities {
	parseHexValueAsStringMap(hex: Hex['value']): HexStringMap['value'];
	parseHSLValueAsStringMap(hsl: HSL['value']): HSLStringMap['value'];
	parseRGBValueAsStringMap(rgb: RGB['value']): RGBStringMap['value'];
}

export interface DOMUtilitiesPartial {
	createTooltip(element: HTMLElement, text: string): HTMLElement | void;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(minSwatches: number, maxSwatches: number): void;
	hideTooltip(): void;
	positionTooltip(element: HTMLElement, tooltip: HTMLElement): void;
	readFile(file: File): Promise<string>;
	removeTooltip(element: HTMLElement): void;
	switchColorSpaceInDOM(targetFormat: ColorSpace): void;
	updateColorBox(color: HSL, boxId: string): void;
	updateHistory(history: Palette[]): void;
}

export interface DOMParsingUtilities {
	parseCheckbox(id: string): boolean | void;
	parseColorInput(input: HTMLInputElement): Hex | HSL | RGB | null;
	parseDropdownSelection(id: string, validOptions: string[]): string | void;
	parseNumberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null;
	parseTextInput(input: HTMLInputElement, regex?: RegExp): string | null;
}

export interface FormattingUtilities {
	addHashToHex(hex: Hex): Hex;
	componentToHex(component: number): string;
	convertShortHexToLong(hex: string): string;
	formatPercentageValues<
		T extends Record<string, number | NumericBrandedType>
	>(
		value: T
	): {
		[K in keyof T]: T[K] extends number | NumericBrandedType
			? `${number}%` | T[K]
			: T[K];
	};
	hslAddFormat(value: HSL['value']): HSL;
	parseColor(colorSpace: ColorSpace, value: string): Color | null;
	parseComponents(value: string, count: number): number[];
	stripHashFromHex(hex: Hex): Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
}

export interface PaletteUtilities {
	createPaletteItem(color: HSL, itemID: number): PaletteItem;
	createPaletteItemArray(baseColor: HSL, hues: number[]): PaletteItem[];
	createPaletteObject(
		options: SelectedPaletteOptions,
		paletteItems: PaletteItem[]
	): Palette;
	generateAllColorValues(color: HSL): AllColors;
	getPaletteOptionsFromUI(): SelectedPaletteOptions;
	getRandomizedPaleteOptions(): SelectedPaletteOptions;
	isHSLTooDark(hsl: HSL): boolean;
	isHSLTooGray(hsl: HSL): boolean;
	isHSLTooLight(hsl: HSL): boolean;
	isHSLInBounds(hsl: HSL): boolean;
	showPaletteColumns(count: number): void;
}

export interface ParsingUtilities {
	colorInput(input: HTMLInputElement): Hex | HSL | RGB | null;
	dropdownSelection(id: string, validOptions: string[]): string | void;
	numberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null;
	textInput(input: HTMLInputElement, regex?: RegExp): string | null;
}

export interface SanitationUtilities {
	getSafeQueryParam(param: string): string | null;
	percentile(value: number): Percentile;
	radial(value: number): Radial;
	rgb(value: number): ByteRange;
	sanitizeInput(str: string): string;
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T
	): RangeKeyMap[T];
}

export interface ValidationUtilities {
	colorInput(color: string): boolean;
	colorValue(color: Color): boolean;
	ensureHash(value: string): string;
	hex(value: string, pattern: RegExp): boolean;
	hexComponent(value: string): boolean;
	hexSet(value: string): boolean;
	range<T extends keyof SetsData>(value: number | string, rangeKey: T): void;
}

// ******** 5. UTILITIES OBJECT ********

export type ColorUtilities = ColorBrandUtilities &
	ColorConversionUtilities &
	ColorGenerationUtilities &
	ColorFormatUtilities &
	ColorParsingUtilities;

export type DOMUtilities = DOMParsingUtilities & DOMUtilitiesPartial;

export interface Utilities {
	adjust: AdjustmentUtilities;
	brand: BrandingUtilities;
	color: ColorUtilities;
	colorConversion: ColorConversionUtilities;
	dom: DOMUtilities;
	format: FormattingUtilities;
	palette: PaletteUtilities;
	parse: ParsingUtilities;
	sanitize: SanitationUtilities;
	validate: ValidationUtilities;
}

// ******** 6. COMMON FUNCTIONS OBJECT ********

export interface CommonFunctions {
	helpers: Helpers;
	services: Services;
	utils: Utilities;
}

// ******** 7. CLASSES ********

export interface ErrorHandlerContract {
	handleAndReturn<T>(
		action: () => T | Promise<T>,
		errorMessage: string,
		options?: ErrorHandlerOptions & { fallback?: T }
	): T | Promise<T>;
	handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		options?: ErrorHandlerOptions
	): Promise<T>;
	handleSync<T>(
		action: () => T,
		errorMessage: string,
		options?: ErrorHandlerOptions
	): T;
}

export interface IDBStorageContract {
	clear(): Promise<void>;
	ensureDBReady(): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	init(): Promise<boolean>;
	removeItem(key: string): Promise<void>;
	setItem(key: string, value: unknown): Promise<void>;
}

export interface LocalStorageContract {
	clear(): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	init(): Promise<boolean>;
	removeItem(key: string): Promise<void>;
	setItem(key: string, value: unknown): Promise<void>;
}

export interface LoggerContract {
	debug(message: string, caller?: string): void;
	error(message: string, caller?: string): void;
	info(message: string, caller?: string): void;
	warn(message: string, caller?: string): void;
}

export interface PaletteEventsContract {
	init(): void;
	attachColorCopyHandlers(): void;
	attachDragAndDropHandlers(): void;
	initializeColumnPositions(): void;
	renderColumnSizeChange(): void;
	syncColumnColorsWithState(): void;
}

export interface StorageManagerContract {
	clear(): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	init(): Promise<boolean>;
	removeItem(key: string): Promise<void>;
	setItem(key: string, value: unknown): Promise<void>;
}

export interface UIEventsContract {
	attachTooltipListener(id: string, tooltipText: string): void;
	init(): void;
	initButtons(): void;
}

// ******** 8. FUNCTION INTERFACES ********

export interface GenerateHuesFn {
	(
		color: HSL,
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup
	): number[];
}

export interface GeneratePaletteFn {
	(
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup,
		generatePalette: GeneratePaletteFnGroup
	): Palette;
}

// ******** 9. FUNCTION OBJECTS ********

export interface GenerateHuesFnGroup {
	analogous(
		color: HSL,
		options: SelectedPaletteOptions,
		common: CommonFunctions
	): number[];
	diadic(
		color: HSL,
		options: SelectedPaletteOptions,
		common: CommonFunctions
	): number[];
	hexadic(color: HSL, common: CommonFunctions): number[];
	splitComplementary(color: HSL, common: CommonFunctions): number[];
	tetradic(color: HSL, common: CommonFunctions): number[];
	triadic(color: HSL, common: CommonFunctions): number[];
}

export interface GeneratePaletteFnGroup {
	analogous(
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup
	): Palette;
	complementary(
		options: SelectedPaletteOptions,
		common: CommonFunctions
	): Palette;
	diadic(
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup
	): Palette;
	hexadic(
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup
	): Palette;
	monochromatic(
		options: SelectedPaletteOptions,
		common: CommonFunctions
	): Palette;
	random(options: SelectedPaletteOptions, common: CommonFunctions): Palette;
	splitComplementary(
		options: SelectedPaletteOptions,
		common: CommonFunctions
	): Palette;
	tetradic(
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup
	): Palette;
	triadic(
		options: SelectedPaletteOptions,
		common: CommonFunctions,
		generateHues: GenerateHuesFnGroup
	): Palette;
}

// ******** 10. OTHER ********

export interface AppDependencies {
	common: Required<CommonFunctions>;
}

export interface DebounceOptions {
	delay?: number;
}

export interface ErrorHandlerOptions {
	context?: Record<string, unknown>;
	fallback?: unknown;
	userMessage?: string;
}

export type LockQueueEntry = {
	isWrite: boolean;
	resolve: () => void;
};
