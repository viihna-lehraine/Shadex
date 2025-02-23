import { config } from '../config/partials/base.js';
import { env } from '../config/partials/env.js';
import '../config/partials/defaults.js';
import '../config/partials/regex.js';

// File: storage/IDBManager.ts
const dbName = config.storage.idbDBName;
const defaultVerson = config.storage.idbDefaultVersion;
const idbRetryDelay = env.idb.retryDelay;
const storeName = config.storage.idbStoreName;
class IDBManager {
    static #instance = null;
    #defaultVersion;
    #version;
    #db = null;
    #log;
    #errors;
    constructor(services) {
        this.#defaultVersion = defaultVerson;
        this.#version = this.#defaultVersion;
        this.#log = services.log;
        this.#errors = services.errors;
    }
    static getInstance(services) {
        if (!IDBManager.#instance) {
            IDBManager.#instance = new IDBManager(services);
        }
        return IDBManager.#instance;
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            if (!window.indexedDB) {
                throw new Error('IndexedDB is not supported in this browser');
            }
            console.log('[IDBManager.init] Opening IndexedDB...');
            const request = indexedDB.open(dbName, this.#version);
            return await new Promise((resolve, reject) => {
                let upgradeComplete = false;
                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    this.#log(`Upgrading IndexedDB to version: ${this.#version}`, { caller: '[IDBManager.init]', level: 'warn' });
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
                    if (!upgradeComplete &&
                        request.result.version !== this.#version) {
                        this.#log('Waiting for upgrade to finish.', {
                            caller: '[IDBManager.init]',
                            level: 'warn'
                        });
                    }
                    this.#db = event.target.result;
                    this.#db.onversionchange = () => {
                        this.#db?.close();
                        this.#log('IndexedDB version changed. Closing database', {
                            caller: '[IDBManager.init]',
                            level: 'warn'
                        });
                    };
                    this.#log(`IndexedDB opened successfully`, {
                        caller: '[IDBManager.init]',
                        level: 'info'
                    });
                    resolve(true);
                };
                request.onerror = event => {
                    reject(event.target.error?.message ||
                        'Unknown IDBManager.init() error');
                };
                request.onblocked = () => {
                    this.#log(`[IDBManager.init] IndexedDB upgade blocked!`, {
                        caller: '[IDBManager.init]',
                        level: 'warn'
                    });
                    reject(`Upgrade blocked. Close other tabs using this database.`);
                };
            });
        }, 'Failed to initialize IndexedDB');
    }
    async clear() {
        return await this.#errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown IDBManager.clear() error');
            });
        }, 'Failed to clear IndexedDB');
    }
    async ensureDBReady() {
        while (!this.#db) {
            this.#log('Waiting for IndexedDB to initialize...', {
                caller: '[IDBManager.ensureDBReady]',
                level: 'warn'
            });
            // TODO: replace with a better solution??
            await new Promise(resolve => setTimeout(resolve, idbRetryDelay));
        }
    }
    async getItem(key) {
        await this.ensureDBReady();
        return this.#errors.handleAsync(async () => {
            const store = this.getTransaction('readonly');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            return await new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result?.value ?? null);
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown IDBManager.getItem() error');
            });
        }, `Failed to retrieve item ${key} from IndexedDB`);
    }
    async setItem(key, value) {
        return await this.#errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            await new Promise((resolve, reject) => {
                const request = store.put({ id: key, value });
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown IDBManager.setItem() error');
            });
        }, `Failed to store item ${key} in IndexedDB`);
    }
    async removeItem(key) {
        return await this.#errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
            if (!store)
                throw new Error('IndexedDB is not initialized.');
            await new Promise((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    'Unknown IDBManager.removeItem() error');
            });
        }, `Failed to remove item ${key} from IndexedDB`);
    }
    getTransaction(mode) {
        return this.#errors.handleSync(() => {
            if (!this.#db)
                throw new Error('IndexedDB is not initialized.');
            const transaction = this.#db.transaction(storeName, mode);
            return transaction.objectStore(storeName);
        }, `Failed to get IndexedDB transaction (${mode})`);
    }
}

export { IDBManager };
//# sourceMappingURL=IDBManager.js.map
