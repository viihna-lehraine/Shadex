// File: src/db/IDBManager.js
import { config, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';
import { initializeDB } from './initialize.js';
import { MutationTracker } from './mutations/index.js';
import { storeUtils } from './storeUtils.js';
import { utils } from '../common/index.js';
const logger = await createLogger();
export class IDBManager {
    static instance = null;
    dbPromise;
    dbData = config.db;
    mode = mode;
    logMode = mode.logging;
    storeUtils;
    cache = {};
    defaultKeys = config.db.DEFAULT_KEYS;
    defaultSettings = config.db.DEFAULT_SETTINGS;
    storeNames = config.db.STORE_NAMES;
    errorUtils;
    mutationTracker;
    constructor() {
        this.dbPromise = initializeDB();
        this.dbData = this.dbData;
        this.defaultKeys = config.db.DEFAULT_KEYS;
        this.defaultSettings = config.db.DEFAULT_SETTINGS;
        this.storeNames = config.db.STORE_NAMES;
        this.storeUtils = storeUtils;
        this.errorUtils = utils.errors;
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
                        logger.info(`Mutation detected: ${JSON.stringify(mutationLog)}`, 'IDBManager.createMutationLogger()');
                    self.mutationTracker
                        .persistMutation(mutationLog)
                        .catch(err => {
                        if (self.logMode.error)
                            logger.error(`Failed to persist mutation: ${err.message}`, 'IDBManager.createMutationLogger()');
                    });
                }
                return success;
            }
        });
    }
    createPaletteObject(type, items, paletteID, swatches, enableAlpha, limitDark, limitGray, limitLight) {
        return utils.palette.createObject(type, items, swatches, paletteID, enableAlpha, limitDark, limitGray, limitLight);
    }
    // *DEV-NOTE* add this method to docs
    async deleteEntry(storeName, key) {
        return this.errorUtils.handleAsync(async () => {
            if (!(await this.ensureEntryExists(storeName, key))) {
                if (this.logMode.warn) {
                    logger.warn(`Entry with key ${key} not found.`, 'IDBManager.deleteEntry()');
                }
                return;
            }
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            await store.delete(key);
            if (!this.mode.quiet) {
                logger.info(`Entry with key ${key} deleted successfully.`, 'IDBManager.deleteEntry()');
            }
        }, 'IDBManager.deleteData(): Error deleting entry');
    }
    async deleteEntries(storeName, keys) {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            const validKeys = (await Promise.all(keys.map(async (key) => (await this.ensureEntryExists(storeName, key))
                ? key
                : null))).filter((key) => key !== null);
            await Promise.all(validKeys.map(key => store.delete(key)));
            if (!this.mode.quiet) {
                logger.info(`Entries deleted successfully. Keys: ${validKeys}`, 'IDBManager.deleteEntries()');
            }
        }, 'IDBManager.deleteEntries(): Error deleting entries');
    }
    async getCurrentPaletteID() {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                logger.info(`Fetched settings from IndexedDB: ${settings}`, 'IDBManager.getCurrentPaletteID()');
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
        return this.errorUtils.handleAsync(async () => {
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
        return this.errorUtils.handleAsync(async () => {
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
        return this.errorUtils.handleAsync(async () => {
            const currentID = await this.getCurrentPaletteID();
            const newID = currentID + 1;
            await this.updateCurrentPaletteID(newID);
            return newID;
        }, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
    }
    async getSettings() {
        return this.errorUtils.handleAsync(async () => {
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
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const availableStores = Array.from(db.objectStoreNames);
            const expectedStores = Object.values(this.storeNames);
            for (const storeName of expectedStores) {
                if (!availableStores.includes(storeName)) {
                    logger.warn(`Object store "${storeName}" not found in IndexedDB.`, 'IDBManager.resetDatabase()');
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
                    logger.info(`IndexedDB has been reset to default settings.`, 'IDBManager.resetDatabase()');
            }
        }, 'IDBManager.resetDatabase(): Error resetting database');
    }
    async deleteDatabase() {
        await this.errorUtils.handleAsync(async () => {
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
                        logger.info(`Database "${dbName}" deleted successfully.`, 'IDBManager.deleteDatabase()');
                };
                deleteRequest.onerror = event => {
                    logger.error(`Error deleting database "${dbName}":\nEvent: ${event}`, 'IDBManager.deleteDatabase()');
                };
                deleteRequest.onblocked = () => {
                    if (this.logMode.warn)
                        logger.warn(`Delete operation blocked. Ensure no open connections to "${dbName}".`, 'IDBManager.deleteDatabase()');
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    logger.warn(`Database "${dbName}" does not exist.`, 'IDBManager.deleteDatabase()');
            }
        }, 'IDBManager.deleteDatabase(): Error deleting database');
    }
    // *DEV-NOTE* add this method to docs
    async resetPaletteID() {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const storeName = this.storeNames['SETTINGS'];
            const key = this.getDefaultKey('APP_SETTINGS');
            const settings = await db.get(storeName, key);
            if (!settings)
                throw new Error('Settings not found. Cannot reset palette ID.');
            settings.lastPaletteID = 0;
            await db.put(storeName, { key, ...this.defaultSettings });
            if (!this.mode.quiet)
                logger.info(`Palette ID has successfully been reset to 0`, 'IDBManager.resetPaletteID()');
        }, 'IDBManager.resetPaletteID(): Error resetting palette ID');
    }
    async saveData(storeName, key, data, oldValue) {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            await this.storeUtils.withStore(db, storeName, 'readwrite', async (store) => {
                await store.put({ key, ...data });
                logger.mutation({
                    timestamp: new Date().toISOString(),
                    key,
                    action: 'update',
                    newValue: data,
                    oldValue: oldValue || null,
                    origin: 'saveData'
                }, mutationLog => {
                    console.log('Mutation log triggered for saveData:', mutationLog, 'IDBManager.saveData()');
                });
            });
        }, 'IDBManager.saveData(): Error saving data');
    }
    async savePalette(id, newPalette) {
        return this.errorUtils.handleAsync(async () => {
            const store = await this.getStore('tables', 'readwrite');
            const paletteToSave = {
                tableID: newPalette.tableID,
                palette: newPalette.palette
            };
            await store.put({ key: id, ...paletteToSave });
            if (!this.mode.quiet)
                logger.info(`Palette ${id} saved successfully.`, 'IDBManager.savePalette()');
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteToDB(type, items, paletteID, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return this.errorUtils.handleAsync(async () => {
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
        return this.errorUtils.handleAsync(async () => {
            await this.saveData('settings', 'appSettings', newSettings);
            if (!this.mode.quiet && this.logMode.info)
                logger.info('Settings updated', 'IDBManager.saveSettings()');
        }, 'IDBManager.saveSettings(): Error saving settings');
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        return this.errorUtils.handleAsync(async () => {
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
                    logger.error(`Entry ${entryIndex} not found in palette ${tableID}.`, 'IDBManager.updateEntryInPalette()');
                if (!this.mode.quiet && this.logMode.info)
                    logger.warn('updateEntryInPalette: Entry not found.');
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
            }, mutationLog => console.log(`Mutation log trigger for updateEntryInPalette:`, mutationLog));
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
        await this.dbPromise;
        const db = await this.getDB();
        const storeName = this.storeNames['SETTINGS'];
        const key = this.getDefaultKey('APP_SETTINGS');
        logger.info(`Initializing DB with Store Name: ${storeName}, Key: ${key}`, 'IDBManager > (private async) initializeDB()');
        if (!storeName || !key)
            throw new Error('Invalid store name or key.');
        const settings = await db.get(storeName, key);
        if (!settings) {
            if (!this.mode.quiet) {
                logger.info(`Initializing default settings...`, 'IDBManager > (private async) initializeDB()');
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
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const result = await db.get(this.storeNames.TABLES, id);
            if (!result) {
                if (this.logMode.warn)
                    logger.warn(`Table with ID ${id} not found.`, 'IDBManager > (private async) getTable()');
            }
            return result;
        }, 'IDBManager.getTable(): Error fetching table');
    }
    async updateCurrentPaletteID(newID) {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            if (this.mode.debug)
                logger.info(`Updating curent palette ID to ${newID}`, 'IDBManager > (private async) updateCurrentPaletteID()');
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                logger.info(`Current palette ID updated to ${newID}`, 'IDBManager > (private async) updateCurrentPaletteID()');
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9JREJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZCQUE2QjtBQWlCN0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxPQUFPLFVBQVU7SUFDZCxNQUFNLENBQUMsUUFBUSxHQUFzQixJQUFJLENBQUM7SUFFMUMsU0FBUyxDQUF1QztJQUVoRCxNQUFNLEdBQThCLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDOUMsSUFBSSxHQUFzQixJQUFJLENBQUM7SUFDL0IsT0FBTyxHQUFpQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBRXJELFVBQVUsQ0FBQztJQUVYLEtBQUssR0FHUixFQUFFLENBQUM7SUFFQSxXQUFXLEdBQ2xCLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQ2hCLGVBQWUsR0FDdEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwQixVQUFVLEdBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBRWYsVUFBVSxDQUFvRDtJQUU5RCxlQUFlLENBQWtCO0lBRXpDO1FBQ0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUVoQyxJQUFJLENBQUMsTUFBTSxH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O2dCQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO29CQUNwQixNQUFNLENBQUMsSUFBSSxDQUNWLGlCQUFpQixFQUFFLGFBQWEsRUFDaEMseUNBQXlDLENBQ3pDLENBQUM7WUFDSixDQUFDO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDZixDQUFDLEVBQUUsNkNBQTZDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRU8sS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQWE7UUFDakQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNuRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXpDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNsQixNQUFNLENBQUMsSUFBSSxDQUNWLGlDQUFpQyxLQUFLLEVBQUUsRUFDeEMsdURBQXVELENBQ3ZELENBQUM7WUFFSCxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzlELE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztZQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQ1YsaUNBQWlDLEtBQUssRUFBRSxFQUN4Qyx1REFBdUQsQ0FDdkQsQ0FBQztRQUNKLENBQUMsRUFBRSx3RUFBd0UsQ0FBQyxDQUFDO0lBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZGIvSURCTWFuYWdlci5qc1xuXG5pbXBvcnQgeyBJREJQRGF0YWJhc2UsIElEQlBPYmplY3RTdG9yZSB9IGZyb20gJ2lkYic7XG5pbXBvcnQge1xuXHRDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2UsXG5cdENvbmZpZ0RhdGFJbnRlcmZhY2UsXG5cdEhTTCxcblx0SURCTWFuYWdlckludGVyZmFjZSxcblx0TW9kZURhdGFJbnRlcmZhY2UsXG5cdE11dGF0aW9uTG9nLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlREIsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlU2NoZW1hLFxuXHRTZXR0aW5ncyxcblx0U3RvcmVkUGFsZXR0ZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWcsIG1vZGUgfSBmcm9tICcuLi9jb21tb24vZGF0YS9iYXNlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBpbml0aWFsaXplREIgfSBmcm9tICcuL2luaXRpYWxpemUuanMnO1xuaW1wb3J0IHsgTXV0YXRpb25UcmFja2VyIH0gZnJvbSAnLi9tdXRhdGlvbnMvaW5kZXguanMnO1xuaW1wb3J0IHsgc3RvcmVVdGlscyB9IGZyb20gJy4vc3RvcmVVdGlscy5qcyc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5leHBvcnQgY2xhc3MgSURCTWFuYWdlciBpbXBsZW1lbnRzIElEQk1hbmFnZXJJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSURCTWFuYWdlciB8IG51bGwgPSBudWxsO1xuXG5cdHByaXZhdGUgZGJQcm9taXNlOiBQcm9taXNlPElEQlBEYXRhYmFzZTxQYWxldHRlU2NoZW1hPj47XG5cblx0cHJpdmF0ZSBkYkRhdGE6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ10gPSBjb25maWcuZGI7XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGFJbnRlcmZhY2UgPSBtb2RlO1xuXHRwcml2YXRlIGxvZ01vZGU6IE1vZGVEYXRhSW50ZXJmYWNlWydsb2dnaW5nJ10gPSBtb2RlLmxvZ2dpbmc7XG5cblx0cHJpdmF0ZSBzdG9yZVV0aWxzO1xuXG5cdHByaXZhdGUgY2FjaGU6IFBhcnRpYWw8e1xuXHRcdHNldHRpbmdzOiBTZXR0aW5ncztcblx0XHRjdXN0b21Db2xvcjogSFNMO1xuXHR9PiA9IHt9O1xuXG5cdHByaXZhdGUgZGVmYXVsdEtleXM6IENvbmZpZ0RhdGFJbnRlcmZhY2VbJ2RiJ11bJ0RFRkFVTFRfS0VZUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRwcml2YXRlIGRlZmF1bHRTZXR0aW5nczogQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnREVGQVVMVF9TRVRUSU5HUyddID1cblx0XHRjb25maWcuZGIuREVGQVVMVF9TRVRUSU5HUztcblx0cHJpdmF0ZSBzdG9yZU5hbWVzOiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydTVE9SRV9OQU1FUyddID1cblx0XHRjb25maWcuZGIuU1RPUkVfTkFNRVM7XG5cblx0cHJpdmF0ZSBlcnJvclV0aWxzOiBDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ11bJ2Vycm9ycyddO1xuXG5cdHByaXZhdGUgbXV0YXRpb25UcmFja2VyOiBNdXRhdGlvblRyYWNrZXI7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmRiUHJvbWlzZSA9IGluaXRpYWxpemVEQigpO1xuXG5cdFx0dGhpcy5kYkRhdGEgPSB0aGlzLmRiRGF0YTtcblxuXHRcdHRoaXMuZGVmYXVsdEtleXMgPSBjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzID0gY29uZmlnLmRiLkRFRkFVTFRfU0VUVElOR1M7XG5cdFx0dGhpcy5zdG9yZU5hbWVzID0gY29uZmlnLmRiLlNUT1JFX05BTUVTO1xuXG5cdFx0dGhpcy5zdG9yZVV0aWxzID0gc3RvcmVVdGlscztcblx0XHR0aGlzLmVycm9yVXRpbHMgPSB1dGlscy5lcnJvcnM7XG5cblx0XHR0aGlzLm11dGF0aW9uVHJhY2tlciA9IE11dGF0aW9uVHJhY2tlci5nZXRJbnN0YW5jZShcblx0XHRcdHRoaXMuZGJEYXRhLFxuXHRcdFx0dGhpcy5tb2RlXG5cdFx0KTtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogU1RBVElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRJbnN0YW5jZSgpOiBQcm9taXNlPElEQk1hbmFnZXI+IHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgSURCTWFuYWdlcigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLmluc3RhbmNlLmluaXRpYWxpemVEQigpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmluc3RhbmNlO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyByZXNldEluc3RhbmNlKCk6IHZvaWQge1xuXHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICogKiAqIFBVQkxJQyBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHB1YmxpYyBjcmVhdGVNdXRhdGlvbkxvZ2dlcjxUIGV4dGVuZHMgb2JqZWN0PihvYmo6IFQsIGtleTogc3RyaW5nKTogVCB7XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iaiwge1xuXHRcdFx0c2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5IGFzIGtleW9mIFRdO1xuXHRcdFx0XHRjb25zdCBzdWNjZXNzID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpO1xuXG5cdFx0XHRcdGlmIChzdWNjZXNzKSB7XG5cdFx0XHRcdFx0Y29uc3QgbXV0YXRpb25Mb2c6IE11dGF0aW9uTG9nID0ge1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWU6IHsgW3Byb3BlcnR5XTogdmFsdWUgfSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlOiB7IFtwcm9wZXJ0eV06IG9sZFZhbHVlIH0sXG5cdFx0XHRcdFx0XHRvcmlnaW46ICdQcm94eSdcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBNdXRhdGlvbiBkZXRlY3RlZDogJHtKU09OLnN0cmluZ2lmeShtdXRhdGlvbkxvZyl9YCxcblx0XHRcdFx0XHRcdFx0J0lEQk1hbmFnZXIuY3JlYXRlTXV0YXRpb25Mb2dnZXIoKSdcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRzZWxmLm11dGF0aW9uVHJhY2tlclxuXHRcdFx0XHRcdFx0LnBlcnNpc3RNdXRhdGlvbihtdXRhdGlvbkxvZylcblx0XHRcdFx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2VsZi5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gcGVyc2lzdCBtdXRhdGlvbjogJHtlcnIubWVzc2FnZX1gLFxuXHRcdFx0XHRcdFx0XHRcdFx0J0lEQk1hbmFnZXIuY3JlYXRlTXV0YXRpb25Mb2dnZXIoKSdcblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gc3VjY2Vzcztcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdFx0c3dhdGNoZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUGFsZXR0ZSB7XG5cdFx0cmV0dXJuIHV0aWxzLnBhbGV0dGUuY3JlYXRlT2JqZWN0KFxuXHRcdFx0dHlwZSxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0c3dhdGNoZXMsXG5cdFx0XHRwYWxldHRlSUQsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheSxcblx0XHRcdGxpbWl0TGlnaHRcblx0XHQpO1xuXHR9XG5cblx0Ly8gKkRFVi1OT1RFKiBhZGQgdGhpcyBtZXRob2QgdG8gZG9jc1xuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cnkoXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghKGF3YWl0IHRoaXMuZW5zdXJlRW50cnlFeGlzdHMoc3RvcmVOYW1lLCBrZXkpKSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm4pIHtcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBFbnRyeSB3aXRoIGtleSAke2tleX0gbm90IGZvdW5kLmAsXG5cdFx0XHRcdFx0XHQnSURCTWFuYWdlci5kZWxldGVFbnRyeSgpJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJylcblx0XHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRcdGF3YWl0IHN0b3JlLmRlbGV0ZShrZXkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgRW50cnkgd2l0aCBrZXkgJHtrZXl9IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5LmAsXG5cdFx0XHRcdFx0J0lEQk1hbmFnZXIuZGVsZXRlRW50cnkoKSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhKCk6IEVycm9yIGRlbGV0aW5nIGVudHJ5Jyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cmllcyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzdG9yZSA9IGRiXG5cdFx0XHRcdC50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKVxuXHRcdFx0XHQub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblx0XHRcdGNvbnN0IHZhbGlkS2V5cyA9IChcblx0XHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0a2V5cy5tYXAoYXN5bmMga2V5ID0+XG5cdFx0XHRcdFx0XHQoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cyhzdG9yZU5hbWUsIGtleSkpXG5cdFx0XHRcdFx0XHRcdD8ga2V5XG5cdFx0XHRcdFx0XHRcdDogbnVsbFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KS5maWx0ZXIoKGtleSk6IGtleSBpcyBzdHJpbmcgPT4ga2V5ICE9PSBudWxsKTtcblxuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwodmFsaWRLZXlzLm1hcChrZXkgPT4gc3RvcmUuZGVsZXRlKGtleSkpKTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJpZXMgZGVsZXRlZCBzdWNjZXNzZnVsbHkuIEtleXM6ICR7dmFsaWRLZXlzfWAsXG5cdFx0XHRcdFx0J0lEQk1hbmFnZXIuZGVsZXRlRW50cmllcygpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZUVudHJpZXMoKTogRXJyb3IgZGVsZXRpbmcgZW50cmllcycpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1cnJlbnRQYWxldHRlSUQoKTogUHJvbWlzZTxudW1iZXI+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoXG5cdFx0XHRcdHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSxcblx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEZldGNoZWQgc2V0dGluZ3MgZnJvbSBJbmRleGVkREI6ICR7c2V0dGluZ3N9YCxcblx0XHRcdFx0XHQnSURCTWFuYWdlci5nZXRDdXJyZW50UGFsZXR0ZUlEKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncz8ubGFzdFBhbGV0dGVJRCA/PyAwO1xuXHRcdH0sICdJREJNYW5hZ2VyOiBnZXRDdXJyZW50UGFsZXR0ZUlEKCk6IEVycm9yIGZldGNoaW5nIGN1cnJlbnQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldENhY2hlZFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRpZiAodGhpcy5jYWNoZS5zZXR0aW5ncykgcmV0dXJuIHRoaXMuY2FjaGUuc2V0dGluZ3M7XG5cblx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblxuXHRcdGlmIChzZXR0aW5ncykgdGhpcy5jYWNoZS5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXG5cdFx0cmV0dXJuIHNldHRpbmdzO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1c3RvbUNvbG9yKCk6IFByb21pc2U8SFNMIHwgbnVsbD4ge1xuXHRcdGNvbnN0IGtleSA9IHRoaXMuZGVmYXVsdEtleXNbJ0NVU1RPTV9DT0xPUiddO1xuXHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuc3RvcmVOYW1lc1snQ1VTVE9NX0NPTE9SJ107XG5cblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgZW50cnkgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIWVudHJ5Py5jb2xvcikgcmV0dXJuIG51bGw7XG5cblx0XHRcdHRoaXMuY2FjaGUuY3VzdG9tQ29sb3IgPSBlbnRyeS5jb2xvcjtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIoZW50cnkuY29sb3IsIHN0b3JlTmFtZSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0Q3VzdG9tQ29sb3IoKTogRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIGNvbG9yJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0REIoKTogUHJvbWlzZTxQYWxldHRlREI+IHtcblx0XHRyZXR1cm4gdGhpcy5kYlByb21pc2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TG9nZ2VkT2JqZWN0PFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCB8IG51bGwsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogVCB8IG51bGwge1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU11dGF0aW9uTG9nZ2VyKG9iaiwga2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0VGFibGVJRCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5nZXRTZXR0aW5ncygpO1xuXHRcdFx0Y29uc3QgbGFzdFRhYmxlSUQgPSBzZXR0aW5ncy5sYXN0VGFibGVJRCA/PyAwO1xuXHRcdFx0Y29uc3QgbmV4dElEID0gbGFzdFRhYmxlSUQgKyAxO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCdzZXR0aW5ncycsICdhcHBTZXR0aW5ncycsIHtcblx0XHRcdFx0Li4uc2V0dGluZ3MsXG5cdFx0XHRcdGxhc3RUYWJsZUlEOiBuZXh0SURcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gYHBhbGV0dGVfJHtuZXh0SUR9YDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXROZXh0VGFibGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHRhYmxlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0TmV4dFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRJRCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVJRCgpO1xuXHRcdFx0Y29uc3QgbmV3SUQgPSBjdXJyZW50SUQgKyAxO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQobmV3SUQpO1xuXG5cdFx0XHRyZXR1cm4gbmV3SUQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncyA/PyB0aGlzLmRlZmF1bHRTZXR0aW5ncztcblx0XHR9LCAnSURCTWFuYWdlci5nZXRTZXR0aW5ncygpOiBFcnJvciBmZXRjaGluZyBzZXR0aW5ncycpO1xuXHR9XG5cblx0Ly8gKipERVYtTk9URSoqIEZJR1VSRSBPVVQgSE9XIFRPIElNUExFTUVOVCBoYW5kbGVBc3luYyBIRVJFXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkb25seSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkd3JpdGUnXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkd3JpdGUnPlxuXHQ+O1xuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknIHwgJ3JlYWR3cml0ZSdcblx0KSB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRyZXR1cm4gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlc2V0RGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBhdmFpbGFibGVTdG9yZXMgPSBBcnJheS5mcm9tKGRiLm9iamVjdFN0b3JlTmFtZXMpO1xuXHRcdFx0Y29uc3QgZXhwZWN0ZWRTdG9yZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuc3RvcmVOYW1lcyk7XG5cblx0XHRcdGZvciAoY29uc3Qgc3RvcmVOYW1lIG9mIGV4cGVjdGVkU3RvcmVzKSB7XG5cdFx0XHRcdGlmICghYXZhaWxhYmxlU3RvcmVzLmluY2x1ZGVzKHN0b3JlTmFtZSkpIHtcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBPYmplY3Qgc3RvcmUgXCIke3N0b3JlTmFtZX1cIiBub3QgZm91bmQgaW4gSW5kZXhlZERCLmAsXG5cdFx0XHRcdFx0XHQnSURCTWFuYWdlci5yZXNldERhdGFiYXNlKCknXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblxuXHRcdFx0XHRhd2FpdCBzdG9yZS5jbGVhcigpO1xuXHRcdFx0XHRhd2FpdCB0eC5kb25lO1xuXG5cdFx0XHRcdGNvbnN0IHNldHRpbmdzU3RvcmUgPSBkYlxuXHRcdFx0XHRcdC50cmFuc2FjdGlvbih0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sICdyZWFkd3JpdGUnKVxuXHRcdFx0XHRcdC5vYmplY3RTdG9yZSh0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10pO1xuXHRcdFx0XHRhd2FpdCBzZXR0aW5nc1N0b3JlLnB1dChcblx0XHRcdFx0XHR0aGlzLmRlZmF1bHRTZXR0aW5ncyxcblx0XHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRgSW5kZXhlZERCIGhhcyBiZWVuIHJlc2V0IHRvIGRlZmF1bHQgc2V0dGluZ3MuYCxcblx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyLnJlc2V0RGF0YWJhc2UoKSdcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0RGF0YWJhc2UoKTogRXJyb3IgcmVzZXR0aW5nIGRhdGFiYXNlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiTmFtZSA9ICdwYWxldHRlREInO1xuXHRcdFx0Y29uc3QgZGJFeGlzdHMgPSBhd2FpdCBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG5cblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0cmVxdWVzdC5yZXN1bHQuY2xvc2UoKTtcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKGZhbHNlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoZGJFeGlzdHMpIHtcblx0XHRcdFx0Y29uc3QgZGVsZXRlUmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShkYk5hbWUpO1xuXG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBEYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5LmAsXG5cdFx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyLmRlbGV0ZURhdGFiYXNlKCknXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PiB7XG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlIFwiJHtkYk5hbWV9XCI6XFxuRXZlbnQ6ICR7ZXZlbnR9YCxcblx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyLmRlbGV0ZURhdGFiYXNlKCknXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRcdGBEZWxldGUgb3BlcmF0aW9uIGJsb2NrZWQuIEVuc3VyZSBubyBvcGVuIGNvbm5lY3Rpb25zIHRvIFwiJHtkYk5hbWV9XCIuYCxcblx0XHRcdFx0XHRcdFx0J0lEQk1hbmFnZXIuZGVsZXRlRGF0YWJhc2UoKSdcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlLnNob3dBbGVydHMpXG5cdFx0XHRcdFx0XHRhbGVydChcblx0XHRcdFx0XHRcdFx0YFVuYWJsZSB0byBkZWxldGUgZGF0YWJhc2UgXCIke2RiTmFtZX1cIiBiZWNhdXNlIGl0IGlzIGluIHVzZS4gUGxlYXNlIGNsb3NlIGFsbCBvdGhlciB0YWJzIG9yIHdpbmRvd3MgYWNjZXNzaW5nIHRoaXMgZGF0YWJhc2UgYW5kIHRyeSBhZ2Fpbi5gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS5zdGFja1RyYWNlKVxuXHRcdFx0XHRcdFx0Y29uc29sZS50cmFjZShgQmxvY2tlZCBjYWxsIHN0YWNrOmApO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRgRGF0YWJhc2UgXCIke2RiTmFtZX1cIiBkb2VzIG5vdCBleGlzdC5gLFxuXHRcdFx0XHRcdFx0J0lEQk1hbmFnZXIuZGVsZXRlRGF0YWJhc2UoKSdcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZURhdGFiYXNlKCk6IEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlJyk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyByZXNldFBhbGV0dGVJRCgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXTtcblx0XHRcdGNvbnN0IGtleSA9IHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRcdGlmICghc2V0dGluZ3MpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignU2V0dGluZ3Mgbm90IGZvdW5kLiBDYW5ub3QgcmVzZXQgcGFsZXR0ZSBJRC4nKTtcblxuXHRcdFx0c2V0dGluZ3MubGFzdFBhbGV0dGVJRCA9IDA7XG5cblx0XHRcdGF3YWl0IGRiLnB1dChzdG9yZU5hbWUsIHsga2V5LCAuLi50aGlzLmRlZmF1bHRTZXR0aW5ncyB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBQYWxldHRlIElEIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiByZXNldCB0byAwYCxcblx0XHRcdFx0XHQnSURCTWFuYWdlci5yZXNldFBhbGV0dGVJRCgpJ1xuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0UGFsZXR0ZUlEKCk6IEVycm9yIHJlc2V0dGluZyBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZURhdGE8VD4oXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nLFxuXHRcdGRhdGE6IFQsXG5cdFx0b2xkVmFsdWU/OiBUXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnN0b3JlVXRpbHMud2l0aFN0b3JlKFxuXHRcdFx0XHRkYixcblx0XHRcdFx0c3RvcmVOYW1lLFxuXHRcdFx0XHQncmVhZHdyaXRlJyxcblx0XHRcdFx0YXN5bmMgc3RvcmUgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleSwgLi4uZGF0YSB9KTtcblxuXHRcdFx0XHRcdGxvZ2dlci5tdXRhdGlvbihcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRcdFx0bmV3VmFsdWU6IGRhdGEsXG5cdFx0XHRcdFx0XHRcdG9sZFZhbHVlOiBvbGRWYWx1ZSB8fCBudWxsLFxuXHRcdFx0XHRcdFx0XHRvcmlnaW46ICdzYXZlRGF0YSdcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRtdXRhdGlvbkxvZyA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0XHRcdCdNdXRhdGlvbiBsb2cgdHJpZ2dlcmVkIGZvciBzYXZlRGF0YTonLFxuXHRcdFx0XHRcdFx0XHRcdG11dGF0aW9uTG9nLFxuXHRcdFx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyLnNhdmVEYXRhKCknXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlRGF0YSgpOiBFcnJvciBzYXZpbmcgZGF0YScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlKFxuXHRcdGlkOiBzdHJpbmcsXG5cdFx0bmV3UGFsZXR0ZTogU3RvcmVkUGFsZXR0ZVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZSA9IGF3YWl0IHRoaXMuZ2V0U3RvcmUoJ3RhYmxlcycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHBhbGV0dGVUb1NhdmU6IFN0b3JlZFBhbGV0dGUgPSB7XG5cdFx0XHRcdHRhYmxlSUQ6IG5ld1BhbGV0dGUudGFibGVJRCxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZS5wYWxldHRlXG5cdFx0XHR9O1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6IGlkLCAuLi5wYWxldHRlVG9TYXZlIH0pO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFBhbGV0dGUgJHtpZH0gc2F2ZWQgc3VjY2Vzc2Z1bGx5LmAsXG5cdFx0XHRcdFx0J0lEQk1hbmFnZXIuc2F2ZVBhbGV0dGUoKSdcblx0XHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZSgpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlVG9EQihcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3UGFsZXR0ZSA9IHRoaXMuY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0aXRlbXMsXG5cdFx0XHRcdHBhbGV0dGVJRCxcblx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0XHRsaW1pdERhcmssXG5cdFx0XHRcdGxpbWl0R3JheSxcblx0XHRcdFx0bGltaXRMaWdodFxuXHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgaWRQYXJ0cyA9IG5ld1BhbGV0dGUuaWQuc3BsaXQoJ18nKTtcblxuXHRcdFx0aWYgKGlkUGFydHMubGVuZ3RoICE9PSAyIHx8IGlzTmFOKE51bWJlcihpZFBhcnRzWzFdKSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhbGV0dGUgSUQgZm9ybWF0OiAke25ld1BhbGV0dGUuaWR9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZVBhbGV0dGUobmV3UGFsZXR0ZS5pZCwge1xuXHRcdFx0XHR0YWJsZUlEOiBwYXJzZUludChpZFBhcnRzWzFdLCAxMCksXG5cdFx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGVcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3UGFsZXR0ZTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZVRvREIoKTogRXJyb3Igc2F2aW5nIHBhbGV0dGUgdG8gREInKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlU2V0dGluZ3MobmV3U2V0dGluZ3M6IFNldHRpbmdzKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCBuZXdTZXR0aW5ncyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2dnZXIuaW5mbygnU2V0dGluZ3MgdXBkYXRlZCcsICdJREJNYW5hZ2VyLnNhdmVTZXR0aW5ncygpJyk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZVNldHRpbmdzKCk6IEVycm9yIHNhdmluZyBzZXR0aW5ncycpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHVwZGF0ZUVudHJ5SW5QYWxldHRlKFxuXHRcdHRhYmxlSUQ6IHN0cmluZyxcblx0XHRlbnRyeUluZGV4OiBudW1iZXIsXG5cdFx0bmV3RW50cnk6IFBhbGV0dGVJdGVtXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghKGF3YWl0IHRoaXMuZW5zdXJlRW50cnlFeGlzdHMoJ3RhYmxlcycsIHRhYmxlSUQpKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlEfSBub3QgZm91bmQuYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHN0b3JlZFBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldFRhYmxlKHRhYmxlSUQpO1xuXG5cdFx0XHRpZiAoIXN0b3JlZFBhbGV0dGUpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSUR9IG5vdCBmb3VuZC5gKTtcblxuXHRcdFx0Y29uc3QgeyBpdGVtcyB9ID0gc3RvcmVkUGFsZXR0ZS5wYWxldHRlO1xuXG5cdFx0XHRpZiAoZW50cnlJbmRleCA+PSBpdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gbm90IGZvdW5kIGluIHBhbGV0dGUgJHt0YWJsZUlEfS5gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgRW50cnkgJHtlbnRyeUluZGV4fSBub3QgZm91bmQgaW4gcGFsZXR0ZSAke3RhYmxlSUR9LmAsXG5cdFx0XHRcdFx0XHQnSURCTWFuYWdlci51cGRhdGVFbnRyeUluUGFsZXR0ZSgpJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKCd1cGRhdGVFbnRyeUluUGFsZXR0ZTogRW50cnkgbm90IGZvdW5kLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRFbnRyeSA9IGl0ZW1zW2VudHJ5SW5kZXhdO1xuXG5cdFx0XHRpdGVtc1tlbnRyeUluZGV4XSA9IG5ld0VudHJ5O1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCd0YWJsZXMnLCB0YWJsZUlELCBzdG9yZWRQYWxldHRlKTtcblxuXHRcdFx0bG9nZ2VyLm11dGF0aW9uKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0a2V5OiBgJHt0YWJsZUlEfS0ke2VudHJ5SW5kZXh9XWAsXG5cdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRuZXdWYWx1ZTogbmV3RW50cnksXG5cdFx0XHRcdFx0b2xkVmFsdWU6IG9sZEVudHJ5LFxuXHRcdFx0XHRcdG9yaWdpbjogJ3VwZGF0ZUVudHJ5SW5QYWxldHRlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtdXRhdGlvbkxvZyA9PlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0YE11dGF0aW9uIGxvZyB0cmlnZ2VyIGZvciB1cGRhdGVFbnRyeUluUGFsZXR0ZTpgLFxuXHRcdFx0XHRcdFx0bXV0YXRpb25Mb2dcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gaW4gcGFsZXR0ZSAke3RhYmxlSUR9IHVwZGF0ZWQuYFxuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUVudHJ5SW5QYWxldHRlKCk6IEVycm9yIHVwZGF0aW5nIGVudHJ5IGluIHBhbGV0dGUnKTtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vLyAqICogKiAqICAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vLyAqICogKiAqICogKiBQUklWQVRFIE1FVEhPRFMgKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwcml2YXRlIGFzeW5jIGluaXRpYWxpemVEQigpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmRiUHJvbWlzZTtcblxuXHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXTtcblx0XHRjb25zdCBrZXkgPSB0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpO1xuXG5cdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRgSW5pdGlhbGl6aW5nIERCIHdpdGggU3RvcmUgTmFtZTogJHtzdG9yZU5hbWV9LCBLZXk6ICR7a2V5fWAsXG5cdFx0XHQnSURCTWFuYWdlciA+IChwcml2YXRlIGFzeW5jKSBpbml0aWFsaXplREIoKSdcblx0XHQpO1xuXG5cdFx0aWYgKCFzdG9yZU5hbWUgfHwgIWtleSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0b3JlIG5hbWUgb3Iga2V5LicpO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0aWYgKCFzZXR0aW5ncykge1xuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEluaXRpYWxpemluZyBkZWZhdWx0IHNldHRpbmdzLi4uYCxcblx0XHRcdFx0XHQnSURCTWFuYWdlciA+IChwcml2YXRlIGFzeW5jKSBpbml0aWFsaXplREIoKSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgZGIucHV0KHN0b3JlTmFtZSwgeyBrZXksIC4uLnRoaXMuZGVmYXVsdFNldHRpbmdzIH0pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZW5zdXJlRW50cnlFeGlzdHMoXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nXG5cdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdC50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkb25seScpXG5cdFx0XHQub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblxuXHRcdHJldHVybiAoYXdhaXQgc3RvcmUuZ2V0KGtleSkpICE9PSB1bmRlZmluZWQ7XG5cdH1cblxuXHRwcml2YXRlIGdldERlZmF1bHRLZXkoXG5cdFx0a2V5OiBrZXlvZiBDb25maWdEYXRhSW50ZXJmYWNlWydkYiddWydTVE9SRV9OQU1FUyddXG5cdCk6IHN0cmluZyB7XG5cdFx0Y29uc3QgZGVmYXVsdEtleSA9XG5cdFx0XHR0aGlzLmRlZmF1bHRLZXlzW1xuXHRcdFx0XHRrZXkgYXMga2V5b2YgQ29uZmlnRGF0YUludGVyZmFjZVsnZGInXVsnREVGQVVMVF9LRVlTJ11cblx0XHRcdF07XG5cblx0XHRpZiAoIWRlZmF1bHRLZXkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgW2dldERlZmF1bHRLZXkoKV06IEludmFsaWQgZGVmYXVsdCBrZXk6ICR7a2V5fWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZhdWx0S2V5O1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBnZXRUYWJsZShpZDogc3RyaW5nKTogUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBkYi5nZXQodGhpcy5zdG9yZU5hbWVzLlRBQkxFUywgaWQpO1xuXG5cdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm4pXG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRgVGFibGUgd2l0aCBJRCAke2lkfSBub3QgZm91bmQuYCxcblx0XHRcdFx0XHRcdCdJREJNYW5hZ2VyID4gKHByaXZhdGUgYXN5bmMpIGdldFRhYmxlKCknXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0VGFibGUoKTogRXJyb3IgZmV0Y2hpbmcgdGFibGUnKTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgdXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRDogbnVtYmVyKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdzZXR0aW5ncycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3NldHRpbmdzJyk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBVcGRhdGluZyBjdXJlbnQgcGFsZXR0ZSBJRCB0byAke25ld0lEfWAsXG5cdFx0XHRcdFx0J0lEQk1hbmFnZXIgPiAocHJpdmF0ZSBhc3luYykgdXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6ICdhcHBTZXR0aW5ncycsIGxhc3RQYWxldHRlSUQ6IG5ld0lEIH0pO1xuXHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBDdXJyZW50IHBhbGV0dGUgSUQgdXBkYXRlZCB0byAke25ld0lEfWAsXG5cdFx0XHRcdFx0J0lEQk1hbmFnZXIgPiAocHJpdmF0ZSBhc3luYykgdXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpJ1xuXHRcdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQoKTogRXJyb3IgdXBkYXRpbmcgY3VycmVudCBwYWxldHRlIElEJyk7XG5cdH1cbn1cbiJdfQ==