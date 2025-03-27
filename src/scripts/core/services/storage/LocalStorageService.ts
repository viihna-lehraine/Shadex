// File: src/scripts/core/services/storage/LocalStorageService.ts

import { LocalStorageContract, Services } from '../../../types/index.js';

const caller = 'LocalStorageService';

export class LocalStorageService implements LocalStorageContract {
	static #instance: LocalStorageService | null = null;

	#errors: Services['errors'];
	#log: Services['log'];

	private constructor(services: Services) {
		try {
			services.log.info(
				`Constructing ${caller} instance.`,
				`${caller}.constructor`
			);

			this.#errors = services.errors;
			this.#log = services.log;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(services: Services): LocalStorageService {
		return services.errors.handleSync(() => {
			if (!LocalStorageService.#instance) {
				services.log.debug(
					`No ${caller} instance exists yet. Creating new instance.`,
					`${caller}.getInstance`
				);

				LocalStorageService.#instance = new LocalStorageService(
					services
				);
			}

			services.log.debug(
				'Returning LocalStorageManager instance.',
				`${caller}.getInstance`
			);

			return LocalStorageService.#instance;
		}, `[${caller}]: Failed to create LocalStorageManager instance.`);
	}

	async init(): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			this.#log.warn(
				'Using LocalStorage as storage fallback.',
				`${caller}.init`
			);

			return true;
		}, `[${caller}.init]: Failed to initialize LocalStorage`);
	}

	async clear(): Promise<void> {
		return await this.#errors.handleAsync(
			async () => localStorage.clear(),
			`[${caller}]: Failed to clear LocalStorage.`
		);
	}

	async getItem<T>(key: string): Promise<T | null> {
		return this.#errors.handleAsync(async () => {
			const value = localStorage.getItem(key);

			return value ? JSON.parse(value) : null;
		}, `[${caller}]: Failed to get item ${key} from LocalStorage.`);
	}

	async removeItem(key: string): Promise<void> {
		return await this.#errors.handleAsync(
			async () => localStorage.removeItem(key),
			`[${caller}]: Failed to remove item ${key} from LocalStorage.`
		);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			localStorage.setItem(key, JSON.stringify(value));

			this.#log.debug(`Stored item: ${key}`, `${caller}.setItem`);
		}, `Failed to store item ${key} in LocalStorage`);
	}
}
