import { IDBManager } from './IDBManager.js';
import { LocalStorageManager } from './LocalStorageManager.js';

// File: storage/StorageManager.js
class StorageManager {
    idbManager = null;
    localStorageManager;
    services;
    log;
    errors;
    useLocalStorage = false;
    constructor(services) {
        services.errors.handle(() => {
            this.services = services;
            this.log = services.log;
            this.errors = services.errors;
            this.localStorageManager = LocalStorageManager.getInstance(this.services);
        }, 'Failed to initialize StorageManager');
        this.log('Storage Manager initialized');
    }
    async init() {
        return this.errors.handleAsync(async () => {
            this.log('Initializing Storage Manager');
            this.idbManager = IDBManager.getInstance(this.services);
            const idbAvailable = await this.idbManager.init();
            if (idbAvailable) {
                this.log('Using IndexedDB for storage.');
                return true;
            }
            this.useLocalStorage = true;
            await this.localStorageManager.init();
            return true;
        }, 'StorageManager initialization failed');
    }
    async clear() {
        await this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                const success = await this.idbManager.clear();
                if (success !== null)
                    return;
            }
            await this.localStorageManager.clear();
        }, 'Failed to clear storage');
    }
    async getItem(key) {
        return this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                const value = await this.idbManager.getItem(key);
                if (value !== null)
                    return value;
            }
            return await this.localStorageManager.getItem(key);
        }, `Failed to get item ${key} from storage`, { key });
    }
    async removeItem(key) {
        await this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                try {
                    await this.idbManager.removeItem(key);
                    return;
                }
                catch { }
            }
            await this.localStorageManager.removeItem(key);
        }, `Failed to remove item ${key} from storage`, { key });
    }
    async setItem(key, value) {
        await this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                await this.idbManager.ensureDBReady();
                await this.idbManager.setItem(key, value);
                return;
            }
            this.log(`Falling back to LocalStorage for key: ${key}`, 'warn');
            await this.localStorageManager.setItem(key, value);
        }, `Failed to set item ${key} in storage`, { key, value });
    }
}

export { StorageManager };
//# sourceMappingURL=StorageManager.js.map
