// File: dom/events/PaleteEventsService.ts

import {
	ColorSpace,
	Helpers,
	PaletteEventsContract,
	PaletteItem,
	Services,
	Utilities
} from '../../types/index.js';
import { DOMStore } from '../DOMStore.js';
import { EventManager } from './EventManager.js';
import { PaletteRendererService } from '../PaletteRendererService.js';
import { PaletteStateService } from '../../state/PaletteStateService.js';
import { StateManager } from '../../state/StateManager.js';
import { domConfig, domIndex } from '../../config/index.js';

const caller = 'PaletteEventsService';
const classes = domIndex.classes;

export class PaletteEventsService implements PaletteEventsContract {
	static #instance: PaletteEventsService | null = null;

	#draggedColumn: HTMLElement | null = null;

	#domStore: DOMStore;
	#errors: Services['errors'];
	#helpers: Helpers;
	#log: Services['log'];
	#paletteRenderer: PaletteRendererService;
	#paletteState: PaletteStateService;
	#stateManager: StateManager;
	#utils: Utilities;

	private constructor(
		domStore: DOMStore,
		helpers: Helpers,
		paletteRenderer: PaletteRendererService,
		paletteState: PaletteStateService,
		services: Services,
		stateManager: StateManager,
		utils: Utilities
	) {
		try {
			services.log.info(
				`Constructing PaletteEvents instance`,
				`${caller} constructor`
			);

			this.#errors = services.errors;
			this.#helpers = helpers;
			this.#log = services.log;
			this.#utils = utils;

			this.#domStore = domStore;
			this.#paletteRenderer = paletteRenderer;
			this.#paletteState = paletteState;
			this.#stateManager = stateManager;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(
		domStore: DOMStore,
		helpers: Helpers,
		paletteRenderer: PaletteRendererService,
		paletteState: PaletteStateService,
		services: Services,
		stateManager: StateManager,
		utils: Utilities
	): PaletteEventsService {
		return services.errors.handleSync(() => {
			if (!PaletteEventsService.#instance) {
				services.log.info(
					`Creating PaletteEvents instance`,
					`${caller}.getInstance`
				);

				PaletteEventsService.#instance = new PaletteEventsService(
					domStore,
					helpers,
					paletteRenderer,
					paletteState,
					services,
					stateManager,
					utils
				);
			}

			services.log.info(
				`Returning PaletteEvents instance`,
				`${caller}.getInstance`
			);

			return PaletteEventsService.#instance;
		}, `[${caller}.getInstance]: Failed to create instance.`);
	}

	init() {
		return this.#errors.handleSync(() => {
			const paletteContainer = this.#domStore.getElement(
				'divs',
				'paletteContainer'
			);

			if (!paletteContainer) return;

