import { getConversionFn, genAllColorValues, conversionMap } from '../../src/color-spaces/conversion';
import * as colors from '../../src/index/colors';

describe('Color Conversion Utilities', () => {

    describe('getConversionFn', () => {
        it('should return a valid conversion function for hex to rgb', () => {
            const conversionFn = getConversionFn('hex', 'rgb');

            expect(conversionFn).toBeDefined();

            const hexColor: colors.Hex = { format: 'hex', value: { hex: '#FFFFFF' } };
            const rgbColor = conversionFn!(hexColor);

            expect(rgbColor).toEqual({ format: 'rgb', value: { red: 255, green: 255, blue: 255 } });
        });

        it('should return undefined if no conversion exists', () => {
            const conversionFn = getConversionFn('xyz', 'nonexistent' as keyof colors.ColorDataAssertion);

            expect(conversionFn).toBeUndefined();
        });
    });

	describe('conversionMap', () => {
        it('should have the correct conversion functions for cmyk', () => {
            const cmykConversions = conversionMap.cmyk;

            expect(cmykConversions.cmyk).toBeDefined();
			expect(cmykConversions.hex).toBeDefined();
			expect(cmykConversions.hsl).toBeDefined();
			expect(cmykConversions.hsv).toBeDefined();
			expect(cmykConversions.lab).toBeDefined();
			expect(cmykConversions.rgb).toBeDefined();
			expect(cmykConversions.xyz).toBeDefined();
        });
    });

    describe('conversionMap', () => {
        it('should have the correct conversion functions for hex', () => {
            const hexConversions = conversionMap.hex;

            expect(hexConversions.cmyk).toBeDefined();
			expect(hexConversions.hex).toBeDefined();
			expect(hexConversions.hsl).toBeDefined();
			expect(hexConversions.hsv).toBeDefined();
			expect(hexConversions.lab).toBeDefined();
			expect(hexConversions.rgb).toBeDefined();
			expect(hexConversions.xyz).toBeDefined();
        });
    });

	describe('conversionMap', () => {
        it('should have the correct conversion functions for hsl', () => {
            const hslConversions = conversionMap.hsl;

            expect(hslConversions.cmyk).toBeDefined();
			expect(hslConversions.hex).toBeDefined();
			expect(hslConversions.hsl).toBeDefined();
			expect(hslConversions.hsv).toBeDefined();
			expect(hslConversions.lab).toBeDefined();
			expect(hslConversions.rgb).toBeDefined();
			expect(hslConversions.xyz).toBeDefined();
        });
    });

	describe('conversionMap', () => {
        it('should have the correct conversion functions for hsv', () => {
            const hsvConversions = conversionMap.hsv;

            expect(hsvConversions.cmyk).toBeDefined();
			expect(hsvConversions.hex).toBeDefined();
			expect(hsvConversions.hsl).toBeDefined();
			expect(hsvConversions.hsv).toBeDefined();
			expect(hsvConversions.lab).toBeDefined();
			expect(hsvConversions.rgb).toBeDefined();
			expect(hsvConversions.xyz).toBeDefined();
        });
    });

	describe('conversionMap', () => {
        it('should have the correct conversion functions for rgb', () => {
            const rgbConversions = conversionMap.rgb;

            expect(rgbConversions.cmyk).toBeDefined();
			expect(rgbConversions.hex).toBeDefined();
			expect(rgbConversions.hsl).toBeDefined();
			expect(rgbConversions.hsv).toBeDefined();
			expect(rgbConversions.lab).toBeDefined();
			expect(rgbConversions.rgb).toBeDefined();
			expect(rgbConversions.xyz).toBeDefined();
        });
    });

	describe('conversionMap', () => {
        it('should have the correct conversion functions for xyz', () => {
            const xyzConversions = conversionMap.xyz;

            expect(xyzConversions.cmyk).toBeDefined();
			expect(xyzConversions.hex).toBeDefined();
			expect(xyzConversions.hsl).toBeDefined();
			expect(xyzConversions.hsv).toBeDefined();
			expect(xyzConversions.lab).toBeDefined();
			expect(xyzConversions.rgb).toBeDefined();
			expect(xyzConversions.xyz).toBeDefined();
        });
    });

    describe('genAllColorValues', () => {
        it('should generate all color values for a valid hex color', () => {
            const hexColor: colors.Hex = { format: 'hex', value: { hex: '#FF0000' } };
            const allValues = genAllColorValues(hexColor);

			expect(allValues.hex).toEqual(hexColor);
            expect(allValues.rgb).toEqual({ format: 'rgb', value: { red: 255, green: 0, blue: 0 } });
            expect(allValues.hsl).toEqual({ format: 'hsl', value: { hue: 0, saturation: 100, lightness: 50 } });
        });

        it('should return an empty object for invalid color input', () => {
            const invalidColor: any = { format: 'invalid', value: {} };
            const allValues = genAllColorValues(invalidColor);

            expect(allValues).toEqual({});
        });

        it('should generate all color values for a valid RGB color', () => {
            const rgbColor: colors.RGB = { format: 'rgb', value: { red: 0, green: 0, blue: 255 } };
            const allValues = genAllColorValues(rgbColor);

            expect(allValues.hex?.value.hex).toEqual('#0000FF');
            expect(allValues.hsl?.value).toEqual({ hue: 240, saturation: 100, lightness: 50 });
        });
    });

});
