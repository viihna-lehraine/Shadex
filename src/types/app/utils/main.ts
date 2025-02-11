// File: types/app/common/main.js

import {
	AdjustmentUtilsInterface,
	AppUtilsInterface,
	BrandingUtilsInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	PaletteUtilsInterface,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from '../../index.js';

export interface UtilitiesInterface {
	adjust: AdjustmentUtilsInterface;
	app: AppUtilsInterface;
	branding: BrandingUtilsInterface;
	color: ColorUtilsInterface;
	core: CoreUtilsInterface;
	dom: DOMUtilsInterface;
	format: FormattingUtilsInterface;
	palette: PaletteUtilsInterface;
	sanitize: SanitationUtilsInterface;
	typeGuards: TypeGuardUtilsInterface;
	validate: ValidationUtilsInterface;
}
