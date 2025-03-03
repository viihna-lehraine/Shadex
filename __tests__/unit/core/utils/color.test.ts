import { ColorUtilities } from '../../../../src/types/index.js';
import { colorUtilitiesFactory } from '../../../../src/core/utils/color.js';
import {
	mockAdjustmentUtilities,
	mockBrandingUtilities,
	mockColorUtilities,
	mockColorUtilitiesFactory,
	mockFormattingUtilities,
	mockSanitationUtilities,
	mockValidationUtilities
} from '../../../mocks/core/utils/index.js';
import { mockHelpers } from '../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';

jest.mock('../../../../../../src/core/utils/partials/color/brand.js', () => ({
	colorBrandingUtilitiesFactory: jest.fn(() => mockColorUtilities)
}));

jest.mock(
	'../../../../../../src/core/utils/partials/color/conversion.js',
	() => ({
		colorConversionUtilitiesFactory: jest.fn(() => mockColorUtilities)
	})
);

jest.mock('../../../../../../src/core/utils/partials/color/format.js', () => ({
	colorFormattingUtilitiesFactory: jest.fn(() => mockColorUtilities)
}));

jest.mock(
	'../../../../../../src/core/utils/partials/color/generate.js',
	() => ({
		colorGenerationUtilitiesFactory: jest.fn(() => mockColorUtilities)
	})
);

jest.mock('../../../../../../src/core/utils/partials/color/parse.js', () => ({
	colorParsingUtilitiesFactory: jest.fn(() => mockColorUtilities)
}));

describe('colorUtilitiesFactory', () => {
	let colorUtilities: Awaited<ReturnType<typeof colorUtilitiesFactory>>;

	beforeEach(async () => {
		colorUtilities = (await mockColorUtilitiesFactory()) as ColorUtilities;
	});

	test('should return an object with all color utilities functions', async () => {
		expect(colorUtilities).toBeDefined();
		expect(typeof colorUtilities).toBe('object');
		Object.keys(colorUtilities).forEach(fn => {
			expect(typeof colorUtilities[fn as keyof typeof colorUtilities]).toBe(
				'function'
			);
		});
	});

	test('should call all sub-factories correctly', async () => {
		const { colorBrandingUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/color/brand.js'
		);
		const { colorConversionUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/color/conversion.js'
		);
		const { colorFormattingUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/color/format.js'
		);
		const { colorGenerationUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/color/generate.js'
		);
		const { colorParsingUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/color/parse.js'
		);

		expect(colorBrandingUtilitiesFactory).toHaveBeenCalled();
		expect(colorConversionUtilitiesFactory).toHaveBeenCalled();
		expect(colorFormattingUtilitiesFactory).toHaveBeenCalled();
		expect(colorGenerationUtilitiesFactory).toHaveBeenCalled();
		expect(colorParsingUtilitiesFactory).toHaveBeenCalled();
	});
});
