import { dragAndDrop } from '../../src/dom/drag-and-drop';
import { domHelpers } from '../../src/helpers/dom';

describe('dragAndDrop Module', () => {
	let dragSrcElement: HTMLElement;
	let dropTargetElement: HTMLElement;

	beforeEach(() => {
		document.body.innerHTML = `
            <div id="drag-source" class="color-stripe" draggable="true">
                <input class="color-text-output-box" value="dragged color" />
            </div>
            <div id="drop-target" class="color-stripe" draggable="true">
                <input class="color-text-output-box" value="target color" />
            </div>
        `;

		dragSrcElement = document.getElementById('drag-source') as HTMLElement;
		dropTargetElement = document.getElementById(
			'drop-target'
		) as HTMLElement;
	});

	describe('handleDragStart', () => {
		it('should set drag source element and initialize data transfer', () => {
			const event = createDragEvent('dragstart', dragSrcElement);

			dragAndDrop.handleDragStart(event);

			expect(event.dataTransfer?.effectAllowed).toBe('move');
			expect(event.dataTransfer?.getData('text/html')).toBe(
				dragSrcElement.outerHTML
			);
		});
	});

	describe('handleDragOver', () => {
		it('should prevent default behavior and set drop effect', () => {
			const event = createDragEvent('dragover');
			const result = dragAndDrop.handleDragOver(event);

			expect(event.defaultPrevented).toBe(true);
			expect(event.dataTransfer?.dropEffect).toBe('move');
			expect(result).toBe(false);
		});
	});

	describe('handleDragEnd', () => {
		it('should remove dragging class from elements', () => {
			dragSrcElement.classList.add('dragging');

			const event = createDragEvent('dragend', dragSrcElement);

			dragAndDrop.handleDragEnd(event);

			expect(dragSrcElement.classList.contains('dragging')).toBe(false);
		});
	});

	describe('handleDrop', () => {
		it('should swap the HTML and values of drag source and drop target', () => {
			const event = createDragEvent('drop', dropTargetElement);
			const attachListenersSpy = jest.spyOn(
				domHelpers,
				'attachDragAndDropEventListeners'
			);

			dragAndDrop.handleDragStart(
				createDragEvent('dragstart', dragSrcElement)
			);
			dragAndDrop.handleDrop(event);

			const newDragSrcElement = document.getElementById(
				'drag-source'
			) as HTMLElement;
			const newDropTargetElement = document.getElementById(
				'drop-target'
			) as HTMLElement;

			expect(newDragSrcElement.querySelector('input')?.value).toBe(
				'target color'
			);
			expect(newDropTargetElement.querySelector('input')?.value).toBe(
				'dragged color'
			);
			expect(attachListenersSpy).toHaveBeenCalledTimes(2);
		});
	});

	function createDragEvent(type: string, target?: HTMLElement): DragEvent {
		const event = new DragEvent(type, {
			bubbles: true,
			cancelable: true
		});

		Object.defineProperty(event, 'currentTarget', {
			value: target || null,
			writable: false
		});

		Object.defineProperty(event, 'dataTransfer', {
			value: new DataTransfer()
		});

		return event;
	}
});
