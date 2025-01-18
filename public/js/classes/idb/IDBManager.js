// File: src/classes/idb/IDBManager.js
import { config } from '../../config/index.js';
import { dbFn } from '../../db/index.js';
import { log } from '../logger/index.js';
import { MutationTracker } from '../mutations/index.js';
import { utils } from '../../common/index.js';
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
        this.defaultKeys = config.db.DEFAULT_KEYS;
        this.defaultSettings = config.db.DEFAULT_SETTINGS;
        this.storeNames = config.db.STORE_NAMES;
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
                        log.info(`Mutation detected: ${JSON.stringify(mutationLog)}`);
                    self.mutationTracker
                        .persistMutation(mutationLog)
                        .catch(err => {
                        if (self.logMode.errors)
                            log.error(`Failed to persist mutation: ${err.message}`);
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
                    log.warning(`Entry with key ${key} not found.`);
                }
                return;
            }
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            await store.delete(key);
            if (!this.mode.quiet) {
                log.info(`Entry with key ${key} deleted successfully.`);
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
                log.info(`Entries deleted successfully. Keys: ${validKeys}`);
            }
        }, 'IDBManager.deleteEntries(): Error deleting entries');
    }
    async getCurrentPaletteID() {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                log.info(`Fetched settings from IndexedDB: ${settings}`);
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
                    log.warning(`Object store "${storeName}" not found in IndexedDB.`);
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
                    log.info(`IndexedDB has been reset to default settins.`);
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
                        log.info(`Database "${dbName}" deleted successfully.`);
                };
                deleteRequest.onerror = event => {
                    console.error(`Error deleting database "${dbName}":`, event);
                };
                deleteRequest.onblocked = () => {
                    if (this.logMode.warnings)
                        log.warning(`Delete operation blocked. Ensure no open connections to "${dbName}".`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    log.warning(`Database "${dbName}" does not exist.`);
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
                log.info(`Palette ID has successfully been reset to 0`);
        }, 'IDBManager.resetPaletteID(): Error resetting palette ID');
    }
    async saveData(storeName, key, data, oldValue) {
        return this.errorUtils.handleAsync(async () => {
            const db = await this.getDB();
            await this.storeUtils.withStore(db, storeName, 'readwrite', async (store) => {
                await store.put({ key, ...data });
                log.mutation({
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
                log.info(`Palette ${id} saved successfully.`);
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
                log.info('Settings updated');
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
                    log.error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (!this.mode.quiet && this.logMode.info)
                    log.warning('updateEntryInPalette: Entry not found.');
            }
            const oldEntry = items[entryIndex];
            items[entryIndex] = newEntry;
            await this.saveData('tables', tableID, storedPalette);
            log.mutation({
                timestamp: new Date().toISOString(),
                key: `${tableID}-${entryIndex}]`,
                action: 'update',
                newValue: newEntry,
                oldValue: oldEntry,
                origin: 'updateEntryInPalette'
            }, mutationLog => console.log(`Mutation log trigger for updateEntryInPalette:`, mutationLog));
            if (!this.mode.quiet && this.logMode.info)
                log.info(`Entry ${entryIndex} in palette ${tableID} updated.`);
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
        log.info(`Initializing DB with Store Name: ${storeName}, Key: ${key}`);
        if (!storeName || !key)
            throw new Error('Invalid store name or key.');
        const settings = await db.get(storeName, key);
        if (!settings) {
            if (!this.mode.quiet) {
                log.info(`Initializing default settings...`);
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
                    log.warning(`Table with ID ${id} not found.`);
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
                log.info(`Updating curent palette ID to ${newID}`);
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                log.info(`Current palette ID updated to ${newID}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jbGFzc2VzL2lkYi9JREJNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUFzQztBQXFCdEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU5QyxNQUFNLE9BQU8sVUFBVTtJQUNkLE1BQU0sQ0FBQyxRQUFRLEdBQXNCLElBQUksQ0FBQztJQUUxQyxJQUFJLEdBQXdCLElBQUksQ0FBQztJQUVqQyxTQUFTLENBQXVDO0lBRWhELElBQUksQ0FBZ0I7SUFDcEIsSUFBSSxDQUFXO0lBQ2YsT0FBTyxDQUFzQjtJQUU3QixLQUFLLEdBR1IsRUFBRSxDQUFDO0lBRUEsV0FBVyxDQUF1QjtJQUNsQyxlQUFlLENBQTJCO0lBQzFDLFVBQVUsQ0FBc0I7SUFFaEMsVUFBVSxDQUFvQztJQUM5QyxVQUFVLENBQXNCO0lBRWhDLGVBQWUsQ0FBa0I7SUFFekMsWUFBb0IsSUFBbUI7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxN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Q0FBQztZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQyxFQUFFLDZDQUE2QyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVPLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFhO1FBQ2pELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDN0MsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDbkQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV6QyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUVwRCxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzlELE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztZQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQyxFQUFFLHdFQUF3RSxDQUFDLENBQUM7SUFDOUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jbGFzc2VzL2lkYi9JREJNYW5hZ2VyLmpzXG5cbmltcG9ydCB7IElEQlBEYXRhYmFzZSwgSURCUE9iamVjdFN0b3JlIH0gZnJvbSAnaWRiJztcbmltcG9ydCB7XG5cdENvbW1vblV0aWxzRm5FcnJvcnMsXG5cdERhdGFJbnRlcmZhY2UsXG5cdERlZmF1bHRLZXlzSW50ZXJmYWNlLFxuXHREQk1hc3RlckZuSW50ZXJmYWNlLFxuXHRIU0wsXG5cdElEQk1hbmFnZXJJbnRlcmZhY2UsXG5cdE1vZGVEYXRhLFxuXHRNdXRhdGlvbkxvZyxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZURCLFxuXHRQYWxldHRlSXRlbSxcblx0UGFsZXR0ZVNjaGVtYSxcblx0U2V0dGluZ3MsXG5cdFN0b3JlTmFtZXNJbnRlcmZhY2UsXG5cdFN0b3JlZFBhbGV0dGUsXG5cdERlZmF1bHRTZXR0aW5nc0ludGVyZmFjZVxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuaW1wb3J0IHsgZGJGbiB9IGZyb20gJy4uLy4uL2RiL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBNdXRhdGlvblRyYWNrZXIgfSBmcm9tICcuLi9tdXRhdGlvbnMvaW5kZXguanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuLi8uLi9jb21tb24vaW5kZXguanMnO1xuXG5leHBvcnQgY2xhc3MgSURCTWFuYWdlciBpbXBsZW1lbnRzIElEQk1hbmFnZXJJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSURCTWFuYWdlciB8IG51bGwgPSBudWxsO1xuXG5cdHByaXZhdGUgZGJGbjogREJNYXN0ZXJGbkludGVyZmFjZSA9IGRiRm47XG5cblx0cHJpdmF0ZSBkYlByb21pc2U6IFByb21pc2U8SURCUERhdGFiYXNlPFBhbGV0dGVTY2hlbWE+PjtcblxuXHRwcml2YXRlIGRhdGE6IERhdGFJbnRlcmZhY2U7XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGE7XG5cdHByaXZhdGUgbG9nTW9kZTogTW9kZURhdGFbJ2xvZ2dpbmcnXTtcblxuXHRwcml2YXRlIGNhY2hlOiBQYXJ0aWFsPHtcblx0XHRzZXR0aW5nczogU2V0dGluZ3M7XG5cdFx0Y3VzdG9tQ29sb3I6IEhTTDtcblx0fT4gPSB7fTtcblxuXHRwcml2YXRlIGRlZmF1bHRLZXlzOiBEZWZhdWx0S2V5c0ludGVyZmFjZTtcblx0cHJpdmF0ZSBkZWZhdWx0U2V0dGluZ3M6IERlZmF1bHRTZXR0aW5nc0ludGVyZmFjZTtcblx0cHJpdmF0ZSBzdG9yZU5hbWVzOiBTdG9yZU5hbWVzSW50ZXJmYWNlO1xuXG5cdHByaXZhdGUgc3RvcmVVdGlsczogREJNYXN0ZXJGbkludGVyZmFjZVsnc3RvcmVVdGlscyddO1xuXHRwcml2YXRlIGVycm9yVXRpbHM6IENvbW1vblV0aWxzRm5FcnJvcnM7XG5cblx0cHJpdmF0ZSBtdXRhdGlvblRyYWNrZXI6IE11dGF0aW9uVHJhY2tlcjtcblxuXHRwcml2YXRlIGNvbnN0cnVjdG9yKGRhdGE6IERhdGFJbnRlcmZhY2UpIHtcblx0XHR0aGlzLmRiUHJvbWlzZSA9IHRoaXMuZGJGbi5pbml0aWFsaXplREIoKTtcblxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0dGhpcy5tb2RlID0gdGhpcy5kYXRhLm1vZGU7XG5cdFx0dGhpcy5sb2dNb2RlID0gdGhpcy5kYXRhLm1vZGUubG9nZ2luZztcblxuXHRcdHRoaXMuZGVmYXVsdEtleXMgPSBjb25maWcuZGIuREVGQVVMVF9LRVlTO1xuXHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzID0gY29uZmlnLmRiLkRFRkFVTFRfU0VUVElOR1M7XG5cdFx0dGhpcy5zdG9yZU5hbWVzID0gY29uZmlnLmRiLlNUT1JFX05BTUVTO1xuXG5cdFx0dGhpcy5zdG9yZVV0aWxzID0gdGhpcy5kYkZuLnN0b3JlVXRpbHM7XG5cdFx0dGhpcy5lcnJvclV0aWxzID0gdXRpbHMuZXJyb3JzO1xuXG5cdFx0dGhpcy5tdXRhdGlvblRyYWNrZXIgPSBNdXRhdGlvblRyYWNrZXIuZ2V0SW5zdGFuY2UoZGF0YSk7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogKiAqIFNUQVRJQyBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgY3JlYXRlSW5zdGFuY2UoXG5cdFx0ZGF0YTogRGF0YUludGVyZmFjZVxuXHQpOiBQcm9taXNlPElEQk1hbmFnZXI+IHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgSURCTWFuYWdlcihkYXRhKTtcblx0XHRcdGF3YWl0IHRoaXMuaW5zdGFuY2UuaW5pdGlhbGl6ZURCKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2U7XG5cdH1cblxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoKTogSURCTWFuYWdlciB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdJREJNYW5hZ2VyIGluc3RhbmNlIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZC4gQ2FsbCBjcmVhdGVJbnN0YW5jZSBmaXJzdC4nXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcmVzZXRJbnN0YW5jZSgpOiB2b2lkIHtcblx0XHR0aGlzLmluc3RhbmNlID0gbnVsbDtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogKiBQVUJMSUMgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwdWJsaWMgY3JlYXRlTXV0YXRpb25Mb2dnZXI8VCBleHRlbmRzIG9iamVjdD4ob2JqOiBULCBrZXk6IHN0cmluZyk6IFQge1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm94eShvYmosIHtcblx0XHRcdHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuXHRcdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtwcm9wZXJ0eSBhcyBrZXlvZiBUXTtcblx0XHRcdFx0Y29uc3Qgc3VjY2VzcyA9IFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKTtcblxuXHRcdFx0XHRpZiAoc3VjY2Vzcykge1xuXHRcdFx0XHRcdGNvbnN0IG11dGF0aW9uTG9nOiBNdXRhdGlvbkxvZyA9IHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlOiB7IFtwcm9wZXJ0eV06IHZhbHVlIH0sXG5cdFx0XHRcdFx0XHRvbGRWYWx1ZTogeyBbcHJvcGVydHldOiBvbGRWYWx1ZSB9LFxuXHRcdFx0XHRcdFx0b3JpZ2luOiAnUHJveHknXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGlmIChzZWxmLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdFx0XHRgTXV0YXRpb24gZGV0ZWN0ZWQ6ICR7SlNPTi5zdHJpbmdpZnkobXV0YXRpb25Mb2cpfWBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRzZWxmLm11dGF0aW9uVHJhY2tlclxuXHRcdFx0XHRcdFx0LnBlcnNpc3RNdXRhdGlvbihtdXRhdGlvbkxvZylcblx0XHRcdFx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2VsZi5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdFx0XHRgRmFpbGVkIHRvIHBlcnNpc3QgbXV0YXRpb246ICR7ZXJyLm1lc3NhZ2V9YFxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBzdWNjZXNzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdHR5cGU6IHN0cmluZyxcblx0XHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0XHRiYXNlQ29sb3I6IEhTTCxcblx0XHRudW1Cb3hlczogbnVtYmVyLFxuXHRcdGVuYWJsZUFscGhhOiBib29sZWFuLFxuXHRcdGxpbWl0RGFyazogYm9vbGVhbixcblx0XHRsaW1pdEdyYXk6IGJvb2xlYW4sXG5cdFx0bGltaXRMaWdodDogYm9vbGVhblxuXHQpOiBQYWxldHRlIHtcblx0XHRyZXR1cm4gdXRpbHMucGFsZXR0ZS5jcmVhdGVPYmplY3QoXG5cdFx0XHR0eXBlLFxuXHRcdFx0aXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHREYXRlLm5vdygpLFxuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheSxcblx0XHRcdGxpbWl0TGlnaHRcblx0XHQpO1xuXHR9XG5cblx0Ly8gKkRFVi1OT1RFKiBhZGQgdGhpcyBtZXRob2QgdG8gZG9jc1xuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cnkoXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghKGF3YWl0IHRoaXMuZW5zdXJlRW50cnlFeGlzdHMoc3RvcmVOYW1lLCBrZXkpKSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm5pbmdzKSB7XG5cdFx0XHRcdFx0bG9nLndhcm5pbmcoYEVudHJ5IHdpdGgga2V5ICR7a2V5fSBub3QgZm91bmQuYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJylcblx0XHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRcdGF3YWl0IHN0b3JlLmRlbGV0ZShrZXkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2cuaW5mbyhgRW50cnkgd2l0aCBrZXkgJHtrZXl9IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5LmApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZURhdGEoKTogRXJyb3IgZGVsZXRpbmcgZW50cnknKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBkZWxldGVFbnRyaWVzKFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXlzOiBzdHJpbmdbXVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHRcdFx0Y29uc3QgdmFsaWRLZXlzID0gKFxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRrZXlzLm1hcChhc3luYyBrZXkgPT5cblx0XHRcdFx0XHRcdChhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKHN0b3JlTmFtZSwga2V5KSlcblx0XHRcdFx0XHRcdFx0PyBrZXlcblx0XHRcdFx0XHRcdFx0OiBudWxsXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpLmZpbHRlcigoa2V5KToga2V5IGlzIHN0cmluZyA9PiBrZXkgIT09IG51bGwpO1xuXG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbCh2YWxpZEtleXMubWFwKGtleSA9PiBzdG9yZS5kZWxldGUoa2V5KSkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2cuaW5mbyhgRW50cmllcyBkZWxldGVkIHN1Y2Nlc3NmdWxseS4gS2V5czogJHt2YWxpZEtleXN9YCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRW50cmllcygpOiBFcnJvciBkZWxldGluZyBlbnRyaWVzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlcj4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChcblx0XHRcdFx0dGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddLFxuXHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAodGhpcy5tb2RlLmRlYnVnKVxuXHRcdFx0XHRsb2cuaW5mbyhgRmV0Y2hlZCBzZXR0aW5ncyBmcm9tIEluZGV4ZWREQjogJHtzZXR0aW5nc31gKTtcblxuXHRcdFx0cmV0dXJuIHNldHRpbmdzPy5sYXN0UGFsZXR0ZUlEID8/IDA7XG5cdFx0fSwgJ0lEQk1hbmFnZXI6IGdldEN1cnJlbnRQYWxldHRlSUQoKTogRXJyb3IgZmV0Y2hpbmcgY3VycmVudCBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q2FjaGVkU2V0dGluZ3MoKTogUHJvbWlzZTxTZXR0aW5ncz4ge1xuXHRcdGlmICh0aGlzLmNhY2hlLnNldHRpbmdzKSByZXR1cm4gdGhpcy5jYWNoZS5zZXR0aW5ncztcblxuXHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5nZXRTZXR0aW5ncygpO1xuXG5cdFx0aWYgKHNldHRpbmdzKSB0aGlzLmNhY2hlLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cblx0XHRyZXR1cm4gc2V0dGluZ3M7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VzdG9tQ29sb3IoKTogUHJvbWlzZTxIU0wgfCBudWxsPiB7XG5cdFx0Y29uc3Qga2V5ID0gdGhpcy5kZWZhdWx0S2V5c1snQ1VTVE9NX0NPTE9SJ107XG5cdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5zdG9yZU5hbWVzWydDVVNUT01fQ09MT1InXTtcblxuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBlbnRyeSA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRcdGlmICghZW50cnk/LmNvbG9yKSByZXR1cm4gbnVsbDtcblxuXHRcdFx0dGhpcy5jYWNoZS5jdXN0b21Db2xvciA9IGVudHJ5LmNvbG9yO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVNdXRhdGlvbkxvZ2dlcihlbnRyeS5jb2xvciwgc3RvcmVOYW1lKTtcblx0XHR9LCAnSURCTWFuYWdlci5nZXRDdXN0b21Db2xvcigpOiBFcnJvciBmZXRjaGluZyBjdXN0b20gY29sb3InKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXREQigpOiBQcm9taXNlPFBhbGV0dGVEQj4ge1xuXHRcdHJldHVybiB0aGlzLmRiUHJvbWlzZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRMb2dnZWRPYmplY3Q8VCBleHRlbmRzIG9iamVjdD4oXG5cdFx0b2JqOiBUIHwgbnVsbCxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBUIHwgbnVsbCB7XG5cdFx0aWYgKG9iaikge1xuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIob2JqLCBrZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRUYWJsZUlEKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmdldFNldHRpbmdzKCk7XG5cdFx0XHRjb25zdCBsYXN0VGFibGVJRCA9IHNldHRpbmdzLmxhc3RUYWJsZUlEID8/IDA7XG5cdFx0XHRjb25zdCBuZXh0SUQgPSBsYXN0VGFibGVJRCArIDE7XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3NldHRpbmdzJywgJ2FwcFNldHRpbmdzJywge1xuXHRcdFx0XHQuLi5zZXR0aW5ncyxcblx0XHRcdFx0bGFzdFRhYmxlSUQ6IG5leHRJRFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBgcGFsZXR0ZV8ke25leHRJRH1gO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldE5leHRUYWJsZUlEKCk6IEVycm9yIGZldGNoaW5nIG5leHQgdGFibGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0UGFsZXR0ZUlEKCk6IFByb21pc2U8bnVtYmVyIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudElEID0gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUlEKCk7XG5cdFx0XHRjb25zdCBuZXdJRCA9IGN1cnJlbnRJRCArIDE7XG5cblx0XHRcdGF3YWl0IHRoaXMudXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRCk7XG5cblx0XHRcdHJldHVybiBuZXdJRDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXROZXh0UGFsZXR0ZUlEKCk6IEVycm9yIGZldGNoaW5nIG5leHQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoXG5cdFx0XHRcdHRoaXMuc3RvcmVOYW1lc1snU0VUVElOR1MnXSxcblx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHNldHRpbmdzID8/IHRoaXMuZGVmYXVsdFNldHRpbmdzO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldFNldHRpbmdzKCk6IEVycm9yIGZldGNoaW5nIHNldHRpbmdzJyk7XG5cdH1cblxuXHQvLyAqKkRFVi1OT1RFKiogRklHVVJFIE9VVCBIT1cgVE8gSU1QTEVNRU5UIGhhbmRsZUFzeW5jIEhFUkVcblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkb25seSdcblx0KTogUHJvbWlzZTxcblx0XHRJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgJ3JlYWRvbmx5Jz5cblx0PjtcblxuXHRwdWJsaWMgYXN5bmMgZ2V0U3RvcmU8U3RvcmVOYW1lIGV4dGVuZHMga2V5b2YgUGFsZXR0ZVNjaGVtYT4oXG5cdFx0c3RvcmVOYW1lOiBTdG9yZU5hbWUsXG5cdFx0bW9kZTogJ3JlYWR3cml0ZSdcblx0KTogUHJvbWlzZTxcblx0XHRJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgJ3JlYWR3cml0ZSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkb25seScgfCAncmVhZHdyaXRlJ1xuXHQpIHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblxuXHRcdHJldHVybiBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsIG1vZGUpLm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVzZXREYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IGF2YWlsYWJsZVN0b3JlcyA9IEFycmF5LmZyb20oZGIub2JqZWN0U3RvcmVOYW1lcyk7XG5cdFx0XHRjb25zdCBleHBlY3RlZFN0b3JlcyA9IE9iamVjdC52YWx1ZXModGhpcy5zdG9yZU5hbWVzKTtcblxuXHRcdFx0Zm9yIChjb25zdCBzdG9yZU5hbWUgb2YgZXhwZWN0ZWRTdG9yZXMpIHtcblx0XHRcdFx0aWYgKCFhdmFpbGFibGVTdG9yZXMuaW5jbHVkZXMoc3RvcmVOYW1lKSkge1xuXHRcdFx0XHRcdGxvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFx0YE9iamVjdCBzdG9yZSBcIiR7c3RvcmVOYW1lfVwiIG5vdCBmb3VuZCBpbiBJbmRleGVkREIuYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRcdFx0YXdhaXQgc3RvcmUuY2xlYXIoKTtcblx0XHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0XHRjb25zdCBzZXR0aW5nc1N0b3JlID0gZGJcblx0XHRcdFx0XHQudHJhbnNhY3Rpb24odGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddLCAncmVhZHdyaXRlJylcblx0XHRcdFx0XHQub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddKTtcblx0XHRcdFx0YXdhaXQgc2V0dGluZ3NTdG9yZS5wdXQoXG5cdFx0XHRcdFx0dGhpcy5kZWZhdWx0U2V0dGluZ3MsXG5cdFx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGxvZy5pbmZvKGBJbmRleGVkREIgaGFzIGJlZW4gcmVzZXQgdG8gZGVmYXVsdCBzZXR0aW5zLmApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0RGF0YWJhc2UoKTogRXJyb3IgcmVzZXR0aW5nIGRhdGFiYXNlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiTmFtZSA9ICdwYWxldHRlREInO1xuXHRcdFx0Y29uc3QgZGJFeGlzdHMgPSBhd2FpdCBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG5cblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0cmVxdWVzdC5yZXN1bHQuY2xvc2UoKTtcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKGZhbHNlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoZGJFeGlzdHMpIHtcblx0XHRcdFx0Y29uc3QgZGVsZXRlUmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShkYk5hbWUpO1xuXG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdFx0bG9nLmluZm8oYERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZGVsZXRlZCBzdWNjZXNzZnVsbHkuYCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlIFwiJHtkYk5hbWV9XCI6YCxcblx0XHRcdFx0XHRcdGV2ZW50XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuaW5ncylcblx0XHRcdFx0XHRcdGxvZy53YXJuaW5nKFxuXHRcdFx0XHRcdFx0XHRgRGVsZXRlIG9wZXJhdGlvbiBibG9ja2VkLiBFbnN1cmUgbm8gb3BlbiBjb25uZWN0aW9ucyB0byBcIiR7ZGJOYW1lfVwiLmBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlLnNob3dBbGVydHMpXG5cdFx0XHRcdFx0XHRhbGVydChcblx0XHRcdFx0XHRcdFx0YFVuYWJsZSB0byBkZWxldGUgZGF0YWJhc2UgXCIke2RiTmFtZX1cIiBiZWNhdXNlIGl0IGlzIGluIHVzZS4gUGxlYXNlIGNsb3NlIGFsbCBvdGhlciB0YWJzIG9yIHdpbmRvd3MgYWNjZXNzaW5nIHRoaXMgZGF0YWJhc2UgYW5kIHRyeSBhZ2Fpbi5gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS5zdGFja1RyYWNlKVxuXHRcdFx0XHRcdFx0Y29uc29sZS50cmFjZShgQmxvY2tlZCBjYWxsIHN0YWNrOmApO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0bG9nLndhcm5pbmcoYERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZG9lcyBub3QgZXhpc3QuYCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRGF0YWJhc2UoKTogRXJyb3IgZGVsZXRpbmcgZGF0YWJhc2UnKTtcblx0fVxuXG5cdC8vICpERVYtTk9URSogYWRkIHRoaXMgbWV0aG9kIHRvIGRvY3Ncblx0cHVibGljIGFzeW5jIHJlc2V0UGFsZXR0ZUlEKCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvclV0aWxzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddO1xuXHRcdFx0Y29uc3Qga2V5ID0gdGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KHN0b3JlTmFtZSwga2V5KTtcblxuXHRcdFx0aWYgKCFzZXR0aW5ncylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTZXR0aW5ncyBub3QgZm91bmQuIENhbm5vdCByZXNldCBwYWxldHRlIElELicpO1xuXG5cdFx0XHRzZXR0aW5ncy5sYXN0UGFsZXR0ZUlEID0gMDtcblxuXHRcdFx0YXdhaXQgZGIucHV0KHN0b3JlTmFtZSwgeyBrZXksIC4uLnRoaXMuZGVmYXVsdFNldHRpbmdzIH0pO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nLmluZm8oYFBhbGV0dGUgSUQgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIHJlc2V0IHRvIDBgKTtcblx0XHR9LCAnSURCTWFuYWdlci5yZXNldFBhbGV0dGVJRCgpOiBFcnJvciByZXNldHRpbmcgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVEYXRhPFQ+KFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXk6IHN0cmluZyxcblx0XHRkYXRhOiBULFxuXHRcdG9sZFZhbHVlPzogVFxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zdG9yZVV0aWxzLndpdGhTdG9yZShcblx0XHRcdFx0ZGIsXG5cdFx0XHRcdHN0b3JlTmFtZSxcblx0XHRcdFx0J3JlYWR3cml0ZScsXG5cdFx0XHRcdGFzeW5jIHN0b3JlID0+IHtcblx0XHRcdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXksIC4uLmRhdGEgfSk7XG5cblx0XHRcdFx0XHRsb2cubXV0YXRpb24oXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0XHRcdG5ld1ZhbHVlOiBkYXRhLFxuXHRcdFx0XHRcdFx0XHRvbGRWYWx1ZTogb2xkVmFsdWUgfHwgbnVsbCxcblx0XHRcdFx0XHRcdFx0b3JpZ2luOiAnc2F2ZURhdGEnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0bXV0YXRpb25Mb2cgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRcdFx0XHQnTXV0YXRpb24gbG9nIHRyaWdnZXJlZCBmb3Igc2F2ZURhdGE6Jyxcblx0XHRcdFx0XHRcdFx0XHRtdXRhdGlvbkxvZyxcblx0XHRcdFx0XHRcdFx0XHQnSURCTWFuYWdlci5zYXZlRGF0YSgpJ1xuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZURhdGEoKTogRXJyb3Igc2F2aW5nIGRhdGEnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZShcblx0XHRpZDogc3RyaW5nLFxuXHRcdG5ld1BhbGV0dGU6IFN0b3JlZFBhbGV0dGVcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBhd2FpdCB0aGlzLmdldFN0b3JlKCd0YWJsZXMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRjb25zdCBwYWxldHRlVG9TYXZlOiBTdG9yZWRQYWxldHRlID0ge1xuXHRcdFx0XHR0YWJsZUlEOiBuZXdQYWxldHRlLnRhYmxlSUQsXG5cdFx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGUucGFsZXR0ZVxuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5OiBpZCwgLi4ucGFsZXR0ZVRvU2F2ZSB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIGxvZy5pbmZvKGBQYWxldHRlICR7aWR9IHNhdmVkIHN1Y2Nlc3NmdWxseS5gKTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZSgpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlVG9EQihcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0YmFzZUNvbG9yOiBIU0wsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3UGFsZXR0ZSA9IHRoaXMuY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0aXRlbXMsXG5cdFx0XHRcdGJhc2VDb2xvcixcblx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0XHRsaW1pdERhcmssXG5cdFx0XHRcdGxpbWl0R3JheSxcblx0XHRcdFx0bGltaXRMaWdodFxuXHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgaWRQYXJ0cyA9IG5ld1BhbGV0dGUuaWQuc3BsaXQoJ18nKTtcblxuXHRcdFx0aWYgKGlkUGFydHMubGVuZ3RoICE9PSAyIHx8IGlzTmFOKE51bWJlcihpZFBhcnRzWzFdKSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhbGV0dGUgSUQgZm9ybWF0OiAke25ld1BhbGV0dGUuaWR9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZVBhbGV0dGUobmV3UGFsZXR0ZS5pZCwge1xuXHRcdFx0XHR0YWJsZUlEOiBwYXJzZUludChpZFBhcnRzWzFdLCAxMCksXG5cdFx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGVcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3UGFsZXR0ZTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZVRvREIoKTogRXJyb3Igc2F2aW5nIHBhbGV0dGUgdG8gREInKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlU2V0dGluZ3MobmV3U2V0dGluZ3M6IFNldHRpbmdzKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCBuZXdTZXR0aW5ncyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRsb2cuaW5mbygnU2V0dGluZ3MgdXBkYXRlZCcpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVTZXR0aW5ncygpOiBFcnJvciBzYXZpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyB1cGRhdGVFbnRyeUluUGFsZXR0ZShcblx0XHR0YWJsZUlEOiBzdHJpbmcsXG5cdFx0ZW50cnlJbmRleDogbnVtYmVyLFxuXHRcdG5ld0VudHJ5OiBQYWxldHRlSXRlbVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRpZiAoIShhd2FpdCB0aGlzLmVuc3VyZUVudHJ5RXhpc3RzKCd0YWJsZXMnLCB0YWJsZUlEKSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzdG9yZWRQYWxldHRlID0gYXdhaXQgdGhpcy5nZXRUYWJsZSh0YWJsZUlEKTtcblxuXHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlEfSBub3QgZm91bmQuYCk7XG5cblx0XHRcdGNvbnN0IHsgaXRlbXMgfSA9IHN0b3JlZFBhbGV0dGUucGFsZXR0ZTtcblxuXHRcdFx0aWYgKGVudHJ5SW5kZXggPj0gaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0ICYmIHRoaXMubG9nTW9kZS5pbmZvKVxuXHRcdFx0XHRcdGxvZy53YXJuaW5nKCd1cGRhdGVFbnRyeUluUGFsZXR0ZTogRW50cnkgbm90IGZvdW5kLicpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRFbnRyeSA9IGl0ZW1zW2VudHJ5SW5kZXhdO1xuXG5cdFx0XHRpdGVtc1tlbnRyeUluZGV4XSA9IG5ld0VudHJ5O1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCd0YWJsZXMnLCB0YWJsZUlELCBzdG9yZWRQYWxldHRlKTtcblxuXHRcdFx0bG9nLm11dGF0aW9uKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0a2V5OiBgJHt0YWJsZUlEfS0ke2VudHJ5SW5kZXh9XWAsXG5cdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRuZXdWYWx1ZTogbmV3RW50cnksXG5cdFx0XHRcdFx0b2xkVmFsdWU6IG9sZEVudHJ5LFxuXHRcdFx0XHRcdG9yaWdpbjogJ3VwZGF0ZUVudHJ5SW5QYWxldHRlJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtdXRhdGlvbkxvZyA9PlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0YE11dGF0aW9uIGxvZyB0cmlnZ2VyIGZvciB1cGRhdGVFbnRyeUluUGFsZXR0ZTpgLFxuXHRcdFx0XHRcdFx0bXV0YXRpb25Mb2dcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCAmJiB0aGlzLmxvZ01vZGUuaW5mbylcblx0XHRcdFx0bG9nLmluZm8oYEVudHJ5ICR7ZW50cnlJbmRleH0gaW4gcGFsZXR0ZSAke3RhYmxlSUR9IHVwZGF0ZWQuYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIudXBkYXRlRW50cnlJblBhbGV0dGUoKTogRXJyb3IgdXBkYXRpbmcgZW50cnkgaW4gcGFsZXR0ZScpO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8vICogKiAqICogICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8vICogKiAqICogKiAqIFBSSVZBVEUgTUVUSE9EUyAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZURCKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMuZGJQcm9taXNlO1xuXG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5zdG9yZU5hbWVzWydTRVRUSU5HUyddO1xuXHRcdGNvbnN0IGtleSA9IHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJyk7XG5cblx0XHRsb2cuaW5mbyhgSW5pdGlhbGl6aW5nIERCIHdpdGggU3RvcmUgTmFtZTogJHtzdG9yZU5hbWV9LCBLZXk6ICR7a2V5fWApO1xuXG5cdFx0aWYgKCFzdG9yZU5hbWUgfHwgIWtleSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0b3JlIG5hbWUgb3Iga2V5LicpO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0aWYgKCFzZXR0aW5ncykge1xuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nLmluZm8oYEluaXRpYWxpemluZyBkZWZhdWx0IHNldHRpbmdzLi4uYCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGRiLnB1dChzdG9yZU5hbWUsIHsga2V5LCAuLi50aGlzLmRlZmF1bHRTZXR0aW5ncyB9KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGVuc3VyZUVudHJ5RXhpc3RzKFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCBzdG9yZSA9IGRiXG5cdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZG9ubHknKVxuXHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRyZXR1cm4gKGF3YWl0IHN0b3JlLmdldChrZXkpKSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0S2V5KGtleToga2V5b2YgU3RvcmVOYW1lc0ludGVyZmFjZSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgZGVmYXVsdEtleSA9IHRoaXMuZGVmYXVsdEtleXNba2V5IGFzIGtleW9mIERlZmF1bHRLZXlzSW50ZXJmYWNlXTtcblxuXHRcdGlmICghZGVmYXVsdEtleSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBbZ2V0RGVmYXVsdEtleSgpXTogSW52YWxpZCBkZWZhdWx0IGtleTogJHtrZXl9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRLZXk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGdldFRhYmxlKGlkOiBzdHJpbmcpOiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLmdldCh0aGlzLnN0b3JlTmFtZXMuVEFCTEVTLCBpZCk7XG5cblx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRcdFx0bG9nLndhcm5pbmcoYFRhYmxlIHdpdGggSUQgJHtpZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXRUYWJsZSgpOiBFcnJvciBmZXRjaGluZyB0YWJsZScpO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyB1cGRhdGVDdXJyZW50UGFsZXR0ZUlEKG5ld0lEOiBudW1iZXIpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3NldHRpbmdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnc2V0dGluZ3MnKTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0bG9nLmluZm8oYFVwZGF0aW5nIGN1cmVudCBwYWxldHRlIElEIHRvICR7bmV3SUR9YCk7XG5cblx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleTogJ2FwcFNldHRpbmdzJywgbGFzdFBhbGV0dGVJRDogbmV3SUQgfSk7XG5cdFx0XHRhd2FpdCB0eC5kb25lO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nLmluZm8oYEN1cnJlbnQgcGFsZXR0ZSBJRCB1cGRhdGVkIHRvICR7bmV3SUR9YCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIudXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpOiBFcnJvciB1cGRhdGluZyBjdXJyZW50IHBhbGV0dGUgSUQnKTtcblx0fVxufVxuIl19