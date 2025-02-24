import { IDBManager } from './IDBManager.js';
import { LocalStorageManager } from './LocalStorageManager.js';

// File: storage/StorageManager.ts
const caller = 'StorageManager';
class StorageManager {
    #idbManager = null;
    #localStorageManager;
    #useLocalStorage = false;
    #services;
    #errors;
    #log;
    constructor(services) {
        try {
            this.#services = services;
            this.#log = services.log;
            this.#errors = services.errors;
            this.#localStorageManager = LocalStorageManager.getInstance(this.#services);
            this.#log('Storage Manager initialized', {
                caller: `${caller}.constructor`
            });
        }
        catch (error) {
            throw new Error(`[${caller}.constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            this.#log('Initializing Storage Manager.', {
                caller: `[${caller}.init]`
            });
            this.#idbManager = await IDBManager.getInstance(this.#services);
            const idbAvailable = await this.#idbManager.init();
            if (idbAvailable) {
                this.#log('Using IndexedDB for storage!', {
                    caller: `${caller}.init`
                });
                return true;
            }
            this.#useLocalStorage = true;
            await this.#localStorageManager.init();
            return true;
        }, `[${caller}]: Initialization failed`);
    }
    async clear() {
        return await this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbManager) {
                const success = await this.#idbManager.clear();
                if (success !== null)
                    return;
            }
            await this.#localStorageManager.clear();
        }, `[${caller}]: Failed to clear storage.`);
    }
    async getItem(key) {
        return this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbManager) {
                const value = await this.#idbManager.getItem(key);
                if (value !== null)
                    return value;
            }
            return await this.#localStorageManager.getItem(key);
        }, `[${caller}]: Failed to get item ${key} from storage`, { context: { key } });
    }
    async removeItem(key) {
        return await this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbManager) {
                try {
                    await this.#idbManager.removeItem(key);
                    return;
                }
                catch { }
            }
            await this.#localStorageManager.removeItem(key);
        }, `[${caller}]: Failed to remove item ${key} from storage`, { context: { key } });
    }
    async setItem(key, value) {
        return await this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbManager) {
                await this.#idbManager.ensureDBReady();
                await this.#idbManager.setItem(key, value);
                return;
            }
            this.#log(`Falling back to LocalStorage for key: ${key}`, {
                caller: `${caller}.setItem`,
                level: 'warn'
            });
            await this.#localStorageManager.setItem(key, value);
        }, `[${caller}]: Failed to set item ${key} in storage`, { context: { key, value } });
    }
}

export { StorageManager };
//# sourceMappingURL=StorageManager.js.map
