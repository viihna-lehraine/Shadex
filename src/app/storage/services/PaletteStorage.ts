// File: app/storage/services/PaletteStorage.js

import {
	Palette,
	PaletteStorageServiceInterface
} from '../../../types/index.js';
import { LocalStorageService } from './LocalStorage.js';

const STORAGE_KEY = 'palettes';

export class PaletteStorageService implements PaletteStorageServiceInterface {
	private static instance: PaletteStorageService | null = null;

	private storage: LocalStorageService;

	private constructor() {
		this.storage = LocalStorageService.getInstance();
	}

	static getInstance(): PaletteStorageService {
		if (!this.instance) {
			this.instance = new PaletteStorageService();
		}

		return this.instance;
	}

	public deletePalette(id: Palette['id']): void {
		let palettes = this.getPaletteHistory();

		palettes = palettes.filter(palette => palette.id !== id);

		this.storage.save(STORAGE_KEY, palettes);
	}

	public getPaletteHistory(): Palette[] {
		return this.storage.load(STORAGE_KEY, []);
	}

	public resetPalettes(): void {
		this.storage.save(STORAGE_KEY, []);
	}

	public savePalette(newPalette: Palette): void {
		const palettes = this.getPaletteHistory();

		palettes.push(newPalette);

		this.storage.save(STORAGE_KEY, palettes);
	}
}
