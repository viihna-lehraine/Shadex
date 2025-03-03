// File: types/app/app.ts

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
	ColorSpaceExtended,
	ColorStringMap,
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
import { DOMStore } from '../dom/DOMStore.js';
import { EventManager } from '../dom/events/EventManager.js';
import { PaletteEventsService } from '../dom/events/PaletteEventsService.js';
import { UIEventsService } from '../dom/events/UIEventsService.js';
import { LoggerService } from '../core/services/index.js';
import { PaletteStateService } from '../state/PaletteStateService.js';
import { StateManager } from '../state/StateManager.js';

// ******** 1. SERVICES ********

export interface Services {
	errors: ErrorHandlerContract;
	log: LoggerService;
}

// ******** 2. HELPERS ********

export interface ColorHelpers {
	getConversionFn<
		From extends keyof ColorDataAssertion,
		To extends keyof ColorDataAssertion
	>(
		from: From,
		to: To
	): ((value: ColorDataAssertion[From]) => ColorDataAssertion[To]) | undefined;
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
	isColorSpaceExtended(value: string): value is ColorSpaceExtended;
	isColorStringMap(value: unknown): value is ColorStringMap;
	isConvertibleColor(color: Color): color is CMYK | Hex | HSL | HSV | LAB | RGB;
	isFormat(format: unknown): format is ColorFormat;
	isHex(value: unknown): value is Hex;
	isHexSet(value: unknown): value is HexSet;
	isHSL(value: unknown): value is HSL;
	isHSV(value: unknown): value is HSV;
	isLAB(value: unknown): value is LAB;
	isLAB_A(value: unknown): value is LAB_A;
	isLAB_B(value: unknown): value is LAB_B;
	isLAB_L(value: unknown): value is LAB_L;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isObject(value: unknown): value is Record<string, unknown>;
	isPalette(value: unknown): value is Palette;
	isPaletteType(value: string): value is PaletteType;
	isPercentile(value: unknown): value is Percentile;
	isRadial(value: unknown): value is Radial;
	isRGB(value: unknown): value is RGB;
	isSL(value: unknown): value is SL;
	isSV(value: unknown): value is SV;
	isXYZ(value: unknown): value is XYZ;
	isXYZ_X(value: unknown): value is XYZ_X;
	isXYZ_Y(value: unknown): value is XYZ_Y;
	isXYZ_Z(value: unknown): value is XYZ_Z;
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
	clampXYZ(value: number, maxValue: number): number;
	normalizeXYZ(value: number, reference: number): number;
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
	brandColor(color: ColorNumMap | ColorStringMap): Color;
	brandPalette(data: UnbrandedPalette): Palette;
}

export interface ColorBrandUtilities {
	brandCMYKString(cmyk: CMYKStringMap['value']): CMYK['value'];
	brandColorString(color: ColorStringMap): Color;
	brandHexString(hex: HexStringMap['value']): Hex['value'];
	brandHSLString(hsl: HSLStringMap['value']): HSL['value'];
	brandHSVString(hsv: HSVStringMap['value']): HSV['value'];
	brandLABString(lab: LABStringMap['value']): LAB['value'];
	brandRGBString(rgb: RGBStringMap['value']): RGB['value'];
	brandXYZString(xyz: XYZStringMap['value']): XYZ['value'];
}

export interface ColorConversionUtilities {
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

export interface ColorFormatUtilities {
	formatColorAsCSS(color: Color): string;
	formatColorAsStringMap(color: Color): ColorStringMap;
	formatCSSAsColor(color: string): Exclude<Color, SL | SV> | null;
}

export interface ColorGenerationUtilities {
	generateRandomHSL(): HSL;
	generateRandomSL(): SL;
}

export interface ColorParsingUtilities {
	parseHexValueAsStringMap(hex: Hex['value']): HexStringMap['value'];
	parseHSLValueAsStringMap(hsl: HSL['value']): HSLStringMap['value'];
	parseHSVValueAsStringMap(hsv: HSV['value']): HSVStringMap['value'];
	parseLABValueAsStringMap(lab: LAB['value']): LABStringMap['value'];
	parseRGBValueAsStringMap(rgb: RGB['value']): RGBStringMap['value'];
	parseXYZValueAsStringMap(xyz: XYZ['value']): XYZStringMap['value'];
}

export interface DOMUtilitiesPartial {
	createTooltip(element: HTMLElement, text: string): HTMLElement | void;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(minSwatches: number, maxSwatches: number): void;
	getUpdatedColumnSizes(
		columns: State['paletteContainer']['columns'],
		columnID: number,
		newSize: number
	): State['paletteContainer']['columns'];
	hideTooltip(): void;
	positionTooltip(element: HTMLElement, tooltip: HTMLElement): void;
	readFile(file: File): Promise<string>;
	removeTooltip(element: HTMLElement): void;
	scanPaletteColumns(): State['paletteContainer']['columns'] | void;
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
	formatPercentageValues<T extends Record<string, number | NumericBrandedType>>(
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
	lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
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
	colorValue(color: Color | SL | SV): boolean;
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

export interface DOMStoreContract {
	getElements(): DOMElements | null;
	setElements(elements: DOMElements): void;
}

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

export interface PaletteHistoryManagerContract {
	init(services: Services): Promise<void>;
	addPalette(palette: Palette): void;
	clearHistory(): void;
	getCurrentPalette(): Palette | null;
	getHistory(): Palette[];
	redo(): Palette | null;
	undo(): Palette | null;
}

export interface PaletteStateContract {
	handleColumnLock(columnID: number): Promise<void>;
	handleColumnResize(columnID: number, newSize: number): Promise<void>;
	swapColumns(draggedID: number, targetID: number): Promise<void>;
}

export interface StateFactoryContract {
	createInitialState(): Promise<State>;
}

export interface StateManagerContract {
	init(services: Services): Promise<void>;
	batchUpdate(updater: (currentState: State) => Partial<State>): Promise<void>;
	clearHistory(): void;
	ensureStateReady(): Promise<void>;
	get<K extends keyof State>(key?: K): State | State[K];
	loadState(): Promise<State>;
	redo(): State | null;
	replaceState(newState: State): Promise<void>;
	resetState(): Promise<void>;
	saveState(state: State, options: { throttle?: boolean }): Promise<void>;
	undo(): State | null;
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
	domStore: DOMStore;
	eventManager: EventManager;
	paletteEvents: PaletteEventsService;
	paletteState: PaletteStateService;
	stateManager: StateManager;
	uiEvents: UIEventsService;
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
