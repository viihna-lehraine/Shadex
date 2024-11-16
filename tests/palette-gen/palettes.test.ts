import { genPalette } from '../../src/palette-gen/palettes';
import { genHues } from '../../src/palette-gen/hues';
import * as colors from '../../src/index/colors';
import { idbFn } from '../../src/dom/idb-fn';
import * as colorRandomizer from '../../src/utils/color-randomizer';
import { guards } from '../../src/utils/type-guards';

const paletteGen = genPalette();

describe('Palette Generation Module', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getBaseColor', () => {
		it('should return the provided custom color if not null', () => {
			const customColor: colors.Color = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = paletteGen.getBaseColor(customColor, 'rgb');

			expect(result).toEqual(customColor);
		});

		it('should generate a random color if customColor is null', () => {
			jest.spyOn(colorRandomizer, 'genRandomColor').mockReturnValue({
				format: 'rgb',
				value: { red: 0, green: 255, blue: 0 }
			});

			const result = paletteGen.getBaseColor(null, 'rgb');

			expect(result.format).toBe('rgb');
		});
	});

	describe('createPaletteItem', () => {
		it('should create a valid palette item from a color', () => {
			const color: colors.RGB = {
				format: 'rgb',
				value: { red: 0, green: 255, blue: 0 }
			};
			const item = paletteGen.createPaletteItem(color);

			expect(item.color).toEqual(color);
			expect(item.colorConversions).toBeDefined();
			expect(item.id).toMatch(/^rgb_/);
		});
	});

	describe('savePaletteToDB', () => {
		it('should save the palette to IndexedDB', async () => {
			const mockPaletteItem = paletteGen.createPaletteItem({
				format: 'rgb',
				value: { red: 0, green: 255, blue: 0 }
			});
			const palette = {
				id: 'test_123',
				items: [mockPaletteItem],
				metadata: {
					numBoxes: 1,
					originalColorSpace: 'rgb',
					paletteType: 'test'
				}
			};

			jest.spyOn(idbFn, 'savePalette').mockResolvedValueOnce();

			await paletteGen.savePaletteToDB(
				'test',
				palette.items,
				palette.items[0].color,
				1
			);

			expect(idbFn.savePalette).toHaveBeenCalledWith('test_123', {
				tableID: 123,
				palette
			});
		});
	});

	describe('analogous', () => {
		it('should generate an analogous palette with valid hues', async () => {
			const color: colors.HSL = {
				format: 'hsl',
				value: { hue: 120, saturation: 50, lightness: 50 }
			};

			jest.spyOn(genHues, 'analogous').mockReturnValue([120, 140]);

			const result = await paletteGen.analogous(2, color, 'hsl');

			expect(result.items.length).toBe(2);

			const secondColorValue = result.items[1].color.value;

			if (guards.isHSLColor({ format: 'hsl', value: secondColorValue })) {
				const hslValue = secondColorValue as colors.HSLValue;

				expect(hslValue.hue).toBe(140);
			} else {
				throw new Error('Expected an HSL color value');
			}
		});

		it('should return an empty palette if numBoxes < 2', async () => {
			const result = await paletteGen.analogous(1, null, 'hsl');

			expect(result.items.length).toBe(0);
			expect(console.warn).toHaveBeenCalledWith(
				'Analogous palette requires at least 2 swatches.'
			);
		});
	});

	describe('complementary', () => {
		it('should generate a complementary palette', async () => {
			const color: colors.HSL = {
				format: 'hsl',
				value: { hue: 60, saturation: 50, lightness: 50 }
			};
			const result = await paletteGen.complementary(2, color, 'hsl');

			expect(result.items.length).toBe(2);

			const hslValue = result.items[1].color.value as colors.HSLValue;

			expect(result.items.length).toBe(2);
			expect(hslValue.hue).toBe(240);
		});

		it('should return an empty palette if numBoxes < 2', async () => {
			const result = await paletteGen.complementary(1, null, 'hsl');

			expect(result.items.length).toBe(0);
			expect(console.warn).toHaveBeenCalledWith(
				'Complementary palette requires at least 2 swatches.'
			);
		});
	});

	describe('monochromatic', () => {
		it('should generate a monochromatic palette', async () => {
			const color: colors.HSL = {
				format: 'hsl',
				value: { hue: 120, saturation: 50, lightness: 50 }
			};
			const result = await paletteGen.monochromatic(3, color, 'hsl');

			expect(result.items.length).toBe(3);

			const hslValue = result.items[1].color.value as colors.HSLValue;

			expect(result.items.length).toBe(3);
			expect(hslValue.lightness).not.toBe(50);
		});

		it('should return an empty palette if numBoxes < 2', async () => {
			const result = await paletteGen.monochromatic(1, null, 'hsl');

			expect(result.items.length).toBe(0);
			expect(console.warn).toHaveBeenCalledWith(
				'Monochromatic palette requires at least 2 swatches.'
			);
		});
	});

	describe('random', () => {
		it('should generate a random palette with random colors', async () => {
			jest.spyOn(colorRandomizer, 'genRandomColor').mockReturnValue({
				format: 'rgb',
				value: { red: 0, green: 0, blue: 255 }
			});

			const result = await paletteGen.random(2, null, 'rgb');
			const rgbValue = result.items[1].color.value as colors.RGBValue;

			expect(result.items.length).toBe(2);
			expect(rgbValue).toEqual({ red: 0, green: 0, blue: 255 });
		});
	});

	describe('splitComplementary', () => {
		it('should generate a split complementary palette', async () => {
			const color: colors.HSL = {
				format: 'hsl',
				value: { hue: 60, saturation: 50, lightness: 50 }
			};

			jest.spyOn(genHues, 'splitComplementary').mockReturnValue([80, 40]);

			const result = await paletteGen.splitComplementary(3, color, 'hsl');
			const hslValue1 = result.items[1].color.value as colors.HSLValue;
			const hslValue2 = result.items[2].color.value as colors.HSLValue;

			expect(result.items.length).toBe(3);
			expect(hslValue1.hue).toBe(80);
			expect(hslValue2.hue).toBe(40);
		});
	});

	describe('tetradic', () => {
		it('should generate a tetradic palette', async () => {
			const color: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 50, lightness: 50 }
			};

			jest.spyOn(genHues, 'tetradic').mockReturnValue([0, 180, 90, 270]);

			const result = await paletteGen.tetradic(4, color, 'hsl');

			expect(result.items.length).toBe(4);

			const hslValue = result.items[1].color.value as colors.HSLValue;

			expect(result.items.length).toBe(4);
			expect(hslValue.hue).toBe(180);
		});

		it('should return an empty palette if numBoxes < 4', async () => {
			const result = await paletteGen.tetradic(3, null, 'hsl');

			expect(result.items.length).toBe(0);
			expect(console.warn).toHaveBeenCalledWith(
				'Tetradic palette requires at least 4 swatches.'
			);
		});
	});

	describe('triadic', () => {
		it('should generate a triadic palette with valid hues', async () => {
			const color: colors.HSL = {
				format: 'hsl',
				value: { hue: 30, saturation: 50, lightness: 50 }
			};

			jest.spyOn(genHues, 'triadic').mockReturnValue([150, 270]);

			const result = await paletteGen.triadic(3, color, 'hsl');

			expect(result.items.length).toBe(3);

			const firstHSL = result.items[1].color.value as colors.HSLValue;
			const secondHSL = result.items[2].color.value as colors.HSLValue;

			expect(firstHSL.hue).toBe(150);
			expect(secondHSL.hue).toBe(270);
		});

		it('should return an empty palette if numBoxes < 3', async () => {
			const result = await paletteGen.triadic(2, null, 'hsl');

			expect(result.items.length).toBe(0);
			expect(console.warn).toHaveBeenCalledWith(
				'Triadic palette requires at least 3 swatches.'
			);
		});
	});

	describe('updateColorBox', () => {
		it('should update the color box in the DOM', () => {
			const color: colors.Hex = {
				format: 'hex',
				value: { hex: '#00ff00' }
			};
			const box = document.createElement('div');
			box.id = 'color-box-1';
			document.body.appendChild(box);

			paletteGen.updateColorBox(color, 'hex', 0);

			expect(box.style.backgroundColor).toBe('#00ff00');
		});
	});
});
