import { DOMUtilities } from '../../../../src/types/index.js';
import { domUtilitiesFactory } from '../../../../src/core/utils/dom.js';
import {
	mockBrandingUtilities,
	mockColorUtilities,
	mockDOMUtilities,
	mockDOMUtilitiesFactory,
	mockValidationUtilities
} from '../../../mocks/core/utils/index.js';
import { mockHelpers } from '../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../mocks/core/services/index.js';

jest.mock('../../../../src/core/utils/partials/dom/parse.js', () => ({
	domParsingUtilitiesFactory: jest.fn(() => mockDOMUtilities)
}));

jest.mock('../../../../src/core/utils/partials/dom/main.js', () => ({
	partialDOMUtilitiesFactory: jest.fn(() => mockDOMUtilities)
}));

describe('domUtilitiesFactory', () => {
	let domUtilities: Awaited<ReturnType<typeof domUtilitiesFactory>>;

	beforeEach(async () => {
		domUtilities = (await mockDOMUtilitiesFactory()) as DOMUtilities;
	});

	test('should return an object with all DOM utility functions', async () => {
		expect(domUtilities).toBeDefined();
		expect(typeof domUtilities).toBe('object');
		Object.keys(domUtilities).forEach(fn => {
			expect(typeof domUtilities[fn as keyof typeof domUtilities]).toBe(
				'function'
			);
		});
	});

	test('should call all sub-factories correctly', async () => {
		const { domParsingUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/dom/parse.js'
		);
		const { partialDOMUtilitiesFactory } = await import(
			'../../../../src/core/utils/partials/dom/main.js'
		);

		expect(domParsingUtilitiesFactory).toHaveBeenCalled();
		expect(partialDOMUtilitiesFactory).toHaveBeenCalled();
	});
});
