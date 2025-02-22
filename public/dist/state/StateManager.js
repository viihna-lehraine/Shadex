import { StorageManager } from '../storage/StorageManager.js';
import { domIndex, defaults, domConfig } from '../config/index.js';

// File: state/StateManager.ts
const defaultState = defaults.state;
const maxStateReadyAttempts = 20;
class StateManager {
    static #instance = null;
    #onStateLoadCallback = null;
    #history;
    #state;
    #undoStack;
    #log;
    #errors;
    #helpers;
    #utils;
    #storage;
    constructor(helpers, services, utils) {
        this.#log = services.log;
        this.#errors = services.errors;
        this.#helpers = helpers;
        this.#utils = utils;
        this.#storage = new StorageManager(services);
        this.#state = {};
        this.#state.paletteHistory = [];
        this.#history = [this.#state];
        this.#undoStack = [];
        this.init()
            .then(() => {
            this.#saveStateAndLog('init', 3);
        })
            .catch(error => {
            this.#log('StateManager init failed.', {
                caller: '[StateManager constructor]',
                level: 'error'
            });
            console.error(error);
        });
    }
    static getInstance(helpers, services, utils) {
        if (!StateManager.#instance) {
            services.log(`Creating new StateManager instance.`, {
                caller: '[StateManager.getInstance]',
                level: 'debug'
            });
            StateManager.#instance = new StateManager(helpers, services, utils);
        }
        services.log(`Returning StateManager instance.`, {
            caller: '[StateManager.getInstance]',
            level: 'debug'
        });
        return StateManager.#instance;
    }
    async init() {
        this.#log('Initializing State Manager', {
            caller: '[StateManager.init]',
            level: 'debug'
        });
        await this.#storage.init();
        this.#state =
            (await this.#errors.handleAsync(() => this.loadState(), 'Failed to load state. Generating initial state.')) ?? this.#generateInitialState();
        this.#log('StateManager initialized successfully.', {
            caller: '[StateManager.init]',
            level: 'debug'
        });
        await this.#saveState();
    }
    addPaletteToHistory(palette) {
        return this.#errors.handleSync(() => {
            this.#trackAction();
            this.#state.paletteHistory.push(palette);
            this.#saveStateAndLog('paletteHistory', 3);
        }, 'Failed to add palette to history', { context: { palette } });
    }
    async ensureStateReady() {
        return await this.#errors.handleAsync(async () => {
            let attempts = 0;
            while (!this.#state || !this.#state.paletteContainer) {
                if (attempts++ >= maxStateReadyAttempts) {
                    this.#log('State initialization timed out.', {
                        caller: '[StateManager.ensureStateReady]',
                        level: 'error'
                    });
                    throw new Error('State initialization timed out.');
                }
                this.#log(`Waiting for state to initialize... (Attempt ${attempts})`, {
                    caller: '[StateManager.ensureStateReady]',
                    level: 'debug',
                    verbosity: 3
                });
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            this.#log('State is now initialized.', {
                caller: '[StateManager.ensureStateReady]'
            });
        }, 'Failed to ensure state readiness', { context: { maxStateReadyAttempts } });
    }
    getState() {
        return (this.#errors.handleSync(() => {
            if (!this.#state) {
                throw new Error('State accessed before initialization.');
            }
            if (!this.#state.preferences) {
                this.#log('State.preferences is undefined. Adding default preferences.', {
                    caller: '[StateManager.getState]',
                    level: 'warn'
                });
                this.#state.preferences = defaultState.preferences;
            }
            return this.#state;
        }, 'Error retrieving state') ?? defaultState);
    }
    async loadState() {
        return this.#errors.handleAsync(async () => {
            this.#log('Attempting to load state...', {
                caller: '[StateManager.loadState]',
                level: 'debug'
            });
            const storedState = await this.#storage.getItem('appState');
            if (storedState) {
                this.#state = storedState;
                this.#log('Loaded stored state', {
                    caller: '[StateManager.loadState]',
                    level: 'debug'
                });
                this.#onStateLoadCallback?.();
                return storedState;
            }
            this.#log('No stored state found. Generating initial state.', {
                caller: '[StateManager.loadState]',
                level: 'warn'
            });
            return this.#generateInitialState();
        }, 'Failed to load state');
    }
    redo() {
        return this.#errors.handleSync(() => {
            if (this.#undoStack.length > 0) {
                const redoState = this.#undoStack.pop();
                if (!redoState) {
                    this.#log('Cannot redo: No redoState found.', {
                        caller: '[StateManager.redo]',
                        level: 'warn'
                    });
                    return;
                }
                this.#history.push(redoState);
                this.#state = { ...redoState };
                this.#log('Redo action performed.', {
                    caller: '[StateManager.redo]',
                    level: 'debug'
                });
                this.#saveStateAndLog('redo', 3);
            }
            else {
                throw new Error('No state to redo.');
            }
        }, 'Redo operation failed', { fallback: { redo: null } });
    }
    async resetState() {
        return await this.#errors.handleAsync(async () => {
            this.#trackAction();
            this.#state = defaultState;
            await this.#saveState();
            this.#log('App state has been reset', {
                caller: '[StateManager.resetState]',
                level: 'debug'
            });
        }, 'Failed to reset state', { fallback: defaultState });
    }
    setOnStateLoad(callback) {
        return this.#errors.handleSync(() => {
            this.#onStateLoadCallback = callback;
        }, 'Failed to set onStateLoad callback');
    }
    async setState(state, track) {
        return await this.#errors.handleAsync(async () => {
            if (track)
                this.#trackAction();
            this.#state = state;
            this.#log('App state has been updated', {
                caller: '[StateManager.setState]',
                level: 'debug'
            });
            await this.#saveState();
        }, 'Failed to set state', { context: { state, track } });
    }
    undo() {
        return this.#errors.handleSync(() => {
            if (this.#history.length < 1) {
                throw new Error('No previous state to revert to.');
            }
            this.#trackAction();
            this.#undoStack.push(this.#history.pop());
            this.#state = { ...this.#history[this.#history.length - 1] };
            this.#log('Undo action performed.', {
                caller: '[StateManager.undo]',
                level: 'debug'
            });
            this.#saveStateAndLog('undo', 3);
        }, 'Undo operation failed', { fallback: { undo: null } });
    }
    updateAppModeState(appMode, track) {
        return this.#errors.handleSync(() => {
            if (track)
                this.#trackAction();
            this.#state.appMode = appMode;
            this.#log(`Updated appMode: ${appMode}`, {
                caller: '[StateManager.updateAppModeState]',
                level: 'debug'
            });
            this.#saveStateAndLog('appMode', 3);
        }, 'Failed to update app mode state', { context: { appMode, track } });
    }
    updatePaletteColumns(columns, track, verbosity) {
        return this.#errors.handleSync(() => {
            if (!this.#state || !this.#state.paletteContainer) {
                throw new Error('updatePaletteColumns() called before state initialization.');
            }
            if (!this.#helpers.dom.getElement(domIndex.ids.divs.paletteContainer)) {
                this.#log('Palette Container not found in the DOM.', {
                    caller: '[StateManager.updatePaletteColumns]',
                    level: 'warn'
                });
            }
            if (track)
                this.#trackAction();
            this.#state.paletteContainer.columns = columns;
            this.#log(`Updated paletteContainer columns`, {
                caller: '[StateManager.updatePaletteColumns]',
                level: 'debug'
            });
            this.#saveStateAndLog('paletteColumns', verbosity);
        }, 'Failed to update palette columns', { context: { columns, track, verbosity } });
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
                caller: '[StateManager.updatePaletteColumnSize]',
                level: 'debug'
            });
            this.#saveStateAndLog('paletteColumnSize', 3);
        }, 'Failed to update palette column size', { context: { columnID, newSize } });
    }
    updatePaletteHistory(updatedHistory) {
        return this.#errors.handleSync(() => {
            this.#trackAction();
            this.#state.paletteHistory = updatedHistory;
            this.#saveState();
            this.#log('Updated palette history', {
                caller: '[StateManager.updatePaletteHistory]',
                level: 'debug'
            });
        }, 'Failed to update palette history', { context: { updatedHistory } });
    }
    updateSelections(selections, track) {
        return this.#errors.handleSync(() => {
            if (track)
                this.#trackAction();
            this.#state.selections = {
                ...this.#state.selections,
                ...selections
            };
            this.#log(`Updated selections`, {
                caller: '[StateManager.updateSelections]',
                level: 'debug'
            });
            this.#saveStateAndLog('selections', 2);
        }, 'Failed to update selections', { context: { selections, track } });
    }
    #generateInitialState() {
        return (this.#errors.handleSync(() => {
            this.#log('[StateManager.#generateInitialState] Generating initial state...', {
                caller: '[StateManager.#generateInitialState]',
                level: 'debug'
            });
            const columnData = this.#utils.dom.scanPaletteColumns();
            if (!columnData || columnData.length === 0) {
                this.#log('No palette columns found!', {
                    caller: '[StateManager.#generateInitialState]',
                    level: 'error'
                });
            }
            this.#log(`Scanned ${columnData.length} columns in Palette Container element`, {
                caller: '[StateManager.#generateInitialState]',
                level: 'debug'
            });
            return {
                appMode: 'edit',
                paletteContainer: { columns: columnData ?? [] },
                paletteHistory: [],
                preferences: {
                    colorSpace: 'hsl',
                    distributionType: 'soft',
                    maxHistory: 20,
                    maxPaletteHistory: 10,
                    theme: 'light'
                },
                selections: {
                    paletteColumnCount: columnData.length ?? 0,
                    paletteType: 'complementary',
                    targetedColumnPosition: 1
                },
                timestamp: this.#helpers.data.getFormattedTimestamp()
            };
        }, 'Failed to generate initial state') ?? {});
    }
    #saveStateAndLog(property, verbosity) {
        this.#log(`StateManager Updated ${property}`, {
            caller: '[StateManager.#saveStateAndLog]',
            verbosity: verbosity ?? 0
        });
        this.#saveState();
    }
    async #saveState() {
        return await this.#errors.handleAsync(() => this.#storage.setItem('appState', this.#state), 'Failed to save app state.');
    }
    #trackAction() {
        // push a copy of the current state before making changes
        this.#history.push({ ...this.#state });
    }
}

export { StateManager };
//# sourceMappingURL=StateManager.js.map
