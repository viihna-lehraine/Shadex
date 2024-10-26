import { IDBPObjectStore, openDB } from 'idb';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as idb from '../index/idb';
import { transforms } from '../utils/transforms';

//
// ******** DB Initialization ********

const dbPromise: Promise<idb.PaletteDB> = openDB<idb.PaletteSchema>(
	'paletteDatabase',
	1,
	{
		upgrade(db) {
			const stores = ['customColor', 'mutations', 'settings', 'tables'];
			stores.forEach(store => {
				if (!db.objectStoreNames.contains(store)) {
					db.createObjectStore(store, {
						keyPath: store === 'mutations' ? 'timestamp' : 'key'
					});
				}
			});
		}
	}
);

//
// ******** Utility Functions ********

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

async function getDB(): Promise<idb.PaletteDB> {
	return dbPromise;
}

async function getNextTableID(): Promise<string> {
	try {
		const settings = await getSettings();
		const lastTableID = settings?.lastTableID ?? 0;
		const nextID = lastTableID + 1;

		await idbFn.saveData('settings', 'appSettings', {
			...settings,
			lastTableID: nextID
		});

		return `palette_${nextID}`;
	} catch (error) {
		console.error('Failed to get the next table ID:', error);
		return 'palette_1';
	}
}

async function logMutation(log: idb.MutationLog): Promise<void> {
	try {
		const db = await getDB();
		await db.put('mutations', log);
		console.log(`Logged mutation: ${JSON.stringify(log)}`);
	} catch (error) {
		console.error(`Error logging mutation: ${error}`);
		throw error;
	}
}

//
// ******** IndexedDB Operations ********

async function getTable(id: string): Promise<idb.PaletteEntry[] | null> {
	const db = await getDB();
	const table = await db.get('tables', id);
	return table?.palette || null;
}

async function saveData<T>(
	storeName: keyof idb.PaletteSchema,
	key: string,
	data: T
): Promise<void> {
	try {
		await trackedTransaction(storeName, 'readwrite', async store => {
			const typedStore = store as IDBPObjectStore<
				idb.PaletteSchema,
				[typeof storeName],
				typeof storeName,
				'readwrite'
			>;

			await typedStore.put({ key, ...data });

			await logMutation({
				timestamp: new Date().toISOString(),
				key,
				action: 'save',
				newValue: data,
				origin: 'saveData'
			});
			console.log(`${key} saved to ${storeName}.`);
		});
	} catch (error) {
		console.error(`Failed to save data: ${error}`);
		throw error;
	}
}

//
// ******** CRUD Functions for Entries ********

async function updateTableEntry(
	tableId: string,
	entryIndex: number,
	newEntry: idb.PaletteEntry
): Promise<void> {
	try {
		const table = await getTable(tableId);

		if (!table) throw new Error(`Table ${tableId} not found.`);

		const oldEntry = table[entryIndex];

		if (!oldEntry) {
			throw new Error(
				`Entry ${entryIndex} not found in table ${tableId}.`
			);
		}

		table[entryIndex] = newEntry;

		await saveData('tables', tableId, table);
		console.log(`Entry ${entryIndex} in ${tableId} updated.`);
	} catch (error) {
		console.error(`Failed to update entry: ${error}`);
		throw error;
	}
}

async function renderPalette(tableId: string): Promise<void> {
	try {
		const palette = await getTable(tableId);
		const paletteRow = document.getElementById('palette-row');

		if (!paletteRow) {
			throw new Error('Palette row element not found.');
		}

		paletteRow.innerHTML = '';

		const table = document.createElement('table');
		table.classList.add('palette-table');

		palette?.forEach((entry, index) => {
			const row = document.createElement('tr');
			const paletteCell = document.createElement('td');
			paletteCell.textContent = `Palette ${index + 1}`;

			Object.entries(entry.colors).forEach(([_colorID, colorData]) => {
				const colorBox = document.createElement('div');
				colorBox.classList.add('color-box');
				colorBox.style.backgroundColor = transforms.getCSSColorString(
					colorData.colorSpaces.hex
				);
				row.appendChild(colorBox);
			});

			row.appendChild(paletteCell);
			table.appendChild(row);
		});

		paletteRow.appendChild(table);

		console.log(`Rendered palette ${tableId} to DOM.`);
	} catch (error) {
		console.error(`Failed to render palette: ${error}`);
		throw error;
	}
}

async function updatePalette(
	id: string,
	entryIndex: number,
	newEntry: idb.PaletteEntry
): Promise<void> {
	await trackedTransaction('tables', 'readwrite', async store => {
		const table = (await store.get(id))?.palette || [];

		if (entryIndex >= table.length) {
			throw new Error(`Entry ${entryIndex} not found in table ${id}.`);
		}

		const oldEntry = table[entryIndex];
		table[entryIndex] = newEntry;

		await (
			store as IDBPObjectStore<
				idb.PaletteSchema,
				['tables'],
				'tables',
				'readwrite'
			>
		).put({ key: id, palette: table });

		await logMutation({
			timestamp: new Date().toISOString(),
			key: id,
			action: 'update',
			newValue: newEntry,
			oldValue: oldEntry,
			origin: 'updatePalette'
		});

		console.log(`Entry ${entryIndex} in ${id} updated.`);
	});
}

//
// ******** Settings and Custom Color Operations ********

async function getCustomColor(): Promise<colors.Color | null> {
	const db = await getDB();
	const entry = await db.get('customColor', 'customColor');
	return entry?.color || null;
}

async function getSettings(): Promise<idb.Settings> {
	try {
		const db = await idbFn.getDB();
		const settings = await db.get('settings', 'appSettings');

		return settings ?? { colorSpace: 'hex', lastTableID: 0 };
	} catch (error) {
		console.error('Error fetching settings:', error);
		return { colorSpace: 'hex', lastTableID: 0 };
	}
}

// ******** Logging and Transactions ********

async function trackedTransaction<StoreName extends keyof idb.PaletteSchema>(
	storeName: StoreName,
	mode: 'readonly' | 'readwrite',
	callback: (
		store: IDBPObjectStore<
			idb.PaletteSchema,
			[StoreName],
			StoreName,
			typeof mode
		>
	) => Promise<void>
): Promise<void> {
	try {
		const db = await getDB();
		const tx = db.transaction(storeName, mode);
		const store = tx.objectStore(storeName);

		await callback(store);
		await tx.done;

		console.log(`Transaction on ${storeName} completed.`);
	} catch (error) {
		console.error(`Transaction on ${storeName} failed: ${error}`);
		throw error;
	}
}

// ******** Bundled Export ********

export const idbFn: fnObjects.IDBFn = {
	createMutationLogger,
	deleteTable: async (id: string) => {
		const db = await getDB();
		await db.delete('tables', id);
		console.log(`Table ${id} deleted.`);
	},
	getCustomColor,
	getDB,
	getNextTableID,
	getSettings,
	getTable,
	listTables: async () => {
		const db = await getDB();
		const keys = await db.getAllKeys('tables');
		return keys.map(String);
	},
	logMutation,
	renderPalette,
	saveData,
	trackedTransaction,
	updatePalette,
	updateTableEntry
};
