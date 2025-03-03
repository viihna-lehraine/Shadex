import { ByteRange, ColorNumMap } from '../../../../src/types/index.js';
import { brandingUtilitiesFactory } from '../../../../src/core/utils/brand';
import {
	mockBrandingUtilities,
	mockBrandingUtilitiesFactory,
	mockValidationUtilities
} from '../../../mocks/core/utils/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';

describe('brandingUtilitiesFactory Mock', () => {
	it('should return the mockBrandingUtilities object', () => {
		const result = brandingUtilitiesFactory(
			mockServices,
			mockValidationUtilities
		);

		expect(result).toBe(mockBrandingUtilities);
		expect(mockBrandingUtilitiesFactory).toHaveBeenCalledWith(
			mockServices,
			mockValidationUtilities
		);
	});

	it('should call asByteRange with a valid number', () => {
		expect(mockBrandingUtilities.asByteRange(255)).toBe(255);
		expect(mockBrandingUtilities.asByteRange).toHaveBeenCalledWith(255);
	});

	it('should call asHexSet correctly', () => {
		expect(mockBrandingUtilities.asHexSet('#123ABC')).toBe('#123ABC');
		expect(mockBrandingUtilities.asHexSet).toHaveBeenCalledWith('#123ABC');
	});

	it('should validate asLAB_A', () => {
		expect(mockBrandingUtilities.asLAB_A(-100)).toBe(-100);
		expect(mockBrandingUtilities.asLAB_A).toHaveBeenCalledWith(-100);
	});

	it('should validate brandColor', () => {
		const color: ColorNumMap = {
			format: 'rgb',
			value: {
				red: 255 as ByteRange,
				green: 255 as ByteRange,
				blue: 255 as ByteRange
			}
		};

		expect(mockBrandingUtilities.brandColor(color)).toEqual(color);
		expect(mockBrandingUtilities.brandColor).toHaveBeenCalledWith(color);
	});
});
