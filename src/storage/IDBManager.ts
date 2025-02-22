// File: storage/IDBManager.ts

import { IDBManagerInterface, Services } from '../types/index.js';
import { config } from '../config/index.js';

const dbName = config.storage.idbDBName;
const defaultVerson = config.storage.idbDefaultVersion;
const idbRetryDelay = config.env.idbRetryDelay;
const storeName = config.storage.idbStoreName;

export class IDBManager implements IDBManagerInterface {
	static #instance: IDBManager | null = null;
	#defaultVersion: number;
	#version: number;
	#db: IDBDatabase | null = null;
	#log: Services['log'];
	#errors: Services['errors'];

	private constructor(services: Services) {
		this.#defaultVersion = defaultVerson;
		this.#version = this.#defaultVersion;
		this.#log = services.log;
		this.#errors = services.errors;
	}

	static getInstance(services: Services): IDBManager {
		if (!IDBManager.#instance) {
			IDBManager.#instance = new IDBManager(services);
		}

		return IDBManager.#instance;
	}

	async init(): Promise<boolean> {
		return this.#errors.handleAsync(async () => {
			if (!window.indexedDB) {
				throw new Error('IndexedDB is not supported in this browser');
			}

			console.log('[IDBManager.init] Opening IndexedDB...');
			const request = indexedDB.open(dbName, this.#version);

			return await new Promise((resolve, reject) => {
				let upgradeComplete = false;

				request.onupgradeneeded = event => {
					const db = (event.target as IDBOpenDBRequest).result;
					this.#log(
						`Upgrading IndexedDB to version: ${this.#version}`,
						{ caller: '[IDBManager.init]', level: 'warn' }
					);

					if (!db.objectStoreNames.contains(storeName)) {
						db.createObjectStore(storeName, {
							keyPath: 'id',
							autoIncrement: true
						});
						this.#log(`Created object store: ${storeName}`, {
							caller: '[IDBManager.init]',
							level: 'info'
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
							caller: '[IDBManager.init]',
							level: 'warn'
						});
					}
					this.#db = (event.target as IDBOpenDBRequest).result;
					this.#db.onversionchange = () => {
						this.#db?.close();
						this.#log(
							'IndexedDB version changed. Closing database',
							{
								caller: '[IDBManager.init]',
								level: 'warn'
							}
						);
					};

					this.#log(`IndexedDB opened successfully`, {
						caller: '[IDBManager.init]',
						level: 'info'
					});
					resolve(true);
				};

				request.onerror = event => {
					reject(
						(event.target as IDBOpenDBRequest).error?.message ||
							'Unknown IDBManager.init() error'
					);
				};

				request.onblocked = () => {
					this.#log(`[IDBManager.init] IndexedDB upgade blocked!`, {
						caller: '[IDBManager.init]',
						level: 'warn'
					});
					reject(
						`Upgrade blocked. Close other tabs using this database.`
					);
				};
			});
		}, 'Failed to initialize IndexedDB');
	}

	async clear(): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readwrite');
			if (!store) throw new Error('IndexedDB is not initialized.');

			await new Promise<void>((resolve, reject) => {
				const request = store.clear();
				request.onsuccess = () => resolve();
				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							'Unknown IDBManager.clear() error'
					);
			});
		}, 'Failed to clear IndexedDB');
	}

	async ensureDBReady(): Promise<void> {
		while (!this.#db) {
			this.#log('Waiting for IndexedDB to initialize...', {
				caller: '[IDBManager.ensureDBReady]',
				level: 'warn'
			});
			// TODO: replace with a better solution??
			await new Promise(resolve => setTimeout(resolve, idbRetryDelay));
		}
	}

	async getItem<T>(key: string): Promise<T | null> {
		await this.ensureDBReady();

		return this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readonly');
			if (!store) throw new Error('IndexedDB is not initialized.');

			return await new Promise<T | null>((resolve, reject) => {
				const request = store.get(key);
				request.onsuccess = () =>
					resolve(request.result?.value ?? null);
				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							'Unknown IDBManager.getItem() error'
					);
			});
		}, `Failed to retrieve item ${key} from IndexedDB`);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readwrite');
			if (!store) throw new Error('IndexedDB is not initialized.');

			await new Promise<void>((resolve, reject) => {
				const request = store.put({ id: key, value });
				request.onsuccess = () => resolve();
				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							'Unknown IDBManager.setItem() error'
					);
			});
		}, `Failed to store item ${key} in IndexedDB`);
	}

	async removeItem(key: string): Promise<void> {
		return await this.#errors.handleAsync(async () => {
			const store = this.getTransaction('readwrite');
			if (!store) throw new Error('IndexedDB is not initialized.');

			await new Promise<void>((resolve, reject) => {
				const request = store.delete(key);
				request.onsuccess = () => resolve();
				request.onerror = event =>
					reject(
						(event.target as IDBRequest).error?.message ||
							'Unknown IDBManager.removeItem() error'
					);
			});
		}, `Failed to remove item ${key} from IndexedDB`);
	}

	private getTransaction(mode: IDBTransactionMode): IDBObjectStore | void {
		return this.#errors.handleSync(() => {
			if (!this.#db) throw new Error('IndexedDB is not initialized.');
			const transaction = this.#db.transaction(storeName, mode);
			return transaction.objectStore(storeName);
		}, `Failed to get IndexedDB transaction (${mode})`);
	}
}
