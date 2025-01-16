// File: src/idb/IDBManager.js
import { openDB } from 'idb';
import { data } from '../data/index.js';
import { log } from '../logger/index.js';
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
            if (!(await this.ensureEntryExists(storeName, key))) {
                if (this.mode.warnLogs) {
                    log.warn(`Entry with key ${key} not found.`);
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
        return this.handleAsync(async () => {
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
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
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
                log.info(`Rendered palette ${tableId}.`);
        }, 'IDBManager.renderPalette(): Error rendering palette');
    }
    async resetDatabase() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const availableStores = Array.from(db.objectStoreNames);
            const expectedStores = Object.values(this.storeNames);
            for (const storeName of expectedStores) {
                if (!availableStores.includes(storeName)) {
                    log.warn(`Object store "${storeName}" not found in IndexedDB.`);
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
                    log.info(`IndexedDB has been reset to default settins.`);
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
                        log.info(`Database "${dbName}" deleted successfully.`);
                };
                deleteRequest.onerror = event => {
                    console.error(`Error deleting database "${dbName}":`, event);
                };
                deleteRequest.onblocked = () => {
                    if (this.mode.warnLogs)
                        log.warn(`Delete operation blocked. Ensure no open connections to "${dbName}".`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    log.warn(`Database "${dbName}" does not exist.`);
            }
        }, 'IDBManager.deleteDatabase(): Error deleting database');
    }
    // *DEV-NOTE* add this method to docs
    async resetPaletteID() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const storeName = this.getStoreName('SETTINGS');
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
                log.info(`Palette ${id} saved successfully.`);
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
                log.info('Settings updated');
        }, 'IDBManager.saveSettings(): Error saving settings');
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        return this.handleAsync(async () => {
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
                if (this.mode.errorLogs)
                    log.error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (!this.mode.quiet)
                    log.warn('updateEntryInPalette: Entry not found.');
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
        const storeName = this.getStoreName('SETTINGS');
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
    debugError(context, error) {
        if (this.mode.errorLogs) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            log.error(`Error in ${context}: ${errorMsg}`);
        }
    }
    async ensureEntryExists(storeName, key) {
        const db = await this.getDB();
        const store = db
            .transaction(storeName, 'readonly')
            .objectStore(storeName);
        return (await store.get(key)) !== undefined;
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
                    log.warn(`Table with ID ${id} not found.`);
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
    async logMutation(data) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            await db.put('mutations', log);
            if (!this.mode.quiet)
                log.info(`Logged mutation: ${JSON.stringify(data)}`);
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
                log.info(`Updating curent palette ID to ${newID}`);
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                log.info(`Current palette ID updated to ${newID}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pZGIvSURCTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFpQyxNQUFNLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFhNUQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFM0MsTUFBTSxPQUFPLFVBQVU7SUFDZCxNQUFNLENBQUMsUUFBUSxHQUFzQixJQUFJLENBQUM7SUFDMUMsS0FBSyxHQUdSLEVBQUUsQ0FBQztJQUNBLFNBQVMsQ0FBdUM7SUFDaEQsV0FBVyxDQUFDO0lBQ1osZUFBZSxDQUFXO0lBQzFCLElBQUksQ0FBVztJQUNmLFVBQVUsQ0FBQztJQUVuQjtRQUNDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFnQixXQUFXLEVBQUUsQ0FBQyxFQUFFO1lBQ3RELE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDYixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFbEQsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQzt3QkFDOUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUNyRCxDQUFDO2dCQUNGLENBQUM7WUFDRixDQUFDO1NBQ0QsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFD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LFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxTQUFTLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRCxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2lkYi9JREJNYW5hZ2VyLmpzXG5cbmltcG9ydCB7IElEQlBEYXRhYmFzZSwgSURCUE9iamVjdFN0b3JlLCBvcGVuREIgfSBmcm9tICdpZGInO1xuaW1wb3J0IHtcblx0SFNMLFxuXHRJREJNYW5hZ2VySW50ZXJmYWNlLFxuXHRNb2RlRGF0YSxcblx0TXV0YXRpb25Mb2csXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVEQixcblx0UGFsZXR0ZUl0ZW0sXG5cdFBhbGV0dGVTY2hlbWEsXG5cdFNldHRpbmdzLFxuXHRTdG9yZWRQYWxldHRlXG59IGZyb20gJy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBJREJNYW5hZ2VyIGltcGxlbWVudHMgSURCTWFuYWdlckludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBJREJNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgY2FjaGU6IFBhcnRpYWw8e1xuXHRcdHNldHRpbmdzOiBTZXR0aW5ncztcblx0XHRjdXN0b21Db2xvcjogSFNMO1xuXHR9PiA9IHt9O1xuXHRwcml2YXRlIGRiUHJvbWlzZTogUHJvbWlzZTxJREJQRGF0YWJhc2U8UGFsZXR0ZVNjaGVtYT4+O1xuXHRwcml2YXRlIGRlZmF1bHRLZXlzO1xuXHRwcml2YXRlIGRlZmF1bHRTZXR0aW5nczogU2V0dGluZ3M7XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGE7XG5cdHByaXZhdGUgc3RvcmVOYW1lcztcblxuXHRwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuZGJQcm9taXNlID0gb3BlbkRCPFBhbGV0dGVTY2hlbWE+KCdwYWxldHRlREInLCAxLCB7XG5cdFx0XHR1cGdyYWRlOiBkYiA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlTmFtZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuc3RvcmVOYW1lcyk7XG5cblx0XHRcdFx0Zm9yIChjb25zdCBzdG9yZU5hbWUgb2Ygc3RvcmVOYW1lcykge1xuXHRcdFx0XHRcdGlmICghZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhzdG9yZU5hbWUpKSB7XG5cdFx0XHRcdFx0XHRkYi5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUsIHsga2V5UGF0aDogJ2tleScgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5kZWZhdWx0U2V0dGluZ3MgPSBkYXRhLmRlZmF1bHRzLmlkYi5zZXR0aW5ncztcblx0XHR0aGlzLm1vZGUgPSBkYXRhLm1vZGU7XG5cdFx0dGhpcy5kZWZhdWx0S2V5cyA9IGRhdGEuaWRiLkRFRkFVTFRfS0VZUztcblx0XHR0aGlzLnN0b3JlTmFtZXMgPSBkYXRhLmlkYi5TVE9SRV9OQU1FUztcblx0fVxuXG5cdC8vXG5cdC8vL1xuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8gKiAqICogKiAqICogU1RBVElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBjcmVhdGVJbnN0YW5jZSgpOiBQcm9taXNlPElEQk1hbmFnZXI+IHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBuZXcgSURCTWFuYWdlcigpO1xuXHRcdFx0YXdhaXQgdGhpcy5pbnN0YW5jZS5pbml0aWFsaXplREIoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZTtcblx0fVxuXG5cdHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBJREJNYW5hZ2VyIHtcblx0XHRpZiAoIXRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J0lEQk1hbmFnZXIgaW5zdGFuY2UgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkLiBDYWxsIGNyZWF0ZUluc3RhbmNlIGZpcnN0Lidcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmluc3RhbmNlO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyByZXNldEluc3RhbmNlKCk6IHZvaWQge1xuXHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICogKiAqIFBVQkxJQyBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHB1YmxpYyBjcmVhdGVNdXRhdGlvbkxvZ2dlcjxUIGV4dGVuZHMgb2JqZWN0PihvYmo6IFQsIGtleTogc3RyaW5nKTogVCB7XG5cdFx0Y29uc3QgbG9nTXV0YXRpb24gPSB0aGlzLmxvZ011dGF0aW9uLmJpbmQodGhpcyk7XG5cblx0XHRyZXR1cm4gbmV3IFByb3h5KG9iaiwge1xuXHRcdFx0c2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5IGFzIGtleW9mIFRdO1xuXHRcdFx0XHRjb25zdCBzdWNjZXNzID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpO1xuXG5cdFx0XHRcdGlmIChzdWNjZXNzKSB7XG5cdFx0XHRcdFx0bG9nTXV0YXRpb24oe1xuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWU6IHsgW3Byb3BlcnR5XTogdmFsdWUgfSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlOiB7IFtwcm9wZXJ0eV06IG9sZFZhbHVlIH0sXG5cdFx0XHRcdFx0XHRvcmlnaW46ICdQcm94eSdcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBzdWNjZXNzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVQYWxldHRlVGFibGUocGFsZXR0ZTogU3RvcmVkUGFsZXR0ZSk6IEhUTUxFbGVtZW50IHtcblx0XHRjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRjb25zdCB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XG5cdFx0dGFibGUuY2xhc3NMaXN0LmFkZCgncGFsZXR0ZS10YWJsZScpO1xuXG5cdFx0cGFsZXR0ZS5wYWxldHRlLml0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG5cdFx0XHRjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHRjZWxsLnRleHRDb250ZW50ID0gYENvbG9yICR7aW5kZXggKyAxfWA7XG5cdFx0XHRjb2xvckJveC5jbGFzc0xpc3QuYWRkKCdjb2xvci1ib3gnKTtcblx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGl0ZW0uY3NzU3RyaW5ncy5oZXhDU1NTdHJpbmc7XG5cblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjb2xvckJveCk7XG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0XHR0YWJsZS5hcHBlbmRDaGlsZChyb3cpO1xuXHRcdH0pO1xuXG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGFibGUpO1xuXG5cdFx0cmV0dXJuIGZyYWdtZW50IGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnQ7XG5cdH1cblxuXHRwcml2YXRlIGNyZWF0ZVBhbGV0dGVPYmplY3QoXG5cdFx0dHlwZTogc3RyaW5nLFxuXHRcdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRcdGJhc2VDb2xvcjogSFNMLFxuXHRcdG51bUJveGVzOiBudW1iZXIsXG5cdFx0ZW5hYmxlQWxwaGE6IGJvb2xlYW4sXG5cdFx0bGltaXREYXJrOiBib29sZWFuLFxuXHRcdGxpbWl0R3JheTogYm9vbGVhbixcblx0XHRsaW1pdExpZ2h0OiBib29sZWFuXG5cdCk6IFBhbGV0dGUge1xuXHRcdHJldHVybiB1dGlscy5wYWxldHRlLmNyZWF0ZU9iamVjdChcblx0XHRcdHR5cGUsXG5cdFx0XHRpdGVtcyxcblx0XHRcdGJhc2VDb2xvcixcblx0XHRcdERhdGUubm93KCksXG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrLFxuXHRcdFx0bGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodFxuXHRcdCk7XG5cdH1cblxuXHQvLyAqREVWLU5PVEUqIGFkZCB0aGlzIG1ldGhvZCB0byBkb2NzXG5cdHB1YmxpYyBhc3luYyBkZWxldGVFbnRyeShcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghKGF3YWl0IHRoaXMuZW5zdXJlRW50cnlFeGlzdHMoc3RvcmVOYW1lLCBrZXkpKSkge1xuXHRcdFx0XHRpZiAodGhpcy5tb2RlLndhcm5Mb2dzKSB7XG5cdFx0XHRcdFx0bG9nLndhcm4oYEVudHJ5IHdpdGgga2V5ICR7a2V5fSBub3QgZm91bmQuYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0XHQudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCAncmVhZHdyaXRlJylcblx0XHRcdFx0Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cblx0XHRcdGF3YWl0IHN0b3JlLmRlbGV0ZShrZXkpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2cuaW5mbyhgRW50cnkgd2l0aCBrZXkgJHtrZXl9IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5LmApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZURhdGEoKTogRXJyb3IgZGVsZXRpbmcgZW50cnknKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBkZWxldGVFbnRyaWVzKFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXlzOiBzdHJpbmdbXVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzdG9yZSA9IGRiXG5cdFx0XHRcdC50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKVxuXHRcdFx0XHQub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblx0XHRcdGNvbnN0IHZhbGlkS2V5cyA9IChcblx0XHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0a2V5cy5tYXAoYXN5bmMga2V5ID0+XG5cdFx0XHRcdFx0XHQoYXdhaXQgdGhpcy5lbnN1cmVFbnRyeUV4aXN0cyhzdG9yZU5hbWUsIGtleSkpXG5cdFx0XHRcdFx0XHRcdD8ga2V5XG5cdFx0XHRcdFx0XHRcdDogbnVsbFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KS5maWx0ZXIoKGtleSk6IGtleSBpcyBzdHJpbmcgPT4ga2V5ICE9PSBudWxsKTtcblxuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwodmFsaWRLZXlzLm1hcChrZXkgPT4gc3RvcmUuZGVsZXRlKGtleSkpKTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHtcblx0XHRcdFx0bG9nLmluZm8oYEVudHJpZXMgZGVsZXRlZCBzdWNjZXNzZnVsbHkuIEtleXM6ICR7dmFsaWRLZXlzfWApO1xuXHRcdFx0fVxuXHRcdH0sICdJREJNYW5hZ2VyLmRlbGV0ZUVudHJpZXMoKTogRXJyb3IgZGVsZXRpbmcgZW50cmllcycpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1cnJlbnRQYWxldHRlSUQoKTogUHJvbWlzZTxudW1iZXI+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLmdldFN0b3JlTmFtZSgnU0VUVElOR1MnKSxcblx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0bG9nLmluZm8oYEZldGNoZWQgc2V0dGluZ3MgZnJvbSBJbmRleGVkREI6ICR7c2V0dGluZ3N9YCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncz8ubGFzdFBhbGV0dGVJRCA/PyAwO1xuXHRcdH0sICdJREJNYW5hZ2VyOiBnZXRDdXJyZW50UGFsZXR0ZUlEKCk6IEVycm9yIGZldGNoaW5nIGN1cnJlbnQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldENhY2hlZFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRpZiAodGhpcy5jYWNoZS5zZXR0aW5ncykgcmV0dXJuIHRoaXMuY2FjaGUuc2V0dGluZ3M7XG5cblx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblx0XHRpZiAoc2V0dGluZ3MpIHRoaXMuY2FjaGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0XHRyZXR1cm4gc2V0dGluZ3M7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VzdG9tQ29sb3IoKTogUHJvbWlzZTxIU0wgfCBudWxsPiB7XG5cdFx0Y29uc3Qga2V5ID0gdGhpcy5yZXNvbHZlS2V5KCdDVVNUT01fQ09MT1InKTtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnJlc29sdmVTdG9yZU5hbWUoJ0NVU1RPTV9DT0xPUicpO1xuXG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBlbnRyeSA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRcdGlmICghZW50cnk/LmNvbG9yKSByZXR1cm4gbnVsbDtcblxuXHRcdFx0dGhpcy5jYWNoZS5jdXN0b21Db2xvciA9IGVudHJ5LmNvbG9yO1xuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIoZW50cnkuY29sb3IsIHN0b3JlTmFtZSk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0Q3VzdG9tQ29sb3IoKTogRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIGNvbG9yJyk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TG9nZ2VkT2JqZWN0PFQgZXh0ZW5kcyBvYmplY3Q+KFxuXHRcdG9iajogVCB8IG51bGwsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogVCB8IG51bGwge1xuXHRcdGlmIChvYmopIHtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU11dGF0aW9uTG9nZ2VyKG9iaiwga2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXROZXh0VGFibGVJRCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblx0XHRcdGNvbnN0IGxhc3RUYWJsZUlEID0gc2V0dGluZ3MubGFzdFRhYmxlSUQgPz8gMDtcblx0XHRcdGNvbnN0IG5leHRJRCA9IGxhc3RUYWJsZUlEICsgMTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCB7XG5cdFx0XHRcdC4uLnNldHRpbmdzLFxuXHRcdFx0XHRsYXN0VGFibGVJRDogbmV4dElEXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGBwYWxldHRlXyR7bmV4dElEfWA7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFRhYmxlSUQoKTogRXJyb3IgZmV0Y2hpbmcgbmV4dCB0YWJsZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRQYWxldHRlSUQoKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudElEID0gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUlEKCk7XG5cdFx0XHRjb25zdCBuZXdJRCA9IGN1cnJlbnRJRCArIDE7XG5cblx0XHRcdGF3YWl0IHRoaXMudXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRCk7XG5cblx0XHRcdHJldHVybiBuZXdJRDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXROZXh0UGFsZXR0ZUlEKCk6IEVycm9yIGZldGNoaW5nIG5leHQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldFNldHRpbmdzKCk6IFByb21pc2U8U2V0dGluZ3M+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLmdldFN0b3JlTmFtZSgnU0VUVElOR1MnKSxcblx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHNldHRpbmdzID8/IHRoaXMuZGVmYXVsdFNldHRpbmdzO1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldFNldHRpbmdzKCk6IEVycm9yIGZldGNoaW5nIHNldHRpbmdzJyk7XG5cdH1cblxuXHQvLyAqKkRFVi1OT1RFKiogRklHVVJFIE9VVCBIT1cgVE8gSU1QTEVNRU5UIGhhbmRsZUFzeW5jIEhFUkVcblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkb25seSdcblx0KTogUHJvbWlzZTxcblx0XHRJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgJ3JlYWRvbmx5Jz5cblx0PjtcblxuXHRwdWJsaWMgYXN5bmMgZ2V0U3RvcmU8U3RvcmVOYW1lIGV4dGVuZHMga2V5b2YgUGFsZXR0ZVNjaGVtYT4oXG5cdFx0c3RvcmVOYW1lOiBTdG9yZU5hbWUsXG5cdFx0bW9kZTogJ3JlYWR3cml0ZSdcblx0KTogUHJvbWlzZTxcblx0XHRJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgJ3JlYWR3cml0ZSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkb25seScgfCAncmVhZHdyaXRlJ1xuXHQpIHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblxuXHRcdHJldHVybiBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsIG1vZGUpLm9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVuZGVyUGFsZXR0ZSh0YWJsZUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0VGFibGUodGFibGVJZCk7XG5cdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0aWYgKCFwYWxldHRlUm93KSB0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgcm93IGVsZW1lbnQgbm90IGZvdW5kLicpO1xuXG5cdFx0XHRwYWxldHRlUm93LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblxuXHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZCh0YWJsZUVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkgbG9nLmluZm8oYFJlbmRlcmVkIHBhbGV0dGUgJHt0YWJsZUlkfS5gKTtcblx0XHR9LCAnSURCTWFuYWdlci5yZW5kZXJQYWxldHRlKCk6IEVycm9yIHJlbmRlcmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVzZXREYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBhdmFpbGFibGVTdG9yZXMgPSBBcnJheS5mcm9tKGRiLm9iamVjdFN0b3JlTmFtZXMpO1xuXHRcdFx0Y29uc3QgZXhwZWN0ZWRTdG9yZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuc3RvcmVOYW1lcyk7XG5cblx0XHRcdGZvciAoY29uc3Qgc3RvcmVOYW1lIG9mIGV4cGVjdGVkU3RvcmVzKSB7XG5cdFx0XHRcdGlmICghYXZhaWxhYmxlU3RvcmVzLmluY2x1ZGVzKHN0b3JlTmFtZSkpIHtcblx0XHRcdFx0XHRsb2cud2Fybihcblx0XHRcdFx0XHRcdGBPYmplY3Qgc3RvcmUgXCIke3N0b3JlTmFtZX1cIiBub3QgZm91bmQgaW4gSW5kZXhlZERCLmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRcdGF3YWl0IHN0b3JlLmNsZWFyKCk7XG5cdFx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cblx0XHRcdFx0Y29uc3Qgc2V0dGluZ3NTdG9yZSA9IGRiXG5cdFx0XHRcdFx0LnRyYW5zYWN0aW9uKHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpLCAncmVhZHdyaXRlJylcblx0XHRcdFx0XHQub2JqZWN0U3RvcmUodGhpcy5nZXRTdG9yZU5hbWUoJ1NFVFRJTkdTJykpO1xuXHRcdFx0XHRhd2FpdCBzZXR0aW5nc1N0b3JlLnB1dChcblx0XHRcdFx0XHR0aGlzLmRlZmF1bHRTZXR0aW5ncyxcblx0XHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0bG9nLmluZm8oYEluZGV4ZWREQiBoYXMgYmVlbiByZXNldCB0byBkZWZhdWx0IHNldHRpbnMuYCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIucmVzZXREYXRhYmFzZSgpOiBFcnJvciByZXNldHRpbmcgZGF0YWJhc2UnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBkZWxldGVEYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiTmFtZSA9ICdwYWxldHRlREInO1xuXHRcdFx0Y29uc3QgZGJFeGlzdHMgPSBhd2FpdCBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG5cblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0cmVxdWVzdC5yZXN1bHQuY2xvc2UoKTtcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKGZhbHNlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoZGJFeGlzdHMpIHtcblx0XHRcdFx0Y29uc3QgZGVsZXRlUmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShkYk5hbWUpO1xuXG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRcdFx0bG9nLmluZm8oYERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZGVsZXRlZCBzdWNjZXNzZnVsbHkuYCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGRlbGV0ZVJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVycm9yIGRlbGV0aW5nIGRhdGFiYXNlIFwiJHtkYk5hbWV9XCI6YCxcblx0XHRcdFx0XHRcdGV2ZW50XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGVsZXRlUmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS53YXJuTG9ncylcblx0XHRcdFx0XHRcdGxvZy53YXJuKFxuXHRcdFx0XHRcdFx0XHRgRGVsZXRlIG9wZXJhdGlvbiBibG9ja2VkLiBFbnN1cmUgbm8gb3BlbiBjb25uZWN0aW9ucyB0byBcIiR7ZGJOYW1lfVwiLmBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlLnNob3dBbGVydHMpXG5cdFx0XHRcdFx0XHRhbGVydChcblx0XHRcdFx0XHRcdFx0YFVuYWJsZSB0byBkZWxldGUgZGF0YWJhc2UgXCIke2RiTmFtZX1cIiBiZWNhdXNlIGl0IGlzIGluIHVzZS4gUGxlYXNlIGNsb3NlIGFsbCBvdGhlciB0YWJzIG9yIHdpbmRvd3MgYWNjZXNzaW5nIHRoaXMgZGF0YWJhc2UgYW5kIHRyeSBhZ2Fpbi5gXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMubW9kZS5zdGFja1RyYWNlKVxuXHRcdFx0XHRcdFx0Y29uc29sZS50cmFjZShgQmxvY2tlZCBjYWxsIHN0YWNrOmApO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0bG9nLndhcm4oYERhdGFiYXNlIFwiJHtkYk5hbWV9XCIgZG9lcyBub3QgZXhpc3QuYCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZGVsZXRlRGF0YWJhc2UoKTogRXJyb3IgZGVsZXRpbmcgZGF0YWJhc2UnKTtcblx0fVxuXG5cdC8vICpERVYtTk9URSogYWRkIHRoaXMgbWV0aG9kIHRvIGRvY3Ncblx0cHVibGljIGFzeW5jIHJlc2V0UGFsZXR0ZUlEKCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpO1xuXHRcdFx0Y29uc3Qga2V5ID0gdGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZGIuZ2V0KHN0b3JlTmFtZSwga2V5KTtcblxuXHRcdFx0aWYgKCFzZXR0aW5ncylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTZXR0aW5ncyBub3QgZm91bmQuIENhbm5vdCByZXNldCBwYWxldHRlIElELicpO1xuXG5cdFx0XHRzZXR0aW5ncy5sYXN0UGFsZXR0ZUlEID0gMDtcblxuXHRcdFx0YXdhaXQgZGIucHV0KHN0b3JlTmFtZSwgeyBrZXksIC4uLnRoaXMuZGVmYXVsdFNldHRpbmdzIH0pO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nLmluZm8oYFBhbGV0dGUgSUQgaGFzIHN1Y2Nlc3NmdWxseSBiZWVuIHJlc2V0IHRvIDBgKTtcblx0XHR9LCAnSURCTWFuYWdlci5yZXNldFBhbGV0dGVJRCgpOiBFcnJvciByZXNldHRpbmcgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVEYXRhPFQ+KFxuXHRcdHN0b3JlTmFtZToga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRrZXk6IHN0cmluZyxcblx0XHRkYXRhOiBULFxuXHRcdG9sZFZhbHVlPzogVFxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy53aXRoU3RvcmUoc3RvcmVOYW1lLCAncmVhZHdyaXRlJywgYXN5bmMgc3RvcmUgPT4ge1xuXHRcdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXksIC4uLmRhdGEgfSk7XG5cdFx0XHRcdGF3YWl0IHRoaXMubG9nTXV0YXRpb24oe1xuXHRcdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRhY3Rpb246ICd1cGRhdGUnLFxuXHRcdFx0XHRcdG5ld1ZhbHVlOiBkYXRhLFxuXHRcdFx0XHRcdG9sZFZhbHVlOiBvbGRWYWx1ZSB8fCBudWxsLFxuXHRcdFx0XHRcdG9yaWdpbjogJ3NhdmVEYXRhJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVEYXRhKCk6IEVycm9yIHNhdmluZyBkYXRhJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVBhbGV0dGUoXG5cdFx0aWQ6IHN0cmluZyxcblx0XHRuZXdQYWxldHRlOiBTdG9yZWRQYWxldHRlXG5cdCk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZSA9IGF3YWl0IHRoaXMuZ2V0U3RvcmUoJ3RhYmxlcycsICdyZWFkd3JpdGUnKTtcblx0XHRcdGNvbnN0IHBhbGV0dGVUb1NhdmU6IFN0b3JlZFBhbGV0dGUgPSB7XG5cdFx0XHRcdHRhYmxlSUQ6IG5ld1BhbGV0dGUudGFibGVJRCxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZS5wYWxldHRlXG5cdFx0XHR9O1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoeyBrZXk6IGlkLCAuLi5wYWxldHRlVG9TYXZlIH0pO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkgbG9nLmluZm8oYFBhbGV0dGUgJHtpZH0gc2F2ZWQgc3VjY2Vzc2Z1bGx5LmApO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVQYWxldHRlKCk6IEVycm9yIHNhdmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2F2ZVBhbGV0dGVUb0RCKFxuXHRcdHR5cGU6IHN0cmluZyxcblx0XHRpdGVtczogUGFsZXR0ZUl0ZW1bXSxcblx0XHRiYXNlQ29sb3I6IEhTTCxcblx0XHRudW1Cb3hlczogbnVtYmVyLFxuXHRcdGVuYWJsZUFscGhhOiBib29sZWFuLFxuXHRcdGxpbWl0RGFyazogYm9vbGVhbixcblx0XHRsaW1pdEdyYXk6IGJvb2xlYW4sXG5cdFx0bGltaXRMaWdodDogYm9vbGVhblxuXHQpOiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3UGFsZXR0ZSA9IHRoaXMuY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHRcdFx0dHlwZSxcblx0XHRcdFx0aXRlbXMsXG5cdFx0XHRcdGJhc2VDb2xvcixcblx0XHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0XHRsaW1pdERhcmssXG5cdFx0XHRcdGxpbWl0R3JheSxcblx0XHRcdFx0bGltaXRMaWdodFxuXHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgaWRQYXJ0cyA9IG5ld1BhbGV0dGUuaWQuc3BsaXQoJ18nKTtcblxuXHRcdFx0aWYgKGlkUGFydHMubGVuZ3RoICE9PSAyIHx8IGlzTmFOKE51bWJlcihpZFBhcnRzWzFdKSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhbGV0dGUgSUQgZm9ybWF0OiAke25ld1BhbGV0dGUuaWR9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZVBhbGV0dGUobmV3UGFsZXR0ZS5pZCwge1xuXHRcdFx0XHR0YWJsZUlEOiBwYXJzZUludChpZFBhcnRzWzFdLCAxMCksXG5cdFx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGVcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3UGFsZXR0ZTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZVRvREIoKTogRXJyb3Igc2F2aW5nIHBhbGV0dGUgdG8gREInKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlU2V0dGluZ3MobmV3U2V0dGluZ3M6IFNldHRpbmdzKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3NldHRpbmdzJywgJ2FwcFNldHRpbmdzJywgbmV3U2V0dGluZ3MpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkgbG9nLmluZm8oJ1NldHRpbmdzIHVwZGF0ZWQnKTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlU2V0dGluZ3MoKTogRXJyb3Igc2F2aW5nIHNldHRpbmdzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgdXBkYXRlRW50cnlJblBhbGV0dGUoXG5cdFx0dGFibGVJRDogc3RyaW5nLFxuXHRcdGVudHJ5SW5kZXg6IG51bWJlcixcblx0XHRuZXdFbnRyeTogUGFsZXR0ZUl0ZW1cblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghKGF3YWl0IHRoaXMuZW5zdXJlRW50cnlFeGlzdHMoJ3RhYmxlcycsIHRhYmxlSUQpKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlEfSBub3QgZm91bmQuYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHN0b3JlZFBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldFRhYmxlKHRhYmxlSUQpO1xuXG5cdFx0XHRpZiAoIXN0b3JlZFBhbGV0dGUpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSUR9IG5vdCBmb3VuZC5gKTtcblxuXHRcdFx0Y29uc3QgeyBpdGVtcyB9ID0gc3RvcmVkUGFsZXR0ZS5wYWxldHRlO1xuXG5cdFx0XHRpZiAoZW50cnlJbmRleCA+PSBpdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gbm90IGZvdW5kIGluIHBhbGV0dGUgJHt0YWJsZUlEfS5gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHRoaXMubW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0bG9nLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVudHJ5ICR7ZW50cnlJbmRleH0gbm90IGZvdW5kIGluIHBhbGV0dGUgJHt0YWJsZUlEfS5gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdFx0bG9nLndhcm4oJ3VwZGF0ZUVudHJ5SW5QYWxldHRlOiBFbnRyeSBub3QgZm91bmQuJyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9sZEVudHJ5ID0gaXRlbXNbZW50cnlJbmRleF07XG5cdFx0XHRpdGVtc1tlbnRyeUluZGV4XSA9IG5ld0VudHJ5O1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCd0YWJsZXMnLCB0YWJsZUlELCBzdG9yZWRQYWxldHRlKTtcblx0XHRcdGF3YWl0IHRoaXMubG9nTXV0YXRpb24oe1xuXHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0a2V5OiBgJHt0YWJsZUlEfS0ke2VudHJ5SW5kZXh9XWAsXG5cdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdG5ld1ZhbHVlOiBuZXdFbnRyeSxcblx0XHRcdFx0b2xkVmFsdWU6IG9sZEVudHJ5LFxuXHRcdFx0XHRvcmlnaW46ICd1cGRhdGVFbnRyeUluUGFsZXR0ZSdcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nLmluZm8oYEVudHJ5ICR7ZW50cnlJbmRleH0gaW4gcGFsZXR0ZSAke3RhYmxlSUR9IHVwZGF0ZWQuYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIudXBkYXRlRW50cnlJblBhbGV0dGUoKTogRXJyb3IgdXBkYXRpbmcgZW50cnkgaW4gcGFsZXR0ZScpO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8vICogKiAqICogICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vLy8vICogKiAqICogKiAqIFBSSVZBVEUgTUVUSE9EUyAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZURCKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMuZGJQcm9taXNlO1xuXG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3Qgc3RvcmVOYW1lID0gdGhpcy5nZXRTdG9yZU5hbWUoJ1NFVFRJTkdTJyk7XG5cdFx0Y29uc3Qga2V5ID0gdGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKTtcblxuXHRcdGxvZy5pbmZvKGBJbml0aWFsaXppbmcgREIgd2l0aCBTdG9yZSBOYW1lOiAke3N0b3JlTmFtZX0sIEtleTogJHtrZXl9YCk7XG5cblx0XHRpZiAoIXN0b3JlTmFtZSB8fCAha2V5KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RvcmUgbmFtZSBvciBrZXkuJyk7XG5cblx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChzdG9yZU5hbWUsIGtleSk7XG5cblx0XHRpZiAoIXNldHRpbmdzKSB7XG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRsb2cuaW5mbyhgSW5pdGlhbGl6aW5nIGRlZmF1bHQgc2V0dGluZ3MuLi5gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgZGIucHV0KHN0b3JlTmFtZSwgeyBrZXksIC4uLnRoaXMuZGVmYXVsdFNldHRpbmdzIH0pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZGVidWdFcnJvcihjb250ZXh0OiBzdHJpbmcsIGVycm9yOiB1bmtub3duKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdGNvbnN0IGVycm9yTXNnID1cblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpO1xuXG5cdFx0XHRsb2cuZXJyb3IoYEVycm9yIGluICR7Y29udGV4dH06ICR7ZXJyb3JNc2d9YCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBlbnN1cmVFbnRyeUV4aXN0cyhcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmdcblx0KTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3Qgc3RvcmUgPSBkYlxuXHRcdFx0LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWRvbmx5Jylcblx0XHRcdC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0cmV0dXJuIChhd2FpdCBzdG9yZS5nZXQoa2V5KSkgIT09IHVuZGVmaW5lZDtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZ2V0REIoKTogUHJvbWlzZTxQYWxldHRlREI+IHtcblx0XHRyZXR1cm4gdGhpcy5kYlByb21pc2U7XG5cdH1cblxuXHRwcml2YXRlIGdldERlZmF1bHRLZXkoa2V5OiBrZXlvZiB0eXBlb2YgdGhpcy5zdG9yZU5hbWVzKTogc3RyaW5nIHtcblx0XHRjb25zdCBkZWZhdWx0S2V5ID0gdGhpcy5kZWZhdWx0S2V5c1trZXldO1xuXG5cdFx0aWYgKCFkZWZhdWx0S2V5KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFtnZXREZWZhdWx0S2V5KCldOiBJbnZhbGlkIGRlZmF1bHQga2V5OiAke2tleX1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEtleTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0U3RvcmVOYW1lKHN0b3JlS2V5OiBrZXlvZiB0eXBlb2YgdGhpcy5zdG9yZU5hbWVzKTogc3RyaW5nIHtcblx0XHRjb25zdCBzdG9yZU5hbWUgPSB0aGlzLnN0b3JlTmFtZXNbc3RvcmVLZXldO1xuXG5cdFx0aWYgKCFzdG9yZU5hbWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgW2dldFN0b3JlTmFtZSgpXTogSW52YWxpZCBzdG9yZSBrZXk6ICR7c3RvcmVLZXl9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0b3JlTmFtZTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZ2V0VGFibGUoaWQ6IHN0cmluZyk6IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLmdldCh0aGlzLnN0b3JlTmFtZXMuVEFCTEVTLCBpZCk7XG5cblx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdGlmICh0aGlzLm1vZGUud2FybkxvZ3MpXG5cdFx0XHRcdFx0bG9nLndhcm4oYFRhYmxlIHdpdGggSUQgJHtpZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXRUYWJsZSgpOiBFcnJvciBmZXRjaGluZyB0YWJsZScpO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBoYW5kbGVBc3luYzxUPihcblx0XHRhY3Rpb246ICgpID0+IFByb21pc2U8VD4sXG5cdFx0ZXJyb3JNZXNzYWdlOiBzdHJpbmcsXG5cdFx0Y29udGV4dD86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG5cdCk6IFByb21pc2U8VCB8IG51bGw+IHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IGFjdGlvbigpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5tb2RlLmVycm9yTG9ncykge1xuXHRcdFx0XHRjb25zdCBkZXRhaWxzID0gY29udGV4dCA/IEpTT04uc3RyaW5naWZ5KGNvbnRleHQpIDogJyc7XG5cdFx0XHRcdHRoaXMuZGVidWdFcnJvcihcblx0XHRcdFx0XHRgRXJyb3I6ICR7ZXJyb3JNZXNzYWdlfVxcbkRldGFpbHM6ICR7ZGV0YWlsc31cXG4ke2Vycm9yfWAsXG5cdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGxvZ011dGF0aW9uKGRhdGE6IE11dGF0aW9uTG9nKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXG5cdFx0XHRhd2FpdCBkYi5wdXQoJ211dGF0aW9ucycsIGxvZyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2cuaW5mbyhgTG9nZ2VkIG11dGF0aW9uOiAke0pTT04uc3RyaW5naWZ5KGRhdGEpfWApO1xuXHRcdH0sICdJREJNYW5hZ2VyLmxvZ011dGF0aW9uKCk6IEVycm9yIGxvZ2dpbmcgbXV0YXRpb24nKTtcblx0fVxuXG5cdHByaXZhdGUgcmVzb2x2ZUtleTxLIGV4dGVuZHMga2V5b2YgdHlwZW9mIHRoaXMuZGVmYXVsdEtleXM+KFxuXHRcdGtleTogS1xuXHQpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLmRlZmF1bHRLZXlzW2tleV07XG5cdH1cblxuXHRwcml2YXRlIHJlc29sdmVTdG9yZU5hbWU8UyBleHRlbmRzIGtleW9mIHR5cGVvZiB0aGlzLnN0b3JlTmFtZXM+KFxuXHRcdHN0b3JlOiBTXG5cdCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuc3RvcmVOYW1lc1tzdG9yZV07XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIHVwZGF0ZUN1cnJlbnRQYWxldHRlSUQobmV3SUQ6IG51bWJlcik6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3NldHRpbmdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnc2V0dGluZ3MnKTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5kZWJ1Zylcblx0XHRcdFx0bG9nLmluZm8oYFVwZGF0aW5nIGN1cmVudCBwYWxldHRlIElEIHRvICR7bmV3SUR9YCk7XG5cblx0XHRcdGF3YWl0IHN0b3JlLnB1dCh7IGtleTogJ2FwcFNldHRpbmdzJywgbGFzdFBhbGV0dGVJRDogbmV3SUQgfSk7XG5cdFx0XHRhd2FpdCB0eC5kb25lO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nLmluZm8oYEN1cnJlbnQgcGFsZXR0ZSBJRCB1cGRhdGVkIHRvICR7bmV3SUR9YCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIudXBkYXRlQ3VycmVudFBhbGV0dGVJRCgpOiBFcnJvciB1cGRhdGluZyBjdXJyZW50IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgd2l0aFN0b3JlPFxuXHRcdFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0TW9kZSBleHRlbmRzICdyZWFkb25seScgfCAncmVhZHdyaXRlJ1xuXHQ+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6IE1vZGUsXG5cdFx0Y2FsbGJhY2s6IChcblx0XHRcdHN0b3JlOiBJREJQT2JqZWN0U3RvcmU8UGFsZXR0ZVNjaGVtYSwgW1N0b3JlTmFtZV0sIFN0b3JlTmFtZSwgTW9kZT5cblx0XHQpID0+IFByb21pc2U8dm9pZD5cblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsIG1vZGUpO1xuXHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoc3RvcmVOYW1lKTtcblxuXHRcdGlmICghc3RvcmUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgU3RvcmUgXCIke3N0b3JlTmFtZX1cIiBub3QgZm91bmRgKTtcblx0XHR9XG5cblx0XHRhd2FpdCBjYWxsYmFjayhzdG9yZSk7XG5cdFx0YXdhaXQgdHguZG9uZTtcblx0fVxufVxuIl19