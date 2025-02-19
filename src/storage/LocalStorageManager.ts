// File: storage/LocalStorageManager.js

import {
	LocalStorageManagerInterface,
	ServicesInterface
} from '../types/index.js';

export class LocalStorageManager implements LocalStorageManagerInterface {
	private static instance: LocalStorageManager | null = null;
	private log: ServicesInterface['log'];
	private errors: ServicesInterface['errors'];

	private constructor(services: ServicesInterface) {
		this.log = services.log;
		this.errors = services.errors;
	}

	public static getInstance(
		services: ServicesInterface
	): LocalStorageManager {
		if (!LocalStorageManager.instance) {
			LocalStorageManager.instance = new LocalStorageManager(services);
		}

		return LocalStorageManager.instance;
	}

	public async init(): Promise<boolean> {
		this.log('Using LocalStorage as a fallback.', 'warn');
		return true;
	}

	public async clear(): Promise<void> {
		await this.errors.handleAsync(
			async () => localStorage.clear(),
			'Failed to clear LocalStorage'
		);
	}

	public async getItem<T>(key: string): Promise<T | null> {
		return this.errors.handleAsync(async () => {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		}, `Failed to get item ${key} from LocalStorage`);
	}

	public async removeItem(key: string): Promise<void> {
		await this.errors.handleAsync(
			async () => localStorage.removeItem(key),
			`Failed to remove item ${key} from LocalStorage`
		);
	}

	public async setItem(key: string, value: unknown): Promise<void> {
		await this.errors.handleAsync(async () => {
			localStorage.setItem(key, JSON.stringify(value));
			this.log(`Stored item: ${key}`);
		}, `Failed to store item ${key} in LocalStorage`);
	}
}
