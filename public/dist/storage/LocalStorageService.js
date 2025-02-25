// File: storage/LocalStorageService.ts
const caller = 'LocalStorageService';
export class LocalStorageService {
    static #instance = null;
    #errors;
    #log;
    constructor(services) {
        try {
            services.log(`Constructing ${caller} instance.`, {
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
            if (!LocalStorageService.#instance) {
                services.log(`No ${caller} instance exists yet. Creating new instance.`, {
                    caller: `${caller}.getInstance`,
                    level: 'debug'
                });
                LocalStorageService.#instance = new LocalStorageService(services);
            }
            services.log('Returning existing LocalStorageManager instance.', {
                caller: `${caller}.getInstance`,
                level: 'debug'
            });
            return LocalStorageService.#instance;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTdG9yYWdlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdG9yYWdlL0xvY2FsU3RvcmFnZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdUNBQXVDO0FBSXZDLE1BQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDO0FBRXJDLE1BQU0sT0FBTyxtQkFBbUI7SUFDL0IsTUFBTSxDQUFDLFNBQVMsR0FBK0IsSUFBSSxDQUFDO0lBRXBELE9BQU8sQ0FBcUI7SUFDNUIsSUFBSSxDQUFrQjtJQUV0QixZQUFvQixRQUFrQjtRQUNyQyxJQUFJLENBQUM7WUFDSixRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixNQUFNLFlBQVksRUFBRTtnQkFDaEQsTUFBTSxFQUFFLEdBQUcsTUFBTSxjQUFjO2FBQy9CLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDMUIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FDZCxJQUFJLE1BQU0sa0JBQWtCLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUM1RSxDQUFDO1FBQ0gsQ0FBQztJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWtCO1FBQ3BDLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDcEMsUUFBUSxDQUFDLEdBQUcsQ0FDWCxNQUFNLE1BQU0sOENBQThDLEVBQzFEO29CQUNDLE1BQU0sRUFBRSxHQUFHLE1BQU0sY0FBYztvQkFDL0IsS0FBSyxFQUFFLE9BQU87aUJBQ2QsQ0FDRCxDQUFDO2dCQUVGLG1CQUFtQixDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFtQixDQUN0RCxRQUFRLENBQ1IsQ0FBQztZQUNILENBQUM7WUFFRCxRQUFRLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxFQUFFO2dCQUNoRSxNQUFNLEVBQUUsR0FBRyxNQUFNLGNBQWM7Z0JBQy9CLEtBQUssRUFBRSxPQUFPO2FBQ2QsQ0FBQyxDQUFDO1lBRUgsT0FBTyxtQkFBbUIsQ0FBQyxTQUFTLENBQUM7UUFDdEMsQ0FBQyxFQUFFLElBQUksTUFBTSxtREFBbUQsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDcEQsTUFBTSxFQUFFLEdBQUcsTUFBTSxPQUFPO2dCQUN4QixLQUFLLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQztZQUVILE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQyxFQUFFLElBQUksTUFBTSwyQ0FBMkMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNWLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FDcEMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQ2hDLElBQUksTUFBTSxrQ0FBa0MsQ0FDNUMsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFJLEdBQVc7UUFDM0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQyxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDekMsQ0FBQyxFQUFFLElBQUksTUFBTSx5QkFBeUIsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQVc7UUFDM0IsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUNwQyxLQUFLLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQ3hDLElBQUksTUFBTSw0QkFBNEIsR0FBRyxxQkFBcUIsQ0FDOUQsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQVcsRUFBRSxLQUFjO1FBQ3hDLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNoRCxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLEVBQUU7Z0JBQ2hDLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBVTtnQkFDM0IsS0FBSyxFQUFFLE9BQU87YUFDZCxDQUFDLENBQUM7UUFDSixDQUFDLEVBQUUsd0JBQXdCLEdBQUcsa0JBQWtCLENBQUMsQ0FBQztJQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3RvcmFnZS9Mb2NhbFN0b3JhZ2VTZXJ2aWNlLnRzXG5cbmltcG9ydCB7IExvY2FsU3RvcmFnZUNvbnRyYWN0LCBTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcblxuY29uc3QgY2FsbGVyID0gJ0xvY2FsU3RvcmFnZVNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlU2VydmljZSBpbXBsZW1lbnRzIExvY2FsU3RvcmFnZUNvbnRyYWN0IHtcblx0c3RhdGljICNpbnN0YW5jZTogTG9jYWxTdG9yYWdlU2VydmljZSB8IG51bGwgPSBudWxsO1xuXG5cdCNlcnJvcnM6IFNlcnZpY2VzWydlcnJvcnMnXTtcblx0I2xvZzogU2VydmljZXNbJ2xvZyddO1xuXG5cdHByaXZhdGUgY29uc3RydWN0b3Ioc2VydmljZXM6IFNlcnZpY2VzKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHNlcnZpY2VzLmxvZyhgQ29uc3RydWN0aW5nICR7Y2FsbGVyfSBpbnN0YW5jZS5gLCB7XG5cdFx0XHRcdGNhbGxlcjogYCR7Y2FsbGVyfS5jb25zdHJ1Y3RvcmBcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiNlcnJvcnMgPSBzZXJ2aWNlcy5lcnJvcnM7XG5cdFx0XHR0aGlzLiNsb2cgPSBzZXJ2aWNlcy5sb2c7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn0gY29uc3RydWN0b3JdOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3J9YFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgZ2V0SW5zdGFuY2Uoc2VydmljZXM6IFNlcnZpY2VzKTogTG9jYWxTdG9yYWdlU2VydmljZSB7XG5cdFx0cmV0dXJuIHNlcnZpY2VzLmVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghTG9jYWxTdG9yYWdlU2VydmljZS4jaW5zdGFuY2UpIHtcblx0XHRcdFx0c2VydmljZXMubG9nKFxuXHRcdFx0XHRcdGBObyAke2NhbGxlcn0gaW5zdGFuY2UgZXhpc3RzIHlldC4gQ3JlYXRpbmcgbmV3IGluc3RhbmNlLmAsXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y2FsbGVyOiBgJHtjYWxsZXJ9LmdldEluc3RhbmNlYCxcblx0XHRcdFx0XHRcdGxldmVsOiAnZGVidWcnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdExvY2FsU3RvcmFnZVNlcnZpY2UuI2luc3RhbmNlID0gbmV3IExvY2FsU3RvcmFnZVNlcnZpY2UoXG5cdFx0XHRcdFx0c2VydmljZXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0c2VydmljZXMubG9nKCdSZXR1cm5pbmcgZXhpc3RpbmcgTG9jYWxTdG9yYWdlTWFuYWdlciBpbnN0YW5jZS4nLCB7XG5cdFx0XHRcdGNhbGxlcjogYCR7Y2FsbGVyfS5nZXRJbnN0YW5jZWAsXG5cdFx0XHRcdGxldmVsOiAnZGVidWcnXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIExvY2FsU3RvcmFnZVNlcnZpY2UuI2luc3RhbmNlO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGNyZWF0ZSBMb2NhbFN0b3JhZ2VNYW5hZ2VyIGluc3RhbmNlLmApO1xuXHR9XG5cblx0YXN5bmMgaW5pdCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdHRoaXMuI2xvZygnVXNpbmcgTG9jYWxTdG9yYWdlIGFzIHN0b3JhZ2UgZmFsbGJhY2suJywge1xuXHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uaW5pdGAsXG5cdFx0XHRcdGxldmVsOiAnd2Fybidcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LCBgWyR7Y2FsbGVyfS5pbml0XTogRmFpbGVkIHRvIGluaXRpYWxpemUgTG9jYWxTdG9yYWdlYCk7XG5cdH1cblxuXHRhc3luYyBjbGVhcigpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKFxuXHRcdFx0YXN5bmMgKCkgPT4gbG9jYWxTdG9yYWdlLmNsZWFyKCksXG5cdFx0XHRgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byBjbGVhciBMb2NhbFN0b3JhZ2UuYFxuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBnZXRJdGVtPFQ+KGtleTogc3RyaW5nKTogUHJvbWlzZTxUIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuXG5cdFx0XHRyZXR1cm4gdmFsdWUgPyBKU09OLnBhcnNlKHZhbHVlKSA6IG51bGw7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gZ2V0IGl0ZW0gJHtrZXl9IGZyb20gTG9jYWxTdG9yYWdlLmApO1xuXHR9XG5cblx0YXN5bmMgcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiBhd2FpdCB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoXG5cdFx0XHRhc3luYyAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpLFxuXHRcdFx0YFske2NhbGxlcn1dOiBGYWlsZWQgdG8gcmVtb3ZlIGl0ZW0gJHtrZXl9IGZyb20gTG9jYWxTdG9yYWdlLmBcblx0XHQpO1xuXHR9XG5cblx0YXN5bmMgc2V0SXRlbShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcblxuXHRcdFx0dGhpcy4jbG9nKGBTdG9yZWQgaXRlbTogJHtrZXl9YCwge1xuXHRcdFx0XHRjYWxsZXI6IGAke2NhbGxlcn0uc2V0SXRlbWAsXG5cdFx0XHRcdGxldmVsOiAnZGVidWcnXG5cdFx0XHR9KTtcblx0XHR9LCBgRmFpbGVkIHRvIHN0b3JlIGl0ZW0gJHtrZXl9IGluIExvY2FsU3RvcmFnZWApO1xuXHR9XG59XG4iXX0=