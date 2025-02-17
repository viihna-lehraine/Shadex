// File: app/initialize.js

import {
	HelpersInterface,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { PaletteEvents } from '../events/PaletteEvents.js';
import { PaletteState } from '../state/PaletteState.js';
import { StateManager } from '../state/StateManager.js';
import { UIEvents } from '../events/UIEvents.js';

async function initializeApp(): Promise<{
	events: {
		palette: PaletteEvents;
		ui: UIEvents;
	};
	helpers: HelpersInterface;
	paletteState: PaletteState;
	services: ServicesInterface;
	stateManager: StateManager;
	utils: UtilitiesInterface;
}> {
	try {
		console.log('initializeApp() Importing dependencies...');

		console.log('initializeApp() Loading createHelpers...');
		const { createHelpers } = await import(
			'../common/factories/helpers.js'
		);
		console.log('[initializeApp()] Loaded createHelpers.');

		const { createServices } = await import(
			'../common/factories/services.js'
		);
		console.log('[initializeApp()] Loaded createServices.');

		const { createUtils } = await import('../common/factories/utils.js');
		console.log('[initializeApp()] Loaded createUtils.');

		const services = await createServices();
		console.log(`services.app.log:`, services?.app?.log);
		console.log('[initializeApp()] Initialized Services.');

		console.log('[initializeApp()] Creating logger...');

		// create placeholders
		const helpers = {} as HelpersInterface;
		console.log('[initializeApp()] Created Helpers placeholder.');

		const utils = {} as UtilitiesInterface;
		console.log('[initializeApp()] Created Utils placeholder.');

		// construct both by passing placeholders
		Object.assign(helpers, await createHelpers(services, utils));
		console.log('[initializeApp()] Constructed Helpers .');

		Object.assign(utils, await createUtils(helpers, services));
		console.log('[initializeApp()] Constructed Utils.');

		// initialize StateManager
		const stateManager = StateManager.getInstance(services);
		console.log('[initializeApp()] Initialized StateManager.');

		// initialize PaletteState
		const paletteState = new PaletteState(stateManager, utils);
		console.log('[initializeApp()] Initialized PaletteState.');

		// initialize Event Managers
		const paletteEvents = new PaletteEvents(
			paletteState,
			services,
			stateManager,
			utils
		);
		console.log('[initializeApp()] Created PaletteEvents.');

		const uiEvents = new UIEvents(services, utils);
		console.log('[initializeApp()] Initialized UIEvents.');

		// attach event handlers
		console.log('[initializeApp()] Attaching event handlers...');

		paletteEvents.init();
		console.log('[initializeApp()] Called PaletteEvents.init().');

		uiEvents.init();
		console.log('[initializeApp()] Called UIEvents.init().');

		uiEvents.initButtons();
		console.log('[initializeApp()] Called UIEvents.initButtons().');

		console.log(`[initializeApp(] Services before return:`, services);

		// log initialization success
		console.log(
			`[initializeApp()] Services object before return: ${JSON.stringify(services)}`
		);
		const log = services.app.log;
		console.log('[initializeApp()] log function:', paletteState);
		log('info', `Log has been initialized.`, 'initializeApp()', 1);

		log('info', 'Initialization complete.', 'initializeApp()', 1);
		console.log(
			'[initializeApp()] Reached function end, returning Common Functions Object.'
		);
		return {
			events: { palette: paletteEvents, ui: uiEvents },
			helpers,
			paletteState,
			services,
			stateManager,
			utils
		};
	} catch (error) {
		console.error(
			`[initializeApp()] Initialization failed: ${error instanceof Error ? error.message : error}`
		);

		throw error;
	}
}

export { initializeApp };
export default initializeApp;
