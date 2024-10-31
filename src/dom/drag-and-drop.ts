import { domHelpers } from '../helpers/dom';
import * as fnObjects from '../index/fn-objects';

let dragSrcEl: HTMLElement | null = null;

function handleDragStart(e: DragEvent): void {
	try {
		dragSrcEl = e.currentTarget as HTMLElement;

		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
		}

		console.log('handleDragStart complete');
	} catch (error) {
		console.error(`Error in handleDragStart: ${error}`);
	}
}

function handleDragOver(e: DragEvent): boolean {
	try {
		e.preventDefault();

		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}

		console.log('handleDragOver complete');

		return false;
	} catch (error) {
		console.error(`Error in handleDragOver: ${error}`);

		return false;
	}
}

function handleDragEnd(e: DragEvent): void {
	try {
		const target = e.currentTarget as HTMLElement;

		target.classList.remove('dragging');

		document.querySelectorAll('.color-stripe').forEach(el => {
			el.classList.remove('dragging');
		});

		console.log('handleDragEnd complete');
	} catch (error) {
		console.error(`Error in handleDragEnd: ${error}`);
	}
}

function handleDrop(e: DragEvent): void {
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

			console.log(
				'calling attachDragAndDropEventListeners for new elements'
			);

			domHelpers.attachDragAndDropEventListeners(newDragSrcEl);

			domHelpers.attachDragAndDropEventListeners(newDropTargetEl);
		}

		console.log('handleDrop complete');
	} catch (error) {
		console.error(`Error in handleDrop: ${error}`);
	}
}

export const dragAndDrop: fnObjects.DragAndDrop = {
	handleDragEnd,
	handleDragOver,
	handleDragStart,
	handleDrop
};
