// events/PaleteEvents.js

import {
	ColorSpace,
	PaletteEventsInterface,
	PaletteItem,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { EventManager } from './EventManager.js';
import { PaletteManager } from '../palette/PaletteManager.js';
import { PaletteState } from '../state/PaletteState.js';
import { StateManager } from '../state/StateManager.js';
import { config } from '../config/index.js';

const classes = config.dom.classes;
const ids = config.dom.ids;
const timers = config.env.timers;

export class PaletteEvents implements PaletteEventsInterface {
	private draggedColumn: HTMLElement | null = null;
	private errors: ServicesInterface['errors'];

	constructor(
		private paletteManager: PaletteManager,
		private paletteState: PaletteState,
		private services: ServicesInterface,
		private stateManager: StateManager,
		private utils: UtilitiesInterface
	) {
		this.errors = services.errors;
	}

	public init() {
		this.errors.handle(() => {
			const paletteContainer = this.utils.core.getElement(
				ids.divs.paletteContainer
			);

			if (!paletteContainer) return;

			this.stateManager.setOnStateLoad(() => {
				this.initializeColumnPositions();
			});

			// delegated event listener for color input changes
			EventManager.add(paletteContainer, 'input', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.colorDisplay)) {
					const column = target.closest(
						classes.paletteColumn
					) as HTMLElement;
					const columnID = column?.id.split('-').pop();

					if (!column || !columnID) return;

					this.handleColorInputChange(event, column, columnID);
				}
			});

			// delegated lock button event listener
			EventManager.add(paletteContainer, 'click', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.lockBtn)) {
					this.toggleLock(target);
				}
			});

			// delegated event listener for modals (open/close)
			EventManager.add(paletteContainer, 'click', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.colorInputBtn)) {
					this.toggleColorModal(target);
				} else if (target.matches(classes.colorInputModal)) {
					if (
						event.target !==
						target.querySelector(classes.colorInputBtn)
					) {
						target.classList.add(classes.hidden);
					}
				}
			});

			// delegated event listener for resizing columns
			EventManager.add(paletteContainer, 'mousedown', ((
				event: MouseEvent
			) => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.resizeHandle)) {
					this.startResize(
						event,
						target.closest(classes.paletteColumn) as HTMLElement
					);
				}
			}) as EventListener);

			// delegated event listener for tooltips (1)
			EventManager.add(paletteContainer, 'mouseover', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.tooltipTrigger)) {
					const tooltipText = target.dataset.tooltip;

					if (tooltipText) {
						this.showTooltip(target, tooltipText);
					}
				}
			});

			// delegated event listener for tooltips (2)
			EventManager.add(paletteContainer, 'mouseout', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.tooltipTrigger)) {
					this.hideTooltip();
				}
			});

			// observe for new elements
			this.createPaletteObserver();
		}, `Failed to call init()`);
	}

	public attachColorCopyHandlers(): void {
		this.errors.handle(() => {
			const paletteContainer = this.utils.core.getElement(
				ids.divs.paletteContainer
			);
			if (!paletteContainer) return;

			EventManager.add(paletteContainer, 'click', event => {
				const target = event.target as HTMLInputElement;
				if (target.matches(classes.colorDisplay))
					this.copyToClipboard(target.value, target);
			});
		}, 'Failed to attach color copy handlers');
	}

	public attachDragAndDropHandlers(): void {
		this.errors.handle(() => {
			const paletteContainer = this.utils.core.getElement(
				ids.divs.paletteContainer
			);
			if (!paletteContainer) {
				this.services.log(
					`Palette container not found! Cannot attach drag-and-drop handlers.`,
					'error'
				);
				return;
			}

			// drag start
			EventManager.add(paletteContainer, 'dragstart', ((
				event: DragEvent
			) => {
				const dragHandle = (event.target as HTMLElement).closest(
					classes.dragHandle
				) as HTMLElement;
				if (!dragHandle) return;

				this.draggedColumn = dragHandle.closest(
					classes.paletteColumn
				) as HTMLElement;
				if (!this.draggedColumn) return;

				event.dataTransfer?.setData(
					'text/plain',
					this.draggedColumn.id
				);
				this.draggedColumn.classList.add('dragging');

				this.services.log(
					`Drag started for column: ${this.draggedColumn.id}`,
					'debug'
				);
			}) as EventListener);

			// drag over (Allow dropping)
			EventManager.add(paletteContainer, 'dragover', ((
				event: DragEvent
			) => {
				event.preventDefault();
				if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
			}) as EventListener);

			// drop (Swap columns)
			EventManager.add(paletteContainer, 'drop', ((event: DragEvent) => {
				event.preventDefault();

				const targetColumn = (event.target as HTMLElement).closest(
					classes.paletteColumn
				) as HTMLElement;
				if (
					!this.draggedColumn ||
					!targetColumn ||
					this.draggedColumn === targetColumn
				)
					return;

				const draggedID = parseInt(
					this.draggedColumn.id.split('-').pop()!
				);
				const targetID = parseInt(targetColumn.id.split('-').pop()!);

				this.paletteManager.swapColumns(draggedID, targetID);

				// swap positions in state
				const updatedColumns = [
					...this.stateManager.getState().paletteContainer.columns
				];
				const draggedIndex = updatedColumns.findIndex(
					col => col.id === draggedID
				);
				const targetIndex = updatedColumns.findIndex(
					col => col.id === targetID
				);

				if (draggedIndex !== -1 && targetIndex !== -1) {
					[
						updatedColumns[draggedIndex].position,
						updatedColumns[targetIndex].position
					] = [
						updatedColumns[targetIndex].position,
						updatedColumns[draggedIndex].position
					];

					this.stateManager.updatePaletteColumns(
						updatedColumns,
						false,
						5
					);
				}

				this.draggedColumn.classList.remove('dragging');
				this.services.log(
					`Successfully swapped columns: ${this.draggedColumn.id} and ${targetColumn.id}`,
					'debug'
				);

				this.draggedColumn = null;
			}) as EventListener);

			// drag end
			EventManager.add(paletteContainer, 'dragend', () => {
				if (this.draggedColumn) {
					this.draggedColumn.classList.remove('dragging');
					this.services.log('Drag ended for column.', 'debug');
					this.draggedColumn = null;
				}
			});

			this.services.log(
				`Drag and drop event listeners attached`,
				'debug'
			);
		}, 'Failed to attach drag-and-drop handlers');
	}

	// initialiezs column positions on page load
	public initializeColumnPositions(): void {
		this.errors.handle(() => {
			const paletteColumns = this.utils.core.getAllElements(
				classes.paletteColumn
			);

			const updatedColumns = Array.from(paletteColumns).map(
				(column, index) => ({
					id: parseInt(column.id.split('-').pop() || '0'),
					isLocked: false,
					position: index + 1,
					size: column.offsetWidth
				})
			);

			this.stateManager.updatePaletteColumns(updatedColumns, false, 4);
		}, 'Failed to initialize column positions');
	}

	// renders column sizes based on stored state
	public renderColumnSizeChange(): void {
		this.errors.handle(() => {
			const paletteColumns = this.utils.core.getAllElements(
				classes.paletteColumn
			);
			const columnsState =
				this.stateManager.getState().paletteContainer.columns;

			paletteColumns.forEach(column => {
				const columnID = parseInt(column.id.split('-').pop()!);
				const columnData = columnsState.find(
					col => col.id === columnID
				);

				if (columnData) {
					(column as HTMLElement).style.width = `${columnData.size}%`;
				}
			});
		}, 'Failed to render column size changes');
	}

	public syncColumnColorsWithState(): void {
		this.errors.handle(() => {
			const paletteColumns =
				this.utils.core.getAllElements<HTMLDivElement>(
					classes.paletteColumn
				);
			const currentPalette = this.stateManager
				.getState()
				.paletteHistory.at(-1);

			if (!currentPalette || !currentPalette.items) {
				this.services.log(
					'No valid palette data found in history!',
					'warn'
				);
				return;
			}

			const userPreference =
				localStorage.getItem('colorPreference') || 'hex';
			const validColorSpace = this.utils.typeGuards.isColorSpace(
				userPreference
			)
				? userPreference
				: 'hex';

			paletteColumns.forEach(column => {
				const columnID = parseInt(column.id.split('-').pop()!);
				const paletteItem = currentPalette.items.find(
					item => item.itemID === columnID
				);

				if (paletteItem) {
					const colorValue = this.getColorByPreference(
						paletteItem.css,
						validColorSpace
					);
					column.style.backgroundColor = colorValue;

					const colorDisplay = column.querySelector(
						classes.colorDisplay
					) as HTMLInputElement;
					if (colorDisplay) colorDisplay.value = colorValue;

					this.services.log(
						`Updated color for column ${columnID}: ${colorValue}`,
						'debug'
					);
				}
			});
		}, 'Failed to sync column colors with state');
	}

	private copyToClipboard(text: string, targetElement: HTMLElement): void {
		this.errors.handle(() => {
			navigator.clipboard
				.writeText(text.trim())
				.then(() => {
					this.showTooltip(targetElement, 'Copied!');
					this.services.log(`Copied color value: ${text}`, 'debug');
					setTimeout(
						() => this.removeTooltip(targetElement),
						timers.tooltipFadeOut
					);
				})
				.catch(err => {
					this.services.log(
						`Error copying to clipboard: ${err}`,
						'error'
					);
				});
		}, 'Failed to copy to clipboard');
	}

	// observes palette container for new elements
	private createPaletteObserver(): void {
		this.errors.handle(() => {
			const paletteContainer = this.utils.core.getElement(
				ids.divs.paletteContainer
			);
			if (!paletteContainer) return;

			const observer = new MutationObserver(
				(mutationsList: MutationRecord[]) => {
					mutationsList.forEach(mutation => {
						mutation.addedNodes.forEach(node => {
							if (
								node instanceof HTMLElement &&
								node.classList.contains(classes.paletteColumn)
							) {
								if (
									!this.stateManager.getState()
										.paletteContainer
								) {
									this.services.log(
										'Skipping initializeColumnPositions() - State is not ready!',
										'warn'
									);
									return;
								}
								this.initializeColumnPositions();
							}
						});
					});
				}
			);

			observer.observe(paletteContainer, {
				childList: true,
				subtree: true
			});

			this.services.log('Palette Container MutationObserver created');
		}, 'Failed to create palette observer');
	}

	private getColorByPreference(
		colorData: PaletteItem['css'],
		preference: ColorSpace
	): string {
		return (
			colorData[preference as keyof PaletteItem['css']] || colorData.hex
		);
	}

	private handleColorInputChange(
		event: Event,
		column: HTMLElement,
		columnID: string
	): void {
		this.errors.handle(() => {
			const newColor = (event.target as HTMLInputElement).value.trim();
			if (!this.utils.validate.userColorInput(newColor)) return;

			column.style.backgroundColor = newColor;

			const colorInput = this.utils.core.getElement(
				`color-input-${columnID}`
			) as HTMLInputElement | null;
			if (colorInput) colorInput.value = newColor;

			const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);
			if (!isNaN(numericColumnID)) {
				this.paletteState.updatePaletteItemColor(
					numericColumnID,
					newColor
				);
			}
		}, 'Failed to handle color input change');
	}

	// hides tooltip for a given element
	private hideTooltip(): void {
		this.utils.dom.hideTooltip();
	}

	private removeTooltip(element: HTMLElement): void {
		this.errors.handle(() => {
			const tooltipId = element.dataset.tooltipId;
			if (!tooltipId) return;

			const tooltip = document.getElementById(tooltipId);
			if (tooltip) tooltip.remove();

			delete element.dataset.tooltipId;
		}, 'Failed to remove tooltip');
	}

	private showTooltip(element: HTMLElement, text: string): void {
		this.errors.handle(() => {
			this.removeTooltip(element);

			const tooltip = document.createElement('div');
			tooltip.classList.add('tooltip');
			tooltip.textContent = text;
			document.body.appendChild(tooltip);

			const rect = element.getBoundingClientRect();
			tooltip.style.left = `${rect.left + window.scrollX}px`;
			tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;

			element.dataset.tooltipId = tooltip.id;
		}, 'Failed to show tooltip');
	}

	// handles resizing of palette columns
	private startResize(event: MouseEvent, column: HTMLElement): void {
		this.errors.handle(() => {
			if (!column || column.classList.contains(classes.locked)) return;

			const startX = event.clientX;
			const startWidth = column.offsetWidth;

			const onMouseMove = (moveEvent: MouseEvent) => {
				const diff = moveEvent.clientX - startX;
				const newSize = startWidth + diff;

				const columnID = parseInt(column.id.split('-').pop()!);
				this.paletteManager.handleColumnResize(columnID, newSize);
			};

			const onMouseUp = () => {
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('mouseup', onMouseUp);

				const columnID = parseInt(column.id.split('-').pop()!);
				const updatedColumns = this.stateManager
					.getState()
					.paletteContainer.columns.map(col =>
						col.id === columnID
							? { ...col, size: column.offsetWidth }
							: col
					);

				this.stateManager.updatePaletteColumns(
					updatedColumns,
					false,
					4
				);
			};

			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		}, 'Failed to start column resize');
	}

	private toggleColorModal(button: HTMLElement): void {
		this.errors.handle(() => {
			const modalID = button.dataset.modalID;
			if (!modalID) return;
			const modal = this.utils.core.getElement<HTMLDivElement>(modalID);
			modal?.classList.toggle(classes.hidden);
		}, 'Failed to toggle color modal');
	}

	// toggles lock state of a palette column
	private toggleLock(button: HTMLElement): void {
		this.errors.handle(() => {
			const column = button.closest(
				classes.paletteColumn
			) as HTMLElement | null;
			if (!column) return;

			const columnID = parseInt(column.id.split('-').pop()!);
			this.paletteManager.handleColumnLock(columnID);
		}, 'Failed to toggle lock state');
	}
}
