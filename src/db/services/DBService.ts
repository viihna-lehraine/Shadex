// File: db/services/DBService.js

import {
	CommonFn_MasterInterface,
	ConfigDataInterface,
	DBService_ClassInterface,
	DBUtilsInterface,
	ModeDataInterface,
	PaletteSchema
} from '../../types/index.js';
import { commonFn } from '../../common/index.js';
import { configData as config } from '../../data/config.js';
import { dbUtils } from '../dbUtils.js';
import { modeData as mode } from '../../data/mode.js';

export class DBService implements DBService_ClassInterface {
	private static instance: DBService | null = null;

	private logMode: ModeDataInterface['logging'];
	private mode: ModeDataInterface;

	private defaultSettings: ConfigDataInterface['db']['DEFAULT_SETTINGS'] =
		config.db.DEFAULT_SETTINGS;
	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	private dbUtils: DBUtilsInterface;
	private handleAsync: CommonFn_MasterInterface['utils']['errors']['handleAsync'];

	constructor() {
		this.logMode = mode.logging;
		this.mode = mode;

		this.dbUtils = dbUtils;
		this.handleAsync = commonFn.utils.errors.handleAsync;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new DBService();
		}

		return this.instance;
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
					this.dbUtils.log(
						'debug',
						`Database "${dbName}" deleted successfully.`,
						`deleteDatabase()`,
						1
					);
				};
				deleteRequest.onerror = event => {
					this.dbUtils.log(
						'error',
						`Error deleting database "${dbName}":\nEvent: ${event}`,
						`deleteDatabase()`
					);
				};
				deleteRequest.onblocked = () => {
					this.dbUtils.log(
						'warn',
						`Delete operation blocked. Ensure no open connections to "${dbName}".`,
						`deleteDatabase()`,
						1
					);

					if (this.mode.showAlerts)
						alert(
							`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`
						);

					if (this.mode.stackTrace)
						console.trace(`Blocked call stack:`);
				};
			} else {
				if (this.logMode.warn && this.logMode.verbosity >= 3)
					this.dbUtils.log(
						'warn',
						`Database "${dbName}" does not exist.`,
						`deleteDatabase()`
					);
			}
		}, 'IDBManager.deleteDatabase(): Error deleting database');
	}

	public async deleteEntries(
		store: keyof PaletteSchema,
		keys: string[]
	): Promise<void> {
		await this.dbUtils.withDB(async db => {
			const storeRef = db
				.transaction(store, 'readwrite')
				.objectStore(store);

			for (const key of keys) {
				if (
					(await this.dbUtils.handleData(store, key, 'get')) !== null
				) {
					await storeRef.delete(key);
				}
			}
		});
	}

	public async resetDatabase(): Promise<void> {
		await this.dbUtils.withDB(async db => {
			await Promise.all(
				Object.values(this.storeNames).map(store =>
					db
						.transaction(store, 'readwrite')
						.objectStore(store)
						.clear()
				)
			);
			await this.dbUtils.handleData(
				this.storeNames.SETTINGS as keyof PaletteSchema,
				this.dbUtils.getDefaultKey('APP_SETTINGS'),
				'put',
				this.defaultSettings
			);
		});
	}
}
