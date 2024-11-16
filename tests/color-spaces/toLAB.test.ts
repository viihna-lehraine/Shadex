import { toLAB } from '../../src/color-spaces/toLAB';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toLAB Conversion Functions', () => {
	const defaultLAB = defaults.lab;

	describe('cmykToLAB', () => {
		it('should convert a valid CMYK color to LAB', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toLAB.cmykToLAB(cmyk);

			expect(result.value).toBeDefined();
		});

		it('should return default LAB for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -10, magenta: 200, yellow: 100, key: 0 }
			};
			const result = toLAB.cmykToLAB(invalidCMYK);

			expect(result).toEqual(defaultLAB);
		});
	});

	describe('hexToLAB', () => {
		it('should convert a valid Hex color to LAB', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const result = toLAB.hexToLAB(hex);

			expect(result.value).toBeDefined();
		});

		it('should return default LAB for invalid Hex input', () => {
			const invalidHex: any = {
				format: 'hex',
				value: { hex: 'invalid' }
			};
			const result = toLAB.hexToLAB(invalidHex);

			expect(result).toEqual(defaultLAB);
		});
	});

	describe('hslToLAB', () => {
		it('should convert a valid HSL color to LAB', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			};
			const result = toLAB.hslToLAB(hsl);

			expect(result.value).toBeDefined();
		});

		it('should return default LAB for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: -10, saturation: 150, lightness: 300 }
			};
			const result = toLAB.hslToLAB(invalidHSL);

			expect(result).toEqual(defaultLAB);
		});
	});

	describe('hsvToLAB', () => {
		it('should convert a valid HSV color to LAB', () => {
			const hsv: colors.HSV = {
				format: 'hsv',
				value: { hue: 0, saturation: 100, value: 100 }
			};
			const result = toLAB.hsvToLAB(hsv);

			expect(result.value).toBeDefined();
		});

		it('should return default LAB for invalid HSV input', () => {
			const invalidHSV: any = {
				format: 'hsv',
				value: { hue: -10, saturation: 120, value: 150 }
			};
			const result = toLAB.hsvToLAB(invalidHSV);

			expect(result).toEqual(defaultLAB);
		});
	});

	describe('rgbToLAB', () => {
		it('should convert a valid RGB color to LAB', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = toLAB.rgbToLAB(rgb);

			expect(result.value).toBeDefined();
		});

		it('should return default LAB for invalid RGB input', () => {
			const invalidRGB: any = {
				format: 'rgb',
				value: { red: -10, green: 300, blue: 400 }
			};
			const result = toLAB.rgbToLAB(invalidRGB);

			expect(result).toEqual(defaultLAB);
		});
	});

	describe('xyzToLAB', () => {
		it('should convert a valid XYZ color to LAB', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const result = toLAB.xyzToLAB(xyz);

			expect(result.value).toBeDefined();
		});

		it('should return default LAB for invalid XYZ input', () => {
			const invalidXYZ: any = {
				format: 'xyz',
				value: { x: -1, y: 200, z: 300 }
			};
			const result = toLAB.xyzToLAB(invalidXYZ);

			expect(result).toEqual(defaultLAB);
		});
	});
});
