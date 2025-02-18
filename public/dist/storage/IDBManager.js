import { data } from '../data/index.js';

// File: storage/IDBManager.js
const dbName = data.storage.idb.dbName;
const defaultVerson = data.storage.idb.defaultVersion;
const storeName = data.storage.idb.storeName;
class IDBManager {
    static instance = null;
    defaultVersion;
    version;
    db = null;
    log;
    constructor(services) {
        this.defaultVersion = defaultVerson;
        this.version = this.defaultVersion;
        this.log = services.log;
    }
    static getInstance(services) {
        if (!IDBManager.instance) {
            IDBManager.instance = new IDBManager(services);
        }
        return IDBManager.instance;
    }
    async init() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                this.log('warn', 'IndexedDB is not supported in this browser', 'IDBManager.init()', 2);
                reject(new Error('IndexedDB is not supported'));
                return resolve(false);
            }
            console.log('[IDBManager.init] Opening IndexedDB...');
            const request = indexedDB.open(dbName, this.version);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                console.log(`[IDBManager.init] Upgrading database to version ${this.version}`);
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    console.log(`[IDBManager.init] Created object store: ${storeName}`);
                    this.log('info', `Created object store: ${storeName}`, 'IDBManager.init()', 3);
                }
            };
            request.onsuccess = event => {
                this.db = event.target.result;
                this.db.onversionchange = () => {
                    this.db?.close();
                    this.log('warn', 'IndexedDB version changed, closing database', 'IDBManager.init()');
                };
                if (this.db) {
                    this.log('info', 'IndexedDB initialized successfully', 'IDBManager.init()', 2);
                    resolve(true);
                }
                else {
                    this.log('error', 'IndexedDB opened but db object is null', 'IDBManager.init()');
                    reject(new Error('IndexedDB opened but db object is null'));
                }
            };
            request.onerror = event => {
                const errorMessage = event.target.error?.message ||
                    'Unknown error';
                console.error(`[IDBManager.init] IndexedDB failed: ${errorMessage}`);
                this.log('error', `IndexedDB failed to initialize: ${errorMessage}`, 'IDBManager.init()', 2);
                resolve(false);
            };
        });
    }
    async clear() {
        return new Promise((resolve, reject) => {
            const store = this.getTransaction('readwrite');
            if (!store)
                return reject('IndexedDB is not initialized.');
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }
    async ensureDBReady() {
        while (!this.db) {
            this.log('warn', 'Waiting for IndexedDB to initialize...', 'IDBManager.ensureDBReady()');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    async getItem(key) {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const store = this.getTransaction('readonly');
            if (!store) {
                this.log('error', 'IndexedDB transaction failed: Database is not initialized.', 'IDBManager.getItem()');
                return reject(new Error('IndexedDB is not initialized.'));
            }
            const request = store.get(key);
            request.onsuccess = () => {
                console.log(`[IDBManager.getItem] Retrieved item: ${key}`);
                resolve(request.result?.value ?? null);
            };
            request.onerror = event => {
                const errorMessage = event.target.error?.message ||
                    'Unknown error';
                console.error(`[IDBManager.getItem] Failed to retrieve ${key}: ${errorMessage}`);
                this.log('error', `Failed to retrieve item: ${key} - ${errorMessage}`, 'IDBManager.getItem()');
                reject(null);
            };
        });
    }
    getTransaction(mode) {
        if (!this.db)
            return null;
        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }
    async removeItem(key) {
        return new Promise((resolve, reject) => {
            const store = this.getTransaction('readwrite');
            if (!store)
                return reject('IndexedDB is not initialized.');
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }
    async setItem(key, value) {
        return new Promise((resolve, reject) => {
            const store = this.getTransaction('readwrite');
            if (!store) {
                this.log('error', 'IndexedDB transaction failed: Database is not initialized.', 'IDBManager.setItem()');
                return reject(new Error('IndexedDB is not initialized.'));
            }
            const request = store.put({ id: key, value });
            request.onsuccess = () => {
                console.log(`[IDBManager.setItem] Stored item: ${key}`);
                resolve();
            };
            request.onerror = event => {
                const errorMessage = event.target.error?.message ||
                    'Unknown error';
                console.error(`[IDBManager.setItem] Failed to store ${key}: ${errorMessage}`);
                this.log('error', `Failed to store item: ${key} - ${errorMessage}`, 'IDBManager.setItem()');
                reject(event);
            };
        });
    }
}

export { IDBManager };
//# sourceMappingURL=IDBManager.js.map
