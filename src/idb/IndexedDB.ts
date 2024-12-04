// File: src/idb/IndexedDB.ts

import { IDBPDatabase, IDBPObjectStore, openDB } from 'idb';
import {
	HSL,
	IndexedDBInterface,
	MutationLog,
	Palette,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings,
	StoredPalette
} from '../index';
import { utils } from '../common';
import { config } from '../config';

export class IndexedDB implements IndexedDBInterface {
	private static instance: IndexedDB | null = null;

	private dbPromise: Promise<IDBPDatabase<PaletteSchema>>;
	private defaultSettings: Settings;
	private mode: Record<string, boolean>;
	private DEFAULT_KEYS: Record<string, string>;
	private STORE_NAMES: Record<string, string>;

	private constructor() {
		this.defaultSettings = config.defaults.idb.settings;
		this.mode = config.mode;
		this.DEFAULT_KEYS = config.idb.DEFAULT_KEYS;
		this.STORE_NAMES = config.idb.STORE_NAMES;

		this.dbPromise = openDB<PaletteSchema>('paletteDB', 1, {
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

	public static getInstance(): IndexedDB {
		if (!this.instance) {
			this.instance = new IndexedDB();
		}

		return this.instance;
	}

	public static resetInstance(): void {
		this.instance = null;
	}

	public createMutationLogger<T extends object>(obj: T, key: string): T {
		const logMutation = this.logMutation.bind(this);

		return new Proxy(obj, {
			set(target, property, value) {
				const oldValue = target[property as keyof T];
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

	public async getCurrentPaletteID(): Promise<number> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.STORE_NAMES.SETTINGS,
				this.DEFAULT_KEYS.APP_SETTINGS
			);

			return settings?.lastPaletteID ?? 0;
		}, 'Error fetching current palette ID');
	}

	public async getCustomColor(): Promise<HSL | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const entry = await db.get(
				this.STORE_NAMES.CUSTOM_COLOR,
				this.DEFAULT_KEYS.CUSTOM_COLOR
			);

			return entry?.color
				? this.createMutationLogger(entry.color, 'customColor')
				: null;
		}, 'Error fetching custom color');
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
			const nextID = settings.lastTableID + 1;

			await this.saveData('settings', 'appSettings', {
				...settings,
				lastTableID: nextID
			});

			return `palette_${nextID}`;
		}, 'Error fetching next table ID');
	}

	public async getNextPaletteID(): Promise<number | null> {
		return this.handleAsync(async () => {
			const currentID = await this.getCurrentPaletteID();
			const newID = currentID + 1;

			await this.updateCurrentPaletteID(newID);

			return newID;
		}, 'Error fetching next palette ID');
	}

	public async getSettings(): Promise<Settings> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const settings = await db.get(
				this.STORE_NAMES.SETTINGS,
				this.DEFAULT_KEYS.APP_SETTINGS
			);

			return settings ?? this.defaultSettings;
		}, 'Error fetching settings');
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

	public async logMutation(log: MutationLog): Promise<void | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();

			await db.put('mutations', log);

			if (!this.mode.quiet)
				this.log(`Logged mutation: ${JSON.stringify(log)}`);
		}, 'Error logging mutation');
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void | null> {
		return this.handleAsync(async () => {
			const storedPalette = await this.getTable(tableID);

			if (!storedPalette)
				throw new Error(`Palette ${tableID} not found.`);

			const { items } = storedPalette.palette;

			if (entryIndex >= items.length) {
				if (!this.mode.gracefulErrors)
					throw new Error(
						`Entry ${entryIndex} not found in palette ${tableID}.`
					);
				if (this.mode.logErrors)
					this.log(
						`Entry ${entryIndex} not found in palette ${tableID}.`,
						'error'
					);
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
		}, 'Error updating entry in palette');
	}

	public async renderPalette(tableId: string): Promise<void | null> {
		return this.handleAsync(async () => {
			const storedPalette = await this.getTable(tableId);
			const paletteRow = document.getElementById('palette-row');

			if (!storedPalette)
				throw new Error(`Palette ${tableId} not found.`);
			if (!paletteRow) throw new Error('Palette row element not found.');

			paletteRow.innerHTML = '';

			const fragment = document.createDocumentFragment();
			const table = document.createElement('table');
			table.classList.add('palette-table');

			storedPalette.palette.items.forEach((item, index) => {
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
			paletteRow.appendChild(fragment);

			if (!this.mode.quiet) console.log(`Rendered palette ${tableId}.`);
		}, 'Error rendering palette');
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
				await this.logMutation({
					timestamp: new Date().toISOString(),
					key,
					action: 'update',
					newValue: data,
					oldValue: oldValue || null,
					origin: 'saveData'
				});
			});
		}, 'Error saving data');
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

			if (!this.mode.quiet) this.log(`Palette ${id} saved successfully.`);
		}, 'Error saving palette');
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
			const paletteID = await this.getNextPaletteID();

			if (!paletteID) throw new Error('Error fetching next palette ID.');

			const newPalette = utils.palette.createObject(
				type,
				items,
				baseColor,
				paletteID,
				numBoxes,
				enableAlpha,
				limitDark,
				limitGray,
				limitLight
			);

			await this.savePalette(newPalette.id, {
				tableID: parseInt(newPalette.id.split('_')[1]),
				palette: newPalette
			});

			if (!this.mode.quiet)
				this.log(
					`Saved ${type} palette: ${JSON.stringify(newPalette)}`
				);

			return newPalette;
		}, 'Error saving palette to DB');
	}

	public async saveSettings(newSettings: Settings): Promise<void | null> {
		return this.handleAsync(async () => {
			await this.saveData('settings', 'appSettings', newSettings);

			if (!this.mode.quiet) console.log('Settings updated');
		}, 'Error saving settings');
	}

	private async getDB(): Promise<PaletteDB> {
		return this.dbPromise;
	}

	private async getTable(id: string): Promise<StoredPalette | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const result = await db.get(this.STORE_NAMES.TABLES, id);

			if (!result) {
				if (this.mode.logWarnings)
					this.log(`Table with ID ${id} not found.`, 'warn');
			}
			return result;
		}, 'Error fetching table');
	}

	private async handleAsync<T>(
		action: () => Promise<T>,
		errorMessage: string
	): Promise<T | null> {
		try {
			return await action();
		} catch (error) {
			if (this.mode.logErrors)
				this.log(
					`Error Message: ${errorMessage}\nError: ${error}`,
					'error'
				);

			return null;
		}
	}

	private log(
		message: string,
		level: 'info' | 'warn' | 'error' = 'info'
	): void {
		if (this.mode.quiet && level === 'info') return;

		switch (level) {
			case 'warn':
				if (this.mode.logWarnings) console.warn(message);

				break;
			case 'error':
				if (this.mode.logErrors) console.error(message);

				break;
			default:
				if (!this.mode.quiet) console.log(message);
		}
	}

	private async updateCurrentPaletteID(newID: number): Promise<void | null> {
		return this.handleAsync(async () => {
			const db = await this.getDB();
			const tx = db.transaction('settings', 'readwrite');
			const store = tx.objectStore('settings');

			await store.put({ key: 'appSettings', lastPaletteID: newID });
			await tx.done;

			if (!this.mode.quiet)
				this.log(`Current palette ID updated to ${newID}`);
		}, 'Error updating current palette ID');
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

		await callback(store);
		await tx.done;

		if (!this.mode.quiet) this.log(`Transaction completed on ${storeName}`);
	}
}
