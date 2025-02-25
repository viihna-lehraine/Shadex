// File: storage/IDBStorageService.ts
import { config, env } from '../config/index.js';
const caller = 'IDBStorageService';
const dbName = config.storage.idbDBName;
const defaultVerson = config.storage.idbDefaultVersion;
const idbRetryDelay = env.idb.retryDelay;
const storeName = config.storage.idbStoreName;
export class IDBStorageService {
    static #instance = null;
    #defaultVersion;
    #version;
    #db = null;
    #errors;
    #log;
    constructor(services) {
        try {
            services.log(`Constructing ${caller} instance.`, {
                caller: `${caller} constructor`
            });
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
                services.log(`No ${caller} instance exists yet. Creating new instance.`, {
                    caller: `${caller}.getInstance`,
                    level: 'debug'
                });
                IDBStorageService.#instance = new IDBStorageService(services);
            }
            services.log(`Returning existing ${caller} instance.`, {
                caller: `${caller}.getInstance`,
                level: 'debug'
            });
            return IDBStorageService.#instance;
        }, `[${caller}]: Failed to create IDBManager instance.`);
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            if (!window.indexedDB) {
                throw new Error('IndexedDB is not supported in this browser');
            }
            this.#log(`Opening IndexedDB...`, {
                caller: `${caller}.init`
            });
            const request = indexedDB.open(dbName, this.#version);
            return await new Promise((resolve, reject) => {
                let upgradeComplete = false;
                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    this.#log(`Upgrading IndexedDB to version: ${this.#version}`, { caller: `${caller}.init`, level: 'warn' });
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        this.#log(`Created object store: ${storeName}`, {
                            caller: `${caller}.init`
                        });
                    }
                    upgradeComplete = true;
                };
                request.onsuccess = event => {
                    if (!upgradeComplete &&
                        request.result.version !== this.#version) {
                        this.#log('Waiting for upgrade to finish.', {
                            caller: `${caller}.init`,
                            level: 'warn'
                        });
                    }
                    this.#db = event.target.result;
                    this.#db.onversionchange = () => {
                        this.#db?.close();
                        this.#log('IndexedDB version changed. Closing database', {
                            caller: `${caller}.init`,
                            level: 'warn'
                        });
                    };
                    this.#log(`IndexedDB opened successfully`, {
                        caller: `${caller}.init`
                    });
                    resolve(true);
                };
                request.onerror = event => {
                    reject(event.target.error?.message ||
                        `Unknown ${caller}.init error.`);
                };
                request.onblocked = () => {
                    this.#log(`IndexedDB upgade blocked!`, {
                        caller: `${caller}.init`,
                        level: 'warn'
                    });
                    reject(`Upgrade blocked. Close other tabs using this database.`);
                };
            });
        }, `[${caller}]: Failed to initialize IndexedDB`);
    }
    async clear() {
        return await this.#errors.handleAsync(async () => {
            const store = this.getTransaction('readwrite');
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
        this.#errors.handleAsync(async () => {
            while (!this.#db) {
                this.#log(`Waiting for ${caller} to initialize...`, {
                    caller: `${caller}.ensureDBReady`,
                    level: 'warn'
                });
                // TODO: replace with a better solution??
                await new Promise(resolve => setTimeout(resolve, idbRetryDelay));
            }
        }, `[${caller}]: Failed to ensure IndexedDB is ready`);
    }
    async getItem(key) {
        await this.ensureDBReady();
        return this.#errors.handleAsync(async () => {
            const store = this.getTransaction('readonly');
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
            const store = this.getTransaction('readwrite');
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
            const store = this.getTransaction('readwrite');
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
    getTransaction(mode) {
        return this.#errors.handleSync(() => {
            if (!this.#db)
                throw new Error(`${caller} is not initialized.`);
            const transaction = this.#db.transaction(storeName, mode);
            return transaction.objectStore(storeName);
        }, `[${caller}]: Failed to get IndexedDB transaction (${mode})`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RvcmFnZS9JREJTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFHckMsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVqRCxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUNuQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUN4QyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0FBQ3ZELE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBQ3pDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBRTlDLE1BQU0sT0FBTyxpQkFBaUI7SUFDN0IsTUFBTSxDQUFDLFNBQVMsR0FBNkIsSUFBSSxDQUFDO0lBRWxELGVBQWUsQ0FBUztJQUN4QixRQUFRLENBQVM7SUFDakIsR0FBRyxHQUF1QixJQUFJLENBQUM7SUFFL0IsT0FBTyxDQUFxQjtJQUM1QixJQUFJLENBQWtCO0lBRXRCLFlBQW9CLFFBQWtCO1FBQ3JDLElBQUksQ0FBQztZQUNKLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLE1BQU0sWUFBWSxFQUFFO2dCQUNoRCxNQUFNLEVBQUUsR0FBRyxNQUFNLGNBQWM7YUFDL0IsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7WUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFD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LEVBQUUsQ0FBQztnQkFFcEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUN6QixNQUFNLENBQ0osS0FBSyxDQUFDLE1BQXFCLENBQUMsS0FBSyxFQUFFLE9BQU87b0JBQzFDLFdBQVcsTUFBTSxvQkFBb0IsQ0FDdEMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxFQUFFLElBQUksTUFBTSw0QkFBNEIsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTyxjQUFjLENBQUMsSUFBd0I7UUFDOUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxNQUFNLHNCQUFzQixDQUFDLENBQUM7WUFFaEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTFELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxDQUFDLEVBQUUsSUFBSSxNQUFNLDJDQUEyQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2xFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzdG9yYWdlL0lEQlN0b3JhZ2VTZXJ2aWNlLnRzXG5cbmltcG9ydCB7IElEQlN0b3JhZ2VDb250cmFjdCwgU2VydmljZXMgfSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWcsIGVudiB9IGZyb20gJy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNhbGxlciA9ICdJREJTdG9yYWdlU2VydmljZSc7XG5jb25zdCBkYk5hbWUgPSBjb25maWcuc3RvcmFnZS5pZGJEQk5hbWU7XG5jb25zdCBkZWZhdWx0VmVyc29uID0gY29uZmlnLnN0b3JhZ2UuaWRiRGVmYXVsdFZlcnNpb247XG5jb25zdCBpZGJSZXRyeURlbGF5ID0gZW52LmlkYi5yZXRyeURlbGF5O1xuY29uc3Qgc3RvcmVOYW1lID0gY29uZmlnLnN0b3JhZ2UuaWRiU3RvcmVOYW1lO1xuXG5leHBvcnQgY2xhc3MgSURCU3RvcmFnZVNlcnZpY2UgaW1wbGVtZW50cyBJREJTdG9yYWdlQ29udHJhY3Qge1xuXHRzdGF0aWMgI2luc3RhbmNlOiBJREJTdG9yYWdlU2VydmljZSB8IG51bGwgPSBudWxsO1xuXG5cdCNkZWZhdWx0VmVyc2lvbjogbnVtYmVyO1xuXHQjdmVyc2lvbjogbnVtYmVyO1xuXHQjZGI6IElEQkRhdGFiYXNlIHwgbnVsbCA9IG51bGw7XG5cblx0I2Vycm9yczogU2VydmljZXNbJ2Vycm9ycyddO1xuXHQjbG9nOiBTZXJ2aWNlc1snbG9nJ107XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3RvcihzZXJ2aWNlczogU2VydmljZXMpIHtcblx0XHR0cnkge1xuXHRcdFx0c2VydmljZXMubG9nKGBDb25zdHJ1Y3RpbmcgJHtjYWxsZXJ9IGluc3RhbmNlLmAsIHtcblx0XHRcdFx0Y2FsbGVyOiBgJHtjYWxsZXJ9IGNvbnN0cnVjdG9yYFxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI2RlZmF1bHRWZXJzaW9uID0gZGVmYXVsdFZlcnNvbjtcblx0XHRcdHRoaXMuI3ZlcnNpb24gPSB0aGlzLiNkZWZhdWx0VmVyc2lvbjtcblx0XHRcdHRoaXMuI2Vycm9ycyA9IHNlcnZpY2VzLmVycm9ycztcblx0XHRcdHRoaXMuI2xvZyA9IHNlcnZpY2VzLmxvZztcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgWyR7Y2FsbGVyfSBjb25zdHJ1Y3Rvcl06ICR7XG5cdFx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvclxuXHRcdFx0XHR9YFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgYXN5bmMgZ2V0SW5zdGFuY2Uoc2VydmljZXM6IFNlcnZpY2VzKTogUHJvbWlzZTxJREJTdG9yYWdlU2VydmljZT4ge1xuXHRcdHJldHVybiBzZXJ2aWNlcy5lcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIUlEQlN0b3JhZ2VTZXJ2aWNlLiNpbnN0YW5jZSkge1xuXHRcdFx0XHRzZXJ2aWNlcy5sb2coXG5cdFx0XHRcdFx0YE5vICR7Y2FsbGVyfSBpbnN0YW5jZSBleGlzdHMgeWV0LiBDcmVhdGluZyBuZXcgaW5zdGFuY2UuYCxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uZ2V0SW5zdGFuY2VgLFxuXHRcdFx0XHRcdFx0bGV2ZWw6ICdkZWJ1Zydcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0SURCU3RvcmFnZVNlcnZpY2UuI2luc3RhbmNlID0gbmV3IElEQlN0b3JhZ2VTZXJ2aWNlKHNlcnZpY2VzKTtcblx0XHRcdH1cblxuXHRcdFx0c2VydmljZXMubG9nKGBSZXR1cm5pbmcgZXhpc3RpbmcgJHtjYWxsZXJ9IGluc3RhbmNlLmAsIHtcblx0XHRcdFx0Y2FsbGVyOiBgJHtjYWxsZXJ9LmdldEluc3RhbmNlYCxcblx0XHRcdFx0bGV2ZWw6ICdkZWJ1Zydcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gSURCU3RvcmFnZVNlcnZpY2UuI2luc3RhbmNlO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGNyZWF0ZSBJREJNYW5hZ2VyIGluc3RhbmNlLmApO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghd2luZG93LmluZGV4ZWREQikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luZGV4ZWREQiBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNsb2coYE9wZW5pbmcgSW5kZXhlZERCLi4uYCwge1xuXHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uaW5pdGBcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lLCB0aGlzLiN2ZXJzaW9uKTtcblxuXHRcdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0bGV0IHVwZ3JhZGVDb21wbGV0ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZXZlbnQgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGRiID0gKGV2ZW50LnRhcmdldCBhcyBJREJPcGVuREJSZXF1ZXN0KS5yZXN1bHQ7XG5cblx0XHRcdFx0XHR0aGlzLiNsb2coXG5cdFx0XHRcdFx0XHRgVXBncmFkaW5nIEluZGV4ZWREQiB0byB2ZXJzaW9uOiAke3RoaXMuI3ZlcnNpb259YCxcblx0XHRcdFx0XHRcdHsgY2FsbGVyOiBgJHtjYWxsZXJ9LmluaXRgLCBsZXZlbDogJ3dhcm4nIH1cblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHN0b3JlTmFtZSkpIHtcblx0XHRcdFx0XHRcdGRiLmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSwge1xuXHRcdFx0XHRcdFx0XHRrZXlQYXRoOiAnaWQnLFxuXHRcdFx0XHRcdFx0XHRhdXRvSW5jcmVtZW50OiB0cnVlXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0dGhpcy4jbG9nKGBDcmVhdGVkIG9iamVjdCBzdG9yZTogJHtzdG9yZU5hbWV9YCwge1xuXHRcdFx0XHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uaW5pdGBcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHVwZ3JhZGVDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0IXVwZ3JhZGVDb21wbGV0ZSAmJlxuXHRcdFx0XHRcdFx0cmVxdWVzdC5yZXN1bHQudmVyc2lvbiAhPT0gdGhpcy4jdmVyc2lvblxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0dGhpcy4jbG9nKCdXYWl0aW5nIGZvciB1cGdyYWRlIHRvIGZpbmlzaC4nLCB7XG5cdFx0XHRcdFx0XHRcdGNhbGxlcjogYCR7Y2FsbGVyfS5pbml0YCxcblx0XHRcdFx0XHRcdFx0bGV2ZWw6ICd3YXJuJ1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy4jZGIgPSAoZXZlbnQudGFyZ2V0IGFzIElEQk9wZW5EQlJlcXVlc3QpLnJlc3VsdDtcblxuXHRcdFx0XHRcdHRoaXMuI2RiLm9udmVyc2lvbmNoYW5nZSA9ICgpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuI2RiPy5jbG9zZSgpO1xuXG5cdFx0XHRcdFx0XHR0aGlzLiNsb2coXG5cdFx0XHRcdFx0XHRcdCdJbmRleGVkREIgdmVyc2lvbiBjaGFuZ2VkLiBDbG9zaW5nIGRhdGFiYXNlJyxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxlcjogYCR7Y2FsbGVyfS5pbml0YCxcblx0XHRcdFx0XHRcdFx0XHRsZXZlbDogJ3dhcm4nXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHRoaXMuI2xvZyhgSW5kZXhlZERCIG9wZW5lZCBzdWNjZXNzZnVsbHlgLCB7XG5cdFx0XHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uaW5pdGBcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gZXZlbnQgPT4ge1xuXHRcdFx0XHRcdHJlamVjdChcblx0XHRcdFx0XHRcdChldmVudC50YXJnZXQgYXMgSURCT3BlbkRCUmVxdWVzdCkuZXJyb3I/Lm1lc3NhZ2UgfHxcblx0XHRcdFx0XHRcdFx0YFVua25vd24gJHtjYWxsZXJ9LmluaXQgZXJyb3IuYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy4jbG9nKGBJbmRleGVkREIgdXBnYWRlIGJsb2NrZWQhYCwge1xuXHRcdFx0XHRcdFx0Y2FsbGVyOiBgJHtjYWxsZXJ9LmluaXRgLFxuXHRcdFx0XHRcdFx0bGV2ZWw6ICd3YXJuJ1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0cmVqZWN0KFxuXHRcdFx0XHRcdFx0YFVwZ3JhZGUgYmxvY2tlZC4gQ2xvc2Ugb3RoZXIgdGFicyB1c2luZyB0aGlzIGRhdGFiYXNlLmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBJbmRleGVkREJgKTtcblx0fVxuXG5cdGFzeW5jIGNsZWFyKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiBhd2FpdCB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSB0aGlzLmdldFRyYW5zYWN0aW9uKCdyZWFkd3JpdGUnKTtcblxuXHRcdFx0aWYgKCFzdG9yZSkgdGhyb3cgbmV3IEVycm9yKGAke2NhbGxlcn0gaXMgbm90IGluaXRpYWxpemVkLmApO1xuXG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBzdG9yZS5jbGVhcigpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZSgpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+XG5cdFx0XHRcdFx0cmVqZWN0KFxuXHRcdFx0XHRcdFx0KGV2ZW50LnRhcmdldCBhcyBJREJSZXF1ZXN0KS5lcnJvcj8ubWVzc2FnZSB8fFxuXHRcdFx0XHRcdFx0XHRgVW5rbm93biAke2NhbGxlcn0uY2xlYXIgZXJyb3JgXG5cdFx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGNsZWFyIEluZGV4ZWREQi5gKTtcblx0fVxuXG5cdGFzeW5jIGVuc3VyZURCUmVhZHkoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdHdoaWxlICghdGhpcy4jZGIpIHtcblx0XHRcdFx0dGhpcy4jbG9nKGBXYWl0aW5nIGZvciAke2NhbGxlcn0gdG8gaW5pdGlhbGl6ZS4uLmAsIHtcblx0XHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uZW5zdXJlREJSZWFkeWAsXG5cdFx0XHRcdFx0bGV2ZWw6ICd3YXJuJ1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBUT0RPOiByZXBsYWNlIHdpdGggYSBiZXR0ZXIgc29sdXRpb24/P1xuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+XG5cdFx0XHRcdFx0c2V0VGltZW91dChyZXNvbHZlLCBpZGJSZXRyeURlbGF5KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGVuc3VyZSBJbmRleGVkREIgaXMgcmVhZHlgKTtcblx0fVxuXG5cdGFzeW5jIGdldEl0ZW08VD4oa2V5OiBzdHJpbmcpOiBQcm9taXNlPFQgfCBudWxsPiB7XG5cdFx0YXdhaXQgdGhpcy5lbnN1cmVEQlJlYWR5KCk7XG5cblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHN0b3JlID0gdGhpcy5nZXRUcmFuc2FjdGlvbigncmVhZG9ubHknKTtcblxuXHRcdFx0aWYgKCFzdG9yZSkgdGhyb3cgbmV3IEVycm9yKGAke2NhbGxlcn0gaXMgbm90IGluaXRpYWxpemVkLmApO1xuXG5cdFx0XHRyZXR1cm4gYXdhaXQgbmV3IFByb21pc2U8VCB8IG51bGw+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLmdldChrZXkpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT5cblx0XHRcdFx0XHRyZXNvbHZlKHJlcXVlc3QucmVzdWx0Py52YWx1ZSA/PyBudWxsKTtcblxuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PlxuXHRcdFx0XHRcdHJlamVjdChcblx0XHRcdFx0XHRcdChldmVudC50YXJnZXQgYXMgSURCUmVxdWVzdCkuZXJyb3I/Lm1lc3NhZ2UgfHxcblx0XHRcdFx0XHRcdFx0YFVua25vd24gJHtjYWxsZXJ9LmdldEl0ZW0oKSBlcnJvcmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gcmV0cmlldmUgaXRlbSAke2tleX0gZnJvbSBJbmRleGVkREJgKTtcblx0fVxuXG5cdGFzeW5jIHNldEl0ZW0oa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuI2Vycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZSA9IHRoaXMuZ2V0VHJhbnNhY3Rpb24oJ3JlYWR3cml0ZScpO1xuXG5cdFx0XHRpZiAoIXN0b3JlKSB0aHJvdyBuZXcgRXJyb3IoYCR7Y2FsbGVyfSBpcyBub3QgaW5pdGlhbGl6ZWQuYCk7XG5cblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLnB1dCh7IGlkOiBrZXksIHZhbHVlIH0pO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZSgpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+XG5cdFx0XHRcdFx0cmVqZWN0KFxuXHRcdFx0XHRcdFx0KGV2ZW50LnRhcmdldCBhcyBJREJSZXF1ZXN0KS5lcnJvcj8ubWVzc2FnZSB8fFxuXHRcdFx0XHRcdFx0XHRgVW5rbm93biAke2NhbGxlcn0uc2V0SXRlbSBlcnJvcmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gc3RvcmUgaXRlbSAke2tleX0gaW4gSW5kZXhlZERCYCk7XG5cdH1cblxuXHRhc3luYyByZW1vdmVJdGVtKGtleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0cmV0dXJuIGF3YWl0IHRoaXMuI2Vycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZSA9IHRoaXMuZ2V0VHJhbnNhY3Rpb24oJ3JlYWR3cml0ZScpO1xuXG5cdFx0XHRpZiAoIXN0b3JlKSB0aHJvdyBuZXcgRXJyb3IoYCR7Y2FsbGVyfSBpcyBub3QgaW5pdGlhbGl6ZWQuYCk7XG5cblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLmRlbGV0ZShrZXkpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZSgpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+XG5cdFx0XHRcdFx0cmVqZWN0KFxuXHRcdFx0XHRcdFx0KGV2ZW50LnRhcmdldCBhcyBJREJSZXF1ZXN0KS5lcnJvcj8ubWVzc2FnZSB8fFxuXHRcdFx0XHRcdFx0XHRgVW5rbm93biAke2NhbGxlcn0ucmVtb3ZlSXRlbSBlcnJvci5gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHJlbW92ZSBpdGVtICR7a2V5fSBmcm9tIEluZGV4ZWREQmApO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRUcmFuc2FjdGlvbihtb2RlOiBJREJUcmFuc2FjdGlvbk1vZGUpOiBJREJPYmplY3RTdG9yZSB8IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXRoaXMuI2RiKSB0aHJvdyBuZXcgRXJyb3IoYCR7Y2FsbGVyfSBpcyBub3QgaW5pdGlhbGl6ZWQuYCk7XG5cblx0XHRcdGNvbnN0IHRyYW5zYWN0aW9uID0gdGhpcy4jZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKTtcblxuXHRcdFx0cmV0dXJuIHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gZ2V0IEluZGV4ZWREQiB0cmFuc2FjdGlvbiAoJHttb2RlfSlgKTtcblx0fVxufVxuIl19