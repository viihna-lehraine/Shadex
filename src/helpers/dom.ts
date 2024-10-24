import { dragAndDrop } from '../dom/drag-and-drop';
import * as fnObjects from '../index/fn-objects';
import * as interfaces from '../index/interfaces';
import * as types from '../index/types';
import { transforms } from '../utils/transforms';

function attachDragAndDropEventListeners(element: HTMLElement | null): void {
	try {
		if (element) {
			element.addEventListener('dragstart', dragAndDrop.handleDragStart);
			element.addEventListener('dragover', dragAndDrop.handleDragOver);
			element.addEventListener('drop', dragAndDrop.handleDrop);
			element.addEventListener('dragend', dragAndDrop.handleDragEnd);
		}
	} catch (error) {
		console.error(
			`Failed to execute attachDragAndDropEventListeners: ${error}`
		);
	}
}

function getElement<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

function makePaletteBox(
	color: types.Color,
	paletteBoxCount: number
): interfaces.MakePaletteBox {
	try {
		// create main palette-box element
		const paletteBox = document.createElement('div');
		paletteBox.className = 'palette-box';
		paletteBox.id = `palette-box-${paletteBoxCount}`;

		// create top half of palette box
		const paletteBoxTopHalf = document.createElement('div');
		paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
		paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

		const colorTextOutputBox = document.createElement(
			'input'
		) as interfaces.ColorInputElement;
		colorTextOutputBox.type = 'text';
		colorTextOutputBox.className = 'color-text-output-box tooltip';
		colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
		colorTextOutputBox.setAttribute('data-format', 'hex');

		const colorString = transforms.getCSSColorString(color);

		if (colorString) {
			colorTextOutputBox.value = colorString;
		} else {
			console.warn(
				`Failed to generate color string for box #${paletteBoxCount}`
			);
			colorTextOutputBox.value = '';
		}

		colorTextOutputBox.colorValues = color; // store color values
		colorTextOutputBox.readOnly = false;
		colorTextOutputBox.style.cursor = 'text';
		colorTextOutputBox.style.pointerEvents = 'none';

		const copyButton = document.createElement('button');
		copyButton.className = 'copy-button';
		copyButton.textContent = 'Copy';

		const tooltipText = document.createElement('span');
		tooltipText.className = 'tooltiptext';
		tooltipText.textContent = 'Copied to clipboard!';

		copyButton.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(colorTextOutputBox.value);
				domHelpers.showTooltip(colorTextOutputBox);
				copyButton.textContent = 'Copied!';
				setTimeout(() => (copyButton.textContent = 'Copy'), 1000);
			} catch (error) {
				console.error(`Failed to copy: ${error}`);
			}
		});

		colorTextOutputBox.addEventListener('input', e => {
			const target = e.target as HTMLInputElement | null;

			if (target) {
				const cssColor = target.value.trim();
				const boxElement = document.getElementById(
					`color-box-${paletteBoxCount}`
				);
				const stripeElement = document.getElementById(
					`color-stripe-${paletteBoxCount}`
				);

				if (boxElement) boxElement.style.backgroundColor = cssColor;
				if (stripeElement)
					stripeElement.style.backgroundColor = cssColor;
			}
		});

		paletteBoxTopHalf.appendChild(colorTextOutputBox);
		paletteBoxTopHalf.appendChild(copyButton);

		const paletteBoxBottomHalf = document.createElement('div');
		paletteBoxBottomHalf.className =
			'palette-box-half palette-box-bottom-half';
		paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;

		const colorBox = document.createElement('div');
		colorBox.className = 'color-box';
		colorBox.id = `color-box-${paletteBoxCount}`;

		colorBox.style.backgroundColor = transforms.getCSSColorString(color);

		paletteBoxBottomHalf.appendChild(colorBox);

		paletteBox.appendChild(paletteBoxTopHalf);
		paletteBox.appendChild(paletteBoxBottomHalf);

		// create color stripe
		const colorStripe = document.createElement('div');
		colorStripe.className = 'color-stripe';
		colorStripe.id = `color-stripe-${paletteBoxCount}`;
		colorStripe.style.backgroundColor = transforms.getCSSColorString(color);

		colorStripe.setAttribute('draggable', 'true');
		attachDragAndDropEventListeners(colorStripe);

		// append palette box to color stripe
		colorStripe.appendChild(paletteBox);

		return {
			colorStripe,
			paletteBoxCount: paletteBoxCount + 1
		};
	} catch (error) {
		console.error(`Failed to execute makePaletteBox: ${error}`);
		return {
			colorStripe: document.createElement('div'),
			paletteBoxCount
		};
	}
}

function showTooltip(tooltipElement: HTMLElement): void {
	try {
		const tooltip =
			tooltipElement.querySelector<HTMLElement>('.tooltiptext');

		if (tooltip) {
			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';
			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, 1000);
		}

		console.log('showTooltip executed');
	} catch (error) {
		console.error(`Failed to execute showTooltip: ${error}`);
	}
}

export const domHelpers: fnObjects.DOMHelpers = {
	attachDragAndDropEventListeners,
	getElement,
	makePaletteBox,
	showTooltip
};
