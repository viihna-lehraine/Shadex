// File: db/services/MutationService.js

import {
	ConfigDataInterface,
	DBUtilsInterface,
	ModeDataInterface,
	MutationLog,
	MutationService_ClassInterface,
	PaletteSchema
} from '../../types/index.js';
import { configData as config } from '../../data/config.js';
import { dbUtils } from '../dbUtils.js';
import { modeData as mode } from '../../data/mode.js';

export class MutationService implements MutationService_ClassInterface {
	private static instance: MutationService | null = null;

	private logMode: ModeDataInterface['logging'];

	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	private dbUtils: DBUtilsInterface;

	constructor() {
		this.logMode = mode.logging;

		this.dbUtils = dbUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new MutationService();
		}

		return this.instance;
	}

	public async createMutationLogger<T extends object>(
		obj: T,
		key: string
	): Promise<T> {
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

					self.dbUtils.log(
						'debug',
						`Mutation detected: ${JSON.stringify(mutationLog)}`,
						`createMutationLogger()`,
						2
					);

					self.persistMutation(mutationLog).catch(err => {
						if (self.logMode.error)
							self.dbUtils.log(
								'error',
								`Failed to persist mutation: ${err.message}`,
								'createMutationLogger()'
							);
					});
				}

				return success;
			}
		});
	}

	public async getMutations(): Promise<MutationLog[]> {
		return this.dbUtils
			.handleData<
				MutationLog[]
			>(this.storeNames.MUTATIONS as keyof PaletteSchema, 'mutation_logs', 'get')
			.then(mutations => mutations ?? []);
	}

	public async persistMutation(data: MutationLog): Promise<void> {
		return this.dbUtils.withDB(async db => {
			await db.put('mutations', data);

			this.dbUtils.log(
				'debug',
				`Persisted mutation: ${JSON.stringify(data)}`,
				'persistMutation',
				4
			);
		});
	}
}
