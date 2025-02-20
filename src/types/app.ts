// File: types/app/app.ts

import {
	AllColors,
	ByteRange,
	CMYK,
	CMYKNumMap,
	CMYKStringMap,
	Color,
	ColorFormatMap,
	ColorNumMap,
	ColorDataAssertion,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	ColorStringMap,
	DefaultObserverData,
	DOMElements,
	Hex,
	HexSet,
	HexNumMap,
	HexStringMap,
	HSL,
	HSLNumMap,
	HSLStringMap,
	HSV,
	HSVNumMap,
	HSVStringMap,
	LAB,
	LABNumMap,
	LABStringMap,
	LAB_A,
	LAB_B,
	LAB_L,
	Listener,
	MutationLog,
	NumericRangeKey,
	Palette,
	PaletteConfig,
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
	SL,
	SLNumMap,
	State,
	SV,
	SVNumMap,
	UnbrandedPalette,
	XYZ,
	XYZNumMap,
	XYZStringMap,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from './index.js';
import { DataObserver } from '../common/services/DataObserver.js';
import { DOMStore } from '../common/services/DOMStore.js';

// ******** 1. SERVICES ********

export interface Services<T extends DefaultObserverData = DefaultObserverData> {
	domStore: DOMStore;
	errors: ErrorHandlerInterface;
	log(
		message: string,
		level?: 'debug' | 'info' | 'warn' | 'error',
		verbosityRequirement?: number
	): void;
	observer: DataObserver<T>;
	semaphore: SemaphoreInterface;
	setObserverData(newData: T): void;
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
	clone<T>(value: T): T;
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
	getWeightedRandomValue(
		weights: readonly number[],
		probabilities: readonly number[]
	): number;
}

export interface PaletteHelpers {
	getWeightsAndValues(
		distributionType: keyof PaletteConfig['probabilities']
	): { weights: readonly number[]; values: readonly number[] };
}

export interface TimeHelpers {
	debounce<T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void;
}

export interface TypeGuardHelpers {
	hasFormat: <T extends { format: string }>(
		value: unknown,
		expectedFormat: string
	) => value is T;
	hasNumericProperties: (
		obj: Record<string, unknown>,
		keys: string[]
	) => boolean;
	hasStringProperties: (
		obj: Record<string, unknown>,
		keys: string[]
	) => boolean;

	hasValueProperty: <T extends { value: unknown }>(
		value: unknown
	) => value is T;
	isObject: (value: unknown) => value is Record<string, unknown>;
}

// ******** 3. HELPERS ********

export interface Helpers {
	color: ColorHelpers;
	data: DataHelpers;
	dom: DOMHelpers;
	math: MathHelpers;
	palette: PaletteHelpers;
	time: TimeHelpers;
	typeGuards: TypeGuardHelpers;
}

// ******** 4. UTILITIES ********

export interface AdjustmentUtils {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: RGB): RGB;
	clampXYZ(value: number, maxValue: number): number;
	normalizeXYZ(value: number, reference: number): number;
	sl(color: HSL): HSL;
}

export interface BrandingUtils {
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T
	): RangeKeyMap[T];
	asByteRange(value: number): ByteRange;
	asCMYK(color: CMYKNumMap): CMYK;
	asHex(color: HexNumMap): Hex;
	asHexSet(value: string): HexSet;
	asHSL(color: HSLNumMap): HSL;
	asHSV(color: HSVNumMap): HSV;
	asLAB(color: LABNumMap): LAB;
	asLAB_A(value: number): LAB_A;
	asLAB_B(value: number): LAB_B;
	asLAB_L(value: number): LAB_L;
	asPercentile(value: number): Percentile;
	asRadial(value: number): Radial;
	asRGB(color: RGBNumMap): RGB;
	asSL(color: SLNumMap): SL;
	asSV(color: SVNumMap): SV;
	asXYZ(color: XYZNumMap): XYZ;
	asXYZ_X(value: number): XYZ_X;
	asXYZ_Y(value: number): XYZ_Y;
	asXYZ_Z(value: number): XYZ_Z;
	brandColor(color: ColorNumMap): Color;
	brandPalette(data: UnbrandedPalette): Palette;
}

export interface ColorBrandUtils {
	brandCMYKStringMapValue(cmyk: CMYKStringMap['value']): CMYK['value'];
	brandColorStringMap(color: ColorStringMap): Color;
	brandHexStringMapValue(hex: HexStringMap['value']): Hex['value'];
	brandHSLStringMapValue(hsl: HSLStringMap['value']): HSL['value'];
	brandHSVStringMapValue(hsv: HSVStringMap['value']): HSV['value'];
	brandLABStringMapValue(lab: LABStringMap['value']): LAB['value'];
	brandRGBStringMapValue(rgb: RGBStringMap['value']): RGB['value'];
	brandXYZStringMapValue(xyz: XYZStringMap['value']): XYZ['value'];
}

