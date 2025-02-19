// File: types/app/app.ts

import {
	AllColors,
	ByteRange,
	CMYK,
	CMYKStringObject,
	Color,
	ColorDataAssertion,
	ColorFormat,
	ColorSpace,
	ColorSpaceExtended,
	ColorStringObject,
	DOM_IDs,
	DOMElements,
	EnvData,
	Hex,
	HexSet,
	HexStringObject,
	HSL,
	HSLStringObject,
	HSV,
	HSVStringObject,
	LAB,
	LAB_A,
	LAB_B,
	LAB_L,
	LABStringObject,
	Listener,
	MutationLog,
	NumericRangeKey,
	Palette,
	PaletteItem,
	PaletteType,
	Percentile,
	Radial,
	RangeKeyMap,
	RGB,
	RGBStringObject,
	SelectedPaletteOptions,
	SetsData,
	SL,
	SLStringObject,
	State,
	SV,
	SVStringObject,
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
	XYZStringObject,
	XYZ_X,
	XYZ_Y,
	XYZ_Z
} from './index.js';

// ******** 1. SERVICES ********

export interface ServicesInterface {
	log(
		message: string,
		level?: 'debug' | 'info' | 'warn' | 'error',
		verbosityRequirement?: number
	): void;
	errors: ErrorHandlerInterface;
}

// ******** 2. HELPERS ********

export interface ColorHelpersInterface {
	cmykToHSL(cmyk: CMYK): HSL;
	cmykToRGB(cmyk: CMYK): RGB;
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

export interface PaletteHelpersInterface {
	getWeightedRandomInterval(type: keyof EnvData['probabilities']): number;
	isHSLInBounds(hsl: HSL): boolean;
	isHSLTooDark(hsl: HSL): boolean;
	isHSLTooGray(hsl: HSL): boolean;
	isHSLTooLight(hsl: HSL): boolean;
}

// ******** 3. HELPERS ********

export interface HelpersInterface {
	color: ColorHelpersInterface;
	palette: PaletteHelpersInterface;
}

// ******** 4. UTILITIES ********

export interface AdjustmentUtilsInterface {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: RGB): RGB;
	clampXYZ(value: number, maxValue: number): number;
	normalizeXYZ(value: number, reference: number): number;
	sl(color: HSL): HSL;
}

export interface AppUtilsInterface {
	generateRandomHSL(): HSL;
	generateRandomSL(): SL;
	getFormattedTimestamp(): string;
	tracePromise(promise: Promise<unknown>, label: string): Promise<unknown>;
}

export interface BrandingUtilsInterface {
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T
	): RangeKeyMap[T];
	asByteRange(value: number): ByteRange;
	asCMYK(color: UnbrandedCMYK): CMYK;
	asHex(color: UnbrandedHex): Hex;
	asHexSet(value: string): HexSet;
	asHSL(color: UnbrandedHSL): HSL;
	asHSV(color: UnbrandedHSV): HSV;
	asLAB(color: UnbrandedLAB): LAB;
	asLAB_A(value: number): LAB_A;
	asLAB_B(value: number): LAB_B;
	asLAB_L(value: number): LAB_L;
	asPercentile(value: number): Percentile;
	asRadial(value: number): Radial;
	asRGB(color: UnbrandedRGB): RGB;
	asSL(color: UnbrandedSL): SL;
	asSV(color: UnbrandedSV): SV;
	asXYZ(color: UnbrandedXYZ): XYZ;
	asXYZ_X(value: number): XYZ_X;
	asXYZ_Y(value: number): XYZ_Y;
	asXYZ_Z(value: number): XYZ_Z;
	brandColor(color: UnbrandedColor): Color;
	brandPalette(data: UnbrandedPalette): Palette;
}

export interface ColorUtilsInterface {
	convertCMYKStringToValue(cmyk: CMYKStringObject['value']): CMYK['value'];
	convertCMYKValueToString(cmyk: CMYK['value']): CMYKStringObject['value'];
	convertColorStringToColor(colorString: ColorStringObject): Color;
	convertColorToColorString(color: Color): ColorStringObject;
	convertColorToCSS(color: Color): string;
	convertCSSToColor(color: string): Exclude<Color, SL | SV> | null;
	convertHexStringToValue(hex: HexStringObject['value']): Hex['value'];
	convertHexValueToString(hex: Hex['value']): HexStringObject['value'];
	convertHSL(color: HSL, colorSpace: ColorSpaceExtended): Color;
	convertHSLStringToValue(hsl: HSLStringObject['value']): HSL['value'];
	convertHSLValueToString(hsl: HSL['value']): HSLStringObject['value'];
	convertHSVStringToValue(hsv: HSVStringObject['value']): HSV['value'];
	convertHSVValueToString(hsv: HSV['value']): HSVStringObject['value'];
	convertLABStringToValue(lab: LABStringObject['value']): LAB['value'];
	convertLABValueToString(lab: LAB['value']): LABStringObject['value'];
	convertRGBStringToValue(rgb: RGBStringObject['value']): RGB['value'];
	convertRGBValueToString(rgb: RGB['value']): RGBStringObject['value'];
	convertToHSL(color: Exclude<Color, SL | SV>): HSL;
	convertXYZStringToValue(xyz: XYZStringObject['value']): XYZ['value'];
	convertXYZValueToString(xyz: XYZ['value']): XYZStringObject['value'];
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
	hueToRGB(p: number, q: number, t: number): number;
	narrowToColor(color: Color | ColorStringObject): Color | null;
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T
	): RangeKeyMap[T];
	validateAndConvertColor(
		color: Color | ColorStringObject | null
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
	addConversionListener: (id: string, colorSpace: string) => void;
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void
	): void;
	createTooltip(element: HTMLElement, text: string): HTMLElement;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(minSwatches: number, maxSwatches: number): void;
	getValidatedDOMElements(unvalidatedIDs: DOM_IDs): DOMElements | null;
	hideTooltip(): void;
	readFile(file: File): Promise<string>;
	removeTooltip(element: HTMLElement): void;
	scanPaletteColumns(): State['paletteContainer']['columns'];
	switchColorSpaceInDOM(targetFormat: ColorSpace): void;
	updateColorBox(color: HSL, boxId: string): void;
	updateHistory(history: Palette[]): void;
	validateStaticElements(): Promise<void>;
}

