// File: src/classes/idb/IDBManager.js

import { IDBPDatabase, IDBPObjectStore, openDB } from 'idb';
import {
	DataInterface,
	HSL,
	IDBManagerInterface,
	ModeData,
	MutationLog,
	Palette,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings,
	StoredPalette
} from '../../index/index.js';
import { log } from '../logger/index.js';
import { MutationTracker } from '../mutations/index.js';
import { utils } from '../../common/index.js';

export class IDBManager implements IDBManagerInterface {
	private static instance: IDBManager | null = null;
	private cache: Partial<{
		settings: Settings;
		customColor: HSL;
	}> = {};
	private data: DataInterface;
	private dbPromise: Promise<IDBPDatabase<PaletteSchema>>;
	private defaultKeys;
	private defaultSettings: Settings;
	private loggingMode: ModeData['logging'];
	private mode: ModeData;
	private mutationTracker: MutationTracker;
	private storeNames;

	private constructor(data: DataInterface) {
		this.dbPromise = openDB<PaletteSchema>('paletteDB', 1, {
			upgrade: db => {
				const storeNames = Object.values(this.storeNames);

				for (const storeName of storeNames) {
					if (!db.objectStoreNames.contains(storeName)) {
						db.createObjectStore(storeName, { keyPath: 'key' });
					}
				}
			}
		});
		this.data = data;
		this.defaultSettings = this.data.defaults.idb.settings;
		this.loggingMode = this.data.mode.logging;
		this.mode = this.data.mode;
		this.mutationTracker = MutationTracker.getInstance(data);
		this.defaultKeys = this.data.idb.DEFAULT_KEYS;
		this.storeNames = this.data.idb.STORE_NAMES;
	}

	//
	///
	//// * * * * * * * * * * * * * * * * * * * * * *
	///// * * * * * * STATIC METHODS * * * * * * *
	//// * * * * * * * * * * * * * * * * * * * * * *
	///
	//

	public static async createInstance(
		data: DataInterface
	): Promise<IDBManager> {
		if (!this.instance) {
			this.instance = new IDBManager(data);
			await this.instance.initializeDB();
		}

		return this.instance;
	}

	static getInstance(): IDBManager {
		if (!this.instance) {
			throw new Error(
				'IDBManager instance has not been initialized. Call createInstance first.'
			);
		}
		return this.instance;
	}

	public static resetInstance(): void {
		this.instance = null;
	}

	//
	///
	//// * * * * * * * * * * * * * * * * * * * * * *
	///// * * * * * * * PUBLIC METHODS * * * * * * *
	//// * * * * * * * * * * * * * * * * * * * * * *
	///
	//

	public createMutationLogger<T extends object>(obj: T, key: string): T {
		const self = this;

		return new Proxy(obj, {
			set(target, property, value) {
				const oldValue = target[property as keyof T];
				const success = Reflect.set(target, property, value);

				if (success) {
					const mutationLog: MutationLog = {
						timestamp: new Date().toISOString(),
						key,
						action: 'update',
						newValue: { [property]: value },
						oldValue: { [property]: oldValue },
						origin: 'Proxy'
					};

					if (self.loggingMode.info)
						log.info(
							`Mutation detected: ${JSON.stringify(mutationLog)}`
						);

					self.mutationTracker
						.persistMutation(mutationLog)
						.catch(err => {
							if (self.loggingMode.errors)
								log.error(
									`Failed to persist mutation: ${err.message}`
								);
						});
				}

				return success;
			}
		});
	}

	private createPaletteTable(palette: StoredPalette): HTMLElement {
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

		return fragment as unknown as HTMLElement;
	}

