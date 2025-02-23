// File: common/services/Observer.ts
class Observer {
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
        this.#errors = services.errors;
        this.#log = services.log;
        this.#helpers = helpers;
        this.#log('Constructing DataObserver instance.', {
            caller: 'DataObserver constructor',
            level: 'debug',
            verbosity: 3
        });
        this.data = this.#deepObserve(this.data);
    }
    batchUpdate(updates) {
        return this.#errors.handleSync(() => {
            this.#log(`Performing batch update. Updates: ${JSON.stringify(this.#helpers.data.clone(updates))}`, {
                caller: 'DataObserver.batchUpdate',
                level: 'debug',
                verbosity: 2
            });
            Object.entries(updates).forEach(([key, value]) => {
                this.set(key, value);
            });
        }, '[OBSERVER]: Error performing batch update.');
    }
    get(prop) {
        return this.#errors.handleSync(() => {
            return this.#helpers.data.clone(this.data[prop]);
        }, '[OBSERVER]: Error getting data.');
    }
    off(prop, callback) {
        return this.#errors.handleSync(() => {
            this.#listeners[prop] =
                this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
        }, '[OBSERVER]: Error removing listener.');
    }
    on(prop, callback) {
        return this.#errors.handleSync(() => {
            if (!this.#listeners[prop]) {
                this.#listeners[prop] = [];
            }
            this.#listeners[prop].push(callback);
        }, '[OBSERVER]: Error adding listener.');
    }
    set(prop, value) {
        return this.#errors.handleSync(() => {
            const oldValue = this.#helpers.data.clone(this.data[prop]);
            this.data[prop] = this.#helpers.data.clone(value);
            this.#triggerNotify(prop, this.data[prop], oldValue);
        }, '[OBSERVER]: Error setting data.');
    }
    setData(newData, debounceOptions, helpers, services) {
        return new Observer(newData, debounceOptions, helpers, services);
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
        }, '[OBSERVER]: Error observing data.');
    }
    #notify(prop, newValue, oldValue) {
        return this.#errors.handleSync(() => {
            this.#listeners[prop]?.forEach(callback => callback(newValue, oldValue));
        }, '[OBSERVER]: Error notifying listeners.');
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
        }, '[OBSERVER]: Error triggering notification.');
    }
}

export { Observer };
//# sourceMappingURL=Observer.js.map
