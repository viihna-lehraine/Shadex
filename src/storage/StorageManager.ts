// File: storage/StorageManager.ts

import { Services, StorageManagerInterface } from '../types/index.js';
import { IDBManager } from './IDBManager.js';
import { LocalStorageManager } from './LocalStorageManager.js';

const caller = 'StorageManager';

export class StorageManager implements StorageManagerInterface {
	#idbManager: IDBManager | null = null;
	#localStorageManager!: LocalStorageManager;
	#useLocalStorage = false;

	#services!: Services;
	#errors!: Services['errors'];
	#log!: Services['log'];

	constructor(services: Services) {
		try {
			this.#services = services;
			this.#log = services.log;
			this.#errors = services.errors;

			this.#localStorageManager = LocalStorageManager.getInstance(
				this.#services
			);

			this.#log('Storage Manager initialized', {
				caller: `${caller}.constructor`
			});
		} catch (error) {
			throw new Error(
				`[${caller}.constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	async init(): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			this.#log('Initializing Storage Manager.', {
				caller: `[${caller}.init]`
			});

			this.#idbManager = await IDBManager.getInstance(this.#services);

			const idbAvailable = await this.#idbManager.init();

			if (idbAvailable) {
				this.#log('Using IndexedDB for storage!', {
					caller: `${caller}.init`
				});

				return true;
			}

			this.#useLocalStorage = true;

			await this.#localStorageManager.init();

			return true;
		}, `[${caller}]: Initialization failed`);
	}

	async clear(): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			if (!this.#useLocalStorage && this.#idbManager) {
				const success = await this.#idbManager.clear();

				if (success !== null) return;
			}

			await this.#localStorageManager.clear();
		}, `[${caller}]: Failed to clear storage.`);
	}

	async getItem<T>(key: string): Promise<T | null> {
		return this.#errors.handleAsync(
			async () => {
				if (!this.#useLocalStorage && this.#idbManager) {
					const value = await this.#idbManager.getItem<T>(key);

					if (value !== null) return value;
				}

				return await this.#localStorageManager.getItem<T>(key);
			},
			`[${caller}]: Failed to get item ${key} from storage`,
			{ context: { key } }
		);
	}

	async removeItem(key: string): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				if (!this.#useLocalStorage && this.#idbManager) {
					try {
						await this.#idbManager.removeItem(key);

						return;
					} catch {}
				}
				await this.#localStorageManager.removeItem(key);
			},
			`[${caller}]: Failed to remove item ${key} from storage`,
			{ context: { key } }
		);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				if (!this.#useLocalStorage && this.#idbManager) {
					await this.#idbManager.ensureDBReady();

					await this.#idbManager.setItem(key, value);

					return;
				}

				this.#log(`Falling back to LocalStorage for key: ${key}`, {
					caller: `${caller}.setItem`,
					level: 'warn'
				});

				await this.#localStorageManager.setItem(key, value);
			},
			`[${caller}]: Failed to set item ${key} in storage`,
			{ context: { key, value } }
		);
	}
}
