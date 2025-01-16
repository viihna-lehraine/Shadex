// File: src/classes/mutations/MutationTracker

import { openDB } from 'idb';
import {
	DataInterface,
	MutationLog,
	MutationTrackerInterface,
	PaletteDB,
	PaletteSchema
} from '../../index/index.js';
import { AppLogger } from '../logger/AppLogger.js';

export class MutationTracker implements MutationTrackerInterface {
	private static instance: MutationTracker;
	private appLogger: AppLogger;
	private storeNames: Record<string, string>;

	constructor(data: DataInterface) {
		this.appLogger = AppLogger.getInstance(data.mode);
		this.storeNames = data.idb.STORE_NAMES;
	}

	public static getInstance(data: DataInterface): MutationTracker {
		if (!MutationTracker.instance) {
			MutationTracker.instance = new MutationTracker(data);
		}

		return MutationTracker.instance;
	}

	public async persistMutation(data: MutationLog): Promise<void> {
		const db = await this.getDB();

		await db.put('mutations', data);

		this.appLogger.log(
			`Persisted mutation: ${JSON.stringify(data)}`,
			'info'
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
