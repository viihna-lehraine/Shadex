// File: settings/SettingsService.js

import {
	PaletteSchema,
	Settings,
	SettingsService_ClassInterface
} from '../../types/index.js';
import { configData as config } from '../../data/config.js';
import { dbUtils } from '../dbUtils.js';

const defaultSettings = config.db.DEFAULT_SETTINGS;
const SETTINGS_STORE = 'settings' as keyof PaletteSchema;
const SETTINGS_KEY = 'APP_SETTINGS';

export class SettingsService implements SettingsService_ClassInterface {
	private static instance: SettingsService | null = null;

	private cache: Partial<{ settings: Settings }> = {};
	private _maxHistory: number = 5;

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new SettingsService();
		}

		return this.instance;
	}

	public get maxHistory(): number {
		return Math.round(this._maxHistory);
	}

	public set maxHistory(value: number) {
		this._maxHistory = Math.round(Math.max(3, Math.min(10, value)));
	}

	public async getCachedSettings(): Promise<Settings> {
		if (!this.cache.settings)
			this.cache.settings = await this.getSettings();

		return this.cache.settings;
	}

	public async getSettings(): Promise<Settings> {
		const storedSettings = await dbUtils.handleData<Partial<Settings>>(
			SETTINGS_STORE,
			SETTINGS_KEY,
			'get'
		);

		return { ...defaultSettings, ...storedSettings };
	}

	public async saveSettings(newSettings: Settings): Promise<void> {
		await dbUtils.handleData(
			SETTINGS_STORE,
			SETTINGS_KEY,
			'put',
			newSettings
		);
	}
}
