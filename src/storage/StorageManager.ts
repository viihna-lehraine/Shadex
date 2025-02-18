// File: storage/StorageManager.js

import { ServicesInterface } from '../types/index.js';
import { IDBManager } from './IDBManager.js';
import { LocalStorageManager } from './LocalStorageManager.js';

export class StorageManager {
	private idbManager: IDBManager | null = null;
	private localStorageManager: LocalStorageManager;
	private services: ServicesInterface;
	private log: ServicesInterface['log'];
	private useLocalStorage = false;

	constructor(services: ServicesInterface) {
		this.services = services;
		this.log = services.log;
		this.localStorageManager = LocalStorageManager.getInstance(
			this.services
		);
	}

	public async init(): Promise<boolean> {
		this.log(
			'info',
			'Initializing Storage Manager',
			'StorageManager.init()'
		);
		try {
			this.idbManager = IDBManager.getInstance(this.services);
			const idbAvailable = await this.idbManager.init();
			if (idbAvailable) {
				this.log(
					'info',
					'Using IndexedDB for storage.',
					'StorageManager.init()'
				);
				return true;
			}
		} catch (error) {
			this.log(
				'warn',
				'IndexedDB initialization failed, falling back to LocalStorage',
				'StorageManager.init()'
			);
		}

		this.useLocalStorage = true;
		await this.localStorageManager.init();
		return true;
	}

	public async clear(): Promise<void> {
		if (!this.useLocalStorage && this.idbManager) {
			try {
				await this.idbManager.clear();
				return;
			} catch (error) {
				this.log(
					'warn',
					'Failed to clear IndexedDB, falling back to LocalStorage',
					'StorageManager.clear()'
				);
			}
		}

		await this.localStorageManager.clear();
	}

	public async getItem<T>(key: string): Promise<T | null> {
		if (!this.useLocalStorage && this.idbManager) {
			try {
				const value = await this.idbManager.getItem<T>(key);
				if (value !== null) return value;
			} catch (error) {
				this.log(
					'warn',
					`Failed to get item ${key} from IndexedDB, trying LocalStorage`,
					'StorageManager.getItem()'
				);
			}
		}

		return await this.localStorageManager.getItem<T>(key);
	}

	public async removeItem(key: string): Promise<void> {
		if (!this.useLocalStorage && this.idbManager) {
			try {
				await this.idbManager.removeItem(key);
				return;
			} catch (error) {
				this.log(
					'error',
					`Failed to remove item ${key} from IndexedDB, trying LocalStorage`,
					'StorageManager.removeItem()'
				);
			}
		}

		await this.localStorageManager.removeItem(key);
	}

	public async setItem(key: string, value: unknown): Promise<void> {
		if (!this.useLocalStorage && this.idbManager) {
			try {
				await this.idbManager.ensureDBReady();
				await this.idbManager.setItem(key, value);
				return;
			} catch (error) {
				this.log(
					'error',
					`Failed to set item ${key} in IndexedDB, using LocalStorage`,
					'StorageManager.setItem()'
				);
			}
		}

		await this.localStorageManager.setItem(key, value);
	}
}
