// File: storage/LocalStorageManager.js

import {
	LocalStorageManagerClassInterface,
	ServicesInterface
} from '../types/index.js';

export class LocalStorageManager implements LocalStorageManagerClassInterface {
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
		this.log(
			'warn',
			'Using LocalStorage as a fallback.',
			'LocalStorageManager.init()',
			2
		);
		return true;
	}

	public async clear(): Promise<void> {
		await this.errors.handleAsync(
			async () => localStorage.clear(),
			'Failed to clear LocalStorage',
			'LocalStorageManager.clear()'
		);
	}

	public async getItem<T>(key: string): Promise<T | null> {
		return this.errors.handleAsync(
			async () => {
				const value = localStorage.getItem(key);
				return value ? JSON.parse(value) : null;
			},
			`Failed to get item ${key} from LocalStorage`,
			'LocalStorageManager.getItem()'
		);
	}

	public async removeItem(key: string): Promise<void> {
		await this.errors.handleAsync(
			async () => localStorage.removeItem(key),
			`Failed to remove item ${key} from LocalStorage`,
			'LocalStorageManager.removeItem()'
		);
	}

	public async setItem(key: string, value: unknown): Promise<void> {
		await this.errors.handleAsync(
			async () => {
				localStorage.setItem(key, JSON.stringify(value));
				this.log(
					'info',
					`Stored item: ${key}`,
					'LocalStorageManager.setItem()'
				);
			},
			`Failed to store item ${key} in LocalStorage`,
			'LocalStorageManager.setItem()'
		);
	}
}
