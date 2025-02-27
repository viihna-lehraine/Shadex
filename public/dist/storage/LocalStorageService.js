// File: storage/LocalStorageService.ts
const caller = 'LocalStorageService';
class LocalStorageService {
    static #instance = null;
    #errors;
    #log;
    constructor(services) {
        try {
            services.log.info(`Constructing ${caller} instance.`, `${caller}.constructor`);
            this.#errors = services.errors;
            this.#log = services.log;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(services) {
        return services.errors.handleSync(() => {
            if (!LocalStorageService.#instance) {
                services.log.debug(`No ${caller} instance exists yet. Creating new instance.`, `${caller}.getInstance`);
                LocalStorageService.#instance = new LocalStorageService(services);
            }
            services.log.debug('Returning LocalStorageManager instance.', `${caller}.getInstance`);
            return LocalStorageService.#instance;
        }, `[${caller}]: Failed to create LocalStorageManager instance.`);
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            this.#log.warn('Using LocalStorage as storage fallback.', `${caller}.init`);
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
            this.#log.debug(`Stored item: ${key}`, `${caller}.setItem`);
        }, `Failed to store item ${key} in LocalStorage`);
    }
}

export { LocalStorageService };
//# sourceMappingURL=LocalStorageService.js.map
