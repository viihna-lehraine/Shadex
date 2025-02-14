// File: types/functions.js

import {
	GenerateHuesArgs,
	GeneratePaletteArgs,
	HelpersInterface,
	Palette,
	SelectedPaletteOptions,
	ServicesInterface,
	UtilitiesInterface
} from './index.js';
import { StateManager } from '../state/StateManager.js';

// ******** SECTION 1: GENERIC FUNCTION INTERFACES ********

export interface NoArgVoidFn {
	(): void;
}

// ******** SECTION 1: FUNCTION INTERFACES ********

export interface AttachColorInputUpdateListenerFn {
	(
		colorDisplayID: string,
		colorInput: HTMLInputElement,
		column: HTMLElement,
		columnID: string,
		helpers: HelpersInterface,
		services: ServicesInterface,
		stateManager: StateManager,
		updatePaletteItemColor: UpdatePaletteItemColorFn,
		utils: UtilitiesInterface
	): void;
}

export interface AttachLockBtnLockingListenerFn {
	(
		lockBtnID: string,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): void;
}

export interface AttachPaletteListenersFn {
	(
		attachColorInputUpdateListener: AttachColorInputUpdateListenerFn,
		attachLockBtnLockingListener: AttachLockBtnLockingListenerFn,
		attachResizeHandleListener: AttachResizeHandleListenerFn,
		attachTooltipListener: AttachToolTipListenerFn,
		createTooltipElement: CreateTooltipElementFn,
		helpers: HelpersInterface,
		services: ServicesInterface,
		stateManager: StateManager,
		updatePaletteItemColor: UpdatePaletteItemColorFn,
		utils: UtilitiesInterface
	): void;
}

export interface AttachResizeHandleListenerFn {
	(
		column: HTMLElement,
		resizeHandleID: string,
		services: ServicesInterface,
		stateManager: StateManager,
		utils: UtilitiesInterface
	): void;
}

export interface AttachToolTipListenerFn {
	(
		id: string,
		tooltipText: string,
		createTooltipElement: CreateTooltipElementFn,
		utils: UtilitiesInterface
	): void;
}

export interface CreatePaletteObserverFn {
	(
		attachColorInputUpdateListener: AttachColorInputUpdateListenerFn,
		attachLockBtnLockingListener: AttachLockBtnLockingListenerFn,
		attachPaletteListeners: AttachPaletteListenersFn,
		attachResizeHandleListener: AttachResizeHandleListenerFn,
		attachTooltipListener: AttachToolTipListenerFn,
		createTooltipElement: CreateTooltipElementFn,
		helpers: HelpersInterface,
		services: ServicesInterface,
		stateManager: StateManager,
		updatePaletteItemColor: UpdatePaletteItemColorFn,
		utilities: UtilitiesInterface
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
	(stateManager: StateManager, utils: UtilitiesInterface): void;
}

export interface PullParamsFromUIFn {
	(
		services: ServicesInterface,
		utils: UtilitiesInterface
	): SelectedPaletteOptions;
}

export interface UpdatePaletteItemColorFn {
	(
		numericColumnID: number,
		newColor: string,
		helpers: HelpersInterface,
		services: ServicesInterface,
		utils: UtilitiesInterface
	): void;
}

// ******** SECTION 2: FUNCTION GROUPS ********

export interface EventListenerAttachmentFunctions {
	attachColorInputUpdateListener: AttachColorInputUpdateListenerFn;
	attachLockBtnLockingListener: AttachLockBtnLockingListenerFn;
	attachPaletteListeners: AttachPaletteListenersFn;
	attachResizeHandleListener: AttachResizeHandleListenerFn;
	attachTooltipListener: AttachToolTipListenerFn;
}

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
