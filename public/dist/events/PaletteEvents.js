import { EventManager } from './EventManager.js';
import '../config/partials/defaults.js';
import { domConfig, domIndex } from '../config/partials/dom.js';
import '../config/partials/regex.js';

// events/PaleteEvents.ts
const caller = 'PaletteEvents';
const classes = domIndex.classes;
const ids = domIndex.ids;
class PaletteEvents {
    helpers;
    paletteManager;
    paletteState;
    services;
    stateManager;
    utils;
    #draggedColumn = null;
    #errors;
    constructor(helpers, paletteManager, paletteState, services, stateManager, utils) {
        this.helpers = helpers;
        this.paletteManager = paletteManager;
        this.paletteState = paletteState;
        this.services = services;
        this.stateManager = stateManager;
        this.utils = utils;
        try {
            services.log(`Constructing PaletteEvents instance`, {
                caller: `${caller} constructor`
            });
            this.#errors = services.errors;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    init() {
        return this.#errors.handleSync(() => {
            const paletteContainer = this.helpers.dom.getElement(ids.divs.paletteContainer);
            if (!paletteContainer)
                return;
            this.stateManager.setOnStateLoad(() => {
                this.initializeColumnPositions();
            });
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
            const paletteContainer = this.helpers.dom.getElement(ids.divs.paletteContainer);
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
            const paletteContainer = this.helpers.dom.getElement(ids.divs.paletteContainer);
            if (!paletteContainer) {
                this.services.log(`Palette container not found! Cannot attach drag-and-drop handlers.`, {
                    caller: `${caller}.attachDragAndDropHandlers`,
                    level: 'warn'
                });
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
                this.services.log(`Drag started for column: ${this.#draggedColumn.id}`, {
                    caller: `${caller}.attachDragAndDropHandlers`,
                    level: 'debug'
                });
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
                    await this.stateManager.batchUpdate(state => {
                        const updatedColumns = [
                            ...state.paletteContainer.columns
                        ];
                        const draggedIndex = updatedColumns.findIndex(col => col.id === draggedID);
                        const targetIndex = updatedColumns.findIndex(col => col.id === targetID);
                        if (draggedIndex !== -1 && targetIndex !== -1) {
                            [
                                updatedColumns[draggedIndex].position,
                                updatedColumns[targetIndex].position
                            ] = [
                                updatedColumns[targetIndex].position,
                                updatedColumns[draggedIndex].position
                            ];
                        }
                        return {
                            paletteContainer: {
                                ...state.paletteContainer,
                                columns: updatedColumns
                            }
                        };
                    });
                    this.#draggedColumn.classList.remove('dragging');
                    this.services.log(`Swapped columns: ${draggedID} and ${targetID}`, {
                        caller: `${caller}.attachDragAndDropHandlers`,
                        level: 'debug'
                    });
                    this.#draggedColumn = null;
                })(event);
            });
            // drag end
            EventManager.add(paletteContainer, 'dragend', () => {
                if (this.#draggedColumn) {
                    this.#draggedColumn.classList.remove('dragging');
                    this.services.log('Drag ended for column.', {
                        caller: `${caller}.attachDragAndDropHandlers`,
                        level: 'debug'
                    });
                    this.#draggedColumn = null;
                }
            });
            this.services.log(`Drag and drop event listeners attached`, {
                caller: `${caller}.attachDragAndDropHandlers`,
                level: 'debug'
            });
        }, `[${caller}]: Failed to attach drag-and-drop handlers`);
    }
    // initialiezs column positions on page load
    async initializeColumnPositions() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.helpers.dom.getAllElements(classes.paletteColumn);
            // create updated column data based on DOM elements
            const updatedColumns = Array.from(paletteColumns).map((column, index) => ({
                id: parseInt(column.id.split('-').pop() || '0'),
                isLocked: false,
                position: index + 1,
                size: column.offsetWidth
            }));
            // atomically update state using batchUpdate
            await this.stateManager.batchUpdate(state => ({
                paletteContainer: {
                    ...state.paletteContainer,
                    columns: updatedColumns
                }
            }));
            this.services.log('Initialized column positions.', {
                caller: `${caller}.initializeColumnPositions`,
                level: 'debug'
            });
        }, `[${caller}]: Failed to initialize column positions.`);
    }
    // renders column sizes based on stored state
    async renderColumnSizeChange() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.helpers.dom.getAllElements(classes.paletteColumn);
            // safely retrieve the latest state
            const { paletteContainer } = await this.stateManager.getState();
            // update DOM based on state
            paletteColumns.forEach(column => {
                const columnID = parseInt(column.id.split('-').pop());
                const columnData = paletteContainer.columns.find(col => col.id === columnID);
                if (columnData) {
                    column.style.width = `${columnData.size}%`;
                }
            });
            this.services.log('Rendered column size changes.', {
                caller: `${caller}.renderColumnSizeChange`,
                level: 'debug'
            });
        }, `[${caller}]: Failed to render column size changes.`);
    }
    async syncColumnColorsWithState() {
        return this.#errors.handleAsync(async () => {
            const paletteColumns = this.helpers.dom.getAllElements(classes.paletteColumn);
            // retrieve the most recent palette from state
            const { paletteHistory } = await this.stateManager.getState();
            const currentPalette = paletteHistory.at(-1);
            if (!currentPalette?.items) {
                this.services.log('No valid palette data found in history!', {
                    caller: `${caller}.syncColumnColorsWithState`,
                    level: 'warn'
                });
                return;
            }
            const userPreference = localStorage.getItem('colorPreference') || 'hex';
            const validColorSpace = this.helpers.typeguards.isColorSpace(userPreference)
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
                    this.services.log(`Updated color for column ${columnID}: ${colorValue}`, {
                        caller: `${caller}.syncColumnColorsWithState`,
                        level: 'debug'
                    });
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
                this.services.log(`Copied color value: ${text}`, {
                    caller: `${caller}.#copyToClipboard`,
                    level: 'debug'
                });
                setTimeout(() => this.#removeTooltip(targetElement), domConfig.tooltipFadeOut);
            })
                .catch(err => {
                this.services.log(`Error copying to clipboard: ${err}`, {
                    caller: `${caller}.#copyToClipboard`,
                    level: 'error'
                });
            });
        }, `[${caller}]: Failed to copy to clipboard.`);
    }
    // observes palette container for new elements
    async #createPaletteObserver() {
        return this.#errors.handleAsync(async () => {
            const paletteContainer = this.helpers.dom.getElement(ids.divs.paletteContainer);
            if (!paletteContainer)
                return;
            const observer = new MutationObserver((mutationsList) => {
                // TODO: figure out what the hell is going on here
                void (async () => {
                    for (const mutation of mutationsList) {
                        for (const node of mutation.addedNodes) {
                            if (node instanceof HTMLElement &&
                                node.classList.contains(classes.paletteColumn)) {
                                const state = await this.stateManager.getState();
                                if (!state.paletteContainer) {
                                    this.services.log('Skipping execution of initializeColumnPositions - State is not ready!', {
                                        caller: `${caller}.createPaletteObserver`,
                                        level: 'warn'
                                    });
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
            this.services.log('Palette Container MutationObserver created.', {
                caller: `${caller}.createPaletteObserver`
            });
        }, `[${caller}]: Failed to create palette observer.`);
    }
    #getColorByPreference(colorData, preference) {
        return this.#errors.handleSync(() => {
            return (colorData[preference] ||
                colorData.hex);
        }, `[${caller}]: Failed to retrieve color by preference.`);
    }
    #handleColorInputChange(event, column, columnID) {
        return this.#errors.handleSync(() => {
            const newColor = event.target.value.trim();
            if (!this.utils.validate.userColorInput(newColor))
                return;
            column.style.backgroundColor = newColor;
            const colorInput = this.helpers.dom.getElement(`color-input-${columnID}`);
            if (colorInput)
                colorInput.value = newColor;
            const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);
            if (!isNaN(numericColumnID)) {
                this.paletteState.updatePaletteItemColor(numericColumnID, newColor);
            }
        }, `[${caller}]: Failed to handle color input change.`);
    }
    // hides tooltip for a given element
    #hideTooltip() {
        return this.#errors.handleSync(() => {
            this.utils.dom.hideTooltip();
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
                await this.stateManager.batchUpdate(state => ({
                    paletteContainer: {
                        ...state.paletteContainer,
                        columns: state.paletteContainer.columns.map(col => col.id === columnID
                            ? { ...col, size: column.offsetWidth }
                            : col)
                    }
                }));
                this.services.log(`Resized column ${columnID} to ${column.offsetWidth}px`, {
                    caller: `${caller}.#startResize`,
                    level: 'debug'
                });
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
            const modal = this.helpers.dom.getElement(modalID);
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
            this.paletteManager.handleColumnLock(columnID);
        }, `[${caller}]: Failed to toggle lock state.`);
    }
}

export { PaletteEvents };
//# sourceMappingURL=PaletteEvents.js.map
