import { ColorGenerationUtilities } from '../../../../../../src/types/app.js';
import { colorGenerationUtilitiesFactory } from '../../../../../../src/core/utils/partials/color/generate.js';
import { mockColorGenerationUtilitiesFactory } from '../../../../../mocks/core/utils/index.js';
import { mockSanitationUtilities } from '../../../../../mocks/core/utils/index.js';
import { mockServices } from '../../../../../mocks/core/services/index.js';
import { mockValidationUtilities } from '../../../../../mocks/core/utils/index.js';

describe('colorGenerationUtilitiesFactory', () => {
	let colorGenerationUtilities: ReturnType<
		typeof colorGenerationUtilitiesFactory
	>;

	beforeEach(() => {
		colorGenerationUtilities = mockColorGenerationUtilitiesFactory(
			mockSanitationUtilities,
			mockServices,
			mockValidationUtilities
		) as ColorGenerationUtilities;

		jest
			.spyOn(mockServices.errors, 'handleSync')
			.mockImplementation(fn => fn());

		jest
			.spyOn(mockValidationUtilities, 'colorValue')
			.mockImplementation(() => true);
	});

	test('should return an object with all color generation functions', () => {
		expect(colorGenerationUtilities).toBeDefined();
		expect(typeof colorGenerationUtilities).toBe('object');
		Object.keys(colorGenerationUtilities).forEach(fn => {
			expect(
				typeof colorGenerationUtilities[
					fn as keyof typeof colorGenerationUtilities
				]
			).toBe('function');
		});
	});

	describe('generateRandomHSL', () => {
		it('should return a valid HSL object', () => {
			const result = colorGenerationUtilities.generateRandomHSL();
			expect(result).toHaveProperty('value');
			expect(result).toHaveProperty('format', 'hsl');
			expect(result.value).toHaveProperty('hue');
			expect(result.value).toHaveProperty('saturation');
			expect(result.value).toHaveProperty('lightness');
		});

		it('should return the default HSL color if validation fails', () => {
			jest
				.spyOn(mockValidationUtilities, 'colorValue')
				.mockReturnValueOnce(false);
			const result = colorGenerationUtilities.generateRandomHSL();
			expect(result).toMatchObject({ format: 'hsl' });
		});

		it('should log an error if an invalid value is generated', () => {
			jest
				.spyOn(mockValidationUtilities, 'colorValue')
				.mockReturnValueOnce(false);
			colorGenerationUtilities.generateRandomHSL();
			expect(mockServices.log.error).toHaveBeenCalled();
		});
	});

	describe('generateRandomSL', () => {
		it('should return a valid SL object', () => {
			const result = colorGenerationUtilities.generateRandomSL();
			expect(result).toHaveProperty('value');
			expect(result).toHaveProperty('format', 'sl');
			expect(result.value).toHaveProperty('saturation');
			expect(result.value).toHaveProperty('lightness');
		});

		it('should return the default SL color if validation fails', () => {
			jest
				.spyOn(mockValidationUtilities, 'colorValue')
				.mockReturnValueOnce(false);
			const result = colorGenerationUtilities.generateRandomSL();
			expect(result).toMatchObject({ format: 'sl' });
		});

		it('should log an error if an invalid value is generated', () => {
			jest
				.spyOn(mockValidationUtilities, 'colorValue')
				.mockReturnValueOnce(false);
			colorGenerationUtilities.generateRandomSL();
			expect(mockServices.log.error).toHaveBeenCalled();
		});
	});
});
