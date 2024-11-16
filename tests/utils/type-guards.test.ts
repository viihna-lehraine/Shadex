import { guards } from '../../src/utils/type-guards';
import * as colors from '../../src/index/colors';

describe('guards module', () => {
	describe('isColor', () => {
		it('should return true for valid color objects', () => {
			const rgbColor: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};

			expect(guards.isColor(rgbColor)).toBe(true);
		});

		it('should return false for invalid color objects', () => {
			const invalidColor = { format: 'unknown', value: {} };

			expect(guards.isColor(invalidColor)).toBe(false);
		});
	});

	describe('isColorSpace', () => {
		it('should return true for valid color space', () => {
			expect(guards.isColorSpace('rgb')).toBe(true);
		});

		it('should return false for invalid color space', () => {
			expect(guards.isColorSpace('unknown')).toBe(false);
		});
	});

	describe('isColorString', () => {
		it('should return true for valid color strings', () => {
			const hslString: colors.HSLString = {
				format: 'hsl',
				value: { hue: '120', saturation: '50%', lightness: '50%' }
			};

			expect(guards.isColorString(hslString)).toBe(true);
		});

		it('should return false for non-color string objects', () => {
			const invalidString = { format: 'unknown', value: {} };

			expect(guards.isColorString(invalidString)).toBe(false);
		});
	});

	describe('isHex', () => {
		it('should return true for valid hex color', () => {
			const hexColor: colors.Hex = {
				format: 'hex',
				value: { hex: '#FFFFFF' }
			};

			expect(guards.isHex(hexColor)).toBe(true);
		});

		it('should return false for non-hex color', () => {
			const invalidHex = { format: 'rgb', value: {} };

			expect(guards.isHex(invalidHex)).toBe(false);
		});
	});

	describe('isHSLColor', () => {
		it('should return true for valid HSL color', () => {
			const hslColor: colors.HSL = {
				format: 'hsl',
				value: { hue: 180, saturation: 50, lightness: 40 }
			};

			expect(guards.isHSLColor(hslColor)).toBe(true);
		});

		it('should return false for non-HSL color', () => {
			const invalidHSL = { format: 'rgb', value: {} };

			expect(guards.isHSLColor(invalidHSL)).toBe(false);
		});
	});

	describe('isRGB', () => {
		it('should return true for valid RGB color', () => {
			const rgbColor: colors.RGB = {
				format: 'rgb',
				value: { red: 255, green: 0, blue: 0 }
			};

			expect(guards.isRGB(rgbColor)).toBe(true);
		});

		it('should return false for non-RGB color', () => {
			const invalidRGB = { format: 'hex', value: { hex: '#FFFFFF' } };

			expect(guards.isRGB(invalidRGB)).toBe(false);
		});
	});

	describe('ensureHash', () => {
		it('should add hash to hex color if missing', () => {
			expect(guards.ensureHash('FFFFFF')).toBe('#FFFFFF');
		});

		it('should return hex string unchanged if hash is present', () => {
			expect(guards.ensureHash('#123456')).toBe('#123456');
		});
	});

	describe('isInputElement', () => {
		it('should return true for input elements', () => {
			const inputElement = document.createElement('input');

			expect(guards.isInputElement(inputElement)).toBe(true);
		});

		it('should return false for non-input elements', () => {
			const divElement = document.createElement('div');

			expect(guards.isInputElement(divElement)).toBe(false);
		});
	});

	describe('isStoredPalette', () => {
		it('should return true for valid stored palette objects', () => {
			const storedPalette = {
				tableID: 1,
				palette: {
					id: 'palette_1',
					items: []
				}
			};

			expect(guards.isStoredPalette(storedPalette)).toBe(true);
		});

		it('should return false for invalid stored palette objects', () => {
			const invalidPalette = { tableID: '1', palette: { items: {} } };

			expect(guards.isStoredPalette(invalidPalette)).toBe(false);
		});
	});
});
