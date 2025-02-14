// File: dom/events/palette/partials.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	BrandingUtilsInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	PaletteUtilsInterface,
	SanitationUtilsInterface,
	UpdatePaletteItemColorFn,
	ValidationUtilsInterface
} from '../../../types/index.js';
import { StateManager } from '../../../state/StateManager.js';
import { domData } from '../../../data/dom.js';

export function attachColorInputUpdateListener(
	colorDisplayID: string,
	colorInput: HTMLInputElement,
	column: HTMLElement,
	columnID: string,
	adjust: AdjustmentUtilsInterface,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	paletteUtils: PaletteUtilsInterface,
	sanitize: SanitationUtilsInterface,
	stateManager: StateManager,
	updatePaletteItemColor: UpdatePaletteItemColorFn,
	validate: ValidationUtilsInterface
): void {
	// when color display input changes value...
	domUtils.addEventListener(
		colorDisplayID,
		'input',
		(e: Event) => {
			const newColor = (e.target as HTMLInputElement).value.trim();

			// validate before applying
			if (!validate.userColorInput(newColor)) return;

			// update background color of the palette column
			column.style.backgroundColor = newColor;

			// extract numeric ID from columnID
			const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);

			if (isNaN(numericColumnID)) return;

			// sync color input value
			colorInput.value = newColor;
			if (!columnID || columnID === undefined) return;
			updatePaletteItemColor(
				numericColumnID,
				newColor,
				adjust,
				appServices,
				brand,
				colorHelpers,
				colorUtils,
				coreUtils,
				format,
				paletteUtils,
				sanitize,
				stateManager,
				validate
			);
		},
		appServices
	);
}

export function attachLockBtnLockingListener(
	lockBtnID: string,
	appServices: AppServicesInterface,
	domUtils: DOMUtilsInterface
) {
	domUtils.addEventListener(
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

			const isLocked = paletteColumn.classList.toggle('locked');

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
}

export function attachResizeHandleListener(
	column: HTMLElement,
	resizeHandleID: string,
	appServices: AppServicesInterface,
	domUtils: DOMUtilsInterface,
	stateManager: StateManager
) {
	domUtils.addEventListener(
		resizeHandleID,
		'mousedown',
		(event: MouseEvent) => {
			const columnElement = column as HTMLElement;

			if (!columnElement || columnElement.classList.contains('locked')) {
				return;
			}

			const startX = event.clientX;
			const startWidth = columnElement.offsetWidth;
			const onMouseMove = (moveEvent: MouseEvent) => {
				const diff = moveEvent.clientX - startX;
				columnElement.style.width = `${startWidth + diff}px`;
			};
			const onMouseUp = () => {
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('mouseup', onMouseUp);

				const newSize = columnElement.offsetWidth;
				const columnID = parseInt(columnElement.id.split('-').pop()!);
				const currentState = stateManager.getState();
				const updatedColumns =
					currentState.paletteContainer.columns.map(col =>
						col.id === columnID ? { ...col, size: newSize } : col
					);
				stateManager.updatePaletteColumns(updatedColumns, false, 4);
			};

			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		},
		appServices
	);
}
