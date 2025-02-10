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
	ConstsDataInterface,
	DefaultDataInterface,
	DOMDataInterface,
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
	ModeDataInterface,
	NumericRangeKey,
	Palette,
	PaletteArgs,
	PaletteGenerationArgs,
	PaletteItem,
	PaletteUtilHelpersInterface,
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
	XYZ_Z,
	DataSetsInterface,
	ConfigDataInterface
} from '../../../types/index.js';

export interface AdjustmentUtilsInterface {
	adjustSL(
		color: HSL,
		adjustments: ConstsDataInterface['adjustments'],
		brandingUtils: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	applyGammaCorrection(
		value: number,
		log: AppServicesInterface['log']
	): number;
	clampRGB(
		rgb: RGB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
}

export interface AppUtilsInterface {
	generateRandomHSL(
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	generateRandomSL(
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): SL;
	getFormattedTimestamp(): string;
}

export interface BrandingUtilsInterface {
	asBranded<T extends keyof RangeKeyMap>(
		value: number,
		rangeKey: T,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RangeKeyMap[T];
	asByteRange(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): ByteRange;
	asCMYK(
		color: UnbrandedCMYK,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): CMYK;
	asHex(
		color: UnbrandedHex,
		brand: BrandingUtilsInterface,
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): Hex;
	asHexSet(
		value: string,
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): HexSet;
	asHSL(
		color: UnbrandedHSL,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	asHSV(
		color: UnbrandedHSV,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSV;
	asLAB(
		color: UnbrandedLAB,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB;
	asLAB_A(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB_A;
	asLAB_B(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB_B;
	asLAB_L(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB_L;
	asPercentile(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Percentile;
	asRadial(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Radial;
	asRGB(
		color: UnbrandedRGB,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	asSL(
		color: UnbrandedSL,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): SL;
	asSV(
		color: UnbrandedSV,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): SV;
	asXYZ(
		color: UnbrandedXYZ,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	asXYZ_X(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ_X;
	asXYZ_Y(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ_Y;
	asXYZ_Z(
		value: number,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ_Z;
	brandColor(
		color: UnbrandedColor,
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Color;
	brandPalette(
		data: UnbrandedPalette,
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Palette;
}

export interface ColorUtilsInterface {
	convertCMYKStringToValue(
		cmyk: CMYK_StringProps['value'],
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): CMYK['value'];
	convertCMYKValueToString(cmyk: CMYK['value']): CMYK_StringProps['value'];
	convertColorStringToColor(
		colorString: Color_StringProps,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Color;
	convertColorToColorString(
		color: Color,
		coreUtils: CoreUtilsInterface,
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		formattingUtils: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		typeGuards: TypeGuardUtilsInteface
	): Color_StringProps;
	convertColorToCSS(color: Color): string;
	convertHexStringToValue(
		hex: Hex_StringProps['value'],
		brand: BrandingUtilsInterface,
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): Hex['value'];
	convertHexValueToString(hex: Hex['value']): Hex_StringProps['value'];
	convertHSL(
		color: HSL,
		colorSpace: ColorSpaceExtended,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Color;
	convertHSLStringToValue(
		hsl: HSL_StringProps['value'],
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL['value'];
	convertHSLValueToString(hsl: HSL['value']): HSL_StringProps['value'];
	convertHSVStringToValue(
		hsv: HSV_StringProps['value'],
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSV['value'];
	convertHSVValueToString(hsv: HSV['value']): HSV_StringProps['value'];
	convertLABStringToValue(
		lab: LAB_StringProps['value'],
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB['value'];
	convertLABValueToString(lab: LAB['value']): LAB_StringProps['value'];
	convertRGBStringToValue(
		rgb: RGB_StringProps['value'],
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB['value'];
	convertRGBValueToString(rgb: RGB['value']): RGB_StringProps['value'];
	convertToHSL(
		color: Exclude<Color, SL | SV>,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	convertXYZStringToValue(
		xyz: XYZ_StringProps['value'],
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
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
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Color | null;
	toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T,
		brand: BrandingUtilsInterface,
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RangeKeyMap[T];
	validateAndConvertColor(
		color: Color | Color_StringProps | null,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Color | null;
}

export interface CoreUtilsInterface {
	clampToRange(
		value: number,
		rangeKey: NumericRangeKey,
		sets: DataSetsInterface
	): number;
	clone<T>(value: T): T;
	debounce<T extends (...args: Parameters<T>) => void>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void;
}

export interface DOMUtilsInterface {
	addConversionListener: (
		id: string,
		colorSpace: string,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		conversionUtils: ColorUtilHelpersInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	) => void;
	addEventListener<K extends keyof HTMLElementEventMap>(
		id: string,
		eventType: K,
		callback: (ev: HTMLElementEventMap[K]) => void,
		log: AppServicesInterface['log']
	): void;
	downloadFile(data: string, filename: string, type: string): void;
	enforceSwatchRules(
		minSwatches: number,
		maxSwatches: number,
		domIDs: DOMDataInterface['ids']['static'],
		log: AppServicesInterface['log'],
		mode: ModeDataInterface
	): void;
	populateOutputBox(
		color: Color | Color_StringProps,
		boxNumber: number,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): void;
	readFile(file: File): Promise<string>;
	switchColorSpaceInDOM(
		targetFormat: ColorSpace,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		conversionUtils: ColorUtilHelpersInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): void;
	updateColorBox(
		color: HSL,
		boxId: string,
		colorUtils: ColorUtilsInterface
	): void;
}

export interface FormattingUtilsInterface {
	addHashToHex(
		hex: Hex,
		brand: BrandingUtilsInterface,
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): Hex;
	componentToHex(component: number, log: AppServicesInterface['log']): string;
	formatPercentageValues<T extends Record<string, unknown>>(value: T): T;
	hslAddFormat(
		value: HSL['value'],
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): HSL;
	parseColor(
		colorSpace: ColorSpace,
		value: string,
		brand: BrandingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Color | null;
	parseComponents(
		value: string,
		count: number,
		log: AppServicesInterface['log']
	): number[];
	stripHashFromHex(
		hex: Hex,
		brand: BrandingUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
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
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): PaletteItem;
	createPaletteItemArray(
		baseColor: HSL,
		hues: number[],
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): PaletteItem[];
	createPaletteObject(
		args: PaletteArgs,
		appUtils: AppUtilsInterface
	): Palette;
	generateAllColorValues(
		color: HSL,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Partial<ColorDataExtended>;
	generateAnalogousHues(
		color: HSL,
		numBoxes: number,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): number[];
	generateAnalogousPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateComplementaryPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		distributionType: keyof ConstsDataInterface['probabilities'],
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		paletteHelpers: PaletteUtilHelpersInterface,
		probabilityConsts: ConstsDataInterface['probabilities'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateDiadicHues(
		baseHue: number,
		distributionType: keyof ConstsDataInterface['probabilities'],
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		paletteHelpers: PaletteUtilHelpersInterface,
		probabilityConsts: ConstsDataInterface['probabilities']
	): number[];
	generateDiadicPalette(
		args: PaletteGenerationArgs,
		distributionType: keyof ConstsDataInterface['probabilities'],
		paletteRanges: ConstsDataInterface['paletteRanges'],
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		paletteHelpers: PaletteUtilHelpersInterface,
		probabilityConsts: ConstsDataInterface['probabilities'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateHexadicHues(
		color: HSL,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): number[];
	generateHexadicPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		paletteRanges: ConstsDataInterface['paletteRanges'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateMonochromaticPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateRandomPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateSplitComplementaryHues: (
		baseHue: number,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log']
	) => number[];
	generateSplitComplementaryPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		paletteHelpers: PaletteUtilHelpersInterface,
		paletteRanges: ConstsDataInterface['paletteRanges'],
		probabilityConsts: ConstsDataInterface['probabilities'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateTetradicHues(
		baseHue: number,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log']
	): number[];
	generateTetradicPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		paletteRanges: ConstsDataInterface['paletteRanges'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
	generateTriadicHues(
		baseHue: number,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log']
	): number[];
	generateTriadicPalette(
		args: PaletteGenerationArgs,
		appUtils: AppUtilsInterface,
		brand: BrandingUtilsInterface,
		colorHelpers: ColorUtilHelpersInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		defaultColorStrings: DefaultDataInterface['colors']['strings'],
		domIDs: DOMDataInterface['ids']['static'],
		domUtils: DOMUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		mode: ModeDataInterface,
		paletteRanges: ConstsDataInterface['paletteRanges'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		typeGuards: TypeGuardUtilsInteface,
		validate: ValidationUtilsInterface
	): Palette;
}

export interface SanitationUtilsInterface {
	lab(
		value: number,
		output: 'l' | 'a' | 'b',
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB_L | LAB_A | LAB_B;
	percentile(
		value: number,
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Percentile;
	radial(
		value: number,
		brand: BrandingUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Radial;
	rgb(
		value: number,
		colorUtils: ColorUtilsInterface,
		brand: BrandingUtilsInterface,
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): ByteRange;
}

export interface TypeGuardUtilsInteface {
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
	isRGB(value: unknown): value is RGB;
	isRGBFormat(color: Color): color is RGB;
	isSLColor(value: unknown): value is SL;
	isSLFormat(color: Color): color is SL;
	isSLString(value: unknown): value is SL_StringProps;
	isStoredPalette(obj: unknown): obj is StoredPalette;
	isSVColor(value: unknown): value is SV;
	isSVFormat(color: Color): color is SV;
	isSVString(value: unknown): value is SV_StringProps;
	isXYZ(value: unknown): value is XYZ;
	isXYZFormat(color: Color): color is XYZ;
}

export interface ValidationUtilsInterface {
	colorValue(
		color: Color | SL | SV,
		coreUtils: CoreUtilsInterface,
		regex: ConfigDataInterface['regex']
	): boolean;
	ensureHash(value: string): string;
	hex(value: string, pattern: RegExp): boolean;
	hexComponent(value: string): boolean;
	hexSet(value: string): boolean;
	range<T extends keyof DataSetsInterface>(
		value: number | string,
		rangeKey: T,
		sets: DataSetsInterface
	): void;
}
