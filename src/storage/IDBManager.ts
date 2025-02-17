// File: storage/IDBManager.js

import { ServicesInterface } from '../types/index.js';

export class IDBManager {
	private dbName: string;
	private storeName: string;
	private version: number;
	private db: IDBDatabase | null = null;
	private log: ServicesInterface['app']['log'];

	constructor(
		dbName: string,
		storeName: string,
		version: number,
		services: ServicesInterface
	) {
		this.dbName = dbName;
		this.storeName = storeName;
		this.version = version;
		this.log = services.app.log;
	}

	public async init(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (!window.indexedDB) {
				this.log(
					'warn',
					'IndexedDB is not supported in this browser',
					'IDBManager.init()',
					2
				);
				reject(new Error('IndexedDB is not supported'));
				return resolve(false);
			}

			const request = indexedDB.open(this.dbName, this.version);

			request.onupgradeneeded = event => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName, {
						keyPath: 'id',
						autoIncrement: true
					});
					this.log(
						'info',
						`Created object store: ${this.storeName}`,
						'IDBManager.init()',
						3
					);
				}
			};

			request.onsuccess = event => {
				this.db = (event.target as IDBOpenDBRequest).result;
				this.log(
					'info',
					'IndexedDB initialized successfully',
					'IDBManager.init()',
					2
				);
			};

			request.onerror = event => {
				this.log(
					'error',
					`IndexedDB failed to initialize: ${(event.target as IDBOpenDBRequest).error}`,
					'IDBManager.init()',
					2
				);
				resolve(false);
			};
		});
	}

	public async clear(): Promise<void> {
		return new Promise((resolve, reject) => {
			const store = this.getTransaction('readwrite');
			if (!store) return reject('IndexedDB is not initialized.');

			const request = store.clear();

			request.onsuccess = () => resolve();
			request.onerror = () => reject();
		});
	}

	public async getItem<T>(key: string): Promise<T | null> {
		return new Promise((resolve, reject) => {
			const store = this.getTransaction('readonly');
			if (!store) return reject('IndexedDB is not initialized.');

			const request = store.get(key);

			request.onsuccess = () => resolve(request.result?.value ?? null);
			request.onerror = () => reject(null);
		});
	}

	public getTransaction(mode: IDBTransactionMode): IDBObjectStore | null {
		if (!this.db) return null;
		const transaction = this.db.transaction(this.storeName, mode);
		return transaction.objectStore(this.storeName);
	}

	public async removeItem(key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const store = this.getTransaction('readwrite');
			if (!store) return reject('IndexedDB is not initialized.');

			const request = store.delete(key);

			request.onsuccess = () => resolve();
			request.onerror = () => reject();
		});
	}

	public async setItem(key: string, value: unknown): Promise<void> {
		return new Promise((resolve, reject) => {
			const store = this.getTransaction('readwrite');
			if (!store) return reject('IndexedDB is not initialized.');

			const request = store.put({ id: key, value });

			request.onsuccess = () => {
				this.log(
					'info',
					`Stoed item: ${key} in IndexedDB`,
					'IDBManager.setItem()',
					3
				);
				resolve();
			};

			request.onerror = event => {
				this.log(
					'error',
					`Failed to store item: ${key}`,
					'IDBManager.setItem()'
				);
				reject(event);
			};
		});
	}
}
