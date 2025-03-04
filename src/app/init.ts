import type { Helpers, Services, Utilities } from '../types/index.js';
import { DOMStore } from '../dom/DOMStore.js';
import { EventManager } from '../dom/events/EventManager.js';
import { PaletteEventsService } from '../dom/events/PaletteEventsService.js';
import { PaletteRendererService } from '../dom/PaletteRendererService.js';
import { PaletteStateService } from '../state/PaletteStateService.js';
import { StateManager } from '../state/StateManager.js';
import { UIEventsService } from '../dom/events/UIEventsService.js';

async function initializeDOMStore(
	helpers: Helpers,
	services: Services
): Promise<DOMStore> {
	const { errors, log } = services;

	return errors.handleAsync(async () => {
		return DOMStore.getInstance(errors, helpers, log);
	}, 'Error initializing DOMStore');
}

async function initializeEventManager(
	services: Services
): Promise<EventManager> {
	const { errors } = services;

	return errors.handleAsync(async () => {
		return EventManager.getInstance(services);
	}, 'Error initializing EventManager');
}

async function initializePaletteEventsService(
	domStore: DOMStore,
	helpers: Helpers,
	paletteRenderer: PaletteRendererService,
	paletteState: PaletteStateService,
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<PaletteEventsService> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const paletteEvents = PaletteEventsService.getInstance(
			domStore,
			helpers,
			paletteRenderer,
			paletteState,
			services,
			stateManager,
			utils
		);

		paletteEvents.init();

		return paletteEvents;
	}, 'Error initializing events');
}

async function initializePaletteStateService(
	helpers: Helpers,
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<PaletteStateService> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const palettestate = PaletteStateService.getInstance(
			helpers,
			services,
			stateManager,
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

	return await errors.handleAsync(async () => {
		const stateManager = StateManager.getInstance(helpers, services, utils);

		return stateManager;
	}, 'Error initializing StateManager');
}

async function initializeUIEventsService(
	domStore: DOMStore,
	helpers: Helpers,
	paletteRenderer: PaletteRendererService,
	services: Services,
	utils: Utilities
): Promise<UIEventsService> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const uiEvents = UIEventsService.getInstance(
			domStore,
			helpers,
			paletteRenderer,
			services,
			utils
		);

		uiEvents.init();
		uiEvents.initButtons();

		return uiEvents;
	}, 'Error initializing UIEventsService');
}

async function initializeUtilities(
	helpers: Helpers,
	services: Services
): Promise<Utilities> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const { utilitiesFactory } = await import('../core/factories/utils.js');

		const utils = await utilitiesFactory(helpers, services);

		return utils;
	}, 'Error initializing utils');
}

export {
	initializeDOMStore,
	initializeEventManager,
	initializePaletteEventsService,
	initializePaletteStateService,
	initializeStateManager,
	initializeUIEventsService,
	initializeUtilities
};