export interface ColorConversionUtils {
	cmykToHSL(cmyk: CMYK): HSL;
	cmykToRGB(cmyk: CMYK): RGB;
	convertHSL(color: HSL, colorSpace: ColorSpaceExtended): Color;
	convertToHSL(color: Exclude<Color, SL | SV>): HSL;
	hexToHSL(hex: Hex): HSL;
	hexToHSLWrapper(input: string | Hex): HSL;
	hexToRGB(hex: Hex): RGB;
	hslToCMYK(hsl: HSL): CMYK;
	hslToHex(hsl: HSL): Hex;
	hslToHSV(hsl: HSL): HSV;
	hslToLAB(hsl: HSL): LAB;
	hslToRGB(hsl: HSL): RGB;
	hslToSL(hsl: HSL): SL;
	hslToSV(hsl: HSL): SV;
	hslToXYZ(hsl: HSL): XYZ;
	hsvToHSL(hsv: HSV): HSL;
	hsvToSV(hsv: HSV): SV;
	labToHSL(lab: LAB): HSL;
	labToRGB(lab: LAB): RGB;
	labToXYZ(lab: LAB): XYZ;
	rgbToCMYK(rgb: RGB): CMYK;
	rgbToHex(rgb: RGB): Hex;
	rgbToHSL(rgb: RGB): HSL;
	rgbToHSV(rgb: RGB): HSV;
	rgbToXYZ(rgb: RGB): XYZ;
	xyzToHSL(xyz: XYZ): HSL;
	xyzToLAB(xyz: XYZ): LAB;
	xyzToRGB(xyz: XYZ): RGB;
}

export interface ColorFormatUtils {
	formatColorAsCSS(color: Color): string;
	formatColorAsStringMap(color: Color): ColorStringMap;
	formatCSSAsColor(color: string): Exclude<Color, SL | SV> | null;
}

export interface ColorGenerationUtils {
	generateRandomHSL(): HSL;
	generateRandomSL(): SL;
}

export interface ColorParseUtils {
	narrowToColor(color: Color | ColorStringMap): Color | null;
	parseHexValueAsStringMap(hex: Hex['value']): HexStringMap['value'];
	parseHSLValueAsStringMap(hsl: HSL['value']): HSLStringMap['value'];
	parseHSVValueAsStringMap(hsv: HSV['value']): HSVStringMap['value'];
	parseLABValueAsStringMap(lab: LAB['value']): LABStringMap['value'];
	parseRGBValueAsStringMap(rgb: RGB['value']): RGBStringMap['value'];
	parseXYZValueAsStringMap(xyz: XYZ['value']): XYZStringMap['value'];
}

export interface ColorValidationUtils {
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T
	): RangeKeyMap[T];
}

export interface DOMUtilsPartial {
	createTooltip(element: HTMLElement, text: string): HTMLElement;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(minSwatches: number, maxSwatches: number): void;
	hideTooltip(): void;
	readFile(file: File): Promise<string>;
	removeTooltip(element: HTMLElement): void;
	scanPaletteColumns(): State['paletteContainer']['columns'];
	switchColorSpaceInDOM(targetFormat: ColorSpace): void;
	updateColorBox(color: HSL, boxId: string): void;
	updateHistory(history: Palette[]): void;
}

