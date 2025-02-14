// File: types/args.js

import {
	AttachColorInputUpdateListenerFn,
	AttachLockBtnLockingListenerFn,
	AttachPaletteListenersFn,
	AttachResizeHandleListenerFn,
	AttachToolTipListenerFn,
	ConstsDataInterface,
	CreateTooltipElementFn,
	GenerateHuesFn,
	GeneratePaletteFn,
	HelpersInterface,
	HSL,
	PaletteItem,
	PaletteType,
	PullParamsFromUIFn,
	SelectedPaletteOptions,
	ServicesInterface,
	UpdatePaletteItemColorFn,
	UtilitiesInterface
} from './index.js';
import { StateManager } from '../state/StateManager.js';

export type CreatePaletteDataArgs_Tuple = [
	HSL,
	number[],
	HelpersInterface,
	ServicesInterface,
	UtilitiesInterface
];

export interface CreatePaletteObjectArgs {
	type: PaletteType;
	items: PaletteItem[];
	paletteID: string;
	columnCount: number;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}

export interface GenerateHuesArgs {
	color: HSL;
	columnCount: number;
	distributionType: keyof ConstsDataInterface['probabilities'];
	paletteType: PaletteType;
	helpers: HelpersInterface;
	services: ServicesInterface;
	utils: UtilitiesInterface;
}

export interface GeneratePaletteArgs {
	options: SelectedPaletteOptions;
	helpers: HelpersInterface;
	generateHues: GenerateHuesFn;
	services: ServicesInterface;
	utils: UtilitiesInterface;
}

export type GenerateRandomColorArgs_Tuple = [
	ServicesInterface,
	UtilitiesInterface
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
	attachColorInputUpdateListener: AttachColorInputUpdateListenerFn;
	attachLockBtnLockingListener: AttachLockBtnLockingListenerFn;
	attachPaletteListeners: AttachPaletteListenersFn;
	attachResizeHandleListener: AttachResizeHandleListenerFn;
	attachTooltipListener: AttachToolTipListenerFn;
	createTooltipElement: CreateTooltipElementFn;
	helpers: HelpersInterface;
	generateHues: GenerateHuesFn;
	generatePalette: GeneratePaletteFn;
	pullParamsFromUI: PullParamsFromUIFn;
	services: ServicesInterface;
	stateManager: StateManager;
	updatePaletteItemColor: UpdatePaletteItemColorFn;
	utils: UtilitiesInterface;
}
