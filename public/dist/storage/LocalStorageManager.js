// File: storage/LocalStorageManager.js
class LocalStorageManager {
    static instance = null;
    log;
    errors;
    constructor(services) {
        this.log = services.log;
        this.errors = services.errors;
    }
    static getInstance(services) {
        if (!LocalStorageManager.instance) {
            LocalStorageManager.instance = new LocalStorageManager(services);
        }
        return LocalStorageManager.instance;
    }
    async init() {
        this.log('warn', 'Using LocalStorage as a fallback.', 'LocalStorageManager.init()', 2);
        return true;
    }
    async clear() {
        await this.errors.handleAsync(async () => localStorage.clear(), 'Failed to clear LocalStorage', 'LocalStorageManager.clear()');
    }
    async getItem(key) {
        return this.errors.handleAsync(async () => {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }, `Failed to get item ${key} from LocalStorage`, 'LocalStorageManager.getItem()');
    }
    async removeItem(key) {
        await this.errors.handleAsync(async () => localStorage.removeItem(key), `Failed to remove item ${key} from LocalStorage`, 'LocalStorageManager.removeItem()');
    }
    async setItem(key, value) {
        await this.errors.handleAsync(async () => {
            localStorage.setItem(key, JSON.stringify(value));
            this.log('info', `Stored item: ${key}`, 'LocalStorageManager.setItem()');
        }, `Failed to store item ${key} in LocalStorage`, 'LocalStorageManager.setItem()');
    }
}

export { LocalStorageManager };
//# sourceMappingURL=LocalStorageManager.js.map
