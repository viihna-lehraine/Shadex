// File: dom/events/PaleteEventsService.ts
import { EventManager } from '../index.js';
import { domConfig, domIndex } from '../../config/index.js';
const caller = 'PaletteEventsService';
const classes = domIndex.classes;
export class PaletteEventsService {
    static #instance = null;
    #draggedColumn = null;
    #domStore;
    #errors;
    #helpers;
    #log;
    #paletteRenderer;
    #paletteState;
    #stateManager;
    #utils;
    constructor(domStore, helpers, paletteRenderer, paletteState, services, stateManager, utils) {
        try {
            services.log.info(`Constructing PaletteEvents instance`, `${caller} constructor`);
            this.#errors = services.errors;
            this.#helpers = helpers;
            this.#log = services.log;
            this.#utils = utils;
            this.#domStore = domStore;
            this.#paletteRenderer = paletteRenderer;
            this.#paletteState = paletteState;
            this.#stateManager = stateManager;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(domStore, helpers, paletteRenderer, paletteState, services, stateManager, utils) {
        return services.errors.handleSync(() => {
            if (!PaletteEventsService.#instance) {
                services.log.info(`Creating PaletteEvents instance`, `${caller}.getInstance`);
                PaletteEventsService.#instance = new PaletteEventsService(domStore, helpers, paletteRenderer, paletteState, services, stateManager, utils);
            }
            services.log.info(`Returning PaletteEvents instance`, `${caller}.getInstance`);
            return PaletteEventsService.#instance;
        }, `[${caller}.getInstance]: Failed to create instance.`);
    }
    init() {
        return this.#errors.handleSync(() => {
            const paletteContainer = this.#domStore.getElement('divs', 'paletteContainer');
            if (!paletteContainer)
                return;
            // delegated event listener for color input changes
            EventManager.add(paletteContainer, 'input', event => {
                const target = event.target;
                if (target.matches(classes.colorDisplay)) {
                    const column = target.closest(classes.paletteColumn);
                    const columnID = column?.id.split('-').pop();
                    if (!column || !columnID)
                        return;
                    this.#handleColorInputChange(event, column, columnID);
                }
            });
            // delegated lock button event listener
            EventManager.add(paletteContainer, 'click', event => {
                const target = event.target;
                if (target.matches(classes.lockBtn)) {
                    this.#toggleLock(target);
                }
            });
            // delegated event listener for modals (open/close)
            EventManager.add(paletteContainer, 'click', event => {
                const target = event.target;
                if (target.matches(classes.colorInputBtn)) {
                    this.#toggleColorModal(target);
                }
                else if (target.matches(classes.colorInputModal)) {
                    if (event.target !==
                        target.querySelector(classes.colorInputBtn)) {
                        target.classList.add(classes.hidden);
                    }
                }
            });
            // delegated event listener for resizing columns
            EventManager.add(paletteContainer, 'mousedown', ((event) => {
                const target = event.target;
                if (target.matches(classes.resizeHandle)) {
                    this.#startResize(event, target.closest(classes.paletteColumn));
                }
            }));
            // delegated event listener for tooltips (1)
            EventManager.add(paletteContainer, 'mouseover', event => {
                const target = event.target;
                if (target.matches(classes.tooltipTrigger)) {
                    const tooltipText = target.dataset.tooltip;
                    if (tooltipText) {
                        this.#showTooltip(target, tooltipText);
                    }
                }
            });
            // delegated event listener for tooltips (2)
            EventManager.add(paletteContainer, 'mouseout', event => {
                const target = event.target;
                if (target.matches(classes.tooltipTrigger)) {
                    this.#hideTooltip();
                }
            });
            // observe for new elements
            this.#createPaletteObserver();
        }, `[${caller}]: Failed to call init()`);
    }
    attachColorCopyHandlers() {
        return this.#errors.handleSync(() => {
            const paletteContainer = this.#domStore.getElement('divs', 'paletteContainer');
            if (!paletteContainer)
                return;
            EventManager.add(paletteContainer, 'click', event => {
                const target = event.target;
                if (target.matches(classes.colorDisplay))
                    this.#copyToClipboard(target.value, target);
            });
        }, `[${caller}]: Failed to attach color copy handlers.`);
    }
    async attachDragAndDropHandlers() {
        return this.#errors.handleSync(() => {
            const paletteContainer = this.#domStore.getElement('divs', 'paletteContainer');
            if (!paletteContainer) {
                this.#log.warn(`Palette container not found! Cannot attach drag-and-drop handlers.`, `${caller}.attachDragAndDropHandlers`);
                return;
            }
            // drag start
            EventManager.add(paletteContainer, 'dragstart', ((event) => {
                const dragHandle = event.target.closest(classes.dragHandle);
                if (!dragHandle)
                    return;
                this.#draggedColumn = dragHandle.closest(classes.paletteColumn);
                if (!this.#draggedColumn)
                    return;
                event.dataTransfer?.setData('text/plain', this.#draggedColumn.id);
                this.#draggedColumn.classList.add('dragging');
                this.#log.debug(`Drag started for column: ${this.#draggedColumn.id}`, `${caller}.attachDragAndDropHandlers`);
            }));
            // drag over (Allow dropping)
            EventManager.add(paletteContainer, 'dragover', ((event) => {
                event.preventDefault();
                if (event.dataTransfer)
                    event.dataTransfer.dropEffect = 'move';
            }));
            // drop - handles dropping columns and updates positions atomically
            EventManager.add(paletteContainer, 'drop', (event) => {
                // call inside a non-async wrapper
                void (async (dragEvent) => {
                    dragEvent.preventDefault();
                    const targetColumn = dragEvent.target.closest(classes.paletteColumn);
                    if (!this.#draggedColumn ||
                        !targetColumn ||
                        this.#draggedColumn === targetColumn)
                        return;
                    const draggedID = parseInt(this.#draggedColumn.id.split('-').pop());
                    const targetID = parseInt(targetColumn.id.split('-').pop());
                    const currentState = await this.#stateManager.getState();
                    const updatedColumns = currentState.paletteContainer.columns
                        .map(col => {
                        if (col.id === draggedID)
                            return { ...col, position: targetID };
                        if (col.id === targetID)
                            return { ...col, position: draggedID };
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
                    this.#log.debug(`Swapped columns: ${draggedID} and ${targetID}`, `${caller}.attachDragAndDropHandlers`);
                    this.#draggedColumn = null;
                })(event);
            });
            // drag end
            EventManager.add(paletteContainer, 'dragend', () => {
                if (this.#draggedColumn) {
                    this.#draggedColumn.classList.remove('dragging');
                    this.#log.debug('Drag ended for column.', `${caller}.attachDragAndDropHandlers`);
                    this.#draggedColumn = null;
                }
            });
            this.#log.debug(`Drag and drop event listeners attached`, `${caller}.attachDragAndDropHandlers`);
        }, `[${caller}]: Failed to attach drag-and-drop handlers`);
    }
    // initialiezs column positions on page load
    async initializeColumnPositions() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.#helpers.dom.getAllElements(classes.paletteColumn);
            // create updated column data based on DOM elements
            const updatedColumns = Array.from(paletteColumns).map((column, index) => ({
                id: parseInt(column.id.split('-').pop() || '0'),
                isLocked: false,
                position: index + 1,
                size: column.offsetWidth
            }));
            const currentState = await this.#stateManager.getState();
            await this.#stateManager.batchUpdate({
                paletteContainer: {
                    ...currentState.paletteContainer,
                    columns: updatedColumns
                }
            });
            this.#log.debug('Initialized column positions.', `${caller}.initializeColumnPositions`);
        }, `[${caller}]: Failed to initialize column positions.`);
    }
    // renders column sizes based on stored state
    async renderColumnSizeChange() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.#helpers.dom.getAllElements(classes.paletteColumn);
            // safely retrieve the latest state
            const { paletteContainer } = await this.#stateManager.getState();
            // update DOM based on state
            paletteColumns.forEach(column => {
                const columnID = parseInt(column.id.split('-').pop());
                const columnData = paletteContainer.columns.find(col => col.id === columnID);
                if (columnData) {
                    column.style.width = `${columnData.size}%`;
                }
            });
            this.#log.debug('Rendered column size changes.', `${caller}.renderColumnSizeChange`);
        }, `[${caller}]: Failed to render column size changes.`);
    }
    async syncColumnColorsWithState() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.#helpers.dom.getAllElements(classes.paletteColumn);
            // retrieve the most recent palette from state
            const { paletteHistory } = await this.#stateManager.getState();
            const currentPalette = paletteHistory.at(-1);
            if (!currentPalette?.items) {
                this.#log.warn('No valid palette data found in history!', `${caller}.syncColumnColorsWithState`);
                return;
            }
            const userPreference = localStorage.getItem('colorPreference') || 'hex';
            const validColorSpace = this.#helpers.typeguards.isColorSpace(userPreference)
                ? userPreference
                : 'hex';
            // update each column's color based on state
            paletteColumns.forEach(column => {
                const columnID = parseInt(column.id.split('-').pop());
                const paletteItem = currentPalette.items.find(item => item.itemID === columnID);
                if (paletteItem) {
                    const colorValue = this.#getColorByPreference(paletteItem.css, validColorSpace);
                    column.style.backgroundColor = colorValue;
                    const colorDisplay = column.querySelector(classes.colorDisplay);
                    if (colorDisplay)
                        colorDisplay.value = colorValue;
                    this.#log.debug(`Updated color for column ${columnID}: ${colorValue}`, `${caller}.syncColumnColorsWithState`);
                }
            });
        }, `[${caller}]: Failed to sync column colors with state.`);
    }
    #copyToClipboard(text, targetElement) {
        return this.#errors.handleSync(() => {
            navigator.clipboard
                .writeText(text.trim())
                .then(() => {
                this.#showTooltip(targetElement, 'Copied!');
                this.#log.debug(`Copied color value: ${text}`, `${caller}.#copyToClipboard`);
                setTimeout(() => this.#removeTooltip(targetElement), domConfig.tooltipFadeOut);
            })
                .catch(err => {
                this.#log.error(`Error copying to clipboard: ${err}`, `${caller}.#copyToClipboard`);
            });
        }, `[${caller}]: Failed to copy to clipboard.`);
    }
    // observes palette container for new elements
    async #createPaletteObserver() {
        return this.#errors.handleAsync(async () => {
            const paletteContainer = this.#domStore.getElement('divs', 'paletteContainer');
            if (!paletteContainer)
                return;
            const observer = new MutationObserver((mutationsList) => {
                // TODO: figure out what the hell is going on here
                void (async () => {
                    for (const mutation of mutationsList) {
                        for (const node of mutation.addedNodes) {
                            if (node instanceof HTMLElement &&
                                node.classList.contains(classes.paletteColumn)) {
                                const state = await this.#stateManager.getState();
                                if (!state.paletteContainer) {
                                    this.#log.warn('Skipping execution of initializeColumnPositions - State is not ready!', `${caller}.createPaletteObserver`);
                                    return;
                                }
                                this.initializeColumnPositions();
                            }
                        }
                    }
                })();
            });
            observer.observe(paletteContainer, {
                childList: true,
                subtree: true
            });
            this.#log.info('Palette Container MutationObserver created.', `${caller}.#createPaletteObserver`);
        }, `[${caller}]: Failed to create palette observer.`);
    }
    #getColorByPreference(colorData, preference) {
        return this.#errors.handleSync(() => {
            return (colorData[preference] ||
                colorData.hex);
        }, `[${caller}]: Failed to retrieve color by preference.`);
    }
    async #handleColorInputChange(event, column, columnID) {
        return this.#errors.handleAsync(async () => {
            const state = await this.#stateManager.getState();
            const newColor = event.target.value.trim();
            if (!this.#utils.validate.userColorInput(newColor))
                return;
            column.style.backgroundColor = newColor;
            const colorInput = this.#helpers.dom.getElement(`color-input-${columnID}`);
            if (colorInput)
                colorInput.value = newColor;
            const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);
            if (!isNaN(numericColumnID)) {
                this.#paletteRenderer.updatePaletteItemColor(numericColumnID, newColor, state);
            }
        }, `[${caller}]: Failed to handle color input change.`);
    }
    // hides tooltip for a given element
    #hideTooltip() {
        return this.#errors.handleSync(() => {
            this.#utils.dom.hideTooltip();
        }, `[${caller}]: Failed to hide tooltip.`);
    }
    #removeTooltip(element) {
        return this.#errors.handleSync(() => {
            const tooltipId = element.dataset.tooltipId;
            if (!tooltipId)
                return;
            const tooltip = document.getElementById(tooltipId);
            if (tooltip)
                tooltip.remove();
            delete element.dataset.tooltipId;
        }, `[${caller}]: Failed to remove tooltip.`);
    }
    #showTooltip(element, text) {
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
    async #startResize(event, column) {
        return this.#errors.handleAsync(async () => {
            if (!column || column.classList.contains(classes.locked))
                return;
            const startX = event.clientX;
            const startWidth = column.offsetWidth;
            // update column size dynamically as user drags
            const onMouseMove = (moveEvent) => {
                const diff = moveEvent.clientX - startX;
                const newSize = startWidth + diff;
                column.style.width = `${newSize}px`; // live feedback while resizing
            };
            // finalize size on mouse release and update state atomically
            const onMouseUp = async () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                const columnID = parseInt(column.id.split('-').pop());
                const currentState = await this.#stateManager.getState();
                await this.#stateManager.batchUpdate({
                    paletteContainer: {
                        ...currentState.paletteContainer,
                        columns: currentState.paletteContainer.columns.map(col => col.id === columnID
                            ? { ...col, size: column.offsetWidth }
                            : col)
                    }
                });
                this.#log.debug(`Resized column ${columnID} to ${column.offsetWidth}px`, `${caller}.#startResize`);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }, `[${caller}]: Failed to start column resize.`);
    }
    #toggleColorModal(button) {
        return this.#errors.handleSync(() => {
            const modalID = button.dataset.modalID;
            if (!modalID)
                return;
            const modal = this.#helpers.dom.getElement(modalID);
            modal?.classList.toggle(classes.hidden);
        }, `[${caller}]: Failed to toggle color modal.`);
    }
    // toggles lock state of a palette column
    #toggleLock(button) {
        return this.#errors.handleSync(() => {
            const column = button.closest(classes.paletteColumn);
            if (!column)
                return;
            const columnID = parseInt(column.id.split('-').pop());
            this.#paletteState.handleColumnLock(columnID);
        }, `[${caller}]: Failed to toggle lock state.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZUV2ZW50c1NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZG9tL2V2ZW50cy9QYWxldHRlRXZlbnRzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQ0FBMEM7QUFXMUMsT0FBTyxFQUFZLFlBQVksRUFBMEIsTUFBTSxhQUFhLENBQUM7QUFDN0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU1RCxNQUFNLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQztBQUN0QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBRWpDLE1BQU0sT0FBTyxvQkFBb0I7SUFDaEMsTUFBTSxDQUFDLFNBQVMsR0FBZ0MsSUFBSSxDQUFDO0lBRXJELGNBQWMsR0FBdUIsSUFBSSxDQUFDO0lBRTFDLFNBQVMsQ0FBVztJQUNwQixPQUFPLENBQXFCO0lBQzVCLFFBQVEsQ0FBVTtJQUNsQixJQUFJLENBQWtCO0lBQ3RCLGdCQUFnQixDQUF5QjtJQUN6QyxhQUFhLENBQXNCO0lBQ25DLGFBQWEsQ0FBZTtJQUM1QixNQUFNLENBQVk7SUFFbEIsWUFDQyxRQUFrQixFQUNsQixPQUFnQixFQUNoQixlQUF1QyxFQUN2QyxZQUFpQyxFQUNqQyxRQUFrQixFQUNsQixZQUEwQixFQUMxQixLQUFnQjtRQUVoQixJQUFJLENBQUM7WUFDSixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDaEIscUNBQXFDLEVBQ3JDLEdBQUcsTUFBTSxjQUFjLENBQ3ZCLENBQUM7WUFFRixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBRXBC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VyxDQUFDLE1BQW1CO1FBQzlCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ25DLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQzVCLE9BQU8sQ0FBQyxhQUFhLENBQ0MsQ0FBQztZQUV4QixJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXBCLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUcsQ0FBQyxDQUFDO1lBRXZELElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxFQUFFLElBQUksTUFBTSxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBkb20vZXZlbnRzL1BhbGV0ZUV2ZW50c1NlcnZpY2UudHNcblxuaW1wb3J0IHtcblx0Q29sb3JTcGFjZSxcblx0SGVscGVycyxcblx0UGFsZXR0ZUV2ZW50c0NvbnRyYWN0LFxuXHRQYWxldHRlSXRlbSxcblx0U2VydmljZXMsXG5cdFV0aWxpdGllc1xufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBQYWxldHRlU3RhdGVTZXJ2aWNlLCBTdGF0ZU1hbmFnZXIgfSBmcm9tICcuLi8uLi9zdGF0ZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBET01TdG9yZSwgRXZlbnRNYW5hZ2VyLCBQYWxldHRlUmVuZGVyZXJTZXJ2aWNlIH0gZnJvbSAnLi4vaW5kZXguanMnO1xuaW1wb3J0IHsgZG9tQ29uZmlnLCBkb21JbmRleCB9IGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNhbGxlciA9ICdQYWxldHRlRXZlbnRzU2VydmljZSc7XG5jb25zdCBjbGFzc2VzID0gZG9tSW5kZXguY2xhc3NlcztcblxuZXhwb3J0IGNsYXNzIFBhbGV0dGVFdmVudHNTZXJ2aWNlIGltcGxlbWVudHMgUGFsZXR0ZUV2ZW50c0NvbnRyYWN0IHtcblx0c3RhdGljICNpbnN0YW5jZTogUGFsZXR0ZUV2ZW50c1NlcnZpY2UgfCBudWxsID0gbnVsbDtcblxuXHQjZHJhZ2dlZENvbHVtbjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuXHQjZG9tU3RvcmU6IERPTVN0b3JlO1xuXHQjZXJyb3JzOiBTZXJ2aWNlc1snZXJyb3JzJ107XG5cdCNoZWxwZXJzOiBIZWxwZXJzO1xuXHQjbG9nOiBTZXJ2aWNlc1snbG9nJ107XG5cdCNwYWxldHRlUmVuZGVyZXI6IFBhbGV0dGVSZW5kZXJlclNlcnZpY2U7XG5cdCNwYWxldHRlU3RhdGU6IFBhbGV0dGVTdGF0ZVNlcnZpY2U7XG5cdCNzdGF0ZU1hbmFnZXI6IFN0YXRlTWFuYWdlcjtcblx0I3V0aWxzOiBVdGlsaXRpZXM7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3Rvcihcblx0XHRkb21TdG9yZTogRE9NU3RvcmUsXG5cdFx0aGVscGVyczogSGVscGVycyxcblx0XHRwYWxldHRlUmVuZGVyZXI6IFBhbGV0dGVSZW5kZXJlclNlcnZpY2UsXG5cdFx0cGFsZXR0ZVN0YXRlOiBQYWxldHRlU3RhdGVTZXJ2aWNlLFxuXHRcdHNlcnZpY2VzOiBTZXJ2aWNlcyxcblx0XHRzdGF0ZU1hbmFnZXI6IFN0YXRlTWFuYWdlcixcblx0XHR1dGlsczogVXRpbGl0aWVzXG5cdCkge1xuXHRcdHRyeSB7XG5cdFx0XHRzZXJ2aWNlcy5sb2cuaW5mbyhcblx0XHRcdFx0YENvbnN0cnVjdGluZyBQYWxldHRlRXZlbnRzIGluc3RhbmNlYCxcblx0XHRcdFx0YCR7Y2FsbGVyfSBjb25zdHJ1Y3RvcmBcblx0XHRcdCk7XG5cblx0XHRcdHRoaXMuI2Vycm9ycyA9IHNlcnZpY2VzLmVycm9ycztcblx0XHRcdHRoaXMuI2hlbHBlcnMgPSBoZWxwZXJzO1xuXHRcdFx0dGhpcy4jbG9nID0gc2VydmljZXMubG9nO1xuXHRcdFx0dGhpcy4jdXRpbHMgPSB1dGlscztcblxuXHRcdFx0dGhpcy4jZG9tU3RvcmUgPSBkb21TdG9yZTtcblx0XHRcdHRoaXMuI3BhbGV0dGVSZW5kZXJlciA9IHBhbGV0dGVSZW5kZXJlcjtcblx0XHRcdHRoaXMuI3BhbGV0dGVTdGF0ZSA9IHBhbGV0dGVTdGF0ZTtcblx0XHRcdHRoaXMuI3N0YXRlTWFuYWdlciA9IHN0YXRlTWFuYWdlcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgWyR7Y2FsbGVyfSBjb25zdHJ1Y3Rvcl06ICR7ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvcn1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShcblx0XHRkb21TdG9yZTogRE9NU3RvcmUsXG5cdFx0aGVscGVyczogSGVscGVycyxcblx0XHRwYWxldHRlUmVuZGVyZXI6IFBhbGV0dGVSZW5kZXJlclNlcnZpY2UsXG5cdFx0cGFsZXR0ZVN0YXRlOiBQYWxldHRlU3RhdGVTZXJ2aWNlLFxuXHRcdHNlcnZpY2VzOiBTZXJ2aWNlcyxcblx0XHRzdGF0ZU1hbmFnZXI6IFN0YXRlTWFuYWdlcixcblx0XHR1dGlsczogVXRpbGl0aWVzXG5cdCk6IFBhbGV0dGVFdmVudHNTZXJ2aWNlIHtcblx0XHRyZXR1cm4gc2VydmljZXMuZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCFQYWxldHRlRXZlbnRzU2VydmljZS4jaW5zdGFuY2UpIHtcblx0XHRcdFx0c2VydmljZXMubG9nLmluZm8oXG5cdFx0XHRcdFx0YENyZWF0aW5nIFBhbGV0dGVFdmVudHMgaW5zdGFuY2VgLFxuXHRcdFx0XHRcdGAke2NhbGxlcn0uZ2V0SW5zdGFuY2VgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0UGFsZXR0ZUV2ZW50c1NlcnZpY2UuI2luc3RhbmNlID0gbmV3IFBhbGV0dGVFdmVudHNTZXJ2aWNlKFxuXHRcdFx0XHRcdGRvbVN0b3JlLFxuXHRcdFx0XHRcdGhlbHBlcnMsXG5cdFx0XHRcdFx0cGFsZXR0ZVJlbmRlcmVyLFxuXHRcdFx0XHRcdHBhbGV0dGVTdGF0ZSxcblx0XHRcdFx0XHRzZXJ2aWNlcyxcblx0XHRcdFx0XHRzdGF0ZU1hbmFnZXIsXG5cdFx0XHRcdFx0dXRpbHNcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0c2VydmljZXMubG9nLmluZm8oXG5cdFx0XHRcdGBSZXR1cm5pbmcgUGFsZXR0ZUV2ZW50cyBpbnN0YW5jZWAsXG5cdFx0XHRcdGAke2NhbGxlcn0uZ2V0SW5zdGFuY2VgXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gUGFsZXR0ZUV2ZW50c1NlcnZpY2UuI2luc3RhbmNlO1xuXHRcdH0sIGBbJHtjYWxsZXJ9LmdldEluc3RhbmNlXTogRmFpbGVkIHRvIGNyZWF0ZSBpbnN0YW5jZS5gKTtcblx0fVxuXG5cdGluaXQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI2Vycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb250YWluZXIgPSB0aGlzLiNkb21TdG9yZS5nZXRFbGVtZW50KFxuXHRcdFx0XHQnZGl2cycsXG5cdFx0XHRcdCdwYWxldHRlQ29udGFpbmVyJ1xuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFwYWxldHRlQ29udGFpbmVyKSByZXR1cm47XG5cblx0XHRcdC8vIGRlbGVnYXRlZCBldmVudCBsaXN0ZW5lciBmb3IgY29sb3IgaW5wdXQgY2hhbmdlc1xuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnaW5wdXQnLCBldmVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoY2xhc3Nlcy5jb2xvckRpc3BsYXkpKSB7XG5cdFx0XHRcdFx0Y29uc3QgY29sdW1uID0gdGFyZ2V0LmNsb3Nlc3QoXG5cdFx0XHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdFx0XHQpIGFzIEhUTUxFbGVtZW50O1xuXHRcdFx0XHRcdGNvbnN0IGNvbHVtbklEID0gY29sdW1uPy5pZC5zcGxpdCgnLScpLnBvcCgpO1xuXG5cdFx0XHRcdFx0aWYgKCFjb2x1bW4gfHwgIWNvbHVtbklEKSByZXR1cm47XG5cblx0XHRcdFx0XHR0aGlzLiNoYW5kbGVDb2xvcklucHV0Q2hhbmdlKGV2ZW50LCBjb2x1bW4sIGNvbHVtbklEKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGRlbGVnYXRlZCBsb2NrIGJ1dHRvbiBldmVudCBsaXN0ZW5lclxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnY2xpY2snLCBldmVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoY2xhc3Nlcy5sb2NrQnRuKSkge1xuXHRcdFx0XHRcdHRoaXMuI3RvZ2dsZUxvY2sodGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGRlbGVnYXRlZCBldmVudCBsaXN0ZW5lciBmb3IgbW9kYWxzIChvcGVuL2Nsb3NlKVxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnY2xpY2snLCBldmVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoY2xhc3Nlcy5jb2xvcklucHV0QnRuKSkge1xuXHRcdFx0XHRcdHRoaXMuI3RvZ2dsZUNvbG9yTW9kYWwodGFyZ2V0KTtcblx0XHRcdFx0fSBlbHNlIGlmICh0YXJnZXQubWF0Y2hlcyhjbGFzc2VzLmNvbG9ySW5wdXRNb2RhbCkpIHtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRldmVudC50YXJnZXQgIT09XG5cdFx0XHRcdFx0XHR0YXJnZXQucXVlcnlTZWxlY3RvcihjbGFzc2VzLmNvbG9ySW5wdXRCdG4pXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc2VzLmhpZGRlbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZGVsZWdhdGVkIGV2ZW50IGxpc3RlbmVyIGZvciByZXNpemluZyBjb2x1bW5zXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdtb3VzZWRvd24nLCAoKFxuXHRcdFx0XHRldmVudDogTW91c2VFdmVudFxuXHRcdFx0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoY2xhc3Nlcy5yZXNpemVIYW5kbGUpKSB7XG5cdFx0XHRcdFx0dGhpcy4jc3RhcnRSZXNpemUoXG5cdFx0XHRcdFx0XHRldmVudCxcblx0XHRcdFx0XHRcdHRhcmdldC5jbG9zZXN0KGNsYXNzZXMucGFsZXR0ZUNvbHVtbikgYXMgSFRNTEVsZW1lbnRcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSBhcyBFdmVudExpc3RlbmVyKTtcblxuXHRcdFx0Ly8gZGVsZWdhdGVkIGV2ZW50IGxpc3RlbmVyIGZvciB0b29sdGlwcyAoMSlcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQocGFsZXR0ZUNvbnRhaW5lciwgJ21vdXNlb3ZlcicsIGV2ZW50ID0+IHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0XHRcdGlmICh0YXJnZXQubWF0Y2hlcyhjbGFzc2VzLnRvb2x0aXBUcmlnZ2VyKSkge1xuXHRcdFx0XHRcdGNvbnN0IHRvb2x0aXBUZXh0ID0gdGFyZ2V0LmRhdGFzZXQudG9vbHRpcDtcblxuXHRcdFx0XHRcdGlmICh0b29sdGlwVGV4dCkge1xuXHRcdFx0XHRcdFx0dGhpcy4jc2hvd1Rvb2x0aXAodGFyZ2V0LCB0b29sdGlwVGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZGVsZWdhdGVkIGV2ZW50IGxpc3RlbmVyIGZvciB0b29sdGlwcyAoMilcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQocGFsZXR0ZUNvbnRhaW5lciwgJ21vdXNlb3V0JywgZXZlbnQgPT4ge1xuXHRcdFx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdFx0aWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMudG9vbHRpcFRyaWdnZXIpKSB7XG5cdFx0XHRcdFx0dGhpcy4jaGlkZVRvb2x0aXAoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIG9ic2VydmUgZm9yIG5ldyBlbGVtZW50c1xuXHRcdFx0dGhpcy4jY3JlYXRlUGFsZXR0ZU9ic2VydmVyKCk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gY2FsbCBpbml0KClgKTtcblx0fVxuXG5cdGF0dGFjaENvbG9yQ29weUhhbmRsZXJzKCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBwYWxldHRlQ29udGFpbmVyID0gdGhpcy4jZG9tU3RvcmUuZ2V0RWxlbWVudChcblx0XHRcdFx0J2RpdnMnLFxuXHRcdFx0XHQncGFsZXR0ZUNvbnRhaW5lcidcblx0XHRcdCk7XG5cblx0XHRcdGlmICghcGFsZXR0ZUNvbnRhaW5lcikgcmV0dXJuO1xuXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdjbGljaycsIGV2ZW50ID0+IHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cblx0XHRcdFx0aWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMuY29sb3JEaXNwbGF5KSlcblx0XHRcdFx0XHR0aGlzLiNjb3B5VG9DbGlwYm9hcmQodGFyZ2V0LnZhbHVlLCB0YXJnZXQpO1xuXHRcdFx0fSk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gYXR0YWNoIGNvbG9yIGNvcHkgaGFuZGxlcnMuYCk7XG5cdH1cblxuXHRhc3luYyBhdHRhY2hEcmFnQW5kRHJvcEhhbmRsZXJzKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBwYWxldHRlQ29udGFpbmVyID0gdGhpcy4jZG9tU3RvcmUuZ2V0RWxlbWVudChcblx0XHRcdFx0J2RpdnMnLFxuXHRcdFx0XHQncGFsZXR0ZUNvbnRhaW5lcidcblx0XHRcdCk7XG5cblx0XHRcdGlmICghcGFsZXR0ZUNvbnRhaW5lcikge1xuXHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHRgUGFsZXR0ZSBjb250YWluZXIgbm90IGZvdW5kISBDYW5ub3QgYXR0YWNoIGRyYWctYW5kLWRyb3AgaGFuZGxlcnMuYCxcblx0XHRcdFx0XHRgJHtjYWxsZXJ9LmF0dGFjaERyYWdBbmREcm9wSGFuZGxlcnNgXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZHJhZyBzdGFydFxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnZHJhZ3N0YXJ0JywgKChcblx0XHRcdFx0ZXZlbnQ6IERyYWdFdmVudFxuXHRcdFx0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRyYWdIYW5kbGUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KFxuXHRcdFx0XHRcdGNsYXNzZXMuZHJhZ0hhbmRsZVxuXHRcdFx0XHQpIGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0XHRcdGlmICghZHJhZ0hhbmRsZSkgcmV0dXJuO1xuXG5cdFx0XHRcdHRoaXMuI2RyYWdnZWRDb2x1bW4gPSBkcmFnSGFuZGxlLmNsb3Nlc3QoXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wYWxldHRlQ29sdW1uXG5cdFx0XHRcdCkgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdFx0aWYgKCF0aGlzLiNkcmFnZ2VkQ29sdW1uKSByZXR1cm47XG5cblx0XHRcdFx0ZXZlbnQuZGF0YVRyYW5zZmVyPy5zZXREYXRhKFxuXHRcdFx0XHRcdCd0ZXh0L3BsYWluJyxcblx0XHRcdFx0XHR0aGlzLiNkcmFnZ2VkQ29sdW1uLmlkXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0dGhpcy4jZHJhZ2dlZENvbHVtbi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuXG5cdFx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0XHRgRHJhZyBzdGFydGVkIGZvciBjb2x1bW46ICR7dGhpcy4jZHJhZ2dlZENvbHVtbi5pZH1gLFxuXHRcdFx0XHRcdGAke2NhbGxlcn0uYXR0YWNoRHJhZ0FuZERyb3BIYW5kbGVyc2Bcblx0XHRcdFx0KTtcblx0XHRcdH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG5cdFx0XHQvLyBkcmFnIG92ZXIgKEFsbG93IGRyb3BwaW5nKVxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnZHJhZ292ZXInLCAoKFxuXHRcdFx0XHRldmVudDogRHJhZ0V2ZW50XG5cdFx0XHQpID0+IHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcblx0XHRcdH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG5cdFx0XHQvLyBkcm9wIC0gaGFuZGxlcyBkcm9wcGluZyBjb2x1bW5zIGFuZCB1cGRhdGVzIHBvc2l0aW9ucyBhdG9taWNhbGx5XG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdkcm9wJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuXHRcdFx0XHQvLyBjYWxsIGluc2lkZSBhIG5vbi1hc3luYyB3cmFwcGVyXG5cdFx0XHRcdHZvaWQgKGFzeW5jIChkcmFnRXZlbnQ6IERyYWdFdmVudCkgPT4ge1xuXHRcdFx0XHRcdGRyYWdFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0Q29sdW1uID0gKFxuXHRcdFx0XHRcdFx0ZHJhZ0V2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdFx0XHRcdCkuY2xvc2VzdChjbGFzc2VzLnBhbGV0dGVDb2x1bW4pIGFzIEhUTUxFbGVtZW50O1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCF0aGlzLiNkcmFnZ2VkQ29sdW1uIHx8XG5cdFx0XHRcdFx0XHQhdGFyZ2V0Q29sdW1uIHx8XG5cdFx0XHRcdFx0XHR0aGlzLiNkcmFnZ2VkQ29sdW1uID09PSB0YXJnZXRDb2x1bW5cblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0XHRjb25zdCBkcmFnZ2VkSUQgPSBwYXJzZUludChcblx0XHRcdFx0XHRcdHRoaXMuI2RyYWdnZWRDb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSFcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGNvbnN0IHRhcmdldElEID0gcGFyc2VJbnQoXG5cdFx0XHRcdFx0XHR0YXJnZXRDb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSFcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gYXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCk7XG5cblx0XHRcdFx0XHRjb25zdCB1cGRhdGVkQ29sdW1ucyA9IGN1cnJlbnRTdGF0ZS5wYWxldHRlQ29udGFpbmVyLmNvbHVtbnNcblx0XHRcdFx0XHRcdC5tYXAoY29sID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGNvbC5pZCA9PT0gZHJhZ2dlZElEKVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7IC4uLmNvbCwgcG9zaXRpb246IHRhcmdldElEIH07XG5cdFx0XHRcdFx0XHRcdGlmIChjb2wuaWQgPT09IHRhcmdldElEKVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7IC4uLmNvbCwgcG9zaXRpb246IGRyYWdnZWRJRCB9O1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY29sO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5zb3J0KChhLCBiKSA9PiBhLnBvc2l0aW9uIC0gYi5wb3NpdGlvbik7XG5cblx0XHRcdFx0XHRhd2FpdCB0aGlzLiNzdGF0ZU1hbmFnZXIuYmF0Y2hVcGRhdGUoe1xuXHRcdFx0XHRcdFx0cGFsZXR0ZUNvbnRhaW5lcjoge1xuXHRcdFx0XHRcdFx0XHQuLi5jdXJyZW50U3RhdGUucGFsZXR0ZUNvbnRhaW5lcixcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogdXBkYXRlZENvbHVtbnNcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHRoaXMuI2RyYWdnZWRDb2x1bW4uY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcblxuXHRcdFx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0XHRcdGBTd2FwcGVkIGNvbHVtbnM6ICR7ZHJhZ2dlZElEfSBhbmQgJHt0YXJnZXRJRH1gLFxuXHRcdFx0XHRcdFx0YCR7Y2FsbGVyfS5hdHRhY2hEcmFnQW5kRHJvcEhhbmRsZXJzYFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHR0aGlzLiNkcmFnZ2VkQ29sdW1uID0gbnVsbDtcblx0XHRcdFx0fSkoZXZlbnQgYXMgRHJhZ0V2ZW50KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBkcmFnIGVuZFxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnZHJhZ2VuZCcsICgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuI2RyYWdnZWRDb2x1bW4pIHtcblx0XHRcdFx0XHR0aGlzLiNkcmFnZ2VkQ29sdW1uLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG5cblx0XHRcdFx0XHR0aGlzLiNsb2cuZGVidWcoXG5cdFx0XHRcdFx0XHQnRHJhZyBlbmRlZCBmb3IgY29sdW1uLicsXG5cdFx0XHRcdFx0XHRgJHtjYWxsZXJ9LmF0dGFjaERyYWdBbmREcm9wSGFuZGxlcnNgXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHRoaXMuI2RyYWdnZWRDb2x1bW4gPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy4jbG9nLmRlYnVnKFxuXHRcdFx0XHRgRHJhZyBhbmQgZHJvcCBldmVudCBsaXN0ZW5lcnMgYXR0YWNoZWRgLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LmF0dGFjaERyYWdBbmREcm9wSGFuZGxlcnNgXG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGF0dGFjaCBkcmFnLWFuZC1kcm9wIGhhbmRsZXJzYCk7XG5cdH1cblxuXHQvLyBpbml0aWFsaWV6cyBjb2x1bW4gcG9zaXRpb25zIG9uIHBhZ2UgbG9hZFxuXHRhc3luYyBpbml0aWFsaXplQ29sdW1uUG9zaXRpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbHVtbnMgPSB0aGlzLiNoZWxwZXJzLmRvbS5nZXRBbGxFbGVtZW50cyhcblx0XHRcdFx0Y2xhc3Nlcy5wYWxldHRlQ29sdW1uXG5cdFx0XHQpO1xuXG5cdFx0XHQvLyBjcmVhdGUgdXBkYXRlZCBjb2x1bW4gZGF0YSBiYXNlZCBvbiBET00gZWxlbWVudHNcblx0XHRcdGNvbnN0IHVwZGF0ZWRDb2x1bW5zID0gQXJyYXkuZnJvbShwYWxldHRlQ29sdW1ucykubWFwKFxuXHRcdFx0XHQoY29sdW1uLCBpbmRleCkgPT4gKHtcblx0XHRcdFx0XHRpZDogcGFyc2VJbnQoY29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkgfHwgJzAnKSxcblx0XHRcdFx0XHRpc0xvY2tlZDogZmFsc2UsXG5cdFx0XHRcdFx0cG9zaXRpb246IGluZGV4ICsgMSxcblx0XHRcdFx0XHRzaXplOiBjb2x1bW4ub2Zmc2V0V2lkdGhcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5nZXRTdGF0ZSgpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLiNzdGF0ZU1hbmFnZXIuYmF0Y2hVcGRhdGUoe1xuXHRcdFx0XHRwYWxldHRlQ29udGFpbmVyOiB7XG5cdFx0XHRcdFx0Li4uY3VycmVudFN0YXRlLnBhbGV0dGVDb250YWluZXIsXG5cdFx0XHRcdFx0Y29sdW1uczogdXBkYXRlZENvbHVtbnNcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0J0luaXRpYWxpemVkIGNvbHVtbiBwb3NpdGlvbnMuJyxcblx0XHRcdFx0YCR7Y2FsbGVyfS5pbml0aWFsaXplQ29sdW1uUG9zaXRpb25zYFxuXHRcdFx0KTtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byBpbml0aWFsaXplIGNvbHVtbiBwb3NpdGlvbnMuYCk7XG5cdH1cblxuXHQvLyByZW5kZXJzIGNvbHVtbiBzaXplcyBiYXNlZCBvbiBzdG9yZWQgc3RhdGVcblx0YXN5bmMgcmVuZGVyQ29sdW1uU2l6ZUNoYW5nZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5zID0gdGhpcy4jaGVscGVycy5kb20uZ2V0QWxsRWxlbWVudHMoXG5cdFx0XHRcdGNsYXNzZXMucGFsZXR0ZUNvbHVtblxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gc2FmZWx5IHJldHJpZXZlIHRoZSBsYXRlc3Qgc3RhdGVcblx0XHRcdGNvbnN0IHsgcGFsZXR0ZUNvbnRhaW5lciB9ID0gYXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCk7XG5cblx0XHRcdC8vIHVwZGF0ZSBET00gYmFzZWQgb24gc3RhdGVcblx0XHRcdHBhbGV0dGVDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcblx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBwYXJzZUludChjb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXHRcdFx0XHRjb25zdCBjb2x1bW5EYXRhID0gcGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zLmZpbmQoXG5cdFx0XHRcdFx0Y29sID0+IGNvbC5pZCA9PT0gY29sdW1uSURcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoY29sdW1uRGF0YSkge1xuXHRcdFx0XHRcdChjb2x1bW4gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLndpZHRoID0gYCR7Y29sdW1uRGF0YS5zaXplfSVgO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy4jbG9nLmRlYnVnKFxuXHRcdFx0XHQnUmVuZGVyZWQgY29sdW1uIHNpemUgY2hhbmdlcy4nLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LnJlbmRlckNvbHVtblNpemVDaGFuZ2VgXG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHJlbmRlciBjb2x1bW4gc2l6ZSBjaGFuZ2VzLmApO1xuXHR9XG5cblx0YXN5bmMgc3luY0NvbHVtbkNvbG9yc1dpdGhTdGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5zID1cblx0XHRcdFx0dGhpcy4jaGVscGVycy5kb20uZ2V0QWxsRWxlbWVudHM8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdFx0XHRcdGNsYXNzZXMucGFsZXR0ZUNvbHVtblxuXHRcdFx0XHQpO1xuXG5cdFx0XHQvLyByZXRyaWV2ZSB0aGUgbW9zdCByZWNlbnQgcGFsZXR0ZSBmcm9tIHN0YXRlXG5cdFx0XHRjb25zdCB7IHBhbGV0dGVIaXN0b3J5IH0gPSBhd2FpdCB0aGlzLiNzdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWxldHRlID0gcGFsZXR0ZUhpc3RvcnkuYXQoLTEpO1xuXG5cdFx0XHRpZiAoIWN1cnJlbnRQYWxldHRlPy5pdGVtcykge1xuXHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHQnTm8gdmFsaWQgcGFsZXR0ZSBkYXRhIGZvdW5kIGluIGhpc3RvcnkhJyxcblx0XHRcdFx0XHRgJHtjYWxsZXJ9LnN5bmNDb2x1bW5Db2xvcnNXaXRoU3RhdGVgXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdXNlclByZWZlcmVuY2UgPVxuXHRcdFx0XHRsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29sb3JQcmVmZXJlbmNlJykgfHwgJ2hleCc7XG5cdFx0XHRjb25zdCB2YWxpZENvbG9yU3BhY2UgPSB0aGlzLiNoZWxwZXJzLnR5cGVndWFyZHMuaXNDb2xvclNwYWNlKFxuXHRcdFx0XHR1c2VyUHJlZmVyZW5jZVxuXHRcdFx0KVxuXHRcdFx0XHQ/IHVzZXJQcmVmZXJlbmNlXG5cdFx0XHRcdDogJ2hleCc7XG5cblx0XHRcdC8vIHVwZGF0ZSBlYWNoIGNvbHVtbidzIGNvbG9yIGJhc2VkIG9uIHN0YXRlXG5cdFx0XHRwYWxldHRlQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG5cdFx0XHRcdGNvbnN0IGNvbHVtbklEID0gcGFyc2VJbnQoY29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkhKTtcblx0XHRcdFx0Y29uc3QgcGFsZXR0ZUl0ZW0gPSBjdXJyZW50UGFsZXR0ZS5pdGVtcy5maW5kKFxuXHRcdFx0XHRcdGl0ZW0gPT4gaXRlbS5pdGVtSUQgPT09IGNvbHVtbklEXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKHBhbGV0dGVJdGVtKSB7XG5cdFx0XHRcdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRoaXMuI2dldENvbG9yQnlQcmVmZXJlbmNlKFxuXHRcdFx0XHRcdFx0cGFsZXR0ZUl0ZW0uY3NzLFxuXHRcdFx0XHRcdFx0dmFsaWRDb2xvclNwYWNlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb2x1bW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JWYWx1ZTtcblxuXHRcdFx0XHRcdGNvbnN0IGNvbG9yRGlzcGxheSA9IGNvbHVtbi5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5jb2xvckRpc3BsYXlcblx0XHRcdFx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0XHRcdFx0aWYgKGNvbG9yRGlzcGxheSkgY29sb3JEaXNwbGF5LnZhbHVlID0gY29sb3JWYWx1ZTtcblxuXHRcdFx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0XHRcdGBVcGRhdGVkIGNvbG9yIGZvciBjb2x1bW4gJHtjb2x1bW5JRH06ICR7Y29sb3JWYWx1ZX1gLFxuXHRcdFx0XHRcdFx0YCR7Y2FsbGVyfS5zeW5jQ29sdW1uQ29sb3JzV2l0aFN0YXRlYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHN5bmMgY29sdW1uIGNvbG9ycyB3aXRoIHN0YXRlLmApO1xuXHR9XG5cblx0I2NvcHlUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcsIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0cmV0dXJuIHRoaXMuI2Vycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdG5hdmlnYXRvci5jbGlwYm9hcmRcblx0XHRcdFx0LndyaXRlVGV4dCh0ZXh0LnRyaW0oKSlcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuI3Nob3dUb29sdGlwKHRhcmdldEVsZW1lbnQsICdDb3BpZWQhJyk7XG5cdFx0XHRcdFx0dGhpcy4jbG9nLmRlYnVnKFxuXHRcdFx0XHRcdFx0YENvcGllZCBjb2xvciB2YWx1ZTogJHt0ZXh0fWAsXG5cdFx0XHRcdFx0XHRgJHtjYWxsZXJ9LiNjb3B5VG9DbGlwYm9hcmRgXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHQoKSA9PiB0aGlzLiNyZW1vdmVUb29sdGlwKHRhcmdldEVsZW1lbnQpLFxuXHRcdFx0XHRcdFx0ZG9tQ29uZmlnLnRvb2x0aXBGYWRlT3V0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdFx0dGhpcy4jbG9nLmVycm9yKFxuXHRcdFx0XHRcdFx0YEVycm9yIGNvcHlpbmcgdG8gY2xpcGJvYXJkOiAke2Vycn1gLFxuXHRcdFx0XHRcdFx0YCR7Y2FsbGVyfS4jY29weVRvQ2xpcGJvYXJkYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkLmApO1xuXHR9XG5cblx0Ly8gb2JzZXJ2ZXMgcGFsZXR0ZSBjb250YWluZXIgZm9yIG5ldyBlbGVtZW50c1xuXHRhc3luYyAjY3JlYXRlUGFsZXR0ZU9ic2VydmVyKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbnRhaW5lciA9IHRoaXMuI2RvbVN0b3JlLmdldEVsZW1lbnQoXG5cdFx0XHRcdCdkaXZzJyxcblx0XHRcdFx0J3BhbGV0dGVDb250YWluZXInXG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFwYWxldHRlQ29udGFpbmVyKSByZXR1cm47XG5cblx0XHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG5cdFx0XHRcdChtdXRhdGlvbnNMaXN0OiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG5cdFx0XHRcdFx0Ly8gVE9ETzogZmlndXJlIG91dCB3aGF0IHRoZSBoZWxsIGlzIGdvaW5nIG9uIGhlcmVcblx0XHRcdFx0XHR2b2lkIChhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcblx0XHRcdFx0XHRcdFx0Zm9yIChjb25zdCBub2RlIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHN0YXRlID1cblx0XHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICghc3RhdGUucGFsZXR0ZUNvbnRhaW5lcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnU2tpcHBpbmcgZXhlY3V0aW9uIG9mIGluaXRpYWxpemVDb2x1bW5Qb3NpdGlvbnMgLSBTdGF0ZSBpcyBub3QgcmVhZHkhJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRgJHtjYWxsZXJ9LmNyZWF0ZVBhbGV0dGVPYnNlcnZlcmBcblx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZUNvbHVtblBvc2l0aW9ucygpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pKCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdG9ic2VydmVyLm9ic2VydmUocGFsZXR0ZUNvbnRhaW5lciwge1xuXHRcdFx0XHRjaGlsZExpc3Q6IHRydWUsXG5cdFx0XHRcdHN1YnRyZWU6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiNsb2cuaW5mbyhcblx0XHRcdFx0J1BhbGV0dGUgQ29udGFpbmVyIE11dGF0aW9uT2JzZXJ2ZXIgY3JlYXRlZC4nLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LiNjcmVhdGVQYWxldHRlT2JzZXJ2ZXJgXG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGNyZWF0ZSBwYWxldHRlIG9ic2VydmVyLmApO1xuXHR9XG5cblx0I2dldENvbG9yQnlQcmVmZXJlbmNlKFxuXHRcdGNvbG9yRGF0YTogUGFsZXR0ZUl0ZW1bJ2NzcyddLFxuXHRcdHByZWZlcmVuY2U6IENvbG9yU3BhY2Vcblx0KTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0Y29sb3JEYXRhW3ByZWZlcmVuY2UgYXMga2V5b2YgUGFsZXR0ZUl0ZW1bJ2NzcyddXSB8fFxuXHRcdFx0XHRjb2xvckRhdGEuaGV4XG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHJldHJpZXZlIGNvbG9yIGJ5IHByZWZlcmVuY2UuYCk7XG5cdH1cblxuXHRhc3luYyAjaGFuZGxlQ29sb3JJbnB1dENoYW5nZShcblx0XHRldmVudDogRXZlbnQsXG5cdFx0Y29sdW1uOiBIVE1MRWxlbWVudCxcblx0XHRjb2x1bW5JRDogc3RyaW5nXG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RhdGUgPSBhd2FpdCB0aGlzLiNzdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKTtcblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZS50cmltKCk7XG5cblx0XHRcdGlmICghdGhpcy4jdXRpbHMudmFsaWRhdGUudXNlckNvbG9ySW5wdXQobmV3Q29sb3IpKSByZXR1cm47XG5cblx0XHRcdGNvbHVtbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBuZXdDb2xvcjtcblxuXHRcdFx0Y29uc3QgY29sb3JJbnB1dCA9IHRoaXMuI2hlbHBlcnMuZG9tLmdldEVsZW1lbnQoXG5cdFx0XHRcdGBjb2xvci1pbnB1dC0ke2NvbHVtbklEfWBcblx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmIChjb2xvcklucHV0KSBjb2xvcklucHV0LnZhbHVlID0gbmV3Q29sb3I7XG5cblx0XHRcdGNvbnN0IG51bWVyaWNDb2x1bW5JRCA9IHBhcnNlSW50KGNvbHVtbklELnJlcGxhY2UoL1xcRC9nLCAnJyksIDEwKTtcblxuXHRcdFx0aWYgKCFpc05hTihudW1lcmljQ29sdW1uSUQpKSB7XG5cdFx0XHRcdHRoaXMuI3BhbGV0dGVSZW5kZXJlci51cGRhdGVQYWxldHRlSXRlbUNvbG9yKFxuXHRcdFx0XHRcdG51bWVyaWNDb2x1bW5JRCxcblx0XHRcdFx0XHRuZXdDb2xvcixcblx0XHRcdFx0XHRzdGF0ZVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGhhbmRsZSBjb2xvciBpbnB1dCBjaGFuZ2UuYCk7XG5cdH1cblxuXHQvLyBoaWRlcyB0b29sdGlwIGZvciBhIGdpdmVuIGVsZW1lbnRcblx0I2hpZGVUb29sdGlwKCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHR0aGlzLiN1dGlscy5kb20uaGlkZVRvb2x0aXAoKTtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byBoaWRlIHRvb2x0aXAuYCk7XG5cdH1cblxuXHQjcmVtb3ZlVG9vbHRpcChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCB0b29sdGlwSWQgPSBlbGVtZW50LmRhdGFzZXQudG9vbHRpcElkO1xuXHRcdFx0aWYgKCF0b29sdGlwSWQpIHJldHVybjtcblxuXHRcdFx0Y29uc3QgdG9vbHRpcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XG5cdFx0XHRpZiAodG9vbHRpcCkgdG9vbHRpcC5yZW1vdmUoKTtcblxuXHRcdFx0ZGVsZXRlIGVsZW1lbnQuZGF0YXNldC50b29sdGlwSWQ7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gcmVtb3ZlIHRvb2x0aXAuYCk7XG5cdH1cblxuXHQjc2hvd1Rvb2x0aXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHRleHQ6IHN0cmluZyk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHR0aGlzLiNyZW1vdmVUb29sdGlwKGVsZW1lbnQpO1xuXG5cdFx0XHRjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHR0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAnKTtcblx0XHRcdHRvb2x0aXAudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcblxuXHRcdFx0Y29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHR0b29sdGlwLnN0eWxlLmxlZnQgPSBgJHtyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWH1weGA7XG5cdFx0XHR0b29sdGlwLnN0eWxlLnRvcCA9IGAke3JlY3QudG9wICsgd2luZG93LnNjcm9sbFkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIDV9cHhgO1xuXG5cdFx0XHRlbGVtZW50LmRhdGFzZXQudG9vbHRpcElkID0gdG9vbHRpcC5pZDtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byBzaG93IHRvb2x0aXAuYCk7XG5cdH1cblxuXHQvLyBoYW5kbGVzIHJlc2l6aW5nIG9mIHBhbGV0dGUgY29sdW1uc1xuXHRhc3luYyAjc3RhcnRSZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIGNvbHVtbjogSFRNTEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGlmICghY29sdW1uIHx8IGNvbHVtbi5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3Nlcy5sb2NrZWQpKSByZXR1cm47XG5cblx0XHRcdGNvbnN0IHN0YXJ0WCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0XHRjb25zdCBzdGFydFdpZHRoID0gY29sdW1uLm9mZnNldFdpZHRoO1xuXG5cdFx0XHQvLyB1cGRhdGUgY29sdW1uIHNpemUgZHluYW1pY2FsbHkgYXMgdXNlciBkcmFnc1xuXHRcdFx0Y29uc3Qgb25Nb3VzZU1vdmUgPSAobW92ZUV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRpZmYgPSBtb3ZlRXZlbnQuY2xpZW50WCAtIHN0YXJ0WDtcblx0XHRcdFx0Y29uc3QgbmV3U2l6ZSA9IHN0YXJ0V2lkdGggKyBkaWZmO1xuXHRcdFx0XHRjb2x1bW4uc3R5bGUud2lkdGggPSBgJHtuZXdTaXplfXB4YDsgLy8gbGl2ZSBmZWVkYmFjayB3aGlsZSByZXNpemluZ1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gZmluYWxpemUgc2l6ZSBvbiBtb3VzZSByZWxlYXNlIGFuZCB1cGRhdGUgc3RhdGUgYXRvbWljYWxseVxuXHRcdFx0Y29uc3Qgb25Nb3VzZVVwID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cblx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBwYXJzZUludChjb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5nZXRTdGF0ZSgpO1xuXG5cdFx0XHRcdGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5iYXRjaFVwZGF0ZSh7XG5cdFx0XHRcdFx0cGFsZXR0ZUNvbnRhaW5lcjoge1xuXHRcdFx0XHRcdFx0Li4uY3VycmVudFN0YXRlLnBhbGV0dGVDb250YWluZXIsXG5cdFx0XHRcdFx0XHRjb2x1bW5zOiBjdXJyZW50U3RhdGUucGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zLm1hcChcblx0XHRcdFx0XHRcdFx0Y29sID0+XG5cdFx0XHRcdFx0XHRcdFx0Y29sLmlkID09PSBjb2x1bW5JRFxuXHRcdFx0XHRcdFx0XHRcdFx0PyB7IC4uLmNvbCwgc2l6ZTogY29sdW1uLm9mZnNldFdpZHRoIH1cblx0XHRcdFx0XHRcdFx0XHRcdDogY29sXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLiNsb2cuZGVidWcoXG5cdFx0XHRcdFx0YFJlc2l6ZWQgY29sdW1uICR7Y29sdW1uSUR9IHRvICR7Y29sdW1uLm9mZnNldFdpZHRofXB4YCxcblx0XHRcdFx0XHRgJHtjYWxsZXJ9LiNzdGFydFJlc2l6ZWBcblx0XHRcdFx0KTtcblx0XHRcdH07XG5cblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gc3RhcnQgY29sdW1uIHJlc2l6ZS5gKTtcblx0fVxuXG5cdCN0b2dnbGVDb2xvck1vZGFsKGJ1dHRvbjogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgbW9kYWxJRCA9IGJ1dHRvbi5kYXRhc2V0Lm1vZGFsSUQ7XG5cblx0XHRcdGlmICghbW9kYWxJRCkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBtb2RhbCA9IHRoaXMuI2hlbHBlcnMuZG9tLmdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KG1vZGFsSUQpO1xuXG5cdFx0XHRtb2RhbD8uY2xhc3NMaXN0LnRvZ2dsZShjbGFzc2VzLmhpZGRlbik7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gdG9nZ2xlIGNvbG9yIG1vZGFsLmApO1xuXHR9XG5cblx0Ly8gdG9nZ2xlcyBsb2NrIHN0YXRlIG9mIGEgcGFsZXR0ZSBjb2x1bW5cblx0I3RvZ2dsZUxvY2soYnV0dG9uOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjb2x1bW4gPSBidXR0b24uY2xvc2VzdChcblx0XHRcdFx0Y2xhc3Nlcy5wYWxldHRlQ29sdW1uXG5cdFx0XHQpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0aWYgKCFjb2x1bW4pIHJldHVybjtcblxuXHRcdFx0Y29uc3QgY29sdW1uSUQgPSBwYXJzZUludChjb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXG5cdFx0XHR0aGlzLiNwYWxldHRlU3RhdGUuaGFuZGxlQ29sdW1uTG9jayhjb2x1bW5JRCk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gdG9nZ2xlIGxvY2sgc3RhdGUuYCk7XG5cdH1cbn1cbiJdfQ==