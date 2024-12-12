// File: src/index/idb.ts

import { IDBPDatabase } from 'idb';
import { ColorSpace, HSL, Palette, PaletteUnbranded } from './index.js';

export interface MutationLog {
	timestamp: string; // ISO timestamp of when the mutation occurred
	key: string; // ID or ke of mutated item
	action: 'add' | 'delete' | 'update'; // what occurred
	newValue: unknown; // new value of mutated item
	oldValue: unknown; // previous value of mutated item
	origin: string; // source of the mutation
}

export type PaletteDB = IDBPDatabase<PaletteSchema>;

export interface PaletteSchema {
	customColor: {
		key: string;
		value: { color: HSL };
	};
	mutations: {
		timestamp: string;
		value: MutationLog;
	};
	settings: {
		key: string;
		value: Settings;
	};
	tables: {
		key: string;
		value: StoredPalette[];
	};
}

export interface Settings {
	colorSpace: ColorSpace;
	lastTableID: number;
}

export interface StoredPalette {
	tableID: number;
	palette: Palette;
}

export interface StoredPaletteUnbranded {
	tableID: number;
	palette: PaletteUnbranded;
}
