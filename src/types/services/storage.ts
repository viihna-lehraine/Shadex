// File: types/services/storage.js

import { MutationLog, Palette, Settings } from '../index.js';

export interface HistoryServiceInterface {
	addPaletteToHistory(palette: Palette): void;
	clearHistory(): void;
	getPaletteHistory(): Palette[];
}

export interface LocalStorageServiceInterface {
	clearAll(): void;
	load<T>(key: string, defaultValue: T): T;
	remove(key: string): void;
	save(key: string, value: object): void;
}

export interface MutationServiceInterface {
	clearMutations(): void;
	createMutationLogger<T extends object>(obj: T, key: string): T;
	getMutations(): MutationLog[];
	persistMutation(data: MutationLog): void;
}

export interface PaletteStorageServiceInterface {
	deletePalette(id: Palette['id']): void;
	getPaletteHistory(): Palette[];
	resetPalettes(): void;
	savePalette(newPalette: Palette): void;
}

export interface SettingsServiceInterface {
	getSettings(): Settings;
	resetSettings(): void;
	saveSettings(newSettings: Settings): void;
}

export interface StorageManagerInterface {
	deletePalette(id: string): void;
	getPaletteHistory(): Palette[];
	getSettings(): Settings;
	logMutation(mutation: MutationLog): void;
	resetStorage(): void;
	savePalette(id: string, palette: Palette): void;
}
