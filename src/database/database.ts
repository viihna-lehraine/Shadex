import { IDBPObjectStore, openDB } from 'idb';
import { defaults } from '../config/defaults';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as idb from '../index/database';
import * as palette from '../index/palette';
import { paletteUtils } from '../utils/palette-utils';

function createMutationLogger<T extends object>(obj: T, key: string): T {
	return new Proxy(obj, {
		set(target, property, value) {
			const oldValue = target[property as keyof T];
			const success = Reflect.set(target, property, value);

			if (success) {
				logMutation({
					timestamp: new Date().toISOString(),
					key,
					action: 'update',
					newValue: { [property]: value },
					oldValue: { [property]: oldValue },
					origin: 'Proxy'
				});
			}

			return success;
		}
	});
}

const dbPromise: Promise<idb.PaletteDB> = openDB<idb.PaletteSchema>(
	'paletteDatabase',
	1,
	{
		upgrade(db) {
			try {
				const stores = [
					'customColor',
					'mutations',
					'settings',
					'tables'
				];

				stores.forEach(store => {
					if (!db.objectStoreNames.contains(store)) {
						db.createObjectStore(store, {
							keyPath: store === 'mutations' ? 'timestamp' : 'key'
						});
					}
				});
			} catch (error) {
				console.error('Error during IndexedDB upgrade:', error);

				throw error;
			}
		}
	}
);

async function getDB(): Promise<idb.PaletteDB> {
	return dbPromise;
}

async function getCurrentPaletteID(): Promise<number> {
	const db = await getDB();
	const settings = await db.get('settings', 'appSettings');

	return settings?.lastPaletteID ?? 0;
}

async function getCustomColor(): Promise<colors.HSL | null> {
	const db = await getDB();
	const entry = await db.get('customColor', 'customColor');

	return entry?.color
		? createMutationLogger(entry.color, 'customColor')
		: null;
}

function getLoggedObject<T extends object>(
	obj: T | null,
	key: string
): T | null {
	if (obj) {
		return createMutationLogger(obj, key);
	}

	return null;
}

async function getNextPaletteID(): Promise<number> {
	const currentID = await getCurrentPaletteID();
	const newID = currentID + 1;

	await updateCurrentPaletteID(newID);

	return newID;
}

async function getNextTableID(): Promise<string> {
	const settings = await getSettings();
	const nextID = settings.lastTableID + 1;

	await saveData('settings', 'appSettings', {
		...settings,
		lastTableID: nextID
	});

	return `palette_${nextID}`;
}

async function getSettings(): Promise<idb.Settings> {
	try {
		const db = await getDB();
		const settings = await db.get('settings', 'appSettings');

		return settings ?? defaults.settings;
	} catch (error) {
		console.error('Error fetching settings:', error);

		return { colorSpace: 'hex', lastTableID: 0 };
	}
}

async function getTable(id: string): Promise<idb.StoredPalette | null> {
	const db = await getDB();
	const result = await db.get('tables', id);

	if (!result) console.warn(`Table with ID ${id} not found.`);
	return result;
}

async function getStore<StoreName extends keyof idb.PaletteSchema>(
	storeName: StoreName,
	mode: 'readonly'
): Promise<
	IDBPObjectStore<idb.PaletteSchema, [StoreName], StoreName, 'readonly'>
>;

async function getStore<StoreName extends keyof idb.PaletteSchema>(
	storeName: StoreName,
	mode: 'readwrite'
): Promise<
	IDBPObjectStore<idb.PaletteSchema, [StoreName], StoreName, 'readwrite'>
>;

async function getStore<StoreName extends keyof idb.PaletteSchema>(
	storeName: StoreName,
	mode: 'readonly' | 'readwrite'
) {
	const db = await getDB();
	return db.transaction(storeName, mode).objectStore(storeName);
}

async function logMutation(log: idb.MutationLog): Promise<void> {
	const db = await getDB();

	await db.put('mutations', log);

	console.log(`Logged mutation: ${JSON.stringify(log)}`);
}

async function renderPalette(tableId: string): Promise<void> {
	try {
		const storedPalette = await getTable(tableId);
		const paletteRow = document.getElementById('palette-row');

		if (!storedPalette) throw new Error(`Palette ${tableId} not found.`);
		if (!paletteRow) throw new Error('Palette row element not found.');

		paletteRow.innerHTML = '';

		const fragment = document.createDocumentFragment();
		const table = document.createElement('table');
		table.classList.add('palette-table');

		storedPalette.palette.items.forEach((item, index) => {
			const row = document.createElement('tr');
			const cell = document.createElement('td');
			const colorBox = document.createElement('div');

			cell.textContent = `Color ${index + 1}`;
			colorBox.classList.add('color-box');
			colorBox.style.backgroundColor = item.cssStrings.hexCSSString;

			row.appendChild(colorBox);
			row.appendChild(cell);
			table.appendChild(row);
		});

		fragment.appendChild(table);
		paletteRow.appendChild(fragment);

		console.log(`Rendered palette ${tableId}.`);
	} catch (error) {
		console.error(`Failed to render palette: ${error}`);
	}
}

