// File: app/dependencyRegistry.ts

import {
	AppDependencies,
	CommonFunctions,
	Helpers,
	Services,
	Utilities
} from '../types/index.js';
import { EventManager } from '../events/EventManager.js';
import { PaletteEvents } from '../events/PaletteEvents.js';
import { UIEvents } from '../events/UIEvents.js';

export async function registerDependencies(
	helpers: Helpers,
	services: Services
): Promise<AppDependencies> {
	const { errors, log } = services;
	const caller = '[REGISTER_DEPENDENCIES]';

	// 1. Execute the function
	log(`Executing registerDependencies...`, { caller });

	return await errors.handleAsync(async () => {
		let events: { palette: PaletteEvents; ui: UIEvents } | null = null;

		// 2. Create empty utils placeholder
		const utils = {} as Utilities;

		// 3. Initialize utilities
		const { initializeUtilities } = await import('./init.js');
		log('Initializing Utilities.', { caller });
		Object.assign(utils, await initializeUtilities(helpers, services));

		// 4. Initialize CommonFunctions with required properties
		log('Initializing CommonFunctions with required properties.', {
			caller
		});
		const common: Required<CommonFunctions> = {
			helpers,
			services,
			utils
		};

		// 5. Initialize StateManager
		const { initializeStateManager } = await import('./init.js');
		log('Initializing StateManager.', {
			caller: '[REGISTER_DEPENDENCIES]'
		});
		const stateManager = await initializeStateManager(
			helpers,
			services,
			utils!
		);

		// 6. Initialize PaletteState
		const { initializePaletteState } = await import('./init.js');
		log(`Initializing PaletteState.`, { caller });
		const paletteState = await initializePaletteState(
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
		log(`Initializing PaletteManager.`, { caller });
		const paletteManager = await initializePaletteManager(
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette,
			stateManager
		);

		// 8. Initialize EventManager
		log(`Initializing EventManager.`, { caller });
		const eventManager = EventManager.getInstance(services);

		// 9. Initialize event classes object
		const { initializeEvents } = await import('./init.js');
		console.log(`${caller}: initializeEvents function imported.`);
		log(`Initializing event classes object.`, { caller });
		events = (await initializeEvents(
			helpers,
			paletteManager,
			paletteState,
			services,
			stateManager,
			utils
		))!;

		// 10.; Ensure state is fully initialized before rendering palette
		log(`Calling stateManager.ensureStateReady`, { caller });
		await stateManager.ensureStateReady();

		// 11. Render initial palette
		log(`Rendering initial palette.`, { caller });
		await paletteManager!.loadPalette();
		log(`Initial palette rendered.`, { caller });

		// 12. Log success and return dependencies
		log(`Dependencies registered.`, { caller });
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
