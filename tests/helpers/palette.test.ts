import { config } from '../../src/config/constants';
import { paletteHelpers } from '../../src/helpers/palette';
import * as colors from '../../src/index/colors';

describe('paletteHelpers Module', () => {

    describe('adjustSL', () => {
        it('should adjust the saturation and lightness correctly', () => {
            const color: colors.HSL = {
                format: 'hsl',
                value: { hue: 200, saturation: 50, lightness: 50 }
            };

            const result = paletteHelpers.adjustSL(color);
            expect(result.value.saturation).toBeGreaterThanOrEqual(0);
            expect(result.value.saturation).toBeLessThanOrEqual(100);
            expect(result.value.lightness).toBe(100);  // Adjusted to max
        });

        it('should return the original color for invalid input', () => {
            const invalidColor: any = { format: 'hsl', value: { hue: 200, saturation: NaN } };
            const result = paletteHelpers.adjustSL(invalidColor);

            expect(result).toEqual(invalidColor);
        });
    });

    describe('getWeightedRandomInterval', () => {
        it('should return a valid weight based on probabilities', () => {
            const weight = paletteHelpers.getWeightedRandomInterval();
            expect(weight).toBeGreaterThanOrEqual(0);
        });

        it('should return the last weight if random exceeds cumulative probabilities', () => {
            jest.spyOn(Math, 'random').mockReturnValue(1);
            const weight = paletteHelpers.getWeightedRandomInterval();
            expect(weight).toBe(config.weights[config.weights.length - 1]);
        });
    });

    describe('sanitizeLAB', () => {
        it('should clamp LAB values to the correct range', () => {
            expect(paletteHelpers.sanitizeLAB(130)).toBe(125);
            expect(paletteHelpers.sanitizeLAB(-130)).toBe(-125);
            expect(paletteHelpers.sanitizeLAB(50)).toBe(50);
        });
    });

    describe('sanitizePercentage', () => {
        it('should clamp percentage values between 0 and 100', () => {
            expect(paletteHelpers.sanitizePercentage(120)).toBe(100);
            expect(paletteHelpers.sanitizePercentage(-10)).toBe(0);
            expect(paletteHelpers.sanitizePercentage(50)).toBe(50);
        });
    });

    describe('sanitizeRadial', () => {
        it('should clamp radial values between 0 and 360', () => {
            expect(paletteHelpers.sanitizeRadial(400)).toBe(40);
            expect(paletteHelpers.sanitizeRadial(-20)).toBe(340);
        });
    });

    describe('sanitizeRGB', () => {
        it('should clamp RGB values between 0 and 255', () => {
            expect(paletteHelpers.sanitizeRGB(300)).toBe(255);
            expect(paletteHelpers.sanitizeRGB(-20)).toBe(0);
            expect(paletteHelpers.sanitizeRGB(128)).toBe(128);
        });
    });

    describe('validateColorValues', () => {
        it('should validate a valid HSL color', () => {
            const hsl: colors.HSL = {
                format: 'hsl',
                value: { hue: 200, saturation: 50, lightness: 50 }
            };

            expect(paletteHelpers.validateColorValues(hsl)).toBe(true);
        });

        it('should invalidate an HSL color with incorrect values', () => {
            const invalidHSL: any = { format: 'hsl', value: { hue: 400, saturation: NaN } };

            expect(paletteHelpers.validateColorValues(invalidHSL)).toBe(false);
        });

        it('should validate a valid RGB color', () => {
            const rgb: colors.RGB = {
                format: 'rgb',
                value: { red: 255, green: 128, blue: 64 }
            };

            expect(paletteHelpers.validateColorValues(rgb)).toBe(true);
        });

        it('should invalidate an RGB color with out-of-range values', () => {
            const invalidRGB: colors.RGB = {
                format: 'rgb',
                value: { red: 300, green: -10, blue: 64 }
            };

            expect(paletteHelpers.validateColorValues(invalidRGB)).toBe(false);
        });

        it('should validate a valid CMYK color', () => {
            const cmyk: colors.CMYK = {
                format: 'cmyk',
                value: { cyan: 0, magenta: 100, yellow: 50, key: 10 }
            };

            expect(paletteHelpers.validateColorValues(cmyk)).toBe(true);
        });

        it('should invalidate a CMYK color with incorrect values', () => {
            const invalidCMYK: colors.CMYK = {
                format: 'cmyk',
                value: { cyan: 120, magenta: -20, yellow: 50, key: 10 }
            };

            expect(paletteHelpers.validateColorValues(invalidCMYK)).toBe(false);
        });

        it('should return false for unsupported color formats', () => {
            const unsupportedColor: any = { format: 'unknown', value: {} };

            expect(paletteHelpers.validateColorValues(unsupportedColor)).toBe(false);
        });
    });
});
