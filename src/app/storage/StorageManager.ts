// File: app/storage/StorageManager.js

import {
	MutationLog,
	Palette,
	Settings,
	StorageManagerInterface
} from '../../types/index.js';
import { HistoryService } from './services/History.js';

export class StorageManager implements StorageManagerInterface {
	private static instance: StorageManager | null = null;

	private historyService: HistoryService;
	private mutationService: MutationService;
	private paletteService: PaletteService;
	private settingsService: SettingsService;

	constructor() {
		this.historyService = HistoryService.getInstance();
		this.mutationService = MutationService.getInstance();
		this.paletteService = PaletteService.getInstance();
		this.settingsService = SettingsService.getInstance();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new StorageManager();
		}
		return this.instance;
	}

	public deletePalette(id: string) {
		this.paletteService.deletePalette(id);
	}

	public getMutations(): MutationLog[] {
		return this.mutationService.getMutations();
	}

	public getPaletteHistory(): Palette[] {
		return this.historyService.getPaletteHistory();
	}

	public getSettings(): Settings {
		return this.settingsService.getSettings();
	}

	public logMutation(mutation: MutationLog): void {
		this.mutationService.persistMutation(mutation);
	}

	public resetStorage() {
		this.paletteService.resetPalettes();
		this.historyService.clearHistory();
		this.mutationService.clearMutations();
		this.settingsService.resetSettings();
	}

	public savePalette(id: string, palette: Palette) {
		this.paletteService.savePalette(id, palette);
	}

	public saveSettings(settings: Settings): void {
		this.settingsService.saveSettings(settings);
	}
}
