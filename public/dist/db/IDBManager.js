// File: db/IDBManager.js
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
    utils;
    dbUtils;
    constructor() {
        this.dbPromise = initializeDB();
        this.dbData = this.dbData;
        this.defaultKeys = config.db.DEFAULT_KEYS;
        this.defaultSettings = config.db.DEFAULT_SETTINGS;
        this.storeNames = config.db.STORE_NAMES;
        this.mode = mode;
        this.dbUtils = dbUtils;
        this.utils = commonFn.utils;
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
            await this.instance.dbPromise;
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
                    self.persistMutation(mutationLog).catch(err => {
                        if (self.logMode.error)
                            logger.error(`Failed to persist mutation: ${err.message}`, `${thisModule} > ${thisMethod}`);
                    });
                }
                return success;
            }
        });
    }
    createPaletteObject(type, items, paletteID, swatches, limitDark, limitGray, limitLight) {
        return this.utils.palette.createObject(type, items, swatches, paletteID, limitDark, limitGray, limitLight);
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
    async getNextPaletteID() {
        return this.utils.errors.handleAsync(async () => {
            const currentID = await this.getCurrentPaletteID();
            const newID = currentID + 1;
            await this.updateCurrentPaletteID(newID);
            return newID;
        }, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
    }
    async getMutations() {
        const store = await this.getStore('settings', 'readonly');
        const entries = await store.getAll();
        return entries.filter(entry => entry.key.startsWith('mutation_'));
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
    async getPaletteHistory() {
        const thisMethod = 'getPaletteHistory()';
        try {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            let entry = await store.get('paletteHistory');
            if (!entry) {
                entry = { key: 'paletteHistory', palettes: [] };
                await store.put(entry);
                await tx.done;
            }
            return entry.palettes;
        }
        catch (error) {
            logger.error(`Error retrieving palette history: ${error}`, `${thisModule} > ${thisMethod}`);
            return [];
        }
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
    async persistMutation(data) {
        const caller = 'persistMutation()';
        const db = await this.getDB();
        await db.put('mutations', data);
        logger.info(`Persisted mutation: ${JSON.stringify(data)}`, `${thisModule} > ${caller}`);
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
    async savePaletteToDB(type, items, paletteID, numBoxes, limitDark, limitGray, limitLight) {
        return this.utils.errors.handleAsync(async () => {
            const newPalette = this.createPaletteObject(type, items, paletteID, numBoxes, limitDark, limitGray, limitLight);
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
    async savePalette(id, newPalette) {
        const thisMethod = 'savePalette()';
        return this.utils.errors.handleAsync(async () => {
            const store = await this.getStore('tables', 'readwrite');
            const paletteToSave = {
                tableID: newPalette.tableID,
                palette: newPalette.palette
            };
            await store.put({ key: id, ...paletteToSave });
            if (!this.mode.quiet && this.logMode.info)
                logger.info(`Palette ${id} saved successfully.`, `${thisModule} > ${thisMethod}`);
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteHistory(paletteHistory) {
        const db = await this.getDB();
        const tx = db.transaction('settings', 'readwrite');
        const store = tx.objectStore('settings');
        await store.put({ key: 'paletteHistory', palettes: paletteHistory });
        await tx.done;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9JREJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlCQUF5QjtBQWdCekIsT0FBTyxFQUFFLFVBQVUsSUFBSSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQUM7QUFFdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE9BQU8sVUFBVTtJQUNkLE1BQU0sQ0FBQyxRQUFRLEdBQXNCLElBQUksQ0FBQztJQUUxQyxTQUFTLENBQXVDO0lBRWhELE1BQU0sR0FBOEIsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUM5QyxJQUFJLEdBQXNCLElBQUksQ0FBQztJQUMvQixPQUFPLEdBQWlDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFFckQsS0FBSyxHQUdSLEVBQUUsQ0FBQztJQUVSLFdBQVcsR0FDVixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztJQUNoQixlQUFlLEdBQ3RCLE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7SUFDcEIsVUFBVSxHQUNqQixNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUVmLEtBQUssQ0FBb0M7SUFDekMsT0FBTyxDQUFpQjtJQUVoQztRQUNDLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxFQUFFLENB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b3J0IHsgSURCUERhdGFiYXNlLCBJREJQT2JqZWN0U3RvcmUgfSBmcm9tICdpZGInO1xuaW1wb3J0IHtcblx0Q29tbW9uRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRDb25maWdEYXRhSW50ZXJmYWNlLFxuXHRIU0wsXG5cdE1vZGVEYXRhSW50ZXJmYWNlLFxuXHRNdXRhdGlvbkxvZyxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZURCLFxuXHRQYWxldHRlSXRlbSxcblx0UGFsZXR0ZVNjaGVtYSxcblx0U2V0dGluZ3MsXG5cdFN0b3JlZFBhbGV0dGVcbn0gZnJvbSAnLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgY29uZmlnRGF0YSBhcyBjb25maWcgfSBmcm9tICcuLi9kYXRhL2NvbmZpZy5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZURCIH0gZnJvbSAnLi9pbml0aWFsaXplLmpzJztcbmltcG9ydCB7IGRiVXRpbHMgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ2RiL0lEQk1hbmFnZXIuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZXhwb3J0IGNsYXNzIElEQk1hbmFnZXIge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSURCTWFuYWdlciB8IG51bGwgPSBudWxsO1xuXG5cdHByaXZhdGUgZGJQcm9taXNlOiBQcm9taXNlPElEQlBEYXRhYmFzZTxQYWxldHRlU2NoZW1hPj47XG5cblx0cHJpdmF0ZSBkYkRhdGE6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ10gPSBjb25maWcuZGI7XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGFJbnRlcmZhY2UgPSBtb2RlO1xuXHRwcml2YXRlIGxvZ01vZGU6IE1vZGVEYXRhSW50ZXJmYWNlWydsb2dnaW5nJ10gPSBtb2RlLmxvZ2dpbmc7XG5cblx0cHJpdmF0ZSBjYWNoZTogUGFydGlhbDx7XG5cdFx0c2V0dGluZ3M6IFNldHRpbmdzO1xuXHRcdGN1c3RvbUNvbG9yOiBIU0w7XG5cdH0+ID0ge307XG5cblx0ZGVmYXVsdEtleXM6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ0RFRkFVTFRfS0VZUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRwcml2YXRlIGRlZmF1bHRTZXR0aW5nczogQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnREVGQVVMVF9TRVRUSU5HUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9TRVRUSU5HUztcblx0cHJpdmF0ZSBzdG9yZU5hbWVzOiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydTVE9SRV9OQU1FUyddID1cblx0XHRjb25maWcuZGIuU1RPUkVfTkFNRVM7XG5cblx0cHJpdmF0ZSB1dGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd1dGlscyddO1xuXHRwcml2YXRlIGRiVXRpbHM6IHR5cGVvZiBkYlV0aWxzO1xuXG5cdHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5kYlByb21pc2UgPSBpbml0aWFsaXplREIoKTtcblxuXHRcdHRoaXMuZGJEYXRhID0gdGhpcy5kYkRhdGE7XG5cblx0XHR0aGlzLmRlZmF1bHRLZXlzID0gY29uZmlnLmRiLkRFRkFVTFRfS0VZUztcblx0XHR0aGlzLmRlZmF1bHRTZXR0aW5ncyA9IGNvbmZpZy5kYi5ERUZBVUxUX1NFVFRJTkdTO1xuXHRcdHRoaXMuc3RvcmVOYW1lcyA9IGNvbmZpZy5kYi5TVE9SRV9OQU1FUztcblxuXHRcdHRoaXMubW9kZSA9IG1vZGU7XG5cblx0XHR0aGlzLmRiVXRpbHMgPSBkYlV0aWxzO1xuXHRcdHRoaXMudXRpbHMgPSBjb21tb25Gbi51dGlscztcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogU1RBVElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRJbnN0YW5jZSgpOiBQcm9taXNlPElEQk1hbmFnZXI+IHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgSURCTWFuYWdlcigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLmluc3RhbmNlLmRiUHJvbWlzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcmVzZXRJbnN0YW5jZSgpOiB2b2lkIHtcblx0XHR0aGlzLmluc3RhbmNlID0gbnVsbDtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogKiBQVUJMSUMgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwdWJsaWMgY3JlYXRlTXV0YXRpb25Mb2dnZXI8VCBleHRlbmRzIG9iamVjdD4ob2JqOiBULCBrZXk6IHN0cmluZyk6IFQge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnY3JlYXRlTXV0YXRpb25Mb2dnZXIoKSc7XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iaiwge1xuXHRcdFx0c2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5IGFzIGtleW9mIFRdO1xuXHRcdFx0XHRjb25zdCBzdWNjZXNzID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpO1xuXG5cdFx0XHRcdGlmIChzdWNjZXNzKSB7XG5cdFx0XHRcdFx0Y29uc3QgbXV0YXRpb25Mb2c6IE11dGF0aW9uTG9nID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWU6IHsgW3Byb3BlcnR5XTogdmFsdWUgfSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlOiB7IFtwcm9wZXJ0eV06IG9sZFZhbHVlIH0sXG5cdFx0XHRcdFx0XHRvcmlnaW46ICdQcm94eSdcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBNdXRhdGlvbiBkZXRlY3RlZDogJHtKU09OLnN0cmluZ2lmeShtdXRhdGlvbkxvZyl9YCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHNlbGYucGVyc2lzdE11dGF0aW9uKG11dGF0aW9uTG9nKS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gcGVyc2lzdCBtdXRhdGlvbjogJHtlcnIubWVzc2FnZX1gLFxuXHRcdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBzdWNjZXNzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdHR5cGU6IHN0cmluZyxcblx0XHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0XHRwYWxldHRlSUQ6IG51bWJlcixcblx0XHRzd2F0Y2hlczogbnVtYmVyLFxuXHRcdGxpbWl0RGFyazogYm9vbGVhbixcblx0XHRsaW1pdEdyYXk6IGJvb2xlYW4sXG5cdFx0bGltaXRMaWdodDogYm9vbGVhblxuXHQpOiBQYWxldHRlIHtcblx0XHRyZXR1cm4gdGhpcy51dGlscy5wYWxldHRlLmNyZWF0ZU9iamVjdChcblx0XHRcdHR5cGUsXG5cdFx0XHRpdGVtcyxcblx0XHRcdHN3YXRjaGVzLFxuXHRcdFx0cGFsZXR0ZUlELFxuXHRcdFx0bGltaXREYXJrLFxuXHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodFxuXHRcdCk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyBkZWxldGVFbnRyeShcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRW50cnkoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0aWYgKCEoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cyhzdG9yZU5hbWUsIGtleSkpKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2Fybikge1xuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YEVudHJ5IHdpdGgga2V5ICR7a2V5fSBub3QgZm91bmQuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJ5IHdpdGgga2V5ICR7a2V5fSBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhKCk6IEVycm9yIGRlbGV0aW5nIGVudHJ5Jyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cmllcyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRW50cmllcygpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHRcdFx0Y29uc3QgdmFsaWRLZXlzID0gKFxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRrZXlzLm1hcChhc3luYyBrZXkgPT5cblx0XHRcdFx0XHRcdChhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKHN0b3JlTmFtZSwga2V5KSlcblx0XHRcdFx0XHRcdFx0PyBrZXlcblx0XHRcdFx0XHRcdFx0OiBudWxsXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLmZpbHRlcigoa2V5KToga2V5IGlzIHN0cmluZyA9PiBrZXkgIT09IG51bGwpO1xuXG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbCh2YWxpZEtleXMubWFwKGtleSA9PiBzdG9yZS5kZWxldGUoa2V5KSkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgRW50cmllcyBkZWxldGVkIHN1Y2Nlc3NmdWxseS4gS2V5czogJHt2YWxpZEtleXN9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRW50cmllcygpOiBFcnJvciBkZWxldGluZyBlbnRyaWVzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlcj4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0Q3VycmVudFBhbGV0dGVJRCgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBGZXRjaGVkIHNldHRpbmdzIGZyb20gSW5kZXhlZERCOiAke3NldHRpbmdzfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gc2V0dGluZ3M/Lmxhc3RQYWxldHRlSUQgPz8gMDtcblx0XHR9LCAnSURCTWFuYWdlcjogZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBjdXJyZW50IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDYWNoZWRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG5cdFx0aWYgKHRoaXMuY2FjaGUuc2V0dGluZ3MpIHJldHVybiB0aGlzLmNhY2hlLnNldHRpbmdzO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmdldFNldHRpbmdzKCk7XG5cblx0XHRpZiAoc2V0dGluZ3MpIHRoaXMuY2FjaGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuXHRcdHJldHVybiBzZXR0aW5ncztcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXN0b21Db2xvcigpOiBQcm9taXNlPEhTTCB8IG51bGw+IHtcblx0XHRjb25zdCBrZXkgPSB0aGlzLmRlZmF1bHRLZXlzWydDVVNUT01fQ09MT1InXTtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnN0b3JlTmFtZXNbJ0NVU1RPTV9DT0xPUiddO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgZW50cnkgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIWVudHJ5Py5jb2xvcikgcmV0dXJuIG51bGw7XG5cblx0XHRcdHRoaXMuY2FjaGUuY3VzdG9tQ29sb3IgPSBlbnRyeS5jb2xvcjtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIoZW50cnkuY29sb3IsIHN0b3JlTmFtZSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0Q3VzdG9tQ29sb3IoKTogRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIGNvbG9yJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0REIoKTogUHJvbWlzZTxQYWxldHRlREI+IHtcblx0XHRyZXR1cm4gdGhpcy5kYlByb21pc2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TG9nZ2VkT2JqZWN0PFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCB8IG51bGwsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogVCB8IG51bGwge1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU11dGF0aW9uTG9nZ2VyKG9iaiwga2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0UGFsZXR0ZUlEKCk6IFByb21pc2U8bnVtYmVyIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBjdXJyZW50SUQgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlSUQoKTtcblx0XHRcdGNvbnN0IG5ld0lEID0gY3VycmVudElEICsgMTtcblxuXHRcdFx0YXdhaXQgdGhpcy51cGRhdGVDdXJyZW50UGFsZXR0ZUlEKG5ld0lEKTtcblxuXHRcdFx0cmV0dXJuIG5ld0lEO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldE5leHRQYWxldHRlSUQoKTogRXJyb3IgZmV0Y2hpbmcgbmV4dCBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0TXV0YXRpb25zKCk6IFByb21pc2U8TXV0YXRpb25Mb2dbXT4ge1xuXHRcdGNvbnN0IHN0b3JlID0gYXdhaXQgdGhpcy5nZXRTdG9yZSgnc2V0dGluZ3MnLCAncmVhZG9ubHknKTtcblx0XHRjb25zdCBlbnRyaWVzID0gYXdhaXQgc3RvcmUuZ2V0QWxsKCk7XG5cblx0XHRyZXR1cm4gZW50cmllcy5maWx0ZXIoZW50cnkgPT4gZW50cnkua2V5LnN0YXJ0c1dpdGgoJ211dGF0aW9uXycpKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0VGFibGVJRCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmdldFNldHRpbmdzKCk7XG5cdFx0XHRjb25zdCBsYXN0VGFibGVJRCA9IHNldHRpbmdzLmxhc3RUYWJsZUlEID8/IDA7XG5cdFx0XHRjb25zdCBuZXh0SUQgPSBsYXN0VGFibGVJRCArIDE7XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3NldHRpbmdzJywgJ2FwcFNldHRpbmdzJywge1xuXHRcdFx0XHQuLi5zZXR0aW5ncyxcblx0XHRcdFx0bGFzdFRhYmxlSUQ6IG5leHRJRFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBgcGFsZXR0ZV8ke25leHRJRH1gO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldE5leHRUYWJsZUlEKCk6IEVycm9yIGZldGNoaW5nIG5leHQgdGFibGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRQYWxldHRlSGlzdG9yeSgpOiBQcm9taXNlPFBhbGV0dGVbXT4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0UGFsZXR0ZUhpc3RvcnkoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdzZXR0aW5ncycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3NldHRpbmdzJyk7XG5cblx0XHRcdGxldCBlbnRyeSA9IGF3YWl0IHN0b3JlLmdldCgncGFsZXR0ZUhpc3RvcnknKTtcblxuXHRcdFx0aWYgKCFlbnRyeSkge1xuXHRcdFx0XHRlbnRyeSA9IHsga2V5OiAncGFsZXR0ZUhpc3RvcnknLCBwYWxldHRlczogW10gfTtcblx0XHRcdFx0YXdhaXQgc3RvcmUucHV0KGVudHJ5KTtcblx0XHRcdFx0YXdhaXQgdHguZG9uZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVudHJ5LnBhbGV0dGVzO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciByZXRyaWV2aW5nIHBhbGV0dGUgaGlzdG9yeTogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChcblx0XHRcdFx0dGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddLFxuXHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gc2V0dGluZ3MgPz8gdGhpcy5kZWZhdWx0U2V0dGluZ3M7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0U2V0dGluZ3MoKTogRXJyb3IgZmV0Y2hpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkb25seSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkd3JpdGUnXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkd3JpdGUnPlxuXHQ+O1xuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknIHwgJ3JlYWR3cml0ZSdcblx0KSB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRyZXR1cm4gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHBlcnNpc3RNdXRhdGlvbihkYXRhOiBNdXRhdGlvbkxvZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGNhbGxlciA9ICdwZXJzaXN0TXV0YXRpb24oKSc7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRhd2FpdCBkYi5wdXQoJ211dGF0aW9ucycsIGRhdGEpO1xuXG5cdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRgUGVyc2lzdGVkIG11dGF0aW9uOiAke0pTT04uc3RyaW5naWZ5KGRhdGEpfWAsXG5cdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7Y2FsbGVyfWBcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlc2V0RGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVzZXREYXRhYmFzZSgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IGF2YWlsYWJsZVN0b3JlcyA9IEFycmF5LmZyb20oZGIub2JqZWN0U3RvcmVOYW1lcyk7XG5cdFx0XHRjb25zdCBleHBlY3RlZFN0b3JlcyA9IE9iamVjdC52YWx1ZXModGhpcy5zdG9yZU5hbWVzKTtcblxuXHRcdFx0Zm9yIChjb25zdCBzdG9yZU5hbWUgb2YgZXhwZWN0ZWRTdG9yZXMpIHtcblx0XHRcdFx0aWYgKCFhdmFpbGFibGVTdG9yZXMuaW5jbHVkZXMoc3RvcmVOYW1lKSkge1xuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YE9iamVjdCBzdG9yZSBcIiR7c3RvcmVOYW1lfVwiIG5vdCBmb3VuZCBpbiBJbmRleGVkREIuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRcdGF3YWl0IHN0b3JlLmNsZWFyKCk7XG5cdFx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cblx0XHRcdFx0Y29uc3Qgc2V0dGluZ3NTdG9yZSA9IGRiXG5cdFx0XHRcdFx0LnRyYW5zYWN0aW9uKHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdFx0Lm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSk7XG5cdFx0XHRcdGF3YWl0IHNldHRpbmdzU3RvcmUucHV0KFxuXHRcdFx0XHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzLFxuXHRcdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdGBJbmRleGVkREIgaGFzIGJlZW4gcmVzZXQgdG8gZGVmYXVsdCBzZXR0aW5ncy5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIucmVzZXREYXRhYmFzZSgpOiBFcnJvciByZXNldHRpbmcgZGF0YWJhc2UnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBkZWxldGVEYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2RlbGV0ZURhdGFiYXNlKCknO1xuXG5cdFx0YXdhaXQgdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGJOYW1lID0gJ3BhbGV0dGVEQic7XG5cdFx0XHRjb25zdCBkYkV4aXN0cyA9IGF3YWl0IG5ldyBQcm9taXNlPGJvb2xlYW4+KHJlc29sdmUgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lKTtcblxuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRyZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xuXHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChkYkV4aXN0cykge1xuXHRcdFx0XHRjb25zdCBkZWxldGVSZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKGRiTmFtZSk7XG5cblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdFx0YERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZGVsZXRlZCBzdWNjZXNzZnVsbHkuYCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmVycm9yID0gZXZlbnQgPT4ge1xuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBFcnJvciBkZWxldGluZyBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiOlxcbkV2ZW50OiAke2V2ZW50fWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRcdGBEZWxldGUgb3BlcmF0aW9uIGJsb2NrZWQuIEVuc3VyZSBubyBvcGVuIGNvbm5lY3Rpb25zIHRvIFwiJHtkYk5hbWV9XCIuYCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdFx0XHRcdGFsZXJ0KFxuXHRcdFx0XHRcdFx0XHRgVW5hYmxlIHRvIGRlbGV0ZSBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGJlY2F1c2UgaXQgaXMgaW4gdXNlLiBQbGVhc2UgY2xvc2UgYWxsIG90aGVyIHRhYnMgb3Igd2luZG93cyBhY2Nlc3NpbmcgdGhpcyBkYXRhYmFzZSBhbmQgdHJ5IGFnYWluLmBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlLnN0YWNrVHJhY2UpXG5cdFx0XHRcdFx0XHRjb25zb2xlLnRyYWNlKGBCbG9ja2VkIGNhbGwgc3RhY2s6YCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBEYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGRvZXMgbm90IGV4aXN0LmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhYmFzZSgpOiBFcnJvciBkZWxldGluZyBkYXRhYmFzZScpO1xuXHR9XG5cblx0Ly8gKkRFVi1OT1RFKiBhZGQgdGhpcyBtZXRob2QgdG8gZG9jc1xuXHRwdWJsaWMgYXN5bmMgcmVzZXRQYWxldHRlSUQoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVzZXRQYWxldHRlSUQoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ107XG5cdFx0XHRjb25zdCBrZXkgPSB0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIXNldHRpbmdzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmdzIG5vdCBmb3VuZC4gQ2Fubm90IHJlc2V0IHBhbGV0dGUgSUQuJyk7XG5cblx0XHRcdHNldHRpbmdzLmxhc3RQYWxldHRlSUQgPSAwO1xuXG5cdFx0XHRhd2FpdCBkYi5wdXQoc3RvcmVOYW1lLCB7IGtleSwgLi4udGhpcy5kZWZhdWx0U2V0dGluZ3MgfSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgUGFsZXR0ZSBJRCBoYXMgc3VjY2Vzc2Z1bGx5IGJlZW4gcmVzZXQgdG8gMGAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0UGFsZXR0ZUlEKCk6IEVycm9yIHJlc2V0dGluZyBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZURhdGE8VD4oXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nLFxuXHRcdGRhdGE6IFQsXG5cdFx0b2xkVmFsdWU/OiBUXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3NhdmVEYXRhKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLmRiVXRpbHMuc3RvcmUud2l0aFN0b3JlKFxuXHRcdFx0XHRkYixcblx0XHRcdFx0c3RvcmVOYW1lLFxuXHRcdFx0XHQncmVhZHdyaXRlJyxcblx0XHRcdFx0YXN5bmMgc3RvcmUgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleSwgLi4uZGF0YSB9KTtcblxuXHRcdFx0XHRcdGxvZ2dlci5tdXRhdGlvbihcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRcdFx0bmV3VmFsdWU6IGRhdGEsXG5cdFx0XHRcdFx0XHRcdG9sZFZhbHVlOiBvbGRWYWx1ZSB8fCBudWxsLFxuXHRcdFx0XHRcdFx0XHRvcmlnaW46ICdzYXZlRGF0YSdcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRtdXRhdGlvbkxvZyA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0XHRcdCdNdXRhdGlvbiBsb2cgdHJpZ2dlcmVkIGZvciBzYXZlRGF0YTonLFxuXHRcdFx0XHRcdFx0XHRcdG11dGF0aW9uTG9nXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZURhdGEoKTogRXJyb3Igc2F2aW5nIGRhdGEnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZVRvREIoXG5cdFx0dHlwZTogc3RyaW5nLFxuXHRcdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRcdHBhbGV0dGVJRDogbnVtYmVyLFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0bGltaXREYXJrOiBib29sZWFuLFxuXHRcdGxpbWl0R3JheTogYm9vbGVhbixcblx0XHRsaW1pdExpZ2h0OiBib29sZWFuXG5cdCk6IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3UGFsZXR0ZSA9IHRoaXMuY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0aXRlbXMsXG5cdFx0XHRcdHBhbGV0dGVJRCxcblx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdGxpbWl0RGFyayxcblx0XHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0XHRsaW1pdExpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBpZFBhcnRzID0gbmV3UGFsZXR0ZS5pZC5zcGxpdCgnXycpO1xuXG5cdFx0XHRpZiAoaWRQYXJ0cy5sZW5ndGggIT09IDIgfHwgaXNOYU4oTnVtYmVyKGlkUGFydHNbMV0pKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFsZXR0ZSBJRCBmb3JtYXQ6ICR7bmV3UGFsZXR0ZS5pZH1gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlUGFsZXR0ZShuZXdQYWxldHRlLmlkLCB7XG5cdFx0XHRcdHRhYmxlSUQ6IHBhcnNlSW50KGlkUGFydHNbMV0sIDEwKSxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXdQYWxldHRlO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVQYWxldHRlVG9EQigpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZSB0byBEQicpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlKFxuXHRcdGlkOiBzdHJpbmcsXG5cdFx0bmV3UGFsZXR0ZTogU3RvcmVkUGFsZXR0ZVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdzYXZlUGFsZXR0ZSgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZSA9IGF3YWl0IHRoaXMuZ2V0U3RvcmUoJ3RhYmxlcycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHBhbGV0dGVUb1NhdmU6IFN0b3JlZFBhbGV0dGUgPSB7XG5cdFx0XHRcdHRhYmxlSUQ6IG5ld1BhbGV0dGUudGFibGVJRCxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZS5wYWxldHRlXG5cdFx0XHR9O1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6IGlkLCAuLi5wYWxldHRlVG9TYXZlIH0pO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFBhbGV0dGUgJHtpZH0gc2F2ZWQgc3VjY2Vzc2Z1bGx5LmAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVQYWxldHRlKCk6IEVycm9yIHNhdmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVBhbGV0dGVIaXN0b3J5KHBhbGV0dGVIaXN0b3J5OiBQYWxldHRlW10pOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdzZXR0aW5ncycsICdyZWFkd3JpdGUnKTtcblx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdzZXR0aW5ncycpO1xuXG5cdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5OiAncGFsZXR0ZUhpc3RvcnknLCBwYWxldHRlczogcGFsZXR0ZUhpc3RvcnkgfSk7XG5cdFx0YXdhaXQgdHguZG9uZTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlU2V0dGluZ3MobmV3U2V0dGluZ3M6IFNldHRpbmdzKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnc2F2ZVNldHRpbmdzKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3NldHRpbmdzJywgJ2FwcFNldHRpbmdzJywgbmV3U2V0dGluZ3MpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0J1NldHRpbmdzIHVwZGF0ZWQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlU2V0dGluZ3MoKTogRXJyb3Igc2F2aW5nIHNldHRpbmdzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgdXBkYXRlRW50cnlJblBhbGV0dGUoXG5cdFx0dGFibGVJRDogc3RyaW5nLFxuXHRcdGVudHJ5SW5kZXg6IG51bWJlcixcblx0XHRuZXdFbnRyeTogUGFsZXR0ZUl0ZW1cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAndXBkYXRlRW50cnlJblBhbGV0dGUoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0aWYgKCEoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cygndGFibGVzJywgdGFibGVJRCkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSUR9IG5vdCBmb3VuZC5gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0VGFibGUodGFibGVJRCk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXG5cdFx0XHRjb25zdCB7IGl0ZW1zIH0gPSBzdG9yZWRQYWxldHRlLnBhbGV0dGU7XG5cblx0XHRcdGlmIChlbnRyeUluZGV4ID49IGl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgRW50cnkgJHtlbnRyeUluZGV4fSBub3QgZm91bmQgaW4gcGFsZXR0ZSAke3RhYmxlSUR9LmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdCd1cGRhdGVFbnRyeUluUGFsZXR0ZTogRW50cnkgbm90IGZvdW5kLicsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkRW50cnkgPSBpdGVtc1tlbnRyeUluZGV4XTtcblxuXHRcdFx0aXRlbXNbZW50cnlJbmRleF0gPSBuZXdFbnRyeTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgndGFibGVzJywgdGFibGVJRCwgc3RvcmVkUGFsZXR0ZSk7XG5cblx0XHRcdGxvZ2dlci5tdXRhdGlvbihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRcdGtleTogYCR7dGFibGVJRH0tJHtlbnRyeUluZGV4fV1gLFxuXHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0bmV3VmFsdWU6IG5ld0VudHJ5LFxuXHRcdFx0XHRcdG9sZFZhbHVlOiBvbGRFbnRyeSxcblx0XHRcdFx0XHRvcmlnaW46ICd1cGRhdGVFbnRyeUluUGFsZXR0ZSdcblx0XHRcdFx0fSxcblx0XHRcdFx0bXV0YXRpb25Mb2cgPT5cblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRcdGBNdXRhdGlvbiBsb2cgdHJpZ2dlciBmb3IgdXBkYXRlRW50cnlJblBhbGV0dGU6YCxcblx0XHRcdFx0XHRcdG11dGF0aW9uTG9nXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQgJiYgdGhpcy5sb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IGluIHBhbGV0dGUgJHt0YWJsZUlEfSB1cGRhdGVkLmBcblx0XHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci51cGRhdGVFbnRyeUluUGFsZXR0ZSgpOiBFcnJvciB1cGRhdGluZyBlbnRyeSBpbiBwYWxldHRlJyk7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLy8gKiAqICogKiAqICogUFJJVkFURSBNRVRIT0RTICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHJpdmF0ZSBhc3luYyBlbnN1cmVFbnRyeUV4aXN0cyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWRvbmx5Jylcblx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0cmV0dXJuIChhd2FpdCBzdG9yZS5nZXQoa2V5KSkgIT09IHVuZGVmaW5lZDtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVmYXVsdEtleShcblx0XHRrZXk6IGtleW9mIENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ1NUT1JFX05BTUVTJ11cblx0KTogc3RyaW5nIHtcblx0XHRjb25zdCBkZWZhdWx0S2V5ID1cblx0XHRcdHRoaXMuZGVmYXVsdEtleXNbXG5cdFx0XHRcdGtleSBhcyBrZXlvZiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydERUZBVUxUX0tFWVMnXVxuXHRcdFx0XTtcblxuXHRcdGlmICghZGVmYXVsdEtleSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBbZ2V0RGVmYXVsdEtleSgpXTogSW52YWxpZCBkZWZhdWx0IGtleTogJHtrZXl9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRLZXk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGdldFRhYmxlKGlkOiBzdHJpbmcpOiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdnZXRUYWJsZSgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLmdldCh0aGlzLnN0b3JlTmFtZXMuVEFCTEVTLCBpZCk7XG5cblx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2Fybilcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBUYWJsZSB3aXRoIElEICR7aWR9IG5vdCBmb3VuZC5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldFRhYmxlKCk6IEVycm9yIGZldGNoaW5nIHRhYmxlJyk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIHVwZGF0ZUN1cnJlbnRQYWxldHRlSUQobmV3SUQ6IG51bWJlcik6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3VwZGF0ZUN1cnJlbnRQYWxldHRlSUQoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdzZXR0aW5ncycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3NldHRpbmdzJyk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBVcGRhdGluZyBjdXJlbnQgcGFsZXR0ZSBJRCB0byAke25ld0lEfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6ICdhcHBTZXR0aW5ncycsIGxhc3RQYWxldHRlSUQ6IG5ld0lEIH0pO1xuXHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBDdXJyZW50IHBhbGV0dGUgSUQgdXBkYXRlZCB0byAke25ld0lEfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQoKTogRXJyb3IgdXBkYXRpbmcgY3VycmVudCBwYWxldHRlIElEJyk7XG5cdH1cbn1cbiJdfQ==