export interface FormattingUtilsInterface {
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

export interface PaletteUtilsInterface {
	createPaletteItem(color: HSL, itemID: number): PaletteItem;
	createPaletteItemArray(baseColor: HSL, hues: number[]): PaletteItem[];
	createPaletteObject(
		options: SelectedPaletteOptions,
		paletteItems: PaletteItem[]
	): Palette;
	generateAllColorValues(color: HSL): AllColors;
	getPaletteOptionsFromUI(): SelectedPaletteOptions;
	getRandomizedPaleteOptions(): SelectedPaletteOptions;
}

export interface ParseUtilsInterface {
	checkbox(id: string): boolean | void;
	colorInput(input: HTMLInputElement): Hex | HSL | RGB | null;
	dropdownSelection(id: string, validOptions: string[]): string | void;
	numberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null;
	textInput(input: HTMLInputElement, regex?: RegExp): string | null;
}

export interface SanitationUtilsInterface {
	getSafeQueryParam(param: string): string | null;
	lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
	percentile(value: number): Percentile;
	radial(value: number): Radial;
	rgb(value: number): ByteRange;
	sanitizeInput(str: string): string;
}

export interface TypeGuardUtilsInterface {
	isCMYKColor(value: unknown): value is CMYK;
	isCMYKFormat(color: Color): color is CMYK;
	isCMYKString(value: unknown): value is CMYKStringObject;
	isColor(value: unknown): value is Color;
	isColorFormat<T extends Color>(
		color: Color,
		format: T['format']
	): color is T;
	isColorSpace(value: unknown): value is ColorSpace;
	isColorSpaceExtended(value: string): value is ColorSpaceExtended;
	isColorString(value: unknown): value is ColorStringObject;
	isConvertibleColor(
		color: Color
	): color is CMYK | Hex | HSL | HSV | LAB | RGB;
	isFormat(format: unknown): format is ColorFormat;
	isHex(value: unknown): value is Hex;
	isHexFormat(color: Color): color is Hex;
	isHSLColor(value: unknown): value is HSL;
	isHSLFormat(color: Color): color is HSL;
	isHSLString(value: unknown): value is HSLStringObject;
	isHSVColor(value: unknown): value is HSV;
	isHSVFormat(color: Color): color is HSV;
	isHSVString(value: unknown): value is HSVStringObject;
	isInputElement(element: HTMLElement | null): element is HTMLElement;
	isLAB(value: unknown): value is LAB;
	isLABFormat(color: Color): color is LAB;
	isPalette(value: unknown): value is Palette;
	isPaletteType(value: string): value is PaletteType;
	isRGB(value: unknown): value is RGB;
	isRGBFormat(color: Color): color is RGB;
	isSLColor(value: unknown): value is SL;
	isSLFormat(color: Color): color is SL;
	isSLString(value: unknown): value is SLStringObject;
	isSVColor(value: unknown): value is SV;
	isSVFormat(color: Color): color is SV;
	isSVString(value: unknown): value is SVStringObject;
	isXYZ(value: unknown): value is XYZ;
	isXYZFormat(color: Color): color is XYZ;
}

export interface ValidationUtilsInterface {
	colorValue(color: Color | SL | SV): boolean;
	ensureHash(value: string): string;
	hex(value: string, pattern: RegExp): boolean;
	hexComponent(value: string): boolean;
	hexSet(value: string): boolean;
	range<T extends keyof SetsData>(value: number | string, rangeKey: T): void;
	userColorInput(color: string): boolean;
}

// ******** 5. UTILITIES OBJECT ********

export interface UtilitiesInterface {
	adjust: AdjustmentUtilsInterface;
	app: AppUtilsInterface;
	brand: BrandingUtilsInterface;
	color: ColorUtilsInterface;
	core: CoreUtilsInterface;
	dom: DOMUtilsInterface;
	format: FormattingUtilsInterface;
	palette: PaletteUtilsInterface;
	parse: ParseUtilsInterface;
	sanitize: SanitationUtilsInterface;
	typeGuards: TypeGuardUtilsInterface;
	validate: ValidationUtilsInterface;
}

// ******** 6. COMMON FUNCTIONS ********

export interface CommonFunctions {
	helpers: HelpersInterface;
	services: ServicesInterface;
	utils: UtilitiesInterface;
}

// ******** 7. CLASSES ********

export interface AppLoggerInterface {
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

export interface AsyncLockInterface {
	acquire(): Promise<void>;
	release(): void;
}

export interface DataObserverInterface<T extends Record<string, unknown>> {
	get<K extends keyof T>(prop: K): T[K];
	on<K extends keyof T>(prop: K, callback: Listener<T[K]>): void;
	set<K extends keyof T>(prop: K, value: T[K]): void;
}

export interface ErrorHandlerInterface {
	handle(
		error: unknown,
		errorMessage: string,
		context?: Record<string, unknown>
	): void;
	handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		context?: Record<string, unknown>
	): Promise<T>;
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