export interface DOMParsingUtils {
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

export interface FormattingUtils {
	addHashToHex(hex: Hex): Hex;
	componentToHex(component: number): string;
	convertShortHexToLong(hex: string): string;
	formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
	hslAddFormat(value: HSL['value']): HSL;
	parseColor(colorSpace: ColorSpace, value: string): Color | null;
	parseComponents(value: string, count: number): number[];
	stripHashFromHex(hex: Hex): Hex;
	stripPercentFromValues<T extends Record<string, number | string>>(
		value: T
	): { [K in keyof T]: T[K] extends `${number}%` ? number : T[K] };
}

export interface PaletteUtils {
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
}

export interface ParsingUtils {
	colorInput(input: HTMLInputElement): Hex | HSL | RGB | null;
	dropdownSelection(id: string, validOptions: string[]): string | void;
	numberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null;
	textInput(input: HTMLInputElement, regex?: RegExp): string | null;
}

export interface SanitationUtils {
	getSafeQueryParam(param: string): string | null;
	lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
	percentile(value: number): Percentile;
	radial(value: number): Radial;
	rgb(value: number): ByteRange;
	sanitizeInput(str: string): string;
}

export interface TypeGuards {
	isColor(value: unknown): value is Color;
	isColorFormat<F extends ColorFormat>(
		color: Color,
		format: F
	): color is ColorFormatMap[F];
	isColorNumMap(value: unknown, format?: ColorFormat): value is ColorNumMap;
	isColorSpace(value: unknown): value is ColorSpace;
	isColorSpaceExtended(value: string): value is ColorSpaceExtended;
	isColorStringMap(value: unknown): value is ColorStringMap;
	isConvertibleColor(
		color: Color
	): color is CMYK | Hex | HSL | HSV | LAB | RGB;
	isFormat(format: unknown): format is ColorFormat;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isPalette(value: unknown): value is Palette;
	isPaletteType(value: string): value is PaletteType;
}

export interface ValidationUtils {
	colorValue(color: Color | SL | SV): boolean;
	ensureHash(value: string): string;
	hex(value: string, pattern: RegExp): boolean;
	hexComponent(value: string): boolean;
	hexSet(value: string): boolean;
	range<T extends keyof SetsData>(value: number | string, rangeKey: T): void;
	userColorInput(color: string): boolean;
}

// ******** 5. UTILITIES OBJECT ********

export type ColorUtils = ColorBrandUtils &
	ColorConversionUtils &
	ColorGenerationUtils &
	ColorFormatUtils &
	ColorParseUtils &
	ColorValidationUtils;

export type DOMUtils = DOMParsingUtils & DOMUtilsPartial;

export interface Utilities {
	adjust: AdjustmentUtils;
	brand: BrandingUtils;
	color: ColorUtils;
	colorConversion: ColorConversionUtils;
	dom: DOMUtils;
	format: FormattingUtils;
	palette: PaletteUtils;
	parse: ParsingUtils;
	sanitize: SanitationUtils;
	typeGuards: TypeGuards;
	validate: ValidationUtils;
}

// ******** 6. COMMON FUNCTIONS ********

export interface CommonFunctions {
	helpers: Helpers;
	services: Services;
	utils: Utilities;
}

// ******** 7. CLASSES ********

export interface DataObserverInterface<T extends Record<string, unknown>> {
	get<K extends keyof T>(prop: K): T[K];
	off<K extends keyof T>(prop: K, callback: Listener<T[K]>): void;
	on<K extends keyof T>(prop: K, callback: Listener<T[K]>): void;
	set<K extends keyof T>(prop: K, value: T[K]): void;
}

export interface DOMStoreInterface {
	getElements(): DOMElements | null;
	setElements(elements: DOMElements): void;
}

export interface ErrorHandlerInterface {
	handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		context?: Record<string, unknown>
	): Promise<T>;
	handleSync<T>(
		action: () => T,
		errorMessage: string,
		context?: Record<string, unknown>
	): T;
}

export interface IDBManagerInterface {
	clear(): Promise<void>;
	ensureDBReady(): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	init(): Promise<boolean>;
	removeItem(key: string): Promise<void>;
	setItem(key: string, value: unknown): Promise<void>;
}

export interface LocalStorageManagerInterface {
	clear(): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	init(): Promise<boolean>;
	removeItem(key: string): Promise<void>;
	setItem(key: string, value: unknown): Promise<void>;
}

export interface LoggerInterface {
	log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		caller?: string
	): void;
	logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): void;
}

export interface PaletteEventsInterface {
	attachColorCopyHandlers(): void;
	attachDragAndDropHandlers(): void;
	init(): void;
	initializeColumnPositions(): void;
	renderColumnSizeChange(): void;
	syncColumnColorsWithState(): void;
}

export interface PaletteManagerInterface {
	extractPaletteFromDOM(): Palette | void;
	handleColumnLock(columnID: number): void;
	handleColumnResize(columnID: number, newSize: number): void;
	loadPalette(): Promise<void>;
	renderNewPalette(): Promise<void>;
	renderPaletteFromState(): Promise<void>;
	swapColumns(draggedID: number, targetID: number): void;
}

export interface PaletteStateInterface {
	updatePaletteItemColor(columnID: number, newColor: string): void;
}

export interface SemaphoreInterface {
	acquire(): Promise<void>;
	release(): void;
}

export interface StateManagerInterface {
	addPaletteToHistory(palette: Palette): void;
	ensureStateReady(): Promise<void>;
	getState(): State;
	init(): Promise<void>;
	loadState(): Promise<State>;
	redo(): void;
	resetState(): void;
	setOnStateLoad(callback: () => void): void;
	setState(state: State, track: boolean): void;
	undo(): void;
	updateAppModeState(appMode: State['appMode'], track: boolean): void;
	updatePaletteColumns(
		columns: State['paletteContainer']['columns'],
		track: boolean,
		verbosity: number
	): void;
	updatePaletteColumnSize(columnID: number, newSize: number): void;
	updatePaletteHistory(updatedHistory: Palette[]): void;
	updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): void;
}

export interface StorageManagerInterface {
	clear(): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	init(): Promise<boolean>;
	removeItem(key: string): Promise<void>;
	setItem(key: string, value: unknown): Promise<void>;
}

export interface UIEventsInterface {
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
