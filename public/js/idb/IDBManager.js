// File: src/idb/IDBManager.js
import { openDB } from 'idb';
import { data } from '../data/index.js';
import { utils } from '../common/index.js';
export class IDBManager {
    static instance = null;
    cache = {};
    dbPromise;
    defaultSettings;
    mode;
    DEFAULT_KEYS;
    STORE_NAMES;
    constructor() {
        this.defaultSettings = data.defaults.idb.settings;
        this.mode = data.mode;
        this.DEFAULT_KEYS = data.idb.DEFAULT_KEYS;
        this.STORE_NAMES = data.idb.STORE_NAMES;
        this.dbPromise = openDB('paletteDB', 1, {
            upgrade(db) {
                const stores = [
                    'customColor',
                    'mutations',
                    'settings',
                    'tables'
                ];
                stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, {
                            keyPath: store === 'mutations' ? 'timestamp' : 'key'
                        });
                    }
                });
            }
        });
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * INSTANCE METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    static async createInstance() {
        if (!this.instance) {
            const manager = new IDBManager();
            await manager.initializeDB();
            this.instance = manager;
        }
        return this.instance;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IDBManager();
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
    createPaletteObject(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return utils.palette.createObject(type, items, baseColor, Date.now(), numBoxes, enableAlpha, limitDark, limitGray, limitLight);
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
    async initializeDB() {
        await this.dbPromise;
        const db = await this.getDB();
        const settings = await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
        if (!settings) {
            if (!this.mode.quiet) {
                console.log(`Initializing default settings...`);
            }
            await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
        }
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
            // Delete all data from each object store
            const storeNames = Object.values(this.STORE_NAMES);
            for (const storeName of storeNames) {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear();
                await tx.done;
            }
            if (this.mode.debug)
                console.log('All object stores cleared.');
            // Re-initialize default settings
            const tx = db.transaction(this.getStoreName('SETTINGS'), 'readwrite');
            const store = tx.objectStore(this.getStoreName('SETTINGS'));
            await store.put(this.defaultSettings, this.getDefaultKey('APP_SETTINGS'));
            await tx.done;
            if (!this.mode.quiet)
                console.log('Default IDB settings re-initialized.');
            return;
        }, 'Error resetting database');
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
        return this.DEFAULT_KEYS[key];
    }
    getStoreName(storeKey) {
        return this.STORE_NAMES[storeKey];
    }
    async getTable(id) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const result = await db.get(this.STORE_NAMES.TABLES, id);
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
        return this.DEFAULT_KEYS[key];
    }
    resolveStoreName(store) {
        return this.STORE_NAMES[store];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURCTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pZGIvSURCTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFpQyxNQUFNLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFhNUQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxNQUFNLE9BQU8sVUFBVTtJQUNkLE1BQU0sQ0FBQyxRQUFRLEdBQXNCLElBQUksQ0FBQztJQUUxQyxLQUFLLEdBR1IsRUFBRSxDQUFDO0lBRUEsU0FBUyxDQUF1QztJQUNoRCxlQUFlLENBQVc7SUFDMUIsSUFBSSxDQUFXO0lBRWYsWUFBWSxDQUdsQjtJQUNNLFdBQVcsQ0FLakI7SUFFRjtRQUNDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFFeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQWdCLFdBQVcsRUFBRSxDQUFDLEVBQUU7WUFDdEQsT0FBTyxDQUFDLEVBQUU7Z0JBQ1QsTUFBTSxNQUFNLEdBQUc7b0JBQ2QsYUFBYTtvQkFDYixXQUFXO29CQUNYLFVBQVU7b0JBQ1YsUUFBUTtpQkFDUixDQUFDO2dCQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUss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QUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsU0FBUyxhQUFhLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9pZGIvSURCTWFuYWdlci5qc1xuXG5pbXBvcnQgeyBJREJQRGF0YWJhc2UsIElEQlBPYmplY3RTdG9yZSwgb3BlbkRCIH0gZnJvbSAnaWRiJztcbmltcG9ydCB7XG5cdEhTTCxcblx0SURCTWFuYWdlckludGVyZmFjZSxcblx0TW9kZURhdGEsXG5cdE11dGF0aW9uTG9nLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlREIsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlU2NoZW1hLFxuXHRTZXR0aW5ncyxcblx0U3RvcmVkUGFsZXR0ZVxufSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBJREJNYW5hZ2VyIGltcGxlbWVudHMgSURCTWFuYWdlckludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBJREJNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XG5cblx0cHJpdmF0ZSBjYWNoZTogUGFydGlhbDx7XG5cdFx0c2V0dGluZ3M6IFNldHRpbmdzO1xuXHRcdGN1c3RvbUNvbG9yOiBIU0w7XG5cdH0+ID0ge307XG5cblx0cHJpdmF0ZSBkYlByb21pc2U6IFByb21pc2U8SURCUERhdGFiYXNlPFBhbGV0dGVTY2hlbWE+Pjtcblx0cHJpdmF0ZSBkZWZhdWx0U2V0dGluZ3M6IFNldHRpbmdzO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhO1xuXG5cdHByaXZhdGUgREVGQVVMVF9LRVlTOiB7XG5cdFx0QVBQX1NFVFRJTkdTOiBzdHJpbmc7XG5cdFx0Q1VTVE9NX0NPTE9SOiBzdHJpbmc7XG5cdH07XG5cdHByaXZhdGUgU1RPUkVfTkFNRVM6IHtcblx0XHRDVVNUT01fQ09MT1I6IHN0cmluZztcblx0XHRNVVRBVElPTlM6IHN0cmluZztcblx0XHRTRVRUSU5HUzogc3RyaW5nO1xuXHRcdFRBQkxFUzogc3RyaW5nO1xuXHR9O1xuXG5cdHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5kZWZhdWx0U2V0dGluZ3MgPSBkYXRhLmRlZmF1bHRzLmlkYi5zZXR0aW5ncztcblx0XHR0aGlzLm1vZGUgPSBkYXRhLm1vZGU7XG5cdFx0dGhpcy5ERUZBVUxUX0tFWVMgPSBkYXRhLmlkYi5ERUZBVUxUX0tFWVM7XG5cdFx0dGhpcy5TVE9SRV9OQU1FUyA9IGRhdGEuaWRiLlNUT1JFX05BTUVTO1xuXG5cdFx0dGhpcy5kYlByb21pc2UgPSBvcGVuREI8UGFsZXR0ZVNjaGVtYT4oJ3BhbGV0dGVEQicsIDEsIHtcblx0XHRcdHVwZ3JhZGUoZGIpIHtcblx0XHRcdFx0Y29uc3Qgc3RvcmVzID0gW1xuXHRcdFx0XHRcdCdjdXN0b21Db2xvcicsXG5cdFx0XHRcdFx0J211dGF0aW9ucycsXG5cdFx0XHRcdFx0J3NldHRpbmdzJyxcblx0XHRcdFx0XHQndGFibGVzJ1xuXHRcdFx0XHRdO1xuXG5cdFx0XHRcdHN0b3Jlcy5mb3JFYWNoKHN0b3JlID0+IHtcblx0XHRcdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoc3RvcmUpKSB7XG5cdFx0XHRcdFx0XHRkYi5jcmVhdGVPYmplY3RTdG9yZShzdG9yZSwge1xuXHRcdFx0XHRcdFx0XHRrZXlQYXRoOiBzdG9yZSA9PT0gJ211dGF0aW9ucycgPyAndGltZXN0YW1wJyA6ICdrZXknXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly9cblx0Ly8vXG5cdC8vLy8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLyAqICogKiAqICogKiBJTlNUQU5DRSBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vL1xuXHQvL1xuXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgY3JlYXRlSW5zdGFuY2UoKTogUHJvbWlzZTxJREJNYW5hZ2VyPiB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHRjb25zdCBtYW5hZ2VyID0gbmV3IElEQk1hbmFnZXIoKTtcblx0XHRcdGF3YWl0IG1hbmFnZXIuaW5pdGlhbGl6ZURCKCk7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gbWFuYWdlcjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2U7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IElEQk1hbmFnZXIge1xuXHRcdGlmICghdGhpcy5pbnN0YW5jZSkge1xuXHRcdFx0dGhpcy5pbnN0YW5jZSA9IG5ldyBJREJNYW5hZ2VyKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2U7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIHJlc2V0SW5zdGFuY2UoKTogdm9pZCB7XG5cdFx0dGhpcy5pbnN0YW5jZSA9IG51bGw7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLyAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogKiAqICogUFVCTElDIE1FVEhPRFMgKiAqICogKiAqICogKlxuXHQvLy8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHVibGljIGNyZWF0ZU11dGF0aW9uTG9nZ2VyPFQgZXh0ZW5kcyBvYmplY3Q+KG9iajogVCwga2V5OiBzdHJpbmcpOiBUIHtcblx0XHRjb25zdCBsb2dNdXRhdGlvbiA9IHRoaXMubG9nTXV0YXRpb24uYmluZCh0aGlzKTtcblxuXHRcdHJldHVybiBuZXcgUHJveHkob2JqLCB7XG5cdFx0XHRzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0YXJnZXRbcHJvcGVydHkgYXMga2V5b2YgVF07XG5cdFx0XHRcdGNvbnN0IHN1Y2Nlc3MgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSk7XG5cblx0XHRcdFx0aWYgKHN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRsb2dNdXRhdGlvbih7XG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZScsXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZTogeyBbcHJvcGVydHldOiB2YWx1ZSB9LFxuXHRcdFx0XHRcdFx0b2xkVmFsdWU6IHsgW3Byb3BlcnR5XTogb2xkVmFsdWUgfSxcblx0XHRcdFx0XHRcdG9yaWdpbjogJ1Byb3h5J1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHN1Y2Nlc3M7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGNyZWF0ZVBhbGV0dGVUYWJsZShwYWxldHRlOiBTdG9yZWRQYWxldHRlKTogSFRNTEVsZW1lbnQge1xuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcblx0XHR0YWJsZS5jbGFzc0xpc3QuYWRkKCdwYWxldHRlLXRhYmxlJyk7XG5cblx0XHRwYWxldHRlLnBhbGV0dGUuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcblx0XHRcdGNvbnN0IGNvbG9yQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdGNlbGwudGV4dENvbnRlbnQgPSBgQ29sb3IgJHtpbmRleCArIDF9YDtcblx0XHRcdGNvbG9yQm94LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWJveCcpO1xuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXRlbS5jc3NTdHJpbmdzLmhleENTU1N0cmluZztcblxuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNvbG9yQm94KTtcblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKHJvdyk7XG5cdFx0fSk7XG5cblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCh0YWJsZSk7XG5cblx0XHRyZXR1cm4gZnJhZ21lbnQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudDtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXJyZW50UGFsZXR0ZUlEKCk6IFByb21pc2U8bnVtYmVyPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChcblx0XHRcdFx0dGhpcy5nZXRTdG9yZU5hbWUoJ1NFVFRJTkdTJyksXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaGVkIHNldHRpbmdzIGZyb20gSW5kZXhlZERCXFxuJHtzZXR0aW5nc31gKTtcblxuXHRcdFx0cmV0dXJuIHNldHRpbmdzPy5sYXN0UGFsZXR0ZUlEID8/IDA7XG5cdFx0fSwgJ0lEQk1hbmFnZXI6IGdldEN1cnJlbnRQYWxldHRlSUQoKTogRXJyb3IgZmV0Y2hpbmcgY3VycmVudCBwYWxldHRlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q2FjaGVkU2V0dGluZ3MoKTogUHJvbWlzZTxTZXR0aW5ncz4ge1xuXHRcdGlmICh0aGlzLmNhY2hlLnNldHRpbmdzKSByZXR1cm4gdGhpcy5jYWNoZS5zZXR0aW5ncztcblxuXHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5nZXRTZXR0aW5ncygpO1xuXHRcdGlmIChzZXR0aW5ncykgdGhpcy5jYWNoZS5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXHRcdHJldHVybiBzZXR0aW5ncztcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlUGFsZXR0ZU9iamVjdChcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0YmFzZUNvbG9yOiBIU0wsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUGFsZXR0ZSB7XG5cdFx0cmV0dXJuIHV0aWxzLnBhbGV0dGUuY3JlYXRlT2JqZWN0KFxuXHRcdFx0dHlwZSxcblx0XHRcdGl0ZW1zLFxuXHRcdFx0YmFzZUNvbG9yLFxuXHRcdFx0RGF0ZS5ub3coKSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmssXG5cdFx0XHRsaW1pdEdyYXksXG5cdFx0XHRsaW1pdExpZ2h0XG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXN0b21Db2xvcigpOiBQcm9taXNlPEhTTCB8IG51bGw+IHtcblx0XHRjb25zdCBrZXkgPSB0aGlzLnJlc29sdmVLZXkoJ0NVU1RPTV9DT0xPUicpO1xuXHRcdGNvbnN0IHN0b3JlTmFtZSA9IHRoaXMucmVzb2x2ZVN0b3JlTmFtZSgnQ1VTVE9NX0NPTE9SJyk7XG5cblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRcdGNvbnN0IGVudHJ5ID0gYXdhaXQgZGIuZ2V0KHN0b3JlTmFtZSwga2V5KTtcblxuXHRcdFx0aWYgKCFlbnRyeT8uY29sb3IpIHJldHVybiBudWxsO1xuXG5cdFx0XHR0aGlzLmNhY2hlLmN1c3RvbUNvbG9yID0gZW50cnkuY29sb3I7XG5cdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVNdXRhdGlvbkxvZ2dlcihlbnRyeS5jb2xvciwgc3RvcmVOYW1lKTtcblx0XHR9LCAnSURCTWFuYWdlci5nZXRDdXN0b21Db2xvcigpOiBFcnJvciBmZXRjaGluZyBjdXN0b20gY29sb3InKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRMb2dnZWRPYmplY3Q8VCBleHRlbmRzIG9iamVjdD4oXG5cdFx0b2JqOiBUIHwgbnVsbCxcblx0XHRrZXk6IHN0cmluZ1xuXHQpOiBUIHwgbnVsbCB7XG5cdFx0aWYgKG9iaikge1xuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTXV0YXRpb25Mb2dnZXIob2JqLCBrZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldE5leHRUYWJsZUlEKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5nZXRTZXR0aW5ncygpO1xuXHRcdFx0Y29uc3QgbGFzdFRhYmxlSUQgPSBzZXR0aW5ncy5sYXN0VGFibGVJRCA/PyAwO1xuXHRcdFx0Y29uc3QgbmV4dElEID0gbGFzdFRhYmxlSUQgKyAxO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKCdzZXR0aW5ncycsICdhcHBTZXR0aW5ncycsIHtcblx0XHRcdFx0Li4uc2V0dGluZ3MsXG5cdFx0XHRcdGxhc3RUYWJsZUlEOiBuZXh0SURcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gYHBhbGV0dGVfJHtuZXh0SUR9YDtcblx0XHR9LCAnSURCTWFuYWdlci5nZXROZXh0VGFibGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHRhYmxlIElEJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0TmV4dFBhbGV0dGVJRCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcblx0XHRyZXR1cm4gdGhpcy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBjdXJyZW50SUQgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlSUQoKTtcblx0XHRcdGNvbnN0IG5ld0lEID0gY3VycmVudElEICsgMTtcblxuXHRcdFx0aWYgKHRoaXMubW9kZS5zdGFja1RyYWNlKVxuXHRcdFx0XHRjb25zb2xlLnRyYWNlKFxuXHRcdFx0XHRcdGBJREJNYW5hZ2VyIG1ldGhvZCBnZXROZXh0UGFsbGV0ZUlEIHdhcyBjYWxsZWRcXG4uUGFsZXR0ZSBJRCBiZWZvcmUgc2F2ZTogJHtjdXJyZW50SUR9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLnVwZGF0ZUN1cnJlbnRQYWxldHRlSUQobmV3SUQpO1xuXG5cdFx0XHRyZXR1cm4gbmV3SUQ7XG5cdFx0fSwgJ0lEQk1hbmFnZXIuZ2V0TmV4dFBhbGV0dGVJRCgpOiBFcnJvciBmZXRjaGluZyBuZXh0IHBhbGV0dGUgSUQnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRTZXR0aW5ncygpOiBQcm9taXNlPFNldHRpbmdzPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChcblx0XHRcdFx0dGhpcy5nZXRTdG9yZU5hbWUoJ1NFVFRJTkdTJyksXG5cdFx0XHRcdHRoaXMuZ2V0RGVmYXVsdEtleSgnQVBQX1NFVFRJTkdTJylcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBzZXR0aW5ncyA/PyB0aGlzLmRlZmF1bHRTZXR0aW5ncztcblx0XHR9LCAnSURCTWFuYWdlci5nZXRTZXR0aW5ncygpOiBFcnJvciBmZXRjaGluZyBzZXR0aW5ncycpO1xuXHR9XG5cblx0Ly8gKipERVYtTk9URSoqIEZJR1VSRSBPVVQgSE9XIFRPIElNUExFTUVOVCBoYW5kbGVBc3luYyBIRVJFXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkb25seSc+XG5cdD47XG5cblx0cHVibGljIGFzeW5jIGdldFN0b3JlPFN0b3JlTmFtZSBleHRlbmRzIGtleW9mIFBhbGV0dGVTY2hlbWE+KFxuXHRcdHN0b3JlTmFtZTogU3RvcmVOYW1lLFxuXHRcdG1vZGU6ICdyZWFkd3JpdGUnXG5cdCk6IFByb21pc2U8XG5cdFx0SURCUE9iamVjdFN0b3JlPFBhbGV0dGVTY2hlbWEsIFtTdG9yZU5hbWVdLCBTdG9yZU5hbWUsICdyZWFkd3JpdGUnPlxuXHQ+O1xuXG5cdHB1YmxpYyBhc3luYyBnZXRTdG9yZTxTdG9yZU5hbWUgZXh0ZW5kcyBrZXlvZiBQYWxldHRlU2NoZW1hPihcblx0XHRzdG9yZU5hbWU6IFN0b3JlTmFtZSxcblx0XHRtb2RlOiAncmVhZG9ubHknIHwgJ3JlYWR3cml0ZSdcblx0KSB7XG5cdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRyZXR1cm4gZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCBtb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBpbml0aWFsaXplREIoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5kYlByb21pc2U7XG5cblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGRiLmdldChcblx0XHRcdHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpLFxuXHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdCk7XG5cblx0XHRpZiAoIXNldHRpbmdzKSB7XG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgSW5pdGlhbGl6aW5nIGRlZmF1bHQgc2V0dGluZ3MuLi5gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgZGIuZ2V0KFxuXHRcdFx0XHR0aGlzLmdldFN0b3JlTmFtZSgnU0VUVElOR1MnKSxcblx0XHRcdFx0dGhpcy5nZXREZWZhdWx0S2V5KCdBUFBfU0VUVElOR1MnKVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVuZGVyUGFsZXR0ZSh0YWJsZUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0VGFibGUodGFibGVJZCk7XG5cdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0aWYgKCFwYWxldHRlUm93KSB0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgcm93IGVsZW1lbnQgbm90IGZvdW5kLicpO1xuXG5cdFx0XHRwYWxldHRlUm93LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblx0XHRcdHBhbGV0dGVSb3cuYXBwZW5kQ2hpbGQodGFibGVFbGVtZW50KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIGNvbnNvbGUubG9nKGBSZW5kZXJlZCBwYWxldHRlICR7dGFibGVJZH0uYCk7XG5cdFx0fSwgJ0lEQk1hbmFnZXIucmVuZGVyUGFsZXR0ZSgpOiBFcnJvciByZW5kZXJpbmcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlc2V0RGF0YWJhc2UoKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXG5cdFx0XHQvLyBEZWxldGUgYWxsIGRhdGEgZnJvbSBlYWNoIG9iamVjdCBzdG9yZVxuXHRcdFx0Y29uc3Qgc3RvcmVOYW1lcyA9IE9iamVjdC52YWx1ZXModGhpcy5TVE9SRV9OQU1FUyk7XG5cblx0XHRcdGZvciAoY29uc3Qgc3RvcmVOYW1lIG9mIHN0b3JlTmFtZXMpIHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0XHRcdGF3YWl0IHN0b3JlLmNsZWFyKCk7XG5cdFx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1vZGUuZGVidWcpIGNvbnNvbGUubG9nKCdBbGwgb2JqZWN0IHN0b3JlcyBjbGVhcmVkLicpO1xuXG5cdFx0XHQvLyBSZS1pbml0aWFsaXplIGRlZmF1bHQgc2V0dGluZ3Ncblx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oXG5cdFx0XHRcdHRoaXMuZ2V0U3RvcmVOYW1lKCdTRVRUSU5HUycpLFxuXHRcdFx0XHQncmVhZHdyaXRlJ1xuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUodGhpcy5nZXRTdG9yZU5hbWUoJ1NFVFRJTkdTJykpO1xuXG5cdFx0XHRhd2FpdCBzdG9yZS5wdXQoXG5cdFx0XHRcdHRoaXMuZGVmYXVsdFNldHRpbmdzLFxuXHRcdFx0XHR0aGlzLmdldERlZmF1bHRLZXkoJ0FQUF9TRVRUSU5HUycpXG5cdFx0XHQpO1xuXHRcdFx0YXdhaXQgdHguZG9uZTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdEZWZhdWx0IElEQiBzZXR0aW5ncyByZS1pbml0aWFsaXplZC4nKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH0sICdFcnJvciByZXNldHRpbmcgZGF0YWJhc2UnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzYXZlRGF0YTxUPihcblx0XHRzdG9yZU5hbWU6IGtleW9mIFBhbGV0dGVTY2hlbWEsXG5cdFx0a2V5OiBzdHJpbmcsXG5cdFx0ZGF0YTogVCxcblx0XHRvbGRWYWx1ZT86IFRcblx0KTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMud2l0aFN0b3JlKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScsIGFzeW5jIHN0b3JlID0+IHtcblx0XHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5LCAuLi5kYXRhIH0pO1xuXHRcdFx0XHRhd2FpdCB0aGlzLmxvZ011dGF0aW9uKHtcblx0XHRcdFx0XHR0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0XHRuZXdWYWx1ZTogZGF0YSxcblx0XHRcdFx0XHRvbGRWYWx1ZTogb2xkVmFsdWUgfHwgbnVsbCxcblx0XHRcdFx0XHRvcmlnaW46ICdzYXZlRGF0YSdcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlRGF0YSgpOiBFcnJvciBzYXZpbmcgZGF0YScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlKFxuXHRcdGlkOiBzdHJpbmcsXG5cdFx0bmV3UGFsZXR0ZTogU3RvcmVkUGFsZXR0ZVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmUgPSBhd2FpdCB0aGlzLmdldFN0b3JlKCd0YWJsZXMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRjb25zdCBwYWxldHRlVG9TYXZlOiBTdG9yZWRQYWxldHRlID0ge1xuXHRcdFx0XHR0YWJsZUlEOiBuZXdQYWxldHRlLnRhYmxlSUQsXG5cdFx0XHRcdHBhbGV0dGU6IG5ld1BhbGV0dGUucGFsZXR0ZVxuXHRcdFx0fTtcblxuXHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5OiBpZCwgLi4ucGFsZXR0ZVRvU2F2ZSB9KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIHRoaXMubG9nKGBQYWxldHRlICR7aWR9IHNhdmVkIHN1Y2Nlc3NmdWxseS5gKTtcblx0XHR9LCAnSURCTWFuYWdlci5zYXZlUGFsZXR0ZSgpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVQYWxldHRlVG9EQihcblx0XHR0eXBlOiBzdHJpbmcsXG5cdFx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdFx0YmFzZUNvbG9yOiBIU0wsXG5cdFx0bnVtQm94ZXM6IG51bWJlcixcblx0XHRlbmFibGVBbHBoYTogYm9vbGVhbixcblx0XHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdFx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW5cblx0KTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IG5ld1BhbGV0dGUgPSB0aGlzLmNyZWF0ZVBhbGV0dGVPYmplY3QoXG5cdFx0XHRcdHR5cGUsXG5cdFx0XHRcdGl0ZW1zLFxuXHRcdFx0XHRiYXNlQ29sb3IsXG5cdFx0XHRcdG51bUJveGVzLFxuXHRcdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdFx0bGltaXREYXJrLFxuXHRcdFx0XHRsaW1pdEdyYXksXG5cdFx0XHRcdGxpbWl0TGlnaHRcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGlkUGFydHMgPSBuZXdQYWxldHRlLmlkLnNwbGl0KCdfJyk7XG5cdFx0XHRpZiAoaWRQYXJ0cy5sZW5ndGggIT09IDIgfHwgaXNOYU4oTnVtYmVyKGlkUGFydHNbMV0pKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFsZXR0ZSBJRCBmb3JtYXQ6ICR7bmV3UGFsZXR0ZS5pZH1gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgdGhpcy5zYXZlUGFsZXR0ZShuZXdQYWxldHRlLmlkLCB7XG5cdFx0XHRcdHRhYmxlSUQ6IHBhcnNlSW50KGlkUGFydHNbMV0sIDEwKSxcblx0XHRcdFx0cGFsZXR0ZTogbmV3UGFsZXR0ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBuZXdQYWxldHRlO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVQYWxldHRlVG9EQigpOiBFcnJvciBzYXZpbmcgcGFsZXR0ZSB0byBEQicpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNhdmVTZXR0aW5ncyhuZXdTZXR0aW5nczogU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSgnc2V0dGluZ3MnLCAnYXBwU2V0dGluZ3MnLCBuZXdTZXR0aW5ncyk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KSBjb25zb2xlLmxvZygnU2V0dGluZ3MgdXBkYXRlZCcpO1xuXHRcdH0sICdJREJNYW5hZ2VyLnNhdmVTZXR0aW5ncygpOiBFcnJvciBzYXZpbmcgc2V0dGluZ3MnKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyB1cGRhdGVFbnRyeUluUGFsZXR0ZShcblx0XHR0YWJsZUlEOiBzdHJpbmcsXG5cdFx0ZW50cnlJbmRleDogbnVtYmVyLFxuXHRcdG5ld0VudHJ5OiBQYWxldHRlSXRlbVxuXHQpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0VGFibGUodGFibGVJRCk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJRH0gbm90IGZvdW5kLmApO1xuXG5cdFx0XHRjb25zdCB7IGl0ZW1zIH0gPSBzdG9yZWRQYWxldHRlLnBhbGV0dGU7XG5cblx0XHRcdGlmIChlbnRyeUluZGV4ID49IGl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgRW50cnkgJHtlbnRyeUluZGV4fSBub3QgZm91bmQgaW4gcGFsZXR0ZSAke3RhYmxlSUR9LmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGhpcy5tb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0XHRcdGBFbnRyeSAke2VudHJ5SW5kZXh9IG5vdCBmb3VuZCBpbiBwYWxldHRlICR7dGFibGVJRH0uYCxcblx0XHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0XHR0aGlzLmxvZygndXBkYXRlRW50cnlJblBhbGV0dGU6IEVudHJ5IG5vdCBmb3VuZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkRW50cnkgPSBpdGVtc1tlbnRyeUluZGV4XTtcblx0XHRcdGl0ZW1zW2VudHJ5SW5kZXhdID0gbmV3RW50cnk7XG5cblx0XHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEoJ3RhYmxlcycsIHRhYmxlSUQsIHN0b3JlZFBhbGV0dGUpO1xuXHRcdFx0YXdhaXQgdGhpcy5sb2dNdXRhdGlvbih7XG5cdFx0XHRcdHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuXHRcdFx0XHRrZXk6IGAke3RhYmxlSUR9LSR7ZW50cnlJbmRleH1dYCxcblx0XHRcdFx0YWN0aW9uOiAndXBkYXRlJyxcblx0XHRcdFx0bmV3VmFsdWU6IG5ld0VudHJ5LFxuXHRcdFx0XHRvbGRWYWx1ZTogb2xkRW50cnksXG5cdFx0XHRcdG9yaWdpbjogJ3VwZGF0ZUVudHJ5SW5QYWxldHRlJ1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHR0aGlzLmxvZyhgRW50cnkgJHtlbnRyeUluZGV4fSBpbiBwYWxldHRlICR7dGFibGVJRH0gdXBkYXRlZC5gKTtcblx0XHR9LCAnSURCTWFuYWdlci51cGRhdGVFbnRyeUluUGFsZXR0ZSgpOiBFcnJvciB1cGRhdGluZyBlbnRyeSBpbiBwYWxldHRlJyk7XG5cdH1cblxuXHQvL1xuXHQvLy9cblx0Ly8vLy8gKiAqICogKiAgKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXHQvLy8vLy8gKiAqICogKiAqICogUFJJVkFURSBNRVRIT0RTICogKiAqICogKiAqXG5cdC8vLy8vICogKiAqICogICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblx0Ly8vXG5cdC8vXG5cblx0cHJpdmF0ZSBkZWJ1Z0Vycm9yKGNvbnRleHQ6IHN0cmluZywgZXJyb3I6IHVua25vd24pOiB2b2lkIHtcblx0XHRpZiAodGhpcy5tb2RlLmVycm9yTG9ncykge1xuXHRcdFx0Y29uc3QgZXJyb3JNc2cgPVxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XG5cblx0XHRcdHRoaXMubG9nKGBFcnJvciBpbiAke2NvbnRleHR9OiAke2Vycm9yTXNnfWAsICdlcnJvcicpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZm9ybWF0TG9nTWVzc2FnZShhY3Rpb246IHN0cmluZywgZGV0YWlsczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pIHtcblx0XHRyZXR1cm4gYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dIEFjdGlvbjogJHthY3Rpb259LCBEZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbHMpfWA7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGdldERCKCk6IFByb21pc2U8UGFsZXR0ZURCPiB7XG5cdFx0cmV0dXJuIHRoaXMuZGJQcm9taXNlO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0S2V5KGtleToga2V5b2YgdHlwZW9mIHRoaXMuREVGQVVMVF9LRVlTKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5ERUZBVUxUX0tFWVNba2V5XTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0U3RvcmVOYW1lKHN0b3JlS2V5OiBrZXlvZiB0eXBlb2YgdGhpcy5TVE9SRV9OQU1FUyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuU1RPUkVfTkFNRVNbc3RvcmVLZXldO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBnZXRUYWJsZShpZDogc3RyaW5nKTogUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZGIuZ2V0KHRoaXMuU1RPUkVfTkFNRVMuVEFCTEVTLCBpZCk7XG5cblx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdGlmICh0aGlzLm1vZGUud2FybkxvZ3MpXG5cdFx0XHRcdFx0dGhpcy5sb2coYFRhYmxlIHdpdGggSUQgJHtpZH0gbm90IGZvdW5kLmAsICd3YXJuJyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sICdJREJNYW5hZ2VyLmdldFRhYmxlKCk6IEVycm9yIGZldGNoaW5nIHRhYmxlJyk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGhhbmRsZUFzeW5jPFQ+KFxuXHRcdGFjdGlvbjogKCkgPT4gUHJvbWlzZTxUPixcblx0XHRlcnJvck1lc3NhZ2U6IHN0cmluZyxcblx0XHRjb250ZXh0PzogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cblx0KTogUHJvbWlzZTxUIHwgbnVsbD4ge1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgYWN0aW9uKCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLm1vZGUuZXJyb3JMb2dzKSB7XG5cdFx0XHRcdGNvbnN0IGRldGFpbHMgPSBjb250ZXh0ID8gSlNPTi5zdHJpbmdpZnkoY29udGV4dCkgOiAnJztcblx0XHRcdFx0dGhpcy5kZWJ1Z0Vycm9yKFxuXHRcdFx0XHRcdGBFcnJvcjogJHtlcnJvck1lc3NhZ2V9XFxuRGV0YWlsczogJHtkZXRhaWxzfVxcbiR7ZXJyb3J9YCxcblx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgbG9nKFxuXHRcdG1lc3NhZ2U6IHN0cmluZyxcblx0XHRsZXZlbDogJ2luZm8nIHwgJ3dhcm4nIHwgJ2Vycm9yJyA9ICdpbmZvJ1xuXHQpOiB2b2lkIHtcblx0XHRpZiAoKGxldmVsID09PSAnaW5mbycgJiYgdGhpcy5tb2RlLnF1aWV0KSB8fCAhdGhpcy5tb2RlW2Ake2xldmVsfUxvZ3NgXSlcblx0XHRcdHJldHVybjtcblxuXHRcdGNvbnN0IGZvcm1hdHRlZE1lc3NhZ2UgPSB0aGlzLmZvcm1hdExvZ01lc3NhZ2UobGV2ZWwudG9VcHBlckNhc2UoKSwge1xuXHRcdFx0bWVzc2FnZVxuXHRcdH0pO1xuXG5cdFx0Y29uc29sZVtsZXZlbF0oZm9ybWF0dGVkTWVzc2FnZSk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGxvZ011dGF0aW9uKGxvZzogTXV0YXRpb25Mb2cpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERCKCk7XG5cblx0XHRcdGF3YWl0IGRiLnB1dCgnbXV0YXRpb25zJywgbG9nKTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdHRoaXMubG9nKGBMb2dnZWQgbXV0YXRpb246ICR7SlNPTi5zdHJpbmdpZnkobG9nKX1gKTtcblx0XHR9LCAnSURCTWFuYWdlci5sb2dNdXRhdGlvbigpOiBFcnJvciBsb2dnaW5nIG11dGF0aW9uJyk7XG5cdH1cblxuXHRwcml2YXRlIHJlc29sdmVLZXk8SyBleHRlbmRzIGtleW9mIHR5cGVvZiB0aGlzLkRFRkFVTFRfS0VZUz4oXG5cdFx0a2V5OiBLXG5cdCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuREVGQVVMVF9LRVlTW2tleV07XG5cdH1cblxuXHRwcml2YXRlIHJlc29sdmVTdG9yZU5hbWU8UyBleHRlbmRzIGtleW9mIHR5cGVvZiB0aGlzLlNUT1JFX05BTUVTPihcblx0XHRzdG9yZTogU1xuXHQpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLlNUT1JFX05BTUVTW3N0b3JlXTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgdXBkYXRlQ3VycmVudFBhbGV0dGVJRChuZXdJRDogbnVtYmVyKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdHJldHVybiB0aGlzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5nZXREQigpO1xuXHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbignc2V0dGluZ3MnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdzZXR0aW5ncycpO1xuXG5cdFx0XHRpZiAodGhpcy5tb2RlLmRlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhgVXBkYXRpbmcgY3VyZW50IHBhbGV0dGUgSUQgdG8gJHtuZXdJRH1gKTtcblxuXHRcdFx0YXdhaXQgc3RvcmUucHV0KHsga2V5OiAnYXBwU2V0dGluZ3MnLCBsYXN0UGFsZXR0ZUlEOiBuZXdJRCB9KTtcblx0XHRcdGF3YWl0IHR4LmRvbmU7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHR0aGlzLmxvZyhgQ3VycmVudCBwYWxldHRlIElEIHVwZGF0ZWQgdG8gJHtuZXdJRH1gKTtcblx0XHR9LCAnSURCTWFuYWdlci51cGRhdGVDdXJyZW50UGFsZXR0ZUlEKCk6IEVycm9yIHVwZGF0aW5nIGN1cnJlbnQgcGFsZXR0ZSBJRCcpO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyB3aXRoU3RvcmU8XG5cdFx0U3RvcmVOYW1lIGV4dGVuZHMga2V5b2YgUGFsZXR0ZVNjaGVtYSxcblx0XHRNb2RlIGV4dGVuZHMgJ3JlYWRvbmx5JyB8ICdyZWFkd3JpdGUnXG5cdD4oXG5cdFx0c3RvcmVOYW1lOiBTdG9yZU5hbWUsXG5cdFx0bW9kZTogTW9kZSxcblx0XHRjYWxsYmFjazogKFxuXHRcdFx0c3RvcmU6IElEQlBPYmplY3RTdG9yZTxQYWxldHRlU2NoZW1hLCBbU3RvcmVOYW1lXSwgU3RvcmVOYW1lLCBNb2RlPlxuXHRcdCkgPT4gUHJvbWlzZTx2b2lkPlxuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0REIoKTtcblx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgbW9kZSk7XG5cdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuXG5cdFx0aWYgKCFzdG9yZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTdG9yZSBcIiR7c3RvcmVOYW1lfVwiIG5vdCBmb3VuZGApO1xuXHRcdH1cblxuXHRcdGF3YWl0IGNhbGxiYWNrKHN0b3JlKTtcblx0XHRhd2FpdCB0eC5kb25lO1xuXHR9XG59XG4iXX0=