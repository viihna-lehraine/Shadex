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
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                logger.info(`Current palette ID updated to ${newID}`, `${thisModule} > ${thisMethod}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9JREJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlCQUF5QjtBQWV6QixPQUFPLEVBQUUsVUFBVSxJQUFJLE1BQU0sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVuRCxNQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQztBQUV0QyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sT0FBTyxVQUFVO0lBQ2QsTUFBTSxDQUFDLFFBQVEsR0FBc0IsSUFBSSxDQUFDO0lBRTFDLFNBQVMsQ0FBdUM7SUFFaEQsTUFBTSxHQUE4QixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQzlDLElBQUksR0FBc0IsSUFBSSxDQUFDO0lBQy9CLE9BQU8sR0FBaUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUVyRCxLQUFLLEdBRVIsRUFBRSxDQUFDO0lBRVIsV0FBVyxHQUNWLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ2hCLGVBQWUsR0FDdEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwQixVQUFVLEdBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBRWYsS0FBSyxDQUFvQztJQUN6QyxPQUFPLENBQWlCO0lBRWhDO1FBQ0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FB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RSxDQUFDLElBQUksQ0FBQztZQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQ1YsaUNBQWlDLEtBQUssRUFBRSxFQUN4QyxHQUFHLFVBQVUsTUFBTSxVQUFVLEVBQUUsQ0FDL0IsQ0FBQztRQUNKLENBQUMsRUFBRSx3RUFBd0UsQ0FBQyxDQUFDO0lBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBkYi9JREJNYW5hZ2VyLmpzXG5cbmltcG9ydCB7IElEQlBEYXRhYmFzZSwgSURCUE9iamVjdFN0b3JlIH0gZnJvbSAnaWRiJztcbmltcG9ydCB7XG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0Q29uZmlnRGF0YUludGVyZmFjZSxcblx0TW9kZURhdGFJbnRlcmZhY2UsXG5cdE11dGF0aW9uTG9nLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlREIsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlU2NoZW1hLFxuXHRTZXR0aW5ncyxcblx0U3RvcmVkUGFsZXR0ZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWdEYXRhIGFzIGNvbmZpZyB9IGZyb20gJy4uL2RhdGEvY29uZmlnLmpzJztcbmltcG9ydCB7IGNvbW1vbkZuIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBpbml0aWFsaXplREIgfSBmcm9tICcuL2luaXRpYWxpemUuanMnO1xuaW1wb3J0IHsgZGJVdGlscyB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IHRoaXNNb2R1bGUgPSAnZGIvSURCTWFuYWdlci5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5leHBvcnQgY2xhc3MgSURCTWFuYWdlciB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBJREJNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XG5cblx0cHJpdmF0ZSBkYlByb21pc2U6IFByb21pc2U8SURCUERhdGFiYXNlPFBhbGV0dGVTY2hlbWE+PjtcblxuXHRwcml2YXRlIGRiRGF0YTogQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXSA9IGNvbmZpZy5kYjtcblx0cHJpdmF0ZSBtb2RlOiBNb2RlRGF0YUludGVyZmFjZSA9IG1vZGU7XG5cdHByaXZhdGUgbG9nTW9kZTogTW9kZURhdGFJbnRlcmZhY2VbJ2xvZ2dpbmcnXSA9IG1vZGUubG9nZ2luZztcblxuXHRwcml2YXRlIGNhY2hlOiBQYXJ0aWFsPHtcblx0XHRzZXR0aW5nczogU2V0dGluZ3M7XG5cdH0+ID0ge307XG5cblx0ZGVmYXVsdEtleXM6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ0RFRkFVTFRfS0VZUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRwcml2YXRlIGRlZmF1bHRTZXR0aW5nczogQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnREVGQVVMVF9TRVRUSU5HUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9TRVRUSU5HUztcblx0cHJpdmF0ZSBzdG9yZU5hbWVzOiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydTVE9SRV9OQU1FUyddID1cblx0XHRjb25maWcuZGIuU1RPUkVfTkFNRVM7XG5cblx0cHJpdmF0ZSB1dGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd1dGlscyddO1xuXHRwcml2YXRlIGRiVXRpbHM6IHR5cGVvZiBkYlV0aWxzO1xuXG5cdHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5kYlByb21pc2UgPSBpbml0aWFsaXplREIoKTtcblxuXHRcdHRoaXMuZGJEYXRhID0gdGhpcy5kYkRhdGE7XG5cblx0XHR0aGlzLmRlZmF1bHRLZXlzID0gY29uZmlnLmRiLkRFRkFVTFRfS0VZUztcblx0XHR0aGlzLmRlZmF1bHRTZXR0aW5ncyA9IGNvbmZpZy5kYi5ERUZBVUxUX1NFVFRJTkdTO1xuXHRcdHRoaXMuc3RvcmVOYW1lcyA9IGNvbmZpZy5kYi5TVE9SRV9OQU1FUztcblxuXHRcdHRoaXMubW9kZSA9IG1vZGU7XG5cblx0XHR0aGlzLmRiVXRpbHMgPSBkYlV0aWxzO1xuXHRcdHRoaXMudXRpbHMgPSBjb21tb25Gbi51dGlscztcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogU1RBVElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRJbnN0YW5jZSgpOiBQcm9taXNlPElEQk1hbmFnZXI+IHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgSURCTWFuYWdlcigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLmluc3RhbmNlLmRiUHJvbWlzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcmVzZXRJbnN0YW5jZSgpOiB2b2lkIHtcblx0XHR0aGlzLmluc3RhbmNlID0gbnVsbDtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogKiBQVUJMSUMgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwdWJsaWMgY3JlYXRlTXV0YXRpb25Mb2dnZXI8VCBleHRlbmRzIG9iamVjdD4ob2JqOiBULCBrZXk6IHN0cmluZyk6IFQge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnY3JlYXRlTXV0YXRpb25Mb2dnZXIoKSc7XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iaiwge1xuXHRcdFx0c2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5IGFzIGtleW9mIFRdO1xuXHRcdFx0XHRjb25zdCBzdWNjZXNzID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpO1xuXG5cdFx0XHRcdGlmIChzdWNjZXNzKSB7XG5cdFx0XHRcdFx0Y29uc3QgbXV0YXRpb25Mb2c6IE11dGF0aW9uTG9nID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWU6IHsgW3Byb3BlcnR5XTogdmFsdWUgfSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlOiB7IFtwcm9wZXJ0eV06IG9sZFZhbHVlIH0sXG5cdFx0XHRcdFx0XHRvcmlnaW46ICdQcm94eSdcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBNdXRhdGlvbiBkZXRlY3RlZDogJHtKU09OLnN0cmluZ2lmeShtdXRhdGlvbkxvZyl9YCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHNlbGYucGVyc2lzdE11dGF0aW9uKG11dGF0aW9uTG9nKS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gcGVyc2lzdCBtdXRhdGlvbjogJHtlcnIubWVzc2FnZX1gLFxuXHRcdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBzdWNjZXNzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdHR5cGU6IHN0cmluZyxcblx0XHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0XHRwYWxldHRlSUQ6IG51bWJlcixcblx0XHRzd2F0Y2hlczogbnVtYmVyLFxuXHRcdGxpbWl0RGFyazogYm9vbGVhbixcblx0XHRsaW1pdEdyYXk6IGJvb2xlYW4sXG5cdFx0bGltaXRMaWdodDogYm9vbGVhblxuXHQpOiBQYWxldHRlIHtcblx0XHRyZXR1cm4gdGhpcy51dGlscy5wYWxldHRlLmNyZWF0ZU9iamVjdChcblx0XHRcdHR5cGUsXG5cdFx0XHRpdGVtcyxcblx0XHRcdHN3YXRjaGVzLFxuXHRcdFx0cGFsZXR0ZUlELFxuXHRcdFx0bGltaXREYXJrLFxuXHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodFxuXHRcdCk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyBkZWxldGVFbnRyeShcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRW50cnkoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0aWYgKCEoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cyhzdG9yZU5hbWUsIGtleSkpKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2Fybikge1xuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YEVudHJ5IHdpdGgga2V5ICR7a2V5fSBub3QgZm91bmQuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJ5IHdpdGgga2V5ICR7a2V5fSBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhKCk6IEVycm9yIGRlbGV0aW5nIGVudHJ5Jyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cmllcyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRW50cmllcygpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHRcdFx0Y29uc3QgdmFsaWRLZXlzID0gKFxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRrZXlzLm1hcChhc3luYyBrZXkgPT5cblx0XHRcdFx0XHRcdChhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKHN0b3JlTmFtZSwga2V5KSlcblx0XHRcdFx0XHRcdFx0PyBrZXlcblx0XHRcdFx0XHRcdFx0OiBudWxsXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLmZpbHRlcigoa2V5KToga2V5IGlzIHN0cmluZyA9PiBrZXkgIT09IG51bGwpO1xuXG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbCh2YWxpZEtleXMubWFwKGtleSA9PiBzdG9yZS5kZWxldGUoa2V5KSkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgRW50cmllcyBkZWxldGVkIHN1Y2Nlc3NmdWxseS4gS2V5czogJHt2YWxpZEtleXN9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRW50cmllcygpOiBFcnJvciBkZWxldGluZyBlbnRyaWVzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlcj4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0Q3VycmVudFBhbGV0dGVJRCgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBGZXRjaGVkIHNldHRpbmdzIGZyb20gSW5kZXhlZERCOiAke3NldHRpbmdzfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gc2V0dGluZ3M/Lmxhc3RQYWxldHRlSUQgPz8gMDtcblx0XHR9LCAnSURCTWFuYWdlcjogZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBjdXJyZW50IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDYWNoZWRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG5cdFx0aWYgKHRoaXMuY2FjaGUuc2V0dGluZ3MpIHJldHVybiB0aGlzLmNhY2hlLnNldHRpbmdzO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmdldFNldHRpbmdzKCk7XG5cblx0XHRpZiAoc2V0dGluZ3MpIHRoaXMuY2FjaGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcblxuXHRcdHJldHVybiBzZXR0aW5ncztcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXREQigpOiBQcm9taXNlPFBhbGV0dGVEQj4ge1xuXHRcdHJldHVybiB0aGlzLmRiUHJvbWlzZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRMb2dnZWRPYmplY3Q8VCBleHRlbmRzIG9iamVjdD4oXG5cdFx0b2JqOiBUIHwgbnVsbCxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBUIHwgbnVsbCB7XG5cdFx0aWYgKG9iaikge1xuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIob2JqLCBrZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRQYWxldHRlSUQoKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRJRCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVJRCgpO1xuXHRcdFx0Y29uc3QgbmV3SUQgPSBjdXJyZW50SUQgKyAxO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQobmV3SUQpO1xuXG5cdFx0XHRyZXR1cm4gbmV3SUQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRNdXRhdGlvbnMoKTogUHJvbWlzZTxNdXRhdGlvbkxvZ1tdPiB7XG5cdFx0Y29uc3Qgc3RvcmUgPSBhd2FpdCB0aGlzLmdldFN0b3JlKCdzZXR0aW5ncycsICdyZWFkb25seScpO1xuXHRcdGNvbnN0IGVudHJpZXMgPSBhd2FpdCBzdG9yZS5nZXRBbGwoKTtcblxuXHRcdHJldHVybiBlbnRyaWVzLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5rZXkuc3RhcnRzV2l0aCgnbXV0YXRpb25fJykpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRUYWJsZUlEKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblx0XHRcdGNvbnN0IGxhc3RUYWJsZUlEID0gc2V0dGluZ3MubGFzdFRhYmxlSUQgPz8gMDtcblx0XHRcdGNvbnN0IG5leHRJRCA9IGxhc3RUYWJsZUlEICsgMTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCB7XG5cdFx0XHRcdC4uLnNldHRpbmdzLFxuXHRcdFx0XHRsYXN0VGFibGVJRDogbmV4dElEXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGBwYWxldHRlXyR7bmV4dElEfWA7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFRhYmxlSUQoKTogRXJyb3IgZmV0Y2hpbmcgbmV4dCB0YWJsZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldFBhbGV0dGVIaXN0b3J5KCk6IFByb21pc2U8UGFsZXR0ZVtdPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdnZXRQYWxldHRlSGlzdG9yeSgpJztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3NldHRpbmdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnc2V0dGluZ3MnKTtcblxuXHRcdFx0bGV0IGVudHJ5ID0gYXdhaXQgc3RvcmUuZ2V0KCdwYWxldHRlSGlzdG9yeScpO1xuXG5cdFx0XHRpZiAoIWVudHJ5KSB7XG5cdFx0XHRcdGVudHJ5ID0geyBrZXk6ICdwYWxldHRlSGlzdG9yeScsIHBhbGV0dGVzOiBbXSB9O1xuXHRcdFx0XHRhd2FpdCBzdG9yZS5wdXQoZW50cnkpO1xuXHRcdFx0XHRhd2FpdCB0eC5kb25lO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZW50cnkucGFsZXR0ZXM7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIHJldHJpZXZpbmcgcGFsZXR0ZSBoaXN0b3J5OiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0U2V0dGluZ3MoKTogUHJvbWlzZTxTZXR0aW5ncz4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncyA/PyB0aGlzLmRlZmF1bHRTZXR0aW5ncztcblx0XHR9LCAnSURCTWFuYWdlci5nZXRTZXR0aW5ncygpOiBFcnJvciBmZXRjaGluZyBzZXR0aW5ncycpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkb25seSdcblx0KTogUHJvbWlzZTxcblx0XHRJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgJ3JlYWRvbmx5Jz5cblx0PjtcblxuXHRwdWJsaWMgYXN5bmMgZ2V0U3RvcmU8U3RvcmVOYW1lIGV4dGVuZHMga2V5b2YgUGFsZXR0ZVNjaGVtYT4oXG5cdFx0c3RvcmVOYW1lOiBTdG9yZU5hbWUsXG5cdFx0bW9kZTogJ3JlYWR3cml0ZSdcblx0KTogUHJvbWlzZTxcblx0XHRJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgJ3JlYWR3cml0ZSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkb25seScgfCAncmVhZHdyaXRlJ1xuXHQpIHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblxuXHRcdHJldHVybiBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsIG1vZGUpLm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcGVyc2lzdE11dGF0aW9uKGRhdGE6IE11dGF0aW9uTG9nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgY2FsbGVyID0gJ3BlcnNpc3RNdXRhdGlvbigpJztcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblxuXHRcdGF3YWl0IGRiLnB1dCgnbXV0YXRpb25zJywgZGF0YSk7XG5cblx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdGBQZXJzaXN0ZWQgbXV0YXRpb246ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9YCxcblx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHtjYWxsZXJ9YFxuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVzZXREYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdyZXNldERhdGFiYXNlKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgYXZhaWxhYmxlU3RvcmVzID0gQXJyYXkuZnJvbShkYi5vYmplY3RTdG9yZU5hbWVzKTtcblx0XHRcdGNvbnN0IGV4cGVjdGVkU3RvcmVzID0gT2JqZWN0LnZhbHVlcyh0aGlzLnN0b3JlTmFtZXMpO1xuXG5cdFx0XHRmb3IgKGNvbnN0IHN0b3JlTmFtZSBvZiBleHBlY3RlZFN0b3Jlcykge1xuXHRcdFx0XHRpZiAoIWF2YWlsYWJsZVN0b3Jlcy5pbmNsdWRlcyhzdG9yZU5hbWUpKSB7XG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRgT2JqZWN0IHN0b3JlIFwiJHtzdG9yZU5hbWV9XCIgbm90IGZvdW5kIGluIEluZGV4ZWREQi5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRcdFx0YXdhaXQgc3RvcmUuY2xlYXIoKTtcblx0XHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0XHRjb25zdCBzZXR0aW5nc1N0b3JlID0gZGJcblx0XHRcdFx0XHQudHJhbnNhY3Rpb24odGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddLCAncmVhZHdyaXRlJylcblx0XHRcdFx0XHQub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddKTtcblx0XHRcdFx0YXdhaXQgc2V0dGluZ3NTdG9yZS5wdXQoXG5cdFx0XHRcdFx0dGhpcy5kZWZhdWx0U2V0dGluZ3MsXG5cdFx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0YEluZGV4ZWREQiBoYXMgYmVlbiByZXNldCB0byBkZWZhdWx0IHNldHRpbmdzLmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5yZXNldERhdGFiYXNlKCk6IEVycm9yIHJlc2V0dGluZyBkYXRhYmFzZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGRlbGV0ZURhdGFiYXNlKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVsZXRlRGF0YWJhc2UoKSc7XG5cblx0XHRhd2FpdCB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYk5hbWUgPSAncGFsZXR0ZURCJztcblx0XHRcdGNvbnN0IGRiRXhpc3RzID0gYXdhaXQgbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihkYk5hbWUpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdHJlcXVlc3QucmVzdWx0LmNsb3NlKCk7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGRiRXhpc3RzKSB7XG5cdFx0XHRcdGNvbnN0IGRlbGV0ZVJlcXVlc3QgPSBpbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoZGJOYW1lKTtcblxuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0XHRgRGF0YWJhc2UgXCIke2RiTmFtZX1cIiBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PiB7XG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlIFwiJHtkYk5hbWV9XCI6XFxuRXZlbnQ6ICR7ZXZlbnR9YCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uYmxvY2tlZCA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm4pXG5cdFx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdFx0YERlbGV0ZSBvcGVyYXRpb24gYmxvY2tlZC4gRW5zdXJlIG5vIG9wZW4gY29ubmVjdGlvbnMgdG8gXCIke2RiTmFtZX1cIi5gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0XHRcdFx0YWxlcnQoXG5cdFx0XHRcdFx0XHRcdGBVbmFibGUgdG8gZGVsZXRlIGRhdGFiYXNlIFwiJHtkYk5hbWV9XCIgYmVjYXVzZSBpdCBpcyBpbiB1c2UuIFBsZWFzZSBjbG9zZSBhbGwgb3RoZXIgdGFicyBvciB3aW5kb3dzIGFjY2Vzc2luZyB0aGlzIGRhdGFiYXNlIGFuZCB0cnkgYWdhaW4uYFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUuc3RhY2tUcmFjZSlcblx0XHRcdFx0XHRcdGNvbnNvbGUudHJhY2UoYEJsb2NrZWQgY2FsbCBzdGFjazpgKTtcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZG9lcyBub3QgZXhpc3QuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZURhdGFiYXNlKCk6IEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlJyk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyByZXNldFBhbGV0dGVJRCgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdyZXNldFBhbGV0dGVJRCgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXTtcblx0XHRcdGNvbnN0IGtleSA9IHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRcdGlmICghc2V0dGluZ3MpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignU2V0dGluZ3Mgbm90IGZvdW5kLiBDYW5ub3QgcmVzZXQgcGFsZXR0ZSBJRC4nKTtcblxuXHRcdFx0c2V0dGluZ3MubGFzdFBhbGV0dGVJRCA9IDA7XG5cblx0XHRcdGF3YWl0IGRiLnB1dChzdG9yZU5hbWUsIHsga2V5LCAuLi50aGlzLmRlZmF1bHRTZXR0aW5ncyB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBQYWxldHRlIElEIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiByZXNldCB0byAwYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIucmVzZXRQYWxldHRlSUQoKTogRXJyb3IgcmVzZXR0aW5nIHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlRGF0YTxUPihcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmcsXG5cdFx0ZGF0YTogVCxcblx0XHRvbGRWYWx1ZT86IFRcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnc2F2ZURhdGEoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRcdGF3YWl0IHRoaXMuZGJVdGlscy5zdG9yZS53aXRoU3RvcmUoXG5cdFx0XHRcdGRiLFxuXHRcdFx0XHRzdG9yZU5hbWUsXG5cdFx0XHRcdCdyZWFkd3JpdGUnLFxuXHRcdFx0XHRhc3luYyBzdG9yZSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5LCAuLi5kYXRhIH0pO1xuXG5cdFx0XHRcdFx0bG9nZ2VyLm11dGF0aW9uKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdFx0XHRuZXdWYWx1ZTogZGF0YSxcblx0XHRcdFx0XHRcdFx0b2xkVmFsdWU6IG9sZFZhbHVlIHx8IG51bGwsXG5cdFx0XHRcdFx0XHRcdG9yaWdpbjogJ3NhdmVEYXRhJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG11dGF0aW9uTG9nID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdFx0XHRcdFx0J011dGF0aW9uIGxvZyB0cmlnZ2VyZWQgZm9yIHNhdmVEYXRhOicsXG5cdFx0XHRcdFx0XHRcdFx0bXV0YXRpb25Mb2dcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlRGF0YSgpOiBFcnJvciBzYXZpbmcgZGF0YScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlVG9EQihcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdQYWxldHRlID0gdGhpcy5jcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRpdGVtcyxcblx0XHRcdFx0cGFsZXR0ZUlELFxuXHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0bGltaXREYXJrLFxuXHRcdFx0XHRsaW1pdEdyYXksXG5cdFx0XHRcdGxpbWl0TGlnaHRcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGlkUGFydHMgPSBuZXdQYWxldHRlLmlkLnNwbGl0KCdfJyk7XG5cblx0XHRcdGlmIChpZFBhcnRzLmxlbmd0aCAhPT0gMiB8fCBpc05hTihOdW1iZXIoaWRQYXJ0c1sxXSkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwYWxldHRlIElEIGZvcm1hdDogJHtuZXdQYWxldHRlLmlkfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVQYWxldHRlKG5ld1BhbGV0dGUuaWQsIHtcblx0XHRcdFx0dGFibGVJRDogcGFyc2VJbnQoaWRQYXJ0c1sxXSwgMTApLFxuXHRcdFx0XHRwYWxldHRlOiBuZXdQYWxldHRlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5ld1BhbGV0dGU7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZVBhbGV0dGVUb0RCKCk6IEVycm9yIHNhdmluZyBwYWxldHRlIHRvIERCJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVBhbGV0dGUoXG5cdFx0aWQ6IHN0cmluZyxcblx0XHRuZXdQYWxldHRlOiBTdG9yZWRQYWxldHRlXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3NhdmVQYWxldHRlKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHN0b3JlID0gYXdhaXQgdGhpcy5nZXRTdG9yZSgndGFibGVzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVRvU2F2ZTogU3RvcmVkUGFsZXR0ZSA9IHtcblx0XHRcdFx0dGFibGVJRDogbmV3UGFsZXR0ZS50YWJsZUlELFxuXHRcdFx0XHRwYWxldHRlOiBuZXdQYWxldHRlLnBhbGV0dGVcblx0XHRcdH07XG5cblx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleTogaWQsIC4uLnBhbGV0dGVUb1NhdmUgfSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgUGFsZXR0ZSAke2lkfSBzYXZlZCBzdWNjZXNzZnVsbHkuYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZVBhbGV0dGUoKTogRXJyb3Igc2F2aW5nIHBhbGV0dGUnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZUhpc3RvcnkocGFsZXR0ZUhpc3Rvcnk6IFBhbGV0dGVbXSk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3NldHRpbmdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3NldHRpbmdzJyk7XG5cblx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6ICdwYWxldHRlSGlzdG9yeScsIHBhbGV0dGVzOiBwYWxldHRlSGlzdG9yeSB9KTtcblx0XHRhd2FpdCB0eC5kb25lO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVTZXR0aW5ncyhuZXdTZXR0aW5nczogU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdzYXZlU2V0dGluZ3MoKSc7XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCBuZXdTZXR0aW5ncyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHQnU2V0dGluZ3MgdXBkYXRlZCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVTZXR0aW5ncygpOiBFcnJvciBzYXZpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyB1cGRhdGVFbnRyeUluUGFsZXR0ZShcblx0XHR0YWJsZUlEOiBzdHJpbmcsXG5cdFx0ZW50cnlJbmRleDogbnVtYmVyLFxuXHRcdG5ld0VudHJ5OiBQYWxldHRlSXRlbVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICd1cGRhdGVFbnRyeUluUGFsZXR0ZSgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAoIShhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKCd0YWJsZXMnLCB0YWJsZUlEKSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzdG9yZWRQYWxldHRlID0gYXdhaXQgdGhpcy5nZXRUYWJsZSh0YWJsZUlEKTtcblxuXHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlEfSBub3QgZm91bmQuYCk7XG5cblx0XHRcdGNvbnN0IHsgaXRlbXMgfSA9IHN0b3JlZFBhbGV0dGUucGFsZXR0ZTtcblxuXHRcdFx0aWYgKGVudHJ5SW5kZXggPj0gaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gbm90IGZvdW5kIGluIHBhbGV0dGUgJHt0YWJsZUlEfS5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0J3VwZGF0ZUVudHJ5SW5QYWxldHRlOiBFbnRyeSBub3QgZm91bmQuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRFbnRyeSA9IGl0ZW1zW2VudHJ5SW5kZXhdO1xuXG5cdFx0XHRpdGVtc1tlbnRyeUluZGV4XSA9IG5ld0VudHJ5O1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCd0YWJsZXMnLCB0YWJsZUlELCBzdG9yZWRQYWxldHRlKTtcblxuXHRcdFx0bG9nZ2VyLm11dGF0aW9uKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0a2V5OiBgJHt0YWJsZUlEfS0ke2VudHJ5SW5kZXh9XWAsXG5cdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRuZXdWYWx1ZTogbmV3RW50cnksXG5cdFx0XHRcdFx0b2xkVmFsdWU6IG9sZEVudHJ5LFxuXHRcdFx0XHRcdG9yaWdpbjogJ3VwZGF0ZUVudHJ5SW5QYWxldHRlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtdXRhdGlvbkxvZyA9PlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0YE11dGF0aW9uIGxvZyB0cmlnZ2VyIGZvciB1cGRhdGVFbnRyeUluUGFsZXR0ZTpgLFxuXHRcdFx0XHRcdFx0bXV0YXRpb25Mb2dcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gaW4gcGFsZXR0ZSAke3RhYmxlSUR9IHVwZGF0ZWQuYFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUVudHJ5SW5QYWxldHRlKCk6IEVycm9yIHVwZGF0aW5nIGVudHJ5IGluIHBhbGV0dGUnKTtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vLyAqICogKiAqICAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vLyAqICogKiAqICogKiBQUklWQVRFIE1FVEhPRFMgKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwcml2YXRlIGFzeW5jIGVuc3VyZUVudHJ5RXhpc3RzKFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCBzdG9yZSA9IGRiXG5cdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZG9ubHknKVxuXHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRyZXR1cm4gKGF3YWl0IHN0b3JlLmdldChrZXkpKSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0S2V5KFxuXHRcdGtleToga2V5b2YgQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnU1RPUkVfTkFNRVMnXVxuXHQpOiBzdHJpbmcge1xuXHRcdGNvbnN0IGRlZmF1bHRLZXkgPVxuXHRcdFx0dGhpcy5kZWZhdWx0S2V5c1tcblx0XHRcdFx0a2V5IGFzIGtleW9mIENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ0RFRkFVTFRfS0VZUyddXG5cdFx0XHRdO1xuXG5cdFx0aWYgKCFkZWZhdWx0S2V5KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFtnZXREZWZhdWx0S2V5KCldOiBJbnZhbGlkIGRlZmF1bHQga2V5OiAke2tleX1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEtleTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZ2V0VGFibGUoaWQ6IHN0cmluZyk6IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2dldFRhYmxlKCknO1xuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZGIuZ2V0KHRoaXMuc3RvcmVOYW1lcy5UQUJMRVMsIGlkKTtcblxuXHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YFRhYmxlIHdpdGggSUQgJHtpZH0gbm90IGZvdW5kLmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0VGFibGUoKTogRXJyb3IgZmV0Y2hpbmcgdGFibGUnKTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgdXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRDogbnVtYmVyKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAndXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpJztcblxuXHRcdHJldHVybiB0aGlzLnV0aWxzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3NldHRpbmdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnc2V0dGluZ3MnKTtcblxuXHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5OiAnYXBwU2V0dGluZ3MnLCBsYXN0UGFsZXR0ZUlEOiBuZXdJRCB9KTtcblx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgQ3VycmVudCBwYWxldHRlIElEIHVwZGF0ZWQgdG8gJHtuZXdJRH1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci51cGRhdGVDdXJyZW50UGFsZXR0ZUlEKCk6IEVycm9yIHVwZGF0aW5nIGN1cnJlbnQgcGFsZXR0ZSBJRCcpO1xuXHR9XG59XG4iXX0=