// File: src/common/helpers/dom.js

import {
	Color,
	ColorInputElement,
	ColorString,
	CommonHelpersDOM,
	CommonHelpersDOM_Handle,
	MakePaletteBox
} from '../../index/index.js';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { log } from '../../classes/logger/index.js';

const logMode = data.mode.logging;
const mode = data.mode;
const timeouts = data.consts.timeouts;

let dragSrcEl: HTMLElement | null = null;

function attachDragAndDropListeners(element: HTMLElement | null): void {
	try {
		if (element) {
			element.addEventListener('dragstart', dragStart);
			element.addEventListener('dragover', dragOver);
			element.addEventListener('drop', drop);
			element.addEventListener('dragend', dragEnd);
		}

		if (!mode.quiet)
			log.info('Drag and drop event listeners successfully attached');
	} catch (error) {
		if (!logMode.errors)
			log.error(
				`Failed to execute attachDragAndDropEventListeners: ${error}`
			);
	}
}

function dragStart(e: DragEvent): void {
	try {
		dragSrcEl = e.currentTarget as HTMLElement;

		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			log.info('handleDragStart complete');
	} catch (error) {
		if (logMode.errors) log.error(`Error in handleDragStart: ${error}`);
	}
}

function dragOver(e: DragEvent): boolean {
	try {
		e.preventDefault();

		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			log.info('handleDragOver complete');

		return false;
	} catch (error) {
		if (logMode.errors) log.error(`Error in handleDragOver: ${error}`);

		return false;
	}
}

function dragEnd(e: DragEvent): void {
	try {
		const target = e.currentTarget as HTMLElement;

		target.classList.remove('dragging');

		document.querySelectorAll('.color-stripe').forEach(el => {
			el.classList.remove('dragging');
		});

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			log.info('handleDragEnd complete');
	} catch (error) {
		if (logMode.errors) console.error(`Error in handleDragEnd: ${error}`);
	}
}

function drop(e: DragEvent): void {
	try {
		e.stopPropagation();

		const target = e.currentTarget as HTMLElement;

		if (dragSrcEl && dragSrcEl !== target) {
			const dragSrcId = dragSrcEl.id;
			const dropTargetId = target.id;
			const dragSrcText = (
				dragSrcEl.querySelector(
					'.color-text-output-box'
				) as HTMLInputElement
			).value;
			const dropTargetText = (
				target.querySelector(
					'.color-text-output-box'
				) as HTMLInputElement
			).value;
			const dragSrcOuterHTML = dragSrcEl.outerHTML;
			const dropTargetOuterHTML = target.outerHTML;

			dragSrcEl.outerHTML = dropTargetOuterHTML;
			target.outerHTML = dragSrcOuterHTML;

			const newDragSrcEl = document.getElementById(
				dropTargetId
			) as HTMLElement;
			const newDropTargetEl = document.getElementById(
				dragSrcId
			) as HTMLElement;

			newDragSrcEl.id = dragSrcId;
			newDropTargetEl.id = dropTargetId;

			(
				newDragSrcEl.querySelector(
					'.color-text-output-box'
				) as HTMLInputElement
			).value = dropTargetText;
			(
				newDropTargetEl.querySelector(
					'.color-text-output-box'
				) as HTMLInputElement
			).value = dragSrcText;

			if (!mode.quiet && mode.debug && logMode.verbosity > 3)
				log.info(
					'calling attachDragAndDropEventListeners for new elements'
				);

			attachDragAndDropListeners(newDragSrcEl);

			attachDragAndDropListeners(newDropTargetEl);
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			log.info('handleDrop complete');
	} catch (error) {
		if (!logMode.errors) log.error(`Error in handleDrop: ${error}`);
	}
}

function makePaletteBox(color: Color, paletteBoxCount: number): MakePaletteBox {
	try {
		if (!core.validate.colorValues(color)) {
			if (!logMode.errors)
				console.error(
					`Invalid ${color.format} color value ${JSON.stringify(color)}`
				);

			return {
				colorStripe: document.createElement('div'),
				paletteBoxCount
			};
		}

		const clonedColor = core.base.clone(color);

		const paletteBox = document.createElement('div');
		paletteBox.className = 'palette-box';
		paletteBox.id = `palette-box-${paletteBoxCount}`;

		const paletteBoxTopHalf = document.createElement('div');
		paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
		paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

		const colorTextOutputBox = document.createElement(
			'input'
		) as ColorInputElement;
		colorTextOutputBox.type = 'text';
		colorTextOutputBox.className = 'color-text-output-box tooltip';
		colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
		colorTextOutputBox.setAttribute('data-format', 'hex');

		const colorString = core.convert.toCSSColorString(clonedColor);

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

				showTooltip(colorTextOutputBox);

				clearTimeout(data.consts.timeouts.tooltip || 1000);

				copyButton.textContent = 'Copied!';
				setTimeout(
					() => (copyButton.textContent = 'Copy'),
					data.consts.timeouts.copyButtonText || 1000
				);
			} catch (error) {
				if (!logMode.errors) log.error(`Failed to copy: ${error}`);
			}
		});

		colorTextOutputBox.addEventListener(
			'input',
			core.base.debounce((e: Event) => {
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
			}, data.consts.debounce.input || 200)
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

		attachDragAndDropListeners(colorStripe);

		colorStripe.appendChild(paletteBox);

		return {
			colorStripe,
			paletteBoxCount: paletteBoxCount + 1
		};
	} catch (error) {
		if (!logMode.errors)
			log.error(`Failed to execute makePaletteBox: ${error}`);

		return {
			colorStripe: document.createElement('div'),
			paletteBoxCount
		};
	}
}

function showToast(message: string): void {
	const toast = document.createElement('div');

	toast.className = 'toast-message';

	toast.textContent = message;

	document.body.appendChild(toast);

	if (!mode.quiet && logMode.verbosity > 3) log.info('Toast message added');

	setTimeout(() => {
		toast.classList.add('fade-out');

		if (!mode.quiet && logMode.verbosity > 3)
			log.info('Toast message faded out');

		toast.addEventListener('transitioned', () => toast.remove());
	}, timeouts.toast || 3000);
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
			}, data.consts.timeouts.tooltip || 1000);
		}

		if (!mode.quiet && logMode.verbosity > 3)
			log.info('showTooltip executed');
	} catch (error) {
		if (logMode.errors)
			log.error(`Failed to execute showTooltip: ${error}`);
	}
}

function validateAndConvertColor(
	color: Color | ColorString | null
): Color | null {
	if (!color) return null;

	const convertedColor = core.guards.isColorString(color)
		? core.convert.toColor(color)
		: color;

	if (!core.validate.colorValues(convertedColor)) {
		if (logMode.errors)
			log.error(`Invalid color: ${JSON.stringify(convertedColor)}`);

		return null;
	}

	return convertedColor;
}

const handle: CommonHelpersDOM_Handle = {
	dragStart,
	dragOver,
	dragEnd,
	drop
};

export const dom: CommonHelpersDOM = {
	attachDragAndDropListeners,
	handle,
	makePaletteBox,
	showToast,
	showTooltip,
	validateAndConvertColor
} as const;
