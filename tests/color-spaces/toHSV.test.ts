import { toHSV } from '../../src/color-spaces/toHSV';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toHSV Conversion Functions', () => {
	const defaultHSV = defaults.hsv;

	describe('cmykToHSV', () => {
		it('should convert a valid CMYK color to HSV', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toHSV.cmykToHSV(cmyk);

			expect(result.value).toEqual({
				hue: 0,
				saturation: 100,
				value: 100
			});
		});

		it('should return default HSV for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -1, magenta: 200, yellow: 100, key: 0 }
			};
			const result = toHSV.cmykToHSV(invalidCMYK);

			expect(result).toEqual(defaultHSV);
		});
	});

	describe('hexToHSV', () => {
		it('should convert a valid Hex color to HSV', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const result = toHSV.hexToHSV(hex);

			expect(result.value).toEqual({
				hue: 0,
				saturation: 100,
				value: 100
			});
		});

		it('should return default HSV for invalid Hex input', () => {
			const invalidHex: any = {
				format: 'hex',
				value: { hex: 'invalid' }
			};
			const result = toHSV.hexToHSV(invalidHex);

			expect(result).toEqual(defaultHSV);
		});
	});

	describe('hslToHSV', () => {
		it('should convert a valid HSL color to HSV', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			};
			const result = toHSV.hslToHSV(hsl);

			expect(result.value).toEqual({
				hue: 0,
				saturation: 100,
				value: 100
			});
		});

		it('should return default HSV for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: -10, saturation: 150, lightness: 300 }
			};
			const result = toHSV.hslToHSV(invalidHSL);

			expect(result).toEqual(defaultHSV);
		});
	});

	describe('labToHSV', () => {
		it('should convert a valid LAB color to HSV', () => {
			const lab: colors.LAB = {
				format: 'lab',
				value: { l: 53.24, a: 80.09, b: 67.2 }
			};
			const result = toHSV.labToHSV(lab);

			expect(result.value).toEqual({
				hue: 0,
				saturation: 100,
				value: 100
			});
		});

		it('should return default HSV for invalid LAB input', () => {
			const invalidLAB: any = {
				format: 'lab',
				value: { l: -1, a: 300, b: 200 }
			};
			const result = toHSV.labToHSV(invalidLAB);

			expect(result).toEqual(defaultHSV);
		});
	});

	describe('rgbToHSV', () => {
		it('should convert a valid RGB color to HSV', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = toHSV.rgbToHSV(rgb);

			expect(result.value).toEqual({
				hue: 0,
				saturation: 100,
				value: 100
			});
		});

		it('should return default HSV for invalid RGB input', () => {
			const invalidRGB: any = {
				format: 'rgb',
				value: { red: -10, green: 300, blue: 400 }
			};
			const result = toHSV.rgbToHSV(invalidRGB);

			expect(result).toEqual(defaultHSV);
		});
	});

	describe('xyzToHSV', () => {
		it('should convert a valid XYZ color to HSV', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const result = toHSV.xyzToHSV(xyz);

			expect(result.value).toEqual({
				hue: 0,
				saturation: 100,
				value: 100
			});
		});

		it('should return default HSV for invalid XYZ input', () => {
			const invalidXYZ: any = {
				format: 'xyz',
				value: { x: -1, y: 200, z: 300 }
			};
			const result = toHSV.xyzToHSV(invalidXYZ);

			expect(result).toEqual(defaultHSV);
		});
	});
});
