// File: dom/events/initialize/main.js

import {
	AppServicesInterface,
	AttachColorInputUpdateListenerFn,
	AttachLockBtnLockingListenerFn,
	AttachPaletteListenersFn,
	AttachResizeHandleListenerFn,
	AttachToolTipListenerFn,
	CreatePaletteObserverFn,
	CreateTooltipElementFn,
	InitializeColumnPositionsFn,
	UpdatePaletteItemColorFn,
	UtilitiesInterface
} from '../../../types/index.js';
import { StateManager } from '../../../state/StateManager.js';
import { domData } from '../../../data/dom.js';

const btnIDs = domData.ids.btns;

export function initializeEventListeners(
	appServices: AppServicesInterface,
	attachColorInputUpdateListener: AttachColorInputUpdateListenerFn,
	attachLockBtnLockingListener: AttachLockBtnLockingListenerFn,
	attachPaletteListeners: AttachPaletteListenersFn,
	attachResizeHandleListener: AttachResizeHandleListenerFn,
	attachTooltipListener: AttachToolTipListenerFn,
	colorHelpers:
	createPaletteObserver: CreatePaletteObserverFn,
	createTooltipElement: CreateTooltipElementFn,
	initializeColumnPositions: InitializeColumnPositionsFn,
	stateManager: StateManager,
	updatePaletteItemColor: UpdatePaletteItemColorFn,
	utils: UtilitiesInterface
): void {
	const log = appServices.log;

	log(
		'debug',
		'Initializing event listeners...',
		'initializeEventListeners()',
		2
	);

	utils.dom.addEventListener(
		btnIDs.desaturate,
		'click',
		(e: Event) => {
			e.preventDefault();

			const selectedColor = 0;

			log(
				'debug',
				'Desaturate button clicked',
				'initializeEventListeners()',
				5
			);

			// *DEV-NOTE* desaturation logic...
			log(
				'debug',
				`Cannot desaturate color: ${selectedColor}. Please add logic!`,
				'initializeEventListeners()',
				2
			);
		},
		appServices
	);

	utils.dom.addEventListener(
		btnIDs.export,
		'click',
		e => {
			e.preventDefault();

			log(
				'debug',
				`Export button clicked`,
				'initializeEventListeners()',
				5
			);

			// *DEV-NOTE* export logic...
		},
		appServices
	);

	utils.dom.addEventListener(
		btnIDs.generate,
		'click',
		e => {
			e.preventDefault();

			log(
				'debug',
				'Generate button clicked',
				'initializeEventListeners()',
				5
			);

			// *DEV-NOTE* palette generation logic...
		},
		appServices
	);

	initializeColumnPositions(stateManager, utils);

	createPaletteObserver(
		appServices,
		attachColorInputUpdateListener,
		attachLockBtnLockingListener,
		attachPaletteListeners,
		attachResizeHandleListener,
		attachTooltipListener,
		colorHelpers,
		createTooltipElement,
		stateManager,
		updatePaletteItemColor,
		utils
	);
}
