// File: state/StateLock.ts

import { Helpers, Services, State } from '../types/index.js';
import { Mutex, Observer } from '../common/services/index.js';

const caller = 'StateLock';

export class StateLock {
	static #instance: StateLock | null = null;

	#dataLocks: Map<keyof State, Mutex> = new Map();
	#mutex: Mutex;
	#observer: Observer<State>;

	#clone: Helpers['data']['clone'];
	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];

	private constructor(
		helpers: Helpers,
		mutex: Mutex,
		observer: Observer,
		services: Services
	) {
		try {
			services.log(`Constructing StateLock instance.`, {
				caller: `${caller} constructor`,
				level: 'debug'
			});

			this.#clone = helpers.data.clone;
			this.#errors = services.errors;
			this.#helpers = helpers;
			this.#log = services.log;

			this.#observer = observer;
			this.#mutex = mutex;
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
		mutex: Mutex,
		observer: Observer,
		services: Services
	): StateLock {
		return services.errors.handleSync(() => {
			if (!StateLock.#instance) {
				services.log('Creating StateLock instance.', {
					caller: `${caller}.getInstance`,
					level: 'debug'
				});

				StateLock.#instance = new StateLock(
					helpers,
					mutex,
					observer,
					services
				);
			}

			services.log(`Returning StateLock instance.`, {
				caller: `${caller}.getInstance`,
				level: 'debug'
			});

			return StateLock.#instance;
		}, `[${caller}.getInstance]: Error getting instance.`);
	}

	async atomicUpdate(callback: (state: State) => void): Promise<void> {
		return this.#errors.handleAsync(async () => {
			return await this.#mutex.runExclusive(async () => {
				callback(this.#observer.getData());

				this.#log('Performed atomic update.', {
					caller: `${caller}.atomicUpdate`,
					level: 'debug'
				});

				await this.#saveState();
			});
		}, `[${caller}]: Failed to perform atomic update.`);
	}

	getContentionStats() {
		return this.#errors.handleSync(() => {
			return {
				count: this.#mutex.getContentionCount(),
				rate: this.#mutex.getContentionRate()
			};
		}, `[${caller}.getContentionStats]: Error getting contention stats.`);
	}

	getProperty<K extends keyof State>(key: K): State[K] {
		return this.#errors.handleSync(() => {
			return this.#clone(this.#observer.get(key));
		}, `[${caller}.getProperty]: Error getting property: ${key}`);
	}

	getState(): State {
		return this.#errors.handleSync(() => {
			return this.#clone(this.#observer.getData());
		}, `[${caller}.getState]: Error getting state.`);
	}

	async setProperty<K extends keyof State>(
		key: K,
		value: State[K]
	): Promise<void> {
		const lock = this.#getLockForKey(key);

		await lock.runExclusive(async () => {
			this.#observer.set(key, value);

			this.#log(`Updated property "${String(key)}"`, {
				caller: `${caller}.setProperty`,
				level: 'debug'
			});
		});
	}

	async withGloalLock<T>(callback: () => Promise<T>): Promise<T> {
		return this.#errors.handleAsync(async () => {
			return await this.#mutex.runExclusive(callback);
		}, `[${caller}]: Error running callback with global lock.`);
	}

	async withPropertyLock<K extends keyof State, T>(
		key: K,
		callback: () => Promise<T>
	): Promise<T> {
		return this.#errors.handleAsync(async () => {
			if (!this.#dataLocks.has(key)) {
				this.#dataLocks.set(
					key,
					new Mutex(this.#errors, this.#helpers, this.#log)
				);
			}

			return await this.#dataLocks.get(key)!.runExclusive(callback);
		}, `[${caller}]: Error running callback with lock for key: ${key}`);
	}

	#getLockForKey(key: keyof State): Mutex {
		return this.#errors.handleSync(() => {
			if (!this.#dataLocks.has(key)) {
				this.#dataLocks.set(
					key,
					new Mutex(this.#errors, this.#helpers, this.#log)
				);
			}

			return this.#dataLocks.get(key)!;
		}, `[${caller}]: Error getting lock for key: ${key}`);
	}

	async lockAndExecute<T, K extends keyof State = keyof State>(
		type: 'read' | 'write',
		callback: (stateProperty: State[K]) => Promise<T> | T,
		key: K
	): Promise<T>;
	async lockAndExecute<T>(
		type: 'read' | 'write',
		callback: () => Promise<T> | T
	): Promise<T>;
	async lockAndExecute<T, K extends keyof State = keyof State>(
		type: 'read' | 'write',
		callback:
			| ((stateProperty: State[K]) => Promise<T> | T)
			| (() => Promise<T> | T),
		key?: K
	): Promise<T> {
		let clonedKey = key ? this.#helpers.data.clone(key) : null;

		return this.#errors.handleAsync(
			async () => {
				const lockType = type.toUpperCase();
				const lock = clonedKey
					? this.#getLockForKey(clonedKey)
					: this.#mutex;

				const acquire =
					type === 'read'
						? lock.acquireReadWithTimeout.bind(lock)
						: lock.acquireWriteWithTimeout.bind(lock);

				this.#log(
					`${clonedKey ? `Acquiring ${lockType} lock for ${String(clonedKey)}` : `Acquiring ${lockType} lock`}...`,
					{ caller: `${caller}.lockAndExecute`, level: 'debug' }
				);

				const acquired = await acquire(env.mutex.timeout);

				if (!acquired) {
					const msg = `${lockType} lock acquisition timed out${clonedKey ? ` for ${String(clonedKey)}` : ''}.`;

					this.#log(msg, {
						caller: `${caller}.lockAndExecute`,
						level: 'warn'
					});

					throw new Error(`[${caller}]: ${msg}`);
				}

				this.#log(
					`${lockType} lock acquired${clonedKey ? ` for ${String(clonedKey)}` : ''}.`,
					{
						caller: `${caller}.lockAndExecute`,
						level: 'debug'
					}
				);

				try {
					return clonedKey
						? await (
								callback as (
									stateProperty: State[K]
								) => Promise<T>
							)(this.#observer.get(clonedKey))
						: await (callback as () => Promise<T>)();
				} finally {
					await lock.release();

					this.#log(
						`${lockType} lock released${clonedKey ? ` for ${String(clonedKey)}` : ''}.`,
						{
							caller: `${caller}.lockAndExecute`,
							level: 'debug'
						}
					);
				}
			},
			`${clonedKey ? `Failed to acquire ${type} lock for property: ${String(clonedKey)}` : `Failed to acquire ${type} lock`}`
		);
	}

	async updateLockedProperty<K extends keyof State>(
		key: K,
		value: State[K],
		saveCallback: () => Promise<void> // Allow StatePersistence to handle saving
	): Promise<void> {
		return this.#errors.handleAsync(
			async () => {
				const lock = this.#getLockForKey(key);

				await lock.runExclusive(async () => {
					this.#observer.set(key, value);

					this.#log(`Updated ${String(key)} with locked property.`, {
						caller: `${caller}.updateLockedProperty`,
						level: 'debug'
					});

					await saveCallback();
				});
			},
			`[${caller}]: Failed to update locked property`,
			{ context: { key, value } }
		);
	}

	async updateSelections(
		selections: Partial<State['selections']>,
		track: boolean
	): Promise<void> {
		return this.#errors.handleAsync(
			async () => {
				this.#observer.set('selections', {
					...this.#observer.get('selections'),
					...selections
				});

				this.#log('Updated selections', {
					caller: `${caller}.updateSelections`,
					level: 'debug'
				});

				await this.#statePersistence.saveState(this.#state);
				this.#stateLock.logContentionStats();
			},
			`[${caller}]: Failed to update selections.`,
			{ context: { selections, track } }
		);
	}
}
