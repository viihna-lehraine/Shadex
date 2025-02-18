// File: storage/IDBManager.js

import { IDBManagerClassInterface, ServicesInterface } from '../types/index.js';
import { data } from '../data/index.js';

const dbName = data.storage.idb.dbName;
const defaultVerson = data.storage.idb.defaultVersion;
const storeName = data.storage.idb.storeName;

export class IDBManager implements IDBManagerClassInterface {
	private static instance: IDBManager | null = null;
	private defaultVersion: number;
	private version: number;
	private db: IDBDatabase | null = null;
	private log: ServicesInterface['log'];
	private errors: ServicesInterface['errors'];

	private constructor(services: ServicesInterface) {
		this.defaultVersion = defaultVerson;
		this.version = this.defaultVersion;
		this.log = services.log;
		this.errors = services.errors;
	}

	public static getInstance(services: ServicesInterface): IDBManager {
		if (!IDBManager.instance) {
			IDBManager.instance = new IDBManager(services);
		}

		return IDBManager.instance;
	}

	public async init(): Promise<boolean> {
		return this.errors.handleAsync(
			async () => {
				if (!window.indexedDB) {
					throw new Error(
						'IndexedDB is not supported in this browser'
					);
				}

				console.log('[IDBManager.init] Opening IndexedDB...');
				const request = indexedDB.open(dbName, this.version);

				return await new Promise((resolve, reject) => {
					request.onupgradeneeded = event => {
						const db = (event.target as IDBOpenDBRequest).result;
						if (!db.objectStoreNames.contains(storeName)) {
							db.createObjectStore(storeName, {
								keyPath: 'id',
								autoIncrement: true
							});
							console.log(
								`[IDBManager.init] Created object store: ${storeName}`
							);
						}
					};

					request.onsuccess = event => {
						this.db = (event.target as IDBOpenDBRequest).result;
						this.db.onversionchange = () => {
							this.db?.close();
							this.log(
								'warn',
								'IndexedDB version changed, closing database',
								'IDBManager.init()'
							);
						};
						resolve(true);
					};

					request.onerror = event => {
						reject(
							(event.target as IDBOpenDBRequest).error?.message ||
								'Unknown error'
						);
					};
				});
			},
			'Failed to initialize IndexedDB',
			'IDBManager.init()'
		);
	}

	public async ensureDBReady(): Promise<void> {
		while (!this.db) {
			this.log(
				'warn',
				'Waiting for IndexedDB to initialize...',
				'IDBManager.ensureDBReady()'
			);
			await new Promise(resolve => setTimeout(resolve, 50));
		}
	}

	public async clear(): Promise<void> {
		await this.errors.handleAsync(
			async () => {
				const store = this.getTransaction('readwrite');
				if (!store) throw new Error('IndexedDB is not initialized.');

				await new Promise<void>((resolve, reject) => {
					const request = store.clear();
					request.onsuccess = () => resolve();
					request.onerror = event =>
						reject(
							(event.target as IDBRequest).error?.message ||
								'Unknown error'
						);
				});
			},
			'Failed to clear IndexedDB',
			'IDBManager.clear()'
		);
	}

	public async getItem<T>(key: string): Promise<T | null> {
		await this.ensureDBReady();

		return this.errors.handleAsync(
			async () => {
				const store = this.getTransaction('readonly');
				if (!store) throw new Error('IndexedDB is not initialized.');

				return await new Promise<T | null>((resolve, reject) => {
					const request = store.get(key);
					request.onsuccess = () =>
						resolve(request.result?.value ?? null);
					request.onerror = event =>
						reject(
							(event.target as IDBRequest).error?.message ||
								'Unknown error'
						);
				});
			},
			`Failed to retrieve item ${key} from IndexedDB`,
			'IDBManager.getItem()'
		);
	}

	public async setItem(key: string, value: unknown): Promise<void> {
		await this.errors.handleAsync(
			async () => {
				const store = this.getTransaction('readwrite');
				if (!store) throw new Error('IndexedDB is not initialized.');

				await new Promise<void>((resolve, reject) => {
					const request = store.put({ id: key, value });
					request.onsuccess = () => resolve();
					request.onerror = event =>
						reject(
							(event.target as IDBRequest).error?.message ||
								'Unknown error'
						);
				});
			},
			`Failed to store item ${key} in IndexedDB`,
			'IDBManager.setItem()'
		);
	}

	public async removeItem(key: string): Promise<void> {
		await this.errors.handleAsync(
			async () => {
				const store = this.getTransaction('readwrite');
				if (!store) throw new Error('IndexedDB is not initialized.');

				await new Promise<void>((resolve, reject) => {
					const request = store.delete(key);
					request.onsuccess = () => resolve();
					request.onerror = event =>
						reject(
							(event.target as IDBRequest).error?.message ||
								'Unknown error'
						);
				});
			},
			`Failed to remove item ${key} from IndexedDB`,
			'IDBManager.removeItem()'
		);
	}

	private getTransaction(mode: IDBTransactionMode): IDBObjectStore | void {
		return this.errors.handle(
			() => {
				if (!this.db) throw new Error('IndexedDB is not initialized.');
				const transaction = this.db.transaction(storeName, mode);
				return transaction.objectStore(storeName);
			},
			`Failed to get IndexedDB transaction (${mode})`,
			'IDBManager.getTransaction'
		);
	}
}
