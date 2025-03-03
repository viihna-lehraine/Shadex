import { ColorFormatUtilities } from '../../../../../../src/types/app.js';
import { colorFormattingUtilitiesFactory } from '../../../../../../src/core/utils/partials/color/format.js';
import { mockColors } from '../../../../../mocks/values.js';
import {
	mockColorFormattingUtilitiesFactory,
	mockFormattingUtilities
} from '../../../../../mocks/core/utils/index.js';
import { mockHelpers } from '../../../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../../../mocks/core/services/index.js';

describe('colorFormattingUtilitiesFactory', () => {
	let colorFormattingUtilities: ReturnType<
		typeof colorFormattingUtilitiesFactory
	>;

	beforeEach(() => {
		colorFormattingUtilities = mockColorFormattingUtilitiesFactory(
			mockFormattingUtilities,
			mockHelpers,
			mockServices
		) as ColorFormatUtilities;

		jest
			.spyOn(mockServices.errors, 'handleSync')
			.mockImplementation(fn => fn());
	});

	test('should return an object with all formatting functions', () => {
		expect(colorFormattingUtilities).not.toBeNull();
		expect(typeof colorFormattingUtilities).toBe('object');
		Object.keys(colorFormattingUtilities).forEach(fn => {
			expect(
				typeof colorFormattingUtilities[
					fn as keyof typeof colorFormattingUtilities
				]
			).toBe('function');
		});
	});

	describe('formatColorAsCSS', () => {
		it('should format RGB correctly', () => {
			const result = colorFormattingUtilities.formatColorAsCSS(mockColors.rgb);
			expect(result).toMatch(/^mock-css\(rgb\)$/);
		});

		it('should return a default hex CSS string on invalid input', () => {
			const result = colorFormattingUtilities.formatColorAsCSS({} as any);
			expect(result).toBe('mock-default-hex');
		});
	});

	describe('formatColorAsStringMap', () => {
		it('should return correct string format for RGB', () => {
			const result = colorFormattingUtilities.formatColorAsStringMap(
				mockColors.rgb
			);
			expect(result.format).toBe('rgb');
			if (result.format === 'rgb') {
				expect(result.value.red).toMatch(/^mock-/);
			}
		});

		it('should return correct string format for Hex', () => {
			const result = colorFormattingUtilities.formatColorAsStringMap(
				mockColors.hex
			);
			expect(result.format).toBe('hex');
			if (result.format === 'hex') {
				expect(result.value.hex).toMatch(/^mock-/);
			}
		});

		it('should throw error on invalid format', () => {
			expect(() =>
				colorFormattingUtilities.formatColorAsStringMap({
					format: 'invalid'
				} as any)
			).toThrow();
		});
	});

	describe('formatCSSAsColor', () => {
		it('should return a valid RGB color object for a CSS string', () => {
			const result =
				colorFormattingUtilities.formatCSSAsColor('rgb(255, 0, 0)');
			expect(result).toMatchObject({ format: 'rgb' });
		});

		it('should return a valid Hex color object for a CSS string', () => {
			const result = colorFormattingUtilities.formatCSSAsColor('#ff0000');
			expect(result).toMatchObject({ format: 'hex' });
		});

		it('should return null for invalid CSS string', () => {
			const result = colorFormattingUtilities.formatCSSAsColor('invalid-color');
			expect(result).toBeNull();
		});
	});
});
