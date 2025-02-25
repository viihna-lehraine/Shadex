// File: state/StateStore.ts

import {
	Helpers,
	Services,
	State,
	StateStoreContract
} from '../types/index.js';
import { StorageManager } from '../storage/StorageManager.js';
import { ObserverService } from '../core/services/index.js';
import { env, featureFlags } from '../config/index.js';

const caller = 'StateStore';

export class StateStore implements StateStoreContract {
	static #instance: StateStore;

	#debouncedSave!: (state: State) => void;
	#observer: ObserverService<State>;
	#state: State;

	#clone: Helpers['data']['clone'];
	#debounce: Helpers['time']['debounce'];
	#errors: Services['errors'];
	#log: Services['log'];
	#storage: StorageManager;

	private constructor(
		initialState: State,
		helpers: Helpers,
		services: Services,
		storage: StorageManager
	) {
		try {
			services.log.info(
				`Constructing ${caller} instance.`,
				`${caller} constructor`
			);

			this.#state = Object.freeze({ ...initialState });
			this.#observer = new ObserverService<State>(
				this.#state,
				{},
				helpers,
				services
			);
			this.#storage = storage;

			this.#clone = helpers.data.clone;
			this.#debounce = helpers.time.debounce;
			this.#errors = services.errors;
			this.#log = services.log;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(
		initialState: State,
		helpers: Helpers,
		services: Services,
		storage: StorageManager
	): StateStore {
		return services.errors.handleSync(() => {
			if (!StateStore.#instance) {
				StateStore.#instance = new StateStore(
					initialState,
					helpers,
					services,
					storage
				);

				services.log.info(
					`Creating new ${caller} instance`,
					`${caller}.getInstance`
				);

				return StateStore.#instance;
			}

			services.log.info(
				`Returning existing ${caller} instance`,
				`${caller}.getInstance`
			);

			return StateStore.#instance;
		}, `[${caller}.getInstance]: Failed to create ${caller} instance.`);
	}

	async batchUpdate(updates: Partial<State>): Promise<void> {
		this.#errors.handleSync(() => {
			const oldState = this.#state;
			const updatedEntries = Object.entries(updates).filter(
				([key, value]) => oldState[key as keyof State] !== value
			);

			if (updatedEntries.length === 0) {
				this.#log.debug(
					`No state changes detected for batch update`,
					`${caller}.batchUpdate`
				);

				return;
			}

			const newState = Object.freeze(
				this.#clone({ ...oldState, ...updates })
			);

			this.#state = newState;

			this.#log.debug(
				`Batch updated state with keys: ${updatedEntries.map(([k]) => k).join(', ')}`,
				`${caller}.batchUpdate`
			);
			console.debug(
				`[${caller}.batchUpdate]: Batch Update List:`,
				updates
			);

			this.#notifyObservers(updates);

			this.saveState(newState);
		}, `[${caller}.batchUpdate]: Failed to perform batch update`);
	}

	get<K extends keyof State>(key: K): State[K] {
		return this.#errors.handleSync(
			() => {
				return this.#state[key];
			},
			`[${caller}.get]: Failed to retrieve state key: ${String(key)}`
		);
	}

	getState(): State {
		return this.#errors.handleSync(() => {
			return { ...this.#state };
		}, `[${caller}.getData]: Failed to retrieve full state`);
	}

	async init(): Promise<State | null> {
		this.#debouncedSave = this.#debounce(
			(state: State) => this.saveState(state, { throttle: false }),
			env.state.saveThrottleDelay
		);

		if (featureFlags.loadStateFromStorage) {
			this.#log.warn(
				'Loading state from storage is disabled.',
				`${caller}.init`
			);

			return null;
		}

		const loadedState = await this.loadState();

		loadedState
			? this.#log.info(`State loaded from storage.`, `${caller}.init`)
			: this.#log.warn(`No saved state found.`, `${caller}.init`);

		return loadedState;
	}

	async loadState(): Promise<State | null> {
		return this.#errors.handleAsync(async () => {
			const savedState = await this.#storage.getItem<State>('state');

			if (savedState) {
				this.#state = Object.freeze(this.#clone(savedState));

				// replace observer data with the new state
				this.#observer.replaceData(this.#state);

				this.#log.info(
					'Loaded state from storage.',
					`${caller}.loadState`
				);

				return this.#state;
			}
			this.#log.warn('No saved state found.', `${caller}.loadState`);

			return null;
		}, `[${caller}.loadState]: Failed to load state from storage.`);
	}

	off<K extends keyof State>(
		key: K,
		callback: (newValue: State[K], oldValue: State[K]) => void
	): void {
		this.#observer.off(key, callback);
	}

	on<K extends keyof State>(
		key: K,
		callback: (newValue: State[K], oldValue: State[K]) => void
	): void {
		this.#observer.on(key, callback);
	}

	async saveState(
		state: State = this.#state,
		options: { throttle?: boolean } = {}
	): Promise<void> {
		return this.#errors.handleAsync(async () => {
			if (options.throttle) {
				this.#debouncedSave(state);
			} else {
				await this.#saveOperation(state);
			}

			this.#log.info('State saved to storage.', `${caller}.saveState`);
		}, `[${caller}.saveState]: Failed to save state to storage.`);
	}

	async set<K extends keyof State>(key: K, value: State[K]): Promise<void> {
		this.#errors.handleSync(
			() => {
				const oldValue = this.#state[key];

				if (oldValue === value) {
					this.#log.debug(
						`No state change detected for key: ${String(key)}`,
						`${caller}.set`
					);

					return;
				}

				this.#updateState({ [key]: value });

				this.#log.debug(
					`Updated state key: ${String(key)}\nOld value: ${JSON.stringify(oldValue)}\nNew value: ${JSON.stringify(value)}`,
					`${caller}.set`
				);
			},
			`[${caller}.set]: Failed to update state key: ${String(key)}.`
		);
	}

	#notifyObservers(updates: Partial<State>): void {
		Object.entries(updates).forEach(([key, value]) => {
			this.#observer.set(key as keyof State, value as State[keyof State]);
		});
	}

	async #saveOperation(state: State): Promise<void> {
		return this.#errors.handleAsync(async () => {
			for (
				let attempt = 1;
				attempt <= env.state.maxSaveRetries;
				attempt++
			) {
				try {
					await this.#storage.setItem('state', state);

					this.#log.info(
						`State saved successfully on attempt ${attempt}.`,
						`${caller}.#saveOperation`
					);

					break;
				} catch (err) {
					if (attempt < env.state.maxSaveRetries) {
						this.#log.warn(
							`Save attempt ${attempt} failed. Retrying...`,
							`${caller}.#saveOperation`
						);
					} else {
						this.#log.error(
							'Max save attempts reached. Save failed.',
							`${caller}.#saveOperation`
						);
					}
				}
			}
		}, `[${caller}.#saveOperation]: Save operation failed.`);
	}

	#updateState(updates: Partial<State>): void {
		const updatedState = Object.freeze(
			this.#clone({ ...this.#state, ...updates })
		);
		this.#state = updatedState;

		this.#notifyObservers(updates);
		this.saveState(updatedState);
	}
}
