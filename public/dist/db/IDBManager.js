// File: db/IDBManager.js
import { MutationTracker } from './mutations/index.js';
import { configData as config } from '../data/config.js';
import { commonFn } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { initializeDB } from './initialize.js';
import { dbUtils } from './utils.js';
import { modeData as mode } from '../data/mode.js';
const thisModule = 'db/IDBManager.js';
const logger = await createLogger();
export class IDBManager {
    static instance = null;
    dbPromise;
    dbData = config.db;
    mode = mode;
    logMode = mode.logging;
    cache = {};
    defaultKeys = config.db.DEFAULT_KEYS;
    defaultSettings = config.db.DEFAULT_SETTINGS;
    storeNames = config.db.STORE_NAMES;
    dbUtils;
    utils;
    mutationTracker;
    constructor() {
        this.dbPromise = initializeDB();
        this.dbData = this.dbData;
        this.defaultKeys = config.db.DEFAULT_KEYS;
        this.defaultSettings = config.db.DEFAULT_SETTINGS;
        this.storeNames = config.db.STORE_NAMES;
        this.dbUtils = dbUtils;
        this.utils = commonFn.utils;
        this.mutationTracker = MutationTracker.getInstance(this.dbData, this.mode);
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * STATIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    static async getInstance() {
        if (!this.instance) {
            this.instance = new IDBManager();
            await this.instance.initializeDB();
        }
        return this.instance;
    }
    static resetInstance() {
        this.instance = null;
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * * PUBLIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    createMutationLogger(obj, key) {
        const thisMethod = 'createMutationLogger()';
        const self = this;
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                const success = Reflect.set(target, property, value);
                if (success) {
                    const mutationLog = {
                        timestamp: new Date().toISOString(),
                        key,
                        action: 'update',
                        newValue: { [property]: value },
                        oldValue: { [property]: oldValue },
                        origin: 'Proxy'
                    };
                    if (self.logMode.info)
                        logger.info(`Mutation detected: ${JSON.stringify(mutationLog)}`, `${thisModule} > ${thisMethod}`);
                    self.mutationTracker
                        .persistMutation(mutationLog)
                        .catch(err => {
                        if (self.logMode.error)
                            logger.error(`Failed to persist mutation: ${err.message}`, `${thisModule} > ${thisMethod}`);
                    });
                }
                return success;
            }
        });
    }
    createPaletteObject(type, items, paletteID, swatches, enableAlpha, limitDark, limitGray, limitLight) {
        return this.utils.palette.createObject(type, items, swatches, paletteID, enableAlpha, limitDark, limitGray, limitLight);
    }
    // *DEV-NOTE* add this method to docs
    async deleteEntry(storeName, key) {
        const thisMethod = 'deleteEntry()';
        return this.utils.errors.handleAsync(async () => {
            if (!(await this.ensureEntryExists(storeName, key))) {
                if (this.logMode.warn) {
                    logger.warn(`Entry with key ${key} not found.`, `${thisModule} > ${thisMethod}`);
                }
                return;
            }
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            await store.delete(key);
            if (!this.mode.quiet) {
                logger.info(`Entry with key ${key} deleted successfully.`, `${thisModule} > ${thisMethod}`);
            }
        }, 'IDBManager.deleteData(): Error deleting entry');
    }
    async deleteEntries(storeName, keys) {
        const thisMethod = 'deleteEntries()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            const validKeys = (await Promise.all(keys.map(async (key) => (await this.ensureEntryExists(storeName, key))
                ? key
                : null))).filter((key) => key !== null);
            await Promise.all(validKeys.map(key => store.delete(key)));
            if (!this.mode.quiet) {
                logger.info(`Entries deleted successfully. Keys: ${validKeys}`, `${thisModule} > ${thisMethod}`);
            }
        }, 'IDBManager.deleteEntries(): Error deleting entries');
    }
    async getCurrentPaletteID() {
        const thisMethod = 'getCurrentPaletteID()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                logger.info(`Fetched settings from IndexedDB: ${settings}`, `${thisModule} > ${thisMethod}`);
            return settings?.lastPaletteID ?? 0;
        }, 'IDBManager: getCurrentPaletteID(): Error fetching current palette ID');
    }
    async getCachedSettings() {
        if (this.cache.settings)
            return this.cache.settings;
        const settings = await this.getSettings();
        if (settings)
            this.cache.settings = settings;
        return settings;
    }
    async getCustomColor() {
        const key = this.defaultKeys['CUSTOM_COLOR'];
        const storeName = this.storeNames['CUSTOM_COLOR'];
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const entry = await db.get(storeName, key);
            if (!entry?.color)
                return null;
            this.cache.customColor = entry.color;
            return this.createMutationLogger(entry.color, storeName);
        }, 'IDBManager.getCustomColor(): Error fetching custom color');
    }
    async getDB() {
        return this.dbPromise;
    }
    getLoggedObject(obj, key) {
        if (obj) {
            return this.createMutationLogger(obj, key);
        }
        return null;
    }
    async getNextTableID() {
        return this.utils.errors.handleAsync(async () => {
            const settings = await this.getSettings();
            const lastTableID = settings.lastTableID ?? 0;
            const nextID = lastTableID + 1;
            await this.saveData('settings', 'appSettings', {
                ...settings,
                lastTableID: nextID
            });
            return `palette_${nextID}`;
        }, 'IDBManager.getNextTableID(): Error fetching next table ID');
    }
    async getNextPaletteID() {
        return this.utils.errors.handleAsync(async () => {
            const currentID = await this.getCurrentPaletteID();
            const newID = currentID + 1;
            await this.updateCurrentPaletteID(newID);
            return newID;
        }, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
    }
    async getSettings() {
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            return settings ?? this.defaultSettings;
        }, 'IDBManager.getSettings(): Error fetching settings');
    }
    async getStore(storeName, mode) {
        const db = await this.getDB();
        return db.transaction(storeName, mode).objectStore(storeName);
    }
    async resetDatabase() {
        const thisMethod = 'resetDatabase()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const availableStores = Array.from(db.objectStoreNames);
            const expectedStores = Object.values(this.storeNames);
            for (const storeName of expectedStores) {
                if (!availableStores.includes(storeName)) {
                    logger.warn(`Object store "${storeName}" not found in IndexedDB.`, `${thisModule} > ${thisMethod}`);
                    continue;
                }
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear();
                await tx.done;
                const settingsStore = db
                    .transaction(this.storeNames['SETTINGS'], 'readwrite')
                    .objectStore(this.storeNames['SETTINGS']);
                await settingsStore.put(this.defaultSettings, this.getDefaultKey('APP_SETTINGS'));
                if (!this.mode.quiet)
                    logger.info(`IndexedDB has been reset to default settings.`, `${thisModule} > ${thisMethod}`);
            }
        }, 'IDBManager.resetDatabase(): Error resetting database');
    }
    async deleteDatabase() {
        const thisMethod = 'deleteDatabase()';
        await this.utils.errors.handleAsync(async () => {
            const dbName = 'paletteDB';
            const dbExists = await new Promise(resolve => {
                const request = indexedDB.open(dbName);
                request.onsuccess = () => {
                    request.result.close();
                    resolve(true);
                };
                request.onerror = () => resolve(false);
            });
            if (dbExists) {
                const deleteRequest = indexedDB.deleteDatabase(dbName);
                deleteRequest.onsuccess = () => {
                    if (!this.mode.quiet)
                        logger.info(`Database "${dbName}" deleted successfully.`, `${thisModule} > ${thisMethod}`);
                };
                deleteRequest.onerror = event => {
                    logger.error(`Error deleting database "${dbName}":\nEvent: ${event}`, `${thisModule} > ${thisMethod}`);
                };
                deleteRequest.onblocked = () => {
                    if (this.logMode.warn)
                        logger.warn(`Delete operation blocked. Ensure no open connections to "${dbName}".`, `${thisModule} > ${thisMethod}`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    logger.warn(`Database "${dbName}" does not exist.`, `${thisModule} > ${thisMethod}`);
            }
        }, 'IDBManager.deleteDatabase(): Error deleting database');
    }
    // *DEV-NOTE* add this method to docs
    async resetPaletteID() {
        const thisMethod = 'resetPaletteID()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const storeName = this.storeNames['SETTINGS'];
            const key = this.getDefaultKey('APP_SETTINGS');
            const settings = await db.get(storeName, key);
            if (!settings)
                throw new Error('Settings not found. Cannot reset palette ID.');
            settings.lastPaletteID = 0;
            await db.put(storeName, { key, ...this.defaultSettings });
            if (!this.mode.quiet)
                logger.info(`Palette ID has successfully been reset to 0`, `${thisModule} > ${thisMethod}`);
        }, 'IDBManager.resetPaletteID(): Error resetting palette ID');
    }
    async saveData(storeName, key, data, oldValue) {
        const thisMethod = 'saveData()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            await this.dbUtils.store.withStore(db, storeName, 'readwrite', async (store) => {
                await store.put({ key, ...data });
                logger.mutation({
                    timestamp: new Date().toISOString(),
                    key,
                    action: 'update',
                    newValue: data,
                    oldValue: oldValue || null,
                    origin: 'saveData'
                }, mutationLog => {
                    console.log('Mutation log triggered for saveData:', mutationLog);
                }, `${thisModule} > ${thisMethod}`);
            });
        }, 'IDBManager.saveData(): Error saving data');
    }
    async savePalette(id, newPalette) {
        const thisMethod = 'savePalette()';
        return this.utils.errors.handleAsync(async () => {
            const store = await this.getStore('tables', 'readwrite');
            const paletteToSave = {
                tableID: newPalette.tableID,
                palette: newPalette.palette
            };
            await store.put({ key: id, ...paletteToSave });
            if (!this.mode.quiet)
                logger.info(`Palette ${id} saved successfully.`, `${thisModule} > ${thisMethod}`);
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteToDB(type, items, paletteID, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return this.utils.errors.handleAsync(async () => {
            const newPalette = this.createPaletteObject(type, items, paletteID, numBoxes, enableAlpha, limitDark, limitGray, limitLight);
            const idParts = newPalette.id.split('_');
            if (idParts.length !== 2 || isNaN(Number(idParts[1]))) {
                throw new Error(`Invalid palette ID format: ${newPalette.id}`);
            }
            await this.savePalette(newPalette.id, {
                tableID: parseInt(idParts[1], 10),
                palette: newPalette
            });
            return newPalette;
        }, 'IDBManager.savePaletteToDB(): Error saving palette to DB');
    }
    async saveSettings(newSettings) {
        const thisMethod = 'saveSettings()';
        return this.utils.errors.handleAsync(async () => {
            await this.saveData('settings', 'appSettings', newSettings);
            if (!this.mode.quiet && this.logMode.info)
                logger.info('Settings updated', `${thisModule} > ${thisMethod}`);
        }, 'IDBManager.saveSettings(): Error saving settings');
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        const thisMethod = 'updateEntryInPalette()';
        return this.utils.errors.handleAsync(async () => {
            if (!(await this.ensureEntryExists('tables', tableID))) {
                throw new Error(`Palette ${tableID} not found.`);
            }
            const storedPalette = await this.getTable(tableID);
            if (!storedPalette)
                throw new Error(`Palette ${tableID} not found.`);
            const { items } = storedPalette.palette;
            if (entryIndex >= items.length) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (this.logMode.error)
                    logger.error(`Entry ${entryIndex} not found in palette ${tableID}.`, `${thisModule} > ${thisMethod}`);
                if (!this.mode.quiet && this.logMode.info)
                    logger.warn('updateEntryInPalette: Entry not found.', `${thisModule} > ${thisMethod}`);
            }
            const oldEntry = items[entryIndex];
            items[entryIndex] = newEntry;
            await this.saveData('tables', tableID, storedPalette);
            logger.mutation({
                timestamp: new Date().toISOString(),
                key: `${tableID}-${entryIndex}]`,
                action: 'update',
                newValue: newEntry,
                oldValue: oldEntry,
                origin: 'updateEntryInPalette'
            }, mutationLog => console.log(`Mutation log trigger for updateEntryInPalette:`, mutationLog), `${thisModule} > ${thisMethod}`);
            if (!this.mode.quiet && this.logMode.info)
                logger.info(`Entry ${entryIndex} in palette ${tableID} updated.`);
        }, 'IDBManager.updateEntryInPalette(): Error updating entry in palette');
    }
    //
    ///
    ///// * * * *  * * * * * * * * * * * * * * * *
    ////// * * * * * * PRIVATE METHODS * * * * * *
    ///// * * * *  * * * * * * * * * * * * * * * *
    ///
    //
    async initializeDB() {
        const thisMethod = 'initializeDB()';
        await this.dbPromise;
        const db = await this.getDB();
        const storeName = this.storeNames['SETTINGS'];
        const key = this.getDefaultKey('APP_SETTINGS');
        logger.info(`Initializing DB with Store Name: ${storeName}, Key: ${key}`, `${thisModule} > ${thisMethod}`);
        if (!storeName || !key)
            throw new Error('Invalid store name or key.');
        const settings = await db.get(storeName, key);
        if (!settings) {
            if (!this.mode.quiet) {
                logger.info(`Initializing default settings...`, `${thisModule} > ${thisMethod}`);
            }
            await db.put(storeName, { key, ...this.defaultSettings });
        }
    }
    async ensureEntryExists(storeName, key) {
        const db = await this.getDB();
        const store = db
            .transaction(storeName, 'readonly')
            .objectStore(storeName);
        return (await store.get(key)) !== undefined;
    }
    getDefaultKey(key) {
        const defaultKey = this.defaultKeys[key];
        if (!defaultKey) {
            throw new Error(`[getDefaultKey()]: Invalid default key: ${key}`);
        }
        return defaultKey;
    }
    async getTable(id) {
        const thisMethod = 'getTable()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const result = await db.get(this.storeNames.TABLES, id);
            if (!result) {
                if (this.logMode.warn)
                    logger.warn(`Table with ID ${id} not found.`, `${thisModule} > ${thisMethod}`);
            }
            return result;
        }, 'IDBManager.getTable(): Error fetching table');
    }
    async updateCurrentPaletteID(newID) {
        const thisMethod = 'updateCurrentPaletteID()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            if (this.mode.debug)
                logger.info(`Updating curent palette ID to ${newID}`, `${thisModule} > ${thisMethod}`);
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                logger.info(`Current palette ID updated to ${newID}`, `${thisModule} > ${thisMethod}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9JREJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlCQUF5QjtBQWtCekIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLElBQUksTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDO0FBRXRDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxPQUFPLFVBQVU7SUFDZCxNQUFNLENBQUMsUUFBUSxHQUFzQixJQUFJLENBQUM7SUFFMUMsU0FBUyxDQUF1QztJQUVoRCxNQUFNLEdBQThCLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDOUMsSUFBSSxHQUFzQixJQUFJLENBQUM7SUFDL0IsT0FBTyxHQUFpQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBRXJELEtBQUssR0FHUixFQUFFLENBQUM7SUFFQSxXQUFXLEdBQ2xCLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ2hCLGVBQWUsR0FDdEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwQixVQUFVLEdBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBRWYsT0FBTyxDQUFnQztJQUN2QyxLQUFLLENBQW9D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QUM5RCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFFZCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUNWLGlDQUFpQyxLQUFLLEVBQUUsRUFDeEMsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7UUFDSixDQUFDLEVBQUUsd0VBQXdFLENBQUMsQ0FBQztJQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogZGIvSURCTWFuYWdlci5qc1xuXG5pbXBvcnQgeyBJREJQRGF0YWJhc2UsIElEQlBPYmplY3RTdG9yZSB9IGZyb20gJ2lkYic7XG5pbXBvcnQge1xuXHRDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdENvbmZpZ0RhdGFJbnRlcmZhY2UsXG5cdERCRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRIU0wsXG5cdElEQk1hbmFnZXJfQ2xhc3NJbnRlcmZhY2UsXG5cdE1vZGVEYXRhSW50ZXJmYWNlLFxuXHRNdXRhdGlvbkxvZyxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZURCLFxuXHRQYWxldHRlSXRlbSxcblx0UGFsZXR0ZVNjaGVtYSxcblx0U2V0dGluZ3MsXG5cdFN0b3JlZFBhbGV0dGVcbn0gZnJvbSAnLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgTXV0YXRpb25UcmFja2VyIH0gZnJvbSAnLi9tdXRhdGlvbnMvaW5kZXguanMnO1xuaW1wb3J0IHsgY29uZmlnRGF0YSBhcyBjb25maWcgfSBmcm9tICcuLi9kYXRhL2NvbmZpZy5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZURCIH0gZnJvbSAnLi9pbml0aWFsaXplLmpzJztcbmltcG9ydCB7IGRiVXRpbHMgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ2RiL0lEQk1hbmFnZXIuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZXhwb3J0IGNsYXNzIElEQk1hbmFnZXIgaW1wbGVtZW50cyBJREJNYW5hZ2VyX0NsYXNzSW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IElEQk1hbmFnZXIgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIGRiUHJvbWlzZTogUHJvbWlzZTxJREJQRGF0YWJhc2U8UGFsZXR0ZVNjaGVtYT4+O1xuXG5cdHByaXZhdGUgZGJEYXRhOiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddID0gY29uZmlnLmRiO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhSW50ZXJmYWNlID0gbW9kZTtcblx0cHJpdmF0ZSBsb2dNb2RlOiBNb2RlRGF0YUludGVyZmFjZVsnbG9nZ2luZyddID0gbW9kZS5sb2dnaW5nO1xuXG5cdHByaXZhdGUgY2FjaGU6IFBhcnRpYWw8e1xuXHRcdHNldHRpbmdzOiBTZXR0aW5ncztcblx0XHRjdXN0b21Db2xvcjogSFNMO1xuXHR9PiA9IHt9O1xuXG5cdHByaXZhdGUgZGVmYXVsdEtleXM6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ0RFRkFVTFRfS0VZUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRwcml2YXRlIGRlZmF1bHRTZXR0aW5nczogQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnREVGQVVMVF9TRVRUSU5HUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9TRVRUSU5HUztcblx0cHJpdmF0ZSBzdG9yZU5hbWVzOiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydTVE9SRV9OQU1FUyddID1cblx0XHRjb25maWcuZGIuU1RPUkVfTkFNRVM7XG5cblx0cHJpdmF0ZSBkYlV0aWxzOiBEQkZuX01hc3RlckludGVyZmFjZVsndXRpbHMnXTtcblx0cHJpdmF0ZSB1dGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd1dGlscyddO1xuXG5cdHByaXZhdGUgbXV0YXRpb25UcmFja2VyOiBNdXRhdGlvblRyYWNrZXI7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmRiUHJvbWlzZSA9IGluaXRpYWxpemVEQigpO1xuXG5cdFx0dGhpcy5kYkRhdGEgPSB0aGlzLmRiRGF0YTtcblxuXHRcdHRoaXMuZGVmYXVsdEtleXMgPSBjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzID0gY29uZmlnLmRiLkRFRkFVTFRfU0VUVElOR1M7XG5cdFx0dGhpcy5zdG9yZU5hbWVzID0gY29uZmlnLmRiLlNUT1JFX05BTUVTO1xuXG5cdFx0dGhpcy5kYlV0aWxzID0gZGJVdGlscztcblx0XHR0aGlzLnV0aWxzID0gY29tbW9uRm4udXRpbHM7XG5cblx0XHR0aGlzLm11dGF0aW9uVHJhY2tlciA9IE11dGF0aW9uVHJhY2tlci5nZXRJbnN0YW5jZShcblx0XHRcdHRoaXMuZGJEYXRhLFxuXHRcdFx0dGhpcy5tb2RlXG5cdFx0KTtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogU1RBVElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRJbnN0YW5jZSgpOiBQcm9taXNlPElEQk1hbmFnZXI+IHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgSURCTWFuYWdlcigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLmluc3RhbmNlLmluaXRpYWxpemVEQigpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmluc3RhbmNlO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyByZXNldEluc3RhbmNlKCk6IHZvaWQge1xuXHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICogKiAqIFBVQkxJQyBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHB1YmxpYyBjcmVhdGVNdXRhdGlvbkxvZ2dlcjxUIGV4dGVuZHMgb2JqZWN0PihvYmo6IFQsIGtleTogc3RyaW5nKTogVCB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdjcmVhdGVNdXRhdGlvbkxvZ2dlcigpJztcblx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdHJldHVybiBuZXcgUHJveHkob2JqLCB7XG5cdFx0XHRzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRbcHJvcGVydHkgYXMga2V5b2YgVF07XG5cdFx0XHRcdGNvbnN0IHN1Y2Nlc3MgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRjb25zdCBtdXRhdGlvbkxvZzogTXV0YXRpb25Mb2cgPSB7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZTogeyBbcHJvcGVydHldOiB2YWx1ZSB9LFxuXHRcdFx0XHRcdFx0b2xkVmFsdWU6IHsgW3Byb3BlcnR5XTogb2xkVmFsdWUgfSxcblx0XHRcdFx0XHRcdG9yaWdpbjogJ1Byb3h5J1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRpZiAoc2VsZi5sb2dNb2RlLmluZm8pXG5cdFx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdFx0YE11dGF0aW9uIGRldGVjdGVkOiAke0pTT04uc3RyaW5naWZ5KG11dGF0aW9uTG9nKX1gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0c2VsZi5tdXRhdGlvblRyYWNrZXJcblx0XHRcdFx0XHRcdC5wZXJzaXN0TXV0YXRpb24obXV0YXRpb25Mb2cpXG5cdFx0XHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdFx0XHRgRmFpbGVkIHRvIHBlcnNpc3QgbXV0YXRpb246ICR7ZXJyLm1lc3NhZ2V9YCxcblx0XHRcdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gc3VjY2Vzcztcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdFx0c3dhdGNoZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUGFsZXR0ZSB7XG5cdFx0cmV0dXJuIHRoaXMudXRpbHMucGFsZXR0ZS5jcmVhdGVPYmplY3QoXG5cdFx0XHR0eXBlLFxuXHRcdFx0aXRlbXMsXG5cdFx0XHRzd2F0Y2hlcyxcblx0XHRcdHBhbGV0dGVJRCxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrLFxuXHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodFxuXHRcdCk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyBkZWxldGVFbnRyeShcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRW50cnkoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0aWYgKCEoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cyhzdG9yZU5hbWUsIGtleSkpKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2Fybikge1xuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YEVudHJ5IHdpdGgga2V5ICR7a2V5fSBub3QgZm91bmQuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJ5IHdpdGgga2V5ICR7a2V5fSBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhKCk6IEVycm9yIGRlbGV0aW5nIGVudHJ5Jyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cmllcyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRW50cmllcygpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHRcdFx0Y29uc3QgdmFsaWRLZXlzID0gKFxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRrZXlzLm1hcChhc3luYyBrZXkgPT5cblx0XHRcdFx0XHRcdChhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKHN0b3JlTmFtZSwga2V5KSlcblx0XHRcdFx0XHRcdFx0PyBrZXlcblx0XHRcdFx0XHRcdFx0OiBudWxsXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLmZpbHRlcigoa2V5KToga2V5IGlzIHN0cmluZyA9PiBrZXkgIT09IG51bGwpO1xuXG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbCh2YWxpZEtleXMubWFwKGtleSA9PiBzdG9yZS5kZWxldGUoa2V5KSkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgRW50cmllcyBkZWxldGVkIHN1Y2Nlc3NmdWxseS4gS2V5czogJHt2YWxpZEtleXN9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRW50cmllcygpOiBFcnJvciBkZWxldGluZyBlbnRyaWVzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlcj4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0Q3VycmVudFBhbGV0dGVJRCgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBGZXRjaGVkIHNldHRpbmdzIGZyb20gSW5kZXhlZERCOiAke3NldHRpbmdzfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gc2V0dGluZ3M/Lmxhc3RQYWxldHRlSUQgPz8gMDtcblx0XHR9LCAnSURCTWFuYWdlcjogZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBjdXJyZW50IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDYWNoZWRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG5cdFx0aWYgKHRoaXMuY2FjaGUuc2V0dGluZ3MpIHJldHVybiB0aGlzLmNhY2hlLnNldHRpbmdzO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmdldFNldHRpbmdzKCk7XG5cblx0XHRpZiAoc2V0dGluZ3MpIHRoaXMuY2FjaGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuXHRcdHJldHVybiBzZXR0aW5ncztcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXN0b21Db2xvcigpOiBQcm9taXNlPEhTTCB8IG51bGw+IHtcblx0XHRjb25zdCBrZXkgPSB0aGlzLmRlZmF1bHRLZXlzWydDVVNUT01fQ09MT1InXTtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnN0b3JlTmFtZXNbJ0NVU1RPTV9DT0xPUiddO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgZW50cnkgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIWVudHJ5Py5jb2xvcikgcmV0dXJuIG51bGw7XG5cblx0XHRcdHRoaXMuY2FjaGUuY3VzdG9tQ29sb3IgPSBlbnRyeS5jb2xvcjtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIoZW50cnkuY29sb3IsIHN0b3JlTmFtZSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0Q3VzdG9tQ29sb3IoKTogRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIGNvbG9yJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0REIoKTogUHJvbWlzZTxQYWxldHRlREI+IHtcblx0XHRyZXR1cm4gdGhpcy5kYlByb21pc2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TG9nZ2VkT2JqZWN0PFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCB8IG51bGwsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogVCB8IG51bGwge1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU11dGF0aW9uTG9nZ2VyKG9iaiwga2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0VGFibGVJRCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmdldFNldHRpbmdzKCk7XG5cdFx0XHRjb25zdCBsYXN0VGFibGVJRCA9IHNldHRpbmdzLmxhc3RUYWJsZUlEID8/IDA7XG5cdFx0XHRjb25zdCBuZXh0SUQgPSBsYXN0VGFibGVJRCArIDE7XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3NldHRpbmdzJywgJ2FwcFNldHRpbmdzJywge1xuXHRcdFx0XHQuLi5zZXR0aW5ncyxcblx0XHRcdFx0bGFzdFRhYmxlSUQ6IG5leHRJRFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBgcGFsZXR0ZV8ke25leHRJRH1gO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldE5leHRUYWJsZUlEKCk6IEVycm9yIGZldGNoaW5nIG5leHQgdGFibGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0UGFsZXR0ZUlEKCk6IFByb21pc2U8bnVtYmVyIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBjdXJyZW50SUQgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlSUQoKTtcblx0XHRcdGNvbnN0IG5ld0lEID0gY3VycmVudElEICsgMTtcblxuXHRcdFx0YXdhaXQgdGhpcy51cGRhdGVDdXJyZW50UGFsZXR0ZUlEKG5ld0lEKTtcblxuXHRcdFx0cmV0dXJuIG5ld0lEO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldE5leHRQYWxldHRlSUQoKTogRXJyb3IgZmV0Y2hpbmcgbmV4dCBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0U2V0dGluZ3MoKTogUHJvbWlzZTxTZXR0aW5ncz4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncyA/PyB0aGlzLmRlZmF1bHRTZXR0aW5ncztcblx0XHR9LCAnSURCTWFuYWdlci5nZXRTZXR0aW5ncygpOiBFcnJvciBmZXRjaGluZyBzZXR0aW5ncycpO1xuXHR9XG5cblx0Ly8gKipERVYtTk9URSoqIEZJR1VSRSBPVVQgSE9XIFRPIElNUExFTUVOVCBoYW5kbGVBc3luYyBIRVJFXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkb25seSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkd3JpdGUnXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkd3JpdGUnPlxuXHQ+O1xuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknIHwgJ3JlYWR3cml0ZSdcblx0KSB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRyZXR1cm4gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlc2V0RGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVzZXREYXRhYmFzZSgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IGF2YWlsYWJsZVN0b3JlcyA9IEFycmF5LmZyb20oZGIub2JqZWN0U3RvcmVOYW1lcyk7XG5cdFx0XHRjb25zdCBleHBlY3RlZFN0b3JlcyA9IE9iamVjdC52YWx1ZXModGhpcy5zdG9yZU5hbWVzKTtcblxuXHRcdFx0Zm9yIChjb25zdCBzdG9yZU5hbWUgb2YgZXhwZWN0ZWRTdG9yZXMpIHtcblx0XHRcdFx0aWYgKCFhdmFpbGFibGVTdG9yZXMuaW5jbHVkZXMoc3RvcmVOYW1lKSkge1xuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YE9iamVjdCBzdG9yZSBcIiR7c3RvcmVOYW1lfVwiIG5vdCBmb3VuZCBpbiBJbmRleGVkREIuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRcdGF3YWl0IHN0b3JlLmNsZWFyKCk7XG5cdFx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cblx0XHRcdFx0Y29uc3Qgc2V0dGluZ3NTdG9yZSA9IGRiXG5cdFx0XHRcdFx0LnRyYW5zYWN0aW9uKHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdFx0Lm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSk7XG5cdFx0XHRcdGF3YWl0IHNldHRpbmdzU3RvcmUucHV0KFxuXHRcdFx0XHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzLFxuXHRcdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdGBJbmRleGVkREIgaGFzIGJlZW4gcmVzZXQgdG8gZGVmYXVsdCBzZXR0aW5ncy5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIucmVzZXREYXRhYmFzZSgpOiBFcnJvciByZXNldHRpbmcgZGF0YWJhc2UnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBkZWxldGVEYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2RlbGV0ZURhdGFiYXNlKCknO1xuXG5cdFx0YXdhaXQgdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGJOYW1lID0gJ3BhbGV0dGVEQic7XG5cdFx0XHRjb25zdCBkYkV4aXN0cyA9IGF3YWl0IG5ldyBQcm9taXNlPGJvb2xlYW4+KHJlc29sdmUgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lKTtcblxuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRyZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xuXHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChkYkV4aXN0cykge1xuXHRcdFx0XHRjb25zdCBkZWxldGVSZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKGRiTmFtZSk7XG5cblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdFx0YERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZGVsZXRlZCBzdWNjZXNzZnVsbHkuYCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmVycm9yID0gZXZlbnQgPT4ge1xuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBFcnJvciBkZWxldGluZyBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiOlxcbkV2ZW50OiAke2V2ZW50fWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRcdGBEZWxldGUgb3BlcmF0aW9uIGJsb2NrZWQuIEVuc3VyZSBubyBvcGVuIGNvbm5lY3Rpb25zIHRvIFwiJHtkYk5hbWV9XCIuYCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdFx0XHRcdGFsZXJ0KFxuXHRcdFx0XHRcdFx0XHRgVW5hYmxlIHRvIGRlbGV0ZSBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGJlY2F1c2UgaXQgaXMgaW4gdXNlLiBQbGVhc2UgY2xvc2UgYWxsIG90aGVyIHRhYnMgb3Igd2luZG93cyBhY2Nlc3NpbmcgdGhpcyBkYXRhYmFzZSBhbmQgdHJ5IGFnYWluLmBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlLnN0YWNrVHJhY2UpXG5cdFx0XHRcdFx0XHRjb25zb2xlLnRyYWNlKGBCbG9ja2VkIGNhbGwgc3RhY2s6YCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBEYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGRvZXMgbm90IGV4aXN0LmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhYmFzZSgpOiBFcnJvciBkZWxldGluZyBkYXRhYmFzZScpO1xuXHR9XG5cblx0Ly8gKkRFVi1OT1RFKiBhZGQgdGhpcyBtZXRob2QgdG8gZG9jc1xuXHRwdWJsaWMgYXN5bmMgcmVzZXRQYWxldHRlSUQoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVzZXRQYWxldHRlSUQoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ107XG5cdFx0XHRjb25zdCBrZXkgPSB0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIXNldHRpbmdzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmdzIG5vdCBmb3VuZC4gQ2Fubm90IHJlc2V0IHBhbGV0dGUgSUQuJyk7XG5cblx0XHRcdHNldHRpbmdzLmxhc3RQYWxldHRlSUQgPSAwO1xuXG5cdFx0XHRhd2FpdCBkYi5wdXQoc3RvcmVOYW1lLCB7IGtleSwgLi4udGhpcy5kZWZhdWx0U2V0dGluZ3MgfSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgUGFsZXR0ZSBJRCBoYXMgc3VjY2Vzc2Z1bGx5IGJlZW4gcmVzZXQgdG8gMGAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0UGFsZXR0ZUlEKCk6IEVycm9yIHJlc2V0dGluZyBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZURhdGE8VD4oXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nLFxuXHRcdGRhdGE6IFQsXG5cdFx0b2xkVmFsdWU/OiBUXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3NhdmVEYXRhKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLmRiVXRpbHMuc3RvcmUud2l0aFN0b3JlKFxuXHRcdFx0XHRkYixcblx0XHRcdFx0c3RvcmVOYW1lLFxuXHRcdFx0XHQncmVhZHdyaXRlJyxcblx0XHRcdFx0YXN5bmMgc3RvcmUgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleSwgLi4uZGF0YSB9KTtcblxuXHRcdFx0XHRcdGxvZ2dlci5tdXRhdGlvbihcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRcdFx0bmV3VmFsdWU6IGRhdGEsXG5cdFx0XHRcdFx0XHRcdG9sZFZhbHVlOiBvbGRWYWx1ZSB8fCBudWxsLFxuXHRcdFx0XHRcdFx0XHRvcmlnaW46ICdzYXZlRGF0YSdcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRtdXRhdGlvbkxvZyA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0XHRcdCdNdXRhdGlvbiBsb2cgdHJpZ2dlcmVkIGZvciBzYXZlRGF0YTonLFxuXHRcdFx0XHRcdFx0XHRcdG11dGF0aW9uTG9nXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZURhdGEoKTogRXJyb3Igc2F2aW5nIGRhdGEnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZShcblx0XHRpZDogc3RyaW5nLFxuXHRcdG5ld1BhbGV0dGU6IFN0b3JlZFBhbGV0dGVcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnc2F2ZVBhbGV0dGUoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBhd2FpdCB0aGlzLmdldFN0b3JlKCd0YWJsZXMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRjb25zdCBwYWxldHRlVG9TYXZlOiBTdG9yZWRQYWxldHRlID0ge1xuXHRcdFx0XHR0YWJsZUlEOiBuZXdQYWxldHRlLnRhYmxlSUQsXG5cdFx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGUucGFsZXR0ZVxuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5OiBpZCwgLi4ucGFsZXR0ZVRvU2F2ZSB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBQYWxldHRlICR7aWR9IHNhdmVkIHN1Y2Nlc3NmdWxseS5gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZSgpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlVG9EQihcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdQYWxldHRlID0gdGhpcy5jcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRpdGVtcyxcblx0XHRcdFx0cGFsZXR0ZUlELFxuXHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRcdGxpbWl0RGFyayxcblx0XHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0XHRsaW1pdExpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBpZFBhcnRzID0gbmV3UGFsZXR0ZS5pZC5zcGxpdCgnXycpO1xuXG5cdFx0XHRpZiAoaWRQYXJ0cy5sZW5ndGggIT09IDIgfHwgaXNOYU4oTnVtYmVyKGlkUGFydHNbMV0pKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFsZXR0ZSBJRCBmb3JtYXQ6ICR7bmV3UGFsZXR0ZS5pZH1gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlUGFsZXR0ZShuZXdQYWxldHRlLmlkLCB7XG5cdFx0XHRcdHRhYmxlSUQ6IHBhcnNlSW50KGlkUGFydHNbMV0sIDEwKSxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXdQYWxldHRlO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVQYWxldHRlVG9EQigpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZSB0byBEQicpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVTZXR0aW5ncyhuZXdTZXR0aW5nczogU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdzYXZlU2V0dGluZ3MoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCBuZXdTZXR0aW5ncyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHQnU2V0dGluZ3MgdXBkYXRlZCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVTZXR0aW5ncygpOiBFcnJvciBzYXZpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyB1cGRhdGVFbnRyeUluUGFsZXR0ZShcblx0XHR0YWJsZUlEOiBzdHJpbmcsXG5cdFx0ZW50cnlJbmRleDogbnVtYmVyLFxuXHRcdG5ld0VudHJ5OiBQYWxldHRlSXRlbVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICd1cGRhdGVFbnRyeUluUGFsZXR0ZSgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAoIShhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKCd0YWJsZXMnLCB0YWJsZUlEKSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzdG9yZWRQYWxldHRlID0gYXdhaXQgdGhpcy5nZXRUYWJsZSh0YWJsZUlEKTtcblxuXHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlEfSBub3QgZm91bmQuYCk7XG5cblx0XHRcdGNvbnN0IHsgaXRlbXMgfSA9IHN0b3JlZFBhbGV0dGUucGFsZXR0ZTtcblxuXHRcdFx0aWYgKGVudHJ5SW5kZXggPj0gaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gbm90IGZvdW5kIGluIHBhbGV0dGUgJHt0YWJsZUlEfS5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0J3VwZGF0ZUVudHJ5SW5QYWxldHRlOiBFbnRyeSBub3QgZm91bmQuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRFbnRyeSA9IGl0ZW1zW2VudHJ5SW5kZXhdO1xuXG5cdFx0XHRpdGVtc1tlbnRyeUluZGV4XSA9IG5ld0VudHJ5O1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCd0YWJsZXMnLCB0YWJsZUlELCBzdG9yZWRQYWxldHRlKTtcblxuXHRcdFx0bG9nZ2VyLm11dGF0aW9uKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0a2V5OiBgJHt0YWJsZUlEfS0ke2VudHJ5SW5kZXh9XWAsXG5cdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRuZXdWYWx1ZTogbmV3RW50cnksXG5cdFx0XHRcdFx0b2xkVmFsdWU6IG9sZEVudHJ5LFxuXHRcdFx0XHRcdG9yaWdpbjogJ3VwZGF0ZUVudHJ5SW5QYWxldHRlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtdXRhdGlvbkxvZyA9PlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0YE11dGF0aW9uIGxvZyB0cmlnZ2VyIGZvciB1cGRhdGVFbnRyeUluUGFsZXR0ZTpgLFxuXHRcdFx0XHRcdFx0bXV0YXRpb25Mb2dcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gaW4gcGFsZXR0ZSAke3RhYmxlSUR9IHVwZGF0ZWQuYFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUVudHJ5SW5QYWxldHRlKCk6IEVycm9yIHVwZGF0aW5nIGVudHJ5IGluIHBhbGV0dGUnKTtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vLyAqICogKiAqICAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vLyAqICogKiAqICogKiBQUklWQVRFIE1FVEhPRFMgKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwcml2YXRlIGFzeW5jIGluaXRpYWxpemVEQigpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2luaXRpYWxpemVEQigpJztcblxuXHRcdGF3YWl0IHRoaXMuZGJQcm9taXNlO1xuXG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddO1xuXHRcdGNvbnN0IGtleSA9IHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyk7XG5cblx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdGBJbml0aWFsaXppbmcgREIgd2l0aCBTdG9yZSBOYW1lOiAke3N0b3JlTmFtZX0sIEtleTogJHtrZXl9YCxcblx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHQpO1xuXG5cdFx0aWYgKCFzdG9yZU5hbWUgfHwgIWtleSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0b3JlIG5hbWUgb3Iga2V5LicpO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0aWYgKCFzZXR0aW5ncykge1xuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEluaXRpYWxpemluZyBkZWZhdWx0IHNldHRpbmdzLi4uYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGRiLnB1dChzdG9yZU5hbWUsIHsga2V5LCAuLi50aGlzLmRlZmF1bHRTZXR0aW5ncyB9KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGVuc3VyZUVudHJ5RXhpc3RzKFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCBzdG9yZSA9IGRiXG5cdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZG9ubHknKVxuXHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRyZXR1cm4gKGF3YWl0IHN0b3JlLmdldChrZXkpKSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0S2V5KFxuXHRcdGtleToga2V5b2YgQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnU1RPUkVfTkFNRVMnXVxuXHQpOiBzdHJpbmcge1xuXHRcdGNvbnN0IGRlZmF1bHRLZXkgPVxuXHRcdFx0dGhpcy5kZWZhdWx0S2V5c1tcblx0XHRcdFx0a2V5IGFzIGtleW9mIENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ0RFRkFVTFRfS0VZUyddXG5cdFx0XHRdO1xuXG5cdFx0aWYgKCFkZWZhdWx0S2V5KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFtnZXREZWZhdWx0S2V5KCldOiBJbnZhbGlkIGRlZmF1bHQga2V5OiAke2tleX1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEtleTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZ2V0VGFibGUoaWQ6IHN0cmluZyk6IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2dldFRhYmxlKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZGIuZ2V0KHRoaXMuc3RvcmVOYW1lcy5UQUJMRVMsIGlkKTtcblxuXHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YFRhYmxlIHdpdGggSUQgJHtpZH0gbm90IGZvdW5kLmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0VGFibGUoKTogRXJyb3IgZmV0Y2hpbmcgdGFibGUnKTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgdXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRDogbnVtYmVyKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAndXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3NldHRpbmdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnc2V0dGluZ3MnKTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFVwZGF0aW5nIGN1cmVudCBwYWxldHRlIElEIHRvICR7bmV3SUR9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleTogJ2FwcFNldHRpbmdzJywgbGFzdFBhbGV0dGVJRDogbmV3SUQgfSk7XG5cdFx0XHRhd2FpdCB0eC5kb25lO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEN1cnJlbnQgcGFsZXR0ZSBJRCB1cGRhdGVkIHRvICR7bmV3SUR9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIudXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpOiBFcnJvciB1cGRhdGluZyBjdXJyZW50IHBhbGV0dGUgSUQnKTtcblx0fVxufVxuIl19