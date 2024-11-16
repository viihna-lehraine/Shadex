import { toHex } from '../../src/color-spaces/toHex';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toHex Conversion Functions', () => {
	const defaultHex = defaults.hex;

	describe('cmykToHex', () => {
		it('should convert a valid CMYK color to Hex', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toHex.cmykToHex(cmyk);

			expect(result.value.hex).toBe('#ff0000');
		});

		it('should return default hex for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -1, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toHex.cmykToHex(invalidCMYK);

			expect(result).toEqual(defaultHex);
		});
	});

	describe('hslToHex', () => {
		it('should convert a valid HSL color to Hex', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			};
			const result = toHex.hslToHex(hsl);

			expect(result.value.hex).toBe('#ff0000');
		});

		it('should return default hex for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: 400, saturation: 100, lightness: 50 }
			};
			const result = toHex.hslToHex(invalidHSL);

			expect(result).toEqual(defaultHex);
		});
	});

	describe('hsvToHex', () => {
		it('should convert a valid HSV color to Hex', () => {
			const hsv: colors.HSV = {
				format: 'hsv',
				value: { hue: 0, saturation: 100, value: 100 }
			};
			const result = toHex.hsvToHex(hsv);

			expect(result.value.hex).toBe('#ff0000');
		});

		it('should return default hex for invalid HSV input', () => {
			const invalidHSV: any = {
				format: 'hsv',
				value: { hue: -10, saturation: 200, value: 100 }
			};
			const result = toHex.hsvToHex(invalidHSV);

			expect(result).toEqual(defaultHex);
		});
	});

	describe('labToHex', () => {
		it('should convert a valid LAB color to Hex', () => {
			const lab: colors.LAB = {
				format: 'lab',
				value: { l: 53.24, a: 80.09, b: 67.2 }
			};
			const result = toHex.labToHex(lab);

			expect(result.value.hex).toBe('#ff0000');
		});

		it('should return default hex for invalid LAB input', () => {
			const invalidLAB: any = {
				format: 'lab',
				value: { l: -1, a: 150, b: 300 }
			};
			const result = toHex.labToHex(invalidLAB);

			expect(result).toEqual(defaultHex);
		});
	});

	describe('rgbToHex', () => {
		it('should convert a valid RGB color to Hex', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = toHex.rgbToHex(rgb);

			expect(result.value.hex).toBe('#ff0000');
		});

		it('should return default hex for invalid RGB input', () => {
			const invalidRGB: any = {
				format: 'rgb',
				value: { red: -10, green: 300, blue: 400 }
			};
			const result = toHex.rgbToHex(invalidRGB);

			expect(result).toEqual(defaultHex);
		});
	});

	describe('xyzToHex', () => {
		it('should convert a valid XYZ color to Hex', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const result = toHex.xyzToHex(xyz);

			expect(result.value.hex).toBe('#ff0000');
		});

		it('should return default hex for invalid XYZ input', () => {
			const invalidXYZ: any = {
				format: 'xyz',
				value: { x: -1, y: 200, z: 300 }
			};
			const result = toHex.xyzToHex(invalidXYZ);

			expect(result).toEqual(defaultHex);
		});
	});
});
