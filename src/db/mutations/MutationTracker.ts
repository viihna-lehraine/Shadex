// File: db/mutations/MutationTracker.js

import { openDB } from 'idb';
import {
	ConfigDataInterface,
	ModeDataInterface,
	MutationLog,
	MutationTracker_ClassInterface,
	PaletteDB,
	PaletteSchema
} from '../../types/index.js';
import { AppLogger } from '../../logger/AppLogger.js';

const thisModule = 'db/mutations/MutationTracker.js';

export class MutationTracker implements MutationTracker_ClassInterface {
	private static instance: MutationTracker;
	private appLogger: AppLogger;
	private mode: ModeDataInterface;
	private storeNames: ConfigDataInterface['db']['STORE_NAMES'];

	constructor(dbData: ConfigDataInterface['db'], mode: ModeDataInterface) {
		this.appLogger = AppLogger.getInstance(mode);
		this.storeNames = dbData.STORE_NAMES;
		this.mode = mode;
	}

	public static getInstance(
		dbData: ConfigDataInterface['db'],
		mode: ModeDataInterface
	): MutationTracker {
		if (!MutationTracker.instance) {
			MutationTracker.instance = new MutationTracker(dbData, mode);
		}

		return MutationTracker.instance;
	}

	public async persistMutation(data: MutationLog): Promise<void> {
		const caller = 'persistMutation()';
		const db = await this.getDB();

		await db.put('mutations', data);

		this.appLogger.log(
			`Persisted mutation: ${JSON.stringify(data)}`,
			'info',
			this.mode.debugLevel,
			`${thisModule} > ${caller}`
		);
	}

	private async getDB(): Promise<PaletteDB> {
		return openDB<PaletteSchema>('paletteDB', 1, {
			upgrade: db => {
				const storeNames = Object.values(this.storeNames);

				for (const storeName of storeNames) {
					if (!db.objectStoreNames.contains(storeName)) {
						db.createObjectStore(storeName, { keyPath: 'key' });
					}
				}
			}
		});
	}
}
