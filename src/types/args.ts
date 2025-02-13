// File: types/args.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	AppUtilsInterface,
	ArgsHelpersInterface,
	AttachPaletteListenersFn,
	AttachToolTipListenerFn,
	BrandingUtilsInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	CreateTooltipElementFn,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	GenerateHuesFn,
	GeneratePaletteFn,
	HSL,
	PaletteItem,
	PaletteType,
	PaletteUtilHelpersInterface,
	PaletteUtilsInterface,
	PullParamsFromUIFn,
	SanitationUtilsInterface,
	SelectedPaletteOptions,
	TypeGuardUtilsInterface,
	UpdatePaletteItemColorFn,
	ValidationUtilsInterface
} from './index.js';
import { StateManager } from '../state/StateManager.js';

export type CreatePaletteItemArrayArgs_Tuple = [
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

export type CreatePaletteItemArgs_Tuple = [
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

export interface CreatePaletteObjectArgs {
	type: PaletteType;
	items: PaletteItem[];
	paletteID: string;
	swatches: number;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface GenerateHuesArgs {
	color: HSL;
	columnCount: number;
	distributionType: keyof ConstsDataInterface['probabilities'];
	paletteType: PaletteType;
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

export interface GeneratePaletteArgs {
	options: SelectedPaletteOptions;
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
	generateHues: GenerateHuesFn;
	paletteHelpers: PaletteUtilHelpersInterface;
	paletteUtils: PaletteUtilsInterface;
	sanitize: SanitationUtilsInterface;
	typeGuards: TypeGuardUtilsInterface;
	validate: ValidationUtilsInterface;
}

export type GenerateRandomColorArgs_Tuple = [
	AppServicesInterface,
	BrandingUtilsInterface,
	CoreUtilsInterface,
	SanitationUtilsInterface,
	ValidationUtilsInterface
];

export interface PaletteArgs {
	type: PaletteType;
	items: PaletteItem[];
	paletteID: string;
	swatches: number;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface RenderNewPaletteArgs {
	adjust: AdjustmentUtilsInterface;
	appServices: AppServicesInterface;
	appUtils: AppUtilsInterface;
	argsHelpers: ArgsHelpersInterface;
	attachPaletteListeners: AttachPaletteListenersFn;
	attachTooltipListener: AttachToolTipListenerFn;
	brand: BrandingUtilsInterface;
	colorHelpers: ColorUtilHelpersInterface;
	colorUtils: ColorUtilsInterface;
	coreUtils: CoreUtilsInterface;
	createTooltipElement: CreateTooltipElementFn;
	domUtils: DOMUtilsInterface;
	format: FormattingUtilsInterface;
	generateHues: GenerateHuesFn;
	generatePalette: GeneratePaletteFn;
	paletteHelpers: PaletteUtilHelpersInterface;
	paletteUtils: PaletteUtilsInterface;
	pullParamsFromUI: PullParamsFromUIFn;
	sanitize: SanitationUtilsInterface;
	stateManager: StateManager;
	typeGuards: TypeGuardUtilsInterface;
	updatePaletteItemColor: UpdatePaletteItemColorFn;
	validate: ValidationUtilsInterface;
}
