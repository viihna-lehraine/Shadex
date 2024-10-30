import { toCMYK } from '../../src/color-spaces/toCMYK';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toCMYK Conversion Functions', () => {
    const defaultCMYK = defaults.cmyk;

    describe('hexToCMYK', () => {
        it('should convert a valid hex color to CMYK', () => {
            const hexColor: colors.Hex = { format: 'hex', value: { hex: '#FF0000' } };
            const result = toCMYK.hexToCMYK(hexColor);

            expect(result.value).toEqual({ cyan: 0, magenta: 100, yellow: 100, key: 0 });
        });

        it('should return default CMYK for invalid hex input', () => {
            const invalidHex: any = { format: 'hex', value: { hex: '#ZZZZZZ' } };
            const result = toCMYK.hexToCMYK(invalidHex);

            expect(result).toEqual(defaultCMYK);
        });
    });

    describe('hslToCMYK', () => {
        it('should convert a valid HSL color to CMYK', () => {
            const hslColor: colors.HSL = { format: 'hsl', value: { hue: 0, saturation: 100, lightness: 50 } };
            const result = toCMYK.hslToCMYK(hslColor);

            expect(result.value).toEqual({ cyan: 0, magenta: 100, yellow: 100, key: 0 });
        });

        it('should return default CMYK for invalid HSL input', () => {
            const invalidHSL: any = { format: 'hsl', value: { hue: -1, saturation: 200, lightness: 150 } };
            const result = toCMYK.hslToCMYK(invalidHSL);

            expect(result).toEqual(defaultCMYK);
        });
    });

	describe('hsvToCMYK', () => {
        it('should convert a valid HSV color to CMYK', () => {
            const hsvColor: colors.HSV = { format: 'hsv', value: { hue: 0, saturation: 100, value: 100 } };
            const result = toCMYK.hsvToCMYK(hsvColor);

            expect(result.value).toEqual({ cyan: 0, magenta: 100, yellow: 100, key: 0 });
        });

        it('should return default CMYK for invalid HSV input', () => {
            const invalidHSV: any = { format: 'hsv', value: { hue: 400, saturation: -10, value: 200 } };
            const result = toCMYK.hsvToCMYK(invalidHSV);

            expect(result).toEqual(defaultCMYK);
        });
    });

	describe('labToCMYK', () => {
        it('should convert a valid LAB color to CMYK', () => {
            const labColor: colors.LAB = { format: 'lab', value: { l: 53.24, a: 80.09, b: 67.2 } };
            const result = toCMYK.labToCMYK(labColor);

            expect(result.value).toEqual({ cyan: 0, magenta: 100, yellow: 100, key: 0 });
        });

        it('should return default CMYK for invalid LAB input', () => {
            const invalidLAB: any = { format: 'lab', value: { l: -1, a: 128, b: -128 } };
            const result = toCMYK.labToCMYK(invalidLAB);

            expect(result).toEqual(defaultCMYK);
        });
    });

    describe('rgbToCMYK', () => {
        it('should convert a valid RGB color to CMYK', () => {
            const rgbColor: colors.RGB = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            const result = toCMYK.rgbToCMYK(rgbColor);

            expect(result.value).toEqual({ cyan: 0, magenta: 100, yellow: 100, key: 0 });
        });

        it('should return default CMYK for invalid RGB input', () => {
            const invalidRGB: any = { format: 'rgb', value: { red: -10, green: 300, blue: 400 } };
            const result = toCMYK.rgbToCMYK(invalidRGB);

            expect(result).toEqual(defaultCMYK);
        });
    });

    describe('xyzToCMYK', () => {
        it('should convert a valid XYZ color to CMYK', () => {
            const xyzColor: colors.XYZ = { format: 'xyz', value: { x: 41.24, y: 21.26, z: 1.93 } };
            const result = toCMYK.xyzToCMYK(xyzColor);

            expect(result.value).toEqual({ cyan: 100, magenta: 47, yellow: 0, key: 24 });
        });

        it('should return default CMYK for invalid XYZ input', () => {
            const invalidXYZ: any = { format: 'xyz', value: { x: -1, y: 200, z: 300 } };
            const result = toCMYK.xyzToCMYK(invalidXYZ);

            expect(result).toEqual(defaultCMYK);
        });
    });
});
