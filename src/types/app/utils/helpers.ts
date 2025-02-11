// File: types/app/utils/helpers.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	CMYK,
	ColorUtilsInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	GenerateHuesFnArgs,
	GeneratePaletteFnArgs,
	Hex,
	HSL,
	HSV,
	LAB,
	PaletteItem,
	RGB,
	SanitationUtilsInterface,
	SL,
	SV,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface,
	XYZ
} from '../../index.js';

export interface ArgsHelpersInterface {
	getCreatePaletteItemArgs(
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
	];
	getCreatePaletteItemArrayArgs(
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
	];
	getCreatePaletteObjectArgs(
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
	};
	getGenerateRandomColorArgs(
		paletteArgs: GeneratePaletteFnArgs
	): [
		AppServicesInterface,
		BrandingUtilsInterface,
		CoreUtilsInterface,
		SanitationUtilsInterface,
		ValidationUtilsInterface
	];
	getHueGenerationArgs(
		baseColor: HSL,
		type:
			| 'analogous'
			| 'diadic'
			| 'hexadic'
			| 'split-complementary'
			| 'tetradic'
			| 'triadic',
		paletteArgs: GeneratePaletteFnArgs
	): GenerateHuesFnArgs;
}

export interface ColorConversionHelpersInterface {
	cmykToHSL(
		cmyk: CMYK,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	cmykToRGB(
		cmyk: CMYK,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	hexToHSL(
		hex: Hex,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	hexToRGB(
		hex: Hex,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	hslToCMYK(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): CMYK;
	hslToHex(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		validate: ValidationUtilsInterface
	): Hex;
	hslToHSV(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSV;
	hslToLAB(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): LAB;
	hslToRGB(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	hslToSL(
		hsl: HSL,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): SL;
	hslToSV(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): SV;
	hslToXYZ(
		hsl: HSL,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	hsvToHSL(
		hsv: HSV,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	hsvToSV(
		hsv: HSV,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): SV;
	labToHSL(
		lab: LAB,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	labToRGB(
		lab: LAB,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	labToXYZ(
		lab: LAB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	rgbToCMYK(
		rgb: RGB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): CMYK;
	rgbToHex(
		rgb: RGB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		validate: ValidationUtilsInterface
	): Hex;
	rgbToHSL(
		rgb: RGB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	rgbToHSV(
		rgb: RGB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSV;
	rgbToXYZ(
		rgb: RGB,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	xyzToHSL(
		xyz: XYZ,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	xyzToLAB(
		xyz: XYZ,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		sanitize: SanitationUtilsInterface,
		validate: ValidationUtilsInterface
	): LAB;
	xyzToRGB(
		xyz: XYZ,
		adjust: AdjustmentUtilsInterface,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): RGB;
}

export interface ColorUtilHelpersInterface
	extends ColorConversionHelpersInterface {
	hexToHSLWrapper(
		input: string | Hex,
		appServices: AppServicesInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		validate: ValidationUtilsInterface
	): HSL;
}

export interface PaletteUtilHelpersInterface {
	getWeightedRandomInterval(
		type: keyof ConstsDataInterface['probabilities'],
		appServices: AppServicesInterface
	): number;
	isHSLInBounds(
		hsl: HSL,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): boolean;
	isHSLTooDark(
		hsl: HSL,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): boolean;
	isHSLTooGray(
		hsl: HSL,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): boolean;
	isHSLTooLight(
		hsl: HSL,
		appServices: AppServicesInterface,
		coreUtils: CoreUtilsInterface,
		validate: ValidationUtilsInterface
	): boolean;
}
