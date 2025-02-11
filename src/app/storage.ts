// File: app/storage.js

import { Palette } from '../types/index.js';

const LocalStorageManager = {
	_key: 'palettes',

	getAll(): Record<string, any> {
		const data = localStorage.getItem(this._key);

		return data ? JSON.parse(data) : {};
	},

	// get a single palette by ID
	get(id: string): any | null {
		const palettes = this.getAll();

		return palettes[id] || null;
	},

	// save or update a palette
	save(id: string, paletteData: any): void {
		const palettes = this.getAll();

		palettes[id] = paletteData;
		localStorage.setItem(this._key, JSON.stringify(palettes));
	},

	// delete a palette by ID
	delete(id: string): void {
		const palettes = this.getAll();

		delete palettes[id];
		localStorage.setItem(this._key, JSON.stringify(palettes));
	},

	// clear all saved palettes
	clear(): void {
		localStorage.removeItem(this._key);
	}
};

export default LocalStorageManager;
