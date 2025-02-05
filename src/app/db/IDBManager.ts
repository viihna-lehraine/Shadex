// File: app/db/IDBManager.js

import { IDBPDatabase, IDBPObjectStore } from 'idb';
import {
	DBUtilsInterface,
	IDBManager_ClassInterface,
	MutationLog,
	Palette,
	PaletteArgs,
	PaletteDB,
	PaletteItem,
	PaletteSchema,
	Settings
} from '../../types/index.js';
import { DBService } from './services/DBService.js';
import { HistoryService } from './services/HistoryService.js';
import { MutationService } from './services/MutationService.js';
import { PaletteService } from './services/PaletteService.js';
import { SettingsService } from './services/SettingsService.js';
import { dbUtils, setIDBManagerInstance } from './dbUtils.js';
import { initializeDB } from './initialize.js';

export class IDBManager implements IDBManager_ClassInterface {
	private static instance: IDBManager | null = null;

	private dbPromise: Promise<IDBPDatabase<PaletteSchema>>;

	private dbUtils: DBUtilsInterface;

	private dbService!: DBService;
	private historyService!: HistoryService;
	private mutationService!: MutationService;
	private paletteService!: PaletteService;
	private settingsService!: SettingsService;

	private constructor() {
		this.dbPromise = initializeDB();

		this.dbUtils = dbUtils;

		this.initializeServices();
	}

	/// * * * * * * STATIC METHODS * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * *

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

	/// * * * * * * * PUBLIC METHODS * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * *

	public async addPaletteToHistory(palette: Palette): Promise<void> {
		await this.historyService.addPaletteToHistory(palette);
	}

	public async createMutationLogger<T extends object>(
		obj: T,
		key: string
	): Promise<T> {
		return await this.mutationService.createMutationLogger(obj, key);
	}

	public async deleteDatabase(): Promise<void> {
		await this.dbService.deleteDatabase();
	}

	public async deleteEntries(
		store: keyof PaletteSchema,
		keys: string[]
	): Promise<void> {
		await this.dbService.deleteEntries(store, keys);
	}

	public async getCurrentPaletteID(): Promise<number> {
		return await this.paletteService.getCurrentPaletteID();
	}

	public async getDB(): Promise<PaletteDB> {
		return this.dbPromise;
	}

	public async getCachedSettings(): Promise<Settings> {
		return await this.settingsService.getCachedSettings();
	}

	public async getNextTableID(): Promise<string> {
		return await this.paletteService.getNextTableID();
	}

	public async getMutations(): Promise<MutationLog[]> {
		return await this.mutationService.getMutations();
	}

	public async getPaletteHistory(): Promise<Palette[]> {
		return await this.historyService.getPaletteHistory();
	}

	public async getSettings(): Promise<Settings> {
		return await this.settingsService.getSettings();
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
	): Promise<
		IDBPObjectStore<PaletteSchema, [StoreName], StoreName, typeof mode>
	> {
		return this.dbUtils.withDB(async db =>
			db.transaction(storeName, mode).objectStore(storeName)
		);
	}

	public async persistMutation(data: MutationLog): Promise<void> {
		await this.mutationService.persistMutation(data);
	}

	public async resetDatabase(): Promise<void> {
		await this.dbService.resetDatabase();
	}

	public async resetPaletteID(): Promise<void> {
		await this.paletteService.resetPaletteID();
	}

	public async savePalette(id: string, newPalette: Palette): Promise<void> {
		await this.paletteService.savePalette(id, newPalette);
	}

	public async savePaletteToDB(args: PaletteArgs): Promise<Palette> {
		return await this.paletteService.savePaletteToDB(args);
	}

	public async savePaletteHistory(paletteHistory: Palette[]): Promise<void> {
		await this.historyService.savePaletteHistory(paletteHistory);
	}

	public async saveSettings(newSettings: Settings): Promise<void> {
		await this.settingsService.saveSettings(newSettings);
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void> {
		await this.paletteService.updateEntryInPalette(
			tableID,
			entryIndex,
			newEntry
		);
	}

	//// * * * * * * PRIVATE METHODS * * * * * *
	/// * * * *  * * * * * * * * * * * * * * * *

	private async initializeServices(): Promise<void> {
		setIDBManagerInstance(this);

		this.dbService = await DBService.getInstance();
		this.historyService = await HistoryService.getInstance();
		this.mutationService = await MutationService.getInstance();
		this.paletteService = await PaletteService.getInstance();
		this.settingsService = await SettingsService.getInstance();
	}
}
