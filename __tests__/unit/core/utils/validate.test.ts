import { validationUtilitiesFactory } from '../../../../src/core/utils/validate.js';
import {
	mockValidationUtilities,
	mockValidationUtilitiesFactory
} from '../../../mocks/core/utils/index.js';
import { mockHelpers } from '../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';

describe('validationUtilitiesFactory Mock', () => {
	it('should return the mockValidationUtilities object', () => {
		const result = validationUtilitiesFactory(mockHelpers, mockServices);

		expect(result).toBe(mockValidationUtilities);
		expect(mockValidationUtilitiesFactory).toHaveBeenCalledWith(
			mockHelpers,
			mockServices
		);
	});

	it('should call colorInput with a valid color', () => {
		expect(mockValidationUtilities.colorInput('#FFFFFF')).toBe(true);
		expect(mockValidationUtilities.colorInput).toHaveBeenCalledWith('#FFFFFF');
	});

	it('should call ensureHash correctly', () => {
		expect(mockValidationUtilities.ensureHash('FFF')).toBe('#FFF');
		expect(mockValidationUtilities.ensureHash('#123456')).toBe('#123456');
	});

	it('should validate hex components', () => {
		expect(mockValidationUtilities.hexComponent('FF')).toBe(true);
		expect(mockValidationUtilities.hexComponent('G1')).toBe(false);
	});

	it('should validate hex sets', () => {
		expect(mockValidationUtilities.hexSet('#123ABC')).toBe(true);
		expect(mockValidationUtilities.hexSet('12345G')).toBe(false);
	});
});
