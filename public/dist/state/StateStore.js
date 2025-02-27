import { env } from '../config/partials/env.js';
import '../config/partials/defaults.js';
import '../config/partials/regex.js';
import { ObserverService } from '../core/services/ObserverService.js';

// File: state/StateStore.ts
const caller = 'StateStore';
class StateStore {
    static #instance;
    #debouncedSave;
    #observer;
    #state;
    #clone;
    #debounce;
    #errors;
    #log;
    #storage;
    constructor(initialState, helpers, services, storage) {
        try {
            services.log.info(`Constructing ${caller} instance.`, `${caller} constructor`);
            this.#state = Object.freeze({ ...initialState });
            this.#observer = new ObserverService(this.#state, {}, helpers, services);
            this.#storage = storage;
            this.#clone = helpers.data.clone;
            this.#debounce = helpers.time.debounce;
            this.#errors = services.errors;
            this.#log = services.log;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(initialState, helpers, services, storage) {
        return services.errors.handleSync(() => {
            if (!StateStore.#instance) {
                StateStore.#instance = new StateStore(initialState, helpers, services, storage);
                services.log.info(`Creating new ${caller} instance`, `${caller}.getInstance`);
                return StateStore.#instance;
            }
            services.log.info(`Returning existing ${caller} instance`, `${caller}.getInstance`);
            return StateStore.#instance;
        }, `[${caller}.getInstance]: Failed to create ${caller} instance.`);
    }
    async batchUpdate(updates) {
        this.#errors.handleSync(() => {
            const oldState = this.#state;
            const updatedEntries = Object.entries(updates).filter(([key, value]) => oldState[key] !== value);
            if (updatedEntries.length === 0) {
                this.#log.debug(`No state changes detected for batch update`, `${caller}.batchUpdate`);
                return;
            }
            const newState = Object.freeze(this.#clone({ ...oldState, ...updates }));
            this.#state = newState;
            this.#log.debug(`Batch updated state with keys: ${updatedEntries.map(([k]) => k).join(', ')}`, `${caller}.batchUpdate`);
            console.debug(`[${caller}.batchUpdate]: Batch Update List:`, updates);
            this.#notifyObservers(updates);
            this.saveState(newState);
        }, `[${caller}.batchUpdate]: Failed to perform batch update`);
    }
    get(key) {
        return this.#errors.handleSync(() => {
            return this.#state[key];
        }, `[${caller}.get]: Failed to retrieve state key: ${String(key)}`);
    }
    getState() {
        return this.#errors.handleSync(() => {
            return { ...this.#state };
        }, `[${caller}.getData]: Failed to retrieve full state`);
    }
    async init() {
        this.#debouncedSave = this.#debounce((state) => this.saveState(state, { throttle: false }), env.state.saveThrottleDelay);
        const loadedState = await this.loadState();
        loadedState
            ? this.#log.info(`State loaded from storage.`, `${caller}.init`)
            : this.#log.warn(`No saved state found.`, `${caller}.init`);
        return loadedState;
    }
    async loadState() {
        return this.#errors.handleAsync(async () => {
            const savedState = await this.#storage.getItem('state');
            if (savedState) {
                this.#state = Object.freeze(this.#clone(savedState));
                // replace observer data with the new state
                this.#observer.replaceData(this.#state);
                this.#log.info('Loaded state from storage.', `${caller}.loadState`);
                return this.#state;
            }
            this.#log.warn('No saved state found.', `${caller}.loadState`);
            return null;
        }, `[${caller}.loadState]: Failed to load state from storage.`);
    }
    off(key, callback) {
        this.#observer.off(key, callback);
    }
    on(key, callback) {
        this.#observer.on(key, callback);
    }
    async saveState(state = this.#state, options = {}) {
        return this.#errors.handleAsync(async () => {
            if (options.throttle) {
                this.#debouncedSave(state);
            }
            else {
                await this.#saveOperation(state);
            }
            this.#log.info('State saved to storage.', `${caller}.saveState`);
        }, `[${caller}.saveState]: Failed to save state to storage.`);
    }
    async set(key, value) {
        this.#errors.handleSync(() => {
            const oldValue = this.#state[key];
            if (oldValue === value) {
                this.#log.debug(`No state change detected for key: ${String(key)}`, `${caller}.set`);
                return;
            }
            this.#updateState({ [key]: value });
            this.#log.debug(`Updated state key: ${String(key)}\nOld value: ${JSON.stringify(oldValue)}\nNew value: ${JSON.stringify(value)}`, `${caller}.set`);
        }, `[${caller}.set]: Failed to update state key: ${String(key)}.`);
    }
    #notifyObservers(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.#observer.set(key, value);
        });
    }
    async #saveOperation(state) {
        return this.#errors.handleAsync(async () => {
            for (let attempt = 1; attempt <= env.state.maxSaveRetries; attempt++) {
                try {
                    await this.#storage.setItem('state', state);
                    this.#log.info(`State saved successfully on attempt ${attempt}.`, `${caller}.#saveOperation`);
                    break;
                }
                catch (err) {
                    if (attempt < env.state.maxSaveRetries) {
                        this.#log.warn(`Save attempt ${attempt} failed. Retrying...`, `${caller}.#saveOperation`);
                    }
                    else {
                        this.#log.error('Max save attempts reached. Save failed.', `${caller}.#saveOperation`);
                    }
                }
            }
        }, `[${caller}.#saveOperation]: Save operation failed.`);
    }
    #updateState(updates) {
        const updatedState = Object.freeze(this.#clone({ ...this.#state, ...updates }));
        this.#state = updatedState;
        this.#notifyObservers(updates);
        this.saveState(updatedState);
    }
}

export { StateStore };
//# sourceMappingURL=StateStore.js.map
