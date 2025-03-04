import { IDBStorageService } from './IDBStorageService.js';
import { LocalStorageService } from './LocalStorageService.js';

const caller = 'StorageManager';
class StorageManager {
    static #instance = null;
    #idbStorageService = null;
    #localStorageService;
    #useLocalStorage = false;
    #services;
    #errors;
    #log;
    constructor(services) {
        try {
            this.#services = services;
            this.#log = services.log;
            this.#errors = services.errors;
            this.#localStorageService = LocalStorageService.getInstance(this.#services);
            this.init();
            this.#log.info(`${caller} initialized.`, `${caller}.constructor`);
        }
        catch (error) {
            throw new Error(`[${caller}.constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static async getInstance(services) {
        return services.errors.handleAsync(async () => {
            if (!StorageManager.#instance) {
                services.log.debug(`Creating StorageManager instance.`, `${caller}.getInstance`);
                StorageManager.#instance = new StorageManager(services);
            }
            return StorageManager.#instance;
        }, `[${caller}.getInstance]: Failed to create StorageManager instance.`);
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            this.#log.info('Initializing Storage Manager.', `${caller}.init`);
            this.#idbStorageService = await IDBStorageService.getInstance(this.#services);
            const idbAvailable = await this.#idbStorageService.init();
            if (!idbAvailable) {
                this.#log.warn('IndexedDB is unavailable. Falling back to LocalStorage.', `${caller}.init`);
                this.#useLocalStorage = true;
                await this.#localStorageService.init();
                return false;
            }
            this.#log.info('Using IndexedDB for storage.', `${caller}.init`);
            return true;
        }, `[${caller}]: Initialization failed`);
    }
    async clear() {
        return await this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbStorageService) {
                const success = await this.#idbStorageService.clear();
                if (success !== null)
                    return;
            }
            await this.#localStorageService.clear();
        }, `[${caller}]: Failed to clear storage.`);
    }
    async getItem(key) {
        return this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbStorageService) {
                const value = await this.#idbStorageService.getItem(key);
                if (value !== null)
                    return value;
            }
            return await this.#localStorageService.getItem(key);
        }, `[${caller}]: Failed to get item ${key} from storage`, { context: { key } });
    }
    async removeItem(key) {
        return await this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbStorageService) {
                try {
                    await this.#idbStorageService.removeItem(key);
                    return;
                }
                catch { }
            }
            await this.#localStorageService.removeItem(key);
        }, `[${caller}]: Failed to remove item ${key} from storage`, { context: { key } });
    }
    async setItem(key, value) {
        return await this.#errors.handleAsync(async () => {
            if (!this.#useLocalStorage && this.#idbStorageService) {
                await this.#idbStorageService.ensureDBReady();
                await this.#idbStorageService.setItem(key, value);
                return;
            }
            this.#log.warn(`Falling back to LocalStorage for key: ${key}`, `${caller}.setItem`);
            await this.#localStorageService.setItem(key, value);
        }, `[${caller}]: Failed to set item ${key} in storage`, { context: { key, value } });
    }
}

export { StorageManager };
//# sourceMappingURL=StorageManager.js.map
