import { toXYZ } from '../../src/color-spaces/toXYZ';
import * as colors from '../../src/index/colors';
import { defaults } from '../../src/config/defaults';

describe('toXYZ Conversion Functions', () => {
	const defaultXYZ = defaults.xyz;

	describe('cmykToXYZ', () => {
		it('should convert valid CMYK to XYZ', () => {
			const cmyk: colors.CMYK = {
				format: 'cmyk',
				value: { cyan: 0, magenta: 100, yellow: 100, key: 0 }
			};
			const result = toXYZ.cmykToXYZ(cmyk);
			expect(result).toBeDefined();
		});

		it('should return default XYZ for invalid CMYK input', () => {
			const invalidCMYK: any = {
				format: 'cmyk',
				value: { cyan: -10, magenta: 120, yellow: 0, key: 0 }
			};
			const result = toXYZ.cmykToXYZ(invalidCMYK);
			expect(result).toEqual(defaultXYZ);
		});
	});

	describe('hexToXYZ', () => {
		it('should convert valid Hex to XYZ', () => {
			const hex: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const result = toXYZ.hexToXYZ(hex);
			expect(result).toBeDefined();
		});

		it('should return default XYZ for invalid Hex input', () => {
			const invalidHex: any = {
				format: 'hex',
				value: { hex: 'invalid' }
			};
			const result = toXYZ.hexToXYZ(invalidHex);
			expect(result).toEqual(defaultXYZ);
		});
	});

	describe('hslToXYZ', () => {
		it('should convert valid HSL to XYZ', () => {
			const hsl: colors.HSL = {
				format: 'hsl',
				value: { hue: 0, saturation: 100, lightness: 50 }
			};
			const result = toXYZ.hslToXYZ(hsl);
			expect(result).toBeDefined();
		});

		it('should return default XYZ for invalid HSL input', () => {
			const invalidHSL: any = {
				format: 'hsl',
				value: { hue: -10, saturation: 120, lightness: 50 }
			};
			const result = toXYZ.hslToXYZ(invalidHSL);
			expect(result).toEqual(defaultXYZ);
		});
	});

	describe('hsvToXYZ', () => {
		it('should convert valid HSV to XYZ', () => {
			const hsv: colors.HSV = {
				format: 'hsv',
				value: { hue: 0, saturation: 100, value: 100 }
			};
			const result = toXYZ.hsvToXYZ(hsv);
			expect(result).toBeDefined();
		});

		it('should return default XYZ for invalid HSV input', () => {
			const invalidHSV: any = {
				format: 'hsv',
				value: { hue: 400, saturation: 120, value: 100 }
			};
			const result = toXYZ.hsvToXYZ(invalidHSV);
			expect(result).toEqual(defaultXYZ);
		});
	});

	describe('labToXYZ', () => {
		it('should convert valid LAB to XYZ', () => {
			const lab: colors.LAB = {
				format: 'lab',
				value: { l: 50, a: 0, b: 0 }
			};
			const result = toXYZ.labToXYZ(lab);
			expect(result).toBeDefined();
		});

		it('should return default XYZ for invalid LAB input', () => {
			const invalidLAB: any = {
				format: 'lab',
				value: { l: -10, a: 120, b: 300 }
			};
			const result = toXYZ.labToXYZ(invalidLAB);
			expect(result).toEqual(defaultXYZ);
		});
	});

	describe('rgbToXYZ', () => {
		it('should convert valid RGB to XYZ', () => {
			const rgb: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};
			const result = toXYZ.rgbToXYZ(rgb);
			expect(result).toBeDefined();
		});

		it('should return default XYZ for invalid RGB input', () => {
			const invalidRGB: any = {
				format: 'rgb',
				value: { red: -10, green: 0, blue: 300 }
			};
			const result = toXYZ.rgbToXYZ(invalidRGB);
			expect(result).toEqual(defaultXYZ);
		});
	});
});
