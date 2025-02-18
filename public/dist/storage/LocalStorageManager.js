// File: storage/LocalStorageManager.js
class LocalStorageManager {
    static instance = null;
    log;
    constructor(services) {
        this.log = services.log;
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
        localStorage.clear();
    }
    async getItem(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            this.log('error', `Failed to get item: ${key}`, 'LocalStorageManager.getItem()');
            return null;
        }
    }
    async removeItem(key) {
        localStorage.removeItem(key);
    }
    async setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            this.log('info', `Stored item: ${key}`, 'LocalStorageManager.setItem()');
        }
        catch (error) {
            this.log('error', `Failed to store item: ${key}`, 'LocalStorageManager.setItem()');
        }
    }
}

export { LocalStorageManager };
//# sourceMappingURL=LocalStorageManager.js.map
