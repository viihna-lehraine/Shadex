import { toHSL } from '../../src/color-spaces/toHSL';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toHSL Conversion Functions', () => {
    const defaultHSL = defaults.hsl;

    describe('cmykToHSL', () => {
        it('should convert a valid CMYK color to HSL', () => {
            const cmyk: colors.CMYK = { format: 'cmyk', value: { cyan: 0, magenta: 100, yellow: 100, key: 0 } };
            const result = toHSL.cmykToHSL(cmyk);

            expect(result.value).toEqual({ hue: 0, saturation: 100, lightness: 50 });
        });

        it('should return default HSL for invalid CMYK input', () => {
            const invalidCMYK: any = { format: 'cmyk', value: { cyan: -1, magenta: 100, yellow: 100, key: 0 } };
            const result = toHSL.cmykToHSL(invalidCMYK);

            expect(result).toEqual(defaultHSL);
        });
    });

    describe('hexToHSL', () => {
        it('should convert a valid Hex color to HSL', () => {
            const hex: colors.Hex = { format: 'hex', value: { hex: '#ff0000' } };
            const result = toHSL.hexToHSL(hex);

            expect(result.value).toEqual({ hue: 0, saturation: 100, lightness: 50 });
        });

        it('should return default HSL for invalid Hex input', () => {
            const invalidHex: any = { format: 'hex', value: { hex: 'invalid' } };
            const result = toHSL.hexToHSL(invalidHex);

            expect(result).toEqual(defaultHSL);
        });
    });

    describe('hsvToHSL', () => {
        it('should convert a valid HSV color to HSL', () => {
            const hsv: colors.HSV = { format: 'hsv', value: { hue: 0, saturation: 100, value: 100 } };
            const result = toHSL.hsvToHSL(hsv);

            expect(result.value).toEqual({ hue: 0, saturation: 100, lightness: 50 });
        });

        it('should return default HSL for invalid HSV input', () => {
            const invalidHSV: any = { format: 'hsv', value: { hue: -10, saturation: 200, value: 100 } };
            const result = toHSL.hsvToHSL(invalidHSV);

            expect(result).toEqual(defaultHSL);
        });
    });

    describe('labToHSL', () => {
        it('should convert a valid LAB color to HSL', () => {
            const lab: colors.LAB = { format: 'lab', value: { l: 53.24, a: 80.09, b: 67.2 } };
            const result = toHSL.labToHSL(lab);

            expect(result.value).toEqual({ hue: 0, saturation: 100, lightness: 50 });
        });

        it('should return default HSL for invalid LAB input', () => {
            const invalidLAB: any = { format: 'lab', value: { l: -1, a: 150, b: 300 } };
            const result = toHSL.labToHSL(invalidLAB);

            expect(result).toEqual(defaultHSL);
        });
    });

    describe('rgbToHSL', () => {
        it('should convert a valid RGB color to HSL', () => {
            const rgb: colors.RGB = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            const result = toHSL.rgbToHSL(rgb);

            expect(result.value).toEqual({ hue: 0, saturation: 100, lightness: 50 });
        });

        it('should return default HSL for invalid RGB input', () => {
            const invalidRGB: any = { format: 'rgb', value: { red: -10, green: 300, blue: 400 } };
            const result = toHSL.rgbToHSL(invalidRGB);

            expect(result).toEqual(defaultHSL);
        });
    });

    describe('xyzToHSL', () => {
        it('should convert a valid XYZ color to HSL', () => {
            const xyz: colors.XYZ = { format: 'xyz', value: { x: 41.24, y: 21.26, z: 1.93 } };
            const result = toHSL.xyzToHSL(xyz);

            expect(result.value).toEqual({ hue: 0, saturation: 100, lightness: 50 });
        });

        it('should return default HSL for invalid XYZ input', () => {
            const invalidXYZ: any = { format: 'xyz', value: { x: -1, y: 200, z: 300 } };
            const result = toHSL.xyzToHSL(invalidXYZ);

            expect(result).toEqual(defaultHSL);
        });
    });
});
