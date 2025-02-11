// File: types/functions.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	AppUtilsInterface,
	ArgsHelpersInterface,
	BrandingUtilsInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	HSL,
	Palette,
	PaletteGenerationArgs,
	PaletteUtilHelpersInterface,
	PaletteUtilsInterface,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from './index.js';

// ******** SECTION 1: ARGUMENT INTERFACES ********

export interface GenerateHuesFnArgs {
	color: HSL;
	distributionType: keyof ConstsDataInterface['probabilities'];
	swatches: number;
	type:
		| 'analogous'
		| 'diadic'
		| 'hexadic'
		| 'split-complementary'
		| 'tetradic'
		| 'triadic';
	adjust: AdjustmentUtilsInterface;
	appServices: AppServicesInterface;
	argsHelpers: ArgsHelpersInterface;
	brand: BrandingUtilsInterface;
	colorHelpers: ColorUtilHelpersInterface;
	colorUtils: ColorUtilsInterface;
	coreUtils: CoreUtilsInterface;
	format: FormattingUtilsInterface;
	paletteHelpers: PaletteUtilHelpersInterface;
	validate: ValidationUtilsInterface;
}

export interface GeneratePaletteFnArgs {
	args: PaletteGenerationArgs;
	type:
		| 'analogous'
		| 'complementary'
		| 'diadic'
		| 'hexadic'
		| 'monochromatic'
		| 'random'
		| 'split-complementary'
		| 'tetradic'
		| 'triadic';
	adjust: AdjustmentUtilsInterface;
	appServices: AppServicesInterface;
	appUtils: AppUtilsInterface;
	argsHelpers: ArgsHelpersInterface;
	brand: BrandingUtilsInterface;
	colorHelpers: ColorUtilHelpersInterface;
	colorUtils: ColorUtilsInterface;
	coreUtils: CoreUtilsInterface;
	domUtils: DOMUtilsInterface;
	format: FormattingUtilsInterface;
	generateHues: GenerateHuesFnInterface;
	paletteHelpers: PaletteUtilHelpersInterface;
	paletteUtils: PaletteUtilsInterface;
	sanitize: SanitationUtilsInterface;
	typeGuards: TypeGuardUtilsInterface;
	validate: ValidationUtilsInterface;
}

// ******** SECTION 2: FUNCTION INTERFACES ********

export interface GenerateHuesFnInterface {
	(params: GenerateHuesFnArgs): number[];
}

export interface GeneratePaletteFnInterface {
	(params: GeneratePaletteFnArgs): Palette;
}

// ******** SECTION 3: FUNCTION GROUPS ********

export interface HueGenFunctions {
	generateAnalogousHues: GenerateHuesFnInterface;
	generateDiadicHues: GenerateHuesFnInterface;
	generateHexadicHues: GenerateHuesFnInterface;
	generateSplitComplementaryHues: GenerateHuesFnInterface;
	generateTetradicHues: GenerateHuesFnInterface;
	generateTriadicHues: GenerateHuesFnInterface;
}

export interface PaletteGenFunctions {
	generateAnalogousPalette: GeneratePaletteFnInterface;
	generateComplementaryPalette: GeneratePaletteFnInterface;
	generateDiadicPalette: GeneratePaletteFnInterface;
	generateHexadicPalette: GeneratePaletteFnInterface;
	generateMonochromaticPalette: GeneratePaletteFnInterface;
	generateRandomPalette: GeneratePaletteFnInterface;
	generateSplitComplementaryPalette: GeneratePaletteFnInterface;
	generateTetradicPalette: GeneratePaletteFnInterface;
	generateTriadicPalette: GeneratePaletteFnInterface;
}

// ******** SECTION 3: OTHER ********

export type RandomColorArgs = [
	AppServicesInterface,
	BrandingUtilsInterface,
	CoreUtilsInterface,
	SanitationUtilsInterface,
	ValidationUtilsInterface
];
