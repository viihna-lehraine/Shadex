// File: types/functions.js

import {
	AppServicesInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	GenerateHuesArgs,
	GeneratePaletteArgs,
	Palette,
	SelectedPaletteOptions,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from './index.js';
import { StateManager } from '../state/StateManager.js';

// ******** SECTION 1: GENERIC FUNCTION INTERFACES ********

export interface NoArgVoidFn {
	(): void;
}

// ******** SECTION 1: FUNCTION INTERFACES ********

export interface AttachPaletteListenersFn {
	(
		appServices: AppServicesInterface,
		attachTooltipListener: AttachToolTipListenerFn,
		coreUtils: CoreUtilsInterface,
		createTooltipElement: CreateTooltipElementFn,
		domUtils: DOMUtilsInterface,
		stateManager: StateManager,
		typeGuards: TypeGuardUtilsInterface,
		updatePaletteItemColor: UpdatePaletteItemColorFn,
		validate: ValidationUtilsInterface
	): void;
}

export interface AttachToolTipListenerFn {
	(
		id: string,
		tooltipText: string,
		coreUtils: CoreUtilsInterface,
		createTooltipElement: CreateTooltipElementFn
	): void;
}

export interface CreatePaletteObserverFn {
	(
		appServices: AppServicesInterface,
		attachTooltipListener: AttachToolTipListenerFn,
		coreUtils: CoreUtilsInterface,
		createTooltipElement: CreateTooltipElementFn,
		domUtils: DOMUtilsInterface,
		stateManager: StateManager,
		typeGuards: TypeGuardUtilsInterface,
		updatePaletteItemColor: UpdatePaletteItemColorFn,
		validate: ValidationUtilsInterface
	): MutationObserver;
}

export interface CreateTooltipElementFn {
	(): HTMLDivElement;
}

export interface GenerateHuesFn {
	(params: GenerateHuesArgs): number[];
}

export interface GeneratePaletteFn {
	(params: GeneratePaletteArgs): Palette;
}

export interface InitializeColumnPositionsFn {
	(coreUtils: CoreUtilsInterface, stateManager: StateManager): void;
}

export interface PullParamsFromUIFn {
	(
		appServices: AppServicesInterface,
		typeGuards: TypeGuardUtilsInterface
	): SelectedPaletteOptions;
}

export interface UpdatePaletteItemColorFn {
	(columnID: number, newColor: string, stateManager: StateManager): void;
}

// ******** SECTION 2: FUNCTION GROUPS ********

export interface HueGenFunctions {
	generateAnalogousHues: GenerateHuesFn;
	generateDiadicHues: GenerateHuesFn;
	generateHexadicHues: GenerateHuesFn;
	generateSplitComplementaryHues: GenerateHuesFn;
	generateTetradicHues: GenerateHuesFn;
	generateTriadicHues: GenerateHuesFn;
}

export interface PaletteGenFunctions {
	generateAnalogousPalette: GeneratePaletteFn;
	generateComplementaryPalette: GeneratePaletteFn;
	generateDiadicPalette: GeneratePaletteFn;
	generateHexadicPalette: GeneratePaletteFn;
	generateMonochromaticPalette: GeneratePaletteFn;
	generateRandomPalette: GeneratePaletteFn;
	generateSplitComplementaryPalette: GeneratePaletteFn;
	generateTetradicPalette: GeneratePaletteFn;
	generateTriadicPalette: GeneratePaletteFn;
}
