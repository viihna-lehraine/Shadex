import { ByteRange, RGB } from '../../../../src/types/index.js';
import { colorHelpersFactory } from '../../../../src/core/helpers/color.js';
import { mockColorHelpers } from '../../../mocks/core/helpers/index.js';

describe('colorHelpersFactory', () => {
	it('should return a mocked colorHelpers object', () => {
		const result = colorHelpersFactory({} as any);

		expect(result).toBe(mockColorHelpers);
		expect(result.getConversionFn).toBeInstanceOf(Function);
		expect(result.hueToRGB).toBeInstanceOf(Function);
	});

	it('should mock getConversionFn correctly', () => {
		const conversionFn = mockColorHelpers.getConversionFn('rgb', 'hsl');
		expect(conversionFn).toBeDefined();

		const mockInput: RGB = {
			value: {
				red: 255 as ByteRange,
				green: 255 as ByteRange,
				blue: 255 as ByteRange
			},
			format: 'rgb' as 'rgb'
		};
		expect(conversionFn?.(mockInput)).toEqual(mockInput);
	});

	it('should mock hueToRGB correctly', () => {
		const result = mockColorHelpers.hueToRGB(0.2, 0.5, 0.8);
		expect(typeof result).toBe('number');
	});
});
