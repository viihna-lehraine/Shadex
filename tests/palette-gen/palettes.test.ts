import { genPalette } from '../../src/palette-gen/palettes';
import { genHues } from '../../src/palette-gen/hues';
import * as colors from '../../src/index/colors';
import { idbFn } from '../../src/dom/idb-fn';
import { genRandomColor } from '../../src/utils/color-randomizer';
import { defaults } from '../../src/config/defaults';

const paletteGen = genPalette();

describe('Palette Generation Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBaseColor', () => {
        it('should return the provided custom color if not null', () => {
            const customColor: colors.Color = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            const result = paletteGen.getBaseColor(customColor, 'rgb');

            expect(result).toEqual(customColor);
        });

        it('should generate a random color if customColor is null', () => {
            jest.spyOn(genRandomColor, 'mockImplementation').mockReturnValue({
                format: 'rgb',
                value: { red: 0, green: 255, blue: 0 }
            });

            const result = paletteGen.getBaseColor(null, 'rgb');

            expect(result.format).toBe('rgb');
        });
    });

    describe('createPaletteItem', () => {
        it('should create a valid palette item from a color', () => {
            const color: colors.RGB = { format: 'rgb', value: { red: 0, green: 255, blue: 0 } };
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
                metadata: { numBoxes: 1, originalColorSpace: 'rgb', paletteType: 'test' }
            };

            jest.spyOn(idbFn, 'savePalette').mockResolvedValueOnce();

            await paletteGen.savePaletteToDB('test', palette.items, palette.items[0].color, 1);

            expect(idbFn.savePalette).toHaveBeenCalledWith('test_123', {
                tableID: 123,
                palette
            });
        });
    });

    describe('analogous', () => {
        it('should generate an analogous palette with valid hues', async () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 120, saturation: 50, lightness: 50 } };

            jest.spyOn(genHues, 'analogous').mockReturnValue([120, 140]);

            const result = await paletteGen.analogous(2, color, 'hsl');

            expect(result.items.length).toBe(2);
            expect(result.items[1].color.value.hue).toBe(140);
        });
    });

    describe('complementary', () => {
        it('should generate a complementary palette', async () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 60, saturation: 50, lightness: 50 } };
            const result = await paletteGen.complementary(2, color, 'hsl');

            expect(result.items.length).toBe(2);
            expect(result.items[1].color.value.hue).toBe(240);
        });
    });

    describe('monochromatic', () => {
        it('should generate a monochromatic palette', async () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 120, saturation: 50, lightness: 50 } };

            const result = await paletteGen.monochromatic(3, color, 'hsl');

            expect(result.items.length).toBe(3);
            expect(result.items[1].color.value.lightness).not.toBe(50);
        });
    });

    describe('random', () => {
        it('should generate a random palette with random colors', async () => {
            jest.spyOn(genRandomColor, 'mockImplementation').mockReturnValue({
                format: 'rgb',
                value: { red: 0, green: 0, blue: 255 }
            });

            const result = await paletteGen.random(2, null, 'rgb');

            expect(result.items.length).toBe(2);
            expect(result.items[1].color.value).toEqual({ red: 0, green: 0, blue: 255 });
        });
    });

    describe('splitComplementary', () => {
        it('should generate a split complementary palette', async () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 60, saturation: 50, lightness: 50 } };

            jest.spyOn(genHues, 'splitComplementary').mockReturnValue([80, 40]);

            const result = await paletteGen.splitComplementary(3, color, 'hsl');

            expect(result.items.length).toBe(3);
            expect(result.items[1].color.value.hue).toBe(80);
            expect(result.items[2].color.value.hue).toBe(40);
        });
    });

    describe('tetradic', () => {
        it('should generate a tetradic palette', async () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 0, saturation: 50, lightness: 50 } };

            jest.spyOn(genHues, 'tetradic').mockReturnValue([0, 180, 90, 270]);

            const result = await paletteGen.tetradic(4, color, 'hsl');

            expect(result.items.length).toBe(4);
            expect(result.items[1].color.value.hue).toBe(180);
        });
    });

    describe('updateColorBox', () => {
        it('should update the color box in the DOM', () => {
            const color: colors.Hex = { format: 'hex', value: { hex: '#00ff00' } };
            const box = document.createElement('div');
            box.id = 'color-box-1';
            document.body.appendChild(box);

            paletteGen.updateColorBox(color, 'hex', 0);

            expect(box.style.backgroundColor).toBe('#00ff00');
        });
    });
});
