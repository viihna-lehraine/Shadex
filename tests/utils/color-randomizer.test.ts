import { genRandomColor } from '../../src/utils/color-randomizer';
import * as colors from '../../src/index/colors';
import { paletteHelpers } from '../../src/helpers/palette';
import { defaults } from '../../src/config/defaults';

describe('genRandomColor', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('randomCMYK', () => {
		it('should generate a valid CMYK color', () => {
			const color = genRandomColor('cmyk') as colors.CMYK;

			expect(color.format).toBe('cmyk');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomHex', () => {
		it('should generate a valid Hex color', () => {
			const color = genRandomColor('hex') as colors.Hex;

			expect(color.format).toBe('hex');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomHSL', () => {
		it('should generate a valid HSL color', () => {
			const color = genRandomColor('hsl') as colors.HSL;

			expect(color.format).toBe('hsl');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomHSV', () => {
		it('should generate a valid HSV color', () => {
			const color = genRandomColor('hsv') as colors.HSV;

			expect(color.format).toBe('hsv');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomLAB', () => {
		it('should generate a valid LAB color', () => {
			const color = genRandomColor('lab') as colors.LAB;

			expect(color.format).toBe('lab');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomRGB', () => {
		it('should generate a valid RGB color', () => {
			const color = genRandomColor('rgb') as colors.RGB;

			expect(color.format).toBe('rgb');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomSL', () => {
		it('should generate a valid SL color', () => {
			const color = genRandomColor('sl') as colors.SL;

			expect(color.format).toBe('sl');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('randomSV', () => {
		it('should generate a valid SV color', () => {
			const color = genRandomColor('sv') as colors.SV;

			expect(color.format).toBe('sv');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('default case', () => {
		it('should return a valid Hex color if an invalid color space is passed', () => {
			const color = genRandomColor(
				'invalid' as colors.ColorSpaceExtended
			);

			expect(color.format).toBe('hex');
			expect(paletteHelpers.validateColorValues(color)).toBe(true);
		});
	});

	describe('Error Handling', () => {
		it('should return the default Hex color if an error occurs', () => {
			jest.spyOn(Math, 'random').mockImplementation(() => {
				throw new Error('Mocked random error');
			});

			const color = genRandomColor('hex');
			expect(color).toEqual(defaults.hex);
		});
	});
});
