// File: storage/LocalStorageManager.js

import { ServicesInterface } from '../types/index.js';

export class LocalStorageManager {
	private static instance: LocalStorageManager | null = null;
	private log: ServicesInterface['log'];

	private constructor(services: ServicesInterface) {
		this.log = services.log;
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
		localStorage.clear();
	}

	public async getItem<T>(key: string): Promise<T | null> {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			this.log(
				'error',
				`Failed to get item: ${key}`,
				'LocalStorageManager.getItem()'
			);
			return null;
		}
	}

	public async removeItem(key: string): Promise<void> {
		localStorage.removeItem(key);
	}

	public async setItem(key: string, value: unknown): Promise<void> {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			this.log(
				'info',
				`Stored item: ${key}`,
				'LocalStorageManager.setItem()'
			);
		} catch (error) {
			this.log(
				'error',
				`Failed to store item: ${key}`,
				'LocalStorageManager.setItem()'
			);
		}
	}
}
