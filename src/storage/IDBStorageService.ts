// File: storage/IDBStorageService.ts

import { IDBStorageContract, Services } from '../types/index.js';
import { config, env } from '../config/index.js';

const caller = 'IDBStorageService';
const dbName = config.storage.idbDBName;
const defaultVerson = config.storage.idbDefaultVersion;
const idbRetryDelay = env.idb.retryDelay;
const storeName = config.storage.idbStoreName;

export class IDBStorageService implements IDBStorageContract {
	static #instance: IDBStorageService | null = null;

	#defaultVersion: number;
	#version: number;
	#db: IDBDatabase | null = null;

	#errors: Services['errors'];
	#log: Services['log'];

	private constructor(services: Services) {
		try {
			services.log(`Constructing ${caller} instance.`, {
				caller: `${caller} constructor`
			});

			this.#defaultVersion = defaultVerson;
			this.#version = this.#defaultVersion;
			this.#errors = services.errors;
			this.#log = services.log;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	static async getInstance(services: Services): Promise<IDBStorageService> {
		return services.errors.handleSync(() => {
			if (!IDBStorageService.#instance) {
				services.log(
					`No ${caller} instance exists yet. Creating new instance.`,
					{
						caller: `${caller}.getInstance`,
						level: 'debug'
					}
				);

				IDBStorageService.#instance = new IDBStorageService(services);
			}

			services.log(`Returning existing ${caller} instance.`, {
				caller: `${caller}.getInstance`,
				level: 'debug'
			});

			return IDBStorageService.#instance;
		}, `[${caller}]: Failed to create IDBManager instance.`);
	}

	async init(): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			if (!window.indexedDB) {
				throw new Error('IndexedDB is not supported in this browser');
			}

			this.#log(`Opening IndexedDB...`, {
				caller: `${caller}.init`
			});

			const request = indexedDB.open(dbName, this.#version);

			return await new Promise((resolve, reject) => {
				let upgradeComplete = false;

				request.onupgradeneeded = event => {
					const db = (event.target as IDBOpenDBRequest).result;

					this.#log(
						`Upgrading IndexedDB to version: ${this.#version}`,
						{ caller: `${caller}.init`, level: 'warn' }
					);

					if (!db.objectStoreNames.contains(storeName)) {
						db.createObjectStore(storeName, {
							keyPath: 'id',
							autoIncrement: true
						});

						this.#log(`Created object store: ${storeName}`, {
							caller: `${caller}.init`
						});
					}

					upgradeComplete = true;
				};

				request.onsuccess = event => {
					if (
						!upgradeComplete &&
						request.result.version !== this.#version
					) {
						this.#log('Waiting for upgrade to finish.', {
							caller: `${caller}.init`,
							level: 'warn'
						});
					}

					this.#db = (event.target as IDBOpenDBRequest).result;

					this.#db.onversionchange = () => {
						this.#db?.close();

						this.#log(
							'IndexedDB version changed. Closing database',
							{
								caller: `${caller}.init`,
								level: 'warn'
							}
						);
					};

					this.#log(`IndexedDB opened successfully`, {
						caller: `${caller}.init`
					});

					resolve(true);
				};

				request.onerror = event => {
					reject(
						(event.target as IDBOpenDBRequest).error?.message ||
							`Unknown ${caller}.init error.`
					);
				};

				request.onblocked = () => {
					this.#log(`IndexedDB upgade blocked!`, {
						caller: `${caller}.init`,
						level: 'warn'
					});

					reject(
						`Upgrade blocked. Close other tabs using this database.`
					);
				};
			});
		}, `[${caller}]: Failed to initialize IndexedDB`);
	}

	async clear(): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readwrite');

			if (!store) throw new Error(`${caller} is not initialized.`);

			await new Promise<void>((resolve, reject) => {
				const request = store.clear();

				request.onsuccess = () => resolve();

				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							`Unknown ${caller}.clear error`
					);
			});
		}, `[${caller}]: Failed to clear IndexedDB.`);
	}

	async ensureDBReady(): Promise<void> {
		this.#errors.handleAsync(async () => {
			while (!this.#db) {
				this.#log(`Waiting for ${caller} to initialize...`, {
					caller: `${caller}.ensureDBReady`,
					level: 'warn'
				});

				// TODO: replace with a better solution??
				await new Promise(resolve =>
					setTimeout(resolve, idbRetryDelay)
				);
			}
		}, `[${caller}]: Failed to ensure IndexedDB is ready`);
	}

	async getItem<T>(key: string): Promise<T | null> {
		await this.ensureDBReady();

		return this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readonly');

			if (!store) throw new Error(`${caller} is not initialized.`);

			return await new Promise<T | null>((resolve, reject) => {
				const request = store.get(key);

				request.onsuccess = () =>
					resolve(request.result?.value ?? null);

				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							`Unknown ${caller}.getItem() error`
					);
			});
		}, `[${caller}]: Failed to retrieve item ${key} from IndexedDB`);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readwrite');

			if (!store) throw new Error(`${caller} is not initialized.`);

			await new Promise<void>((resolve, reject) => {
				const request = store.put({ id: key, value });

				request.onsuccess = () => resolve();

				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							`Unknown ${caller}.setItem error`
					);
			});
		}, `[${caller}]: Failed to store item ${key} in IndexedDB`);
	}

	async removeItem(key: string): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readwrite');

			if (!store) throw new Error(`${caller} is not initialized.`);

			await new Promise<void>((resolve, reject) => {
				const request = store.delete(key);

				request.onsuccess = () => resolve();

				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							`Unknown ${caller}.removeItem error.`
					);
			});
		}, `[${caller}]: Failed to remove item ${key} from IndexedDB`);
	}

	private getTransaction(mode: IDBTransactionMode): IDBObjectStore | void {
		return this.#errors.handleSync(() => {
			if (!this.#db) throw new Error(`${caller} is not initialized.`);

			const transaction = this.#db.transaction(storeName, mode);

			return transaction.objectStore(storeName);
		}, `[${caller}]: Failed to get IndexedDB transaction (${mode})`);
	}
}
