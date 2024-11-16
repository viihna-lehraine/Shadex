import { toRGB } from '../../src/color-spaces/toRGB';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toRGB Conversion Functions', () => {
	const defaultRGB = defaults.rgb;

	describe('cmykToRGB', () => {
		it('should convert valid CMYK to RGB', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toRGB.cmykToRGB(cmyk);
			expect(result.value).toEqual({ red: 255, green: 0, blue: 0 });
		});

		it('should return default RGB for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -10, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toRGB.cmykToRGB(invalidCMYK);
			expect(result).toEqual(defaultRGB);
		});
	});

	describe('hexToRGB', () => {
		it('should convert valid Hex to RGB', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#00ff00' }
			};
			const result = toRGB.hexToRGB(hex);
			expect(result.value).toEqual({ red: 0, green: 255, blue: 0 });
		});

		it('should return default RGB for invalid Hex input', () => {
			const invalidHex: any = {
				format: 'hex',
				value: { hex: 'invalid' }
			};
			const result = toRGB.hexToRGB(invalidHex);
			expect(result).toEqual(defaultRGB);
		});
	});

	describe('hslToRGB', () => {
		it('should convert valid HSL to RGB', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 240, saturation: 100, lightness: 50 }
			};
			const result = toRGB.hslToRGB(hsl);
			expect(result.value).toEqual({ red: 0, green: 0, blue: 255 });
		});

		it('should return default RGB for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: -10, saturation: 120, lightness: 50 }
			};
			const result = toRGB.hslToRGB(invalidHSL);
			expect(result).toEqual(defaultRGB);
		});
	});

	describe('hsvToRGB', () => {
		it('should convert valid HSV to RGB', () => {
			const hsv: colors.HSV = {
				format: 'hsv',
				value: { hue: 60, saturation: 100, value: 100 }
			};
			const result = toRGB.hsvToRGB(hsv);
			expect(result.value).toEqual({ red: 255, green: 255, blue: 0 });
		});

		it('should return default RGB for invalid HSV input', () => {
			const invalidHSV: any = {
				format: 'hsv',
				value: { hue: 400, saturation: 100, value: 100 }
			};
			const result = toRGB.hsvToRGB(invalidHSV);
			expect(result).toEqual(defaultRGB);
		});
	});

	describe('labToRGB', () => {
		it('should convert valid LAB to RGB', () => {
			const lab: colors.LAB = {
				format: 'lab',
				value: { l: 53.24, a: 80.09, b: 67.2 }
			};
			const result = toRGB.labToRGB(lab);
			expect(result.value).toBeDefined();
		});

		it('should return default RGB for invalid LAB input', () => {
			const invalidLAB: any = {
				format: 'lab',
				value: { l: -10, a: 120, b: 300 }
			};
			const result = toRGB.labToRGB(invalidLAB);
			expect(result).toEqual(defaultRGB);
		});
	});

	describe('xyzToRGB', () => {
		it('should convert valid XYZ to RGB', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const result = toRGB.xyzToRGB(xyz);
			expect(result.value).toBeDefined();
		});

		it('should return default RGB for invalid XYZ input', () => {
			const invalidXYZ: any = {
				format: 'xyz',
				value: { x: -10, y: 120, z: 300 }
			};
			const result = toRGB.xyzToRGB(invalidXYZ);
			expect(result).toEqual(defaultRGB);
		});
	});
});
