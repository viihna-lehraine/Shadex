import { StorageManager } from '../storage/StorageManager.js';
import { domIndex, config, domConfig } from '../config/index.js';

// File: state/StateManager.js
const defaultState = config.defaults.state;
class StateManager {
    static instance = null;
    onStateLoadCallback = null;
    history;
    state;
    undoStack;
    log;
    errors;
    utils;
    storage;
    constructor(services, utils) {
        this.log = services.log;
        this.errors = services.errors;
        this.utils = utils;
        this.storage = new StorageManager(services);
        this.state = {};
        this.state.paletteHistory = [];
        this.history = [this.state];
        this.undoStack = [];
        this.init();
        this.saveStateAndLog('init', 3);
    }
    static getInstance(services, utils) {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager(services, utils);
        }
        return StateManager.instance;
    }
    async init() {
        this.log('Initializing State Manager', 'debug');
        await this.storage.init();
        this.state =
            (await this.errors.handleAsync(() => this.loadState(), 'Failed to load state. Generating initial state.')) ?? this.generateInitialState();
        this.log('StateManager initialized successfully.', 'debug');
        await this.saveState();
    }
    addPaletteToHistory(palette) {
        this.errors.handle(() => {
            this.trackAction();
            this.state.paletteHistory.push(palette);
            this.saveStateAndLog('paletteHistory', 3);
        }, 'Failed to add palette to history', { palette });
    }
    async ensureStateReady() {
        let attempts = 0;
        const maxAttempts = 20; // prevent infinite loop
        while (!this.state || !this.state.paletteContainer) {
            if (attempts++ >= maxAttempts) {
                this.log('State initialization timed out.', 'error');
                break;
            }
            this.log(`Waiting for state to initialize... (Attempt ${attempts})`, 'debug', 3);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        this.log('State is now initialized.');
    }
    getState() {
        return (this.errors.handle(() => {
            if (!this.state) {
                throw new Error('State accessed before initialization.');
            }
            if (!this.state.preferences) {
                this.log('State.preferences is undefined. Adding default preferences.', 'warn');
                this.state.preferences = defaultState.preferences;
            }
            return this.state;
        }, 'Error retrieving state') ?? defaultState);
    }
    async loadState() {
        const storedState = await this.storage.getItem('appState');
        if (storedState) {
            this.state = storedState;
            if (this.onStateLoadCallback) {
                this.onStateLoadCallback();
            }
            return storedState;
        }
        else {
            this.log('No stored state found.', 'warn');
            return this.generateInitialState();
        }
    }
    redo() {
        this.errors.handle(() => {
            if (this.undoStack.length > 0) {
                const redoState = this.undoStack.pop();
                if (!redoState) {
                    this.log('Cannot redo: No redoState found.', 'debug');
                    return;
                }
                this.history.push(redoState);
                this.state = { ...redoState };
                this.log('Redo action performed.', 'debug');
                this.saveStateAndLog('redo', 3);
            }
            else {
                throw new Error('No state to redo.');
            }
        }, 'Redo operation failed');
    }
    async resetState() {
        await this.errors.handleAsync(async () => {
            this.trackAction();
            this.state = defaultState;
            await this.saveState();
            this.log('App state has been reset', 'debug');
        }, 'Failed to reset state');
    }
    setOnStateLoad(callback) {
        this.errors.handle(() => {
            this.onStateLoadCallback = callback;
        }, 'Failed to set onStateLoad callback');
    }
    async setState(state, track) {
        if (track)
            this.trackAction();
        this.state = state;
        this.log('App state has been updated', 'debug');
        await this.saveState();
    }
    undo() {
        this.errors.handle(() => {
            if (this.history.length < 1) {
                throw new Error('No previous state to revert to.');
            }
            this.trackAction();
            this.undoStack.push(this.history.pop());
            this.state = { ...this.history[this.history.length - 1] };
            this.log('Undo action performed.', 'debug');
            this.saveStateAndLog('undo', 3);
        }, 'Undo operation failed');
    }
    updateAppModeState(appMode, track) {
        this.errors.handle(() => {
            if (track)
                this.trackAction();
            this.state.appMode = appMode;
            this.log(`Updated appMode: ${appMode}`);
            this.saveStateAndLog('appMode', 3);
        }, 'Failed to update app mode state', { appMode, track });
    }
    updatePaletteColumns(columns, track, verbosity) {
        this.errors.handle(() => {
            if (!this.state || !this.state.paletteContainer) {
                throw new Error('updatePaletteColumns() called before state initialization.');
            }
            if (!this.utils.core.getElement(domIndex.ids.divs.paletteContainer)) {
                this.log('Palette Container not found in the DOM.', 'warn');
            }
            if (track)
                this.trackAction();
            this.state.paletteContainer.columns = columns;
            this.log(`Updated paletteContainer columns`, 'debug');
            this.saveStateAndLog('paletteColumns', verbosity);
        }, 'Failed to update palette columns', { columns, track, verbosity });
    }
    updatePaletteColumnSize(columnID, newSize) {
        this.errors.handle(() => {
            const columns = this.state.paletteContainer.columns;
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
            this.log(`Updated column size`, 'debug');
            this.saveStateAndLog('paletteColumnSize', 3);
        }, 'Failed to update palette column size', { columnID, newSize });
    }
    updatePaletteHistory(updatedHistory) {
        this.errors.handle(() => {
            this.trackAction();
            this.state.paletteHistory = updatedHistory;
            this.saveState();
            this.log('Updated palette history');
        }, 'Failed to update palette history', { updatedHistory });
    }
    updateSelections(selections, track) {
        this.errors.handle(() => {
            if (track)
                this.trackAction();
            this.state.selections = {
                ...this.state.selections,
                ...selections
            };
            this.log(`Updated selections`, 'debug');
            this.saveStateAndLog('selections', 2);
        }, 'Failed to update selections', { selections, track });
    }
    generateInitialState() {
        return (this.errors.handle(() => {
            const columnData = this.utils.dom.scanPaletteColumns();
            this.log(`Scanned ${columnData.length} columns in Palette Container element`, 'debug');
            return {
                appMode: 'edit',
                paletteContainer: { columns: columnData || [] },
                paletteHistory: [],
                preferences: {
                    colorSpace: 'hsl',
                    distributionType: 'soft',
                    maxHistory: 20,
                    maxPaletteHistory: 10,
                    theme: 'light'
                },
                selections: {
                    paletteColumnCount: columnData.length,
                    paletteType: 'complementary',
                    targetedColumnPosition: 1
                },
                timestamp: this.utils.app.getFormattedTimestamp()
            };
        }, 'Failed to generate initial state') ?? defaultState);
    }
    saveStateAndLog(property, verbosity) {
        this.log(`StateManager Updated ${property}`, 'debug', verbosity);
        this.saveState();
    }
    async saveState() {
        await this.errors.handleAsync(() => this.storage.setItem('appState', this.state), 'Failed to save app state.');
    }
    trackAction() {
        // push a copy of the current state before making changes
        this.history.push({ ...this.state });
    }
}

export { StateManager };
//# sourceMappingURL=StateManager.js.map
