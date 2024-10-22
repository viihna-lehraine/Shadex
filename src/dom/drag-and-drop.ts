let dragSrcEl: HTMLElement | null = null;

export function attachDragAndDropEventListeners(
	element: HTMLElement | null
): void {
	if (element) {
		element.addEventListener('dragstart', handleDragStart);
		element.addEventListener('dragover', handleDragOver);
		element.addEventListener('drop', handleDrop);
		element.addEventListener('dragend', handleDragEnd);
	}
}

export function handleDragStart(e: DragEvent): void {
	console.log('executing handleDragStart');

	dragSrcEl = e.currentTarget as HTMLElement;
	if (e.dataTransfer) {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
	}

	console.log('handleDragStart complete');
}

export function handleDragOver(e: DragEvent): boolean {
	console.log('executing handleDragOver');

	e.preventDefault();

	if (e.dataTransfer) {
		e.dataTransfer.dropEffect = 'move';
	}

	console.log('handleDragOver complete');
	return false;
}

export function handleDrop(e: DragEvent): void {
	console.log('executing handleDrop');

	e.stopPropagation(); // prevents default drop action

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
			target.querySelector('.color-text-output-box') as HTMLInputElement
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

		console.log('calling attachDragAndDropEventListeners for new elements');
		attachDragAndDropEventListeners(newDragSrcEl);
		attachDragAndDropEventListeners(newDropTargetEl);
	}

	console.log('handleDrop complete');
}

export function handleDragEnd(e: DragEvent): void {
	console.log('executing handleDragEnd');

	const target = e.currentTarget as HTMLElement;
	target.classList.remove('dragging');

	document.querySelectorAll('.color-stripe').forEach(el => {
		el.classList.remove('dragging');
	});

	console.log('handleDragEnd complete');
}
