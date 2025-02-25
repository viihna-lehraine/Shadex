// File: app/dependencyRegistry.ts

import {
	AppDependencies,
	CommonFunctions,
	Helpers,
	Services,
	Utilities
} from '../types/index.js';
import {
	EventManager,
	PaletteEventsService,
	UIEventsService
} from '../dom/index.js';

export async function registerDependencies(
	helpers: Helpers,
	services: Services
): Promise<AppDependencies> {
	const { errors, log } = services;
	const caller = '[REGISTER_DEPENDENCIES]';

	// 1. Execute the function
	log.info(`Executing registerDependencies...`, `${caller}`);

	return await errors.handleAsync(async () => {
		let events: {
			palette: PaletteEventsService;
			ui: UIEventsService;
		} | null = null;

		// 2. Create empty utils placeholder
		const utils = {} as Utilities;

		// 3. Initialize utilities
		const { initializeUtilities } = await import('./init.js');
		log.info('Initializing Utilities.', `${caller}`);
		Object.assign(utils, await initializeUtilities(helpers, services));

		// 4. Initialize CommonFunctions with required properties
		log.info(
			'Initializing CommonFunctions with required properties.',
			`${caller}`
		);
		const common: Required<CommonFunctions> = {
			helpers,
			services,
			utils
		};

		// 5. Initialize StateManager
		const { initializeStateManager } = await import('./init.js');
		log.info('Initializing StateManager.', `${caller}`);
		const stateManager = await initializeStateManager(
			helpers,
			services,
			utils
		);

		// 6. Initialize PaletteState
		const { initializePaletteStateService } = await import('./init.js');
		log.info(`Initializing PaletteStateService.`, `${caller}`);
		const paletteState = await initializePaletteStateService(
			services,
			stateManager,
			utils
		);

		// 7. Initialize PaletteManager
		const { generateHuesFnGroup } = await import(
			'../palette/partials/hues.js'
		);
		const { generatePaletteFnGroup } = await import(
			'../palette/partials/types.js'
		);
		const { generatePalette } = await import('../palette/generate.js');
		const { initializePaletteManager } = await import('./init.js');
		log.info(`Initializing PaletteManager.`, `${caller}`);
		const paletteManager = await initializePaletteManager(
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette,
			stateManager
		);

		// 8. Initialize EventManager
		log.info(`Initializing EventManager.`, `${caller}`);
		const eventManager = EventManager.getInstance(services);

		// 9. Initialize event classes object
		const { initializeEvents } = await import('./init.js');
		console.log(`${caller}: initializeEvents function imported.`);
		log.info(`Initializing event classes object.`, `${caller}`);
		events = (await initializeEvents(
			helpers,
			paletteManager,
			paletteState,
			services,
			stateManager,
			utils
		))!;

		// 10.; Ensure state is fully initialized before rendering palette
		log.info(`Calling stateManager.ensureStateReady`, `${caller}`);
		await stateManager.ensureStateReady();

		// 11. Render initial palette
		log.info(`Rendering initial palette.`, `${caller}`);
		await paletteManager!.loadPalette();
		log.info(`Initial palette rendered.`, `${caller}`);

		// 12. Log success and return dependencies
		log.info(`Dependencies registered.`, `${caller}`);
		return {
			common,
			eventManager,
			events,
			paletteManager: paletteManager,
			paletteState: paletteState,
			stateManager: stateManager
		} as AppDependencies;
	}, 'Error registering dependencies');
}
