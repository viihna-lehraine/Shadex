// File: core/services/ObserverService.ts
const caller = 'ObserverService';
class ObserverService {
    data;
    debounceOptions;
    #listeners = {};
    #debounceTimers = {};
    #errors;
    #helpers;
    #log;
    constructor(data, debounceOptions = {}, helpers, services) {
        this.data = data;
        this.debounceOptions = debounceOptions;
        try {
            services.log.debug(`Constructing Observer instance`, `${caller} constructor`);
            this.#errors = services.errors;
            this.#log = services.log;
            this.#helpers = helpers;
            this.data = this.#deepObserve(this.data);
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    batchUpdate(updates) {
        return this.#errors.handleSync(() => {
            this.#log.debug(`Performing batch update. Updates: ${JSON.stringify(this.#helpers.data.clone(updates))}`, `${caller}.batchUpdate`);
            Object.entries(updates).forEach(([key, value]) => {
                this.set(key, value);
            });
        }, `[${caller}]: Error performing batch update.`);
    }
    get(prop) {
        return this.#errors.handleSync(() => {
            return this.#helpers.data.clone(this.data[prop]);
        }, `[${caller}]: Error getting data.`);
    }
    getData() {
        return this.#errors.handleSync(() => {
            return this.#helpers.data.clone(this.data);
        }, `[${caller}]: Error getting data.`);
    }
    off(prop, callback) {
        return this.#errors.handleSync(() => {
            this.#listeners[prop] =
                this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
        }, `[${caller}]: Error removing listener.`);
    }
    on(prop, callback) {
        return this.#errors.handleSync(() => {
            if (!this.#listeners[prop]) {
                this.#listeners[prop] = [];
            }
            this.#listeners[prop].push(callback);
        }, `[${caller}]: Error adding listener.`);
    }
    replaceData(newData) {
        return this.#errors.handleSync(() => {
            const oldData = this.data;
            this.data = this.#deepObserve(newData);
            // notify listeners of all changed properties
            Object.keys(newData).forEach(key => {
                const prop = key;
                const newValue = newData[prop];
                const oldValue = oldData[prop];
                const clonedNewValue = this.#helpers.data.clone(newValue);
                const clonedOldValue = this.#helpers.data.clone(oldValue);
                // notify only if values differ
                if (JSON.stringify(clonedNewValue) !== JSON.stringify(clonedOldValue)) {
                    this.#triggerNotify(prop, newValue, oldValue);
                }
                // notify listeners for removed properties
                Object.keys(oldData).forEach(key => {
                    if (!(key in newData)) {
                        const prop = key;
                        this.#triggerNotify(prop, undefined, oldData[prop]);
                    }
                });
            });
            this.#log.debug(`Observer data replaced and listeners notified.`, `${caller}.replaceData`);
        }, `[${caller}.replaceData]: Error replacing data.`);
    }
    set(prop, value) {
        return this.#errors.handleSync(() => {
            const oldValue = this.#helpers.data.clone(this.data[prop]);
            this.data[prop] = this.#helpers.data.clone(value);
            this.#triggerNotify(prop, this.data[prop], oldValue);
        }, `[${caller}]: Error setting data.`);
    }
    setData(newData, debounceOptions, helpers, services) {
        return new ObserverService(newData, debounceOptions, helpers, services);
    }
    #deepObserve(obj) {
        return this.#errors.handleSync(() => {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }
            // recursively proxy nested objects
            return new Proxy(obj, {
                get: (target, prop) => {
                    const value = target[prop];
                    return typeof value === 'object' && value !== null
                        ? this.#deepObserve(value)
                        : value;
                },
                set: (target, prop, value) => {
                    if (Object.prototype.hasOwnProperty.call(target, prop)) {
                        const oldValue = target[prop];
                        target[prop] = value;
                        this.#triggerNotify(prop, value, oldValue);
                    }
                    return true;
                },
                deleteProperty: (target, prop) => {
                    if (Object.prototype.hasOwnProperty.call(target, prop)) {
                        const oldValue = target[prop];
                        delete target[prop];
                        this.#triggerNotify(prop, undefined, oldValue);
                    }
                    return true;
                }
            });
        }, `[${caller}]: Error observing data.`);
    }
    #notify(prop, newValue, oldValue) {
        return this.#errors.handleSync(() => {
            this.#listeners[prop]?.forEach(callback => callback(newValue, oldValue));
        }, `[${caller}]: Error notifying listeners.`);
    }
    #triggerNotify(prop, newValue, oldValue) {
        return this.#errors.handleSync(() => {
            const delay = this.debounceOptions.delay ?? 0;
            if (delay > 0) {
                clearTimeout(this.#debounceTimers[prop]);
                this.#debounceTimers[prop] = setTimeout(() => {
                    this.#notify(prop, newValue, oldValue);
                }, delay);
            }
            else {
                this.#notify(prop, newValue, oldValue);
            }
        }, `[${caller}]: Error triggering notification.`);
    }
}

export { ObserverService };
//# sourceMappingURL=ObserverService.js.map
