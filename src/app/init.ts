// File: app/init.ts

import type {
	CommonFunctions,
	GenerateHuesFnGroup,
	GeneratePaletteFn,
	GeneratePaletteFnGroup,
	HelpersInterface,
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
import { config } from '../config/index.js';

const mode = config.mode;

export async function initializeApp(services: ServicesInterface): Promise<{
	common: Required<CommonFunctions>;
	events: {
		palette: PaletteEvents;
		ui: UIEvents;
	};
	paletteManager: PaletteManager;
	paletteState: PaletteState;
	stateManager: StateManager;
} | void> {
	const { errors, log } = services;

	return await errors.handleAsync(async () => {
		let events: { palette: PaletteEvents; ui: UIEvents } | null = null;

		// 1. create empty placeholders for utils and helpers
		log('[1] Creating placeholders for utils and helpers...');
		const utils = {} as UtilitiesInterface;
		const helpers = {} as HelpersInterface;

		// 2. initialize utils (pass placeholders)
		log('[2] Calling initializeUtils...');
		Object.assign(utils, await initializeUtils(helpers, services));

		// 3. initialize helpers (pass placeholders and utils)
		log('[3] Calling initializeHelpers...');
		Object.assign(helpers, await initializeHelpers(services, utils));

		// 4. create the Common Fns object with all properties required
		const common: Required<CommonFunctions> = {
			helpers,
			services,
			utils
		};
		log('[4] Common functions object created.');

		// 5. initialize StateManager
		log('[5] Calling initializeStateManager...');
		const stateManager = await initializeStateManager(services, utils);

		// 6. initialize PaletteState
		log('[6] Calling initializePaletteState...');
		const paletteState = await initializePaletteState(
			services,
			stateManager!,
			utils
		);

		// 7. initialize PaletteManager
		log('[7] Calling initializePaletteManager...');
		const paletteManager = await initializePaletteManager(
			stateManager!,
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);
		log('[7-D] PaletteManager initialized successfully.', 'debug', 3);

		// 8. instantiate Event Manager
		log('[8] Calling EventManager.getInstance()...');
		const eventManager = EventManager.getInstance();

		// 9. initialize Events
		log('[9] Calling initializeEvents...');
		events = (await initializeEvents(
			paletteManager!,
			paletteState!,
			services,
			stateManager!,
			utils
		))!;

		// 9a. expose classes to window
		if (mode.exposeToWindow) {
			log('[9a] Calling exposeToWindow...');
			await exposeToWindow(
				eventManager,
				events!.palette,
				paletteManager!,
				services,
				stateManager!,
				events!.ui
			);
		}

		// 10. Ensure state is fully initialized before rendering initial palette
		log('[10] Calling stateManager.ensureStateReady()...');
		await stateManager!.ensureStateReady();

		// 11. Render initial palette
		log('[11] Calling paletteManager.loadPalette()...');
		await paletteManager!.loadPalette();
		log('[11-D] After paletteManager.loadPalette()...', 'debug');

		// 12. Log initialization complete
		console.log('[12] Initialization complete.');

		return {
			common,
			events,
			paletteManager: paletteManager!,
			paletteState: paletteState!,
			stateManager: stateManager!
		};
	}, 'Error initializing application');
}

export function initializeServices(): ServicesInterface {
	try {
		console.log(`[initializeServices-1] Creating services....`);
		const services = createServices();
		services.log(`[2] Services initialized.`);
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
	services: ServicesInterface,
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
	paletteManager: PaletteManager,
	paletteState: PaletteState,
	services: ServicesInterface,
	stateManager: StateManager,
	utils: UtilitiesInterface
): Promise<{
	palette: PaletteEvents;
	ui: UIEvents;
} | void> {
	const { errors, log } = services;
	log('[1] Creating event handlers...');

	await errors.handleAsync(async () => {
		const paletteEvents = new PaletteEvents(
			paletteManager,
			paletteState,
			services,
			stateManager,
			utils
		);
		const uiEvents = new UIEvents(paletteManager, services, utils);

		paletteEvents.init();

		uiEvents.init();
		uiEvents.initButtons();

		log('[2] Events initialized.');

		return { palette: paletteEvents, ui: uiEvents };
	}, 'Error initializing events');
}

async function initializeHelpers(
	services: ServicesInterface,
	utils: UtilitiesInterface
): Promise<HelpersInterface | void> {
	const { log, errors } = services;

	await errors.handleAsync(async () => {
		log('[1] Creating helpers...');
		const helpers = await createHelpers(services, utils);
		log('[2] Helpers initialized.');
		return helpers;
	}, 'Error initializing helpers');
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
	services: ServicesInterface,
	stateManager: StateManager,
	utils: UtilitiesInterface
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
	services: ServicesInterface,
	utils: UtilitiesInterface
): Promise<StateManager | void> {
	const { log, errors } = services;
	await errors.handleAsync(async () => {
		log('[1] Creating state manager...');
		const stateManager = StateManager.getInstance(services, utils);
		log('[2] StateManager initialized.');
		return stateManager;
	}, 'Error initializing StateManager');
}

async function initializeUtils(
	helpers: HelpersInterface,
	services: ServicesInterface
): Promise<UtilitiesInterface | void> {
	const { log, errors } = services;
	await errors.handleAsync(async () => {
		log('[initUtils-1] Creating utils...');
		const utils = await createUtils(helpers, services);
		log('[initUtils-2] Utils initialized.');
		return utils;
	}, 'Error initializing utils');
}
