import { toSL } from '../../src/color-spaces/toSL';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toSL Conversion Functions', () => {
	const defaultSL = defaults.sl;

	describe('cmykToSL', () => {
		it('should convert valid CMYK to SL', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toSL.cmykToSL(cmyk);
			expect(result).toEqual({
				value: { saturation: 100, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -10, magenta: 120, yellow: 0, key: 0 }
			};
			const result = toSL.cmykToSL(invalidCMYK);
			expect(result).toEqual(defaultSL);
		});
	});

	describe('hexToSL', () => {
		it('should convert valid Hex to SL', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const result = toSL.hexToSL(hex);
			expect(result).toEqual({
				value: { saturation: 100, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid Hex input', () => {
			const invalidHex: any = {
				format: 'hex',
				value: { hex: 'invalid' }
			};
			const result = toSL.hexToSL(invalidHex);
			expect(result).toEqual(defaultSL);
		});
	});

	describe('hslToSL', () => {
		it('should convert valid HSL to SL', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			};
			const result = toSL.hslToSL(hsl);
			expect(result).toEqual({
				value: { saturation: 100, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: -10, saturation: 120, lightness: 50 }
			};
			const result = toSL.hslToSL(invalidHSL);
			expect(result).toEqual(defaultSL);
		});
	});

	describe('hsvToSL', () => {
		it('should convert valid HSV to SL', () => {
			const hsv: colors.HSV = {
				format: 'hsv',
				value: { hue: 0, saturation: 100, value: 100 }
			};
			const result = toSL.hsvToSL(hsv);
			expect(result).toEqual({
				value: { saturation: 100, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid HSV input', () => {
			const invalidHSV: any = {
				format: 'hsv',
				value: { hue: 400, saturation: 120, value: 100 }
			};
			const result = toSL.hsvToSL(invalidHSV);
			expect(result).toEqual(defaultSL);
		});
	});

	describe('labToSL', () => {
		it('should convert valid LAB to SL', () => {
			const lab: colors.LAB = {
				format: 'lab',
				value: { l: 50, a: 0, b: 0 }
			};
			const result = toSL.labToSL(lab);
			expect(result).toEqual({
				value: { saturation: 0, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid LAB input', () => {
			const invalidLAB: any = {
				format: 'lab',
				value: { l: -10, a: 120, b: 300 }
			};
			const result = toSL.labToSL(invalidLAB);
			expect(result).toEqual(defaultSL);
		});
	});

	describe('rgbToSL', () => {
		it('should convert valid RGB to SL', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = toSL.rgbToSL(rgb);
			expect(result).toEqual({
				value: { saturation: 100, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid RGB input', () => {
			const invalidRGB: any = {
				format: 'rgb',
				value: { red: -10, green: 0, blue: 300 }
			};
			const result = toSL.rgbToSL(invalidRGB);
			expect(result).toEqual(defaultSL);
		});
	});

	describe('xyzToSL', () => {
		it('should convert valid XYZ to SL', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const result = toSL.xyzToSL(xyz);
			expect(result).toEqual({
				value: { saturation: 100, lightness: 50 },
				format: 'sl'
			});
		});

		it('should return default SL for invalid XYZ input', () => {
			const invalidXYZ: any = {
				format: 'xyz',
				value: { x: -10, y: 120, z: 300 }
			};
			const result = toSL.xyzToSL(invalidXYZ);
			expect(result).toEqual(defaultSL);
		});
	});
});
