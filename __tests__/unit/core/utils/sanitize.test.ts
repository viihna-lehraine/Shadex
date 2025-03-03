import { mockSanitationUtilities } from '../../../mocks/core/utils/index.js';

describe('sanitationUtilitiesFactory Mock', () => {
	it('should sanitize input correctly', () => {
		expect(mockSanitationUtilities.sanitizeInput('<script>')).toBe(
			'&lt;script&gt;'
		);
		expect(mockSanitationUtilities.sanitizeInput('"quote"')).toBe(
			'&quot;quote&quot;'
		);
	});

	it('should return safe query parameter', () => {
		expect(mockSanitationUtilities.getSafeQueryParam('test')).toBe(
			'mockValueFor_test'
		);
	});

	it('should handle percentile values correctly', () => {
		expect(mockSanitationUtilities.percentile(105)).toBe(100);
		expect(mockSanitationUtilities.percentile(-5)).toBe(0);
		expect(mockSanitationUtilities.percentile(42)).toBe(42);
	});

	it('should sanitize RGB values correctly', () => {
		expect(mockSanitationUtilities.rgb(300)).toBe(255);
		expect(mockSanitationUtilities.rgb(-10)).toBe(0);
		expect(mockSanitationUtilities.rgb(128)).toBe(128);
	});

	it('should convert values to the correct branded range', () => {
		expect(mockSanitationUtilities.toColorValueRange(255, 'ByteRange')).toBe(
			255
		);
		expect(mockSanitationUtilities.toColorValueRange('AA44CC', 'HexSet')).toBe(
			'#mockHex'
		);
	});
});
