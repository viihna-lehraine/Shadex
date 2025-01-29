// File: common/helpers/dom.js

import {
	Color,
	ColorInputElement,
	Color_StringProps,
	CommonFn_MasterInterface,
	MakePaletteBox
} from '../../types/index.js';
import { constsData as consts } from '../../data/consts.js';
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { modeData as mode } from '../../data/mode.js';

const thisModule = 'common/helpers/dom.js';

const logger = await createLogger();

const logMode = mode.logging;
const timeouts = consts.timeouts;

let dragSrcEl: HTMLElement | null = null;

function attachDragAndDropListeners(element: HTMLElement | null): void {
	const thisMethod = 'attachDragAndDropEventListeners()';

	try {
		if (element) {
			element.addEventListener('dragstart', dragStart);
			element.addEventListener('dragover', dragOver);
			element.addEventListener('drop', drop);
			element.addEventListener('dragend', dragEnd);
		}

		if (!mode.quiet)
			logger.info(
				'Drag and drop event listeners successfully attached',
				`${thisModule} > ${thisMethod}`
			);
	} catch (error) {
		if (!logMode.error)
			logger.error(
				`Failed to execute attachDragAndDropEventListeners: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
	}
}

function dragStart(e: DragEvent): void {
	const thisMethod = 'handleDragStart()';

	try {
		dragSrcEl = e.currentTarget as HTMLElement;

		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			logger.info(
				'handleDragStart complete',
				`${thisModule} > ${thisMethod}`
			);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error in handleDragStart: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
	}
}

function dragOver(e: DragEvent): boolean {
	const thisMethod = 'handleDragOver()';

	try {
		e.preventDefault();

		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			logger.info(
				'handleDragOver complete',
				`${thisModule} > ${thisMethod}`
			);

		return false;
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error in handleDragOver: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return false;
	}
}

function dragEnd(e: DragEvent): void {
	const thisMethod = 'handleDragEnd()';

	try {
		const target = e.currentTarget as HTMLElement;

		target.classList.remove('dragging');

		document.querySelectorAll('.color-stripe').forEach(el => {
			el.classList.remove('dragging');
		});

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			logger.info(
				'handleDragEnd complete',
				`${thisModule} > ${thisMethod}`
			);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error in handleDragEnd: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
	}
}

function drop(e: DragEvent): void {
	const thisMethod = 'drop()';

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
				logger.info(
					'calling attachDragAndDropEventListeners for new elements',
					`${thisModule} > ${thisMethod}`
				);

			attachDragAndDropListeners(newDragSrcEl);

			attachDragAndDropListeners(newDropTargetEl);
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			logger.info('handleDrop complete', `${thisModule} > ${thisMethod}`);
	} catch (error) {
		if (!logMode.error)
			logger.error(
				`Error in handleDrop: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
	}
}

async function makePaletteBox(
	color: Color,
	paletteBoxCount: number
): Promise<MakePaletteBox> {
	const thisMethod = 'makePaletteBox()';

	try {
		if (!coreUtils.validate.colorValues(color)) {
			if (!logMode.error)
				logger.error(
					`Invalid ${color.format} color value ${JSON.stringify(color)}`,
					`${thisModule} > ${thisMethod}`
				);

			return {
				colorStripe: document.createElement('div'),
				paletteBoxCount
			};
		}

		const clonedColor = coreUtils.base.clone(color);

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

		const colorString =
			await coreUtils.convert.colorToCSSColorString(clonedColor);

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

				clearTimeout(consts.timeouts.tooltip || 1000);

				copyButton.textContent = 'Copied!';
				setTimeout(
					() => (copyButton.textContent = 'Copy'),
					consts.timeouts.copyButtonText || 1000
				);
			} catch (error) {
				if (!logMode.error)
					logger.error(
						`Failed to copy: ${error}`,
						`${thisModule} > ${thisMethod}`
					);
			}
		});

		colorTextOutputBox.addEventListener(
			'input',
			coreUtils.base.debounce((e: Event) => {
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
			}, consts.debounce.input || 200)
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
		if (!logMode.error)
			logger.error(
				`Failed to execute makePaletteBox: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return {
			colorStripe: document.createElement('div'),
			paletteBoxCount
		};
	}
}

function showToast(message: string): void {
	const thisMethod = 'showToast()';
	const toast = document.createElement('div');

	toast.className = 'toast-message';

	toast.textContent = message;

	document.body.appendChild(toast);

	if (!mode.quiet && logMode.verbosity > 3)
		logger.info('Toast message added', `${thisModule} > ${thisMethod}`);

	setTimeout(() => {
		toast.classList.add('fade-out');

		if (!mode.quiet && logMode.verbosity > 3)
			logger.info(
				'Toast message faded out',
				`${thisModule} > ${thisMethod}`
			);

		toast.addEventListener('transitioned', () => toast.remove());
	}, timeouts.toast || 3000);
}

function showTooltip(tooltipElement: HTMLElement): void {
	const thisMethod = 'showTooltip()';

	try {
		const tooltip =
			tooltipElement.querySelector<HTMLElement>('.tooltiptext');

		if (tooltip) {
			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';
			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, consts.timeouts.tooltip || 1000);
		}

		if (!mode.quiet && logMode.verbosity > 3)
			logger.info(
				'showTooltip executed',
				`${thisModule} > ${thisMethod}`
			);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to execute showTooltip: ${error}`,
				`${thisModule} > ${thisMethod}`
			);
	}
}

async function validateAndConvertColor(
	color: Color | Color_StringProps | null
): Promise<Color | null> {
	const thisMethod = 'validateAndConvertColor()';

	if (!color) return null;

	const convertedColor = coreUtils.guards.isColorString(color)
		? await coreUtils.convert.colorStringToColor(color)
		: color;

	if (!coreUtils.validate.colorValues(convertedColor)) {
		if (logMode.error)
			logger.error(
				`Invalid color: ${JSON.stringify(convertedColor)}`,
				`${thisModule} > ${thisMethod}`
			);

		return null;
	}

	return convertedColor;
}

export const domHelpers: CommonFn_MasterInterface['helpers']['dom'] = {
	attachDragAndDropListeners,
	handle: {
		dragStart,
		dragOver,
		dragEnd,
		drop
	},
	makePaletteBox,
	showToast,
	showTooltip,
	validateAndConvertColor
} as const;
