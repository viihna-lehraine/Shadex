import { genHues } from '../../src/palette-gen/hues';
import * as paletteHelpers from '../../src/helpers/palette';
import * as colors from '../../src/index/colors';

describe('genHues Module', () => {
    describe('analogous', () => {
        it('should generate analogous hues correctly', () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 120, saturation: 50, lightness: 50 } };
            const result = genHues.analogous(color, 3);
            expect(result.length).toBe(2);
            result.forEach(hue => expect(hue).toBeGreaterThanOrEqual(0));
        });

        it('should return an empty array for invalid color values', () => {
            const invalidColor = { format: 'rgb', value: { red: 999, green: 999, blue: 999 } };
            const result = genHues.analogous(invalidColor as colors.Color, 3);
            expect(result).toEqual([]);
        });
    });

    describe('diadic', () => {
        it('should generate diadic hues correctly', () => {
            const result = genHues.diadic(120);
            expect(result.length).toBe(2);
            expect(result[0]).toBe(120);
            expect(result[1]).toBeGreaterThanOrEqual(0);
        });
    });

    describe('hexadic', () => {
        it('should generate hexadic hues correctly', () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 120, saturation: 50, lightness: 50 } };
            const result = genHues.hexadic(color);
            expect(result.length).toBe(6);
            result.forEach(hue => expect(hue).toBeGreaterThanOrEqual(0));
        });

        it('should return an empty array for invalid colors', () => {
            const invalidColor = { format: 'rgb', value: { red: 999, green: 999, blue: 999 } };
            const result = genHues.hexadic(invalidColor as colors.Color);
            expect(result).toEqual([]);
        });
    });

    describe('splitComplementary', () => {
        it('should generate split complementary hues correctly', () => {
            const result = genHues.splitComplementary(120);
            expect(result.length).toBe(2);
            result.forEach(hue => expect(hue).toBeGreaterThanOrEqual(0));
        });
    });

    describe('tetradic', () => {
        it('should generate tetradic hues correctly', () => {
            const result = genHues.tetradic(120);
            expect(result.length).toBe(4);
            result.forEach(hue => expect(hue).toBeGreaterThanOrEqual(0));
        });
    });

    describe('triadic', () => {
        it('should generate triadic hues correctly', () => {
            const result = genHues.triadic(120);
            expect(result.length).toBe(2);
            expect(result).toEqual([240, 0]);
        });
    });
});