			// delegated event listener for color input changes
			EventManager.add(paletteContainer, 'input', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.colorDisplay)) {
					const column = target.closest(classes.paletteColumn) as HTMLElement;
					const columnID = column?.id.split('-').pop();

					if (!column || !columnID) return;

					this.#handleColorInputChange(event, column, columnID);
				}
			});

			// delegated lock button event listener
			EventManager.add(paletteContainer, 'click', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.lockBtn)) {
					this.#toggleLock(target);
				}
			});

			// delegated event listener for modals (open/close)
			EventManager.add(paletteContainer, 'click', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.colorInputBtn)) {
					this.#toggleColorModal(target);
				} else if (target.matches(classes.colorInputModal)) {
					if (event.target !== target.querySelector(classes.colorInputBtn)) {
						target.classList.add(classes.hidden);
					}
				}
			});

			// delegated event listener for resizing columns
			EventManager.add(paletteContainer, 'mousedown', ((event: MouseEvent) => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.resizeHandle)) {
					this.#startResize(
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
						this.#showTooltip(target, tooltipText);
					}
				}
			});

			// delegated event listener for tooltips (2)
			EventManager.add(paletteContainer, 'mouseout', event => {
				const target = event.target as HTMLElement;

				if (target.matches(classes.tooltipTrigger)) {
					this.#hideTooltip();
				}
			});

			// observe for new elements
			this.#createPaletteObserver();
		}, `[${caller}]: Failed to call init()`);
	}

	attachColorCopyHandlers(): void {
		return this.#errors.handleSync(() => {
			const paletteContainer = this.#domStore.getElement(
				'divs',
				'paletteContainer'
			);

			if (!paletteContainer) return;

			EventManager.add(paletteContainer, 'click', event => {
				const target = event.target as HTMLInputElement;

				if (target.matches(classes.colorDisplay))
					this.#copyToClipboard(target.value, target);
			});
		}, `[${caller}]: Failed to attach color copy handlers.`);
	}

	async attachDragAndDropHandlers(): Promise<void> {
		return this.#errors.handleSync(() => {
			const paletteContainer = this.#domStore.getElement(
				'divs',
				'paletteContainer'
			);

			if (!paletteContainer) {
				this.#log.warn(
					`Palette container not found! Cannot attach drag-and-drop handlers.`,
					`${caller}.attachDragAndDropHandlers`
				);
				return;
			}

			// drag start
			EventManager.add(paletteContainer, 'dragstart', ((event: DragEvent) => {
				const dragHandle = (event.target as HTMLElement).closest(
					classes.dragHandle
				) as HTMLElement;

				if (!dragHandle) return;

				this.#draggedColumn = dragHandle.closest(
					classes.paletteColumn
				) as HTMLElement;

				if (!this.#draggedColumn) return;

				event.dataTransfer?.setData('text/plain', this.#draggedColumn.id);

				this.#draggedColumn.classList.add('dragging');

				this.#log.debug(
					`Drag started for column: ${this.#draggedColumn.id}`,
					`${caller}.attachDragAndDropHandlers`
				);
			}) as EventListener);

			// drag over (Allow dropping)
			EventManager.add(paletteContainer, 'dragover', ((event: DragEvent) => {
				event.preventDefault();

				if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
			}) as EventListener);

			// drop - handles dropping columns and updates positions atomically
			EventManager.add(paletteContainer, 'drop', (event: Event) => {
				// call inside a non-async wrapper
				void (async (dragEvent: DragEvent) => {
					dragEvent.preventDefault();

					const targetColumn = (dragEvent.target as HTMLElement).closest(
						classes.paletteColumn
					) as HTMLElement;
					if (
						!this.#draggedColumn ||
						!targetColumn ||
						this.#draggedColumn === targetColumn
					)
						return;

					const draggedID = parseInt(this.#draggedColumn.id.split('-').pop()!);
					const targetID = parseInt(targetColumn.id.split('-').pop()!);

					const currentState = await this.#stateManager.getState();

					const updatedColumns = currentState.paletteContainer.columns
						.map(col => {
							if (col.id === draggedID) return { ...col, position: targetID };
							if (col.id === targetID) return { ...col, position: draggedID };
							return col;
						})
						.sort((a, b) => a.position - b.position);

					await this.#stateManager.batchUpdate({
						paletteContainer: {
							...currentState.paletteContainer,
							columns: updatedColumns
						}
					});

					this.#draggedColumn.classList.remove('dragging');

					this.#log.debug(
						`Swapped columns: ${draggedID} and ${targetID}`,
						`${caller}.attachDragAndDropHandlers`
					);

					this.#draggedColumn = null;
				})(event as DragEvent);
			});

			// drag end
			EventManager.add(paletteContainer, 'dragend', () => {
				if (this.#draggedColumn) {
					this.#draggedColumn.classList.remove('dragging');

					this.#log.debug(
						'Drag ended for column.',
						`${caller}.attachDragAndDropHandlers`
					);

					this.#draggedColumn = null;
				}
			});

			this.#log.debug(
				`Drag and drop event listeners attached`,
				`${caller}.attachDragAndDropHandlers`
			);
		}, `[${caller}]: Failed to attach drag-and-drop handlers`);
	}

	// initialiezs column positions on page load
	async initializeColumnPositions(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			const paletteColumns = this.#helpers.dom.getAllElements(
				classes.paletteColumn
			);

			// create updated column data based on DOM elements
			const updatedColumns = Array.from(paletteColumns).map(
				(column, index) => ({
					id: parseInt(column.id.split('-').pop() || '0'),
					isLocked: false,
					position: index + 1,
					size: column.offsetWidth
				})
			);

			const currentState = await this.#stateManager.getState();

			await this.#stateManager.batchUpdate({
				paletteContainer: {
					...currentState.paletteContainer,
					columns: updatedColumns
				}
			});

			this.#log.debug(
				'Initialized column positions.',
				`${caller}.initializeColumnPositions`
			);
		}, `[${caller}]: Failed to initialize column positions.`);
	}

	// renders column sizes based on stored state
	async renderColumnSizeChange(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			const paletteColumns = this.#helpers.dom.getAllElements(
				classes.paletteColumn
			);

			// safely retrieve the latest state
			const { paletteContainer } = await this.#stateManager.getState();

			// update DOM based on state
			paletteColumns.forEach(column => {
				const columnID = parseInt(column.id.split('-').pop()!);
				const columnData = paletteContainer.columns.find(
					col => col.id === columnID
				);

				if (columnData) {
					(column as HTMLElement).style.width = `${columnData.size}%`;
				}
			});

			this.#log.debug(
				'Rendered column size changes.',
				`${caller}.renderColumnSizeChange`
			);
		}, `[${caller}]: Failed to render column size changes.`);
	}

	async syncColumnColorsWithState(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			const paletteColumns = this.#helpers.dom.getAllElements<HTMLDivElement>(
				classes.paletteColumn
			);

			// retrieve the most recent palette from state
			const { paletteHistory } = await this.#stateManager.getState();
			const currentPalette = paletteHistory.at(-1);

			if (!currentPalette?.items) {
				this.#log.warn(
					'No valid palette data found in history!',
					`${caller}.syncColumnColorsWithState`
				);
				return;
			}

			const userPreference = localStorage.getItem('colorPreference') || 'hex';
			const validColorSpace = this.#helpers.typeguards.isColorSpace(
				userPreference
			)
				? userPreference
				: 'hex';

			// update each column's color based on state
			paletteColumns.forEach(column => {
				const columnID = parseInt(column.id.split('-').pop()!);
				const paletteItem = currentPalette.items.find(
					item => item.itemID === columnID
				);

				if (paletteItem) {
					const colorValue = this.#getColorByPreference(
						paletteItem.css,
						validColorSpace
					);
					column.style.backgroundColor = colorValue;

					const colorDisplay = column.querySelector(
						classes.colorDisplay
					) as HTMLInputElement;
					if (colorDisplay) colorDisplay.value = colorValue;

					this.#log.debug(
						`Updated color for column ${columnID}: ${colorValue}`,
						`${caller}.syncColumnColorsWithState`
					);
				}
			});
		}, `[${caller}]: Failed to sync column colors with state.`);
	}

	#copyToClipboard(text: string, targetElement: HTMLElement): void {
		return this.#errors.handleSync(() => {
			navigator.clipboard
				.writeText(text.trim())
				.then(() => {
					this.#showTooltip(targetElement, 'Copied!');
					this.#log.debug(
						`Copied color value: ${text}`,
						`${caller}.#copyToClipboard`
					);

					setTimeout(
						() => this.#removeTooltip(targetElement),
						domConfig.tooltipFadeOut
					);
				})
				.catch(err => {
					this.#log.error(
						`Error copying to clipboard: ${err}`,
						`${caller}.#copyToClipboard`
					);
				});
		}, `[${caller}]: Failed to copy to clipboard.`);
	}

	// observes palette container for new elements
	async #createPaletteObserver(): Promise<void> {
		return this.#errors.handleAsync(async () => {
			const paletteContainer = this.#domStore.getElement(
				'divs',
				'paletteContainer'
			);
			if (!paletteContainer) return;

			const observer = new MutationObserver(
				(mutationsList: MutationRecord[]) => {
					// TODO: figure out what the hell is going on here
					void (async () => {
						for (const mutation of mutationsList) {
							for (const node of mutation.addedNodes) {
								if (
									node instanceof HTMLElement &&
									node.classList.contains(classes.paletteColumn)
								) {
									const state = await this.#stateManager.getState();

									if (!state.paletteContainer) {
										this.#log.warn(
											'Skipping execution of initializeColumnPositions - State is not ready!',
											`${caller}.createPaletteObserver`
										);

										return;
									}

									this.initializeColumnPositions();
								}
							}
						}
					})();
				}
			);

			observer.observe(paletteContainer, {
				childList: true,
				subtree: true
			});

			this.#log.info(
				'Palette Container MutationObserver created.',
				`${caller}.#createPaletteObserver`
			);
		}, `[${caller}]: Failed to create palette observer.`);
	}

	#getColorByPreference(
		colorData: PaletteItem['css'],
		preference: ColorSpace
	): string {
		return this.#errors.handleSync(() => {
			return colorData[preference as keyof PaletteItem['css']] || colorData.hex;
		}, `[${caller}]: Failed to retrieve color by preference.`);
	}

	async #handleColorInputChange(
		event: Event,
		column: HTMLElement,
		columnID: string
	): Promise<void> {
		return this.#errors.handleAsync(async () => {
			const state = await this.#stateManager.getState();
			const newColor = (event.target as HTMLInputElement).value.trim();

			if (!this.#utils.validate.userColorInput(newColor)) return;

			column.style.backgroundColor = newColor;

			const colorInput = this.#helpers.dom.getElement(
				`color-input-${columnID}`
			) as HTMLInputElement | null;

			if (colorInput) colorInput.value = newColor;

			const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);

			if (!isNaN(numericColumnID)) {
				this.#paletteRenderer.updatePaletteItemColor(
					numericColumnID,
					newColor,
					state
				);
			}
		}, `[${caller}]: Failed to handle color input change.`);
	}

	// hides tooltip for a given element
	#hideTooltip(): void {
		return this.#errors.handleSync(() => {
			this.#utils.dom.hideTooltip();
		}, `[${caller}]: Failed to hide tooltip.`);
	}

	#removeTooltip(element: HTMLElement): void {
		return this.#errors.handleSync(() => {
			const tooltipId = element.dataset.tooltipId;
			if (!tooltipId) return;

			const tooltip = document.getElementById(tooltipId);
			if (tooltip) tooltip.remove();

			delete element.dataset.tooltipId;
		}, `[${caller}]: Failed to remove tooltip.`);
	}

	#showTooltip(element: HTMLElement, text: string): void {
		return this.#errors.handleSync(() => {
			this.#removeTooltip(element);

			const tooltip = document.createElement('div');
			tooltip.classList.add('tooltip');
			tooltip.textContent = text;
			document.body.appendChild(tooltip);

			const rect = element.getBoundingClientRect();
			tooltip.style.left = `${rect.left + window.scrollX}px`;
			tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;

			element.dataset.tooltipId = tooltip.id;
		}, `[${caller}]: Failed to show tooltip.`);
	}

	// handles resizing of palette columns
	async #startResize(event: MouseEvent, column: HTMLElement): Promise<void> {
		return this.#errors.handleAsync(async () => {
			if (!column || column.classList.contains(classes.locked)) return;

			const startX = event.clientX;
			const startWidth = column.offsetWidth;

			// update column size dynamically as user drags
			const onMouseMove = (moveEvent: MouseEvent) => {
				const diff = moveEvent.clientX - startX;
				const newSize = startWidth + diff;
				column.style.width = `${newSize}px`; // live feedback while resizing
			};

			// finalize size on mouse release and update state atomically
			const onMouseUp = async () => {
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('mouseup', onMouseUp);

				const columnID = parseInt(column.id.split('-').pop()!);

				const currentState = await this.#stateManager.getState();

				await this.#stateManager.batchUpdate({
					paletteContainer: {
						...currentState.paletteContainer,
						columns: currentState.paletteContainer.columns.map(col =>
							col.id === columnID ? { ...col, size: column.offsetWidth } : col
						)
					}
				});

				this.#log.debug(
					`Resized column ${columnID} to ${column.offsetWidth}px`,
					`${caller}.#startResize`
				);
			};

			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		}, `[${caller}]: Failed to start column resize.`);
	}

	#toggleColorModal(button: HTMLElement): void {
		return this.#errors.handleSync(() => {
			const modalID = button.dataset.modalID;

			if (!modalID) return;

			const modal = this.#helpers.dom.getElement<HTMLDivElement>(modalID);

			modal?.classList.toggle(classes.hidden);
		}, `[${caller}]: Failed to toggle color modal.`);
	}

	// toggles lock state of a palette column
	#toggleLock(button: HTMLElement): void {
		return this.#errors.handleSync(() => {
			const column = button.closest(
				classes.paletteColumn
			) as HTMLElement | null;

			if (!column) return;

			const columnID = parseInt(column.id.split('-').pop()!);

			this.#paletteState.handleColumnLock(columnID);
		}, `[${caller}]: Failed to toggle lock state.`);
	}
}
