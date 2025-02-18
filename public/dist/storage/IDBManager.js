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
    errors;
    constructor(services) {
        this.defaultVersion = defaultVerson;
        this.version = this.defaultVersion;
        this.log = services.log;
        this.errors = services.errors;
    }
    static getInstance(services) {
        if (!IDBManager.instance) {
            IDBManager.instance = new IDBManager(services);
        }
        return IDBManager.instance;
    }
    async init() {
        return this.errors.handleAsync(async () => {
            if (!window.indexedDB) {
                throw new Error('IndexedDB is not supported in this browser');
            }
            console.log('[IDBManager.init] Opening IndexedDB...');
            const request = indexedDB.open(dbName, this.version);
            return await new Promise((resolve, reject) => {
                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        console.log(`[IDBManager.init] Created object store: ${storeName}`);
                    }
                };
                request.onsuccess = event => {
                    this.db = event.target.result;
                    this.db.onversionchange = () => {
                        this.db?.close();
                        this.log('warn', 'IndexedDB version changed, closing database', 'IDBManager.init()');
                    };
                    resolve(true);
                };
                request.onerror = event => {
                    reject(event.target.error?.message ||
                        'Unknown error');
                };
            });
        }, 'Failed to initialize IndexedDB', 'IDBManager.init()');
    }
    async ensureDBReady() {
        while (!this.db) {
            this.log('warn', 'Waiting for IndexedDB to initialize...', 'IDBManager.ensureDBReady()');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    async clear() {
        await this.errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown error');
            });
        }, 'Failed to clear IndexedDB', 'IDBManager.clear()');
    }
    async getItem(key) {
        await this.ensureDBReady();
        return this.errors.handleAsync(async () => {
            const store = this.getTransaction('readonly');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            return await new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result?.value ?? null);
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown error');
            });
        }, `Failed to retrieve item ${key} from IndexedDB`, 'IDBManager.getItem()');
    }
    async setItem(key, value) {
        await this.errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            await new Promise((resolve, reject) => {
                const request = store.put({ id: key, value });
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown error');
            });
        }, `Failed to store item ${key} in IndexedDB`, 'IDBManager.setItem()');
    }
    async removeItem(key) {
        await this.errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            await new Promise((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown error');
            });
        }, `Failed to remove item ${key} from IndexedDB`, 'IDBManager.removeItem()');
    }
    getTransaction(mode) {
        return this.errors.handle(() => {
            if (!this.db)
                throw new Error('IndexedDB is not initialized.');
            const transaction = this.db.transaction(storeName, mode);
            return transaction.objectStore(storeName);
        }, `Failed to get IndexedDB transaction (${mode})`, 'IDBManager.getTransaction');
    }
}

export { IDBManager };
//# sourceMappingURL=IDBManager.js.map
