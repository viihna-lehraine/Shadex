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
import { config, defaults } from '../config/index.js';
import { generateHuesFnGroup } from '../palette/partials/hues.js';
import { generatePalette } from '../palette/generate.js';
import { generatePaletteFnGroup } from '../palette/partials/types.js';
import { helpersFactory } from '../common/factories/helpers.js';
import { serviceFactory } from '../common/factories/services.js';
import { utilitiesFactory } from '../common/factories/utils.js';

const initialData = defaults.observerData;
const mode = config.mode;

export async function initializeApp(
	helpers: Helpers,
	services: Services
): Promise<{
	common: Required<CommonFunctions>;
	eventManager: EventManager;
	events: { palette: PaletteEvents; ui: UIEvents };
	paletteManager: PaletteManager;
	paletteState: PaletteState;
	stateManager: StateManager;
} | void> {
	const { errors, log } = services;

	return await errors.handleAsync(async () => {
		let events: { palette: PaletteEvents; ui: UIEvents } | null = null;

		// 1. create empty placeholders for utils and helpers
		log('[1] Creating placeholders and helpers...');
		const utils = {} as Utilities;

		// 2. initialize utils (pass placeholders)
		log('[2] Calling initializeUtils...');
		Object.assign(utils, await initializeUtils(helpers, services));

		// 3. create the Common Fns object with all properties required
		const common: Required<CommonFunctions> = {
			helpers,
			services,
			utils
		};
		log('[3] Common functions object created.');

		// 5. initialize StateManager
		log('[4] Calling initializeStateManager...');
		const stateManager = await initializeStateManager(
			helpers,
			services,
			utils
		);

		// 5. initialize PaletteState
		log('[5] Calling initializePaletteState...');
		const paletteState = await initializePaletteState(
			services,
			stateManager!,
			utils
		);

		// 6. initialize PaletteManager
		log('[6] Calling initializePaletteManager...');
		const paletteManager = await initializePaletteManager(
			stateManager!,
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);
		log('[6-D] PaletteManager initialized successfully.', 'debug', 3);

		// 7. instantiate Event Manager
		log('[7] Calling EventManager.getInstance()...');
		const eventManager = EventManager.getInstance(services);

		// 8. initialize Events
		log('[8] Calling initializeEvents...');
		events = (await initializeEvents(
			helpers,
			paletteManager!,
			paletteState!,
			services,
			stateManager!,
			utils
		))!;

		// 8-A. expose classes to window
		if (mode.exposeClasses) {
			log('[8-A] Calling exposeToWindow...');
			await exposeToWindow(
				eventManager,
				events!.palette,
				paletteManager!,
				services,
				stateManager!,
				events!.ui
			);
		}

		// 9. Ensure state is fully initialized before rendering initial palette
		log('[9] Calling stateManager.ensureStateReady()...');
		await stateManager!.ensureStateReady();

		// 10. Render initial palette
		log('[10] Calling paletteManager.loadPalette()...');
		await paletteManager!.loadPalette();
		log('[10-DEBUG] After paletteManager.loadPalette()...', 'debug');

		// 11. Log initialization complete
		log('[12] Initialization complete.', 'info', 2);

		return {
			common,
			eventManager,
			events,
			paletteManager: paletteManager!,
			paletteState: paletteState!,
			stateManager: stateManager!
		};
	}, 'Error initializing application');
}

export async function initializeHelpers(): Promise<Helpers> {
	try {
		console.log('[initializeHelpers-1] Creating helpers...');
		const helpers = await helpersFactory();
		console.log('[initializeHelpers-2] Helpers initialized.');
		return helpers;
	} catch (error) {
		throw new Error(`Error initializing helpers: ${error}`);
	}
}

export function initializeServices(helpers: Helpers): Services {
	try {
		console.log(`[initializeServices-1] Creating services....`);
		const services = serviceFactory(helpers, initialData);
		services.log(`[initializeServices-2] Services initialized.`);
		return services;
	} catch (err) {
		console.error(`[initializeServices-ERR] Error: ${err}`);
		throw err;
	}
}

//
/// *********************************************
//// ******** HOISTED HELPER FUNCTIONS ********
/// *********************************************
//

async function exposeToWindow(
	eventManager: EventManager,
	paletteEvents: PaletteEvents,
	paletteManager: PaletteManager,
	services: Services,
	stateManager: StateManager,
	uiEvents: UIEvents
): Promise<void> {
	const { log, errors } = services;

	await errors.handleAsync(async () => {
		log('[exposeToWindow-1] Exposing functions to window...');
		window.eventManager = eventManager;
		window.paletteEvents = paletteEvents;
		window.paletteManager = paletteManager;
		window.stateManager = stateManager;
		window.uiEvents = uiEvents;
		window.EventManager = EventManager;
		log('[exposeToWindow-2] Functions exposed to window.');
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
} | void> {
	const { errors, log } = services;
	log('[1] Creating event handlers...');

	await errors.handleAsync(async () => {
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

		log('[2] Events initialized.');

		return { palette: paletteEvents, ui: uiEvents };
	}, 'Error initializing events');
}

async function initializePaletteManager(
	stateManager: StateManager,
	common: CommonFunctions,
	generateHuesFnGroup: GenerateHuesFnGroup,
	generatePaletteFnGroup: GeneratePaletteFnGroup,
	generatePalette: GeneratePaletteFn
): Promise<PaletteManager | void> {
	const { log, errors } = common.services;

	await errors.handleAsync(async () => {
		log('[1] Creating palette manager...');

		// Fix: Just instantiate without recursion
		const paletteManager = new PaletteManager(
			stateManager,
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);

		log(`[2] PaletteManager initialized.`);
		return paletteManager;
	}, 'Error initializing PaletteManager');
}

async function initializePaletteState(
	services: Services,
	stateManager: StateManager,
	utils: Utilities
): Promise<PaletteState | void> {
	const { log, errors } = services;
	await errors.handleAsync(async () => {
		log('[1] Creating palette state...');
		const palettestate = new PaletteState(stateManager, services, utils);
		log('[2] PaletteState initialized.');
		return palettestate;
	}, 'Error initializing PaletteState');
}

async function initializeStateManager(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): Promise<StateManager | void> {
	const { log, errors } = services;
	await errors.handleAsync(async () => {
		log('[1] Creating state manager...');
		const stateManager = StateManager.getInstance(helpers, services, utils);
		log('[2] StateManager initialized.');
		return stateManager;
	}, 'Error initializing StateManager');
}

async function initializeUtils(
	helpers: Helpers,
	services: Services
): Promise<Utilities | void> {
	const { log, errors } = services;
	await errors.handleAsync(async () => {
		log('[initUtils-1] Creating utils...');
		const utils = await utilitiesFactory(helpers, services);
		log('[initUtils-2] Utils initialized.');
		return utils;
	}, 'Error initializing utils');
}
