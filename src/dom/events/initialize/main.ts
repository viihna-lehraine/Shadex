// File: dom/events/initialize/main.js

import {
	AppServicesInterface,
	AttachToolTipListenerFn,
	CoreUtilsInterface,
	CreatePaletteObserverFn,
	CreateTooltipElementFn,
	DOMUtilsInterface,
	InitializeColumnPositionsFn,
	ValidationUtilsInterface
} from '../../../types/index.js';
import { StateManager } from '../../../state/StateManager.js';
import { domData } from '../../../data/dom.js';

const btnIDs = domData.ids.btns;

export function initializeEventListeners(
	appServices: AppServicesInterface,
	attachTooltipListener: AttachToolTipListenerFn,
	coreUtils: CoreUtilsInterface,
	createPaletteObserver: CreatePaletteObserverFn,
	createTooltipElement: CreateTooltipElementFn,
	domUtils: DOMUtilsInterface,
	initializePaletteColumns: InitializeColumnPositionsFn,
	stateManager: StateManager,
	validate: ValidationUtilsInterface
): void {
	const log = appServices.log;

	log(
		'debug',
		'Initializing event listeners...',
		'initializeEventListeners()',
		2
	);

	domUtils.addEventListener(
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

	domUtils.addEventListener(
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

	domUtils.addEventListener(
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

	initializePaletteColumns(coreUtils, stateManager);

	createPaletteObserver(
		appServices,
		attachTooltipListener,
		coreUtils,
		createTooltipElement,
		domUtils,
		stateManager,
		validate
	);
}
