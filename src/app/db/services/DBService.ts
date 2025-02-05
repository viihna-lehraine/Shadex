// File: app/db/services/DBService.js

import {
	AppUtilsInterface,
	ConfigDataInterface,
	DBService_ClassInterface,
	DBUtilsInterface,
	PaletteSchema
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';

export class DBService implements DBService_ClassInterface {
	private static instance: DBService | null = null;

	private defaultSettings: ConfigDataInterface['db']['DEFAULT_SETTINGS'] =
		config.db.DEFAULT_SETTINGS;
	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	private appUtils: AppUtilsInterface;
	private dbUtils: DBUtilsInterface;

	constructor() {
		this.appUtils = appUtils;
		this.dbUtils = dbUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new DBService();
		}

		return this.instance;
	}

	public async deleteDatabase(): Promise<void> {
		await this.appUtils.handleAsync(
			async () => {
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
					deleteRequest.onsuccess = () =>
						this.appUtils.log(
							'debug',
							`Database "${dbName}" deleted successfully.`,
							'deleteDatabase'
						);
					deleteRequest.onerror = event =>
						this.appUtils.log(
							'error',
							`Error deleting database "${dbName}":\nEvent: ${event}`,
							'deleteDatabase'
						);
					deleteRequest.onblocked = () =>
						this.appUtils.log(
							'warn',
							`Delete operation blocked for "${dbName}".`,
							'deleteDatabase'
						);
				} else {
					this.appUtils.log(
						'warn',
						`Database "${dbName}" does not exist.`,
						'deleteDatabase'
					);
				}
			},
			'Failed to delete database',
			'DBService.deleteDatabase'
		);
	}

	public async deleteEntries(
		store: keyof PaletteSchema,
		keys: string[]
	): Promise<void> {
		await this.appUtils.handleAsync(
			async () => {
				await this.dbUtils.withDB(async db => {
					const storeRef = db
						.transaction(store, 'readwrite')
						.objectStore(store);

					for (const key of keys) {
						if (
							(await this.dbUtils.handleData(
								store,
								key,
								'get'
							)) !== null
						) {
							await storeRef.delete(key);
						}
					}
				});
			},
			`Failed to delete entries in store "${store}"`,
			'DBService.deleteEntries'
		);
	}

	public async resetDatabase(): Promise<void> {
		await this.appUtils.handleAsync(
			async () => {
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
			},
			'Failed to reset database',
			'DBService.resetDatabase'
		);
	}
}
