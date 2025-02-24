import { Mutex } from '../common/services/Mutex.js';
import { Observer } from '../common/services/Observer.js';
import { StorageManager } from '../storage/StorageManager.js';
import { env } from '../config/partials/env.js';
import { defaults } from '../config/partials/defaults.js';
import { domIndex, domConfig } from '../config/partials/dom.js';
import '../config/partials/regex.js';

// File: state/StateManager.ts
const caller = 'StateManager';
const defaultState = defaults.state;
const maxReadyAttempts = env.state.maxReadyAttempts;
class StateManager {
    static #instance = null;
    #dataLocks = new Map();
    #history;
    #observer;
    #onStateLoadCallback = null;
    #saveThrottleTimer = null;
    #state;
    #stateLock;
    #storage;
    #undoStack;
    #log;
    #errors;
    #helpers;
    #services;
    #utils;
    constructor(helpers, services, utils) {
        try {
            services.log(`Constructing StateManager instance.`, {
                caller: `${caller} constructor`,
                level: 'debug'
            });
            this.#log = services.log;
            this.#errors = services.errors;
            this.#helpers = helpers;
            this.#services = services;
            this.#utils = utils;
            this.#storage = new StorageManager(services);
            this.#state = {};
            this.#observer = new Observer(this.#state, { delay: env.observer.debounce }, this.#helpers, this.#services);
            Object.keys(this.#state).forEach(key => {
                this.#observer.on(key, (newVal, oldVal) => {
                    this.#log(`${key} updated. New: ${JSON.stringify(newVal)} | Old: ${JSON.stringify(oldVal)}`, { caller: `${caller}.#observer`, level: 'debug' });
                });
            });
            this.#state.paletteHistory = [];
            this.#history = [this.#state];
            this.#stateLock = new Mutex(services.errors, services.log);
            this.#undoStack = [];
            this.init()
                .then(() => {
                this.#saveStateAndLog('init', 3);
            })
                .catch(error => {
                this.#log('StateManager init failed.', {
                    caller: `${caller} constructor`,
                    level: 'error'
                });
                console.error(error);
            });
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, services, utils) {
        return services.errors.handleSync(() => {
            if (!StateManager.#instance) {
                services.log(`Creating new StateManager instance.`, {
                    caller: `${caller}.getInstance`,
                    level: 'debug'
                });
                StateManager.#instance = new StateManager(helpers, services, utils);
            }
            services.log(`Returning StateManager instance.`, {
                caller: `${caller}.getInstance`,
                level: 'debug'
            });
            return StateManager.#instance;
        }, `[${caller}]: Error getting StateManager instance.`);
    }
    async init() {
        return this.#errors.handleAsync(async () => {
            this.#log('Initializing State Manager', {
                caller: `${caller}.init`,
                level: 'debug'
            });
            await this.#storage.init();
            {
                this.#log('State loading from storage is disabled via feature flag.', {
                    caller: `${caller}.init`,
                    level: 'warn'
                });
                this.#state = this.#generateInitialState();
            }
            this.#log('StateManager initialized successfully.', {
                caller: `${caller}.init`,
                level: 'debug'
            });
            await this.#saveState();
        }, `[${caller}]: Failed to initialize State Manager.`);
    }
    addPaletteToHistory(palette) {
        return this.#errors.handleSync(() => {
            this.#trackAction();
            this.#state.paletteHistory.push(palette);
            this.#saveStateAndLog('paletteHistory', 3);
        }, `[${caller}]: Failed to add palette to history.`, { context: { palette } });
    }
    async atomicUpdate(callback) {
        return this.#errors.handleAsync(async () => {
            return await this.#stateLock.runExclusive(async () => {
                callback(this.#observer['data']);
                this.#log('Performed atomic update.', {
                    caller: `${caller}.atomicUpdate`,
                    level: 'debug'
                });
                await this.#saveState();
            });
        }, `[${caller}]: Failed to perform atomic update.`);
    }
    async batchUpdate(callback) {
        await this.#errors.handleAsync(async () => {
            await this.#withWriteLock(async () => {
                const partialUpdate = callback(this.#state);
                this.#observer.batchUpdate(partialUpdate);
                this.#log('Performed batch update.', {
                    caller: `${caller}.batchUpdate`,
                    level: 'debug',
                    verbosity: 2
                });
                await this.#saveState();
            });
        }, `[${caller}]: Failed to perform batch update.`);
    }
    async ensureStateReady() {
        return await this.#errors.handleAsync(async () => {
            let attempts = 0;
            while (!this.#state || !this.#state.paletteContainer) {
                if (attempts++ >= maxReadyAttempts) {
                    this.#log('State initialization timed out.', {
                        caller: `${caller}.ensureStateReady`,
                        level: 'error'
                    });
                    throw new Error('State initialization timed out.');
                }
                this.#log(`Waiting for state to initialize... (Attempt ${attempts})`, {
                    caller: `${caller}.ensureStateReady`,
                    level: 'debug'
                });
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            this.#log('State is now initialized.', {
                caller: `${caller}.ensureStateReady`,
                level: 'debug'
            });
        }, `[${caller}]: Failed to ensure state readiness.`, { context: { maxReadyAttempts } });
    }
    async getState() {
        return await (this.#errors.handleAsync(async () => {
            return this.#withReadLock(() => {
                if (!this.#state)
                    this.#log('State accessed before initialization.', {
                        caller: `${caller}.getState`,
                        level: 'warn'
                    });
                if (!this.#state.preferences) {
                    this.#log('State.preferences is undefined. Setting default preferences.', {
                        caller: `${caller}.getState`,
                        level: 'warn'
                    });
                    this.#state.preferences = defaultState.preferences;
                }
                return this.#helpers.data.clone(this.#state);
            });
        }, `[${caller}]: Error retrieving state`) ?? defaultState);
    }
    async loadState() {
        {
            this.#log('loadState bypassed: feature flag is disabled. Generating initial state', {
                caller: `${caller}.loadState`
            });
            return this.#generateInitialState();
        }
    }
    logContentionStats() {
        this.#errors.handleSync(() => {
            const contentionCount = this.#stateLock.getContentionCount();
            const contentionRate = this.#stateLock.getContentionRate();
            this.#log(`Current contention count: ${contentionCount}.\nCurrent contention rate: ${contentionRate}.`, {
                caller: `${caller}.logContentionStats`,
                level: 'debug'
            });
        }, `[${caller}]: Failed to log contention stats`);
    }
    redo() {
        return this.#errors.handleSync(() => {
            if (this.#undoStack.length > 0) {
                const redoState = this.#undoStack.pop();
                if (!redoState) {
                    this.#log('Cannot redo: No redoState found.', {
                        caller: `${caller}.redo`,
                        level: 'warn'
                    });
                    return;
                }
                this.#history.push(redoState);
                this.#state = { ...redoState };
                this.#log('Redo action performed.', {
                    caller: `${caller}.redo`,
                    level: 'debug'
                });
                this.#saveStateAndLog('redo', 3);
            }
            else {
                throw new Error('No state to redo.');
            }
        }, `[${caller}]: Redo operation failed`, { fallback: { redo: null } });
    }
    async resetState() {
        return await this.#errors.handleAsync(async () => {
            this.#trackAction();
            this.#state = defaultState;
            await this.#saveState();
            this.#log('App state has been reset', {
                caller: `${caller}.resetState`,
                level: 'debug'
            });
        }, `[${caller}]: Failed to reset state`, { fallback: defaultState });
    }
    setOnStateLoad(callback) {
        return this.#errors.handleSync(() => {
            this.#onStateLoadCallback = callback;
        }, `[${caller}]: Failed to set onStateLoad callback`);
    }
    async setState(newState, track = true) {
        return await this.#errors.handleAsync(async () => {
            return await this.#withWriteLock(async () => {
                if (track)
                    this.#trackAction();
                this.#observer.batchUpdate(newState);
                this.#state = newState;
                this.#log('State updated.', {
                    caller: `${caller}.setState`,
                    level: 'debug'
                });
                await this.#saveState();
                this.logContentionStats();
            });
        }, `[${caller}]: Failed to set state.`, { context: { newState, track } });
    }
    undo() {
        this.#errors.handleSync(() => {
            if (this.#history.length <= 1) {
                this.#log('No previous state to revert to.', {
                    caller: `${caller}.undo`
                });
                return;
            }
            const previousState = this.#history.pop();
            if (!previousState)
                return;
            this.#undoStack.push(this.#helpers.data.clone(this.#state)); // for redo
            this.#state = previousState;
            this.#observer.batchUpdate(previousState);
            this.#log('Undo action performed.', {
                caller: `${caller}.undo`,
                level: 'debug'
            });
            this.#saveStateAndLog('undo', 3);
        }, `[${caller}]: Undo operation failed`);
    }
    updateAppModeState(appMode, track) {
        return this.#errors.handleSync(() => {
            if (track)
                this.#trackAction();
            this.#state.appMode = appMode;
            this.#log(`Updated appMode: ${appMode}`, {
                caller: `${caller}.updateAppModeState`,
                level: 'debug'
            });
            this.#saveStateAndLog('appMode', 3);
        }, `[${caller}]: Failed to update app mode state`, { context: { appMode, track } });
    }
    async updateLockedProperty(key, value) {
        return this.#errors.handleAsync(async () => {
            const lock = this.#getLockForKey(key);
            await lock.runExclusive(async () => {
                this.#observer.set(key, value);
                this.#log(`Updated ${String(this.#helpers.data.clone(key))} with locked property.`, {
                    caller: `${caller}.updateLockedProperty`,
                    level: 'debug'
                });
                await this.#saveState();
                this.logContentionStats();
            });
        }, `[${caller}]: Failed to update locked property`, { context: { key, value } });
    }
    updatePaletteColumns(columns, track, verbosity) {
        return this.#errors.handleSync(() => {
            if (!this.#state || !this.#state.paletteContainer) {
                throw new Error(`[${caller}]: updatePaletteColumns called before state initialization.`);
            }
            if (!this.#helpers.dom.getElement(domIndex.ids.divs.paletteContainer)) {
                this.#log('Palette Container not found in the DOM.', {
                    caller: `${caller}.updatePaletteColumns`,
                    level: 'warn'
                });
            }
            if (track)
                this.#trackAction();
            this.#state.paletteContainer.columns = columns;
            this.#log(`Updated paletteContainer columns`, {
                caller: `${caller}.updatePaletteColumns`,
                level: 'debug'
            });
            this.#saveStateAndLog('paletteColumns', verbosity);
            this.logContentionStats();
        }, `[${caller}]: Failed to update palette columns.`, { context: { columns, track, verbosity } });
    }
    updatePaletteColumnSize(columnID, newSize) {
        return this.#errors.handleSync(() => {
            const columns = this.#state.paletteContainer.columns;
            const columnIndex = columns.findIndex(col => col.id === columnID);
            if (columnIndex === -1)
                return;
            const minSize = domConfig.minColumnSize;
            const maxSize = domConfig.maxColumnSize;
            const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));
            const sizeDifference = adjustedSize - columns[columnIndex].size;
            columns[columnIndex].size = adjustedSize;
            const unlockedColumns = columns.filter((col, index) => index !== columnIndex && !col.isLocked);
            const distributionAmount = sizeDifference / unlockedColumns.length;
            unlockedColumns.forEach(col => (col.size -= distributionAmount));
            const finalTotalSize = columns.reduce((sum, col) => sum + col.size, 0);
            const correctionFactor = 100 / finalTotalSize;
            columns.forEach(col => (col.size *= correctionFactor));
            this.#log(`Updated column size`, {
                caller: `${caller}}.updatePaletteColumnSize`,
                level: 'debug'
            });
            this.#saveStateAndLog('paletteColumnSize', 3);
            this.logContentionStats();
        }, `[${caller}]: Failed to update palette column size.`, { context: { columnID, newSize } });
    }
    updatePaletteHistory(updatedHistory) {
        return this.#errors.handleSync(() => {
            this.#trackAction();
            this.#state.paletteHistory = updatedHistory;
            this.#saveState();
            this.#log('Updated palette history', {
                caller: `${caller}.updatePaletteHistory`,
                level: 'debug'
            });
            this.logContentionStats();
        }, `[${caller}: Failed to update palette history.`, { context: { updatedHistory } });
    }
    updateSelections(selections, track) {
        return this.#errors.handleSync(() => {
            if (track)
                this.#trackAction();
            this.#observer.set('selections', {
                ...this.#observer.get('selections'),
                ...selections
            });
            this.#log(`Updated selections`, {
                caller: `${caller}]: .updateSelections`,
                level: 'debug'
            });
            this.#saveStateAndLog('selections', 2);
            this.logContentionStats();
        }, `[${caller}]: Failed to update selections.`, { context: { selections, track } });
    }
    #generateInitialState() {
        return (this.#errors.handleSync(() => {
            this.#log('Generating initial state.', {
                caller: `${caller}.#generateInitialState`,
                level: 'debug'
            });
            const columns = this.#utils.dom.scanPaletteColumns() ?? [];
            if (!columns) {
                this.#log('No palette columns found!', {
                    caller: `${caller}.#generateInitialState`,
                    level: 'error'
                });
            }
            this.#log(`Scanned palette columns.`, {
                caller: `${caller}.#generateInitialState`,
                level: 'debug'
            });
            this.logContentionStats();
            return {
                appMode: 'edit',
                paletteContainer: { columns },
                paletteHistory: [],
                preferences: {
                    colorSpace: 'hsl',
                    distributionType: 'soft',
                    maxHistory: 20,
                    maxPaletteHistory: 10,
                    theme: 'light'
                },
                selections: {
                    paletteColumnCount: columns.length,
                    paletteType: 'complementary',
                    targetedColumnPosition: 1
                },
                timestamp: this.#helpers.data.getFormattedTimestamp()
            };
        }, `[${caller}]: Failed to generate initial state`) ?? {});
    }
    #getLockForKey(key) {
        if (!this.#dataLocks.has(key)) {
            this.#dataLocks.set(key, new Mutex(this.#errors, this.#log));
        }
        return this.#dataLocks.get(key);
    }
    #saveStateAndLog(property, verbosity) {
        this.#log(`StateManager Updated ${property}`, {
            caller: `${caller}.#saveStateAndLog`,
            verbosity: verbosity ?? 0
        });
        this.#saveState();
    }
    async #saveState(throttle = true) {
        const saveOperation = async (attempts = 0) => {
            try {
                await this.#storage.setItem('appState', this.#state);
                this.#log('State saved to storage.', {
                    caller: `${caller}.#saveState`,
                    level: 'debug'
                });
            }
            catch (err) {
                if (attempts < env.state.maxSaveRetries) {
                    this.#log(`Save attempt ${attempts + 1} failed. Retrying...`, {
                        caller: `${caller}.#saveState`,
                        level: 'warn'
                    });
                    await saveOperation(attempts + 1);
                }
                else {
                    this.#log('Max save attempts reached. Save failed.', {
                        caller: `${caller}.#saveState`,
                        level: 'error'
                    });
                }
            }
        };
        if (throttle) {
            if (this.#saveThrottleTimer) {
                clearTimeout(this.#saveThrottleTimer);
            }
            this.#saveThrottleTimer = setTimeout(() => saveOperation(), env.state.saveThrottleDelay);
        }
        else {
            await saveOperation();
        }
    }
    // push a copy of the current state before making changes
    #trackAction() {
        return this.#errors.handleSync(() => {
            const clonedState = this.#helpers.data.clone(this.#state);
            this.#history.push(clonedState);
            if (this.#history.length > env.app.historyLimit)
                this.#history.shift();
        }, `[${caller}]: Failed to track action.`);
    }
    async withPropertyLock(key, callback) {
        return this.#errors.handleAsync(async () => {
            const lock = this.#getLockForKey(key);
            const acquired = await lock.acquireWriteWithTimeout(env.mutex.timeout);
            if (!acquired) {
                this.#log(`Lock acquisition timed out for property: ${String(key)}`, {
                    caller: `${caller}.withPropertyLock`,
                    level: 'warn'
                });
                throw new Error(`Timeout acquiring lock for property ${String(key)}.`);
            }
            try {
                return await callback(this.#state[key]);
            }
            finally {
                await lock.release();
            }
        }, `[${caller}: Failed to acquire property lock`, { context: { key } });
    }
    async #withReadLock(callback) {
        return this.#errors.handleAsync(async () => {
            const acquired = await this.#stateLock.acquireReadWithTimeout(env.mutex.timeout);
            if (!acquired)
                throw new Error('Read lock acquisition timed out.');
            try {
                return callback();
            }
            finally {
                await this.#stateLock.release();
            }
        }, `[${caller}]: Failed to acquire read lock`);
    }
    async #withWriteLock(callback) {
        return this.#errors.handleAsync(async () => {
            const acquired = await this.#stateLock.acquireWriteWithTimeout(env.mutex.timeout);
            if (!acquired)
                throw new Error('Write lock acquisition timed out.');
            try {
                return await callback();
            }
            finally {
                await this.#stateLock.release();
            }
        }, `[${caller}]: Failed to acquire write lock`);
    }
}

export { StateManager };
//# sourceMappingURL=StateManager.js.map
