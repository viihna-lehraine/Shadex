// File: app/storage/services/LocalStorage.js

import { LocalStorageServiceInterface } from '../../../types/index.js';

export class LocalStorageService implements LocalStorageServiceInterface {
	private static instance: LocalStorageService | null = null;

	public static getInstance(): LocalStorageService {
		if (!LocalStorageService.instance) {
			LocalStorageService.instance = new LocalStorageService();
		}
		return LocalStorageService.instance;
	}

	public clearAll(): void {
		localStorage.clear();
	}

	public load<T>(key: string, defaultValue: T): T {
		const data = localStorage.getItem(key);

		return data ? JSON.parse(data) : defaultValue;
	}

	public remove(key: string): void {
		localStorage.removeItem(key);
	}

	public save(key: string, value: object): void {
		localStorage.setItem(key, JSON.stringify(value));
	}
}
