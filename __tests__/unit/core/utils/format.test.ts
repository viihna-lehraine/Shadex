import { formattingUtilitiesFactory } from '../../../../src/core/utils/format.js';
import {
	mockBrandingUtilities,
	mockFormattingUtilitiesFactory,
	mockFormattingUtilities,
	mockValidationUtilities
} from '../../../mocks/core/utils/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';

describe('formattingUtilitiesFactory Mock', () => {
	it('should return the mockFormattingUtilities object', () => {
		const result = formattingUtilitiesFactory(
			mockBrandingUtilities,
			mockServices,
			mockValidationUtilities
		);

		expect(result).toBe(mockFormattingUtilities);
		expect(mockFormattingUtilitiesFactory).toHaveBeenCalledWith(
			mockBrandingUtilities,
			mockServices,
			mockValidationUtilities
		);
	});

	it('should call componentToHex correctly', () => {
		expect(mockFormattingUtilities.componentToHex(255)).toBe('ff');
		expect(mockFormattingUtilities.componentToHex).toHaveBeenCalledWith(255);
	});

	it('should convert short hex correctly', () => {
		expect(mockFormattingUtilities.convertShortHexToLong('#abc')).toBe(
			'#aabbcc'
		);
		expect(mockFormattingUtilities.convertShortHexToLong).toHaveBeenCalledWith(
			'#abc'
		);
	});

	it('should parse color correctly', () => {
		expect(mockFormattingUtilities.parseColor('rgb', '255,255,255')).toEqual({
			format: 'rgb',
			value: '255,255,255'
		});
		expect(mockFormattingUtilities.parseColor).toHaveBeenCalledWith(
			'rgb',
			'255,255,255'
		);
	});
});
