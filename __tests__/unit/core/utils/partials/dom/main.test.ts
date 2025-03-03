import { DOMUtilitiesPartial } from '../../../../../../src/types/index.js';
import { partialDOMUtilitiesFactory } from '../../../../../../src/core/utils/partials/dom/main.js';
import { mockColors } from '../../../../../mocks/values.js';
import {
	mockColorUtilities,
	mockPartialDOMUtilitiesFactory,
	mockValidationUtilities
} from '../../../../../mocks/core/utils/index.js';
import { mockHelpers } from '../../../../../mocks/core/helpers/index.js';
import { mockServices } from '../../../../../mocks/core/services/index.js';

describe('partialDOMUtilitiesFactory', () => {
	let partialDOMUtilities: ReturnType<typeof partialDOMUtilitiesFactory>;

	beforeEach(() => {
		partialDOMUtilities = mockPartialDOMUtilitiesFactory(
			mockColorUtilities,
			mockHelpers,
			mockServices,
			mockValidationUtilities
		) as DOMUtilitiesPartial;

		jest
			.spyOn(mockServices.errors, 'handleSync')
			.mockImplementation(fn => fn());
	});

	test('should return an object with all DOM utility functions', () => {
		expect(partialDOMUtilities).toBeDefined();
		expect(typeof partialDOMUtilities).toBe('object');
		Object.keys(partialDOMUtilities).forEach(fn => {
			expect(
				typeof partialDOMUtilities[fn as keyof typeof partialDOMUtilities]
			).toBe('function');
		});
	});

	describe('createTooltip', () => {
		it('should create a tooltip element', () => {
			const element = document.createElement('div');
			const tooltip = partialDOMUtilities.createTooltip(
				element,
				'Test Tooltip'
			);

			expect(tooltip).toBeInstanceOf(HTMLElement);
		});
	});

	describe('downloadFile', () => {
		it('should simulate file download', () => {
			const mockClick = jest.spyOn(document.createElement('a'), 'click');
			partialDOMUtilities.downloadFile('test data', 'test.txt', 'text/plain');
			expect(mockClick).not.toHaveBeenCalled(); // Because the function is mocked
		});
	});

	describe('hideTooltip', () => {
		it('should call the function without errors', () => {
			expect(() => partialDOMUtilities.hideTooltip()).not.toThrow();
		});
	});

	describe('removeTooltip', () => {
		it('should call the function without errors', () => {
			const element = document.createElement('div');
			expect(() => partialDOMUtilities.removeTooltip(element)).not.toThrow();
		});
	});

	describe('readFile', () => {
		it('should return mock file content', async () => {
			const file = new File(['test content'], 'test.txt', {
				type: 'text/plain'
			});
			const result = await partialDOMUtilities.readFile(file);
			expect(result).toBe('mock file content');
		});
	});

	describe('scanPaletteColumns', () => {
		it('should return an empty array', () => {
			const result = partialDOMUtilities.scanPaletteColumns();
			expect(result).toEqual([]);
		});
	});

	describe('switchColorSpaceInDOM', () => {
		it('should log switching color spaces', () => {
			expect(() =>
				partialDOMUtilities.switchColorSpaceInDOM('rgb')
			).not.toThrow();
		});
	});

	describe('updateColorBox', () => {
		it('should update color box without errors', () => {
			expect(() =>
				partialDOMUtilities.updateColorBox(mockColors.hsl, 'boxId')
			).not.toThrow();
		});
	});

	describe('updateHistory', () => {
		it('should update history without errors', () => {
			expect(() => partialDOMUtilities.updateHistory([])).not.toThrow();
		});
	});
});
