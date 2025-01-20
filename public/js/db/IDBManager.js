// File: src/db/IDBManager.js
import { dbFn } from './index.js';
import { logger } from '../logger/index.js';
import { MutationTracker } from './mutations/index.js';
import { utils } from '../common/index.js';
export class IDBManager {
    static instance = null;
    dbFn = dbFn;
    dbPromise;
    data;
    mode;
    logMode;
    cache = {};
    defaultKeys;
    defaultSettings;
    storeNames;
    storeUtils;
    errorUtils;
    mutationTracker;
    constructor(data) {
        this.dbPromise = this.dbFn.initializeDB();
        this.data = data;
        this.mode = this.data.mode;
        this.logMode = this.data.mode.logging;
        this.defaultKeys = data.config.db.DEFAULT_KEYS;
        this.defaultSettings = data.config.db.DEFAULT_SETTINGS;
        this.storeNames = data.config.db.STORE_NAMES;
        this.storeUtils = this.dbFn.storeUtils;
        this.errorUtils = utils.errors;
        this.mutationTracker = MutationTracker.getInstance(data);
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * STATIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    static async createInstance(data) {
        if (!this.instance) {
            this.instance = new IDBManager(data);
            await this.instance.initializeDB();
        }
        return this.instance;
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('IDBManager instance has not been initialized. Call createInstance first.');
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
                        logger.info(`Mutation detected: ${JSON.stringify(mutationLog)}`);
                    self.mutationTracker
                        .persistMutation(mutationLog)
                        .catch(err => {
                        if (self.logMode.errors)
                            logger.error(`Failed to persist mutation: ${err.message}`);
                    });
                }
                return success;
            }
        });
    }
    createPaletteObject(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return utils.palette.createObject(type, items, baseColor, Date.now(), numBoxes, enableAlpha, limitDark, limitGray, limitLight);
    }
    // *DEV-NOTE* add this method to docs
    async deleteEntry(storeName, key) {
        return this.errorUtils.handleAsync(async () => {
            if (!(await this.ensureEntryExists(storeName, key))) {
                if (this.logMode.warnings) {
                    logger.warning(`Entry with key ${key} not found.`);
                }
                return;
            }
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            await store.delete(key);
            if (!this.mode.quiet) {
                logger.info(`Entry with key ${key} deleted successfully.`);
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
                logger.info(`Entries deleted successfully. Keys: ${validKeys}`);
            }
        }, 'IDBManager.deleteEntries(): Error deleting entries');
    }
    async getCurrentPaletteID() {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                logger.info(`Fetched settings from IndexedDB: ${settings}`);
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
                    logger.warning(`Object store "${storeName}" not found in IndexedDB.`);
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
                    logger.info(`IndexedDB has been reset to default settins.`);
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
                        logger.info(`Database "${dbName}" deleted successfully.`);
                };
                deleteRequest.onerror = event => {
                    console.error(`Error deleting database "${dbName}":`, event);
                };
                deleteRequest.onblocked = () => {
                    if (this.logMode.warnings)
                        logger.warning(`Delete operation blocked. Ensure no open connections to "${dbName}".`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    logger.warning(`Database "${dbName}" does not exist.`);
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
                logger.info(`Palette ID has successfully been reset to 0`);
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
                logger.info(`Palette ${id} saved successfully.`);
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteToDB(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return this.errorUtils.handleAsync(async () => {
            const newPalette = this.createPaletteObject(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight);
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
                logger.info('Settings updated');
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
                if (this.logMode.errors)
                    logger.error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (!this.mode.quiet && this.logMode.info)
                    logger.warning('updateEntryInPalette: Entry not found.');
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
        logger.info(`Initializing DB with Store Name: ${storeName}, Key: ${key}`);
        if (!storeName || !key)
            throw new Error('Invalid store name or key.');
        const settings = await db.get(storeName, key);
        if (!settings) {
            if (!this.mode.quiet) {
                logger.info(`Initializing default settings...`);
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
                if (this.logMode.warnings)
                    logger.warning(`Table with ID ${id} not found.`);
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
                logger.info(`Updating curent palette ID to ${newID}`);
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                logger.info(`Current palette ID updated to ${newID}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9JREJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZCQUE2QjtBQXFCN0IsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNsQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxNQUFNLE9BQU8sVUFBVTtJQUNkLE1BQU0sQ0FBQyxRQUFRLEdBQXNCLElBQUksQ0FBQztJQUUxQyxJQUFJLEdBQXdCLElBQUksQ0FBQztJQUVqQyxTQUFTLENBQXVDO0lBRWhELElBQUksQ0FBZ0I7SUFDcEIsSUFBSSxDQUFXO0lBQ2YsT0FBTyxDQUFzQjtJQUU3QixLQUFLLEdBR1IsRUFBRSxDQUFDO0lBRUEsV0FBVyxDQUF1QjtJQUNsQyxlQUFlLENBQTJCO0lBQzFDLFVBQVUsQ0FBc0I7SUFFaEMsVUFBVSxDQUFvQztJQUM5QyxVQUFVLENBQXNCO0lBRWhDLGVBQWUsQ0FBa0I7SUFFekMsWUFBb0IsSUFBbUI7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN2RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUU3QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUUvQixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELEVBQUU7SUFDRixHQUFHO0lBQ0gsZ0RBQWdEO0lBQ2hELDhDQUE4QztJQUM5QyxnREFBZ0Q7SUFDaEQsR0FBRztJQUNILEVBQUU7SUFFSyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FDakMsSUFBbUI7UUFFbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ2QsMEVBQTBFLENBQzFFLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYTtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsRUFBRTtJQUNGLEdBQUc7SUFDSCxnREFBZ0Q7SUFDaEQsZ0RBQWdEO0lBQ2hELGdEQUFnRDtJQUNoRCxHQUFHO0lBQ0gsRUFBRTtJQUVLLG9CQUFvQixDQUFtQixHQUFNLEVBQUUsR0FBVztRQUNoRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDckIsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSztnQkFDMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQW1CLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUNiLE1BQU0sV0FBVyxHQUFnQjt3QkFDaEMsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO3dCQUNuQyxHQUFHO3dCQUNILE1BQU0sRUFBRSxRQUFRO3dCQUNoQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRTt3QkFDL0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUU7d0JBQ2xDLE1BQU0sRUFBRSxPQUFPO3FCQUNmLENBQUM7b0JBRUYsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7d0JBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysc0JBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FDbkQsQ0FBQztvQkFFSCxJQUFJLENBQUMsZUFBZTt5QkFDbEIsZUFBZSxDQUFDLFdBQVcsQ0FBQzt5QkFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNOzRCQUN0QixNQUFNLENBQUMsS0FBSyxDQUNYLCtCQUErQixHQUFHLENBQUMsT0FBTyxFQUFFLENBQzVDLENBQUM7b0JBQ0osQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxPQUFPLE9BQU8sQ0FBQztZQUNoQixDQUFDO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVPLG1CQUFtQixDQUMxQixJQUFZLEVBQ1osS0FBb0IsRUFDcEIsU0FBYyxFQUNkLFFBQWdCLEVBQ2hCLFdBQW9CLEVBQ3BCLFNBQWtCLEVBQ2xCLFNBQWtCLEVBQ2xCLFVBQW1CO1FBRW5CLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQ2hDLElBQUksRUFDSixLQUFLLEVBQ0wsU0FBUyxFQUNULElBQUksQ0FBQyxHQUFHLEVBQUUsRUFDVixRQUFRLEVBQ1IsV0FBVyxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxDQUNWLENBQUM7SUFDSCxDQUFDO0lBRUQscUNBQXFDO0lBQzlCLEtBQUssQ0FBQyxXQUFXLENBQ3ZCLFNBQThCLEVBQzlCLEdBQVc7UUFFWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxhQUFhLENBQUMsQ0FBQztnQkFDcEQsQ0FBQztnQkFFRCxPQUFPO1lBQ1IsQ0FBQztZQUVELE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sS0FBSyxHQUFHLEVBQUU7aUJBQ2QsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7aUJBQ25DLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUV6QixNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0YsQ0FBQyxFQUFFLCtDQUErQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhLENBQ3pCLFNBQThCLEVBQzlCLElBQWM7UUFFZCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sS0FBSyxHQUFHLEVBQUU7aUJBQ2QsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7aUJBQ25DLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QixNQUFNLFNBQVMsR0FBRyxDQUNqQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFLENBQ3BCLENBQUMsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsR0FBRztnQkFDTCxDQUFDLENBQUMsSUFBSSxDQUNQLENBQ0QsQ0FDRCxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBaUIsRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUUvQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7UUFDRixDQUFDLEVBQUUsb0RBQW9ELENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sS0FBSyxDQUFDLG1CQUFtQjtRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FDbEMsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTdELE9BQU8sUUFBUSxFQUFFLGFBQWEsSUFBSSxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUFFLHNFQUFzRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVNLEtBQUssQ0FBQyxpQkFBaUI7UUFDN0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRXBELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTFDLElBQUksUUFBUTtZQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUU3QyxPQUFPLFFBQVEsQ0FBQztJQUNqQixDQUFDO0lBRU0sS0FBSyxDQUFDLGNBQWM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWxELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDN0MsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUUzQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUVyQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFELENBQUMsRUFBRSwwREFBMEQsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSztRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdkIsQ0FBQztJQUVNLGVBQWUsQ0FDckIsR0FBYSxFQUNiLEdBQVc7UUFFWCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1QsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFTSxLQUFLLENBQUMsY0FBYztRQUMxQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzFDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO1lBQzlDLE1BQU0sTUFBTSxHQUFHLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFFL0IsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUU7Z0JBQzlDLEdBQUcsUUFBUTtnQkFDWCxXQUFXLEVBQUUsTUFBTTthQUNuQixDQUFDLENBQUM7WUFFSCxPQUFPLFdBQVcsTUFBTSxFQUFFLENBQUM7UUFDNUIsQ0FBQyxFQUFFLDJEQUEyRCxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVNLEtBQUssQ0FBQyxnQkFBZ0I7UUFDNUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ25ELE1BQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFFNUIsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFekMsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDLEVBQUUsK0RBQStELENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVc7UUFDdkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQ2xDLENBQUM7WUFFRixPQUFPLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ3pDLENBQUMsRUFBRSxtREFBbUQsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFpQk0sS0FBSyxDQUFDLFFBQVEsQ0FDcEIsU0FBb0IsRUFDcEIsSUFBOEI7UUFFOUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDN0MsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN4RCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV0RCxLQUFLLE1BQU0sU0FBUyxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO29CQUMxQyxNQUFNLENBQUMsT0FBTyxDQUNiLGlCQUFpQixTQUFTLDJCQUEyQixDQUNyRCxDQUFDO29CQUNGLFNBQVM7Z0JBQ1YsQ0FBQztnQkFFRCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFeEMsTUFBTSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztnQkFFZCxNQUFNLGFBQWEsR0FBRyxFQUFFO3FCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxXQUFXLENBQUM7cUJBQ3JELFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sYUFBYSxDQUFDLEdBQUcsQ0FDdEIsSUFBSSxDQUFDLGVBQWUsRUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FDbEMsQ0FBQztnQkFFRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO29CQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDOUQsQ0FBQztRQUNGLENBQUMsRUFBRSxzREFBc0QsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxLQUFLLENBQUMsY0FBYztRQUMxQixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzVDLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQztZQUMzQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksT0FBTyxDQUFVLE9BQU8sQ0FBQyxFQUFFO2dCQUNyRCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUV2QyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRTtvQkFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQztnQkFDRixPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ2QsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFdkQsYUFBYSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7d0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQ1YsYUFBYSxNQUFNLHlCQUF5QixDQUM1QyxDQUFDO2dCQUNKLENBQUMsQ0FBQztnQkFDRixhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxFQUFFO29CQUMvQixPQUFPLENBQUMsS0FBSyxDQUNaLDRCQUE0QixNQUFNLElBQUksRUFDdEMsS0FBSyxDQUNMLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUNGLGFBQWEsQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFFO29CQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTt3QkFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FDYiw0REFBNEQsTUFBTSxJQUFJLENBQ3RFLENBQUM7b0JBRUgsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7d0JBQ3ZCLEtBQUssQ0FDSiw4QkFBOEIsTUFBTSx1R0FBdUcsQ0FDM0ksQ0FBQztvQkFFSCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTt3QkFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUM7WUFDSCxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztvQkFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLE1BQU0sbUJBQW1CLENBQUMsQ0FBQztZQUN6RCxDQUFDO1FBQ0YsQ0FBQyxFQUFFLHNEQUFzRCxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELHFDQUFxQztJQUM5QixLQUFLLENBQUMsY0FBYztRQUMxQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMvQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTlDLElBQUksQ0FBQyxRQUFRO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUVqRSxRQUFRLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztZQUUzQixNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFFMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQzdELENBQUMsRUFBRSx5REFBeUQsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUNwQixTQUE4QixFQUM5QixHQUFXLEVBQ1gsSUFBTyxFQUNQLFFBQVk7UUFFWixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQzlCLEVBQUUsRUFDRixTQUFTLEVBQ1QsV0FBVyxFQUNYLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRTtnQkFDYixNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUVsQyxNQUFNLENBQUMsUUFBUSxDQUNkO29CQUNDLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtvQkFDbkMsR0FBRztvQkFDSCxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFLElBQUk7b0JBQ2QsUUFBUSxFQUFFLFFBQVEsSUFBSSxJQUFJO29CQUMxQixNQUFNLEVBQUUsVUFBVTtpQkFDbEIsRUFDRCxXQUFXLENBQUMsRUFBRTtvQkFDYixPQUFPLENBQUMsR0FBRyxDQUNWLHNDQUFzQyxFQUN0QyxXQUFXLEVBQ1gsdUJBQXVCLENBQ3ZCLENBQUM7Z0JBQ0gsQ0FBQyxDQUNELENBQUM7WUFDSCxDQUFDLENBQ0QsQ0FBQztRQUNILENBQUMsRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVyxDQUN2QixFQUFVLEVBQ1YsVUFBeUI7UUFFekIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sYUFBYSxHQUFrQjtnQkFDcEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO2dCQUMzQixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87YUFDM0IsQ0FBQztZQUVGLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDbkQsQ0FBQyxFQUFFLGdEQUFnRCxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQzNCLElBQVksRUFDWixLQUFvQixFQUNwQixTQUFjLEVBQ2QsUUFBZ0IsRUFDaEIsV0FBb0IsRUFDcEIsU0FBa0IsRUFDbEIsU0FBa0IsRUFDbEIsVUFBbUI7UUFFbkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQzFDLElBQUksRUFDSixLQUFLLEVBQ0wsU0FBUyxFQUNULFFBQVEsRUFDUixXQUFXLEVBQ1gsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLENBQ1YsQ0FBQztZQUVGLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZELE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLENBQUM7WUFFRCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNqQyxPQUFPLEVBQUUsVUFBVTthQUNuQixDQUFDLENBQUM7WUFFSCxPQUFPLFVBQVUsQ0FBQztRQUNuQixDQUFDLEVBQUUsMERBQTBELENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU0sS0FBSyxDQUFDLFlBQVksQ0FBQyxXQUFxQjtRQUM5QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRTVELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7Z0JBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNsQyxDQUFDLEVBQUUsa0RBQWtELENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sS0FBSyxDQUFDLG9CQUFvQixDQUNoQyxPQUFlLEVBQ2YsVUFBa0IsRUFDbEIsUUFBcUI7UUFFckIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsT0FBTyxhQUFhLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxhQUFhO2dCQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsT0FBTyxhQUFhLENBQUMsQ0FBQztZQUVsRCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUV4QyxJQUFJLFVBQVUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7b0JBQzVCLE1BQU0sSUFBSSxLQUFLLENBQ2QsU0FBUyxVQUFVLHlCQUF5QixPQUFPLEdBQUcsQ0FDdEQsQ0FBQztnQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtvQkFDdEIsTUFBTSxDQUFDLEtBQUssQ0FDWCxTQUFTLFVBQVUseUJBQXlCLE9BQU8sR0FBRyxDQUN0RCxDQUFDO2dCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUMzRCxDQUFDO1lBRUQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRW5DLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxRQUFRLENBQUM7WUFFN0IsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFdEQsTUFBTSxDQUFDLFFBQVEsQ0FDZDtnQkFDQyxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7Z0JBQ25DLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxVQUFVLEdBQUc7Z0JBQ2hDLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxzQkFBc0I7YUFDOUIsRUFDRCxXQUFXLENBQUMsRUFBRSxDQUNiLE9BQU8sQ0FBQyxHQUFHLENBQ1YsZ0RBQWdELEVBQ2hELFdBQVcsQ0FDWCxDQUNGLENBQUM7WUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUN4QyxNQUFNLENBQUMsSUFBSSxDQUNWLFNBQVMsVUFBVSxlQUFlLE9BQU8sV0FBVyxDQUNwRCxDQUFDO1FBQ0osQ0FBQyxFQUFFLG9FQUFvRSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELEVBQUU7SUFDRixHQUFHO0lBQ0gsOENBQThDO0lBQzlDLDhDQUE4QztJQUM5Qyw4Q0FBOEM7SUFDOUMsR0FBRztJQUNILEVBQUU7SUFFTSxLQUFLLENBQUMsWUFBWTtRQUN6QixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFckIsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sQ0FBQyxJQUFJLENBQ1Ysb0NBQW9DLFNBQVMsVUFBVSxHQUFHLEVBQUUsQ0FDNUQsQ0FBQztRQUVGLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxHQUFHO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBRXRFLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFOUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBRUQsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQzNELENBQUM7SUFDRixDQUFDO0lBRU8sS0FBSyxDQUFDLGlCQUFpQixDQUM5QixTQUE4QixFQUM5QixHQUFXO1FBRVgsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxLQUFLLEdBQUcsRUFBRTthQUNkLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO2FBQ2xDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV6QixPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO0lBQzdDLENBQUM7SUFFTyxhQUFhLENBQUMsR0FBOEI7UUFDbkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFpQyxDQUFDLENBQUM7UUFFdkUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFFTyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQVU7UUFDaEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3QyxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFeEQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO29CQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNmLENBQUMsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTyxLQUFLLENBQUMsc0JBQXNCLENBQUMsS0FBYTtRQUNqRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFdkQsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM5RCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFFZCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELENBQUMsRUFBRSx3RUFBd0UsQ0FBQyxDQUFDO0lBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZGIvSURCTWFuYWdlci5qc1xuXG5pbXBvcnQgeyBJREJQRGF0YWJhc2UsIElEQlBPYmplY3RTdG9yZSB9IGZyb20gJ2lkYic7XG5pbXBvcnQge1xuXHRDb21tb25VdGlsc0ZuRXJyb3JzLFxuXHREYXRhSW50ZXJmYWNlLFxuXHREZWZhdWx0S2V5c0ludGVyZmFjZSxcblx0REJNYXN0ZXJGbkludGVyZmFjZSxcblx0SFNMLFxuXHRJREJNYW5hZ2VySW50ZXJmYWNlLFxuXHRNb2RlRGF0YSxcblx0TXV0YXRpb25Mb2csXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVEQixcblx0UGFsZXR0ZUl0ZW0sXG5cdFBhbGV0dGVTY2hlbWEsXG5cdFNldHRpbmdzLFxuXHRTdG9yZU5hbWVzSW50ZXJmYWNlLFxuXHRTdG9yZWRQYWxldHRlLFxuXHREZWZhdWx0U2V0dGluZ3NJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgZGJGbiB9IGZyb20gJy4vaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IE11dGF0aW9uVHJhY2tlciB9IGZyb20gJy4vbXV0YXRpb25zL2luZGV4LmpzJztcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcblxuZXhwb3J0IGNsYXNzIElEQk1hbmFnZXIgaW1wbGVtZW50cyBJREJNYW5hZ2VySW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IElEQk1hbmFnZXIgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIGRiRm46IERCTWFzdGVyRm5JbnRlcmZhY2UgPSBkYkZuO1xuXG5cdHByaXZhdGUgZGJQcm9taXNlOiBQcm9taXNlPElEQlBEYXRhYmFzZTxQYWxldHRlU2NoZW1hPj47XG5cblx0cHJpdmF0ZSBkYXRhOiBEYXRhSW50ZXJmYWNlO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhO1xuXHRwcml2YXRlIGxvZ01vZGU6IE1vZGVEYXRhWydsb2dnaW5nJ107XG5cblx0cHJpdmF0ZSBjYWNoZTogUGFydGlhbDx7XG5cdFx0c2V0dGluZ3M6IFNldHRpbmdzO1xuXHRcdGN1c3RvbUNvbG9yOiBIU0w7XG5cdH0+ID0ge307XG5cblx0cHJpdmF0ZSBkZWZhdWx0S2V5czogRGVmYXVsdEtleXNJbnRlcmZhY2U7XG5cdHByaXZhdGUgZGVmYXVsdFNldHRpbmdzOiBEZWZhdWx0U2V0dGluZ3NJbnRlcmZhY2U7XG5cdHByaXZhdGUgc3RvcmVOYW1lczogU3RvcmVOYW1lc0ludGVyZmFjZTtcblxuXHRwcml2YXRlIHN0b3JlVXRpbHM6IERCTWFzdGVyRm5JbnRlcmZhY2VbJ3N0b3JlVXRpbHMnXTtcblx0cHJpdmF0ZSBlcnJvclV0aWxzOiBDb21tb25VdGlsc0ZuRXJyb3JzO1xuXG5cdHByaXZhdGUgbXV0YXRpb25UcmFja2VyOiBNdXRhdGlvblRyYWNrZXI7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3RvcihkYXRhOiBEYXRhSW50ZXJmYWNlKSB7XG5cdFx0dGhpcy5kYlByb21pc2UgPSB0aGlzLmRiRm4uaW5pdGlhbGl6ZURCKCk7XG5cblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXHRcdHRoaXMubW9kZSA9IHRoaXMuZGF0YS5tb2RlO1xuXHRcdHRoaXMubG9nTW9kZSA9IHRoaXMuZGF0YS5tb2RlLmxvZ2dpbmc7XG5cblx0XHR0aGlzLmRlZmF1bHRLZXlzID0gZGF0YS5jb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzID0gZGF0YS5jb25maWcuZGIuREVGQVVMVF9TRVRUSU5HUztcblx0XHR0aGlzLnN0b3JlTmFtZXMgPSBkYXRhLmNvbmZpZy5kYi5TVE9SRV9OQU1FUztcblxuXHRcdHRoaXMuc3RvcmVVdGlscyA9IHRoaXMuZGJGbi5zdG9yZVV0aWxzO1xuXHRcdHRoaXMuZXJyb3JVdGlscyA9IHV0aWxzLmVycm9ycztcblxuXHRcdHRoaXMubXV0YXRpb25UcmFja2VyID0gTXV0YXRpb25UcmFja2VyLmdldEluc3RhbmNlKGRhdGEpO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICogKiBTVEFUSUMgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwdWJsaWMgc3RhdGljIGFzeW5jIGNyZWF0ZUluc3RhbmNlKFxuXHRcdGRhdGE6IERhdGFJbnRlcmZhY2Vcblx0KTogUHJvbWlzZTxJREJNYW5hZ2VyPiB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gbmV3IElEQk1hbmFnZXIoZGF0YSk7XG5cdFx0XHRhd2FpdCB0aGlzLmluc3RhbmNlLmluaXRpYWxpemVEQigpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmluc3RhbmNlO1xuXHR9XG5cblx0c3RhdGljIGdldEluc3RhbmNlKCk6IElEQk1hbmFnZXIge1xuXHRcdGlmICghdGhpcy5pbnN0YW5jZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHQnSURCTWFuYWdlciBpbnN0YW5jZSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQuIENhbGwgY3JlYXRlSW5zdGFuY2UgZmlyc3QuJ1xuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2U7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIHJlc2V0SW5zdGFuY2UoKTogdm9pZCB7XG5cdFx0dGhpcy5pbnN0YW5jZSA9IG51bGw7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogKiAqICogUFVCTElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIGNyZWF0ZU11dGF0aW9uTG9nZ2VyPFQgZXh0ZW5kcyBvYmplY3Q+KG9iajogVCwga2V5OiBzdHJpbmcpOiBUIHtcblx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdHJldHVybiBuZXcgUHJveHkob2JqLCB7XG5cdFx0XHRzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRbcHJvcGVydHkgYXMga2V5b2YgVF07XG5cdFx0XHRcdGNvbnN0IHN1Y2Nlc3MgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRjb25zdCBtdXRhdGlvbkxvZzogTXV0YXRpb25Mb2cgPSB7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZTogeyBbcHJvcGVydHldOiB2YWx1ZSB9LFxuXHRcdFx0XHRcdFx0b2xkVmFsdWU6IHsgW3Byb3BlcnR5XTogb2xkVmFsdWUgfSxcblx0XHRcdFx0XHRcdG9yaWdpbjogJ1Byb3h5J1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRpZiAoc2VsZi5sb2dNb2RlLmluZm8pXG5cdFx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdFx0YE11dGF0aW9uIGRldGVjdGVkOiAke0pTT04uc3RyaW5naWZ5KG11dGF0aW9uTG9nKX1gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0c2VsZi5tdXRhdGlvblRyYWNrZXJcblx0XHRcdFx0XHRcdC5wZXJzaXN0TXV0YXRpb24obXV0YXRpb25Mb2cpXG5cdFx0XHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHNlbGYubG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRcdFx0YEZhaWxlZCB0byBwZXJzaXN0IG11dGF0aW9uOiAke2Vyci5tZXNzYWdlfWBcblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gc3VjY2Vzcztcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0YmFzZUNvbG9yOiBIU0wsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUGFsZXR0ZSB7XG5cdFx0cmV0dXJuIHV0aWxzLnBhbGV0dGUuY3JlYXRlT2JqZWN0KFxuXHRcdFx0dHlwZSxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0RGF0ZS5ub3coKSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmssXG5cdFx0XHRsaW1pdEdyYXksXG5cdFx0XHRsaW1pdExpZ2h0XG5cdFx0KTtcblx0fVxuXG5cdC8vICpERVYtTk9URSogYWRkIHRoaXMgbWV0aG9kIHRvIGRvY3Ncblx0cHVibGljIGFzeW5jIGRlbGV0ZUVudHJ5KFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAoIShhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKHN0b3JlTmFtZSwga2V5KSkpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuaW5ncykge1xuXHRcdFx0XHRcdGxvZ2dlci53YXJuaW5nKGBFbnRyeSB3aXRoIGtleSAke2tleX0gbm90IGZvdW5kLmApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oYEVudHJ5IHdpdGgga2V5ICR7a2V5fSBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gKTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhKCk6IEVycm9yIGRlbGV0aW5nIGVudHJ5Jyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cmllcyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzdG9yZSA9IGRiXG5cdFx0XHRcdC50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKVxuXHRcdFx0XHQub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblx0XHRcdGNvbnN0IHZhbGlkS2V5cyA9IChcblx0XHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0a2V5cy5tYXAoYXN5bmMga2V5ID0+XG5cdFx0XHRcdFx0XHQoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cyhzdG9yZU5hbWUsIGtleSkpXG5cdFx0XHRcdFx0XHRcdD8ga2V5XG5cdFx0XHRcdFx0XHRcdDogbnVsbFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KS5maWx0ZXIoKGtleSk6IGtleSBpcyBzdHJpbmcgPT4ga2V5ICE9PSBudWxsKTtcblxuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwodmFsaWRLZXlzLm1hcChrZXkgPT4gc3RvcmUuZGVsZXRlKGtleSkpKTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oYEVudHJpZXMgZGVsZXRlZCBzdWNjZXNzZnVsbHkuIEtleXM6ICR7dmFsaWRLZXlzfWApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZUVudHJpZXMoKTogRXJyb3IgZGVsZXRpbmcgZW50cmllcycpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1cnJlbnRQYWxldHRlSUQoKTogUHJvbWlzZTxudW1iZXI+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoXG5cdFx0XHRcdHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSxcblx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0bG9nZ2VyLmluZm8oYEZldGNoZWQgc2V0dGluZ3MgZnJvbSBJbmRleGVkREI6ICR7c2V0dGluZ3N9YCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncz8ubGFzdFBhbGV0dGVJRCA/PyAwO1xuXHRcdH0sICdJREJNYW5hZ2VyOiBnZXRDdXJyZW50UGFsZXR0ZUlEKCk6IEVycm9yIGZldGNoaW5nIGN1cnJlbnQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldENhY2hlZFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRpZiAodGhpcy5jYWNoZS5zZXR0aW5ncykgcmV0dXJuIHRoaXMuY2FjaGUuc2V0dGluZ3M7XG5cblx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblxuXHRcdGlmIChzZXR0aW5ncykgdGhpcy5jYWNoZS5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXG5cdFx0cmV0dXJuIHNldHRpbmdzO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1c3RvbUNvbG9yKCk6IFByb21pc2U8SFNMIHwgbnVsbD4ge1xuXHRcdGNvbnN0IGtleSA9IHRoaXMuZGVmYXVsdEtleXNbJ0NVU1RPTV9DT0xPUiddO1xuXHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuc3RvcmVOYW1lc1snQ1VTVE9NX0NPTE9SJ107XG5cblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgZW50cnkgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIWVudHJ5Py5jb2xvcikgcmV0dXJuIG51bGw7XG5cblx0XHRcdHRoaXMuY2FjaGUuY3VzdG9tQ29sb3IgPSBlbnRyeS5jb2xvcjtcblxuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIoZW50cnkuY29sb3IsIHN0b3JlTmFtZSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0Q3VzdG9tQ29sb3IoKTogRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIGNvbG9yJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0REIoKTogUHJvbWlzZTxQYWxldHRlREI+IHtcblx0XHRyZXR1cm4gdGhpcy5kYlByb21pc2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TG9nZ2VkT2JqZWN0PFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCB8IG51bGwsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogVCB8IG51bGwge1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU11dGF0aW9uTG9nZ2VyKG9iaiwga2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0VGFibGVJRCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5nZXRTZXR0aW5ncygpO1xuXHRcdFx0Y29uc3QgbGFzdFRhYmxlSUQgPSBzZXR0aW5ncy5sYXN0VGFibGVJRCA/PyAwO1xuXHRcdFx0Y29uc3QgbmV4dElEID0gbGFzdFRhYmxlSUQgKyAxO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCdzZXR0aW5ncycsICdhcHBTZXR0aW5ncycsIHtcblx0XHRcdFx0Li4uc2V0dGluZ3MsXG5cdFx0XHRcdGxhc3RUYWJsZUlEOiBuZXh0SURcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gYHBhbGV0dGVfJHtuZXh0SUR9YDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXROZXh0VGFibGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHRhYmxlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0TmV4dFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRJRCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVJRCgpO1xuXHRcdFx0Y29uc3QgbmV3SUQgPSBjdXJyZW50SUQgKyAxO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQobmV3SUQpO1xuXG5cdFx0XHRyZXR1cm4gbmV3SUQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ10sXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncyA/PyB0aGlzLmRlZmF1bHRTZXR0aW5ncztcblx0XHR9LCAnSURCTWFuYWdlci5nZXRTZXR0aW5ncygpOiBFcnJvciBmZXRjaGluZyBzZXR0aW5ncycpO1xuXHR9XG5cblx0Ly8gKipERVYtTk9URSoqIEZJR1VSRSBPVVQgSE9XIFRPIElNUExFTUVOVCBoYW5kbGVBc3luYyBIRVJFXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkb25seSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkd3JpdGUnXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkd3JpdGUnPlxuXHQ+O1xuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknIHwgJ3JlYWR3cml0ZSdcblx0KSB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRyZXR1cm4gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlc2V0RGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBhdmFpbGFibGVTdG9yZXMgPSBBcnJheS5mcm9tKGRiLm9iamVjdFN0b3JlTmFtZXMpO1xuXHRcdFx0Y29uc3QgZXhwZWN0ZWRTdG9yZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuc3RvcmVOYW1lcyk7XG5cblx0XHRcdGZvciAoY29uc3Qgc3RvcmVOYW1lIG9mIGV4cGVjdGVkU3RvcmVzKSB7XG5cdFx0XHRcdGlmICghYXZhaWxhYmxlU3RvcmVzLmluY2x1ZGVzKHN0b3JlTmFtZSkpIHtcblx0XHRcdFx0XHRsb2dnZXIud2FybmluZyhcblx0XHRcdFx0XHRcdGBPYmplY3Qgc3RvcmUgXCIke3N0b3JlTmFtZX1cIiBub3QgZm91bmQgaW4gSW5kZXhlZERCLmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRcdGF3YWl0IHN0b3JlLmNsZWFyKCk7XG5cdFx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cblx0XHRcdFx0Y29uc3Qgc2V0dGluZ3NTdG9yZSA9IGRiXG5cdFx0XHRcdFx0LnRyYW5zYWN0aW9uKHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdFx0Lm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSk7XG5cdFx0XHRcdGF3YWl0IHNldHRpbmdzU3RvcmUucHV0KFxuXHRcdFx0XHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzLFxuXHRcdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRsb2dnZXIuaW5mbyhgSW5kZXhlZERCIGhhcyBiZWVuIHJlc2V0IHRvIGRlZmF1bHQgc2V0dGlucy5gKTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5yZXNldERhdGFiYXNlKCk6IEVycm9yIHJlc2V0dGluZyBkYXRhYmFzZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGRlbGV0ZURhdGFiYXNlKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYk5hbWUgPSAncGFsZXR0ZURCJztcblx0XHRcdGNvbnN0IGRiRXhpc3RzID0gYXdhaXQgbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihkYk5hbWUpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdHJlcXVlc3QucmVzdWx0LmNsb3NlKCk7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGRiRXhpc3RzKSB7XG5cdFx0XHRcdGNvbnN0IGRlbGV0ZVJlcXVlc3QgPSBpbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoZGJOYW1lKTtcblxuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0XHRgRGF0YWJhc2UgXCIke2RiTmFtZX1cIiBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdGBFcnJvciBkZWxldGluZyBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiOmAsXG5cdFx0XHRcdFx0XHRldmVudFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25ibG9ja2VkID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRcdFx0XHRsb2dnZXIud2FybmluZyhcblx0XHRcdFx0XHRcdFx0YERlbGV0ZSBvcGVyYXRpb24gYmxvY2tlZC4gRW5zdXJlIG5vIG9wZW4gY29ubmVjdGlvbnMgdG8gXCIke2RiTmFtZX1cIi5gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS5zaG93QWxlcnRzKVxuXHRcdFx0XHRcdFx0YWxlcnQoXG5cdFx0XHRcdFx0XHRcdGBVbmFibGUgdG8gZGVsZXRlIGRhdGFiYXNlIFwiJHtkYk5hbWV9XCIgYmVjYXVzZSBpdCBpcyBpbiB1c2UuIFBsZWFzZSBjbG9zZSBhbGwgb3RoZXIgdGFicyBvciB3aW5kb3dzIGFjY2Vzc2luZyB0aGlzIGRhdGFiYXNlIGFuZCB0cnkgYWdhaW4uYFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUuc3RhY2tUcmFjZSlcblx0XHRcdFx0XHRcdGNvbnNvbGUudHJhY2UoYEJsb2NrZWQgY2FsbCBzdGFjazpgKTtcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuaW5nKGBEYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGRvZXMgbm90IGV4aXN0LmApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZURhdGFiYXNlKCk6IEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlJyk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyByZXNldFBhbGV0dGVJRCgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXTtcblx0XHRcdGNvbnN0IGtleSA9IHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRcdGlmICghc2V0dGluZ3MpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignU2V0dGluZ3Mgbm90IGZvdW5kLiBDYW5ub3QgcmVzZXQgcGFsZXR0ZSBJRC4nKTtcblxuXHRcdFx0c2V0dGluZ3MubGFzdFBhbGV0dGVJRCA9IDA7XG5cblx0XHRcdGF3YWl0IGRiLnB1dChzdG9yZU5hbWUsIHsga2V5LCAuLi50aGlzLmRlZmF1bHRTZXR0aW5ncyB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBQYWxldHRlIElEIGhhcyBzdWNjZXNzZnVsbHkgYmVlbiByZXNldCB0byAwYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIucmVzZXRQYWxldHRlSUQoKTogRXJyb3IgcmVzZXR0aW5nIHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlRGF0YTxUPihcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmcsXG5cdFx0ZGF0YTogVCxcblx0XHRvbGRWYWx1ZT86IFRcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRcdGF3YWl0IHRoaXMuc3RvcmVVdGlscy53aXRoU3RvcmUoXG5cdFx0XHRcdGRiLFxuXHRcdFx0XHRzdG9yZU5hbWUsXG5cdFx0XHRcdCdyZWFkd3JpdGUnLFxuXHRcdFx0XHRhc3luYyBzdG9yZSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5LCAuLi5kYXRhIH0pO1xuXG5cdFx0XHRcdFx0bG9nZ2VyLm11dGF0aW9uKFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdFx0XHRuZXdWYWx1ZTogZGF0YSxcblx0XHRcdFx0XHRcdFx0b2xkVmFsdWU6IG9sZFZhbHVlIHx8IG51bGwsXG5cdFx0XHRcdFx0XHRcdG9yaWdpbjogJ3NhdmVEYXRhJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG11dGF0aW9uTG9nID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdFx0XHRcdFx0J011dGF0aW9uIGxvZyB0cmlnZ2VyZWQgZm9yIHNhdmVEYXRhOicsXG5cdFx0XHRcdFx0XHRcdFx0bXV0YXRpb25Mb2csXG5cdFx0XHRcdFx0XHRcdFx0J0lEQk1hbmFnZXIuc2F2ZURhdGEoKSdcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVEYXRhKCk6IEVycm9yIHNhdmluZyBkYXRhJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVBhbGV0dGUoXG5cdFx0aWQ6IHN0cmluZyxcblx0XHRuZXdQYWxldHRlOiBTdG9yZWRQYWxldHRlXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHN0b3JlID0gYXdhaXQgdGhpcy5nZXRTdG9yZSgndGFibGVzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVRvU2F2ZTogU3RvcmVkUGFsZXR0ZSA9IHtcblx0XHRcdFx0dGFibGVJRDogbmV3UGFsZXR0ZS50YWJsZUlELFxuXHRcdFx0XHRwYWxldHRlOiBuZXdQYWxldHRlLnBhbGV0dGVcblx0XHRcdH07XG5cblx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleTogaWQsIC4uLnBhbGV0dGVUb1NhdmUgfSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhgUGFsZXR0ZSAke2lkfSBzYXZlZCBzdWNjZXNzZnVsbHkuYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZVBhbGV0dGUoKTogRXJyb3Igc2F2aW5nIHBhbGV0dGUnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZVRvREIoXG5cdFx0dHlwZTogc3RyaW5nLFxuXHRcdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRcdGJhc2VDb2xvcjogSFNMLFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0ZW5hYmxlQWxwaGE6IGJvb2xlYW4sXG5cdFx0bGltaXREYXJrOiBib29sZWFuLFxuXHRcdGxpbWl0R3JheTogYm9vbGVhbixcblx0XHRsaW1pdExpZ2h0OiBib29sZWFuXG5cdCk6IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IG5ld1BhbGV0dGUgPSB0aGlzLmNyZWF0ZVBhbGV0dGVPYmplY3QoXG5cdFx0XHRcdHR5cGUsXG5cdFx0XHRcdGl0ZW1zLFxuXHRcdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdFx0bGltaXREYXJrLFxuXHRcdFx0XHRsaW1pdEdyYXksXG5cdFx0XHRcdGxpbWl0TGlnaHRcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGlkUGFydHMgPSBuZXdQYWxldHRlLmlkLnNwbGl0KCdfJyk7XG5cblx0XHRcdGlmIChpZFBhcnRzLmxlbmd0aCAhPT0gMiB8fCBpc05hTihOdW1iZXIoaWRQYXJ0c1sxXSkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwYWxldHRlIElEIGZvcm1hdDogJHtuZXdQYWxldHRlLmlkfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVQYWxldHRlKG5ld1BhbGV0dGUuaWQsIHtcblx0XHRcdFx0dGFibGVJRDogcGFyc2VJbnQoaWRQYXJ0c1sxXSwgMTApLFxuXHRcdFx0XHRwYWxldHRlOiBuZXdQYWxldHRlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5ld1BhbGV0dGU7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZVBhbGV0dGVUb0RCKCk6IEVycm9yIHNhdmluZyBwYWxldHRlIHRvIERCJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVNldHRpbmdzKG5ld1NldHRpbmdzOiBTZXR0aW5ncyk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3NldHRpbmdzJywgJ2FwcFNldHRpbmdzJywgbmV3U2V0dGluZ3MpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nZ2VyLmluZm8oJ1NldHRpbmdzIHVwZGF0ZWQnKTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlU2V0dGluZ3MoKTogRXJyb3Igc2F2aW5nIHNldHRpbmdzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgdXBkYXRlRW50cnlJblBhbGV0dGUoXG5cdFx0dGFibGVJRDogc3RyaW5nLFxuXHRcdGVudHJ5SW5kZXg6IG51bWJlcixcblx0XHRuZXdFbnRyeTogUGFsZXR0ZUl0ZW1cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0aWYgKCEoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cygndGFibGVzJywgdGFibGVJRCkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSUR9IG5vdCBmb3VuZC5gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0VGFibGUodGFibGVJRCk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXG5cdFx0XHRjb25zdCB7IGl0ZW1zIH0gPSBzdG9yZWRQYWxldHRlLnBhbGV0dGU7XG5cblx0XHRcdGlmIChlbnRyeUluZGV4ID49IGl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgRW50cnkgJHtlbnRyeUluZGV4fSBub3QgZm91bmQgaW4gcGFsZXR0ZSAke3RhYmxlSUR9LmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgRW50cnkgJHtlbnRyeUluZGV4fSBub3QgZm91bmQgaW4gcGFsZXR0ZSAke3RhYmxlSUR9LmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0XHRsb2dnZXIud2FybmluZygndXBkYXRlRW50cnlJblBhbGV0dGU6IEVudHJ5IG5vdCBmb3VuZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkRW50cnkgPSBpdGVtc1tlbnRyeUluZGV4XTtcblxuXHRcdFx0aXRlbXNbZW50cnlJbmRleF0gPSBuZXdFbnRyeTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgndGFibGVzJywgdGFibGVJRCwgc3RvcmVkUGFsZXR0ZSk7XG5cblx0XHRcdGxvZ2dlci5tdXRhdGlvbihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRcdGtleTogYCR7dGFibGVJRH0tJHtlbnRyeUluZGV4fV1gLFxuXHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0bmV3VmFsdWU6IG5ld0VudHJ5LFxuXHRcdFx0XHRcdG9sZFZhbHVlOiBvbGRFbnRyeSxcblx0XHRcdFx0XHRvcmlnaW46ICd1cGRhdGVFbnRyeUluUGFsZXR0ZSdcblx0XHRcdFx0fSxcblx0XHRcdFx0bXV0YXRpb25Mb2cgPT5cblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRcdGBNdXRhdGlvbiBsb2cgdHJpZ2dlciBmb3IgdXBkYXRlRW50cnlJblBhbGV0dGU6YCxcblx0XHRcdFx0XHRcdG11dGF0aW9uTG9nXG5cdFx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQgJiYgdGhpcy5sb2dNb2RlLmluZm8pXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IGluIHBhbGV0dGUgJHt0YWJsZUlEfSB1cGRhdGVkLmBcblx0XHRcdFx0KTtcblx0XHR9LCAnSURCTWFuYWdlci51cGRhdGVFbnRyeUluUGFsZXR0ZSgpOiBFcnJvciB1cGRhdGluZyBlbnRyeSBpbiBwYWxldHRlJyk7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLy8gKiAqICogKiAqICogUFJJVkFURSBNRVRIT0RTICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHJpdmF0ZSBhc3luYyBpbml0aWFsaXplREIoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5kYlByb21pc2U7XG5cblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnN0b3JlTmFtZXNbJ1NFVFRJTkdTJ107XG5cdFx0Y29uc3Qga2V5ID0gdGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKTtcblxuXHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0YEluaXRpYWxpemluZyBEQiB3aXRoIFN0b3JlIE5hbWU6ICR7c3RvcmVOYW1lfSwgS2V5OiAke2tleX1gXG5cdFx0KTtcblxuXHRcdGlmICghc3RvcmVOYW1lIHx8ICFrZXkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdG9yZSBuYW1lIG9yIGtleS4nKTtcblxuXHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KHN0b3JlTmFtZSwga2V5KTtcblxuXHRcdGlmICghc2V0dGluZ3MpIHtcblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KSB7XG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBJbml0aWFsaXppbmcgZGVmYXVsdCBzZXR0aW5ncy4uLmApO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBkYi5wdXQoc3RvcmVOYW1lLCB7IGtleSwgLi4udGhpcy5kZWZhdWx0U2V0dGluZ3MgfSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBlbnN1cmVFbnRyeUV4aXN0cyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWRvbmx5Jylcblx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0cmV0dXJuIChhd2FpdCBzdG9yZS5nZXQoa2V5KSkgIT09IHVuZGVmaW5lZDtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVmYXVsdEtleShrZXk6IGtleW9mIFN0b3JlTmFtZXNJbnRlcmZhY2UpOiBzdHJpbmcge1xuXHRcdGNvbnN0IGRlZmF1bHRLZXkgPSB0aGlzLmRlZmF1bHRLZXlzW2tleSBhcyBrZXlvZiBEZWZhdWx0S2V5c0ludGVyZmFjZV07XG5cblx0XHRpZiAoIWRlZmF1bHRLZXkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgW2dldERlZmF1bHRLZXkoKV06IEludmFsaWQgZGVmYXVsdCBrZXk6ICR7a2V5fWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZhdWx0S2V5O1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBnZXRUYWJsZShpZDogc3RyaW5nKTogUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBkYi5nZXQodGhpcy5zdG9yZU5hbWVzLlRBQkxFUywgaWQpO1xuXG5cdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm5pbmdzKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuaW5nKGBUYWJsZSB3aXRoIElEICR7aWR9IG5vdCBmb3VuZC5gKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0VGFibGUoKTogRXJyb3IgZmV0Y2hpbmcgdGFibGUnKTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgdXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRDogbnVtYmVyKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdzZXR0aW5ncycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3NldHRpbmdzJyk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBVcGRhdGluZyBjdXJlbnQgcGFsZXR0ZSBJRCB0byAke25ld0lEfWApO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6ICdhcHBTZXR0aW5ncycsIGxhc3RQYWxldHRlSUQ6IG5ld0lEIH0pO1xuXHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBDdXJyZW50IHBhbGV0dGUgSUQgdXBkYXRlZCB0byAke25ld0lEfWApO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQoKTogRXJyb3IgdXBkYXRpbmcgY3VycmVudCBwYWxldHRlIElEJyk7XG5cdH1cbn1cbiJdfQ==