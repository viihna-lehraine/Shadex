// File: state/StatePersistence.ts

import { Helpers, Services, State, Utilities } from '../types/index.js';
import { StorageManager } from '../storage/StorageManager.js';
import { env, featureFlags } from '../config/index.js';

const caller = 'StatePersistence';

export class StatePersistence {
	static #instance: StatePersistence | null = null;

	#debouncedSave: () => void;
	#isIDBAvailable: boolean = false;
	#onStateLoadCallback: (() => void) | null = null;
	#storage: StorageManager;

	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];
	#utils: Utilities;

	constructor(helpers: Helpers, services: Services, utils: Utilities) {
		try {
			services.log(`Constructing StateLock instance.`, {
				caller: `${caller} constructor`,
				level: 'debug'
			});

			this.#errors = services.errors;
			this.#getFormattedTimestamp = helpers.data.getFormattedTimestamp;
			this.#helpers = helpers;
			this.#log = services.log;
			this.#utils = utils;

			this.#storage = new StorageManager(services);

			this.#debouncedSave = this.#helpers.time.debounce(
				() => this.#saveOperation(),
				env.state.saveThrottleDelay
			);
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
	): StatePersistence {
		return services.errors.handleSync(() => {
			if (!StatePersistence.#instance) {
				services.log('Creating StatePersistence instance.', {
					caller: `${caller}.getInstance`,
					level: 'debug'
				});

				StatePersistence.#instance = new StatePersistence(
					helpers,
					services,
					utils
				);
			}

			services.log(`Returning StatePersistence instance.`, {
				caller: `${caller}.getInstance`,
				level: 'debug'
			});

			return StatePersistence.#instance;
		}, `[${caller}]: Error getting instance.`);
	}

	async init(): Promise<State | boolean> {
		return this.#errors.handleAsync(async () => {
			this.#isIDBAvailable = await this.#storage.init();

			if (featureFlags.loadStateFromStorage) {
				const loadedState = await this.#errors.handleAsync(
					() => this.loadState(),
					`[${caller}]: Failed to load state. Generating initial state.`
				);

				if (loadedState) return true;
				else return false;
			} else {
				this.#log('Loading state from storage is disabled.', {
					caller: `${caller}.init`,
					level: 'warn'
				});

				return false;
			}
		}, `[${caller}]: Error initializing StatePersistence.`);
	}

	async loadState(): Promise<State | void> {
		return this.#errors.handleAsync(async () => {
			if (featureFlags.loadStateFromStorage) {
				this.#log('State loading is disabled!', {
					caller: `${caller}.loadState`,
					level: 'warn'
				});

				return;
			}

			const state = await this.#storage.getItem<State>('state');

			if (state) {
				this.#log(`State loaded from storage.`, {
					caller: `${caller}.loadState`
				});

				return state;
			} else {
				this.#log('No saved state found.', {
					caller: `${caller}.loadState`,
					level: 'warn'
				});

				return;
			}
		}, `[${caller}]: Error loading state.`);
	}

	async saveState(
		state: State,
		log: boolean = true,
		throttle: boolean = true,
		verbosity: number = 0
	): Promise<void> {
		return this.#errors.handleAsync(async () => {
			if (log) {
				if (log) {
					this.#log(`StateManager Updated ${property}`, {
						caller: `${caller}.#saveState`,
						verbosity: verbosity ?? 0
					});
				}
			}
			throttle ? this.#debouncedSave() : await this.#saveOperation(state);
		}, `[${caller}]: Error saving state.`);
	}

	async #saveOperation(state: State): Promise<void> {
		return this.#errors.handleAsync(async () => {
			for (
				let attempt = 0;
				attempt <= env.state.maxSaveRetries;
				attempt++
			) {
				try {
					await this.#storage.setItem('state', state);

					this.#log('State saved to storage.', {
						caller: `${caller}.#saveOperation`
					});

					break;
				} catch (err) {
					if (attempt < env.state.maxSaveRetries) {
						this.#log(
							`Save attempt ${attempt + 1} failed. Retrying...`,
							{
								caller: `${caller}.#saveOperation`,
								level: 'warn'
							}
						);
					} else {
						this.#log('Max save attempts reached.', {
							caller: `${caller}.#saveOperation`,
							level: 'error'
						});
					}
				}
			}
		}, `[${caller}]: Error saving state.`);
	}

	#setOnStateLoad(callback: () => void): void {
		return this.#errors.handleSync(() => {
			this.#onStateLoadCallback = callback;
		}, `[${caller}]: Failed to set onStateLoad callback`);
	}
}
