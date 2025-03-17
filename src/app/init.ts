import type { Helpers, Services, Utilities } from '../types/index.js';
import { EventManager } from '../dom/events/EventManager.js';
import { PaletteEventsService } from '../dom/events/PaletteEventsService.js';
import { UIEventsService } from '../dom/events/UIEventsService.js';

async function initializeEventManager(
	services: Services
): Promise<EventManager> {
	const { errors } = services;

	return errors.handleAsync(async () => {
		return EventManager.getInstance(services);
	}, 'Error initializing EventManager');
}

async function initializePaletteEventsService(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): Promise<PaletteEventsService> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const paletteEvents = PaletteEventsService.getInstance(
			helpers,
			services,
			utils
		);

		paletteEvents.init();

		return paletteEvents;
	}, 'Error initializing events');
}

async function initializeUIEventsService(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): Promise<UIEventsService> {
	const { errors } = services;

	return await errors.handleAsync(async () => {
		const uiEvents = UIEventsService.getInstance(helpers, services, utils);

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
	initializeEventManager,
	initializePaletteEventsService,
	initializeUIEventsService,
	initializeUtilities
};
