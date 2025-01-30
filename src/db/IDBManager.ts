// File: db/IDBManager.js

import { IDBPDatabase, IDBPObjectStore } from 'idb';
import {
	CommonFn_MasterInterface,
	ConfigDataInterface,
	HSL,
	ModeDataInterface,
	MutationLog,
	Palette,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings,
	StoredPalette
} from '../types/index.js';
import { configData as config } from '../data/config.js';
import { commonFn } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { initializeDB } from './initialize.js';
import { dbUtils } from './utils.js';
import { modeData as mode } from '../data/mode.js';

const thisModule = 'db/IDBManager.js';

const logger = await createLogger();

export class IDBManager {
	private static instance: IDBManager | null = null;

	private dbPromise: Promise<IDBPDatabase<PaletteSchema>>;

	private dbData: ConfigDataInterface['db'] = config.db;
	private mode: ModeDataInterface = mode;
	private logMode: ModeDataInterface['logging'] = mode.logging;

	private cache: Partial<{
		settings: Settings;
		customColor: HSL;
	}> = {};

	defaultKeys: ConfigDataInterface['db']['DEFAULT_KEYS'] =
		config.db.DEFAULT_KEYS;
	private defaultSettings: ConfigDataInterface['db']['DEFAULT_SETTINGS'] =
		config.db.DEFAULT_SETTINGS;
	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	private utils: CommonFn_MasterInterface['utils'];
	private dbUtils: typeof dbUtils;

