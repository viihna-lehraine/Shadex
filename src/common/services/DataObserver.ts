// File: common/services/DataObserver.ts

import {
	DataObserverInterface,
	DebounceOptions,
	Helpers,
	Listener
} from '../../types/index.js';

export class DataObserver<T extends Record<string, unknown>>
	implements DataObserverInterface<T>
{
	#listeners: { [P in keyof T]?: Listener<T[P]>[] } = {};
	#debounceTimers: Partial<Record<keyof T, NodeJS.Timeout>> = {};
	#helpers: Helpers;

	constructor(
		private data: T,
		private debounceOptions: DebounceOptions = {},
		helpers: Helpers
	) {
		this.data = this.#deepObserve(this.data);
		this.#helpers = helpers;
	}

	batchUpdate(updates: Partial<T>): void {
		Object.entries(updates).forEach(([key, value]) => {
			this.set(key as keyof T, value as T[keyof T]);
		});
	}

	get<K extends keyof T>(prop: K): T[K] {
		return this.#helpers.data.clone(this.data[prop]);
	}

	off<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		this.#listeners[prop] =
			this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
	}

	on<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		if (!this.#listeners[prop]) {
			this.#listeners[prop] = [];
		}
		this.#listeners[prop]!.push(callback);
	}

	set<K extends keyof T>(prop: K, value: T[K]): void {
		const oldValue = this.#helpers.data.clone(this.data[prop]);
		this.data[prop] = this.#helpers.data.clone(value);
		this.#triggerNotify(prop, this.data[prop], oldValue);
	}

	setData<U extends Record<string, unknown>>(
		helpers: Helpers,
		debounceOptions: DebounceOptions,
		newData: U
	): DataObserver<U> {
		return new DataObserver(helpers, debounceOptions, newData);
	}

	#deepObserve(obj: T): T {
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
	}

	#notify<K extends keyof T>(prop: K, newValue: T[K], oldValue: T[K]) {
		this.#listeners[prop]?.forEach(callback =>
			callback(newValue, oldValue)
		);
	}

	#triggerNotify<K extends keyof T>(prop: K, newValue: T[K], oldValue: T[K]) {
		const delay = this.debounceOptions.delay ?? 0;

		if (delay > 0) {
			clearTimeout(this.#debounceTimers[prop]);
			this.#debounceTimers[prop] = setTimeout(() => {
				this.#notify(prop, newValue, oldValue);
			}, delay);
		} else {
			this.#notify(prop, newValue, oldValue);
		}
	}
}
