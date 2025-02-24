// File: storage/LocalStorageManager.ts
const caller = 'LocalStorageManager';
class LocalStorageManager {
    static #instance = null;
    #errors;
    #log;
    constructor(services) {
        try {
            services.log('Constructing LocalStorageManager instance', {
                caller: `${caller}.constructor`
            });
            this.#errors = services.errors;
            this.#log = services.log;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(services) {
        return services.errors.handleSync(() => {
            if (!LocalStorageManager.#instance) {
                services.log('No LocalStorageManager instance exists yet. Creating new instance.', {
                    caller: `${caller}.getInstance`,
                    level: 'debug'
                });
                LocalStorageManager.#instance = new LocalStorageManager(services);
            }
            services.log('Returning existing LocalStorageManager instance.', {
                caller: `${caller}.getInstance`,
                level: 'debug'
            });
            return LocalStorageManager.#instance;
        }, `[${caller}]: Failed to create LocalStorageManager instance.`);
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            this.#log('Using LocalStorage as storage fallback.', {
                caller: `${caller}.init`,
                level: 'warn'
            });
            return true;
        }, `[${caller}.init]: Failed to initialize LocalStorage`);
    }
    async clear() {
        return await this.#errors.handleAsync(async () => localStorage.clear(), `[${caller}]: Failed to clear LocalStorage.`);
    }
    async getItem(key) {
        return this.#errors.handleAsync(async () => {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }, `[${caller}]: Failed to get item ${key} from LocalStorage.`);
    }
    async removeItem(key) {
        return await this.#errors.handleAsync(async () => localStorage.removeItem(key), `[${caller}]: Failed to remove item ${key} from LocalStorage.`);
    }
    async setItem(key, value) {
        return await this.#errors.handleAsync(async () => {
            localStorage.setItem(key, JSON.stringify(value));
            this.#log(`Stored item: ${key}`, {
                caller: `${caller}.setItem`,
                level: 'debug'
            });
        }, `Failed to store item ${key} in LocalStorage`);
    }
}

export { LocalStorageManager };
//# sourceMappingURL=LocalStorageManager.js.map
