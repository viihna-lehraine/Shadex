// File: app/storage/services/Settings.js

import { Settings, SettingsServiceInterface } from '../../../types/index.js';
import { LocalStorageService } from './LocalStorage.js';

const SETTINGS_KEY = 'app_settings';
const DEFAULT_SETTINGS = { maxHistory: 5 };

/**
 * Manages application storage settings.
 * Dependent child service of {@link StorageManager}.
 */
export class SettingsService implements SettingsServiceInterface {
	private static instance: SettingsService | null = null;

	private storage: LocalStorageService;

	private constructor() {
		this.storage = LocalStorageService.getInstance();
	}

	public static getInstance(): SettingsService {
		if (!this.instance) {
			this.instance = new SettingsService();
		}

		return this.instance;
	}

	public getSettings(): Settings {
		return this.storage.load(SETTINGS_KEY, DEFAULT_SETTINGS) as Settings;
	}

	public resetSettings(): void {
		this.storage.save(SETTINGS_KEY, DEFAULT_SETTINGS);
	}

	public saveSettings(newSettings: Settings): void {
		this.storage.save(SETTINGS_KEY, newSettings);
	}
}
