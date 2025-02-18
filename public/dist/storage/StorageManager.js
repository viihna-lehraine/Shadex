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
        }, 'Failed to initialize StorageManager', 'StorageManager.constructor');
        this.log('info', 'Storage Manager initialized', 'StorageManager.constructor');
    }
    async init() {
        return this.errors.handleAsync(async () => {
            this.log('info', 'Initializing Storage Manager', 'StorageManager.init()');
            this.idbManager = IDBManager.getInstance(this.services);
            const idbAvailable = await this.idbManager.init();
            if (idbAvailable) {
                this.log('info', 'Using IndexedDB for storage.', 'StorageManager.init()');
                return true;
            }
            this.useLocalStorage = true;
            await this.localStorageManager.init();
            return true;
        }, 'StorageManager initialization failed', 'StorageManager.init()');
    }
    async clear() {
        await this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                const success = await this.idbManager.clear();
                if (success !== null)
                    return;
            }
            await this.localStorageManager.clear();
        }, 'Failed to clear storage', 'StorageManager.clear()');
    }
    async getItem(key) {
        return this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                const value = await this.idbManager.getItem(key);
                if (value !== null)
                    return value;
            }
            return await this.localStorageManager.getItem(key);
        }, `Failed to get item ${key} from storage`, 'StorageManager.getItem()', { key });
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
        }, `Failed to remove item ${key} from storage`, 'StorageManager.removeItem()', { key });
    }
    async setItem(key, value) {
        await this.errors.handleAsync(async () => {
            if (!this.useLocalStorage && this.idbManager) {
                await this.idbManager.ensureDBReady();
                await this.idbManager.setItem(key, value);
                return;
            }
            this.log('warn', `Falling back to LocalStorage for key: ${key}`, 'StorageManager.setItem()');
            await this.localStorageManager.setItem(key, value);
        }, `Failed to set item ${key} in storage`, 'StorageManager.setItem()', { key, value });
    }
}

export { StorageManager };
//# sourceMappingURL=StorageManager.js.map
