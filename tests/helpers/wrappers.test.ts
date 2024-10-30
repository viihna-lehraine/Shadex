import { wrappers } from '../../src/helpers/wrappers';
import { defaults } from '../../src/config/defaults';

describe('wrappers Module', () => {

    describe('hexToCMYKWrapper', () => {
        it('should convert hex to CMYK', () => {
            const result = wrappers.hexToCMYKWrapper('#ff0000');

            expect(result).toEqual({
                format: 'cmyk',
                value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
            });
        });

        it('should return default CMYK for invalid input', () => {
            const result = wrappers.hexToCMYKWrapper('invalid');

            expect(result).toEqual(defaults.cmyk);
        });
    });

    describe('hexToHSLWrapper', () => {
        it('should convert hex to HSL', () => {
            const result = wrappers.hexToHSLWrapper('#ff0000');

            expect(result).toEqual({
                format: 'hsl',
                value: { hue: 0, saturation: 100, lightness: 50 }
            });
        });

        it('should return default HSL for invalid input', () => {
            const result = wrappers.hexToHSLWrapper('invalid');

            expect(result).toEqual(defaults.hsl);
        });
    });

    describe('hexToHSVWrapper', () => {
        it('should convert hex to HSV', () => {
            const result = wrappers.hexToHSVWrapper('#ff0000');

            expect(result).toEqual({
                format: 'hsv',
                value: { hue: 0, saturation: 100, value: 100 }
            });
        });

        it('should return default HSV for invalid input', () => {
            const result = wrappers.hexToHSVWrapper('invalid');

            expect(result).toEqual(defaults.hsv);
        });
    });

    describe('hexToLABWrapper', () => {
        it('should convert hex to LAB', () => {
            const result = wrappers.hexToLABWrapper('#ff0000');

            expect(result).toEqual({
                format: 'lab',
                value: { l: 53.2329, a: 80.1093, b: 67.2201 }
            });
        });

        it('should return default LAB for invalid input', () => {
            const result = wrappers.hexToLABWrapper('invalid');

            expect(result).toEqual(defaults.lab);
        });
    });

    describe('hexToRGBWrapper', () => {
        it('should convert hex to RGB', () => {
            const result = wrappers.hexToRGBWrapper('#ff0000');

            expect(result).toEqual({
                format: 'rgb',
                value: { red: 255, green: 0, blue: 0 }
            });
        });

        it('should return default RGB for invalid input', () => {
            const result = wrappers.hexToRGBWrapper('invalid');

            expect(result).toEqual(defaults.rgb);
        });
    });

    describe('hexToSLWrapper', () => {
        it('should convert hex to SL', () => {
            const result = wrappers.hexToSLWrapper('#ff0000');

            expect(result).toEqual({
                format: 'sl',
                value: { saturation: 100, lightness: 50 }
            });
        });

        it('should return default SL for invalid input', () => {
            const result = wrappers.hexToSLWrapper('invalid');

            expect(result).toEqual(defaults.sl);
        });
    });

    describe('hexToSVWrapper', () => {
        it('should convert hex to SV', () => {
            const result = wrappers.hexToSVWrapper('#ff0000');

            expect(result).toEqual({
                format: 'sv',
                value: { saturation: 100, value: 100 }
            });
        });

        it('should return default SV for invalid input', () => {
            const result = wrappers.hexToSVWrapper('invalid');

            expect(result).toEqual(defaults.sv);
        });
    });

    describe('hexToXYZWrapper', () => {
        it('should convert hex to XYZ', () => {
            const result = wrappers.hexToXYZWrapper('#ff0000');

            expect(result).toEqual({
                format: 'xyz',
                value: { x: 41.24, y: 21.26, z: 1.93 }
            });
        });

        it('should return default XYZ for invalid input', () => {
            const result = wrappers.hexToXYZWrapper('invalid');

            expect(result).toEqual(defaults.xyz);
        });
    });
});
