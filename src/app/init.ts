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
import {
	EventManager,
	PaletteEventsService,
	UIEventsService
} from '../dom/index.js';
import { PaletteStateService, StateManager } from '../state/index.js';

async function exposeClasses(
	eventManager: EventManager,
	paletteEvents: PaletteEventsService,
	services: Services,
	stateManager: StateManager,
	uiEvents: UIEventsService
): Promise<void> {
	const { log, errors } = services;
	log.info(`Function called.`, `[EXPOSE_CLASSES]`);

	return await errors.handleAndReturn(async () => {
		log.info('Exposing functions to window.', `[EXPOSE_CLASSES]`);
		window.eventManager = eventManager;
		window.paletteEvents = paletteEvents;
		window.stateManager = stateManager;
		window.uiEvents = uiEvents;
		window.EventManager = EventManager;
		log.info('Functions exposed to window.', `[EXPOSE_CLASSES]`);
	}, 'Error exposing functions to window');
}

async function initializeEvents(
	helpers: Helpers,
	paletteState: PaletteStateService,
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<{
	palette: PaletteEventsService;
	ui: UIEventsService;
}> {
	const { errors } = services;

	return await errors.handleAndReturn(async () => {
		const paletteEvents = new PaletteEventsService(
			helpers,
			paletteManager,
			paletteState,
			services,
			stateManager,
			utils
		);
		const uiEvents = new UIEventsService(
			helpers,
			paletteManager,
			services,
			utils
		);

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

async function initializePaletteStateService(
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<PaletteStateService> {
	const { errors } = services;

	return await errors.handleAndReturn(async () => {
		const palettestate = new PaletteStateService(
			stateManager,
			services,
			utils
		);

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
		const { utilitiesFactory } = await import('../core/factories/utils.js');

		const utils = await utilitiesFactory(helpers, services);

		return utils;
	}, 'Error initializing utils');
}

export {
	exposeClasses,
	initializeEvents,
	initializePaletteManager,
	initializePaletteStateService,
	initializeStateManager,
	initializeUtilities
};
