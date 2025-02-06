// File: app/ui/services/event/subServices/Palette.js

import {
	DBUtilsInterface,
	PaletteSchema,
	Palette
} from '../../../../../types/index.js';
import { dbUtils } from '../../../../db/dbUtils.js';

const PALETTE_STORE = 'palettes' as keyof PaletteSchema;

export class PaletteEventSubService {
	private static instance: PaletteEventSubService | null = null;

	private dbUtils: DBUtilsInterface;

	constructor() {
		this.dbUtils = dbUtils;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new PaletteEventSubService();
		}

		return this.instance;
	}

	public async getPalette(id: string): Promise<Palette | null> {
		try {
			return this.dbUtils.handleData(PALETTE_STORE, id, 'get');
		} catch (error) {
			console.error(`Failed to fetch palette ${id}:`, error);

			return null;
		}
	}

	public initialize(): void {}

	public async savePalette(id: string, palette: Palette): Promise<void> {
		await this.dbUtils.handleData(PALETTE_STORE, id, 'put', palette);
	}

	public async saturateColor(): Promise<void> {
		// *DEV-NOTE* implement later
	}
}
