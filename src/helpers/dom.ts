import { config } from '../config/constants';
import { dragAndDrop } from '../dom/drag-and-drop';
import * as fnObjects from '../index/fn-objects';
import * as domTypes from '../index/dom-types';
import * as colors from '../index/colors';
import { colorUtils } from '../utils/color-utils';
import { commonUtils } from '../utils/common-utils';
import { core } from '../utils/core-utils';

function makePaletteBox(
	color: colors.Color,
	paletteBoxCount: number
): domTypes.MakePaletteBox {
	try {
		if (!commonUtils.validateColorValues(color)) {
			console.error(
				`Invalid ${color.format} color value ${JSON.stringify(color)}`
			);

			return {
				colorStripe: document.createElement('div'),
				paletteBoxCount
			};
		}

		const clonedColor = core.clone(color);

		const paletteBox = document.createElement('div');
		paletteBox.className = 'palette-box';
		paletteBox.id = `palette-box-${paletteBoxCount}`;

		const paletteBoxTopHalf = document.createElement('div');
		paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
		paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

		const colorTextOutputBox = document.createElement(
			'input'
		) as domTypes.ColorInputElement;
		colorTextOutputBox.type = 'text';
		colorTextOutputBox.className = 'color-text-output-box tooltip';
		colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
		colorTextOutputBox.setAttribute('data-format', 'hex');

		const colorString = colorUtils.getCSSColorString(clonedColor);

		colorTextOutputBox.value = colorString || '';
		colorTextOutputBox.colorValues = clonedColor;
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

				clearTimeout(config.tooltipTimeout || 1000);

				copyButton.textContent = 'Copied!';
				setTimeout(
					() => (copyButton.textContent = 'Copy'),
					config.copyButtonTextTimeout || 1000
				);
			} catch (error) {
				console.error(`Failed to copy: ${error}`);
			}
		});

		colorTextOutputBox.addEventListener(
			'input',
			core.debounce((e: Event) => {
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
			}, config.inputDebounce || 200)
		);

		paletteBoxTopHalf.appendChild(colorTextOutputBox);
		paletteBoxTopHalf.appendChild(copyButton);

		const paletteBoxBottomHalf = document.createElement('div');
		paletteBoxBottomHalf.className =
			'palette-box-half palette-box-bottom-half';
		paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;

		const colorBox = document.createElement('div');
		colorBox.className = 'color-box';
		colorBox.id = `color-box-${paletteBoxCount}`;
		colorBox.style.backgroundColor = colorString || '#ffffff';

		paletteBoxBottomHalf.appendChild(colorBox);
		paletteBox.appendChild(paletteBoxTopHalf);
		paletteBox.appendChild(paletteBoxBottomHalf);

		const colorStripe = document.createElement('div');
		colorStripe.className = 'color-stripe';
		colorStripe.id = `color-stripe-${paletteBoxCount}`;
		colorStripe.style.backgroundColor = colorString || '#ffffff';

		colorStripe.setAttribute('draggable', 'true');

		dragAndDrop.attachDragAndDropEventListeners(colorStripe);

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
			}, config.tooltipTimeout || 1000);
		}

		console.log('showTooltip executed');
	} catch (error) {
		console.error(`Failed to execute showTooltip: ${error}`);
	}
}

export const domHelpers: fnObjects.DOMHelpers = {
	makePaletteBox,
	showTooltip
};
