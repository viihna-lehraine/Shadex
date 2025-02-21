// File: common/services/DataObserver.js
class DataObserver {
    data;
    debounceOptions;
    #listeners = {};
    #debounceTimers = {};
    constructor(data, debounceOptions = {}) {
        this.data = data;
        this.debounceOptions = debounceOptions;
        this.data = this.#deepObserve(this.data);
    }
    get(prop) {
        return this.data[prop];
    }
    off(prop, callback) {
        this.#listeners[prop] =
            this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
    }
    on(prop, callback) {
        if (!this.#listeners[prop]) {
            this.#listeners[prop] = [];
        }
        this.#listeners[prop].push(callback);
    }
    set(prop, value) {
        this.data[prop] = value;
    }
    setData(newData) {
        return new DataObserver(newData);
    }
    #deepObserve(obj) {
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
    }
    #notify(prop, newValue, oldValue) {
        this.#listeners[prop]?.forEach(callback => callback(newValue, oldValue));
    }
    #triggerNotify(prop, newValue, oldValue) {
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
    }
}

export { DataObserver };
//# sourceMappingURL=DataObserver.js.map
