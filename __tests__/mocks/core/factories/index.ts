import { Utilities } from '../../../../src/types/index.js';
import {
	mockAdjustmentUtilitiesFactory,
	mockBrandingUtilitiesFactory,
	mockColorUtilitiesFactory,
	mockDOMUtilitiesFactory,
	mockFormattingUtilitiesFactory,
	mockPaletteUtilitiesFactory,
	mockSanitationUtilitiesFactory,
	mockValidationUtilitiesFactory
} from '../utils/index.js';
import { mockHelpers } from '../helpers/index.js';
import { mockServices } from '../../services/index.js';

export const mockHelpersFactory = jest.fn(async () => {
	console.log(`[MOCK_HELPERS_FACTORY]: Returning mock helpers.`);
	return mockHelpers;
});

export const mockServicesFactory = jest.fn(() => mockServices);

export const mockUtilitiesFactory: jest.Mock<Promise<Utilities>> = jest.fn(
	async () => {
		const color = await mockColorUtilitiesFactory();
		const dom = await mockDOMUtilitiesFactory();
		const palette = await mockPaletteUtilitiesFactory();

		return {
			validate: mockValidationUtilitiesFactory(),
			brand: mockBrandingUtilitiesFactory(),
			adjust: mockAdjustmentUtilitiesFactory(),
			format: mockFormattingUtilitiesFactory(),
			sanitize: mockSanitationUtilitiesFactory(),
			color,
			dom,
			palette
		} as Required<Utilities>;
	}
);
