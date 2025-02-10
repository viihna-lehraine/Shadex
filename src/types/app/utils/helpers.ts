// File: types/app/utils/helpers.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	CMYK,
	ColorUtilsInterface,
	ConfigDataInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	DataSetsInterface,
	DefaultDataInterface,
	FormattingUtilsInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	RGB,
	SanitationUtilsInterface,
	SL,
	SV,
	ValidationUtilsInterface,
	XYZ
} from '../../index.js';

export interface ColorConversionHelpersInterface {
	cmykToHSL(
		cmyk: CMYK,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	cmykToRGB(
		cmyk: CMYK,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	hexToHSL(
		hex: Hex,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	hexToRGB(
		hex: Hex,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	hslToCMYK(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): CMYK;
	hslToHex(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): Hex;
	hslToHSV(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSV;
	hslToLAB(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB;
	hslToRGB(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	hslToSL(
		hsl: HSL,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): SL;
	hslToSV(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): SV;
	hslToXYZ(
		hsl: HSL,
		brand: BrandingUtilsInterface,
		colorUtils: ColorUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	hsvToHSL(
		hsv: HSV,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	hsvToSV(
		hsv: HSV,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): SV;
	labToHSL(
		lab: LAB,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	labToRGB(
		lab: LAB,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
	labToXYZ(
		lab: LAB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	rgbToCMYK(
		rgb: RGB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): CMYK;
	rgbToHex(
		rgb: RGB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): Hex;
	rgbToHSL(
		rgb: RGB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	rgbToHSV(
		rgb: RGB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSV;
	rgbToXYZ(
		rgb: RGB,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): XYZ;
	xyzToHSL(
		xyz: XYZ,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
	xyzToLAB(
		xyz: XYZ,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sanitize: SanitationUtilsInterface,
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): LAB;
	xyzToRGB(
		xyz: XYZ,
		adjust: AdjustmentUtilsInterface,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): RGB;
}

export interface ColorUtilHelpersInterface
	extends ColorConversionHelpersInterface {
	hexToHSLWrapper(
		input: string | Hex,
		brand: BrandingUtilsInterface,
		coreUtils: CoreUtilsInterface,
		defaultColors: DefaultDataInterface['colors']['base']['branded'],
		format: FormattingUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		sets: DataSetsInterface,
		validate: ValidationUtilsInterface
	): HSL;
}

export interface PaletteUtilHelpersInterface {
	getWeightedRandomInterval(
		type: keyof ConstsDataInterface['probabilities'],
		log: AppServicesInterface['log'],
		probabilityConsts: ConstsDataInterface['probabilities']
	): number;
	isHSLInBounds(
		hsl: HSL,
		consts: ConstsDataInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): boolean;
	isHSLTooDark(
		hsl: HSL,
		consts: ConstsDataInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): boolean;
	isHSLTooGray(
		hsl: HSL,
		consts: ConstsDataInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): boolean;
	isHSLTooLight(
		hsl: HSL,
		consts: ConstsDataInterface,
		coreUtils: CoreUtilsInterface,
		log: AppServicesInterface['log'],
		regex: ConfigDataInterface['regex'],
		validate: ValidationUtilsInterface
	): boolean;
}
