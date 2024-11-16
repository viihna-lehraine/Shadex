import { conversionHelpers } from '../../src/helpers/conversion';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('conversionHelpers Module', () => {
	describe('applyGammaCorrection', () => {
		it('should apply gamma correction correctly', () => {
			const correctedValue = conversionHelpers.applyGammaCorrection(0.5);
			expect(correctedValue).toBeCloseTo(0.73536, 5);
		});

		it('should handle small values without gamma adjustment', () => {
			const correctedValue =
				conversionHelpers.applyGammaCorrection(0.002);
			expect(correctedValue).toBeCloseTo(0.02584, 5);
		});
	});

	describe('clampRGB', () => {
		it('should clamp RGB values between 0 and 255', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 300, green: -10, blue: 255 }
			};
			const clampedRGB = conversionHelpers.clampRGB(rgb);
			expect(clampedRGB.value).toEqual({ red: 255, green: 0, blue: 255 });
		});

		it('should return default RGB on invalid input', () => {
			const invalidRGB = {
				format: 'rgb',
				value: { red: 'a', green: 0, blue: 255 }
			};
			const result = conversionHelpers.clampRGB(invalidRGB as any);
			expect(result).toEqual(defaults.rgb);
		});
	});

	describe('cmykToHSLHelper', () => {
		it('should convert CMYK to HSL correctly', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const hsl = conversionHelpers.cmykToHSLHelper(cmyk);
			expect(hsl).toEqual({
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			});
		});
	});

	describe('cmykToHSVHelper', () => {
		it('should convert CMYK to HSV correctly', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const hsv = conversionHelpers.cmykToHSVHelper(cmyk);
			expect(hsv).toEqual({
				format: 'hsv',
				value: { hue: 0, saturation: 100, value: 100 }
			});
		});
	});

	describe('convertColorToRGB', () => {
		it('should convert Hex to RGB correctly', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const rgb = conversionHelpers.convertColorToRGB(hex);
			expect(rgb).toEqual({
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			});
		});

		it('should return null for unsupported color formats', () => {
			const unsupportedColor = {
				format: 'xyz',
				value: { x: 0, y: 0, z: 0 }
			};
			const result = conversionHelpers.convertColorToRGB(
				unsupportedColor as any
			);
			expect(result).toBeNull();
		});
	});

	describe('convertColorToHex', () => {
		it('should convert RGB to Hex correctly', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 255, blue: 0 }
			};
			const hex = conversionHelpers.convertColorToHex(rgb);
			expect(hex).toEqual({ format: 'hex', value: { hex: '#ffff00' } });
		});

		it('should return null for invalid color values', () => {
			const invalidColor = {
				format: 'rgb',
				value: { red: 'a', green: 255, blue: 0 }
			};
			const result = conversionHelpers.convertColorToHex(
				invalidColor as any
			);
			expect(result).toEqual(defaults.hex);
		});
	});

	describe('hueToRGB', () => {
		it('should convert hue to RGB component correctly', () => {
			const result = conversionHelpers.hueToRGB(0.2, 0.8, 0.4);
			expect(result).toBeCloseTo(0.56, 2);
		});

		it('should handle boundary conditions', () => {
			const result = conversionHelpers.hueToRGB(0.2, 0.8, 1.2);
			expect(result).toBeCloseTo(0.2, 2);
		});
	});

	describe('rgbToHSLHelper', () => {
		it('should convert RGB to HSL correctly', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const hsl = conversionHelpers.rgbToHSLHelper(rgb);
			expect(hsl).toEqual({
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			});
		});
	});

	describe('rgbToHSVHelper', () => {
		it('should convert RGB to HSV correctly', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 0, green: 255, blue: 0 }
			};
			const hsv = conversionHelpers.rgbToHSVHelper(rgb);
			expect(hsv).toEqual({
				format: 'hsv',
				value: { hue: 120, saturation: 100, value: 100 }
			});
		});
	});

	describe('xyzToHexHelper', () => {
		it('should convert XYZ to Hex correctly', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const hex = conversionHelpers.xyzToHexHelper(xyz);
			expect(hex).toEqual({ format: 'hex', value: { hex: '#ff0000' } });
		});
	});
});
