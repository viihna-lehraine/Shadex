import { config } from '../config/partials/base.js';
import { env } from '../config/partials/env.js';
import '../config/partials/defaults.js';
import '../config/partials/regex.js';

// File: storage/IDBStorageService.ts
const caller = 'IDBStorageService';
const dbName = config.storage.idbDBName;
const defaultVerson = config.storage.idbDefaultVersion;
const idbRetryDelay = env.idb.retryDelay;
const maxReadyAttempts = env.idb.maxReadyAttempts;
const storeName = config.storage.idbStoreName;
class IDBStorageService {
    static #instance = null;
    #defaultVersion;
    #version;
    #db = null;
    #isEnsuringDBReady = false;
    #errors;
    #log;
    constructor(services) {
        try {
            services.log.info(`Constructing ${caller} instance.`, `${caller} constructor`);
            this.#defaultVersion = defaultVerson;
            this.#version = this.#defaultVersion;
            this.#errors = services.errors;
            this.#log = services.log;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static async getInstance(services) {
        return services.errors.handleSync(() => {
            if (!IDBStorageService.#instance) {
                services.log.debug(`No ${caller} instance exists yet. Creating new instance.`, `${caller}.getInstance`);
                IDBStorageService.#instance = new IDBStorageService(services);
            }
            services.log.debug(`Returning existing ${caller} instance.`, `${caller}.getInstance`);
            return IDBStorageService.#instance;
        }, `[${caller}]: Failed to create IDBManager instance.`);
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            if (!window.indexedDB) {
                throw new Error('IndexedDB is not supported in this browser');
            }
            this.#log.info(`Opening IndexedDB...`, `${caller}.init`);
            return await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, this.#version);
                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    this.#log.warn(`Upgrading IndexedDB to version: ${this.#version}`, `${caller}.init`);
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        this.#log.info(`Created object store: ${storeName}`, `${caller}.init`);
                    }
                };
                request.onsuccess = event => {
                    this.#db = event.target.result;
                    this.#db.onversionchange = () => {
                        this.#db?.close();
                        this.#log.warn('IndexedDB version changed. Closing database', `${caller}.init`);
                    };
                    this.#log.info(`IndexedDB opened successfully`, `${caller}.init`);
                    resolve(true);
                };
                request.onerror = event => {
                    this.#log.error(`[${caller}]: IndexedDB error: ${event.target.error?.message || 'Unknown error'}`, `${caller}.init`);
                    reject(event.target.error?.message ||
                        `Unknown ${caller}.init error.`);
                };
                request.onblocked = () => {
                    this.#log.warn(`IndexedDB upgade blocked!`, `${caller}.init`);
                    reject(`Upgrade blocked. Close other tabs using this database.`);
                };
            });
        }, `[${caller}]: Failed to initialize IndexedDB`);
    }
    async clear() {
        return await this.#errors.handleAsync(async () => {
            const store = await this.#getTransaction('readwrite');
            if (!store)
                throw new Error(`${caller} is not initialized.`);
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    `Unknown ${caller}.clear error`);
            });
        }, `[${caller}]: Failed to clear IndexedDB.`);
    }
    async ensureDBReady() {
        return await this.#errors.handleAsync(async () => {
            if (this.#db)
                return; // already initialized
            if (this.#isEnsuringDBReady) {
                // if another process is already ensuring readiness, wait for it
                let attempts = 0;
                while (!this.#db && attempts < maxReadyAttempts) {
                    this.#log.warn(`[IDBStorageService] Waiting for DB to be ready (Attempt ${attempts + 1})`, `${caller}.ensureDBReady`);
                    await new Promise(res => setTimeout(res, idbRetryDelay));
                    attempts++;
                }
                if (!this.#db)
                    throw new Error(`[IDBStorageService]: DB never became ready.`);
                return;
            }
            // first process to trigger ensureDBReady takes responsibility for init
            this.#isEnsuringDBReady = true;
            try {
                await this.init();
            }
            catch (error) {
                throw new Error(`[IDBStorageService]: Failed to initialize: ${error}`);
            }
            finally {
                this.#isEnsuringDBReady = false;
            }
        }, `[${caller}]: Failed to ensure IndexedDB is ready`);
    }
    async getItem(key) {
        await this.ensureDBReady();
        return this.#errors.handleAsync(async () => {
            const store = await this.#getTransaction('readonly');
            if (!store)
                throw new Error(`${caller} is not initialized.`);
            return await new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result?.value ?? null);
                request.onerror = event => reject(event.target.error?.message ||
                    `Unknown ${caller}.getItem() error`);
            });
        }, `[${caller}]: Failed to retrieve item ${key} from IndexedDB`);
    }
    async setItem(key, value) {
        return await this.#errors.handleAsync(async () => {
            const store = await this.#getTransaction('readwrite');
            if (!store)
                throw new Error(`${caller} is not initialized.`);
            await new Promise((resolve, reject) => {
                const request = store.put({ id: key, value });
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    `Unknown ${caller}.setItem error`);
            });
        }, `[${caller}]: Failed to store item ${key} in IndexedDB`);
    }
    async removeItem(key) {
        return await this.#errors.handleAsync(async () => {
            const store = await this.#getTransaction('readwrite');
            if (!store)
                throw new Error(`${caller} is not initialized.`);
            await new Promise((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error?.message ||
                    `Unknown ${caller}.removeItem error.`);
            });
        }, `[${caller}]: Failed to remove item ${key} from IndexedDB`);
    }
    async #getTransaction(mode) {
        return await this.#errors.handleAsync(async () => {
            await this.ensureDBReady();
            if (!this.#db) {
                throw new Error(`${caller} is still uninitialized after ensureDBReady.`);
            }
            try {
                const transaction = this.#db.transaction(storeName, mode);
                return transaction.objectStore(storeName);
            }
            catch (error) {
                throw new Error(`[${caller}]: Failed to get IndexedDB transaction (${mode})`);
            }
        }, `[${caller}]: Failed to get IndexedDB transaction (${mode})`);
    }
}

export { IDBStorageService };
//# sourceMappingURL=IDBStorageService.js.map
