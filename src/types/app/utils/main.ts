// File: types/app/common/main.js

import {
	AdjustmentUtilsInterface,
	AppUtilsInterface,
	BrandingUtilsInterface,
	ColorConversionHelpersInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	PaletteUtilHelpersInterface,
	PaletteUtilsInterface,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from '../../index.js';

export interface HelpersInterface {
	color: ColorUtilHelpersInterface;
	colorConversion: ColorConversionHelpersInterface;
	palette: PaletteUtilHelpersInterface;
}

export interface UtilitiesInterface {
	adjust: AdjustmentUtilsInterface;
	app: AppUtilsInterface;
	brand: BrandingUtilsInterface;
	color: ColorUtilsInterface;
	core: CoreUtilsInterface;
	dom: DOMUtilsInterface;
	format: FormattingUtilsInterface;
	palette: PaletteUtilsInterface;
	sanitize: SanitationUtilsInterface;
	typeGuards: TypeGuardUtilsInterface;
	validate: ValidationUtilsInterface;
}
