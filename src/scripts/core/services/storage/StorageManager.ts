// File: src/scripts/core/services/storage/StorageManager.ts

import { Services, StorageManagerContract } from '../../../types/index.js';
import { IDBStorageService } from './IDBStorageService.js';
import { LocalStorageService } from './LocalStorageService.js';

const caller = 'StorageManager';

export class StorageManager implements StorageManagerContract {
	static #instance: StorageManager | null = null;

	#idbStorageService: IDBStorageService | null = null;
	#localStorageService!: LocalStorageService;
	#useLocalStorage = false;

	#services!: Services;
	#errors!: Services['errors'];
	#log!: Services['log'];

	private constructor(services: Services) {
		try {
			this.#services = services;
			this.#log = services.log;
			this.#errors = services.errors;

			this.#localStorageService = LocalStorageService.getInstance(
				this.#services
			);

			this.init();

			this.#log.info(`${caller} initialized.`, `${caller}.constructor`);
		} catch (error) {
			throw new Error(
				`[${caller}.constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	static async getInstance(services: Services): Promise<StorageManager> {
		return services.errors.handleAsync(async () => {
			if (!StorageManager.#instance) {
				services.log.debug(
					`Creating StorageManager instance.`,
					`${caller}.getInstance`
				);

				StorageManager.#instance = new StorageManager(services);
			}

			return StorageManager.#instance;
		}, `[${caller}.getInstance]: Failed to create StorageManager instance.`);
	}

	async init(): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			this.#log.info('Initializing Storage Manager.', `${caller}.init`);

			this.#idbStorageService = await IDBStorageService.getInstance(
				this.#services
			);

			const idbAvailable = await this.#idbStorageService.init();

			if (!idbAvailable) {
				this.#log.warn(
					'IndexedDB is unavailable. Falling back to LocalStorage.',
					`${caller}.init`
				);
				this.#useLocalStorage = true;
				await this.#localStorageService.init();
				return false;
			}

			this.#log.info('Using IndexedDB for storage.', `${caller}.init`);
			return true;
		}, `[${caller}]: Initialization failed`);
	}

	async clear(): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			if (!this.#useLocalStorage && this.#idbStorageService) {
				const success = await this.#idbStorageService.clear();

				if (success !== null) return;
			}

			await this.#localStorageService.clear();
		}, `[${caller}]: Failed to clear storage.`);
	}

	async getItem<T>(key: string): Promise<T | null> {
		return this.#errors.handleAsync(
			async () => {
				if (!this.#useLocalStorage && this.#idbStorageService) {
					const value = await this.#idbStorageService.getItem<T>(key);

					if (value !== null) return value;
				}

				return await this.#localStorageService.getItem<T>(key);
			},
			`[${caller}]: Failed to get item ${key} from storage`,
			{ context: { key } }
		);
	}

	async removeItem(key: string): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				if (!this.#useLocalStorage && this.#idbStorageService) {
					try {
						await this.#idbStorageService.removeItem(key);

						return;
					} catch {}
				}
				await this.#localStorageService.removeItem(key);
			},
			`[${caller}]: Failed to remove item ${key} from storage`,
			{ context: { key } }
		);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		return await this.#errors.handleAsync(
			async () => {
				if (!this.#useLocalStorage && this.#idbStorageService) {
					await this.#idbStorageService.ensureDBReady();

					await this.#idbStorageService.setItem(key, value);

					return;
				}

				this.#log.warn(
					`Falling back to LocalStorage for key: ${key}`,
					`${caller}.setItem`
				);

				await this.#localStorageService.setItem(key, value);
			},
			`[${caller}]: Failed to set item ${key} in storage`,
			{ context: { key, value } }
		);
	}
}
