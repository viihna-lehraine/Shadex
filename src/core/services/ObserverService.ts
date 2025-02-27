// File: core/services/ObserverService.ts

import {
	DebounceOptions,
	Helpers,
	Listener,
	ObserverContract,
	Services
} from '../../types/index.js';

const caller = 'ObserverService';

export class ObserverService<T extends Record<string, unknown>>
	implements ObserverContract<T>
{
	#listeners: { [P in keyof T]?: Listener<T[P]>[] } = {};
	#debounceTimers: Partial<Record<keyof T, NodeJS.Timeout>> = {};

	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];

	constructor(
		private data: T,
		private debounceOptions: DebounceOptions = {},
		helpers: Helpers,
		services: Services
	) {
		try {
			services.log.debug(
				`Constructing Observer instance`,
				`${caller} constructor`
			);

			this.#errors = services.errors;
			this.#log = services.log;
			this.#helpers = helpers;

			this.data = this.#deepObserve(this.data);
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	batchUpdate(updates: Partial<T>): void {
		return this.#errors.handleSync(() => {
			this.#log.debug(
				`Performing batch update. Updates: ${JSON.stringify(this.#helpers.data.clone(updates))}`,
				`${caller}.batchUpdate`
			);

			Object.entries(updates).forEach(([key, value]) => {
				this.set(key as keyof T, value as T[keyof T]);
			});
		}, `[${caller}]: Error performing batch update.`);
	}

	get<K extends keyof T>(prop: K): T[K] {
		return this.#errors.handleSync(() => {
			return this.#helpers.data.clone(this.data[prop]);
		}, `[${caller}]: Error getting data.`);
	}

	getData(): T {
		return this.#errors.handleSync(() => {
			return this.#helpers.data.clone(this.data);
		}, `[${caller}]: Error getting data.`);
	}

	off<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		return this.#errors.handleSync(() => {
			this.#listeners[prop] =
				this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
		}, `[${caller}]: Error removing listener.`);
	}

	on<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		return this.#errors.handleSync(() => {
			if (!this.#listeners[prop]) {
				this.#listeners[prop] = [];
			}

			this.#listeners[prop]!.push(callback);
		}, `[${caller}]: Error adding listener.`);
	}

	replaceData(newData: T): void {
		return this.#errors.handleSync(() => {
			const oldData = this.data;
			this.data = this.#deepObserve(newData);

			// notify listeners of all changed properties
			Object.keys(newData).forEach(key => {
				const prop = key as keyof T;
				const newValue = newData[prop];
				const oldValue = oldData[prop];

				const clonedNewValue = this.#helpers.data.clone(newValue);
				const clonedOldValue = this.#helpers.data.clone(oldValue);

				// notify only if values differ
				if (JSON.stringify(clonedNewValue) !== JSON.stringify(clonedOldValue)) {
					this.#triggerNotify(prop, newValue, oldValue);
				}

				// notify listeners for removed properties
				Object.keys(oldData).forEach(key => {
					if (!(key in newData)) {
						const prop = key as keyof T;
						this.#triggerNotify(prop, undefined as T[keyof T], oldData[prop]);
					}
				});
			});

			this.#log.debug(
				`Observer data replaced and listeners notified.`,
				`${caller}.replaceData`
			);
		}, `[${caller}.replaceData]: Error replacing data.`);
	}

	set<K extends keyof T>(prop: K, value: T[K]): void {
		return this.#errors.handleSync(() => {
			const oldValue = this.#helpers.data.clone(this.data[prop]);

			this.data[prop] = this.#helpers.data.clone(value);

			this.#triggerNotify(prop, this.data[prop], oldValue);
		}, `[${caller}]: Error setting data.`);
	}

	setData<U extends Record<string, unknown>>(
		newData: U,
		debounceOptions: DebounceOptions,
		helpers: Helpers,
		services: Services
	): ObserverService<U> {
		return new ObserverService(newData, debounceOptions, helpers, services);
	}

	#deepObserve(obj: T): T {
		return this.#errors.handleSync(() => {
			if (typeof obj !== 'object' || obj === null) {
				return obj;
			}

			// recursively proxy nested objects
			return new Proxy(obj as Record<string, unknown>, {
				get: (target, prop: string) => {
					const value = target[prop];

					return typeof value === 'object' && value !== null
						? this.#deepObserve(value as T)
						: value;
				},
				set: (target, prop: string, value) => {
					if (Object.prototype.hasOwnProperty.call(target, prop)) {
						const oldValue = target[prop];

						target[prop] = value;

						this.#triggerNotify(
							prop as keyof T,
							value as T[keyof T],
							oldValue as T[keyof T]
						);
					}
					return true;
				},
				deleteProperty: (target, prop: string) => {
					if (Object.prototype.hasOwnProperty.call(target, prop)) {
						const oldValue = target[prop];

						delete target[prop];

						this.#triggerNotify(
							prop as keyof T,
							undefined as T[keyof T],
							oldValue as T[keyof T]
						);
					}
					return true;
				}
			}) as T;
		}, `[${caller}]: Error observing data.`);
	}

	#notify<K extends keyof T>(prop: K, newValue: T[K], oldValue: T[K]) {
		return this.#errors.handleSync(() => {
			this.#listeners[prop]?.forEach(callback => callback(newValue, oldValue));
		}, `[${caller}]: Error notifying listeners.`);
	}

	#triggerNotify<K extends keyof T>(
		prop: K,
		newValue: T[K],
		oldValue: T[K]
	): void {
		return this.#errors.handleSync(() => {
			const delay = this.debounceOptions.delay ?? 0;

			if (delay > 0) {
				clearTimeout(this.#debounceTimers[prop]);

				this.#debounceTimers[prop] = setTimeout(() => {
					this.#notify(prop, newValue, oldValue);
				}, delay);
			} else {
				this.#notify(prop, newValue, oldValue);
			}
		}, `[${caller}]: Error triggering notification.`);
	}
}
