// File: app/settings/SettingsService.js

import {
	AppUtilsInterface,
	DBUtilsInterface,
	PaletteSchema,
	Settings,
	SettingsService_ClassInterface
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';

const defaultSettings = config.db.DEFAULT_SETTINGS;
const SETTINGS_STORE = 'settings' as keyof PaletteSchema;
const SETTINGS_KEY = 'APP_SETTINGS';

export class SettingsService implements SettingsService_ClassInterface {
	private static instance: SettingsService | null = null;

	private cache: Partial<{ settings: Settings }> = {};
	private _maxHistory: number = 5;

	private appUtils: AppUtilsInterface;
	private dbUtils: DBUtilsInterface;

	constructor() {
		this.appUtils = appUtils;
		this.dbUtils = dbUtils;
	}

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
		if (!this.cache.settings) {
			this.cache.settings =
				(await this.appUtils.handleAsync(
					() => this.getSettings(),
					'Failed to fetch cached settings',
					'SettingsService.getCachedSettings()'
				)) ?? defaultSettings;
		}

		return this.cache.settings;
	}

	public async getSettings(): Promise<Settings> {
		const storedSettings = await this.appUtils.handleAsync(
			() =>
				this.dbUtils.handleData<Partial<Settings>>(
					SETTINGS_STORE,
					SETTINGS_KEY,
					'get'
				),
			'Failed to retrieve settings',
			'SettingsService.getSettings'
		);

		return { ...defaultSettings, ...(storedSettings ?? {}) };
	}

	public async saveSettings(newSettings: Settings): Promise<void> {
		await this.appUtils.handleAsync(
			() =>
				this.dbUtils.handleData(
					SETTINGS_STORE,
					SETTINGS_KEY,
					'put',
					newSettings
				),
			'Failed to save settings',
			'SettingsService.saveSettings'
		);
	}
}
