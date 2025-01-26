// File: src/db/IDBManager.js

import { IDBPDatabase, IDBPObjectStore } from 'idb';
import {
	CommonFunctionsMasterInterface,
	ConfigDataInterface,
	HSL,
	IDBManagerInterface,
	ModeDataInterface,
	MutationLog,
	Palette,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings,
	StoredPalette
} from '../types/index.js';
import { config, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';
import { initializeDB } from './initialize.js';
import { MutationTracker } from './mutations/index.js';
import { storeUtils } from './storeUtils.js';
import { utils } from '../common/index.js';

const logger = await createLogger();

export class IDBManager implements IDBManagerInterface {
	private static instance: IDBManager | null = null;

	private dbPromise: Promise<IDBPDatabase<PaletteSchema>>;

	private dbData: ConfigDataInterface['db'] = config.db;
	private mode: ModeDataInterface = mode;
	private logMode: ModeDataInterface['logging'] = mode.logging;

	private storeUtils;

	private cache: Partial<{
		settings: Settings;
		customColor: HSL;
	}> = {};

	private defaultKeys: ConfigDataInterface['db']['DEFAULT_KEYS'] =
		config.db.DEFAULT_KEYS;
	private defaultSettings: ConfigDataInterface['db']['DEFAULT_SETTINGS'] =
		config.db.DEFAULT_SETTINGS;
	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	private errorUtils: CommonFunctionsMasterInterface['utils']['errors'];

	private mutationTracker: MutationTracker;

	private constructor() {
		this.dbPromise = initializeDB();

		this.dbData = this.dbData;

		this.defaultKeys = config.db.DEFAULT_KEYS;
		this.defaultSettings = config.db.DEFAULT_SETTINGS;
		this.storeNames = config.db.STORE_NAMES;

		this.storeUtils = storeUtils;
		this.errorUtils = utils.errors;

		this.mutationTracker = MutationTracker.getInstance(
			this.dbData,
			this.mode
		);
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

			await this.instance.initializeDB();
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

					if (self.logMode.info)
						logger.info(
							`Mutation detected: ${JSON.stringify(mutationLog)}`,
							'IDBManager.createMutationLogger()'
						);

					self.mutationTracker
						.persistMutation(mutationLog)
						.catch(err => {
							if (self.logMode.error)
								logger.error(
									`Failed to persist mutation: ${err.message}`,
									'IDBManager.createMutationLogger()'
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
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Palette {
		return utils.palette.createObject(
			type,
			items,
			swatches,
			paletteID,
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
		return this.errorUtils.handleAsync(async () => {
			if (!(await this.ensureEntryExists(storeName, key))) {
				if (this.logMode.warn) {
					logger.warn(
						`Entry with key ${key} not found.`,
						'IDBManager.deleteEntry()'
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
					'IDBManager.deleteEntry()'
				);
			}
		}, 'IDBManager.deleteData(): Error deleting entry');
	}

	public async deleteEntries(
		storeName: keyof PaletteSchema,
		keys: string[]
	): Promise<void | null> {
		return this.errorUtils.handleAsync(async () => {
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
					'IDBManager.deleteEntries()'
				);
			}
		}, 'IDBManager.deleteEntries(): Error deleting entries');
	}

	public async getCurrentPaletteID(): Promise<number> {
		return this.errorUtils.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.storeNames['SETTINGS'],
				this.getDefaultKey('APP_SETTINGS')
			);

			if (this.mode.debug)
				logger.info(
					`Fetched settings from IndexedDB: ${settings}`,
					'IDBManager.getCurrentPaletteID()'
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

		return this.errorUtils.handleAsync(async () => {
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

	public async getNextTableID(): Promise<string | null> {
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

	public async getNextPaletteID(): Promise<number | null> {
		return this.errorUtils.handleAsync(async () => {
			const currentID = await this.getCurrentPaletteID();
			const newID = currentID + 1;

			await this.updateCurrentPaletteID(newID);

			return newID;
		}, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
	}

	public async getSettings(): Promise<Settings> {
		return this.errorUtils.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.storeNames['SETTINGS'],
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

	public async resetDatabase(): Promise<void | null> {
		return this.errorUtils.handleAsync(async () => {
			const db = await this.getDB();
			const availableStores = Array.from(db.objectStoreNames);
			const expectedStores = Object.values(this.storeNames);

			for (const storeName of expectedStores) {
				if (!availableStores.includes(storeName)) {
					logger.warn(
						`Object store "${storeName}" not found in IndexedDB.`,
						'IDBManager.resetDatabase()'
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
						'IDBManager.resetDatabase()'
					);
			}
		}, 'IDBManager.resetDatabase(): Error resetting database');
	}

	public async deleteDatabase(): Promise<void> {
		await this.errorUtils.handleAsync(async () => {
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
							'IDBManager.deleteDatabase()'
						);
				};
				deleteRequest.onerror = event => {
					logger.error(
						`Error deleting database "${dbName}":\nEvent: ${event}`,
						'IDBManager.deleteDatabase()'
					);
				};
				deleteRequest.onblocked = () => {
					if (this.logMode.warn)
						logger.warn(
							`Delete operation blocked. Ensure no open connections to "${dbName}".`,
							'IDBManager.deleteDatabase()'
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
						'IDBManager.deleteDatabase()'
					);
			}
		}, 'IDBManager.deleteDatabase(): Error deleting database');
	}

	// *DEV-NOTE* add this method to docs
	public async resetPaletteID(): Promise<void | null> {
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
				logger.info(
					`Palette ID has successfully been reset to 0`,
					'IDBManager.resetPaletteID()'
				);
		}, 'IDBManager.resetPaletteID(): Error resetting palette ID');
	}

	public async saveData<T>(
		storeName: keyof PaletteSchema,
		key: string,
		data: T,
		oldValue?: T
	): Promise<void | null> {
		return this.errorUtils.handleAsync(async () => {
			const db = await this.getDB();

			await this.storeUtils.withStore(
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
								mutationLog,
								'IDBManager.saveData()'
							);
						}
					);
				}
			);
		}, 'IDBManager.saveData(): Error saving data');
	}

	public async savePalette(
		id: string,
		newPalette: StoredPalette
	): Promise<void | null> {
		return this.errorUtils.handleAsync(async () => {
			const store = await this.getStore('tables', 'readwrite');
			const paletteToSave: StoredPalette = {
				tableID: newPalette.tableID,
				palette: newPalette.palette
			};

			await store.put({ key: id, ...paletteToSave });

			if (!this.mode.quiet)
				logger.info(
					`Palette ${id} saved successfully.`,
					'IDBManager.savePalette()'
				);
		}, 'IDBManager.savePalette(): Error saving palette');
	}

	public async savePaletteToDB(
		type: string,
		items: PaletteItem[],
		paletteID: number,
		numBoxes: number,
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<Palette | null> {
		return this.errorUtils.handleAsync(async () => {
			const newPalette = this.createPaletteObject(
				type,
				items,
				paletteID,
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
		return this.errorUtils.handleAsync(async () => {
			await this.saveData('settings', 'appSettings', newSettings);

			if (!this.mode.quiet && this.logMode.info)
				logger.info('Settings updated', 'IDBManager.saveSettings()');
		}, 'IDBManager.saveSettings(): Error saving settings');
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void | null> {
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
					throw new Error(
						`Entry ${entryIndex} not found in palette ${tableID}.`
					);
				if (this.logMode.error)
					logger.error(
						`Entry ${entryIndex} not found in palette ${tableID}.`,
						'IDBManager.updateEntryInPalette()'
					);
				if (!this.mode.quiet && this.logMode.info)
					logger.warn('updateEntryInPalette: Entry not found.');
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
					)
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

	private async initializeDB(): Promise<void> {
		await this.dbPromise;

		const db = await this.getDB();
		const storeName = this.storeNames['SETTINGS'];
		const key = this.getDefaultKey('APP_SETTINGS');

		logger.info(
			`Initializing DB with Store Name: ${storeName}, Key: ${key}`,
			'IDBManager > (private async) initializeDB()'
		);

		if (!storeName || !key) throw new Error('Invalid store name or key.');

		const settings = await db.get(storeName, key);

		if (!settings) {
			if (!this.mode.quiet) {
				logger.info(
					`Initializing default settings...`,
					'IDBManager > (private async) initializeDB()'
				);
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
		return this.errorUtils.handleAsync(async () => {
			const db = await this.getDB();
			const result = await db.get(this.storeNames.TABLES, id);

			if (!result) {
				if (this.logMode.warn)
					logger.warn(
						`Table with ID ${id} not found.`,
						'IDBManager > (private async) getTable()'
					);
			}
			return result;
		}, 'IDBManager.getTable(): Error fetching table');
	}

	private async updateCurrentPaletteID(newID: number): Promise<void | null> {
		return this.errorUtils.handleAsync(async () => {
			const db = await this.getDB();
			const tx = db.transaction('settings', 'readwrite');
			const store = tx.objectStore('settings');

			if (this.mode.debug)
				logger.info(
					`Updating curent palette ID to ${newID}`,
					'IDBManager > (private async) updateCurrentPaletteID()'
				);

			await store.put({ key: 'appSettings', lastPaletteID: newID });
			await tx.done;

			if (!this.mode.quiet)
				logger.info(
					`Current palette ID updated to ${newID}`,
					'IDBManager > (private async) updateCurrentPaletteID()'
				);
		}, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
	}
}
