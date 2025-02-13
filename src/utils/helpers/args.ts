// File: utils/helpers/args.js

import {
	ArgsHelpersInterface,
	CreatePaletteItemArrayArgs_Tuple,
	CreatePaletteItemArgs_Tuple,
	CreatePaletteObjectArgs,
	GeneratePaletteArgs,
	GenerateHuesArgs,
	GenerateRandomColorArgs_Tuple,
	HSL,
	PaletteItem,
	PaletteType
} from '../../types/index.js';

function getCreatePaletteItemArgs(
	baseColor: HSL,
	itemID: number,
	params: GeneratePaletteArgs
): CreatePaletteItemArgs_Tuple {
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
	paletteArgs: GeneratePaletteArgs
): CreatePaletteItemArrayArgs_Tuple {
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
	type: PaletteType,
	paletteID: string,
	paletteItems: PaletteItem[],
	swatchCount: number,
	paletteArgs: GeneratePaletteArgs
): CreatePaletteObjectArgs {
	return {
		type,
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: paletteArgs.options.limitDark,
		limitGray: paletteArgs.options.limitGray,
		limitLight: paletteArgs.options.limitLight
	};
}

function getGenerateRandomColorArgs(
	paletteArgs: GeneratePaletteArgs
): GenerateRandomColorArgs_Tuple {
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
	paletteArgs: GeneratePaletteArgs
): GenerateHuesArgs {
	return {
		color: baseColor,
		columnCount: paletteArgs.options.columnCount,
		distributionType: paletteArgs.options.distributionType,
		paletteType: paletteArgs.options.paletteType,
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
