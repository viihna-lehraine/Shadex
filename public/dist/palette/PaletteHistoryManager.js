import { StorageManager } from '../storage/StorageManager.js';
import { env } from '../config/partials/env.js';
import '../config/partials/defaults.js';
import '../config/partials/regex.js';

// File: palette/PaletteHistoryManager.ts
const caller = 'PaletteHistoryManager';
const paletteHistoryLimit = env.app.paletteHistoryLimit;
class PaletteHistoryManager {
    static #instance = null;
    #paletteHistory;
    #redoStack;
    #undoStack;
    #deepFreeze;
    #errors;
    #log;
    #storage;
    constructor(helpers, services) {
        try {
            services.log.info(`Constructing ${caller} instance`, `[${caller} constructor]`);
            this.#paletteHistory = [];
            this.#redoStack = [];
            this.#undoStack = [];
            this.#deepFreeze = helpers.data.deepFreeze;
            this.#errors = services.errors;
            this.#log = services.log;
            this.init(services).catch(error => {
                this.#log.error(`${caller} initialization failed.`, `[${caller} constructor]`);
                console.error(error);
            });
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, services) {
        return services.errors.handleSync(() => {
            if (!PaletteHistoryManager.#instance) {
                services.log.debug(`Creating ${caller} instance.`, `${caller}.getInstance`);
                PaletteHistoryManager.#instance = new PaletteHistoryManager(helpers, services);
            }
            services.log.debug(`Retrieving ${caller} instance`, `${caller}.getInstance`);
            return PaletteHistoryManager.#instance;
        }, `[${caller}.getInstance]: Failed to get instance.`);
    }
    async init(services) {
        return this.#errors.handleAsync(async () => {
            this.#log.debug(`Initializing ${caller}.`, `[${caller}.init]`);
            this.#storage = await StorageManager.getInstance(services);
            this.#paletteHistory = await this.#loadPaletteHistory();
        }, `[${caller}.init]: Initialization error.`);
    }
    addPalette(palette) {
        return this.#errors.handleSync(() => {
            if (this.#paletteHistory.length >= paletteHistoryLimit) {
                this.#paletteHistory.shift();
            }
            this.#paletteHistory.push(this.#deepFreeze(palette));
            this.#redoStack = [];
            this.#savePaletteHistory();
            this.#log.info(`Palette added to history.`, `[${caller}.addPalette]`);
        }, `[${caller}.addPalette]: Failed to add palette to history.`);
    }
    clearHistory() {
        return this.#errors.handleSync(() => {
            this.#paletteHistory = [];
            this.#undoStack = [];
            this.#redoStack = [];
            this.#savePaletteHistory();
            this.#log.info(`Palette history cleared.`, `[${caller}.clearHistory]`);
        }, `[${caller}.clearHistory]: Failed to clear palette history.`);
    }
    getCurrentPalette() {
        return this.#errors.handleSync(() => {
            return this.#paletteHistory.length
                ? this.#paletteHistory[this.#paletteHistory.length - 1]
                : null;
        }, `[${caller}.getCurrentPalette]: Palette retrieval error.`);
    }
    getHistory() {
        return this.#errors.handleSync(() => {
            return this.#paletteHistory.map(palette => this.#deepFreeze(palette));
        }, `[${caller}.getHistory]: Failed to retrieve palette history.`);
    }
    redo() {
        return this.#errors.handleSync(() => {
            if (this.#redoStack.length) {
                const redoPalette = this.#redoStack.pop();
                if (!redoPalette) {
                    this.#log.info(`No palette to redo.`, `[${caller}.redo]`);
                    return null;
                }
                this.#paletteHistory.push(redoPalette);
                this.#savePaletteHistory();
                return redoPalette;
            }
            return null;
        }, `[${caller}.redo]: Failed to redo palette.`);
    }
    undo() {
        return this.#errors.handleSync(() => {
            if (this.#paletteHistory.length > 1) {
                const lastPalette = this.#paletteHistory.pop();
                if (!lastPalette) {
                    this.#log.info(`No palette to undo.`, `[${caller}.undo]`);
                    return null;
                }
                this.#undoStack.push(lastPalette);
                this.#redoStack.push(lastPalette);
                this.#savePaletteHistory();
                return this.getCurrentPalette();
            }
            return null;
        }, `[${caller}.undo]: Failed to undo palette.`);
    }
    async #loadPaletteHistory() {
        return this.#errors.handleAsync(async () => {
            const storedHistory = await this.#storage.getItem('paletteHistory');
            if (storedHistory) {
                this.#log.info(`Loaded palette history from storage.`, `[${caller}.#loadPaletteHistory]`);
                return storedHistory;
            }
            this.#log.debug(`No saved palette history found.`, `[${caller}.#loadPaletteHistory]`);
            return [];
        }, `[${caller}.#loadPaletteHistory]: Failed to load palette history.`);
    }
    async #savePaletteHistory() {
        return this.#errors.handleAsync(async () => {
            await this.#storage.setItem('paletteHistory', this.#paletteHistory);
            this.#log.info(`Palette history saved to storage.`, `[${caller}.#savePaletteHistory]`);
        }, `[${caller}.#savePaletteHistory]: Failed to save palette history.`);
    }
}

export { PaletteHistoryManager };
//# sourceMappingURL=PaletteHistoryManager.js.map