	private createPaletteObject(
		type: string,
		items: PaletteItem[],
		baseColor: HSL,
		numBoxes: number,
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Palette {
		return utils.palette.createObject(
			type,
			items,
			baseColor,
			Date.now(),
			numBoxes,
			enableAlpha,
			limitDark,
			limitGray,
			limitLight
		);
	}

	// *DEV-NOTE* add this method to docs
	public async deleteEntry(
		storeName: keyof PaletteSchema,
		key: string
	): Promise<void | null> {
		return this.handleAsync(async () => {
			if (!(await this.ensureEntryExists(storeName, key))) {
				if (this.loggingMode.warnings) {
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

	public async deleteEntries(
		storeName: keyof PaletteSchema,
		keys: string[]
	): Promise<void | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const store = db
				.transaction(storeName, 'readwrite')
				.objectStore(storeName);
			const validKeys = (
				await Promise.all(
					keys.map(async key =>
						(await this.ensureEntryExists(storeName, key))
							? key
							: null
					)
				)
			).filter((key): key is string => key !== null);

			await Promise.all(validKeys.map(key => store.delete(key)));

			if (!this.mode.quiet) {
				log.info(`Entries deleted successfully. Keys: ${validKeys}`);
			}
		}, 'IDBManager.deleteEntries(): Error deleting entries');
	}

	public async getCurrentPaletteID(): Promise<number> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.getStoreName('SETTINGS'),
				this.getDefaultKey('APP_SETTINGS')
			);

			if (this.mode.debug)
				log.info(`Fetched settings from IndexedDB: ${settings}`);

			return settings?.lastPaletteID ?? 0;
		}, 'IDBManager: getCurrentPaletteID(): Error fetching current palette ID');
	}

	public async getCachedSettings(): Promise<Settings> {
		if (this.cache.settings) return this.cache.settings;

		const settings = await this.getSettings();
		if (settings) this.cache.settings = settings;
		return settings;
	}

	public async getCustomColor(): Promise<HSL | null> {
		const key = this.resolveKey('CUSTOM_COLOR');
		const storeName = this.resolveStoreName('CUSTOM_COLOR');

		return this.handleAsync(async () => {
			const db = await this.getDB();
			const entry = await db.get(storeName, key);

			if (!entry?.color) return null;

			this.cache.customColor = entry.color;
			return this.createMutationLogger(entry.color, storeName);
		}, 'IDBManager.getCustomColor(): Error fetching custom color');
	}

	public getLoggedObject<T extends object>(
		obj: T | null,
		key: string
	): T | null {
		if (obj) {
			return this.createMutationLogger(obj, key);
		}

		return null;
	}

	public async getNextTableID(): Promise<string | null> {
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

	public async getNextPaletteID(): Promise<number | null> {
		return this.handleAsync(async () => {
			const currentID = await this.getCurrentPaletteID();
			const newID = currentID + 1;

			await this.updateCurrentPaletteID(newID);

			return newID;
		}, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
	}

	public async getSettings(): Promise<Settings> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.getStoreName('SETTINGS'),
				this.getDefaultKey('APP_SETTINGS')
			);

			return settings ?? this.defaultSettings;
		}, 'IDBManager.getSettings(): Error fetching settings');
	}

	// **DEV-NOTE** FIGURE OUT HOW TO IMPLEMENT handleAsync HERE
	public async getStore<StoreName extends keyof PaletteSchema>(
		storeName: StoreName,
		mode: 'readonly'
	): Promise<
		IDBPObjectStore<PaletteSchema, [StoreName], StoreName, 'readonly'>
	>;

	public async getStore<StoreName extends keyof PaletteSchema>(
		storeName: StoreName,
		mode: 'readwrite'
	): Promise<
		IDBPObjectStore<PaletteSchema, [StoreName], StoreName, 'readwrite'>
	>;

	public async getStore<StoreName extends keyof PaletteSchema>(
		storeName: StoreName,
		mode: 'readonly' | 'readwrite'
	) {
		const db = await this.getDB();

		return db.transaction(storeName, mode).objectStore(storeName);
	}

	public async renderPalette(tableId: string): Promise<void | null> {
		return this.handleAsync(async () => {
			const storedPalette = await this.getTable(tableId);
			const paletteRow = document.getElementById('palette-row');

			if (!storedPalette)
				throw new Error(`Palette ${tableId} not found.`);
			if (!paletteRow) throw new Error('Palette row element not found.');

			paletteRow.innerHTML = '';

			const tableElement = this.createPaletteTable(storedPalette);

			paletteRow.appendChild(tableElement);

			if (!this.mode.quiet) log.info(`Rendered palette ${tableId}.`);
		}, 'IDBManager.renderPalette(): Error rendering palette');
	}

	public async resetDatabase(): Promise<void | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const availableStores = Array.from(db.objectStoreNames);
			const expectedStores = Object.values(this.storeNames);

			for (const storeName of expectedStores) {
				if (!availableStores.includes(storeName)) {
					log.warn(
						`Object store "${storeName}" not found in IndexedDB.`
					);
					continue;
				}

				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);

				await store.clear();
				await tx.done;

				const settingsStore = db
					.transaction(this.getStoreName('SETTINGS'), 'readwrite')
					.objectStore(this.getStoreName('SETTINGS'));
				await settingsStore.put(
					this.defaultSettings,
					this.getDefaultKey('APP_SETTINGS')
				);

				if (!this.mode.quiet)
					log.info(`IndexedDB has been reset to default settins.`);
			}
		}, 'IDBManager.resetDatabase(): Error resetting database');
	}

	public async deleteDatabase(): Promise<void> {
		await this.handleAsync(async () => {
			const dbName = 'paletteDB';
			const dbExists = await new Promise<boolean>(resolve => {
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
					console.error(
						`Error deleting database "${dbName}":`,
						event
					);
				};
				deleteRequest.onblocked = () => {
					if (this.loggingMode.warnings)
						log.warn(
							`Delete operation blocked. Ensure no open connections to "${dbName}".`
						);

					if (this.mode.showAlerts)
						alert(
							`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`
						);

					if (this.mode.stackTrace)
						console.trace(`Blocked call stack:`);
				};
			} else {
				if (!this.mode.quiet)
					log.warn(`Database "${dbName}" does not exist.`);
			}
		}, 'IDBManager.deleteDatabase(): Error deleting database');
	}

	// *DEV-NOTE* add this method to docs
	public async resetPaletteID(): Promise<void | null> {
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

	public async saveData<T>(
		storeName: keyof PaletteSchema,
		key: string,
		data: T,
		oldValue?: T
	): Promise<void | null> {
		return this.handleAsync(async () => {
			await this.withStore(storeName, 'readwrite', async store => {
				await store.put({ key, ...data });

				log.mutation({
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

	public async savePalette(
		id: string,
		newPalette: StoredPalette
	): Promise<void | null> {
		return this.handleAsync(async () => {
			const store = await this.getStore('tables', 'readwrite');
			const paletteToSave: StoredPalette = {
				tableID: newPalette.tableID,
				palette: newPalette.palette
			};

			await store.put({ key: id, ...paletteToSave });

			if (!this.mode.quiet) log.info(`Palette ${id} saved successfully.`);
		}, 'IDBManager.savePalette(): Error saving palette');
	}

	public async savePaletteToDB(
		type: string,
		items: PaletteItem[],
		baseColor: HSL,
		numBoxes: number,
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<Palette | null> {
		return this.handleAsync(async () => {
			const newPalette = this.createPaletteObject(
				type,
				items,
				baseColor,
				numBoxes,
				enableAlpha,
				limitDark,
				limitGray,
				limitLight
			);

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

	public async saveSettings(newSettings: Settings): Promise<void | null> {
		return this.handleAsync(async () => {
			await this.saveData('settings', 'appSettings', newSettings);

			if (!this.mode.quiet && this.loggingMode.info)
				log.info('Settings updated');
		}, 'IDBManager.saveSettings(): Error saving settings');
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void | null> {
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
					throw new Error(
						`Entry ${entryIndex} not found in palette ${tableID}.`
					);
				if (this.loggingMode.errors)
					log.error(
						`Entry ${entryIndex} not found in palette ${tableID}.`
					);
				if (!this.mode.quiet && this.loggingMode.info)
					log.warn('updateEntryInPalette: Entry not found.');
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
			});

			if (!this.mode.quiet && this.loggingMode.info)
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

	private async initializeDB(): Promise<void> {
		await this.dbPromise;

		const db = await this.getDB();
		const storeName = this.getStoreName('SETTINGS');
		const key = this.getDefaultKey('APP_SETTINGS');

		log.info(`Initializing DB with Store Name: ${storeName}, Key: ${key}`);

		if (!storeName || !key) throw new Error('Invalid store name or key.');

		const settings = await db.get(storeName, key);

		if (!settings) {
			if (!this.mode.quiet) {
				log.info(`Initializing default settings...`);
			}

			await db.put(storeName, { key, ...this.defaultSettings });
		}
	}

	private async ensureEntryExists(
		storeName: keyof PaletteSchema,
		key: string
	): Promise<boolean> {
		const db = await this.getDB();
		const store = db
			.transaction(storeName, 'readonly')
			.objectStore(storeName);

		return (await store.get(key)) !== undefined;
	}

	private async getDB(): Promise<PaletteDB> {
		return this.dbPromise;
	}

	private getDefaultKey(key: keyof typeof this.storeNames): string {
		const defaultKey = this.defaultKeys[key];

		if (!defaultKey) {
			throw new Error(`[getDefaultKey()]: Invalid default key: ${key}`);
		}

		return defaultKey;
	}

	private getStoreName(storeKey: keyof typeof this.storeNames): string {
		const storeName = this.storeNames[storeKey];

		if (!storeName) {
			throw new Error(`[getStoreName()]: Invalid store key: ${storeKey}`);
		}

		return storeName;
	}

	private async getTable(id: string): Promise<StoredPalette | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const result = await db.get(this.storeNames.TABLES, id);

			if (!result) {
				if (this.loggingMode.warnings)
					log.warn(`Table with ID ${id} not found.`);
			}
			return result;
		}, 'IDBManager.getTable(): Error fetching table');
	}

	private async handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string,
		context?: Record<string, unknown>
	): Promise<T | null> {
		try {
			return await action();
		} catch (error) {
			if (this.loggingMode.errors) {
				const details = context ? JSON.stringify(context) : '';

				log.debug(
					`Error: ${errorMessage}\nDetails: ${details}\n${error}`
				);
			}

			throw error;
		}
	}

	private resolveKey<K extends keyof typeof this.defaultKeys>(
		key: K
	): string {
		return this.defaultKeys[key];
	}

	private resolveStoreName<S extends keyof typeof this.storeNames>(
		store: S
	): string {
		return this.storeNames[store];
	}

	private async updateCurrentPaletteID(newID: number): Promise<void | null> {
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

	private async withStore<
		StoreName extends keyof PaletteSchema,
		Mode extends 'readonly' | 'readwrite'
	>(
		storeName: StoreName,
		mode: Mode,
		callback: (
			store: IDBPObjectStore<PaletteSchema, [StoreName], StoreName, Mode>
		) => Promise<void>
	): Promise<void> {
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
