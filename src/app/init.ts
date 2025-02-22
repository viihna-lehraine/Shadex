// File: app/init.ts

import type {
	CommonFunctions,
	GenerateHuesFnGroup,
	GeneratePaletteFn,
	GeneratePaletteFnGroup,
	Helpers,
	Services,
	Utilities
} from '../types/index.js';
import { EventManager } from '../events/EventManager.js';
import { PaletteEvents } from '../events/PaletteEvents.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { PaletteState } from '../state/PaletteState.js';
import { StateManager } from '../state/StateManager.js';
import { UIEvents } from '../events/UIEvents.js';

async function exposeClasses(
	eventManager: EventManager,
	paletteEvents: PaletteEvents,
	paletteManager: PaletteManager,
	services: Services,
	stateManager: StateManager,
	uiEvents: UIEvents
): Promise<void> {
	const { log, errors } = services;
	log(`Function called.`, { caller: '[EXPOSE_CLASSES]' });

	return await errors.handleAndReturn(async () => {
		log('Exposing functions to window.', { caller: '[EXPOSE_CLASSES]' });
		window.eventManager = eventManager;
		window.paletteEvents = paletteEvents;
		window.paletteManager = paletteManager;
		window.stateManager = stateManager;
		window.uiEvents = uiEvents;
		window.EventManager = EventManager;
		log('Functions exposed to window.', { caller: '[EXPOSE_CLASSES]' });
	}, 'Error exposing functions to window');
}

async function initializeEvents(
	helpers: Helpers,
	paletteManager: PaletteManager,
	paletteState: PaletteState,
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<{
	palette: PaletteEvents;
	ui: UIEvents;
}> {
	const { errors } = services;

	return await errors.handleAndReturn(async () => {
		const paletteEvents = new PaletteEvents(
			helpers,
			paletteManager,
			paletteState,
			services,
			stateManager,
			utils
		);
		const uiEvents = new UIEvents(helpers, paletteManager, services, utils);

		paletteEvents.init();

		uiEvents.init();
		uiEvents.initButtons();

		return { palette: paletteEvents, ui: uiEvents };
	}, 'Error initializing events');
}

async function initializePaletteManager(
	common: CommonFunctions,
	generateHuesFnGroup: GenerateHuesFnGroup,
	generatePaletteFnGroup: GeneratePaletteFnGroup,
	generatePalette: GeneratePaletteFn,
	stateManager: StateManager
): Promise<PaletteManager> {
	const { errors } = common.services;

	return await errors.handleAndReturn(async () => {
		const paletteManager = new PaletteManager(
			stateManager,
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);
		return paletteManager;
	}, 'Error initializing PaletteManager.');
}

async function initializePaletteState(
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<PaletteState> {
	const { errors } = services;

	return await errors.handleAndReturn(async () => {
		const palettestate = new PaletteState(stateManager, services, utils);

		return palettestate;
	}, 'Error initializing PaletteState');
}

async function initializeStateManager(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): Promise<StateManager> {
	const { errors } = services;

	return await errors.handleAndReturn(async () => {
		const stateManager = StateManager.getInstance(helpers, services, utils);

		return stateManager;
	}, 'Error initializing StateManager');
}

async function initializeUtilities(
	helpers: Helpers,
	services: Services
): Promise<Utilities> {
	const { errors } = services;

	return await errors.handleAndReturn(async () => {
		const { utilitiesFactory } = await import(
			'../common/factories/utils.js'
		);

		const utils = await utilitiesFactory(helpers, services);

		return utils;
	}, 'Error initializing utils');
}

export {
	exposeClasses,
	initializeEvents,
	initializePaletteManager,
	initializePaletteState,
	initializeStateManager,
	initializeUtilities
};
