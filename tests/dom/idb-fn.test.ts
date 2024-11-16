import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import { idbFn } from '../../src/dom/idb-fn';
import { defaults } from '../../src/config/defaults';
import * as idb from '../../src/index/idb';

describe('idb-fn: IndexedDB Operations', () => {
	beforeAll(async () => {
		const db: idb.PaletteDB = await openDB('paletteDatabase', 1, {
			upgrade(db) {
				db.createObjectStore('tables', { keyPath: 'key' });
			}
		});

		await db.put('tables', {
			key: 'test_palette_1',
			...defaults.storedPalette
		});
	});

	afterAll(async () => {
		const db = await idbFn.getDB();

		await db.delete('tables', 'test_palette_1');
	});

	it('should retrieve a stored palette from the database', async () => {
		const result = await idbFn.getTable('test_palette_1');

		expect(result).toEqual(defaults.storedPalette);
	});

	it('should log a mutation correctly', async () => {
		const logSpy = jest.spyOn(console, 'log');

		await idbFn.logMutation(defaults.mutation);

		expect(logSpy).toHaveBeenCalledWith(
			`Logged mutation: ${JSON.stringify(defaults.mutation)}`
		);
	});

	it('should save a new palette to IndexedDB', async () => {
		const newPalette = {
			...defaults.storedPalette,
			tableID: 2,
			palette: { ...defaults.storedPalette.palette, id: 'test_palette_2' }
		};

		await idbFn.savePalette('test_palette_2', newPalette);

		const savedPalette = await idbFn.getTable('test_palette_2');

		expect(savedPalette).toEqual(newPalette);
	});

	it('should update an entry in a palette', async () => {
		await idbFn.updateEntryInPalette(
			'test_palette_1',
			0,
			defaults.paletteItem
		);

		const updatedPalette = await idbFn.getTable('test_palette_1');

		expect(updatedPalette?.palette.items[0]).toEqual(defaults.paletteItem);
	});

	it('should handle non-existent palettes gracefully', async () => {
		const result = await idbFn.getTable('non_existent_palette');

		expect(result).toBeNull();
	});

	it('should throw an error if updating a non-existent entry', async () => {
		await expect(
			idbFn.updateEntryInPalette(
				'test_palette_1',
				99,
				defaults.paletteItem
			)
		).rejects.toThrow('Entry 99 not found in palette test_palette_1.');
	});
});
