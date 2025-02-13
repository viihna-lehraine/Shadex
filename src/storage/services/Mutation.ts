// File: app/storage/services/Mutation.js

import {
	MutationLog,
	MutationServiceInterface,
	StorageDataInterface
} from '../../../types/index.js';
import { LocalStorageService } from './LocalStorage.js';
import { storageData } from '../../../data/storage.js';

/**
 * Service for managing mutations.
 * Dependent child service of StorageManager.
 */
export class MutationService implements MutationServiceInterface {
	static instance: MutationService | null = null;

	private storage: LocalStorageService;
	private storageData: StorageDataInterface;

	private constructor() {
		this.storage = LocalStorageService.getInstance();
		this.storageData = storageData;
	}

	public static getInstance(): MutationService {
		if (!this.instance) {
			this.instance = new MutationService();
		}

		return this.instance;
	}

	/**
	 * Clears all mutation logs from storage.
	 * @public
	 */
	public clearMutations(): void {
		this.storage.save(this.storageData.MUTATIONS_KEY, []);
	}

	/**
	 * Creates a proxy that logs mutations to an object.
	 * @public
	 * @param {T} obj - The object to track.
	 * @param {string} key - Identifier for the mutation log.
	 * @returns {T} - A proxied object that logs mutations.
	 */
	public createMutationLogger<T extends object>(obj: T, key: string): T {
		return new Proxy(obj, {
			set: (target, property, value) => {
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

					console.debug(`Mutation detected:`, mutationLog);

					// Store mutation log
					this.persistMutation(mutationLog);
				}

				return success;
			}
		});
	}

	/**
	 * Retrieves all mutation logs.
	 * @public
	 * @returns {MutationLog[]} - List of mutation logs.
	 */
	public getMutations(): MutationLog[] {
		return this.storage.load(this.storageData.MUTATIONS_KEY, []);
	}

	/**
	 * Saves a mutation log to local storage.
	 * @public
	 * @param {MutationLog} data - The mutation log to persist.
	 */
	public persistMutation(data: MutationLog): void {
		let mutations = this.getMutations();

		mutations.push(data);

		this.storage.save(this.storageData.MUTATIONS_KEY, mutations);
	}
}
