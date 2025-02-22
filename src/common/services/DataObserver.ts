// File: common/services/DataObserver.ts

import {
	DataObserverInterface,
	DebounceOptions,
	Listener
} from '../../types/index.js';

/**
 * @description Used for observing changes to a data object
 * @export
 * @class DataObserver
 * @implements {DataObserverInterface<T>}
 * @template T
 */
export class DataObserver<T extends Record<string, unknown>>
	implements DataObserverInterface<T>
{
	#listeners: { [P in keyof T]?: Listener<T[P]>[] } = {};
	#debounceTimers: Partial<Record<keyof T, NodeJS.Timeout>> = {};

	constructor(
		private data: T,
		private debounceOptions: DebounceOptions = {}
	) {
		this.data = this.#deepObserve(this.data);
	}

	/**
	 * @description Get the value of a property from the data object
	 * @template K
	 * @param {K} prop
	 * @return {*}  {T[K]}
	 * @memberof DataObserver
	 */
	get<K extends keyof T>(prop: K): T[K] {
		return this.data[prop];
	}

	/**
	 * @description Remove a listener from the list of listeners for a property
	 * @template K
	 * @param {K} prop
	 * @param {Listener<T[K]>} callback
	 * @memberof DataObserver
	 */
	off<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		this.#listeners[prop] =
			this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
	}

	/**
	 * @description Add a listener to the list of listeners for a property
	 * @template K
	 * @param {K} prop
	 * @param {Listener<T[K]>} callback
	 * @memberof DataObserver
	 */
	on<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		if (!this.#listeners[prop]) {
			this.#listeners[prop] = [];
		}
		this.#listeners[prop]!.push(callback);
	}

	/**
	 * @description Set the value of a property in the data object
	 * @template K
	 * @param {K} prop
	 * @param {T[K]} value
	 * @memberof DataObserver
	 */
	set<K extends keyof T>(prop: K, value: T[K]): void {
		this.data[prop] = value;
	}

	/**
	 * @description
	 * @template U
	 * @param {U} newData
	 * @return {*}  {DataObserver<U>}
	 * @memberof DataObserver
	 */
	setData<U extends Record<string, unknown>>(newData: U): DataObserver<U> {
		return new DataObserver(newData);
	}

	/**
	 * @description Recursively observe nested objects
	 * @param {T} obj
	 * @return {*}  {T}
	 * @memberof DataObserver
	 */
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

	/**
	 * @description Notify listeners of a property change
	 * @template K
	 * @param {K} prop
	 * @param {T[K]} newValue
	 * @param {T[K]} oldValue
	 * @memberof DataObserver
	 */
	#notify<K extends keyof T>(prop: K, newValue: T[K], oldValue: T[K]) {
		this.#listeners[prop]?.forEach(callback =>
			callback(newValue, oldValue)
		);
	}

	/**
	 * @description
	 * @template K
	 * @param {K} prop
	 * @param {T[K]} newValue
	 * @param {T[K]} oldValue
	 * @memberof DataObserver
	 */
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
