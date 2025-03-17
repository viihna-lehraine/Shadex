import {
	AppDependencies,
	CommonFunctions,
	Helpers,
	Services,
	Utilities
} from '../types/index.js';
import { PaletteRendererService } from '../dom/PaletteRendererService.js';

export async function registerDependencies(
	helpers: Helpers,
	services: Services
): Promise<AppDependencies> {
	const { errors, log } = services;
	const caller = '[REGISTER_DEPENDENCIES]';

	log.info(`Executing registerDependencies...`, `${caller}`);

	return await errors.handleAsync(async () => {
		const utils = {} as Utilities;

		const { initializeUtilities } = await import('./init.js');
		Object.assign(utils, await initializeUtilities(helpers, services));

		const common: Required<CommonFunctions> = {
			helpers,
			services,
			utils
		};

		const { generateHuesFnGroup } = await import(
			'../palette/partials/hues.js'
		);
		const { generatePaletteFnGroup } = await import(
			'../palette/partials/types.js'
		);
		const { generatePalette } = await import('../palette/generate.js');

		const paletteRenderer = PaletteRendererService.getInstance(
			common,
			generateHuesFnGroup,
			generatePaletteFnGroup,
			generatePalette
		);

		const { initializeEventManager } = await import('./init.js');
		const eventManager = await initializeEventManager(services);

		const { initializePaletteEventsService } = await import('./init.js');
		const paletteEvents = await initializePaletteEventsService(
			helpers,
			paletteRenderer,
			services,
			utils
		);

		const { initializeUIEventsService } = await import('./init.js');
		const uiEvents = await initializeUIEventsService(
			helpers,
			paletteRenderer,
			services,
			utils
		);

		return {
			common,
			eventManager,
			paletteEvents,
			uiEvents
		} as AppDependencies;
	}, 'Error registering dependencies');
}
