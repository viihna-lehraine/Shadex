// File: state/StateFactory.ts

import { Helpers, Services, State, Utilities } from '../types/index.js';

const caller = 'StateFactory';

export class StateFactory {
	static #instance: StateFactory | null = null;

	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];
	#utils: Utilities;

	private constructor(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	) {
		try {
			services.log(`Constructing StateFactory instance.`, {
				caller: `${caller} constructor`,
				level: 'debug'
			});

			this.#errors = services.errors;
			this.#helpers = helpers;
			this.#log = services.log;
			this.#utils = utils;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	static getInstance(
		helpers: Helpers,
		services: Services,
		utils: Utilities
	): StateFactory {
		return services.errors.handleSync(() => {
			if (!StateFactory.#instance) {
				services.log('Creating StateFactory instance.', {
					caller: `${caller}.getInstance`,
					level: 'debug'
				});

				StateFactory.#instance = new StateFactory(
					helpers,
					services,
					utils
				);
			}

			services.log(`Returning StateFactory instance.`, {
				caller: `${caller}.getInstance`,
				level: 'debug'
			});

			return StateFactory.#instance;
		}, `[${caller}]: Error getting instance.`);
	}

	createInitialState(): Promise<State> {
		return (
			this.#errors.handleAsync(async () => {
				this.#log('Generating initial state.', {
					caller: `${caller}.#generateInitialState`,
					level: 'debug'
				});

				const columns = this.#utils.dom.scanPaletteColumns() ?? [];

				if (!columns) {
					this.#log('No palette columns found!', {
						caller: `${caller}.#generateInitialState`,
						level: 'error'
					});
				}

				this.#log(`Scanned palette columns.`, {
					caller: `${caller}.#generateInitialState`,
					level: 'debug'
				});

				return {
					appMode: 'edit',
					paletteContainer: { columns },
					paletteHistory: [],
					preferences: {
						colorSpace: 'hsl',
						distributionType: 'soft',
						maxHistory: 20,
						maxPaletteHistory: 10,
						theme: 'light'
					},
					selections: {
						paletteColumnCount: columns.length,
						paletteType: 'complementary',
						targetedColumnPosition: 1
					},
					timestamp: this.#helpers.data.getFormattedTimestamp()
				};
			}, `[${caller}]: Failed to generate initial state`) ?? ({} as State)
		);
	}
}
