import { domHelpers } from '../../src/helpers/dom';
import * as colors from '../../src/index/colors';

describe('domHelpers Module', () => {
	beforeEach(() => {
		document.body.innerHTML = `
            <div id="test-element"></div>
            <div id="color-stripe-1" draggable="true"></div>
            <div id="toast-container"></div>
        `;
	});

	describe('attachDragAndDropEventListeners', () => {
		it('should attach drag-and-drop event listeners', () => {
			const element = document.getElementById('color-stripe-1');

			const addEventListenerSpy = jest.spyOn(
				element!,
				'addEventListener'
			);
			domHelpers.attachDragAndDropEventListeners(element);

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'dragstart',
				expect.any(Function)
			);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'dragover',
				expect.any(Function)
			);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'drop',
				expect.any(Function)
			);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'dragend',
				expect.any(Function)
			);
		});

		it('should not throw an error if element is null', () => {
			expect(() =>
				domHelpers.attachDragAndDropEventListeners(null)
			).not.toThrow();
		});
	});

	describe('getElement', () => {
		it('should return the element with the given ID', () => {
			const element = domHelpers.getElement<HTMLElement>('test-element');
			expect(element).not.toBeNull();
		});

		it('should return null for a non-existing element', () => {
			const element = domHelpers.getElement<HTMLElement>(
				'non-existent-element'
			);
			expect(element).toBeNull();
		});
	});

	describe('makePaletteBox', () => {
		it('should create a palette box with valid color', () => {
			const color: colors.Hex = {
				format: 'hex',
				value: { hex: '#ff0000' }
			};
			const result = domHelpers.makePaletteBox(color, 1);

			expect(result.paletteBoxCount).toBe(2);
			expect(result.colorStripe).not.toBeNull();
			expect(result.colorStripe.style.backgroundColor).toBe(
				'rgb(255, 0, 0)'
			);
		});

		it('should return a placeholder box for invalid color', () => {
			const invalidColor = { format: 'invalid', value: {} } as any;
			const result = domHelpers.makePaletteBox(invalidColor, 1);

			expect(result.paletteBoxCount).toBe(1);
			expect(result.colorStripe).not.toBeNull();
		});
	});

	describe('showToast', () => {
		it('should display a toast message', () => {
			domHelpers.showToast('Test Message');

			const toast = document.querySelector('.toast-message');
			expect(toast).not.toBeNull();
			expect(toast?.textContent).toBe('Test Message');
		});

		it('should remove the toast message after timeout', () => {
			jest.useFakeTimers();
			domHelpers.showToast('Test Message');

			const toast = document.querySelector('.toast-message');
			expect(toast).not.toBeNull();

			jest.advanceTimersByTime(3000); // Simulate time passing
			expect(toast?.classList.contains('fade-out')).toBe(true);
		});
	});

	describe('showTooltip', () => {
		it('should show and hide the tooltip', () => {
			const tooltipElement = document.createElement('div');
			const tooltipText = document.createElement('span');
			tooltipText.className = 'tooltiptext';
			tooltipElement.appendChild(tooltipText);

			domHelpers.showTooltip(tooltipElement);

			expect(tooltipText.style.visibility).toBe('visible');
			expect(tooltipText.style.opacity).toBe('1');

			jest.useFakeTimers();
			jest.advanceTimersByTime(1000); // Simulate time passing

			expect(tooltipText.style.visibility).toBe('hidden');
			expect(tooltipText.style.opacity).toBe('0');
		});
	});
});
