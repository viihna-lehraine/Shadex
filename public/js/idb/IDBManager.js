// File: src/idb/IDBManager.js
import { openDB } from 'idb';
import { data } from '../data/index.js';
import { utils } from '../common/index.js';
export class IDBManager {
    static instance = null;
    cache = {};
    dbPromise;
    defaultKeys;
    defaultSettings;
    mode;
    storeNames;
    constructor() {
        this.dbPromise = openDB('paletteDB', 1, {
            upgrade: db => {
                const storeNames = Object.values(this.storeNames);
                for (const storeName of storeNames) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'key' });
                    }
                }
            }
        });
        this.defaultSettings = data.defaults.idb.settings;
        this.mode = data.mode;
        this.defaultKeys = data.idb.DEFAULT_KEYS;
        this.storeNames = data.idb.STORE_NAMES;
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * STATIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    static async createInstance() {
        if (!this.instance) {
            this.instance = new IDBManager();
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
        const logMutation = this.logMutation.bind(this);
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                const success = Reflect.set(target, property, value);
                if (success) {
                    logMutation({
                        timestamp: new Date().toISOString(),
                        key,
                        action: 'update',
                        newValue: { [property]: value },
                        oldValue: { [property]: oldValue },
                        origin: 'Proxy'
                    });
                }
                return success;
            }
        });
    }
    createPaletteTable(palette) {
        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        table.classList.add('palette-table');
        palette.palette.items.forEach((item, index) => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            const colorBox = document.createElement('div');
            cell.textContent = `Color ${index + 1}`;
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = item.cssStrings.hexCSSString;
            row.appendChild(colorBox);
            row.appendChild(cell);
            table.appendChild(row);
        });
        fragment.appendChild(table);
        return fragment;
    }
    createPaletteObject(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return utils.palette.createObject(type, items, baseColor, Date.now(), numBoxes, enableAlpha, limitDark, limitGray, limitLight);
    }
    // *DEV-NOTE* add this method to docs
    async deleteEntry(storeName, key) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            // ensure entry exists before attempting to delete
            const entryExists = await store.get(key);
            if (!entryExists) {
                if (this.mode.warnLogs)
                    this.log(`Entry with key ${key} not found.`, 'warn');
                return;
            }
            await store.delete(key);
            if (!this.mode.quiet)
                this.log(`Entry with key ${key} deleted successfully.`);
        }, 'IDBManager.deleteData(): Error deleting data');
    }
    async deleteEntries(storeName, keys) {
        return this.handleAsync(async () => {
            const keyList = [];
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            // ensure entries exists before attempting to delete
            for (const key of keys) {
                const entryExists = await store.get(key);
                if (!entryExists) {
                    if (this.mode.warnLogs)
                        this.log(`Entry with key ${key} not found.`, 'warn');
                    return;
                }
                else {
                    keyList.push(key);
                    await store.delete(key);
                }
            }
            if (!this.mode.quiet)
                this.log(`Entries deleted successfully. Keys: ${keyList}`);
        }, 'IDBManager.deleteData(): Error deleting data');
    }
    async getCurrentPaletteID() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                console.log(`Fetched settings from IndexedDB\n${settings}`);
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
        const key = this.resolveKey('CUSTOM_COLOR');
        const storeName = this.resolveStoreName('CUSTOM_COLOR');
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const entry = await db.get(storeName, key);
            if (!entry?.color)
                return null;
            this.cache.customColor = entry.color;
            return this.createMutationLogger(entry.color, storeName);
        }, 'IDBManager.getCustomColor(): Error fetching custom color');
    }
    getLoggedObject(obj, key) {
        if (obj) {
            return this.createMutationLogger(obj, key);
        }
        return null;
    }
    async getNextTableID() {
        return this.handleAsync(async () => {
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
        return this.handleAsync(async () => {
            const currentID = await this.getCurrentPaletteID();
            const newID = currentID + 1;
            if (this.mode.stackTrace)
                console.trace(`IDBManager method getNextPalleteID was called\n.Palette ID before save: ${currentID}`);
            await this.updateCurrentPaletteID(newID);
            return newID;
        }, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
    }
    async getSettings() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
            return settings ?? this.defaultSettings;
        }, 'IDBManager.getSettings(): Error fetching settings');
    }
    async getStore(storeName, mode) {
        const db = await this.getDB();
        return db.transaction(storeName, mode).objectStore(storeName);
    }
    async renderPalette(tableId) {
        return this.handleAsync(async () => {
            const storedPalette = await this.getTable(tableId);
            const paletteRow = document.getElementById('palette-row');
            if (!storedPalette)
                throw new Error(`Palette ${tableId} not found.`);
            if (!paletteRow)
                throw new Error('Palette row element not found.');
            paletteRow.innerHTML = '';
            const tableElement = this.createPaletteTable(storedPalette);
            paletteRow.appendChild(tableElement);
            if (!this.mode.quiet)
                console.log(`Rendered palette ${tableId}.`);
        }, 'IDBManager.renderPalette(): Error rendering palette');
    }
    async resetDatabase() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const availableStores = Array.from(db.objectStoreNames);
            const expectedStores = Object.values(this.storeNames);
            for (const storeName of expectedStores) {
                if (!availableStores.includes(storeName)) {
                    console.warn(`Object store "${storeName}" not found in IndexedDB.`);
                    continue;
                }
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear();
                await tx.done;
                const settingsStore = db
                    .transaction(this.getStoreName('SETTINGS'), 'readwrite')
                    .objectStore(this.getStoreName('SETTINGS'));
                await settingsStore.put(this.defaultSettings, this.getDefaultKey('APP_SETTINGS'));
                if (!this.mode.quiet)
                    console.log(`IndexedDB has been reset to default settins.`);
            }
        }, 'IDBManager.resetDatabase(): Error resetting database');
    }
    async deleteDatabase() {
        await this.handleAsync(async () => {
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
                        console.log(`Database "${dbName}" deleted successfully.`);
                };
                deleteRequest.onerror = event => {
                    console.error(`Error deleting database "${dbName}":`, event);
                };
                deleteRequest.onblocked = () => {
                    if (this.mode.warnLogs)
                        console.warn(`Delete operation blocked. Ensure no open connections to "${dbName}".`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    console.log(`Database "${dbName}" does not exist.`);
            }
        }, 'IDBManager.deleteDatabase(): Error deleting database');
    }
    // *DEV-NOTE* add this method to docs
    async resetPaletteID() {
        return this.handleAsync(async () => {
            const currentPaletteID = await this.getCurrentPaletteID();
            if (!this.mode.quiet) {
                console.log(`Resetting palette ID. Current palette ID: ${currentPaletteID}`);
            }
            const db = await this.getDB();
            const storeName = this.getStoreName('SETTINGS');
            const key = this.getDefaultKey('APP_SETTINGS');
            const settings = await db.get(storeName, key);
            if (!settings) {
                throw new Error('Settings not found. Cannot reset palette ID.');
            }
            settings.lastPaletteID = 0;
            await db.put(storeName, { key, ...this.defaultSettings });
            if (!this.mode.quiet) {
                const newPaletteID = await this.getCurrentPaletteID();
                console.log(`Palette ID has successfully been reset. New palette ID: ${newPaletteID}`);
            }
        }, 'IDBManager.resetPaletteID(): Error resetting palette ID');
    }
    async saveData(storeName, key, data, oldValue) {
        return this.handleAsync(async () => {
            await this.withStore(storeName, 'readwrite', async (store) => {
                await store.put({ key, ...data });
                await this.logMutation({
                    timestamp: new Date().toISOString(),
                    key,
                    action: 'update',
                    newValue: data,
                    oldValue: oldValue || null,
                    origin: 'saveData'
                });
            });
        }, 'IDBManager.saveData(): Error saving data');
    }
    async savePalette(id, newPalette) {
        return this.handleAsync(async () => {
            const store = await this.getStore('tables', 'readwrite');
            const paletteToSave = {
                tableID: newPalette.tableID,
                palette: newPalette.palette
            };
            await store.put({ key: id, ...paletteToSave });
            if (!this.mode.quiet)
                this.log(`Palette ${id} saved successfully.`);
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteToDB(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return this.handleAsync(async () => {
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
        return this.handleAsync(async () => {
            await this.saveData('settings', 'appSettings', newSettings);
            if (!this.mode.quiet)
                console.log('Settings updated');
        }, 'IDBManager.saveSettings(): Error saving settings');
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        return this.handleAsync(async () => {
            const storedPalette = await this.getTable(tableID);
            if (!storedPalette)
                throw new Error(`Palette ${tableID} not found.`);
            const { items } = storedPalette.palette;
            if (entryIndex >= items.length) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (this.mode.errorLogs)
                    this.log(`Entry ${entryIndex} not found in palette ${tableID}.`, 'error');
                if (!this.mode.quiet)
                    this.log('updateEntryInPalette: Entry not found.');
            }
            const oldEntry = items[entryIndex];
            items[entryIndex] = newEntry;
            await this.saveData('tables', tableID, storedPalette);
            await this.logMutation({
                timestamp: new Date().toISOString(),
                key: `${tableID}-${entryIndex}]`,
                action: 'update',
                newValue: newEntry,
                oldValue: oldEntry,
                origin: 'updateEntryInPalette'
            });
            if (!this.mode.quiet)
                this.log(`Entry ${entryIndex} in palette ${tableID} updated.`);
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
        const storeName = this.getStoreName('SETTINGS');
        const key = this.getDefaultKey('APP_SETTINGS');
        console.log(`Initializing DB with Store Name: ${storeName}, Key: ${key}`);
        if (!storeName || !key)
            throw new Error('Invalid store name or key.');
        const settings = await db.get(storeName, key);
        if (!settings) {
            if (!this.mode.quiet) {
                console.log(`Initializing default settings...`);
                if (this.mode.debug)
                    console.log('Data to insert into database initialization:', {
                        key,
                        ...this.defaultSettings
                    });
            }
            await db.put(storeName, { key, ...this.defaultSettings });
        }
    }
    debugError(context, error) {
        if (this.mode.errorLogs) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.log(`Error in ${context}: ${errorMsg}`, 'error');
        }
    }
    formatLogMessage(action, details) {
        return `[${new Date().toISOString()}] Action: ${action}, Details: ${JSON.stringify(details)}`;
    }
    async getDB() {
        return this.dbPromise;
    }
    getDefaultKey(key) {
        const defaultKey = this.defaultKeys[key];
        if (!defaultKey) {
            throw new Error(`[getDefaultKey()]: Invalid default key: ${key}`);
        }
        return defaultKey;
    }
    getStoreName(storeKey) {
        const storeName = this.storeNames[storeKey];
        if (!storeName) {
            throw new Error(`[getStoreName()]: Invalid store key: ${storeKey}`);
        }
        return storeName;
    }
    async getTable(id) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const result = await db.get(this.storeNames.TABLES, id);
            if (!result) {
                if (this.mode.warnLogs)
                    this.log(`Table with ID ${id} not found.`, 'warn');
            }
            return result;
        }, 'IDBManager.getTable(): Error fetching table');
    }
    async handleAsync(action, errorMessage, context) {
        try {
            return await action();
        }
        catch (error) {
            if (this.mode.errorLogs) {
                const details = context ? JSON.stringify(context) : '';
                this.debugError(`Error: ${errorMessage}\nDetails: ${details}\n${error}`, 'error');
            }
            throw error;
        }
    }
    // *DEV-NOTE* refactor to use this method instead of generic console logging throughout the class
    log(message, level = 'info') {
        if ((level === 'info' && this.mode.quiet) || !this.mode[`${level}Logs`])
            return;
        const formattedMessage = this.formatLogMessage(level.toUpperCase(), {
            message
        });
        console[level](formattedMessage);
    }
    async logMutation(log) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            await db.put('mutations', log);
            if (!this.mode.quiet)
                this.log(`Logged mutation: ${JSON.stringify(log)}`);
        }, 'IDBManager.logMutation(): Error logging mutation');
    }
    resolveKey(key) {
        return this.defaultKeys[key];
    }
    resolveStoreName(store) {
        return this.storeNames[store];
    }
    async updateCurrentPaletteID(newID) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            if (this.mode.debug)
                console.log(`Updating curent palette ID to ${newID}`);
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                this.log(`Current palette ID updated to ${newID}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
    async withStore(storeName, mode, callback) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        if (!store) {
            throw new Error(`Store "${storeName}" not found`);
        }
        await callback(store);
        await tx.done;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pZGIvSURCTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFpQyxNQUFNLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFhNUQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxNQUFNLE9BQU8sVUFBVTtJQUNkLE1BQU0sQ0FBQyxRQUFRLEdBQXNCLElBQUksQ0FBQztJQUMxQyxLQUFLLEdBR1IsRUFBRSxDQUFDO0lBQ0EsU0FBUyxDQUF1QztJQUNoRCxXQUFXLENBQUM7SUFDWixlQUFlLENBQVc7SUFDMUIsSUFBSSxDQUFXO0lBQ2YsVUFBVSxDQUFDO0lBRW5CO1FBQ0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQWdCLFdBQVcsRUFBRSxDQUFDLEVBQUU7WUFDdEQsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNiLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUVsRCxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRSxDQUFDO29CQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO3dCQUM5QyxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3JELENBQUM7Z0JBQ0YsQ0FBQztZQUNGLENBQUM7U0FDRCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxJQUFJLENBQUMsSUFBSSxH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LEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXpDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRXZELE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDOUQsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBRWQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDLEVBQUUsd0VBQXdFLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU8sS0FBSyxDQUFDLFNBQVMsQ0FJdEIsU0FBb0IsRUFDcEIsSUFBVSxFQUNWLFFBRWtCO1FBRWxCLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLFNBQVMsYUFBYSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztJQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvaWRiL0lEQk1hbmFnZXIuanNcblxuaW1wb3J0IHsgSURCUERhdGFiYXNlLCBJREJQT2JqZWN0U3RvcmUsIG9wZW5EQiB9IGZyb20gJ2lkYic7XG5pbXBvcnQge1xuXHRIU0wsXG5cdElEQk1hbmFnZXJJbnRlcmZhY2UsXG5cdE1vZGVEYXRhLFxuXHRNdXRhdGlvbkxvZyxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZURCLFxuXHRQYWxldHRlSXRlbSxcblx0UGFsZXR0ZVNjaGVtYSxcblx0U2V0dGluZ3MsXG5cdFN0b3JlZFBhbGV0dGVcbn0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuLi9jb21tb24vaW5kZXguanMnO1xuXG5leHBvcnQgY2xhc3MgSURCTWFuYWdlciBpbXBsZW1lbnRzIElEQk1hbmFnZXJJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSURCTWFuYWdlciB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIGNhY2hlOiBQYXJ0aWFsPHtcblx0XHRzZXR0aW5nczogU2V0dGluZ3M7XG5cdFx0Y3VzdG9tQ29sb3I6IEhTTDtcblx0fT4gPSB7fTtcblx0cHJpdmF0ZSBkYlByb21pc2U6IFByb21pc2U8SURCUERhdGFiYXNlPFBhbGV0dGVTY2hlbWE+Pjtcblx0cHJpdmF0ZSBkZWZhdWx0S2V5cztcblx0cHJpdmF0ZSBkZWZhdWx0U2V0dGluZ3M6IFNldHRpbmdzO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhO1xuXHRwcml2YXRlIHN0b3JlTmFtZXM7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmRiUHJvbWlzZSA9IG9wZW5EQjxQYWxldHRlU2NoZW1hPigncGFsZXR0ZURCJywgMSwge1xuXHRcdFx0dXBncmFkZTogZGIgPT4ge1xuXHRcdFx0XHRjb25zdCBzdG9yZU5hbWVzID0gT2JqZWN0LnZhbHVlcyh0aGlzLnN0b3JlTmFtZXMpO1xuXG5cdFx0XHRcdGZvciAoY29uc3Qgc3RvcmVOYW1lIG9mIHN0b3JlTmFtZXMpIHtcblx0XHRcdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoc3RvcmVOYW1lKSkge1xuXHRcdFx0XHRcdFx0ZGIuY3JlYXRlT2JqZWN0U3RvcmUoc3RvcmVOYW1lLCB7IGtleVBhdGg6ICdrZXknIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzID0gZGF0YS5kZWZhdWx0cy5pZGIuc2V0dGluZ3M7XG5cdFx0dGhpcy5tb2RlID0gZGF0YS5tb2RlO1xuXHRcdHRoaXMuZGVmYXVsdEtleXMgPSBkYXRhLmlkYi5ERUZBVUxUX0tFWVM7XG5cdFx0dGhpcy5zdG9yZU5hbWVzID0gZGF0YS5pZGIuU1RPUkVfTkFNRVM7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogKiAqIFNUQVRJQyBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgY3JlYXRlSW5zdGFuY2UoKTogUHJvbWlzZTxJREJNYW5hZ2VyPiB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gbmV3IElEQk1hbmFnZXIoKTtcblx0XHRcdGF3YWl0IHRoaXMuaW5zdGFuY2UuaW5pdGlhbGl6ZURCKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2U7XG5cdH1cblxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UoKTogSURCTWFuYWdlciB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdJREJNYW5hZ2VyIGluc3RhbmNlIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZC4gQ2FsbCBjcmVhdGVJbnN0YW5jZSBmaXJzdC4nXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgcmVzZXRJbnN0YW5jZSgpOiB2b2lkIHtcblx0XHR0aGlzLmluc3RhbmNlID0gbnVsbDtcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogKiBQVUJMSUMgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy9cblx0Ly9cblxuXHRwdWJsaWMgY3JlYXRlTXV0YXRpb25Mb2dnZXI8VCBleHRlbmRzIG9iamVjdD4ob2JqOiBULCBrZXk6IHN0cmluZyk6IFQge1xuXHRcdGNvbnN0IGxvZ011dGF0aW9uID0gdGhpcy5sb2dNdXRhdGlvbi5iaW5kKHRoaXMpO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm94eShvYmosIHtcblx0XHRcdHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuXHRcdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtwcm9wZXJ0eSBhcyBrZXlvZiBUXTtcblx0XHRcdFx0Y29uc3Qgc3VjY2VzcyA9IFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKTtcblxuXHRcdFx0XHRpZiAoc3VjY2Vzcykge1xuXHRcdFx0XHRcdGxvZ011dGF0aW9uKHtcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlOiB7IFtwcm9wZXJ0eV06IHZhbHVlIH0sXG5cdFx0XHRcdFx0XHRvbGRWYWx1ZTogeyBbcHJvcGVydHldOiBvbGRWYWx1ZSB9LFxuXHRcdFx0XHRcdFx0b3JpZ2luOiAnUHJveHknXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gc3VjY2Vzcztcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlUGFsZXR0ZVRhYmxlKHBhbGV0dGU6IFN0b3JlZFBhbGV0dGUpOiBIVE1MRWxlbWVudCB7XG5cdFx0Y29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0Y29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuXHRcdHRhYmxlLmNsYXNzTGlzdC5hZGQoJ3BhbGV0dGUtdGFibGUnKTtcblxuXHRcdHBhbGV0dGUucGFsZXR0ZS5pdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRcdFx0Y2VsbC50ZXh0Q29udGVudCA9IGBDb2xvciAke2luZGV4ICsgMX1gO1xuXHRcdFx0Y29sb3JCb3guY2xhc3NMaXN0LmFkZCgnY29sb3ItYm94Jyk7XG5cdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpdGVtLmNzc1N0cmluZ3MuaGV4Q1NTU3RyaW5nO1xuXG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY29sb3JCb3gpO1xuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdFx0dGFibGUuYXBwZW5kQ2hpbGQocm93KTtcblx0XHR9KTtcblxuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKHRhYmxlKTtcblxuXHRcdHJldHVybiBmcmFnbWVudCBhcyB1bmtub3duIGFzIEhUTUxFbGVtZW50O1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdHR5cGU6IHN0cmluZyxcblx0XHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0XHRiYXNlQ29sb3I6IEhTTCxcblx0XHRudW1Cb3hlczogbnVtYmVyLFxuXHRcdGVuYWJsZUFscGhhOiBib29sZWFuLFxuXHRcdGxpbWl0RGFyazogYm9vbGVhbixcblx0XHRsaW1pdEdyYXk6IGJvb2xlYW4sXG5cdFx0bGltaXRMaWdodDogYm9vbGVhblxuXHQpOiBQYWxldHRlIHtcblx0XHRyZXR1cm4gdXRpbHMucGFsZXR0ZS5jcmVhdGVPYmplY3QoXG5cdFx0XHR0eXBlLFxuXHRcdFx0aXRlbXMsXG5cdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHREYXRlLm5vdygpLFxuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheSxcblx0XHRcdGxpbWl0TGlnaHRcblx0XHQpO1xuXHR9XG5cblx0Ly8gKkRFVi1OT1RFKiBhZGQgdGhpcyBtZXRob2QgdG8gZG9jc1xuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cnkoXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gZGJcblx0XHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHQvLyBlbnN1cmUgZW50cnkgZXhpc3RzIGJlZm9yZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZVxuXHRcdFx0Y29uc3QgZW50cnlFeGlzdHMgPSBhd2FpdCBzdG9yZS5nZXQoa2V5KTtcblxuXHRcdFx0aWYgKCFlbnRyeUV4aXN0cykge1xuXHRcdFx0XHRpZiAodGhpcy5tb2RlLndhcm5Mb2dzKVxuXHRcdFx0XHRcdHRoaXMubG9nKGBFbnRyeSB3aXRoIGtleSAke2tleX0gbm90IGZvdW5kLmAsICd3YXJuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdHRoaXMubG9nKGBFbnRyeSB3aXRoIGtleSAke2tleX0gZGVsZXRlZCBzdWNjZXNzZnVsbHkuYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRGF0YSgpOiBFcnJvciBkZWxldGluZyBkYXRhJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRW50cmllcyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5czogc3RyaW5nW11cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGtleUxpc3QgPSBbXTtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJylcblx0XHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRcdC8vIGVuc3VyZSBlbnRyaWVzIGV4aXN0cyBiZWZvcmUgYXR0ZW1wdGluZyB0byBkZWxldGVcblx0XHRcdGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcblx0XHRcdFx0Y29uc3QgZW50cnlFeGlzdHMgPSBhd2FpdCBzdG9yZS5nZXQoa2V5KTtcblxuXHRcdFx0XHRpZiAoIWVudHJ5RXhpc3RzKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS53YXJuTG9ncylcblx0XHRcdFx0XHRcdHRoaXMubG9nKGBFbnRyeSB3aXRoIGtleSAke2tleX0gbm90IGZvdW5kLmAsICd3YXJuJyk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5TGlzdC5wdXNoKGtleSk7XG5cdFx0XHRcdFx0YXdhaXQgc3RvcmUuZGVsZXRlKGtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdHRoaXMubG9nKGBFbnRyaWVzIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5LiBLZXlzOiAke2tleUxpc3R9YCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRGF0YSgpOiBFcnJvciBkZWxldGluZyBkYXRhJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlcj4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoXG5cdFx0XHRcdHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpLFxuXHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAodGhpcy5tb2RlLmRlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhgRmV0Y2hlZCBzZXR0aW5ncyBmcm9tIEluZGV4ZWREQlxcbiR7c2V0dGluZ3N9YCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncz8ubGFzdFBhbGV0dGVJRCA/PyAwO1xuXHRcdH0sICdJREJNYW5hZ2VyOiBnZXRDdXJyZW50UGFsZXR0ZUlEKCk6IEVycm9yIGZldGNoaW5nIGN1cnJlbnQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldENhY2hlZFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRpZiAodGhpcy5jYWNoZS5zZXR0aW5ncykgcmV0dXJuIHRoaXMuY2FjaGUuc2V0dGluZ3M7XG5cblx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblx0XHRpZiAoc2V0dGluZ3MpIHRoaXMuY2FjaGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0XHRyZXR1cm4gc2V0dGluZ3M7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VzdG9tQ29sb3IoKTogUHJvbWlzZTxIU0wgfCBudWxsPiB7XG5cdFx0Y29uc3Qga2V5ID0gdGhpcy5yZXNvbHZlS2V5KCdDVVNUT01fQ09MT1InKTtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnJlc29sdmVTdG9yZU5hbWUoJ0NVU1RPTV9DT0xPUicpO1xuXG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBlbnRyeSA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRcdGlmICghZW50cnk/LmNvbG9yKSByZXR1cm4gbnVsbDtcblxuXHRcdFx0dGhpcy5jYWNoZS5jdXN0b21Db2xvciA9IGVudHJ5LmNvbG9yO1xuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIoZW50cnkuY29sb3IsIHN0b3JlTmFtZSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0Q3VzdG9tQ29sb3IoKTogRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIGNvbG9yJyk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TG9nZ2VkT2JqZWN0PFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCB8IG51bGwsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogVCB8IG51bGwge1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU11dGF0aW9uTG9nZ2VyKG9iaiwga2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0VGFibGVJRCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblx0XHRcdGNvbnN0IGxhc3RUYWJsZUlEID0gc2V0dGluZ3MubGFzdFRhYmxlSUQgPz8gMDtcblx0XHRcdGNvbnN0IG5leHRJRCA9IGxhc3RUYWJsZUlEICsgMTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCB7XG5cdFx0XHRcdC4uLnNldHRpbmdzLFxuXHRcdFx0XHRsYXN0VGFibGVJRDogbmV4dElEXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGBwYWxldHRlXyR7bmV4dElEfWA7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFRhYmxlSUQoKTogRXJyb3IgZmV0Y2hpbmcgbmV4dCB0YWJsZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRQYWxldHRlSUQoKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudElEID0gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUlEKCk7XG5cdFx0XHRjb25zdCBuZXdJRCA9IGN1cnJlbnRJRCArIDE7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuc3RhY2tUcmFjZSlcblx0XHRcdFx0Y29uc29sZS50cmFjZShcblx0XHRcdFx0XHRgSURCTWFuYWdlciBtZXRob2QgZ2V0TmV4dFBhbGxldGVJRCB3YXMgY2FsbGVkXFxuLlBhbGV0dGUgSUQgYmVmb3JlIHNhdmU6ICR7Y3VycmVudElEfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0YXdhaXQgdGhpcy51cGRhdGVDdXJyZW50UGFsZXR0ZUlEKG5ld0lEKTtcblxuXHRcdFx0cmV0dXJuIG5ld0lEO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldE5leHRQYWxldHRlSUQoKTogRXJyb3IgZmV0Y2hpbmcgbmV4dCBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0U2V0dGluZ3MoKTogUHJvbWlzZTxTZXR0aW5ncz4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoXG5cdFx0XHRcdHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpLFxuXHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gc2V0dGluZ3MgPz8gdGhpcy5kZWZhdWx0U2V0dGluZ3M7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0U2V0dGluZ3MoKTogRXJyb3IgZmV0Y2hpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdC8vICoqREVWLU5PVEUqKiBGSUdVUkUgT1VUIEhPVyBUTyBJTVBMRU1FTlQgaGFuZGxlQXN5bmMgSEVSRVxuXHRwdWJsaWMgYXN5bmMgZ2V0U3RvcmU8U3RvcmVOYW1lIGV4dGVuZHMga2V5b2YgUGFsZXR0ZVNjaGVtYT4oXG5cdFx0c3RvcmVOYW1lOiBTdG9yZU5hbWUsXG5cdFx0bW9kZTogJ3JlYWRvbmx5J1xuXHQpOiBQcm9taXNlPFxuXHRcdElEQlBPYmplY3RTdG9yZTxQYWxldHRlU2NoZW1hLCBbU3RvcmVOYW1lXSwgU3RvcmVOYW1lLCAncmVhZG9ubHknPlxuXHQ+O1xuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZHdyaXRlJ1xuXHQpOiBQcm9taXNlPFxuXHRcdElEQlBPYmplY3RTdG9yZTxQYWxldHRlU2NoZW1hLCBbU3RvcmVOYW1lXSwgU3RvcmVOYW1lLCAncmVhZHdyaXRlJz5cblx0PjtcblxuXHRwdWJsaWMgYXN5bmMgZ2V0U3RvcmU8U3RvcmVOYW1lIGV4dGVuZHMga2V5b2YgUGFsZXR0ZVNjaGVtYT4oXG5cdFx0c3RvcmVOYW1lOiBTdG9yZU5hbWUsXG5cdFx0bW9kZTogJ3JlYWRvbmx5JyB8ICdyZWFkd3JpdGUnXG5cdCkge1xuXHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXG5cdFx0cmV0dXJuIGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgbW9kZSkub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZW5kZXJQYWxldHRlKHRhYmxlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZWRQYWxldHRlID0gYXdhaXQgdGhpcy5nZXRUYWJsZSh0YWJsZUlkKTtcblx0XHRcdGNvbnN0IHBhbGV0dGVSb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFsZXR0ZS1yb3cnKTtcblxuXHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlkfSBub3QgZm91bmQuYCk7XG5cdFx0XHRpZiAoIXBhbGV0dGVSb3cpIHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSByb3cgZWxlbWVudCBub3QgZm91bmQuJyk7XG5cblx0XHRcdHBhbGV0dGVSb3cuaW5uZXJIVE1MID0gJyc7XG5cblx0XHRcdGNvbnN0IHRhYmxlRWxlbWVudCA9IHRoaXMuY3JlYXRlUGFsZXR0ZVRhYmxlKHN0b3JlZFBhbGV0dGUpO1xuXHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZCh0YWJsZUVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkgY29uc29sZS5sb2coYFJlbmRlcmVkIHBhbGV0dGUgJHt0YWJsZUlkfS5gKTtcblx0XHR9LCAnSURCTWFuYWdlci5yZW5kZXJQYWxldHRlKCk6IEVycm9yIHJlbmRlcmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVzZXREYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBhdmFpbGFibGVTdG9yZXMgPSBBcnJheS5mcm9tKGRiLm9iamVjdFN0b3JlTmFtZXMpO1xuXHRcdFx0Y29uc3QgZXhwZWN0ZWRTdG9yZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuc3RvcmVOYW1lcyk7XG5cblx0XHRcdGZvciAoY29uc3Qgc3RvcmVOYW1lIG9mIGV4cGVjdGVkU3RvcmVzKSB7XG5cdFx0XHRcdGlmICghYXZhaWxhYmxlU3RvcmVzLmluY2x1ZGVzKHN0b3JlTmFtZSkpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XHRgT2JqZWN0IHN0b3JlIFwiJHtzdG9yZU5hbWV9XCIgbm90IGZvdW5kIGluIEluZGV4ZWREQi5gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblxuXHRcdFx0XHRhd2FpdCBzdG9yZS5jbGVhcigpO1xuXHRcdFx0XHRhd2FpdCB0eC5kb25lO1xuXG5cdFx0XHRcdGNvbnN0IHNldHRpbmdzU3RvcmUgPSBkYlxuXHRcdFx0XHRcdC50cmFuc2FjdGlvbih0aGlzLmdldFN0b3JlTmFtZSgnU0VUVElOR1MnKSwgJ3JlYWR3cml0ZScpXG5cdFx0XHRcdFx0Lm9iamVjdFN0b3JlKHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpKTtcblx0XHRcdFx0YXdhaXQgc2V0dGluZ3NTdG9yZS5wdXQoXG5cdFx0XHRcdFx0dGhpcy5kZWZhdWx0U2V0dGluZ3MsXG5cdFx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBJbmRleGVkREIgaGFzIGJlZW4gcmVzZXQgdG8gZGVmYXVsdCBzZXR0aW5zLmApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0RGF0YWJhc2UoKTogRXJyb3IgcmVzZXR0aW5nIGRhdGFiYXNlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZGVsZXRlRGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYk5hbWUgPSAncGFsZXR0ZURCJztcblx0XHRcdGNvbnN0IGRiRXhpc3RzID0gYXdhaXQgbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihkYk5hbWUpO1xuXG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdHJlcXVlc3QucmVzdWx0LmNsb3NlKCk7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGRiRXhpc3RzKSB7XG5cdFx0XHRcdGNvbnN0IGRlbGV0ZVJlcXVlc3QgPSBpbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoZGJOYW1lKTtcblxuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFx0XHRgRGF0YWJhc2UgXCIke2RiTmFtZX1cIiBkZWxldGVkIHN1Y2Nlc3NmdWxseS5gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRkZWxldGVSZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdGBFcnJvciBkZWxldGluZyBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiOmAsXG5cdFx0XHRcdFx0XHRldmVudFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25ibG9ja2VkID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUud2FybkxvZ3MpXG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XHRcdGBEZWxldGUgb3BlcmF0aW9uIGJsb2NrZWQuIEVuc3VyZSBubyBvcGVuIGNvbm5lY3Rpb25zIHRvIFwiJHtkYk5hbWV9XCIuYFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLm1vZGUuc2hvd0FsZXJ0cylcblx0XHRcdFx0XHRcdGFsZXJ0KFxuXHRcdFx0XHRcdFx0XHRgVW5hYmxlIHRvIGRlbGV0ZSBkYXRhYmFzZSBcIiR7ZGJOYW1lfVwiIGJlY2F1c2UgaXQgaXMgaW4gdXNlLiBQbGVhc2UgY2xvc2UgYWxsIG90aGVyIHRhYnMgb3Igd2luZG93cyBhY2Nlc3NpbmcgdGhpcyBkYXRhYmFzZSBhbmQgdHJ5IGFnYWluLmBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlLnN0YWNrVHJhY2UpXG5cdFx0XHRcdFx0XHRjb25zb2xlLnRyYWNlKGBCbG9ja2VkIGNhbGwgc3RhY2s6YCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgRGF0YWJhc2UgXCIke2RiTmFtZX1cIiBkb2VzIG5vdCBleGlzdC5gKTtcblx0XHRcdH1cblx0XHR9LCAnSURCTWFuYWdlci5kZWxldGVEYXRhYmFzZSgpOiBFcnJvciBkZWxldGluZyBkYXRhYmFzZScpO1xuXHR9XG5cblx0Ly8gKkRFVi1OT1RFKiBhZGQgdGhpcyBtZXRob2QgdG8gZG9jc1xuXHRwdWJsaWMgYXN5bmMgcmVzZXRQYWxldHRlSUQoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWxldHRlSUQgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlSUQoKTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdFx0YFJlc2V0dGluZyBwYWxldHRlIElELiBDdXJyZW50IHBhbGV0dGUgSUQ6ICR7Y3VycmVudFBhbGV0dGVJRH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5nZXRTdG9yZU5hbWUoJ1NFVFRJTkdTJyk7XG5cdFx0XHRjb25zdCBrZXkgPSB0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpO1xuXHRcdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0XHRpZiAoIXNldHRpbmdzKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignU2V0dGluZ3Mgbm90IGZvdW5kLiBDYW5ub3QgcmVzZXQgcGFsZXR0ZSBJRC4nKTtcblx0XHRcdH1cblxuXHRcdFx0c2V0dGluZ3MubGFzdFBhbGV0dGVJRCA9IDA7XG5cblx0XHRcdGF3YWl0IGRiLnB1dChzdG9yZU5hbWUsIHsga2V5LCAuLi50aGlzLmRlZmF1bHRTZXR0aW5ncyB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0Y29uc3QgbmV3UGFsZXR0ZUlEID0gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUlEKCk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdFx0YFBhbGV0dGUgSUQgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIHJlc2V0LiBOZXcgcGFsZXR0ZSBJRDogJHtuZXdQYWxldHRlSUR9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLnJlc2V0UGFsZXR0ZUlEKCk6IEVycm9yIHJlc2V0dGluZyBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZURhdGE8VD4oXG5cdFx0c3RvcmVOYW1lOiBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdGtleTogc3RyaW5nLFxuXHRcdGRhdGE6IFQsXG5cdFx0b2xkVmFsdWU/OiBUXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRhd2FpdCB0aGlzLndpdGhTdG9yZShzdG9yZU5hbWUsICdyZWFkd3JpdGUnLCBhc3luYyBzdG9yZSA9PiB7XG5cdFx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleSwgLi4uZGF0YSB9KTtcblx0XHRcdFx0YXdhaXQgdGhpcy5sb2dNdXRhdGlvbih7XG5cdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0bmV3VmFsdWU6IGRhdGEsXG5cdFx0XHRcdFx0b2xkVmFsdWU6IG9sZFZhbHVlIHx8IG51bGwsXG5cdFx0XHRcdFx0b3JpZ2luOiAnc2F2ZURhdGEnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZURhdGEoKTogRXJyb3Igc2F2aW5nIGRhdGEnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZShcblx0XHRpZDogc3RyaW5nLFxuXHRcdG5ld1BhbGV0dGU6IFN0b3JlZFBhbGV0dGVcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHN0b3JlID0gYXdhaXQgdGhpcy5nZXRTdG9yZSgndGFibGVzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVRvU2F2ZTogU3RvcmVkUGFsZXR0ZSA9IHtcblx0XHRcdFx0dGFibGVJRDogbmV3UGFsZXR0ZS50YWJsZUlELFxuXHRcdFx0XHRwYWxldHRlOiBuZXdQYWxldHRlLnBhbGV0dGVcblx0XHRcdH07XG5cblx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleTogaWQsIC4uLnBhbGV0dGVUb1NhdmUgfSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KSB0aGlzLmxvZyhgUGFsZXR0ZSAke2lkfSBzYXZlZCBzdWNjZXNzZnVsbHkuYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuc2F2ZVBhbGV0dGUoKTogRXJyb3Igc2F2aW5nIHBhbGV0dGUnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlUGFsZXR0ZVRvREIoXG5cdFx0dHlwZTogc3RyaW5nLFxuXHRcdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRcdGJhc2VDb2xvcjogSFNMLFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0ZW5hYmxlQWxwaGE6IGJvb2xlYW4sXG5cdFx0bGltaXREYXJrOiBib29sZWFuLFxuXHRcdGxpbWl0R3JheTogYm9vbGVhbixcblx0XHRsaW1pdExpZ2h0OiBib29sZWFuXG5cdCk6IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdQYWxldHRlID0gdGhpcy5jcmVhdGVQYWxldHRlT2JqZWN0KFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRpdGVtcyxcblx0XHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0XHRudW1Cb3hlcyxcblx0XHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRcdGxpbWl0RGFyayxcblx0XHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0XHRsaW1pdExpZ2h0XG5cdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBpZFBhcnRzID0gbmV3UGFsZXR0ZS5pZC5zcGxpdCgnXycpO1xuXG5cdFx0XHRpZiAoaWRQYXJ0cy5sZW5ndGggIT09IDIgfHwgaXNOYU4oTnVtYmVyKGlkUGFydHNbMV0pKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFsZXR0ZSBJRCBmb3JtYXQ6ICR7bmV3UGFsZXR0ZS5pZH1gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlUGFsZXR0ZShuZXdQYWxldHRlLmlkLCB7XG5cdFx0XHRcdHRhYmxlSUQ6IHBhcnNlSW50KGlkUGFydHNbMV0sIDEwKSxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXdQYWxldHRlO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVQYWxldHRlVG9EQigpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZSB0byBEQicpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVTZXR0aW5ncyhuZXdTZXR0aW5nczogU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCBuZXdTZXR0aW5ncyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnU2V0dGluZ3MgdXBkYXRlZCcpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVTZXR0aW5ncygpOiBFcnJvciBzYXZpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyB1cGRhdGVFbnRyeUluUGFsZXR0ZShcblx0XHR0YWJsZUlEOiBzdHJpbmcsXG5cdFx0ZW50cnlJbmRleDogbnVtYmVyLFxuXHRcdG5ld0VudHJ5OiBQYWxldHRlSXRlbVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0VGFibGUodGFibGVJRCk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXG5cdFx0XHRjb25zdCB7IGl0ZW1zIH0gPSBzdG9yZWRQYWxldHRlLnBhbGV0dGU7XG5cblx0XHRcdGlmIChlbnRyeUluZGV4ID49IGl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgRW50cnkgJHtlbnRyeUluZGV4fSBub3QgZm91bmQgaW4gcGFsZXR0ZSAke3RhYmxlSUR9LmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGhpcy5tb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYCxcblx0XHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHR0aGlzLmxvZygndXBkYXRlRW50cnlJblBhbGV0dGU6IEVudHJ5IG5vdCBmb3VuZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkRW50cnkgPSBpdGVtc1tlbnRyeUluZGV4XTtcblx0XHRcdGl0ZW1zW2VudHJ5SW5kZXhdID0gbmV3RW50cnk7XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3RhYmxlcycsIHRhYmxlSUQsIHN0b3JlZFBhbGV0dGUpO1xuXHRcdFx0YXdhaXQgdGhpcy5sb2dNdXRhdGlvbih7XG5cdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRrZXk6IGAke3RhYmxlSUR9LSR7ZW50cnlJbmRleH1dYCxcblx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0bmV3VmFsdWU6IG5ld0VudHJ5LFxuXHRcdFx0XHRvbGRWYWx1ZTogb2xkRW50cnksXG5cdFx0XHRcdG9yaWdpbjogJ3VwZGF0ZUVudHJ5SW5QYWxldHRlJ1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHR0aGlzLmxvZyhgRW50cnkgJHtlbnRyeUluZGV4fSBpbiBwYWxldHRlICR7dGFibGVJRH0gdXBkYXRlZC5gKTtcblx0XHR9LCAnSURCTWFuYWdlci51cGRhdGVFbnRyeUluUGFsZXR0ZSgpOiBFcnJvciB1cGRhdGluZyBlbnRyeSBpbiBwYWxldHRlJyk7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLy8gKiAqICogKiAqICogUFJJVkFURSBNRVRIT0RTICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHJpdmF0ZSBhc3luYyBpbml0aWFsaXplREIoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5kYlByb21pc2U7XG5cblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLmdldFN0b3JlTmFtZSgnU0VUVElOR1MnKTtcblx0XHRjb25zdCBrZXkgPSB0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpO1xuXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgSW5pdGlhbGl6aW5nIERCIHdpdGggU3RvcmUgTmFtZTogJHtzdG9yZU5hbWV9LCBLZXk6ICR7a2V5fWBcblx0XHQpO1xuXG5cdFx0aWYgKCFzdG9yZU5hbWUgfHwgIWtleSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0b3JlIG5hbWUgb3Iga2V5LicpO1xuXG5cdFx0Y29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBkYi5nZXQoc3RvcmVOYW1lLCBrZXkpO1xuXG5cdFx0aWYgKCFzZXR0aW5ncykge1xuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coYEluaXRpYWxpemluZyBkZWZhdWx0IHNldHRpbmdzLi4uYCk7XG5cblx0XHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRcdCdEYXRhIHRvIGluc2VydCBpbnRvIGRhdGFiYXNlIGluaXRpYWxpemF0aW9uOicsXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdFx0Li4udGhpcy5kZWZhdWx0U2V0dGluZ3Ncblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBkYi5wdXQoc3RvcmVOYW1lLCB7IGtleSwgLi4udGhpcy5kZWZhdWx0U2V0dGluZ3MgfSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBkZWJ1Z0Vycm9yKGNvbnRleHQ6IHN0cmluZywgZXJyb3I6IHVua25vd24pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5tb2RlLmVycm9yTG9ncykge1xuXHRcdFx0Y29uc3QgZXJyb3JNc2cgPVxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XG5cblx0XHRcdHRoaXMubG9nKGBFcnJvciBpbiAke2NvbnRleHR9OiAke2Vycm9yTXNnfWAsICdlcnJvcicpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZm9ybWF0TG9nTWVzc2FnZShhY3Rpb246IHN0cmluZywgZGV0YWlsczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pIHtcblx0XHRyZXR1cm4gYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dIEFjdGlvbjogJHthY3Rpb259LCBEZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbHMpfWA7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGdldERCKCk6IFByb21pc2U8UGFsZXR0ZURCPiB7XG5cdFx0cmV0dXJuIHRoaXMuZGJQcm9taXNlO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0S2V5KGtleToga2V5b2YgdHlwZW9mIHRoaXMuc3RvcmVOYW1lcyk6IHN0cmluZyB7XG5cdFx0Y29uc3QgZGVmYXVsdEtleSA9IHRoaXMuZGVmYXVsdEtleXNba2V5XTtcblxuXHRcdGlmICghZGVmYXVsdEtleSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBbZ2V0RGVmYXVsdEtleSgpXTogSW52YWxpZCBkZWZhdWx0IGtleTogJHtrZXl9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRLZXk7XG5cdH1cblxuXHRwcml2YXRlIGdldFN0b3JlTmFtZShzdG9yZUtleToga2V5b2YgdHlwZW9mIHRoaXMuc3RvcmVOYW1lcyk6IHN0cmluZyB7XG5cdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5zdG9yZU5hbWVzW3N0b3JlS2V5XTtcblxuXHRcdGlmICghc3RvcmVOYW1lKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFtnZXRTdG9yZU5hbWUoKV06IEludmFsaWQgc3RvcmUga2V5OiAke3N0b3JlS2V5fWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdG9yZU5hbWU7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGdldFRhYmxlKGlkOiBzdHJpbmcpOiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBkYi5nZXQodGhpcy5zdG9yZU5hbWVzLlRBQkxFUywgaWQpO1xuXG5cdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRpZiAodGhpcy5tb2RlLndhcm5Mb2dzKVxuXHRcdFx0XHRcdHRoaXMubG9nKGBUYWJsZSB3aXRoIElEICR7aWR9IG5vdCBmb3VuZC5gLCAnd2FybicpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXRUYWJsZSgpOiBFcnJvciBmZXRjaGluZyB0YWJsZScpO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBoYW5kbGVBc3luYzxUPihcblx0XHRhY3Rpb246ICgpID0+IFByb21pc2U8VD4sXG5cdFx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdFx0Y29udGV4dD86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG5cdCk6IFByb21pc2U8VCB8IG51bGw+IHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IGFjdGlvbigpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5tb2RlLmVycm9yTG9ncykge1xuXHRcdFx0XHRjb25zdCBkZXRhaWxzID0gY29udGV4dCA/IEpTT04uc3RyaW5naWZ5KGNvbnRleHQpIDogJyc7XG5cdFx0XHRcdHRoaXMuZGVidWdFcnJvcihcblx0XHRcdFx0XHRgRXJyb3I6ICR7ZXJyb3JNZXNzYWdlfVxcbkRldGFpbHM6ICR7ZGV0YWlsc31cXG4ke2Vycm9yfWAsXG5cdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIHJlZmFjdG9yIHRvIHVzZSB0aGlzIG1ldGhvZCBpbnN0ZWFkIG9mIGdlbmVyaWMgY29uc29sZSBsb2dnaW5nIHRocm91Z2hvdXQgdGhlIGNsYXNzXG5cdHByaXZhdGUgbG9nKFxuXHRcdG1lc3NhZ2U6IHN0cmluZyxcblx0XHRsZXZlbDogJ2luZm8nIHwgJ3dhcm4nIHwgJ2Vycm9yJyA9ICdpbmZvJ1xuXHQpOiB2b2lkIHtcblx0XHRpZiAoKGxldmVsID09PSAnaW5mbycgJiYgdGhpcy5tb2RlLnF1aWV0KSB8fCAhdGhpcy5tb2RlW2Ake2xldmVsfUxvZ3NgXSlcblx0XHRcdHJldHVybjtcblxuXHRcdGNvbnN0IGZvcm1hdHRlZE1lc3NhZ2UgPSB0aGlzLmZvcm1hdExvZ01lc3NhZ2UobGV2ZWwudG9VcHBlckNhc2UoKSwge1xuXHRcdFx0bWVzc2FnZVxuXHRcdH0pO1xuXG5cdFx0Y29uc29sZVtsZXZlbF0oZm9ybWF0dGVkTWVzc2FnZSk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGxvZ011dGF0aW9uKGxvZzogTXV0YXRpb25Mb2cpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRcdGF3YWl0IGRiLnB1dCgnbXV0YXRpb25zJywgbG9nKTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdHRoaXMubG9nKGBMb2dnZWQgbXV0YXRpb246ICR7SlNPTi5zdHJpbmdpZnkobG9nKX1gKTtcblx0XHR9LCAnSURCTWFuYWdlci5sb2dNdXRhdGlvbigpOiBFcnJvciBsb2dnaW5nIG11dGF0aW9uJyk7XG5cdH1cblxuXHRwcml2YXRlIHJlc29sdmVLZXk8SyBleHRlbmRzIGtleW9mIHR5cGVvZiB0aGlzLmRlZmF1bHRLZXlzPihcblx0XHRrZXk6IEtcblx0KTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0S2V5c1trZXldO1xuXHR9XG5cblx0cHJpdmF0ZSByZXNvbHZlU3RvcmVOYW1lPFMgZXh0ZW5kcyBrZXlvZiB0eXBlb2YgdGhpcy5zdG9yZU5hbWVzPihcblx0XHRzdG9yZTogU1xuXHQpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLnN0b3JlTmFtZXNbc3RvcmVdO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyB1cGRhdGVDdXJyZW50UGFsZXR0ZUlEKG5ld0lEOiBudW1iZXIpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdzZXR0aW5ncycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3NldHRpbmdzJyk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBVcGRhdGluZyBjdXJlbnQgcGFsZXR0ZSBJRCB0byAke25ld0lEfWApO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6ICdhcHBTZXR0aW5ncycsIGxhc3RQYWxldHRlSUQ6IG5ld0lEIH0pO1xuXHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdHRoaXMubG9nKGBDdXJyZW50IHBhbGV0dGUgSUQgdXBkYXRlZCB0byAke25ld0lEfWApO1xuXHRcdH0sICdJREJNYW5hZ2VyLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQoKTogRXJyb3IgdXBkYXRpbmcgY3VycmVudCBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIHdpdGhTdG9yZTxcblx0XHRTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hLFxuXHRcdE1vZGUgZXh0ZW5kcyAncmVhZG9ubHknIHwgJ3JlYWR3cml0ZSdcblx0Pihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiBNb2RlLFxuXHRcdGNhbGxiYWNrOiAoXG5cdFx0XHRzdG9yZTogSURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsIE1vZGU+XG5cdFx0KSA9PiBQcm9taXNlPHZvaWQ+XG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKTtcblx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRpZiAoIXN0b3JlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFN0b3JlIFwiJHtzdG9yZU5hbWV9XCIgbm90IGZvdW5kYCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgY2FsbGJhY2soc3RvcmUpO1xuXHRcdGF3YWl0IHR4LmRvbmU7XG5cdH1cbn1cbiJdfQ==