async function saveData<T>(
	storeName: keyof idb.PaletteSchema,
	key: string,
	data: T,
	oldValue?: T
): Promise<void> {
	try {
		const db = await getDB();
		const tx = db.transaction(storeName, 'readwrite');
		const store = tx.objectStore(storeName);

		await store.put({ key, ...data });
		await tx.done;

		console.log(`${key} saved to ${storeName}.`);

		await logMutation({
			timestamp: new Date().toISOString(),
			key,
			action: 'update',
			newValue: data,
			oldValue: oldValue ? oldValue : null,
			origin: 'saveData'
		});
	} catch (error) {
		console.error(`Failed to save data to ${storeName}:`, error);

		throw error;
	}
}

async function savePalette(
	id: string,
	newPalette: idb.StoredPalette
): Promise<void> {
	try {
		const store = await getStore('tables', 'readwrite');
		const paletteToSave: idb.StoredPalette = {
			tableID: newPalette.tableID,
			palette: newPalette.palette
		};

		await store.put({ key: id, ...paletteToSave });

		console.log(`Palette ${id} saved successfully.`);
	} catch (error) {
		console.error(`Failed to save palette ${id}: ${error}`);
		throw error;
	}
}

async function savePaletteToDB(
	type: string,
	items: palette.PaletteItem[],
	baseColor: colors.HSL,
	numBoxes: number,
	enableAlpha: boolean,
	limitBright: boolean,
	limitDark: boolean,
	limitGray: boolean
): Promise<palette.Palette> {
	const paletteID = await getNextPaletteID();

	const newPalette = paletteUtils.createPaletteObject(
		type,
		items,
		baseColor,
		paletteID,
		numBoxes,
		enableAlpha,
		limitBright,
		limitDark,
		limitGray
	);

	await savePalette(newPalette.id, {
		tableID: parseInt(newPalette.id.split('_')[1]),
		palette: newPalette
	});

	console.log(`Saved ${type} palette: ${JSON.stringify(newPalette)}`);

	return newPalette;
}

async function saveSettings(newSettings: idb.Settings): Promise<void> {
	try {
		await saveData('settings', 'appSettings', newSettings);

		console.log('Settings updated');
	} catch (error) {
		console.error(`Failed to save settings: ${error}`);

		throw error;
	}
}

async function trackedTransaction<StoreName extends keyof idb.PaletteSchema>(
	storeName: StoreName,
	mode: 'readonly' | 'readwrite',
	callback: (
		store: IDBPObjectStore<
			idb.PaletteSchema,
			[StoreName],
			StoreName,
			'readonly' | 'readwrite'
		>
	) => Promise<void>
): Promise<void> {
	const db = await getDB();
	const tx = db.transaction(storeName, mode);
	const store = tx.objectStore(storeName);

	try {
		await callback(store);
		await tx.done;

		console.log(`Transaction on ${storeName} completed.`);
	} catch (error) {
		console.error(`Transaction on ${storeName} failed: ${error}`);

		throw error;
	}
}

async function updateCurrentPaletteID(newID: number): Promise<void> {
	const db = await getDB();
	const tx = db.transaction('settings', 'readwrite');
	const store = tx.objectStore('settings');

	await store.put({ key: 'appSettings', lastPaletteID: newID });
	await tx.done;

	console.log(`Current palette ID updated to ${newID}`);
}

async function updateEntryInPalette(
	tableID: string,
	entryIndex: number,
	newEntry: palette.PaletteItem
): Promise<void> {
	try {
		const storedPalette = await getTable(tableID);

		if (!storedPalette) throw new Error(`Palette ${tableID} not found.`);

		const { items } = storedPalette.palette;

		if (entryIndex >= items.length)
			throw new Error(
				`Entry ${entryIndex} not found in palette ${tableID}.`
			);

		const oldEntry = items[entryIndex];
		items[entryIndex] = newEntry;

		await saveData('tables', tableID, storedPalette);
		await logMutation({
			timestamp: new Date().toISOString(),
			key: `${tableID}-${entryIndex}]`,
			action: 'update',
			newValue: newEntry,
			oldValue: oldEntry,
			origin: 'updateEntryInPalette'
		});

		console.log(`Entry ${entryIndex} in palette ${tableID} updated.`);
	} catch (error) {
		console.error(`Failed to update entry in palette: ${error}`);

		throw error;
	}
}

export const database: fnObjects.Database = {
	createMutationLogger,
	deleteTable: async (id: string) => {
		const db = await getDB();
		await db.delete('tables', id);
		console.log(`Table ${id} deleted.`);
	},
	getCurrentPaletteID,
	getCustomColor,
	getDB,
	getLoggedObject,
	getNextPaletteID,
	getNextTableID,
	getSettings,
	getStore,
	getTable,
	listTables: async () => {
		const db = await getDB();
		const keys = await db.getAllKeys('tables');
		return keys.map(String);
	},
	logMutation,
	renderPalette,
	saveData,
	savePalette,
	savePaletteToDB,
	saveSettings,
	trackedTransaction,
	updateCurrentPaletteID,
	updateEntryInPalette
};
