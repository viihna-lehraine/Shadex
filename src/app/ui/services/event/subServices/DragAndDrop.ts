// File: app/ui/services/event/subServices/DragAndDrop.js

export class DragAndDropEventSubService {
	private static instance: DragAndDropEventSubService | null = null;
	private dragSrcEl: HTMLElement | null = null;

	constructor() {}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new DragAndDropEventSubService();
		}

		return this.instance;
	}

	public initialize(): void {
		document
			.querySelectorAll('.drag-handle')
			.forEach(handle =>
				handle.addEventListener('dragstart', e =>
					this.onDragStart(e as DragEvent)
				)
			);
		document.querySelectorAll('.color-stripe').forEach(stripe => {
			stripe.addEventListener('dragover', e =>
				this.onDragOver(e as DragEvent)
			);
			stripe.addEventListener('drop', e => this.onDrop(e as DragEvent));
			stripe.addEventListener('dragend', e =>
				this.onDragEnd(e as DragEvent)
			);
		});
	}

	private onDragOver(e: DragEvent): void {
		e.preventDefault();

		e.dataTransfer!.dropEffect = 'move';
	}

	private onDragStart(e: DragEvent): void {
		const handle = e.target as HTMLElement;
		if (!handle.classList.contains('drag-handle')) return;

		this.dragSrcEl = handle.closest('.swatch');
		if (!this.dragSrcEl) return;

		e.dataTransfer?.setData('text/plain', this.dragSrcEl.id);
		this.dragSrcEl.classList.add('dragging');
	}

	private onDragEnd(e: DragEvent): void {
		const target = e.currentTarget as HTMLElement;
		target.classList.remove('dragging');

		document
			.querySelectorAll('.color-stripe')
			.forEach(el => el.classList.remove('dragging'));
	}

	private onDrop(e: DragEvent): void {
		e.stopPropagation();

		const target = e.currentTarget as HTMLElement;
		if (!this.dragSrcEl || this.dragSrcEl === target) return;

		// Swap ID and content
		const dragSrcId = this.dragSrcEl.id;
		const dropTargetId = target.id;

		const dragSrcText = (
			this.dragSrcEl.querySelector(
				'.color-text-output-box'
			) as HTMLInputElement
		).value;
		const dropTargetText = (
			target.querySelector('.color-text-output-box') as HTMLInputElement
		).value;

		const dragSrcOuterHTML = this.dragSrcEl.outerHTML;
		const dropTargetOuterHTML = target.outerHTML;

		this.dragSrcEl.outerHTML = dropTargetOuterHTML;
		target.outerHTML = dragSrcOuterHTML;

		// update swapped elements
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

		// reattach drag listeners
		this.initialize();
	}
}

/*
export function attachDragAndDropListeners(element: HTMLElement | null): void {
	const thisFunction = 'attach()';

	try {
		if (element) {
			element.addEventListener('dragstart', dragStart);
			element.addEventListener('dragover', dragOver);
			element.addEventListener('drop', drop);
			element.addEventListener('dragend', dragEnd);
		}

		if (logMode.debug && logMode.verbosity >= 4)
			logger.debug(
				'Drag and drop event listeners successfully attached',
				${thisModule} > ${thisFunction}
			);
	} catch (error) {
		if (!logMode.error)
			logger.error(
				Failed to execute attachDragAndDropEventListeners: ${error},
				${thisModule} > ${thisFunction}
			);
	}
}
*/
