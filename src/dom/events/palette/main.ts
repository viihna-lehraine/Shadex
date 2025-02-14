// File: dom/events/palette/main.js

import {
	AdjustmentUtilsInterface,
	AppServicesInterface,
	AttachColorInputUpdateListenerFn,
	AttachLockBtnLockingListenerFn,
	AttachPaletteListenersFn,
	AttachResizeHandleListenerFn,
	AttachToolTipListenerFn,
	BrandingUtilsInterface,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	CreateTooltipElementFn,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	PaletteUtilsInterface,
	SanitationUtilsInterface,
	UpdatePaletteItemColorFn,
	ValidationUtilsInterface
} from '../../../types/index.js';
import { StateManager } from '../../../state/StateManager.js';
import { domData } from '../../../data/dom.js';

export function attachPaletteListeners(
	adjust: AdjustmentUtilsInterface,
	appServices: AppServicesInterface,
	attachColorInputUpdateListener: AttachColorInputUpdateListenerFn,
	attachLockBtnLockingListener: AttachLockBtnLockingListenerFn,
	attachResizeHandleListener: AttachResizeHandleListenerFn,
	attachTooltipListener: AttachToolTipListenerFn,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	createTooltipElement: CreateTooltipElementFn,
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	paletteUtils: PaletteUtilsInterface,
	sanitize: SanitationUtilsInterface,
	stateManager: StateManager,
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
		if (colorDisplay && colorInput && columnID !== undefined) {
			attachColorInputUpdateListener(
				colorDisplayID,
				colorInput,
				column,
				columnID,
				adjust,
				appServices,
				brand,
				colorHelpers,
				colorUtils,
				coreUtils,
				domUtils,
				format,
				paletteUtils,
				sanitize,
				stateManager,
				updatePaletteItemColor,
				validate
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
				attachLockBtnLockingListener(lockBtnID, appServices, domUtils);

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
				attachResizeHandleListener(
					column,
					resizeHandleID,
					appServices,
					domUtils,
					stateManager
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
	adjust: AdjustmentUtilsInterface,
	appServices: AppServicesInterface,
	attachColorInputUpdateListener: AttachColorInputUpdateListenerFn,
	attachLockBtnLockingListener: AttachLockBtnLockingListenerFn,
	attachPaletteListeners: AttachPaletteListenersFn,
	attachResizeHandleListener: AttachResizeHandleListenerFn,
	attachTooltipListener: AttachToolTipListenerFn,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	createTooltipElement: CreateTooltipElementFn,
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	paletteUtils: PaletteUtilsInterface,
	sanitize: SanitationUtilsInterface,
	stateManager: StateManager,
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
							adjust,
							appServices,
							attachColorInputUpdateListener,
							attachLockBtnLockingListener,
							attachResizeHandleListener,
							attachTooltipListener,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							createTooltipElement,
							domUtils,
							format,
							paletteUtils,
							sanitize,
							stateManager,
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
