// File: common/services/DataObserver.js

import { DataObserverClassInterface, Listener } from '../../types/index.js';

export class DataObserver<T extends Record<string, unknown>>
	implements DataObserverClassInterface<T>
{
	private data: T;
	private listeners: Partial<Record<keyof T, Listener<T[keyof T]>[]>> =
		{} as Record<keyof T, Listener<T[keyof T]>[]>;

	constructor(initialData: T) {
		this.data = new Proxy(initialData, {
			set: (obj, prop: string | symbol, value: unknown) => {
				if (typeof prop === 'string' && prop in obj) {
					const typedProp = prop as keyof T;
					const oldValue = obj[typedProp];

					obj[typedProp] = value as T[keyof T];

					console.log(
						`[Proxy] ${prop as string} changed from`,
						oldValue,
						'to',
						value
					);
					this.notify(prop, value as T[keyof T], oldValue);
				}

				return true;
			},
			deleteProperty: (obj, prop: string | symbol) => {
				if (typeof prop === 'string' && prop in obj) {
					const typedProp = prop as keyof T;
					console.log(`[Proxy] ${typedProp as string} deleted.`);
					this.notify(
						typedProp as string,
						undefined as T[keyof T],
						obj[typedProp]
					);
					delete obj[typedProp];
				}

				return true;
			}
		});
	}

	public get<K extends keyof T>(prop: K): T[K] {
		return this.data[prop];
	}

	// subscribe to property changes
	public on<K extends keyof T>(prop: K, callback: Listener<T[K]>): void {
		if (!this.listeners[prop]) this.listeners[prop] = [];
		(this.listeners[prop] as Listener<T[K]>[]).push(callback);
	}

	public set<K extends keyof T>(prop: K, value: T[K]): void {
		this.data[prop] = value;
	}

	// notify listeners when a property changes
	private notify<K extends keyof T>(prop: K, newValue: T[K], oldValue: T[K]) {
		this.listeners[prop]?.forEach(callback => callback(newValue, oldValue));
	}
}
