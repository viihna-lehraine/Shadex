import { Utilities } from '../../../../src/types/index.js';
import { utilitiesFactory } from '../../../../src/core/factories/utils.js';
import { mockHelpers } from '../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';
import { mockUtilitiesFactory } from '../../../mocks/core/factories/index.js';

jest.mock('../../../../src/core/utils/adjust.js', () => ({
	adjustmentUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).adjust
	)
}));

jest.mock('../../../../src/core/utils/brand.js', () => ({
	brandingUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).brand
	)
}));

jest.mock('../../../../src/core/utils/color.js', () => ({
	colorUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).color
	)
}));

jest.mock('../../../../src/core/utils/dom.js', () => ({
	domUtilitiesFactory: jest.fn(async () => (await mockUtilitiesFactory()).dom)
}));

jest.mock('../../../../src/core/utils/format.js', () => ({
	formattingUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).format
	)
}));

jest.mock('../../../../src/core/utils/palette.js', () => ({
	paletteUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).palette
	)
}));

jest.mock('../../../../src/core/utils/sanitize.js', () => ({
	sanitationUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).sanitize
	)
}));

jest.mock('../../../../src/core/utils/validate.js', () => ({
	validationUtilitiesFactory: jest.fn(
		async () => (await mockUtilitiesFactory()).validate
	)
}));

describe('utilitiesFactory', () => {
	let utilities: Awaited<ReturnType<typeof utilitiesFactory>>;

	beforeEach(async () => {
		utilities = await utilitiesFactory(mockHelpers, mockServices);
	});

	test('should return an object with all utility functions', async () => {
		expect(utilities).toBeDefined();
		expect(typeof utilities).toBe('object');
		Object.keys(utilities).forEach(fn => {
			expect(typeof utilities[fn as keyof typeof utilities]).toBe('object');
		});
	});

	test('should call all sub-factories correctly', async () => {
		const { adjustmentUtilitiesFactory } = await import(
			'../../../../src/core/utils/adjust.js'
		);
		const { brandingUtilitiesFactory } = await import(
			'../../../../src/core/utils/brand.js'
		);
		const { colorUtilitiesFactory } = await import(
			'../../../../src/core/utils/color.js'
		);
		const { domUtilitiesFactory } = await import(
			'../../../../src/core/utils/dom.js'
		);
		const { formattingUtilitiesFactory } = await import(
			'../../../../src/core/utils/format.js'
		);
		const { paletteUtilitiesFactory } = await import(
			'../../../../src/core/utils/palette.js'
		);
		const { sanitationUtilitiesFactory } = await import(
			'../../../../src/core/utils/sanitize.js'
		);
		const { validationUtilitiesFactory } = await import(
			'../../../../src/core/utils/validate.js'
		);

		expect(adjustmentUtilitiesFactory).toHaveBeenCalled();
		expect(brandingUtilitiesFactory).toHaveBeenCalled();
		expect(colorUtilitiesFactory).toHaveBeenCalled();
		expect(domUtilitiesFactory).toHaveBeenCalled();
		expect(formattingUtilitiesFactory).toHaveBeenCalled();
		expect(paletteUtilitiesFactory).toHaveBeenCalled();
		expect(sanitationUtilitiesFactory).toHaveBeenCalled();
		expect(validationUtilitiesFactory).toHaveBeenCalled();
	});
});
