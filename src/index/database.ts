import { IDBPDatabase } from 'idb';
import * as colors from './colors';
import * as palette from './palette';

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
		value: { color: colors.HSL };
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
	colorSpace: colors.ColorSpace;
	lastTableID: number;
}

export interface StoredPalette {
	tableID: number;
	palette: palette.Palette;
}
