// File: types/app/db.js

import {
	ConfigDataInterface,
	PaletteDB,
	PaletteItem,
	PaletteSchema
} from '../index.js';

export interface DBUtilsInterface {
	getDefaultKey(key: keyof ConfigDataInterface['db']['STORE_NAMES']): string;
	handleData<T>(
		store: keyof PaletteSchema,
		key: string,
		action: 'get' | 'put' | 'delete',
		data?: T
	): Promise<T | null>;
	updateData<T extends object>(
		store: keyof PaletteSchema,
		key: string,
		updateFn: (existing: T) => T
	): Promise<void>;
	withDB<T>(callback: (db: PaletteDB) => Promise<T>): Promise<T>;
}

export interface PaletteArgs {
	type: string;
	items: PaletteItem[];
	paletteID: number;
	swatches: number;
	limitDark: boolean;
	limitGray: boolean;
	limitLight: boolean;
}
