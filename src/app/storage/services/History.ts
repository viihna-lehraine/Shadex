// File: app/storage/services/History.js

import {
	HistoryServiceInterface,
	Palette,
	StorageDataInterface
} from '../../../types/index.js';
import { LocalStorageService } from './LocalStorage.js';
import { storageData } from '../../../data/storage.js';

/**
 * Manages palette history in local storage.
 * Dependent child service of StorageManager.
 */
export class HistoryService implements HistoryServiceInterface {
	private static instance: HistoryService | null = null;

	private storage: LocalStorageService;
	private storageData: StorageDataInterface;

	private constructor() {
		this.storage = LocalStorageService.getInstance();
		this.storageData = storageData;
	}

	public static getInstance(): HistoryService {
		if (!this.instance) {
			this.instance = new HistoryService();
		}

		return this.instance;
	}

	/**
	 * Adds palette to the begi9nning of the palette history array, then saves to local storage.
	 * @param palette Palette to add to history.
	 */
	public addPaletteToHistory(palette: Palette): void {
		let history = this.getPaletteHistory();

		history.unshift(palette);

		const maxHistory: number = this.storage.load('settings', {
			maxHistory: 5
		}).maxHistory;

		if (history.length > maxHistory) {
			history.pop();
		}

		this.storage.save(this.storageData.HISTORY_KEY, history);
	}

	/**
	 * Clears the palette history array from local storage.
	 */
	public clearHistory(): void {
		this.storage.save(this.storageData.HISTORY_KEY, []);
	}

	/**
	 * Retrieves the palette history array from local storage.
	 */
	public getPaletteHistory(): Palette[] {
		return this.storage.load(this.storageData.HISTORY_KEY, []);
	}
}