	private constructor() {
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

	public static async getInstance(): Promise<IDBManager> {
		if (!this.instance) {
			this.instance = new IDBManager();

			await this.instance.dbPromise;
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
		const thisMethod = 'createMutationLogger()';
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

					if (self.logMode.info)
						logger.info(
							`Mutation detected: ${JSON.stringify(mutationLog)}`,
							`${thisModule} > ${thisMethod}`
						);

					self.persistMutation(mutationLog).catch(err => {
						if (self.logMode.error)
							logger.error(
								`Failed to persist mutation: ${err.message}`,
								`${thisModule} > ${thisMethod}`
							);
					});
				}

				return success;
			}
		});
	}

	private createPaletteObject(
		type: string,
		items: PaletteItem[],
		paletteID: number,
		swatches: number,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Palette {
		return this.utils.palette.createObject(
			type,
			items,
			swatches,
			paletteID,
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
		const thisMethod = 'deleteEntry()';

		return this.utils.errors.handleAsync(async () => {
			if (!(await this.ensureEntryExists(storeName, key))) {
				if (this.logMode.warn) {
					logger.warn(
						`Entry with key ${key} not found.`,
						`${thisModule} > ${thisMethod}`
					);
				}

				return;
			}

			const db = await this.getDB();
			const store = db
				.transaction(storeName, 'readwrite')
				.objectStore(storeName);

			await store.delete(key);

			if (!this.mode.quiet) {
				logger.info(
					`Entry with key ${key} deleted successfully.`,
					`${thisModule} > ${thisMethod}`
				);
			}
		}, 'IDBManager.deleteData(): Error deleting entry');
	}

	public async deleteEntries(
		storeName: keyof PaletteSchema,
		keys: string[]
	): Promise<void | null> {
		const thisMethod = 'deleteEntries()';

		return this.utils.errors.handleAsync(async () => {
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
				logger.info(
					`Entries deleted successfully. Keys: ${validKeys}`,
					`${thisModule} > ${thisMethod}`
				);
			}
		}, 'IDBManager.deleteEntries(): Error deleting entries');
	}

	public async getCurrentPaletteID(): Promise<number> {
		const thisMethod = 'getCurrentPaletteID()';

		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.storeNames['SETTINGS'],
				this.getDefaultKey('APP_SETTINGS')
			);

			if (this.mode.debug)
				logger.info(
					`Fetched settings from IndexedDB: ${settings}`,
					`${thisModule} > ${thisMethod}`
				);

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
		const key = this.defaultKeys['CUSTOM_COLOR'];
		const storeName = this.storeNames['CUSTOM_COLOR'];

		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();
			const entry = await db.get(storeName, key);

			if (!entry?.color) return null;

			this.cache.customColor = entry.color;

			return this.createMutationLogger(entry.color, storeName);
		}, 'IDBManager.getCustomColor(): Error fetching custom color');
	}

	public async getDB(): Promise<PaletteDB> {
		return this.dbPromise;
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

	public async getNextPaletteID(): Promise<number | null> {
		return this.utils.errors.handleAsync(async () => {
			const currentID = await this.getCurrentPaletteID();
			const newID = currentID + 1;

			await this.updateCurrentPaletteID(newID);

			return newID;
		}, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
	}

	public async getMutations(): Promise<MutationLog[]> {
		const store = await this.getStore('settings', 'readonly');
		const entries = await store.getAll();

		return entries.filter(entry => entry.key.startsWith('mutation_'));
	}

	public async getNextTableID(): Promise<string | null> {
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

	public async getPaletteHistory(): Promise<Palette[]> {
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
		} catch (error) {
			logger.error(
				`Error retrieving palette history: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

			return [];
		}
	}

	public async getSettings(): Promise<Settings> {
		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.storeNames['SETTINGS'],
				this.getDefaultKey('APP_SETTINGS')
			);

			return settings ?? this.defaultSettings;
		}, 'IDBManager.getSettings(): Error fetching settings');
	}

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

	public async persistMutation(data: MutationLog): Promise<void> {
		const caller = 'persistMutation()';
		const db = await this.getDB();

		await db.put('mutations', data);

		logger.info(
			`Persisted mutation: ${JSON.stringify(data)}`,
			`${thisModule} > ${caller}`
		);
	}

	public async resetDatabase(): Promise<void | null> {
		const thisMethod = 'resetDatabase()';

		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();
			const availableStores = Array.from(db.objectStoreNames);
			const expectedStores = Object.values(this.storeNames);

			for (const storeName of expectedStores) {
				if (!availableStores.includes(storeName)) {
					logger.warn(
						`Object store "${storeName}" not found in IndexedDB.`,
						`${thisModule} > ${thisMethod}`
					);
					continue;
				}

				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);

				await store.clear();
				await tx.done;

				const settingsStore = db
					.transaction(this.storeNames['SETTINGS'], 'readwrite')
					.objectStore(this.storeNames['SETTINGS']);
				await settingsStore.put(
					this.defaultSettings,
					this.getDefaultKey('APP_SETTINGS')
				);

				if (!this.mode.quiet)
					logger.info(
						`IndexedDB has been reset to default settings.`,
						`${thisModule} > ${thisMethod}`
					);
			}
		}, 'IDBManager.resetDatabase(): Error resetting database');
	}

	public async deleteDatabase(): Promise<void> {
		const thisMethod = 'deleteDatabase()';

		await this.utils.errors.handleAsync(async () => {
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
						logger.info(
							`Database "${dbName}" deleted successfully.`,
							`${thisModule} > ${thisMethod}`
						);
				};
				deleteRequest.onerror = event => {
					logger.error(
						`Error deleting database "${dbName}":\nEvent: ${event}`,
						`${thisModule} > ${thisMethod}`
					);
				};
				deleteRequest.onblocked = () => {
					if (this.logMode.warn)
						logger.warn(
							`Delete operation blocked. Ensure no open connections to "${dbName}".`,
							`${thisModule} > ${thisMethod}`
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
					logger.warn(
						`Database "${dbName}" does not exist.`,
						`${thisModule} > ${thisMethod}`
					);
			}
		}, 'IDBManager.deleteDatabase(): Error deleting database');
	}

	// *DEV-NOTE* add this method to docs
	public async resetPaletteID(): Promise<void | null> {
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
				logger.info(
					`Palette ID has successfully been reset to 0`,
					`${thisModule} > ${thisMethod}`
				);
		}, 'IDBManager.resetPaletteID(): Error resetting palette ID');
	}

	public async saveData<T>(
		storeName: keyof PaletteSchema,
		key: string,
		data: T,
		oldValue?: T
	): Promise<void | null> {
		const thisMethod = 'saveData()';

		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();

			await this.dbUtils.store.withStore(
				db,
				storeName,
				'readwrite',
				async store => {
					await store.put({ key, ...data });

					logger.mutation(
						{
							timestamp: new Date().toISOString(),
							key,
							action: 'update',
							newValue: data,
							oldValue: oldValue || null,
							origin: 'saveData'
						},
						mutationLog => {
							console.log(
								'Mutation log triggered for saveData:',
								mutationLog
							);
						},
						`${thisModule} > ${thisMethod}`
					);
				}
			);
		}, 'IDBManager.saveData(): Error saving data');
	}

	public async savePaletteToDB(
		type: string,
		items: PaletteItem[],
		paletteID: number,
		numBoxes: number,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<Palette | null> {
		return this.utils.errors.handleAsync(async () => {
			const newPalette = this.createPaletteObject(
				type,
				items,
				paletteID,
				numBoxes,
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

	public async savePalette(
		id: string,
		newPalette: StoredPalette
	): Promise<void | null> {
		const thisMethod = 'savePalette()';

		return this.utils.errors.handleAsync(async () => {
			const store = await this.getStore('tables', 'readwrite');
			const paletteToSave: StoredPalette = {
				tableID: newPalette.tableID,
				palette: newPalette.palette
			};

			await store.put({ key: id, ...paletteToSave });

			if (!this.mode.quiet && this.logMode.info)
				logger.info(
					`Palette ${id} saved successfully.`,
					`${thisModule} > ${thisMethod}`
				);
		}, 'IDBManager.savePalette(): Error saving palette');
	}

	public async savePaletteHistory(paletteHistory: Palette[]): Promise<void> {
		const db = await this.getDB();
		const tx = db.transaction('settings', 'readwrite');
		const store = tx.objectStore('settings');

		await store.put({ key: 'paletteHistory', palettes: paletteHistory });
		await tx.done;
	}

	public async saveSettings(newSettings: Settings): Promise<void | null> {
		const thisMethod = 'saveSettings()';

		return this.utils.errors.handleAsync(async () => {
			await this.saveData('settings', 'appSettings', newSettings);

			if (!this.mode.quiet && this.logMode.info)
				logger.info(
					'Settings updated',
					`${thisModule} > ${thisMethod}`
				);
		}, 'IDBManager.saveSettings(): Error saving settings');
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void | null> {
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
					throw new Error(
						`Entry ${entryIndex} not found in palette ${tableID}.`
					);
				if (this.logMode.error)
					logger.error(
						`Entry ${entryIndex} not found in palette ${tableID}.`,
						`${thisModule} > ${thisMethod}`
					);
				if (!this.mode.quiet && this.logMode.info)
					logger.warn(
						'updateEntryInPalette: Entry not found.',
						`${thisModule} > ${thisMethod}`
					);
			}

			const oldEntry = items[entryIndex];

			items[entryIndex] = newEntry;

			await this.saveData('tables', tableID, storedPalette);

			logger.mutation(
				{
					timestamp: new Date().toISOString(),
					key: `${tableID}-${entryIndex}]`,
					action: 'update',
					newValue: newEntry,
					oldValue: oldEntry,
					origin: 'updateEntryInPalette'
				},
				mutationLog =>
					console.log(
						`Mutation log trigger for updateEntryInPalette:`,
						mutationLog
					),
				`${thisModule} > ${thisMethod}`
			);

			if (!this.mode.quiet && this.logMode.info)
				logger.info(
					`Entry ${entryIndex} in palette ${tableID} updated.`
				);
		}, 'IDBManager.updateEntryInPalette(): Error updating entry in palette');
	}

	//
	///
	///// * * * *  * * * * * * * * * * * * * * * *
	////// * * * * * * PRIVATE METHODS * * * * * *
	///// * * * *  * * * * * * * * * * * * * * * *
	///
	//

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

	private getDefaultKey(
		key: keyof ConfigDataInterface['db']['STORE_NAMES']
	): string {
		const defaultKey =
			this.defaultKeys[
				key as keyof ConfigDataInterface['db']['DEFAULT_KEYS']
			];

		if (!defaultKey) {
			throw new Error(`[getDefaultKey()]: Invalid default key: ${key}`);
		}

		return defaultKey;
	}

	private async getTable(id: string): Promise<StoredPalette | null> {
		const thisMethod = 'getTable()';

		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();
			const result = await db.get(this.storeNames.TABLES, id);

			if (!result) {
				if (this.logMode.warn)
					logger.warn(
						`Table with ID ${id} not found.`,
						`${thisModule} > ${thisMethod}`
					);
			}
			return result;
		}, 'IDBManager.getTable(): Error fetching table');
	}

	private async updateCurrentPaletteID(newID: number): Promise<void | null> {
		const thisMethod = 'updateCurrentPaletteID()';

		return this.utils.errors.handleAsync(async () => {
			const db = await this.getDB();
			const tx = db.transaction('settings', 'readwrite');
			const store = tx.objectStore('settings');

			if (this.mode.debug)
				logger.info(
					`Updating curent palette ID to ${newID}`,
					`${thisModule} > ${thisMethod}`
				);

			await store.put({ key: 'appSettings', lastPaletteID: newID });
			await tx.done;

			if (!this.mode.quiet)
				logger.info(
					`Current palette ID updated to ${newID}`,
					`${thisModule} > ${thisMethod}`
				);
		}, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
	}
}
