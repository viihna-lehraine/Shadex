import { IDBManager } from './IDBManager.js';
import { LocalStorageManager } from './LocalStorageManager.js';

// File: storage/StorageManager.js
class StorageManager {
    idbManager = null;
    localStorageManager;
    services;
    log;
    useLocalStorage = false;
    constructor(services) {
        this.services = services;
        this.log = services.log;
        this.localStorageManager = LocalStorageManager.getInstance(this.services);
    }
    async init() {
        this.log('info', 'Initializing Storage Manager', 'StorageManager.init()');
        try {
            this.idbManager = IDBManager.getInstance(this.services);
            const idbAvailable = await this.idbManager.init();
            if (idbAvailable) {
                this.log('info', 'Using IndexedDB for storage.', 'StorageManager.init()');
                return true;
            }
        }
        catch (error) {
            this.log('warn', 'IndexedDB initialization failed, falling back to LocalStorage', 'StorageManager.init()');
        }
        this.useLocalStorage = true;
        await this.localStorageManager.init();
        return true;
    }
    async clear() {
        if (!this.useLocalStorage && this.idbManager) {
            try {
                await this.idbManager.clear();
                return;
            }
            catch (error) {
                this.log('warn', 'Failed to clear IndexedDB, falling back to LocalStorage', 'StorageManager.clear()');
            }
        }
        await this.localStorageManager.clear();
    }
    async getItem(key) {
        if (!this.useLocalStorage && this.idbManager) {
            try {
                const value = await this.idbManager.getItem(key);
                if (value !== null)
                    return value;
            }
            catch (error) {
                this.log('warn', `Failed to get item ${key} from IndexedDB, trying LocalStorage`, 'StorageManager.getItem()');
            }
        }
        return await this.localStorageManager.getItem(key);
    }
    async removeItem(key) {
        if (!this.useLocalStorage && this.idbManager) {
            try {
                await this.idbManager.removeItem(key);
                return;
            }
            catch (error) {
                this.log('error', `Failed to remove item ${key} from IndexedDB, trying LocalStorage`, 'StorageManager.removeItem()');
            }
        }
        await this.localStorageManager.removeItem(key);
    }
    async setItem(key, value) {
        if (!this.useLocalStorage && this.idbManager) {
            try {
                await this.idbManager.ensureDBReady();
                await this.idbManager.setItem(key, value);
                return;
            }
            catch (error) {
                this.log('error', `Failed to set item ${key} in IndexedDB, using LocalStorage`, 'StorageManager.setItem()');
            }
        }
        await this.localStorageManager.setItem(key, value);
    }
}

export { StorageManager };
//# sourceMappingURL=StorageManager.js.map
