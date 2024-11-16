import { toSV } from '../../src/color-spaces/toSV';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toSV Conversion Functions', () => {
	const defaultSV = defaults.sv;

	describe('cmykToSV', () => {
		it('should convert valid CMYK to SV', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toSV.cmykToSV(cmyk);
			expect(result).toEqual({
				value: { saturation: 100, value: 100 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -10, magenta: 120, yellow: 0, key: 0 }
			};
			const result = toSV.cmykToSV(invalidCMYK);
			expect(result).toEqual(defaultSV);
		});
	});

	describe('hexToSV', () => {
		it('should convert valid Hex to SV', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const result = toSV.hexToSV(hex);
			expect(result).toEqual({
				value: { saturation: 100, value: 100 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid Hex input', () => {
			const invalidHex: any = {
				format: 'hex',
				value: { hex: 'invalid' }
			};
			const result = toSV.hexToSV(invalidHex);
			expect(result).toEqual(defaultSV);
		});
	});

	describe('hslToSV', () => {
		it('should convert valid HSL to SV', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			};
			const result = toSV.hslToSV(hsl);
			expect(result).toEqual({
				value: { saturation: 100, value: 100 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: -10, saturation: 120, lightness: 50 }
			};
			const result = toSV.hslToSV(invalidHSL);
			expect(result).toEqual(defaultSV);
		});
	});

	describe('hsvToSV', () => {
		it('should convert valid HSV to SV', () => {
			const hsv: colors.HSV = {
				format: 'hsv',
				value: { hue: 0, saturation: 100, value: 100 }
			};
			const result = toSV.hsvToSV(hsv);
			expect(result).toEqual({
				value: { saturation: 100, value: 100 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid HSV input', () => {
			const invalidHSV: any = {
				format: 'hsv',
				value: { hue: 400, saturation: 120, value: 100 }
			};
			const result = toSV.hsvToSV(invalidHSV);
			expect(result).toEqual(defaultSV);
		});
	});

	describe('labToSV', () => {
		it('should convert valid LAB to SV', () => {
			const lab: colors.LAB = {
				format: 'lab',
				value: { l: 50, a: 0, b: 0 }
			};
			const result = toSV.labToSV(lab);
			expect(result).toEqual({
				value: { saturation: 0, value: 50 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid LAB input', () => {
			const invalidLAB: any = {
				format: 'lab',
				value: { l: -10, a: 120, b: 300 }
			};
			const result = toSV.labToSV(invalidLAB);
			expect(result).toEqual(defaultSV);
		});
	});

	describe('rgbToSV', () => {
		it('should convert valid RGB to SV', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = toSV.rgbToSV(rgb);
			expect(result).toEqual({
				value: { saturation: 100, value: 100 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid RGB input', () => {
			const invalidRGB: any = {
				format: 'rgb',
				value: { red: -10, green: 0, blue: 300 }
			};
			const result = toSV.rgbToSV(invalidRGB);
			expect(result).toEqual(defaultSV);
		});
	});

	describe('xyzToSV', () => {
		it('should convert valid XYZ to SV', () => {
			const xyz: colors.XYZ = {
				format: 'xyz',
				value: { x: 41.24, y: 21.26, z: 1.93 }
			};
			const result = toSV.xyzToSV(xyz);
			expect(result).toEqual({
				value: { saturation: 100, value: 100 },
				format: 'sv'
			});
		});

		it('should return default SV for invalid XYZ input', () => {
			const invalidXYZ: any = {
				format: 'xyz',
				value: { x: -10, y: 120, z: 300 }
			};
			const result = toSV.xyzToSV(invalidXYZ);
			expect(result).toEqual(defaultSV);
		});
	});
});
