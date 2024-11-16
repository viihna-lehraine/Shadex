import { generate } from '../../src/palette-gen/generate';
import { defaults } from '../../src/config/defaults';
import { genRandomColor } from '../../src/utils/color-randomizer';
import * as palette from '../../src/index/palette';
import * as colors from '../../src/index/colors';

jest.mock('../../src/index/palette', () => ({
	genPalette: jest.fn(() => ({
		random: jest.fn().mockResolvedValue({
			items: [
				{
					color: {
						format: 'rgb',
						value: { red: 255, green: 0, blue: 0 }
					}
				}
			]
		})
	}))
}));

jest.mock('../../src/utils/color-randomizer', () => ({
	genRandomColor: jest.fn().mockReturnValue({
		format: 'rgb',
		value: { red: 0, green: 0, blue: 0 }
	})
}));

describe('generate Module', () => {
	describe('validateAndConvertColor', () => {
		it('should return the same color if valid', () => {
			const validColor: colors.Color = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};

			const result = generate.validateAndConvertColor(validColor);
			expect(result).toEqual(validColor);
		});

		it('should convert a valid color string', () => {
			const validColor: colors.HSLString = {
				value: { hue: '30', saturation: '50%', lightness: '30%' },
				format: 'hsl'
			};
			const result = generate.validateAndConvertColor(validColor);

			expect(result).toEqual({
				value: {
					hue: 30,
					saturation: 50,
					lightness: 30
				},
				format: 'hsl'
			});
		});

		it('should return null for invalid color values', () => {
			const invalidColor = { format: 'rgb', value: { red: -1 } };
			const result = generate.validateAndConvertColor(
				invalidColor as any
			);

			expect(result).toBeNull();
		});
	});

	describe('genSelectedPalette', () => {
		it('should generate a random palette', async () => {
			const options: colors.PaletteOptions = {
				paletteType: 1,
				numBoxes: 2,
				colorSpace: 'rgb',
				customColor: {
					format: 'rgb',
					value: { red: 255, green: 0, blue: 0 }
				}
			};
			const result = await generate.genSelectedPalette(options);

			expect(result.items.length).toBe(1);
		});

		it('should return default palette for invalid type', async () => {
			const options = {
				paletteType: 99,
				numBoxes: 2,
				customColor: null,
				colorSpace: 'rgb' as colors.ColorSpace
			};

			const result = await generate.genSelectedPalette(options);
			expect(result).toEqual(defaults.paletteData);
		});
	});

	describe('startPaletteGen', () => {
		it('should start palette generation and generate palette boxes', async () => {
			const options: colors.PaletteOptions = {
				paletteType: 1,
				numBoxes: 2,
				colorSpace: 'rgb',
				customColor: {
					format: 'rgb',
					value: { red: 255, green: 0, blue: 0 }
				}
			};

			const mockPaletteItem = {
				id: 'mock-id',
				color: options.customColor,
				colorConversions: [],
				colorStringConversions: [],
				cssStrings: [],
				rawColorStrings: []
			};

			jest.spyOn(generate, 'genSelectedPalette').mockResolvedValue({
				items: [mockPaletteItem]
			});

			const genPaletteBoxSpy = jest.spyOn(generate, 'genPaletteBox');

			await generate.startPaletteGen(options);

			expect(genPaletteBoxSpy).toHaveBeenCalledWith(
				[mockPaletteItem],
				2,
				'table_1'
			);
		});

		it('should handle null custom color and use random color', async () => {
			const options: colors.PaletteOptions = {
				paletteType: 1,
				numBoxes: 2,
				colorSpace: 'rgb',
				customColor: null
			};

			const mockRandomColor = {
				format: 'rgb',
				value: { red: 0, green: 0, blue: 0 }
			};

			jest.spyOn(generate, 'genSelectedPalette').mockResolvedValue({
				items: [
					{
						id: 'mock-id',
						color: mockRandomColor,
						colorConversions: [],
						colorStringConversions: [],
						cssStrings: [],
						rawColorStrings: []
					}
				]
			});

			const genPaletteBoxSpy = jest.spyOn(generate, 'genPaletteBox');

			await generate.startPaletteGen(options);

			expect(genPaletteBoxSpy).toHaveBeenCalled();
		});
	});

	describe('genPaletteBox', () => {
		beforeEach(() => {
			document.body.innerHTML = `<div id="palette-row"></div>`;
		});

		it('should generate and render palette boxes', async () => {
			const items = [
				{
					color: {
						format: 'rgb',
						value: { red: 255, green: 0, blue: 0 }
					}
				},
				{
					color: {
						format: 'rgb',
						value: { red: 0, green: 255, blue: 0 }
					}
				}
			];

			await generate.genPaletteBox(items, 2, 'table_1');

			const paletteRow = document.getElementById('palette-row');
			expect(paletteRow?.children.length).toBe(2);
		});

		it('should save palette data to IDB', async () => {
			const items = [
				{
					color: {
						format: 'rgb',
						value: { red: 255, green: 0, blue: 0 }
					}
				}
			];

			await generate.genPaletteBox(items, 1, 'table_1');
			expect(idbFn.saveData).toHaveBeenCalledWith('tables', 'table_1', {
				palette: items
			});
		});
	});
});
