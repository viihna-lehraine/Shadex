// File: storage/LocalStorageManager.js

import { LocalStorageManagerInterface, Services } from '../types/index.js';

export class LocalStorageManager implements LocalStorageManagerInterface {
	static #instance: LocalStorageManager | null = null;
	#log: Services['log'];
	#errors: Services['errors'];

	private constructor(services: Services) {
		this.#log = services.log;
		this.#errors = services.errors;
	}

	static getInstance(services: Services): LocalStorageManager {
		if (!LocalStorageManager.#instance) {
			LocalStorageManager.#instance = new LocalStorageManager(services);
		}

		return LocalStorageManager.#instance;
	}

	async init(): Promise<boolean> {
		this.#log('Using LocalStorage as a fallback.', 'warn');
		return true;
	}

	async clear(): Promise<void> {
		await this.#errors.handleAsync(
			async () => localStorage.clear(),
			'Failed to clear LocalStorage'
		);
	}

	async getItem<T>(key: string): Promise<T | null> {
		return this.#errors.handleAsync(async () => {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		}, `Failed to get item ${key} from LocalStorage`);
	}

	async removeItem(key: string): Promise<void> {
		await this.#errors.handleAsync(
			async () => localStorage.removeItem(key),
			`Failed to remove item ${key} from LocalStorage`
		);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		await this.#errors.handleAsync(async () => {
			localStorage.setItem(key, JSON.stringify(value));
			this.#log(`Stored item: ${key}`);
		}, `Failed to store item ${key} in LocalStorage`);
	}
}
