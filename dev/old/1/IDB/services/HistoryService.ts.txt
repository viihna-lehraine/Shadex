// File: app/db/services/HistoryService.js

import {
	AppUtilsInterface,
	ConfigDataInterface,
	DBUtilsInterface,
	HistoryService_ClassInterface,
	Palette,
	PaletteSchema
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';

export class HistoryService implements HistoryService_ClassInterface {
	private static instance: HistoryService | null = null;

	private appUtils: AppUtilsInterface;
	private dbUtils: DBUtilsInterface;

	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	constructor() {
		this.appUtils = appUtils;
		this.dbUtils = dbUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new HistoryService();
		}

		return this.instance;
	}

	public async addPaletteToHistory(palette: Palette): Promise<void> {
		const history = await this.getPaletteHistory();
		const newID = history.length + 1;
		const idString = `${palette.metadata.type}_${newID}`;

		history.unshift({ ...palette, id: idString });

		const settings = await appUtils.handleAsync(
			() =>
				this.dbUtils.handleData<{ maxHistory: number }>(
					'settings',
					'APP_SETTINGS',
					'get'
				),
			'Failed to fetch settings',
			'HistoryService.addPaletteToHistory()'
		);

		const maxHistory = settings?.maxHistory ?? 5;
		if (history.length > maxHistory) history.pop();

		await this.savePaletteHistory(history);
	}

	public async getPaletteHistory(): Promise<Palette[]> {
		return (
			(
				await this.appUtils.handleAsync(
					() =>
						this.dbUtils.handleData<{ palettes: Palette[] }>(
							'settings',
							'paletteHistory',
							'get'
						),
					'Failed to fetch palette history',
					'HistoryService.getPaletteHistory()'
				)
			)?.palettes ?? []
		);
	}

	public async savePaletteHistory(paletteHistory: Palette[]): Promise<void> {
		await this.appUtils.handleAsync(
			() =>
				this.dbUtils.handleData(
					this.storeNames.SETTINGS as keyof PaletteSchema,
					'paletteHistory',
					'put',
					{ palettes: paletteHistory }
				),
			'Failed to save palette history',
			'HistoryService.savePaletteHistory()'
		);
	}
}
