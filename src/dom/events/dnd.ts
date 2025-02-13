// File: dom/events/dnd.js

import {
	AppServicesInterface,
	CoreUtilsInterface
} from '../../types/index.js';
import { StateManager } from '../../state/StateManager.js';
import { domData } from '../../data/dom.js';

const classes = domData.classes;

let draggedColumn: HTMLElement | null = null;

export function attachDnDHandlers(
	appServices: AppServicesInterface,
	coreUtils: CoreUtilsInterface,
	stateManager: StateManager
): void {
	const log = appServices.log;

	const paletteContainer = coreUtils.getElement<HTMLDivElement>(
		domData.ids.divs.paletteContainer
	);

	// ensure event listeners are added ONLY once
	if (!paletteContainer) {
		log(
			'error',
			`Palette container not found! Cannot attach DnD handlers.`,
			'dom/events/dnd > attachDnDHandlers()',
			1
		);

		return;
	}

	paletteContainer.dataset.dndAttached = 'true';
	stateManager.updateDnDAttachedState(true);

	// drag start (when clicking dragHandle)
	paletteContainer.addEventListener('dragstart', (e: DragEvent) => {
		const dragHandle =
			(e.target as HTMLElement)
			.closest(classes.dragHandle) as HTMLElement;
		if (!dragHandle) {
			log(
				'error',
				`Drag handle element not found! Cannot start drag event.`,
				'attachDnDHandlers()',
				4
			)
			return;
		}

		draggedColumn =
			dragHandle.closest(classes.paletteColumn) as HTMLElement;

		if (!draggedColumn) {
			log(
				'error',
				`Dragged column element not found! Cannot start drag event.`,
				'attachDnDHandlers()',
				4
			)
			return;
		}

		e.dataTransfer?.setData('text/plain', draggedColumn.id);
		draggedColumn.classList.add('dragging');

		log(
			'debug',
			`Successfully started drag event for column: ${draggedColumn.id}`,
			'attachDnDHandlers()',
			4
		)
	});

	// drag over (allow dropping)
	paletteContainer.addEventListener('dragover', (e: DragEvent) => {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';

		log(
			'debug',
			`Drag over event detected!`,
			'attachDnDHandlers()',
			4
		)
	});

	// drop (swap columns)
	paletteContainer.addEventListener('drop', (e: DragEvent) => {
		e.preventDefault();

		// get target column where dragged column will be dropped
		const targetColumn =
			(e.target as HTMLElement)
			.closest(classes.paletteColumn) as HTMLElement;

		// if dragged column or target column are invalid or same, return
		if (
			!draggedColumn ||
			!targetColumn ||
			draggedColumn === targetColumn
		) {
			log(
				'warn',
				`Invalid drop target! Cannot swap columns.`,
				'attachDnDHandlers()',
				4
			)
			return;
		}

		// ensure target column has a valid parent element
		const parent = targetColumn.parentElement;
		if (!parent) {
			log(
				'error',
				`Parent element not found! Cannot swap columns.`,
				'attachDnDHandlers()',
				4
			)
			return;
		}

		// get current positions of the dragged and target columns

		const draggedColumnID = parseInt(draggedColumn.id.split('-').pop() || '0');
		const targetColumnID = parseInt(targetColumn.id.split('-').pop() || '0');

		// swap elements in the DOM
		const updatedColumns = [...stateManager.getState().paletteContainer.columns];
		const draggedIndex = updatedColumns.findIndex(col => col.id === draggedColumnID);
		const targetIndex = updatedColumns.findIndex(col => col.id === targetColumnID);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			// swap positions in the state (ensure positions remain 1-5 in order)
			const temp = updatedColumns[draggedIndex].position;
			updatedColumns[draggedIndex].position = updatedColumns[targetIndex].position;
			updatedColumns[targetIndex].position = temp;

			// update state with new column order
			stateManager.updatePaletteColumns(updatedColumns, false, 5);
		}

		// swap columns in the DOM
		const draggedNext = draggedColumn.nextElementSibling;
		const targetNext = targetColumn.nextElementSibling;

		// insert dragged column before target's next sibling (and vice versa)
		parent.insertBefore(draggedColumn, targetNext);
		parent.insertBefore(targetColumn, draggedNext);

		// cleanup: remove dragging class from dragged column
		draggedColumn.classList.remove('dragging');

		log(
			'debug',
			`Successfully swapped columns: ${draggedColumn.id} and ${targetColumn.id}`,
			'attachDnDHandlers()',
			4
		)

		// reset dragged column
		draggedColumn = null;
	});

	// drag end
	paletteContainer.addEventListener('dragend', () => {
		if (draggedColumn) {
			draggedColumn.classList.remove('dragging');

			log(
				'debug',
				`Drag end event detected!`,
				'attachDnDHandlers()',
				4
			)
		}
	});
}
