// File: app/db/services/MutationService.js

import {
	AppUtilsInterface,
	ConfigDataInterface,
	DBUtilsInterface,
	MutationLog,
	MutationService_ClassInterface,
	PaletteSchema
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';

export class MutationService implements MutationService_ClassInterface {
	private static instance: MutationService | null = null;

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

					self.appUtils.log(
						'debug',
						`Mutation detected: ${JSON.stringify(mutationLog)}`,
						`createMutationLogger()`,
						2
					);

					self.appUtils.handleAsync(
						() => self.persistMutation(mutationLog),
						'Failed to persist mutation',
						'MutationService.createMutationLogger()'
					);
				}

				return success;
			}
		});
	}

	public async getMutations(): Promise<MutationLog[]> {
		return (
			(await this.appUtils.handleAsync(
				() =>
					this.dbUtils.handleData<MutationLog[]>(
						this.storeNames.MUTATIONS as keyof PaletteSchema,
						'mutation_logs',
						'get'
					),
				'Failed to fetch mutation logs',
				'MutationService.getMutations()'
			)) ?? []
		);
	}

	public async persistMutation(data: MutationLog): Promise<void> {
		await this.appUtils.handleAsync(
			async () => {
				await this.dbUtils.withDB(async db => {
					await db.put('mutations', data);
					this.appUtils.log(
						'debug',
						`Persisted mutation: ${JSON.stringify(data)}`,
						'MutationService.persistMutation()',
						4
					);
				});
			},
			'Failed to persist mutation',
			'MutationService.persistMutation()'
		);
	}
}
