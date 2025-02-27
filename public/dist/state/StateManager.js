import { StateFactory } from './StateFactory.js';
import { StateHistoryService } from './StateHistoryService.js';
import { StateStore } from './StateStore.js';
import { StorageManager } from '../storage/StorageManager.js';
import { env } from '../config/partials/env.js';
import '../config/partials/defaults.js';
import '../config/partials/regex.js';

// File: state/StateManager.ts
const caller = 'StateManager';
const maxReadyAttempts = env.state.maxReadyAttempts;
const stateReadyTimeout = env.state.readyTimeout;
class StateManager {
    static #instance = null;
    #state;
    #stateFactory;
    #stateHistory;
    #storage;
    #store;
    #log;
    #errors;
    constructor(helpers, services, utils) {
        try {
            services.log.debug(`Constructing ${caller} instance.`, `${caller} constructor`);
            this.#log = services.log;
            this.#errors = services.errors;
            this.#state = {};
            this.#stateFactory = StateFactory.getInstance(helpers, services, utils);
            this.#stateHistory = StateHistoryService.getInstance(helpers, services);
            this.init(helpers, services).catch(error => {
                this.#log.error('StateManager init failed.', `${caller} constructor`);
                console.error(error);
            });
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static async getInstance(helpers, services, utils) {
        return services.errors.handleSync(() => {
            if (!StateManager.#instance) {
                services.log.debug(`Creating new StateManager instance.`, `${caller}.getInstance`);
                StateManager.#instance = new StateManager(helpers, services, utils);
            }
            services.log.debug(`Returning ${caller} instance.`, `${caller}.getInstance`);
            return StateManager.#instance;
        }, `[${caller}]: Error getting StateManager instance.`);
    }
    async init(helpers, services) {
        return this.#errors.handleAsync(async () => {
            this.#log.debug('Initializing State Manager.', `${caller}.init`);
            this.#storage = await StorageManager.getInstance(services);
            this.#store = StateStore.getInstance(this.#state, helpers, services, this.#storage);
            this.#state = await this.loadState();
        }, `[${caller}]: Failed to initialize State Manager.`);
    }
    addPaletteToHistory(palette) {
        this.#stateHistory.addPaletteToHistory(this.#state, palette);
        this.#log.debug(`Added palette to history.`, `${caller}.addPaletteToHistory`);
    }
    async batchUpdate(updates) {
        await this.#store.batchUpdate(updates);
        this.#log.debug('Performed batch update.', `${caller}.batchUpdate`);
    }
    async ensureStateReady() {
        return await this.#errors.handleAsync(async () => {
            let attempts = 0;
            while (!this.#state || !this.#state.paletteContainer) {
                if (attempts++ >= maxReadyAttempts) {
                    this.#log.error('State initialization timed out.', `${caller}.ensureStateReady`);
                    throw new Error('State initialization timed out.');
                }
                this.#log.debug(`Waiting for state to initialize... (Attempt ${attempts}).`, `${caller}.ensureStateReady`);
                await new Promise(resolve => setTimeout(resolve, stateReadyTimeout));
            }
            this.#log.debug('State is now initialized.', `${caller}.ensureStateReady`);
        }, `[${caller}]: Failed to ensure state readiness.`, { context: { maxReadyAttempts } });
    }
    async getState() {
        return this.#store.getState();
    }
    async loadState() {
        const loadedState = await this.#store.loadState();
        if (loadedState) {
            this.#log.info('State loaded from storage.', `${caller}.loadState`);
            return loadedState;
        }
        this.#log.info(`State not found in storage. Creating initial state via State Factory.`, `${caller}.loadState`);
        return await this.#stateFactory.createInitialState();
    }
    redo() {
        const nextState = this.#stateHistory.redo();
        if (!nextState)
            return null;
        this.#store.batchUpdate(nextState);
        this.#log.info('Redo performed.', `${caller}.redo`);
        return nextState;
    }
    async resetState() {
        const initialState = await this.#stateFactory.createInitialState();
        await this.setState(initialState, false);
        await this.saveState();
        this.#log.info('State has been reset.', `${caller}.resetState`);
    }
    async saveState() {
        return await this.#errors.handleAsync(async () => {
            await this.#store.saveState(this.#state);
            this.#log.info('State saved to storage.', `${caller}.saveState`);
        }, `[${caller}]: Failed to save state`);
    }
    async setState(newState, track = true) {
        if (track)
            this.#trackAction();
        await this.#store.batchUpdate(newState);
        this.#log.info('State replaced.', `${caller}.setState`);
    }
    undo() {
        const previousState = this.#stateHistory.undo(this.#store.getState());
        if (!previousState)
            return null;
        this.#store.batchUpdate(previousState);
        this.#log.info('Undo performed.', `${caller}.undo`);
        return previousState;
    }
    updatePaletteColumns(columns, track = true) {
        if (track)
            this.#trackAction();
        this.#store.batchUpdate({
            paletteContainer: {
                ...this.#store.get('paletteContainer'),
                columns
            }
        });
        this.#log.debug('Palette columns updated.', `${caller}.updatePaletteColumns`);
    }
    async updatePaletteHistory(updatedHistory, track) {
        if (track)
            this.#trackAction();
        await this.#store.batchUpdate({ paletteHistory: updatedHistory });
        this.#log.debug(`Updated palette history.`, `${caller}.updatePaletteHistory`);
    }
    async updateSelections(selections, track) {
        if (track)
            this.#trackAction();
        await this.#store.batchUpdate({
            selections: { ...this.#store.get('selections'), ...selections }
        });
        this.#log.debug('Selections updated.', `${caller}.updateSelections`);
    }
    #trackAction() {
        this.#stateHistory.trackAction(this.#state);
    }
}

export { StateManager };
//# sourceMappingURL=StateManager.js.map
