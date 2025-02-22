// File: common/services/DataObserver.ts
/**
 * @description Used for observing changes to a data object
 * @export
 * @class DataObserver
 * @implements {DataObserverInterface<T>}
 * @template T
 */
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
    /**
     * @description Get the value of a property from the data object
     * @template K
     * @param {K} prop
     * @return {*}  {T[K]}
     * @memberof DataObserver
     */
    get(prop) {
        return this.data[prop];
    }
    /**
     * @description Remove a listener from the list of listeners for a property
     * @template K
     * @param {K} prop
     * @param {Listener<T[K]>} callback
     * @memberof DataObserver
     */
    off(prop, callback) {
        this.#listeners[prop] =
            this.#listeners[prop]?.filter(cb => cb !== callback) ?? [];
    }
    /**
     * @description Add a listener to the list of listeners for a property
     * @template K
     * @param {K} prop
     * @param {Listener<T[K]>} callback
     * @memberof DataObserver
     */
    on(prop, callback) {
        if (!this.#listeners[prop]) {
            this.#listeners[prop] = [];
        }
        this.#listeners[prop].push(callback);
    }
    /**
     * @description Set the value of a property in the data object
     * @template K
     * @param {K} prop
     * @param {T[K]} value
     * @memberof DataObserver
     */
    set(prop, value) {
        this.data[prop] = value;
    }
    /**
     * @description
     * @template U
     * @param {U} newData
     * @return {*}  {DataObserver<U>}
     * @memberof DataObserver
     */
    setData(newData) {
        return new DataObserver(newData);
    }
    /**
     * @description Recursively observe nested objects
     * @param {T} obj
     * @return {*}  {T}
     * @memberof DataObserver
     */
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
    /**
     * @description Notify listeners of a property change
     * @template K
     * @param {K} prop
     * @param {T[K]} newValue
     * @param {T[K]} oldValue
     * @memberof DataObserver
     */
    #notify(prop, newValue, oldValue) {
        this.#listeners[prop]?.forEach(callback => callback(newValue, oldValue));
    }
    /**
     * @description
     * @template K
     * @param {K} prop
     * @param {T[K]} newValue
     * @param {T[K]} oldValue
     * @memberof DataObserver
     */
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
