// File: dom/events/palette.js

import {
	AppServicesInterface,
	AttachPaletteListenersFn,
	AttachToolTipListenerFn,
	CoreUtilsInterface,
	CreateTooltipElementFn,
	DOMUtilsInterface,
	TypeGuardUtilsInterface,
	UpdatePaletteItemColorFn,
	ValidationUtilsInterface
} from '../../types/index.js';
import { StateManager } from '../../state/StateManager.js';
import { domData } from '../../data/dom.js';

export function attachPaletteListeners(
	appServices: AppServicesInterface,
	attachTooltipListener: AttachToolTipListenerFn,
	coreUtils: CoreUtilsInterface,
	createTooltipElement: CreateTooltipElementFn,
	domUtils: DOMUtilsInterface,
	stateManager: StateManager,
	typeGuards: TypeGuardUtilsInterface,
	updatePaletteItemColor: UpdatePaletteItemColorFn,
	validate: ValidationUtilsInterface
): void {
	const addEventListener = domUtils.addEventListener;

	const paletteColumns = coreUtils.getAllElements(
		`${domData.ids.divs.paletteContainer} ${domData.classes.paletteColumn}`
	);

	paletteColumns.forEach(column => {
		const columnID = column.id.split('-').pop(); // extract column ID

		const colorInputBtnID = `color-input-${columnID}`;
		const colorInputModalID = `color-input-modal-${columnID}`;
		const colorInputID = `color-input-${columnID}`;
		const colorDisplayID = `color-display-${columnID}`;
		const lockBtnID = `lock-btn-${columnID}`;
		const resizeHandleID = `resize-handle-${columnID}`;

		const colorInputBtn = coreUtils.getElement(
			colorInputBtnID
		) as HTMLButtonElement | null;
		const colorInputModal = coreUtils.getElement(
			colorInputModalID
		) as HTMLDivElement | null;
		const colorInput = coreUtils.getElement(
			colorInputID
		) as HTMLInputElement | null;
		const colorDisplay = coreUtils.getElement(
			colorDisplayID
		) as HTMLInputElement | null;
		const lockBtn = coreUtils.getElement(
			lockBtnID
		) as HTMLButtonElement | null;
		const resizeHandle = coreUtils.getElement(
			`resize-handle-${columnID}`
		) as HTMLDivElement | null;

		// color input update logic
		if (colorDisplay && colorInput) {
			// when color display input changes value...
			addEventListener(
				colorDisplayID,
				'input',
				(e: Event) => {
					const newColor = (
						e.target as HTMLInputElement
					).value.trim();

					// validate before applying
					if (!validate.userColorInput(newColor)) return;

					// update background color of the palette column
					column.style.backgroundColor = newColor;
					// sync color input value
					colorInput.value = newColor;

					if (!columnID || columnID === undefined) return;

					updatePaletteItemColor(columnID, newColor, stateManager);
				},
				appServices
			);
		}

		if (colorInputBtn && colorInputModal && colorInput && colorDisplay) {
			// attach tooltip to color input button
			attachTooltipListener(
				colorInputBtnID,
				'Change column color',
				coreUtils,
				createTooltipElement
			);

			// open modal when button is clicked
			addEventListener(
				colorInputID,
				'click',
				() => {
					colorInputModal.classList.toggle('hidden');
				},
				appServices
			);

			// update text field when color is pickd
			addEventListener(
				colorInputID,
				'input',
				(e: Event) => {
					colorDisplay.value = (e.target as HTMLInputElement).value;
				},
				appServices
			);

			// close modal when clicking outside of it
			addEventListener(
				colorInputModalID,
				'click',
				(e: Event) => {
					if (
						!colorInputModal.contains(e.target as Node) &&
						e.target !== colorInputBtn
					) {
						colorInputModal.classList.add('hidden');
					}
				},
				appServices
			);

			// handle locking logic
			if (lockBtn) {
				addEventListener(
					lockBtnID,
					'click',
					(event: Event) => {
						const btn = event.target as HTMLButtonElement;
						const paletteColumn = btn.closest(
							domData.classes.paletteColumn
						) as HTMLDivElement;

						if (!paletteColumn) {
							return;
						}

						const isLocked =
							paletteColumn.classList.toggle('locked');

						// disable interactions when locked
						paletteColumn.draggable = !isLocked;
						const input = paletteColumn.querySelector(
							'input'
						) as HTMLInputElement | null;
						if (input) {
							input.disabled = isLocked;
						}
					},
					appServices
				);

				// add tooltip to lock button
				attachTooltipListener(
					lockBtnID,
					'Lock or unlock this column',
					coreUtils,
					createTooltipElement
				);
			}

			// resize logic
			if (resizeHandle) {
				addEventListener(
					resizeHandleID,
					'mousedown',
					(event: MouseEvent) => {
						const columnElement = column as HTMLElement;

						if (
							!columnElement ||
							columnElement.classList.contains('locked')
						) {
							return;
						}

						const startX = event.clientX;
						const startWidth = columnElement.offsetWidth;
						const onMouseMove = (moveEvent: MouseEvent) => {
							const diff = moveEvent.clientX - startX;
							columnElement.style.width = `${startWidth + diff}px`;
						};
						const onMouseUp = () => {
							window.removeEventListener(
								'mousemove',
								onMouseMove
							);
							window.removeEventListener('mouseup', onMouseUp);

							const newSize = columnElement.offsetWidth;
							const columnID = parseInt(
								columnElement.id.split('-').pop()!
							);
							const currentState = stateManager.getState();
							const updatedColumns =
								currentState.paletteContainer.columns.map(
									col =>
										col.id === columnID
											? { ...col, size: newSize }
											: col
								);
							stateManager.updatePaletteColumns(
								updatedColumns,
								false,
								4
							);
						};

						window.addEventListener('mousemove', onMouseMove);
						window.addEventListener('mouseup', onMouseUp);
					},
					appServices
				);

				// add tooltip to resize handle
				attachTooltipListener(
					resizeHandleID,
					'Drag to resize this column',
					coreUtils,
					createTooltipElement
				);
			}
		}
	});
}

