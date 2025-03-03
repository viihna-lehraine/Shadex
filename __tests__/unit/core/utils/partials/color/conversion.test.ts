import { colorConversionUtilitiesFactory } from '../../../../../../src/core/utils/partials/color/conversion.js';
import { mockColors } from '../../../../../mocks/values.js';
import {
	mockAdjustmentUtilities,
	mockBrandingUtilities,
	mockFormattingUtilities,
	mockSanitationUtilities,
	mockValidationUtilities
} from '../../../../../mocks/core/utils/index.js';
import { mockHelpers } from '../../../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../../../mocks/core/services/index.js';

describe('colorConversionUtilitiesFactory', () => {
	let colorConversionUtilities: ReturnType<
		typeof colorConversionUtilitiesFactory
	>;

	beforeEach(() => {
		colorConversionUtilities = colorConversionUtilitiesFactory(
			mockAdjustmentUtilities,
			mockBrandingUtilities,
			mockFormattingUtilities,
			mockHelpers,
			mockSanitationUtilities,
			mockServices,
			mockValidationUtilities
		);
	});

	test('should return an object with all conversion functions', () => {
		expect(colorConversionUtilities).toBeDefined();
		expect(typeof colorConversionUtilities).toBe('object');
		Object.keys(colorConversionUtilities!).forEach(fn => {
			expect(
				typeof colorConversionUtilities![
					fn as keyof typeof colorConversionUtilities
				]
			).toBe('function');
		});
	});

	Object.entries(colorConversionUtilities!).forEach(([fnName, fn]) => {
		describe(fnName, () => {
			it('should return a valid color object when given valid input', () => {
				const inputType = Object.keys(mockColors).find(key =>
					fnName.toLowerCase().includes(key)
				);
				if (!inputType) return;

				const inputColor = mockColors[inputType as keyof typeof mockColors];
				const result = (fn as Function)(inputColor);

				expect(result).toHaveProperty('value');
				expect(result).toHaveProperty('format');
			});

			it('should return the default value when given invalid input', () => {
				mockValidationUtilities.colorValue = jest
					.fn()
					.mockReturnValueOnce(false);
				const inputType = Object.keys(mockColors).find(key =>
					fnName.toLowerCase().includes(key)
				);
				if (!inputType) return;

				const inputColor = mockColors[inputType as keyof typeof mockColors];
				const result = (fn as Function)(inputColor);

				expect(result).not.toBe(null);
			});

			it('should log an error if an invalid value is encountered', () => {
				mockValidationUtilities.colorValue = jest
					.fn()
					.mockReturnValueOnce(false);
				const inputType = Object.keys(mockColors).find(key =>
					fnName.toLowerCase().includes(key)
				);
				if (!inputType) return;

				const inputColor = mockColors[inputType as keyof typeof mockColors];
				(fn as Function)(inputColor);

				expect(mockServices.log.info).toHaveBeenCalled();
			});
		});
	});
});
