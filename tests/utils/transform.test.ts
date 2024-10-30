import { transform } from '../../src/utils/transform';
import * as colors from '../../src/index/colors';

describe('transform module', () => {
    describe('addHashToHex', () => {
        it('should add a hash to a hex color if missing', () => {
            const hex = { value: { hex: 'FFFFFF' }, format: 'hex' as const };
            const result = transform.addHashToHex(hex);
            expect(result.value.hex).toBe('#FFFFFF');
        });

        it('should return the same hex if already prefixed with a hash', () => {
            const hex = { value: { hex: '#123456' }, format: 'hex' as const };
            const result = transform.addHashToHex(hex);
            expect(result.value.hex).toBe('#123456');
        });
    });

    describe('colorToColorString', () => {
        it('should convert HSL color to HSL string', () => {
            const color: colors.HSL = { format: 'hsl', value: { hue: 180, saturation: 50, lightness: 40 } };
            const result = transform.colorToColorString(color);
            expect(result.value).toEqual({ hue: '180', saturation: '50%', lightness: '40%' });
        });

        it('should throw an error for unsupported formats', () => {
            const invalidColor = { format: 'unknown', value: {} } as any;
            expect(() => transform.colorToColorString(invalidColor)).toThrow('Unsupported format');
        });
    });

    describe('colorStringToColor', () => {
        it('should convert HSL string back to HSL color', () => {
            const colorString: colors.HSLValueString = { hue: '180', saturation: '50%', lightness: '40%' };
            const result = transform.colorStringToColor({ format: 'hsl', value: colorString });
            expect(result).toEqual({ format: 'hsl', value: { hue: 180, saturation: 50, lightness: 40 } });
        });
    });

    describe('componentToHex', () => {
        it('should convert component value to hex string', () => {
            expect(transform.componentToHex(255)).toBe('ff');
            expect(transform.componentToHex(0)).toBe('00');
        });

        it('should clamp values between 0 and 255', () => {
            expect(transform.componentToHex(300)).toBe('ff');
            expect(transform.componentToHex(-10)).toBe('00');
        });
    });

    describe('parseColor', () => {
        it('should parse valid RGB color string', () => {
            const result = transform.parseColor('rgb', '255,0,0');
            expect(result).toEqual({ format: 'rgb', value: { red: 255, green: 0, blue: 0 } });
        });

        it('should return null for unsupported color space', () => {
            const result = transform.parseColor('unsupported' as any, '255,0,0');
            expect(result).toBeNull();
        });
    });

    describe('stripHashFromHex', () => {
        it('should remove the hash from a hex value', () => {
            const hex = { value: { hex: '#ABCDEF' }, format: 'hex' as const };
            const result = transform.stripHashFromHex(hex);
            expect(result.value.hex).toBe('ABCDEF');
        });

        it('should return the original value if no hash present', () => {
            const hex = { value: { hex: '123456' }, format: 'hex' as const };
            const result = transform.stripHashFromHex(hex);
            expect(result.value.hex).toBe('123456');
        });
    });

    describe('getCSSColorString', () => {
        it('should format RGB color to CSS string', () => {
            const color: colors.RGB = { format: 'rgb', value: { red: 255, green: 0, blue: 0 } };
            const result = transform.getCSSColorString(color);
            expect(result).toBe('rgb(255,0,0)');
        });

        it('should return #FFFFFF for unknown formats', () => {
            const invalidColor = { format: 'unknown', value: {} } as any;
            const result = transform.getCSSColorString(invalidColor);
            expect(result).toBe('#FFFFFF');
        });
    });

    describe('parseCustomColor', () => {
        it('should parse valid hex string', () => {
            const result = transform.parseCustomColor('hex', '#FF5733');
            expect(result).toEqual({ format: 'hex', value: { hex: '#FF5733' } });
        });

        it('should return null for unsupported format', () => {
            const result = transform.parseCustomColor('unsupported' as any, 'some value');
            expect(result).toBeNull();
        });
    });

    describe('stripPercentFromValues', () => {
        it('should strip percentage signs from values', () => {
            const input = { hue: '180', saturation: '50%', lightness: '40%' };
            const result = transform.stripPercentFromValues(input);
            expect(result).toEqual({ hue: 180, saturation: 50, lightness: 40 });
        });

        it('should handle numeric values without changes', () => {
            const input = { hue: 180, saturation: 50, lightness: 40 };
            const result = transform.stripPercentFromValues(input);
            expect(result).toEqual(input);
        });
    });
});
