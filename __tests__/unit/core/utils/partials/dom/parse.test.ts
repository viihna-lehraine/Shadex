import { domParsingUtilitiesFactory } from '../../../../../../src/core/utils/partials/dom/parse.js';
import {
	mockBrandingUtilities,
	mockDOMParsingUtilitiesFactory
} from '../../../../../mocks/core/utils/index.js';
import { mockServices } from '../../../../../mocks/core/services/index.js';

describe('domParsingUtilitiesFactory', () => {
	let domParsingUtilities: ReturnType<typeof domParsingUtilitiesFactory>;

	beforeEach(() => {
		domParsingUtilities = mockDOMParsingUtilitiesFactory();

		jest
			.spyOn(mockServices.errors, 'handleSync')
			.mockImplementation(fn => fn());
	});

	test('should return an object with all parsing functions', () => {
		expect(domParsingUtilities).toBeDefined();
		expect(typeof domParsingUtilities).toBe('object');
		Object.keys(domParsingUtilities).forEach(fn => {
			expect(
				typeof domParsingUtilities[fn as keyof typeof domParsingUtilities]
			).toBe('function');
		});
	});

	describe('parseCheckbox', () => {
		it('should return true for checked checkboxes', () => {
			document.body.innerHTML = `<input type="checkbox" id="test-checkbox" checked />`;
			const result = domParsingUtilities.parseCheckbox('test-checkbox');
			expect(result).toBe(true);
		});

		it('should return undefined if element is not found', () => {
			const result = domParsingUtilities.parseCheckbox('nonexistent-checkbox');
			expect(result).toBeUndefined();
		});
	});

	describe('parseColorInput', () => {
		it('should parse hex colors correctly', () => {
			const input = document.createElement('input');
			input.value = '#ff0000';
			const result = domParsingUtilities.parseColorInput(input);
			expect(result).toMatchObject({ format: 'hex' });
		});

		it('should parse RGB colors correctly', () => {
			const input = document.createElement('input');
			input.value = 'rgb(255, 0, 0)';
			const result = domParsingUtilities.parseColorInput(input);
			expect(result).toMatchObject({ format: 'rgb' });
		});

		it('should return null for invalid colors', () => {
			const input = document.createElement('input');
			input.value = 'not-a-color';
			const result = domParsingUtilities.parseColorInput(input);
			expect(result).toBeNull();
		});
	});

	describe('parseDropdownSelection', () => {
		it('should return the selected value if it is valid', () => {
			document.body.innerHTML = `<select id="test-dropdown">
				<option value="valid">Valid</option>
				<option value="invalid">Invalid</option>
			</select>`;
			const result = domParsingUtilities.parseDropdownSelection(
				'test-dropdown',
				['valid']
			);
			expect(result).toBe('valid');
		});

		it('should return undefined if selection is invalid', () => {
			document.body.innerHTML = `<select id="test-dropdown">
				<option value="invalid">Invalid</option>
			</select>`;
			const result = domParsingUtilities.parseDropdownSelection(
				'test-dropdown',
				['valid']
			);
			expect(result).toBeUndefined();
		});
	});

	describe('parseNumberInput', () => {
		it('should parse valid numbers', () => {
			const input = document.createElement('input');
			input.value = '42';
			const result = domParsingUtilities.parseNumberInput(input);
			expect(result).toBe(42);
		});

		it('should return null for invalid numbers', () => {
			const input = document.createElement('input');
			input.value = 'not-a-number';
			const result = domParsingUtilities.parseNumberInput(input);
			expect(result).toBeNull();
		});

		it('should enforce min and max bounds', () => {
			const input = document.createElement('input');
			input.value = '50';
			expect(domParsingUtilities.parseNumberInput(input, 10, 40)).toBe(40);
			expect(domParsingUtilities.parseNumberInput(input, 60, 100)).toBe(60);
		});
	});

	describe('parseTextInput', () => {
		it('should return trimmed text', () => {
			const input = document.createElement('input');
			input.value = '   test   ';
			const result = domParsingUtilities.parseTextInput(input);
			expect(result).toBe('test');
		});

		it('should return null if regex does not match', () => {
			const input = document.createElement('input');
			input.value = '123abc';
			const result = domParsingUtilities.parseTextInput(input, /^[a-z]+$/);
			expect(result).toBeNull();
		});
	});
});
