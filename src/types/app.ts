// File: types/app/app.js

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
	ConstsDataInterface,
	DataSetsInterface,
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

export interface AppServicesInterface {
	handleAsyncErrors<T>(
		action: () => Promise<T>,
		errorMessage: string,
		caller: string,
		context?: Record<string, unknown>
	): Promise<T | null>;
	log(
		level: 'debug' | 'info' | 'warn' | 'error',
		message: string,
		method: string,
		verbosityRequirement?: number
	): void;
}

// ******** 2. SERVICES OBJECT ********

export interface ServicesInterface {
	app: AppServicesInterface;
}

// ******** 3. HELPERS ********

export interface ColorConversionHelpersInterface {
	cmykToHSL(cmyk: CMYK): HSL;
	cmykToRGB(cmyk: CMYK): RGB;
	hexToHSL(hex: Hex): HSL;
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

export interface ColorUtilHelpersInterface
	extends ColorConversionHelpersInterface {
	hexToHSLWrapper(input: string | Hex): HSL;
}

export interface PaletteUtilHelpersInterface {
	getWeightedRandomInterval(
		type: keyof ConstsDataInterface['probabilities']
	): number;
	isHSLInBounds(hsl: HSL): boolean;
	isHSLTooDark(hsl: HSL): boolean;
	isHSLTooGray(hsl: HSL): boolean;
	isHSLTooLight(hsl: HSL): boolean;
}

// ******** 4. HELPERS OBJECT ********

export interface HelpersInterface {
	color: ColorUtilHelpersInterface;
	palette: PaletteUtilHelpersInterface;
}

// ******** 5. UTILITIES ********

export interface AdjustmentUtilsInterface {
	applyGammaCorrection(value: number): number;
	clampRGB(rgb: RGB): RGB;
	sl(color: HSL): HSL;
}

export interface AppUtilsInterface {
	generateRandomHSL(): HSL;
	generateRandomSL(): SL;
	getFormattedTimestamp(): string;
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
	hideTooltip(): void;
	readFile(file: File): Promise<string>;
	removeTooltip(element: HTMLElement): void;
	switchColorSpaceInDOM(targetFormat: ColorSpace): void;
	updateColorBox(color: HSL, boxId: string): void;
	updateHistory(history: Palette[]): void;
	validateStaticElements(): void;
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
	lab(value: number, output: 'l' | 'a' | 'b'): LAB_L | LAB_A | LAB_B;
	percentile(value: number): Percentile;
	radial(value: number): Radial;
	rgb(value: number): ByteRange;
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
	range<T extends keyof DataSetsInterface>(
		value: number | string,
		rangeKey: T
	): void;
	userColorInput(color: string): boolean;
}

// ******** 6. UTILITIES OBJECT ********

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

// ******** 7. COMMON FUNCTIONS COMPOSITE OBJECT ********

export interface CommonFunctionsInterface {
	helpers: HelpersInterface;
	services: ServicesInterface;
	utils: UtilitiesInterface;
}

// ******** 8. CLASSES ********

export interface AppLoggerClassInterface {
	log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: number,
		caller?: string
	): void;
	logAsync(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		debugLevel: number,
		caller?: string
	): Promise<void>;
	logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void
	): void;
}

export interface StateManagerClassInterface {
	addPaletteToHistory(palette: Palette): void;
	getState(): State;
	redo(): void;
	resetState(): void;
	setState(state: State, track: boolean): void;
	undo(): void;
	updateAppModeState(appMode: State['appMode'], track: boolean): void;
	updateDnDAttachedState(dndAttached: boolean): void;
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

// ******** 10. FUNCTION INTERFACES ********

export interface GenerateHuesFn {
	(
		color: HSL,
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup
	): number[];
}

export interface GeneratePaletteFn {
	(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup,
		generatePalette: GeneratePaletteFnGroup
	): Palette;
}

// ******** 11. FUNCTION OBJECTS ********

export interface GenerateHuesFnGroup {
	analogous(
		color: HSL,
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface
	): number[];
	diadic(
		color: HSL,
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface
	): number[];
	hexadic(color: HSL, common: CommonFunctionsInterface): number[];
	splitComplementary(color: HSL, common: CommonFunctionsInterface): number[];
	tetradic(color: HSL, common: CommonFunctionsInterface): number[];
	triadic(color: HSL, common: CommonFunctionsInterface): number[];
}

export interface GeneratePaletteFnGroup {
	analogous(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup
	): Palette;
	complementary(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface
	): Palette;
	diadic(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup
	): Palette;
	hexadic(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup
	): Palette;
	monochromatic(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface
	): Palette;
	random(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface
	): Palette;
	splitComplementary(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface
	): Palette;
	tetradic(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup
	): Palette;
	triadic(
		options: SelectedPaletteOptions,
		common: CommonFunctionsInterface,
		generateHues: GenerateHuesFnGroup
	): Palette;
}
