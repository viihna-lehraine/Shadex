// File: dom/eventListeners/dad.js

import { createLogger } from '../../logger/factory.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'dom/eventListeners/groups/dad.js';

const logger = await createLogger();

let dragSrcEl: HTMLElement | null = null;

export function attachDADListeners(element: HTMLElement | null): void {
	const thisFunction = 'attach()';

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
				`${thisModule} > ${thisFunction}`
			);
	} catch (error) {
		if (!logMode.error)
			logger.error(
				`Failed to execute attachDragAndDropEventListeners: ${error}`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

function dragStart(e: DragEvent): void {
	const thisFunction = 'handleDragStart()';

	try {
		dragSrcEl = e.currentTarget as HTMLElement;

		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
		}

		if (!mode.quiet && mode.debug && logMode.verbosity > 3)
			logger.info(
				'handleDragStart complete',
				`${thisModule} > ${thisFunction}`
			);
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Error in handleDragStart: ${error}`,
				`${thisModule} > ${thisFunction}`
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

			attachDADListeners(newDragSrcEl);

			attachDADListeners(newDropTargetEl);
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

export const dadListeners = {
	attach: attachDADListeners
};
