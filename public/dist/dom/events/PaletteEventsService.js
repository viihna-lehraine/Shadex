import { EventManager } from './EventManager.js';
import { PaletteHistoryManager } from '../../palette/PaletteHistoryManager.js';
import '../../config/partials/defaults.js';
import { domIndex, domConfig } from '../../config/partials/dom.js';
import '../../config/partials/regex.js';

const caller = 'PaletteEventsService';
const classes = domIndex.classes;
class PaletteEventsService {
    static #instance = null;
    #draggedColumn = null;
    #domStore;
    #errors;
    #helpers;
    #log;
    #paletteHistory;
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
            this.#paletteHistory = PaletteHistoryManager.getInstance(helpers, services);
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
                    const paletteContainer = this.#stateManager.get('paletteContainer');
                    const updatedColumns = paletteContainer.columns
                        .map(col => {
                        if (col.id === draggedID)
                            return { ...col, position: targetID };
                        if (col.id === targetID)
                            return { ...col, position: draggedID };
                        return col;
                    })
                        .sort((a, b) => a.position - b.position);
                    await this.#stateManager.batchUpdate(currentState => ({
                        paletteContainer: {
                            ...currentState.paletteContainer,
                            columns: updatedColumns
                        }
                    }));
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
            this.#log.debug(`Initializing column positions...`, `${caller}.initializeColumnPositions`);
            const paletteColumns = this.#helpers.dom.getAllElements(`.${classes.paletteColumn}`);
            // create updated column data based on DOM elements
            const updatedColumns = Array.from(paletteColumns).map((column, index) => ({
                id: index + 1,
                isLocked: false,
                position: index + 1,
                size: column.offsetWidth
            }));
            await this.#stateManager.batchUpdate(currentState => ({
                paletteContainer: {
                    ...currentState.paletteContainer,
                    columns: updatedColumns.slice(0, 5)
                }
            }));
            this.#log.debug('Initialized column positions.', `${caller}.initializeColumnPositions`);
        }, `[${caller}]: Failed to initialize column positions.`);
    }
    // renders column sizes based on stored state
    async renderColumnSizeChange() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.#helpers.dom.getAllElements(`.${classes.paletteColumn}`);
            // safely retrieve the latest state
            const paletteContainer = this.#stateManager.get('paletteContainer');
            // update DOM based on state
            paletteColumns.forEach((column, index) => {
                const columnData = paletteContainer.columns[index];
                if (columnData) {
                    column.style.width = `${columnData.size}%`;
                    column.classList.remove('hidden');
                }
                else {
                    column.classList.add('hidden');
                }
            });
            this.#log.debug('Rendered column size changes.', `${caller}.renderColumnSizeChange`);
        }, `[${caller}]: Failed to render column size changes.`);
    }
    async syncColumnColorsWithState() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.#helpers.dom.getAllElements(`.${classes.paletteColumn}`);
            const currentPalette = this.#paletteHistory.getCurrentPalette();
            if (!currentPalette?.items) {
                this.#log.warn('No valid palette data found in history!', `${caller}.syncColumnColorsWithState`);
                return;
            }
            const userPreference = localStorage.getItem('colorPreference') || 'hex';
            const validColorSpace = this.#helpers.typeGuards.isColorSpace(userPreference)
                ? userPreference
                : 'hex';
            paletteColumns.forEach((column, index) => {
                const paletteItem = currentPalette.items[index];
                if (paletteItem) {
                    const colorValue = this.#getColorByPreference(paletteItem.css, validColorSpace);
                    column.style.backgroundColor = colorValue;
                    const colorDisplay = column.querySelector(classes.colorDisplay);
                    if (colorDisplay)
                        colorDisplay.value = colorValue;
                }
                else {
                    column.classList.add('hidden');
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
    #getColorByPreference(colorData, preference) {
        return this.#errors.handleSync(() => {
            return (colorData[preference] ||
                colorData.hex);
        }, `[${caller}]: Failed to retrieve color by preference.`);
    }
    async #handleColorInputChange(event, column, columnID) {
        return this.#errors.handleAsync(async () => {
            const state = this.#stateManager.get();
            const newColor = event.target.value.trim();
            if (!this.#utils.validate.colorInput(newColor))
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
            const onMouseMove = (moveEvent) => {
                const diff = moveEvent.clientX - startX;
                const newSize = startWidth + diff;
                column.style.width = `${newSize}px`; // live feedback
            };
            const onMouseUp = async () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                const columnID = parseInt(column.id.split('-').pop());
                const paletteContainer = this.#stateManager.get('paletteContainer');
                // ensure resizing doesn't break 5-column structure
                const updatedColumns = paletteContainer.columns.map(col => col.id === columnID
                    ? { ...col, size: column.offsetWidth }
                    : col);
                await this.#stateManager.batchUpdate(currentState => ({
                    paletteContainer: {
                        ...currentState.paletteContainer,
                        columns: updatedColumns.slice(0, 5)
                    }
                }));
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

export { PaletteEventsService };
//# sourceMappingURL=PaletteEventsService.js.map
