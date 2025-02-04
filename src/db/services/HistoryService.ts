// File: db/services/HistoryService.js

import {
	ConfigDataInterface,
	DBUtilsInterface,
	HistoryService_ClassInterface,
	Palette,
	PaletteSchema
} from '../../types/index.js';
import { configData as config } from '../../data/config.js';
import { dbUtils } from '../dbUtils.js';

export class HistoryService implements HistoryService_ClassInterface {
	private static instance: HistoryService | null = null;

	private dbUtils: DBUtilsInterface;

	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	constructor() {
		this.dbUtils = dbUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new HistoryService();
		}

		return this.instance;
	}

	public async getPaletteHistory(): Promise<Palette[]> {
		return (
			(
				await this.dbUtils.handleData<{ palettes: Palette[] }>(
					this.storeNames.SETTINGS as keyof PaletteSchema,
					'paletteHistory',
					'get'
				)
			)?.palettes ?? []
		);
	}

	public async savePaletteHistory(paletteHistory: Palette[]): Promise<void> {
		await this.dbUtils.handleData(
			this.storeNames.SETTINGS as keyof PaletteSchema,
			'paletteHistory',
			'put',
			{ palettes: paletteHistory }
		);
	}
}
