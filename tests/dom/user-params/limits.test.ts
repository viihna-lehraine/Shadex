import { colorLimits } from '../../../src/dom/user-params/limits';
import * as colors from '../../../src/index/colors';

describe('DOM palette limits Module', () => {
    const validCMYK: colors.CMYK = { format: 'cmyk', value: { cyan: 10, magenta: 10, yellow: 10, key: 10 } };
    const validHex: colors.Hex = { format: 'hex', value: { hex: '#aaaaaa' } };
    const validHSL: colors.HSL = { format: 'hsl', value: { hue: 120, saturation: 50, lightness: 50 } };
	const validHSV: colors.HSV = { format: 'hsv', value: { hue: 240, saturation: 50, value: 50 } };
	const validLAB: colors.LAB = { format: 'lab', value: { l: 50, a: 0, b: 0 } };
    const validRGB: colors.RGB = { format: 'rgb', value: { red: 100, green: 100, blue: 100 } };
	const validXYZ: colors.XYZ = { format: 'xyz', value: { x: 0.9505, y: 1, z: 1.0891 } };

    describe('CMYK Limits', () => {
        it('should identify bright CMYK correctly', () => {
            const brightCMYK = { ...validCMYK, value: { cyan: 5, magenta: 5, yellow: 5, key: 0 } };
            expect(colorLimits.isCMYKTooBright(brightCMYK)).toBe(true);
        });

        it('should identify dark CMYK correctly', () => {
            const darkCMYK = { ...validCMYK, value: { cyan: 10, magenta: 10, yellow: 10, key: 95 } };
            expect(colorLimits.isCMYKTooDark(darkCMYK)).toBe(true);
        });

        it('should identify gray CMYK correctly', () => {
            const grayCMYK = { ...validCMYK, value: { cyan: 20, magenta: 20, yellow: 20, key: 0 } };
            expect(colorLimits.isCMYKTooGray(grayCMYK)).toBe(true);
        });
    });

    describe('Hex Limits', () => {
        it('should identify bright Hex correctly', () => {
            const brightHex: colors.Hex = { format: 'hex', value: { hex: '#ffffff' } };

            expect(colorLimits.isHexTooBright(brightHex)).toBe(true);
        });

        it('should identify dark Hex correctly', () => {
            const darkHex: colors.Hex = { format: 'hex', value: { hex: '#000000' } };

            expect(colorLimits.isHexTooDark(darkHex)).toBe(true);
        });

        it('should identify gray Hex correctly', () => {
            const grayHex: colors.Hex = { format: 'hex', value: { hex: '#888888' } };

            expect(colorLimits.isHexTooGray(grayHex)).toBe(true);
        });
    });

    describe('HSL Limits', () => {
        it('should identify bright HSL correctly', () => {
            const brightHSL: colors.HSL = { format: 'hsl', value: { hue: 0, saturation: 100, lightness: 90 } };

            expect(colorLimits.isHSLTooBright(brightHSL)).toBe(true);
        });

        it('should identify dark HSL correctly', () => {
            const darkHSL: colors.HSL = { format: 'hsl', value: { hue: 0, saturation: 100, lightness: 10 } };

            expect(colorLimits.isHSLTooDark(darkHSL)).toBe(true);
        });

        it('should identify gray HSL correctly', () => {
            const grayHSL: colors.HSL = { format: 'hsl', value: { hue: 0, saturation: 5, lightness: 50 } };

            expect(colorLimits.isHSLTooGray(grayHSL)).toBe(true);
        });
    });

	describe('HSV Limits', () => {
        it('should identify bright HSV correctly', () => {
            const brightHSV: colors.HSV = { format: 'hsv', value: { hue: 0, saturation: 0, value: 100 } };

            expect(colorLimits.isHSVTooBright(brightHSV)).toBe(true);
        });

        it('should identify dark HSV correctly', () => {
            const darkHSV: colors.HSV = { format: 'hsv', value: { hue: 0, saturation: 0, value: 10 } };

            expect(colorLimits.isHSVTooDark(darkHSV)).toBe(true);
        });

        it('should identify gray HSV correctly', () => {
            const grayHSV: colors.HSV = { format: 'hsv', value: { hue: 0, saturation: 5, value: 50 } };

            expect(colorLimits.isHSVTooGray(grayHSV)).toBe(true);
        });
    });

	describe('LAB Limits', () => {
		it('should identify bright LAB correctly', () => {
			const brightLAB: colors.LAB = { format: 'lab', value: { l: 100, a: 0, b: 0 } };

			expect(colorLimits.isLABTooBright(brightLAB)).toBe(true);
		});

		it('should identify dark LAB correctly', () => {
			const darkLAB: colors.LAB = { format: 'lab', value: { l: 0, a: 0, b: 0 } };

			expect(colorLimits.isLABTooDark(darkLAB)).toBe(true);
		});

		it('should identify gray LAB correctly', () => {
			const grayLAB: colors.LAB = { format: 'lab', value: { l: 50, a: 0, b: 0 } };

			expect(colorLimits.isLABTooGray(grayLAB)).toBe(true);
		});
	});

    describe('RGB Limits', () => {
        it('should identify bright RGB correctly', () => {
            const brightRGB: colors.RGB = { format: 'rgb', value: { red: 255, green: 255, blue: 255 } };

            expect(colorLimits.isRGBTooBright(brightRGB)).toBe(true);
        });

        it('should identify dark RGB correctly', () => {
            const darkRGB: colors.RGB = { format: 'rgb', value: { red: 0, green: 0, blue: 0 } };
            expect(colorLimits.isRGBTooDark(darkRGB)).toBe(true);
        });

        it('should identify gray RGB correctly', () => {
            const grayRGB: colors.RGB = { format: 'rgb', value: { red: 120, green: 120, blue: 120 } };
            expect(colorLimits.isRGBTooGray(grayRGB)).toBe(true);
        });
    });

    describe('isColorInBounds', () => {
        it('should return true for colors within bounds', () => {
            const colorsToTest: colors.ColorDataAssertion = {
                cmyk: validCMYK,
                hex: validHex,
				hsl: validHSL,
				hsv: validHSV,
				lab: validLAB,
				rgb: validRGB,
				xyz: validXYZ
            };

            expect(colorLimits.isColorInBounds(colorsToTest)).toBe(true);
        });

        it('should return false for colors out of bounds', () => {
            const invalidColors: colors.ColorDataAssertion = {
                cmyk: validCMYK,
                hex: validHex,
				hsl: validHSL,
				lab: validLAB,
                hsv: validHSV,
				rgb: { format: 'rgb', value: { red: 300, green: 0, blue: 0 } },
				xyz: validXYZ
            };

            expect(colorLimits.isColorInBounds(invalidColors)).toBe(false);
        });
    });
});
