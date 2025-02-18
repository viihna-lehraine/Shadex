import { EventManager } from './EventManager.js';
import { data } from '../data/index.js';

// events/PaleteEvents.js
const classes = data.dom.classes;
const ids = data.dom.ids;
const timers = data.config.timers;
class PaletteEvents {
    paletteManager;
    paletteState;
    services;
    stateManager;
    utils;
    draggedColumn = null;
    constructor(paletteManager, paletteState, services, stateManager, utils) {
        this.paletteManager = paletteManager;
        this.paletteState = paletteState;
        this.services = services;
        this.stateManager = stateManager;
        this.utils = utils;
    }
    init() {
        const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
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
                this.handleColorInputChange(event, column, columnID);
            }
        });
        // delegated lock button event listener
        EventManager.add(paletteContainer, 'click', event => {
            const target = event.target;
            if (target.matches(classes.lockBtn)) {
                this.toggleLock(target);
            }
        });
        // delegated event listener for modals (open/close)
        EventManager.add(paletteContainer, 'click', event => {
            const target = event.target;
            if (target.matches(classes.colorInputBtn)) {
                this.toggleColorModal(target);
            }
            else if (target.matches(classes.colorInputModal)) {
                if (event.target !== target.querySelector(classes.colorInputBtn)) {
                    target.classList.add(classes.hidden);
                }
            }
        });
        // delegated event listener for resizing columns
        EventManager.add(paletteContainer, 'mousedown', ((event) => {
            const target = event.target;
            if (target.matches(classes.resizeHandle)) {
                this.startResize(event, target.closest(classes.paletteColumn));
            }
        }));
        // delegated event listener for tooltips (1)
        EventManager.add(paletteContainer, 'mouseover', event => {
            const target = event.target;
            if (target.matches(classes.tooltipTrigger)) {
                const tooltipText = target.dataset.tooltip;
                if (tooltipText) {
                    this.showTooltip(target, tooltipText);
                }
            }
        });
        // delegated event listener for tooltips (2)
        EventManager.add(paletteContainer, 'mouseout', event => {
            const target = event.target;
            if (target.matches(classes.tooltipTrigger)) {
                this.hideTooltip();
            }
        });
        // observe for new elements
        this.createPaletteObserver();
        // automatically initialize column positions
        setTimeout(() => {
            if (!this.stateManager.getState().paletteContainer) {
                this.services.log('warn', 'Skipping initializeColumnPositions() because state is not initialized yet.', 'PaletteEvents.init()', 2);
                return;
            }
            this.initializeColumnPositions();
        }, 200);
    }
    attachColorCopyHandlers() {
        const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
        if (!paletteContainer)
            return;
        EventManager.add(paletteContainer, 'click', ((event) => {
            const target = event.target;
            if (!target.matches(classes.colorDisplay))
                return;
            this.copyToClipboard(target.value, target);
        }));
    }
    attachDragAndDropHandlers() {
        const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
        if (!paletteContainer) {
            this.services.log('error', `Palette container not found! Cannot attach drag-and-drop handlers.`, 'PaletteEvents.attachDragAndDropHandlers()', 1);
            return;
        }
        // drag start
        EventManager.add(paletteContainer, 'dragstart', ((event) => {
            const dragHandle = event.target.closest(classes.dragHandle);
            if (!dragHandle)
                return;
            this.draggedColumn = dragHandle.closest(classes.paletteColumn);
            if (!this.draggedColumn)
                return;
            event.dataTransfer?.setData('text/plain', this.draggedColumn.id);
            this.draggedColumn.classList.add('dragging');
            this.services.log('debug', `Drag started for column: ${this.draggedColumn.id}`, 'PaletteEvents.attachDragAndDropHandlers()', 4);
        }));
        // drag over (Allow dropping)
        EventManager.add(paletteContainer, 'dragover', ((event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        }));
        // drop (Swap columns)
        EventManager.add(paletteContainer, 'drop', ((event) => {
            event.preventDefault();
            const targetColumn = event.target.closest(classes.paletteColumn);
            if (!this.draggedColumn ||
                !targetColumn ||
                this.draggedColumn === targetColumn)
                return;
            const draggedID = parseInt(this.draggedColumn.id.split('-').pop());
            const targetID = parseInt(targetColumn.id.split('-').pop());
            this.paletteManager.swapColumns(draggedID, targetID);
            // swap positions in State
            const updatedColumns = [
                ...this.stateManager.getState().paletteContainer.columns
            ];
            const draggedIndex = updatedColumns.findIndex(col => col.id ===
                parseInt(this.draggedColumn.id.split('-').pop() || '0'));
            const targetIndex = updatedColumns.findIndex(col => col.id === parseInt(targetColumn.id.split('-').pop() || '0'));
            if (draggedIndex !== -1 && targetIndex !== -1) {
                [
                    updatedColumns[draggedIndex].position,
                    updatedColumns[targetIndex].position
                ] = [
                    updatedColumns[targetIndex].position,
                    updatedColumns[draggedIndex].position
                ];
                this.stateManager.updatePaletteColumns(updatedColumns, false, 5);
            }
            this.draggedColumn.classList.remove('dragging');
            this.services.log('debug', `Successfully swapped columns: ${this.draggedColumn.id} and ${targetColumn.id}`, 'PaletteEvents.attachDragAndDropHandlers()', 4);
            this.draggedColumn = null;
        }));
        // drag end
        EventManager.add(paletteContainer, 'dragend', () => {
            if (this.draggedColumn) {
                this.draggedColumn.classList.remove('dragging');
                this.services.log('debug', `Drag ended for column.`, 'PaletteEvents.attachDnDHandlers()', 4);
            }
        });
        this.services.log(`debug`, `Drag and drop event listeners attached`, 'PaletteEvents.attachDragAndDropHandlers()', 3);
    }
    // initialiezs column positions on page load
    initializeColumnPositions() {
        const paletteColumns = this.utils.core.getAllElements(classes.paletteColumn);
        const updatedColumns = Array.from(paletteColumns).map((column, index) => {
            return {
                id: parseInt(column.id.split('-').pop() || '0'),
                isLocked: false,
                position: index + 1,
                size: column.offsetWidth
            };
        });
        this.stateManager.updatePaletteColumns(updatedColumns, false, 4);
    }
    // renders column sizes based on stored state
    renderColumnSizeChange() {
        const paletteColumns = this.utils.core.getAllElements(classes.paletteColumn);
        const columnsState = this.stateManager.getState().paletteContainer.columns;
        paletteColumns.forEach(column => {
            const columnID = parseInt(column.id.split('-').pop());
            const columnData = columnsState.find(col => col.id === columnID);
            if (columnData) {
                column.style.width = `${columnData.size}%`;
            }
        });
    }
    syncColumnColorsWithState() {
        const paletteColumns = this.utils.core.getAllElements(classes.paletteColumn);
        const currentPalette = this.stateManager.getState().paletteContainer.columns;
        const paletteData = this.stateManager.getState().paletteHistory.at(-1);
        if (!paletteData || !paletteData.items) {
            this.services.log('warn', 'No valid palette data found in history!', 'PaletteEvents.syncColumnColorsWithState()', 2);
            return;
        }
        paletteColumns.forEach(column => {
            const columnID = parseInt(column.id.split('-').pop());
            const columnData = currentPalette.find(col => col.id === columnID);
            const paletteItem = paletteData.items.find(item => item.itemID === columnID);
            if (columnData && paletteItem) {
                const colorValue = paletteItem.css.hex; // *DEV-NOTE* make this interchangeable
                column.style.backgroundColor = colorValue;
                const colorDisplay = column.querySelector(classes.colorDisplay);
                if (colorDisplay)
                    colorDisplay.value = colorValue;
                this.services.log('debug', `Synchronized color for column ${columnID}: ${colorValue}`, 'PaletteEvents.syncColumnColorsWithState()', 4);
            }
        });
    }
    copyToClipboard(text, targetElement) {
        navigator.clipboard
            .writeText(text.trim())
            .then(() => {
            // show tooltip with "Copied!" message
            this.showTooltip(targetElement, 'Copied!');
            this.services.log('debug', `Copied color value: ${text}`, 'PaletteEvents.copyToClipboard()', 4);
            // ensure tooltip is removed after the timeout
            setTimeout(() => this.removeTooltip(targetElement), timers.tooltipFadeOut);
        })
            .catch(err => {
            this.services.log('error', `Error copying to clipboard: ${err}`, 'PaletteEvents.copyToClipboard()', 1);
        });
    }
    // observes palette container for new elements
    createPaletteObserver() {
        const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
        if (!paletteContainer)
            return;
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement &&
                        node.classList.contains(classes.paletteColumn)) {
                        if (!this.stateManager.getState().paletteContainer) {
                            this.services.log('warn', 'Skipping initializeColumnPositions() - State is not ready!', 'PaletteEvents.createPaletteObserver()');
                            return;
                        }
                        this.initializeColumnPositions();
                    }
                });
            });
        });
        observer.observe(paletteContainer, { childList: true, subtree: true });
        this.services.log('info', 'Palette Container MutationObserver created', 'PaletteEvents.createPaletteObserver()', 2);
    }
    handleColorInputChange(event, column, columnID) {
        const newColor = event.target.value.trim();
        if (!this.utils.validate.userColorInput(newColor))
            return;
        column.style.backgroundColor = newColor;
        const colorInput = this.utils.core.getElement(`color-input-${columnID}`);
        if (colorInput)
            colorInput.value = newColor;
        // extract numeric ID from columnID
        const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);
        if (isNaN(numericColumnID))
            return;
        this.paletteState.updatePaletteItemColor(numericColumnID, newColor);
    }
    // hides tooltip for a given element
    hideTooltip() {
        this.utils.dom.hideTooltip();
    }
    removeTooltip(element) {
        const tooltipId = element.dataset.tooltipId;
        if (!tooltipId)
            return;
        const tooltip = document.getElementById(tooltipId);
        if (tooltip)
            tooltip.remove();
        // cleanup
        delete element.dataset.tooltipId;
    }
    // displays tooltip for a given element
    showTooltip(element, text) {
        // if tooltip already exists on this element, remove it
        this.removeTooltip(element);
        // create tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        // position tooltip near the element
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
        // associate tooltip with the element
        element.dataset.tooltipId = tooltip.id;
    }
    // handles resizing of palette columns
    startResize(event, column) {
        if (!column || column.classList.contains(classes.locked))
            return;
        const startX = event.clientX;
        const startWidth = column.offsetWidth;
        const onMouseMove = (moveEvent) => {
            const diff = moveEvent.clientX - startX;
            const newSize = startWidth + diff;
            const columnID = parseInt(column.id.split('-').pop());
            this.paletteManager.handleColumnResize(columnID, newSize);
        };
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            // save new size to state
            const columnID = parseInt(column.id.split('-').pop());
            const updatedColumns = this.stateManager
                .getState()
                .paletteContainer.columns.map(col => col.id === columnID
                ? { ...col, size: column.offsetWidth }
                : col);
            this.stateManager.updatePaletteColumns(updatedColumns, false, 4);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
    // toggles color input modal
    toggleColorModal(button) {
        const modalID = button.dataset.modalID;
        if (!modalID)
            return;
        const modal = this.utils.core.getElement(modalID);
        modal?.classList.toggle(classes.hidden);
    }
    // toggles lock state of a palette column
    toggleLock(button) {
        const column = button.closest(classes.paletteColumn);
        if (!column)
            return;
        const columnID = parseInt(column.id.split('-').pop());
        this.paletteManager.handleColumnLock(columnID);
    }
}

export { PaletteEvents };
//# sourceMappingURL=PaletteEvents.js.map
