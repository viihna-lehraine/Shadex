// File: db/services/PaletteService.js

import {
	CommonFn_MasterInterface,
	ConfigDataInterface,
	DBUtilsInterface,
	Palette,
	PaletteItem,
	PaletteSchema,
	PaletteService_ClassInterface,
	Settings
} from '../../types/index.js';
import { configData as config } from '../../data/config.js';
import { dbUtils } from '../dbUtils.js';
import { commonFn } from '../../common/index.js';

const PALETTE_STORE = 'palettes' as keyof PaletteSchema;

export class PaletteService implements PaletteService_ClassInterface {
	private static instance: PaletteService | null = null;

	private dbUtils: DBUtilsInterface;
	private utils: CommonFn_MasterInterface['utils'];

	private storeNames: ConfigDataInterface['db']['STORE_NAMES'] =
		config.db.STORE_NAMES;

	constructor() {
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
		return this.dbUtils
			.handleData<Settings>(
				this.storeNames.SETTINGS as keyof PaletteSchema,
				this.dbUtils.getDefaultKey('APP_SETTINGS'),
				'get'
			)
			.then(settings => settings?.lastPaletteID ?? 0);
	}

	public async getNextTableID(): Promise<string> {
		const lastTableID =
			(
				await this.dbUtils.handleData<Settings>(
					this.storeNames.SETTINGS as keyof PaletteSchema,
					this.dbUtils.getDefaultKey('APP_SETTINGS'),
					'get'
				)
			)?.lastTableID ?? 0;

		const nextID = lastTableID + 1;

		await this.dbUtils.updateData(
			this.storeNames.SETTINGS as keyof PaletteSchema,
			this.dbUtils.getDefaultKey('APP_SETTINGS'),
			s => ({ ...s, lastTableID: nextID })
		);

		return `palette_${nextID}`;
	}

	public async getPalette(id: string): Promise<Palette | void | null> {
		return dbUtils.handleData<Palette>(PALETTE_STORE, id, 'get');
	}

	public async resetPaletteID(): Promise<void> {
		await this.dbUtils.updateData(
			this.storeNames.SETTINGS as keyof PaletteSchema,
			this.dbUtils.getDefaultKey('APP_SETTINGS'),
			s => ({ ...s, lastPaletteID: 0 })
		);
	}

	public async savePalette(id: string, palette: Palette): Promise<void> {
		await dbUtils.handleData(PALETTE_STORE, id, 'put', palette);
	}

	public async savePaletteToDB(
		type: string,
		items: PaletteItem[],
		paletteID: number,
		numBoxes: number,
		limitDark: boolean,
		limitGray: boolean,
		limitLight: boolean
	): Promise<Palette> {
		const newPalette = this.utils.palette.createObject(
			type,
			items,
			numBoxes,
			paletteID,
			limitDark,
			limitGray,
			limitLight
		);
		const parsedPaletteFormat = Number(newPalette.id.split('_')[1]);

		if (
			isNaN(parsedPaletteFormat) ||
			parsedPaletteFormat <= 0 ||
			parsedPaletteFormat >= 9
		)
			throw new Error(`Invalid palette ID format: ${newPalette.id}`);

		await this.savePalette(newPalette.id, newPalette);

		return newPalette;
	}

	public async updateEntryInPalette(
		tableID: string,
		entryIndex: number,
		newEntry: PaletteItem
	): Promise<void> {
		const palette = await this.dbUtils.handleData<Palette>(
			this.storeNames.TABLES as keyof PaletteSchema,
			tableID,
			'get'
		);

		if (!palette) throw new Error(`Palette ${tableID} not found.`);
		if (entryIndex >= palette.items.length)
			throw new Error(`Invalid index ${entryIndex}`);

		palette.items[entryIndex] = newEntry;

		await this.savePalette(tableID, palette);
	}
}
