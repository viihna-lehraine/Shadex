// File: utils/helpers/args.js

import {
	AppServicesInterface,
	ArgsHelpersInterface,
	BrandingUtilsInterface,
	ColorUtilsInterface,
	ColorUtilHelpersInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	GeneratePaletteFnArgs,
	GenerateHuesFnArgs,
	HSL,
	PaletteItem,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from '../../types/index.js';

function getCreatePaletteItemArgs(
	baseColor: HSL,
	itemID: number,
	params: GeneratePaletteFnArgs
): [
	HSL,
	number,
	AppServicesInterface,
	BrandingUtilsInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	FormattingUtilsInterface,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
] {
	return [
		baseColor,
		itemID,
		params.appServices,
		params.brand,
		params.colorHelpers,
		params.colorUtils,
		params.coreUtils,
		params.format,
		params.sanitize,
		params.typeGuards,
		params.validate
	];
}

function getCreatePaletteItemArrayArgs(
	baseColor: HSL,
	hues: number[],
	paletteArgs: GeneratePaletteFnArgs
): [
	HSL,
	number[],
	AppServicesInterface,
	BrandingUtilsInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
] {
	return [
		baseColor,
		hues,
		paletteArgs.appServices,
		paletteArgs.brand,
		paletteArgs.colorHelpers,
		paletteArgs.colorUtils,
		paletteArgs.coreUtils,
		paletteArgs.domUtils,
		paletteArgs.format,
		paletteArgs.sanitize,
		paletteArgs.typeGuards,
		paletteArgs.validate
	];
}

function getCreatePaletteObjectArgs(
	type: string,
	paletteID: string,
	paletteItems: PaletteItem[],
	swatchCount: number,
	paletteArgs: GeneratePaletteFnArgs
): {
	type: string;
	items: PaletteItem[];
	paletteID: string;
	swatches: number;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
} {
	return {
		type,
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: paletteArgs.args.limitDark,
		limitGray: paletteArgs.args.limitGray,
		limitLight: paletteArgs.args.limitLight
	};
}

function getGenerateRandomColorArgs(
	paletteArgs: GeneratePaletteFnArgs
): [
	AppServicesInterface,
	BrandingUtilsInterface,
	CoreUtilsInterface,
	SanitationUtilsInterface,
	ValidationUtilsInterface
] {
	return [
		paletteArgs.appServices,
		paletteArgs.brand,
		paletteArgs.coreUtils,
		paletteArgs.sanitize,
		paletteArgs.validate
	];
}

function getHueGenerationArgs(
	baseColor: HSL,
	type:
		| 'analogous'
		| 'diadic'
		| 'hexadic'
		| 'split-complementary'
		| 'tetradic'
		| 'triadic',
	paletteArgs: GeneratePaletteFnArgs
): GenerateHuesFnArgs {
	if (!type) throw new Error('Type is required');

	return {
		color: baseColor,
		distributionType: paletteArgs.args.distributionType,
		swatches: paletteArgs.args.swatches,
		type,
		adjust: paletteArgs.adjust,
		appServices: paletteArgs.appServices,
		argsHelpers: paletteArgs.argsHelpers,
		brand: paletteArgs.brand,
		colorHelpers: paletteArgs.colorHelpers,
		colorUtils: paletteArgs.colorUtils,
		coreUtils: paletteArgs.coreUtils,
		format: paletteArgs.format,
		paletteHelpers: paletteArgs.paletteHelpers,
		validate: paletteArgs.validate
	};
}

export const argsHelpers: ArgsHelpersInterface = {
	getCreatePaletteItemArgs,
	getCreatePaletteItemArrayArgs,
	getCreatePaletteObjectArgs,
	getGenerateRandomColorArgs,
	getHueGenerationArgs
};