export function createPaletteObserver(
	appServices: AppServicesInterface,
	attachPaletteListeners: AttachPaletteListenersFn,
	attachTooltipListener: AttachToolTipListenerFn,
	coreUtils: CoreUtilsInterface,
	createTooltipElement: CreateTooltipElementFn,
	domUtils: DOMUtilsInterface,
	stateManager: StateManager,
	typeGuards: TypeGuardUtilsInterface,
	updatePaletteItemColor: UpdatePaletteItemColorFn,
	validate: ValidationUtilsInterface
): MutationObserver {
	const log = appServices.log;
	const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
		mutationsList.forEach(mutation => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(node => {
					if (
						node instanceof HTMLElement &&
						node.classList.contains('palette-column')
					) {
						attachPaletteListeners(
							appServices,
							attachTooltipListener,
							coreUtils,
							createTooltipElement,
							domUtils,
							stateManager,
							typeGuards,
							updatePaletteItemColor,
							validate
						);
					}
				});
			}
		});
	});

	log(
		'info',
		'Palette Container MutationObserver created',
		'createPaletteObserver()',
		2
	);

	return observer;
}

export function renderColumnSizeChange(
	coreUtils: CoreUtilsInterface,
	stateManager: StateManager
): void {
	const paletteColumns = coreUtils.getAllElements(
		domData.classes.paletteColumn
	);
	const columnsState = stateManager.getState().paletteContainer.columns;

	paletteColumns.forEach(column => {
		const columnID = parseInt(column.id.split('-').pop()!);
		const columnData = columnsState.find(col => col.id === columnID);

		if (columnData) {
			(column as HTMLElement).style.width = `${columnData.size}%`;
		}
	});
}
