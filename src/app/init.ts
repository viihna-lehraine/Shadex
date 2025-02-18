// File: app/init.js

import {
	CommonFunctionsInterface,
	GenerateHuesFnGroup,
	GeneratePaletteFn,
	GeneratePaletteFnGroup,
	HelpersInterface,
	RequiredCommonFunctions,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { EventManager } from '../events/EventManager.js';
import { PaletteEvents } from '../events/PaletteEvents.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { PaletteState } from '../state/PaletteState.js';
import { StateManager } from '../state/StateManager.js';
import { UIEvents } from '../events/UIEvents.js';
import { createHelpers } from '../common/factories/helpers.js';
import { createServices } from '../common/factories/services.js';
import { createUtils } from '../common/factories/utils.js';
import { generateHuesFnGroup } from '../palette/partials/hues.js';
import { generatePalette } from '../palette/generate.js';
import { generatePaletteFnGroup } from '../palette/partials/types.js';
import { data } from '../data/index.js';

const mode = data.mode;

export async function initialize(): Promise<{
	common: RequiredCommonFunctions;
	events: {
		palette: PaletteEvents;
		ui: UIEvents;
	};
	paletteManager: PaletteManager;
	paletteState: PaletteState;
	stateManager: StateManager;
}> {
	try {
		console.log('[initialize-1] Starting initialization...');

		let events: { palette: PaletteEvents; ui: UIEvents } | null = null;

		// 1️. initialize services first
		console.log('[initialize-2] Calling initializeServices...');
		const services = await initializeServices();

		// 2️. create empty placeholders for utils and helpers (to prevent circular dependency issues)
		console.log(
			'[initialize-3] Creating placeholders for utils and helpers...'
		);
		const utils = {} as UtilitiesInterface;
		const helpers = {} as HelpersInterface;

		// 3️. initialize utils (pass placeholders)
		console.log('[initialize-4] Calling initializeUtils...');
		Object.assign(utils, await initializeUtils(helpers, services));

		// 4️. initialize helpers (pass placeholders and utils)
		console.log('[initialize-5] Calling initializeHelpers...');
		Object.assign(helpers, await initializeHelpers(services, utils));

		// 5. create the Common Functions object with all properties marked as required
		const common: RequiredCommonFunctions = { helpers, services, utils };
		console.log('[initialize-6] Common functions object created.');

		// 6. initialize StateManager
		console.log('[initialize-7] Calling initializeStateManager...');
		const stateManager = await initializeStateManager(services, utils);

		// 7. initialize PaletteState
		console.log('[initialize-8] Calling initializePaletteState...');
		const paletteState = await initializePaletteState(stateManager, utils);

		// 8. initialize PaletteManager
		console.log('[initialize-9] Calling initializePaletteManager...');
		const paletteManager = await initializePaletteManager(
			stateManager,
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);
		console.log(
			'[initialize-9.5] After initializePaletteManager() but before initializeEvents...'
		);
		console.log('[initialize-10] PaletteManager initialized successfully.');

		// 9. instantiate Event Manager
		console.log('[initialize-11] Calling EventManager.getInstance()...');
		const eventManager = EventManager.getInstance();

		// 10. initialize Events
		try {
			console.log('[initialize-12] Calling initializeEvents...');
			events = await initializeEvents(
				paletteManager,
				paletteState,
				services,
				stateManager,
				utils
			);
			console.log('[initialize-13] Events initialized successfully.');
		} catch (err) {
			console.error(`[initialize-E] Error initializing events: ${err}`);
			events = {
				palette: new PaletteEvents(
					paletteManager,
					paletteState,
					services,
					stateManager,
					utils
				),
				ui: new UIEvents(services, utils)
			};
		}

		// 11. expose classes to window
		if (mode.exposeToWindow) {
			console.log('[initialize-14] Calling exposeToWindow...');
			await exposeToWindow(
				eventManager,
				events!.palette,
				paletteManager,
				stateManager,
				events!.ui
			);
		}

		console.log('[initialize-15] Initialization complete.');

		return {
			common,
			events,
			paletteManager,
			paletteState,
			stateManager
		};
	} catch (error) {
		console.error(
			`[initialize-E] Initialization failed: ${error instanceof Error ? error.message : error}`
		);

		throw error;
	}
}

async function exposeToWindow(
	eventManager: EventManager,
	paletteEvents: PaletteEvents,
	paletteManager: PaletteManager,
	stateManager: StateManager,
	uiEvents: UIEvents
): Promise<void> {
	console.log('[exposeToWindow-1] Exposing functions to window...');

	window.eventManager = eventManager;
	window.paletteEvents = paletteEvents;
	window.paletteManager = paletteManager;
	window.stateManager = stateManager;
	window.uiEvents = uiEvents;

	window.EventManager = EventManager;

	console.log('[exposeToWindow-2] Functions exposed to window.');
}

async function initializeEvents(
	paletteManager: PaletteManager,
	paletteState: PaletteState,
	services: ServicesInterface,
	stateManager: StateManager,
	utils: UtilitiesInterface
): Promise<{
	palette: PaletteEvents;
	ui: UIEvents;
}> {
	console.log('[initializeEvents] Creating event handlers...');

	const paletteEvents = new PaletteEvents(
		paletteManager,
		paletteState,
		services,
		stateManager,
		utils
	);
	const uiEvents = new UIEvents(services, utils);

	paletteEvents.init();

	uiEvents.init();
	uiEvents.initButtons();

	console.log('[initializeEvents] Events initialized.');

	return { palette: paletteEvents, ui: uiEvents };
}

async function initializeHelpers(
	services: ServicesInterface,
	utils: UtilitiesInterface
): Promise<HelpersInterface> {
	try {
		console.log('[initializeHelpers-1] Creating helpers...');
		const helpers = await createHelpers(services, utils);
		console.log('[initializeHelpers-2] Helpers initialized.');
		return helpers;
	} catch (err) {
		console.error(`[initializeHelpers-E] Error: ${err}`);
		throw err;
	}
}

async function initializePaletteManager(
	stateManager: StateManager,
	common: CommonFunctionsInterface,
	generateHuesFnGroup: GenerateHuesFnGroup,
	generatePaletteFnGroup: GeneratePaletteFnGroup,
	generatePalette: GeneratePaletteFn
): Promise<PaletteManager> {
	try {
		console.log('[initializePaletteManager-1] Creating palette manager...');

		// Fix: Just instantiate without recursion
		const paletteManager = new PaletteManager(
			stateManager,
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);

		console.log(`[initializePaletteManager-2] PaletteManager initialized.`);
		return paletteManager;
	} catch (err) {
		console.error(`[initializePaletteManager-E] Error: ${err}`);
		throw err;
	}
}

async function initializePaletteState(
	stateManager: StateManager,
	utils: UtilitiesInterface
): Promise<PaletteState> {
	try {
		console.log('[initializePaletteState-1] Creating palette state...');
		const palettestate = new PaletteState(stateManager, utils);
		console.log('[initializePaletteState-2] PaletteState initialized.');
		return palettestate;
	} catch (err) {
		console.error(`[initializePaletteState-E] Error: ${err}`);
		throw err;
	}
}

async function initializeServices(): Promise<ServicesInterface> {
	try {
		console.log(`[initializeServices-1] Creating services....`);
		const services = await createServices();
		console.log(`[initializeServices-2] Services initialized.`);
		return services;
	} catch (err) {
		console.error(`[initializeServices-E] Error: ${err}`);
		throw err;
	}
}

async function initializeStateManager(
	services: ServicesInterface,
	utils: UtilitiesInterface
): Promise<StateManager> {
	try {
		console.log('[initializeStateManager-1] Creating state manager...');
		const stateManager = StateManager.getInstance(services, utils);
		console.log('[initializeStateManager-2] StateManager initialized.');
		return stateManager;
	} catch (err) {
		console.error(`[initializeStateManager-E] Error: ${err}`);
		throw err;
	}
}

async function initializeUtils(
	helpers: HelpersInterface,
	services: ServicesInterface
): Promise<UtilitiesInterface> {
	try {
		console.log('[initializeUtils-1] Creating utils...');
		const utils = await createUtils(helpers, services);
		console.log('[initializeUtils-2] Utils initialized.');
		return utils;
	} catch (err) {
		console.error(`[initializeUtils-E] Error: ${err}`);
		throw err;
	}
}
