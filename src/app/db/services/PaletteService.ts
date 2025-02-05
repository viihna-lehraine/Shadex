// File: app/db/services/PaletteService.js

import {
	AppUtilsInterface,
	CommonFn_MasterInterface,
	ConfigDataInterface,
	DBUtilsInterface,
	Palette,
	PaletteArgs,
	PaletteItem,
	PaletteSchema,
	PaletteService_ClassInterface,
	Settings
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { configData as config } from '../../../data/config.js';
import { dbUtils } from '../dbUtils.js';
import { commonFn } from '../../../common/index.js';

const PALETTE_STORE = 'palettes' as keyof PaletteSchema;

export class PaletteService implements PaletteService_ClassInterface {
	private static instance: PaletteService | null = null;

	private appUtils: AppUtilsInterface;
	private dbUtils: DBUtilsInterface;
	private utils: CommonFn_MasterInterface['utils'];

	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	constructor() {
		this.appUtils = appUtils;
		this.dbUtils = dbUtils;
		this.utils = commonFn.utils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new PaletteService();
		}

		return this.instance;
	}

	public async getCurrentPaletteID(): Promise<number> {
		return (
			(
				await this.appUtils.handleAsync(
					() =>
						this.dbUtils.handleData<Settings>(
							'settings',
							this.dbUtils.getDefaultKey('APP_SETTINGS'),
							'get'
						),
					'Failed to fetch current palette ID',
					'PaletteService.getCurrentPaletteID()'
				)
			)?.lastPaletteID ?? 0
		);
	}

	public async getNextTableID(): Promise<string> {
		const lastTableID =
			(
				await this.appUtils.handleAsync(
					() =>
						this.dbUtils.handleData<Settings>(
							this.storeNames.SETTINGS as keyof PaletteSchema,
							this.dbUtils.getDefaultKey('APP_SETTINGS'),
							'get'
						),
					'Failed to fetch last table ID',
					'PaletteService.getNextTableID()'
				)
			)?.lastTableID ?? 0;

		const nextID = lastTableID + 1;

		await this.appUtils.handleAsync(
			() =>
				this.dbUtils.updateData(
					this.storeNames.SETTINGS as keyof PaletteSchema,
					this.dbUtils.getDefaultKey('APP_SETTINGS'),
					s => ({ ...s, lastTableID: nextID })
				),
			'Failed to update next table ID',
			'PaletteService.getNextTableID()'
		);

		return `palette_${nextID}`;
	}

	public async getPalette(id: string): Promise<Palette | null> {
		return await this.appUtils.handleAsync(
			() => this.dbUtils.handleData<Palette>(PALETTE_STORE, id, 'get'),
			`Failed to fetch palette with ID ${id}`,
			'PaletteService.getPalette()'
		);
	}

	public async resetPaletteID(): Promise<void> {
		await this.appUtils.handleAsync(
			() =>
				this.dbUtils.updateData(
					this.storeNames.SETTINGS as keyof PaletteSchema,
					this.dbUtils.getDefaultKey('APP_SETTINGS'),
					s => ({ ...s, lastPaletteID: 0 })
				),
			'Failed to reset palette ID',
			'PaletteService.resetPaletteID()'
		);
	}

	public async savePalette(id: string, palette: Palette): Promise<void> {
		await this.appUtils.handleAsync(
			() => this.dbUtils.handleData(PALETTE_STORE, id, 'put', palette),
			`Failed to save palette with ID ${id}`,
			'PaletteService.savePalette()'
		);
	}

	public async savePaletteToDB(args: PaletteArgs): Promise<Palette> {
		const result = await this.appUtils.handleAsync(
			async () => {
				const newPalette = this.utils.palette.createObject(args);
				const parsedPaletteFormat = Number(newPalette.id.split('_')[1]);

				if (
					isNaN(parsedPaletteFormat) ||
					parsedPaletteFormat <= 0 ||
					parsedPaletteFormat >= 9
				) {
					throw new Error(
						`Invalid palette ID format: ${newPalette.id}`
					);
				}

				await this.savePalette(newPalette.id, newPalette);

				return newPalette;
			},
			'Failed to save palette to database',
			'PaletteService.savePaletteToDB()'
		);

		if (!result) {
			throw new Error('savePaletteToDB failed and returned null.');
		}

		return result;
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void> {
		const palette = await this.appUtils.handleAsync(
			() =>
				this.dbUtils.handleData<Palette>(PALETTE_STORE, tableID, 'get'),
			`Failed to fetch palette with ID ${tableID}`,
			'PaletteService.updateEntryInPalette()'
		);

		if (!palette) throw new Error(`Palette ${tableID} not found.`);
		if (entryIndex >= palette.items.length)
			throw new Error(`Invalid index ${entryIndex}`);

		palette.items[entryIndex] = newEntry;

		await this.savePalette(tableID, palette);
	}
}
