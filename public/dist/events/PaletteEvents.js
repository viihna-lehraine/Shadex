// events/PaleteEvents.js
import { EventManager } from './EventManager.js';
import { data } from '../config/index.js';
const classes = data.dom.classes;
const ids = data.dom.ids;
const timers = data.config.timers;
export class PaletteEvents {
    paletteManager;
    paletteState;
    services;
    stateManager;
    utils;
    draggedColumn = null;
    errors;
    constructor(paletteManager, paletteState, services, stateManager, utils) {
        this.paletteManager = paletteManager;
        this.paletteState = paletteState;
        this.services = services;
        this.stateManager = stateManager;
        this.utils = utils;
        this.errors = services.errors;
    }
    init() {
        this.errors.handle(() => {
            const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
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
        }, `Failed to call init()`);
    }
    attachColorCopyHandlers() {
        this.errors.handle(() => {
            const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
            if (!paletteContainer)
                return;
            EventManager.add(paletteContainer, 'click', event => {
                const target = event.target;
                if (target.matches(classes.colorDisplay))
                    this.copyToClipboard(target.value, target);
            });
        }, 'Failed to attach color copy handlers');
    }
    attachDragAndDropHandlers() {
        this.errors.handle(() => {
            const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
            if (!paletteContainer) {
                this.services.log(`Palette container not found! Cannot attach drag-and-drop handlers.`, 'error');
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
                this.services.log(`Drag started for column: ${this.draggedColumn.id}`, 'debug');
            }));
            // drag over (Allow dropping)
            EventManager.add(paletteContainer, 'dragover', ((event) => {
                event.preventDefault();
                if (event.dataTransfer)
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
                // swap positions in state
                const updatedColumns = [
                    ...this.stateManager.getState().paletteContainer.columns
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
                    this.stateManager.updatePaletteColumns(updatedColumns, false, 5);
                }
                this.draggedColumn.classList.remove('dragging');
                this.services.log(`Successfully swapped columns: ${this.draggedColumn.id} and ${targetColumn.id}`, 'debug');
                this.draggedColumn = null;
            }));
            // drag end
            EventManager.add(paletteContainer, 'dragend', () => {
                if (this.draggedColumn) {
                    this.draggedColumn.classList.remove('dragging');
                    this.services.log('Drag ended for column.', 'debug');
                    this.draggedColumn = null;
                }
            });
            this.services.log(`Drag and drop event listeners attached`, 'debug');
        }, 'Failed to attach drag-and-drop handlers');
    }
    // initialiezs column positions on page load
    initializeColumnPositions() {
        this.errors.handle(() => {
            const paletteColumns = this.utils.core.getAllElements(classes.paletteColumn);
            const updatedColumns = Array.from(paletteColumns).map((column, index) => ({
                id: parseInt(column.id.split('-').pop() || '0'),
                isLocked: false,
                position: index + 1,
                size: column.offsetWidth
            }));
            this.stateManager.updatePaletteColumns(updatedColumns, false, 4);
        }, 'Failed to initialize column positions');
    }
    // renders column sizes based on stored state
    renderColumnSizeChange() {
        this.errors.handle(() => {
            const paletteColumns = this.utils.core.getAllElements(classes.paletteColumn);
            const columnsState = this.stateManager.getState().paletteContainer.columns;
            paletteColumns.forEach(column => {
                const columnID = parseInt(column.id.split('-').pop());
                const columnData = columnsState.find(col => col.id === columnID);
                if (columnData) {
                    column.style.width = `${columnData.size}%`;
                }
            });
        }, 'Failed to render column size changes');
    }
    syncColumnColorsWithState() {
        this.errors.handle(() => {
            const paletteColumns = this.utils.core.getAllElements(classes.paletteColumn);
            const currentPalette = this.stateManager
                .getState()
                .paletteHistory.at(-1);
            if (!currentPalette || !currentPalette.items) {
                this.services.log('No valid palette data found in history!', 'warn');
                return;
            }
            const userPreference = localStorage.getItem('colorPreference') || 'hex';
            const validColorSpace = this.utils.typeGuards.isColorSpace(userPreference)
                ? userPreference
                : 'hex';
            paletteColumns.forEach(column => {
                const columnID = parseInt(column.id.split('-').pop());
                const paletteItem = currentPalette.items.find(item => item.itemID === columnID);
                if (paletteItem) {
                    const colorValue = this.getColorByPreference(paletteItem.css, validColorSpace);
                    column.style.backgroundColor = colorValue;
                    const colorDisplay = column.querySelector(classes.colorDisplay);
                    if (colorDisplay)
                        colorDisplay.value = colorValue;
                    this.services.log(`Updated color for column ${columnID}: ${colorValue}`, 'debug');
                }
            });
        }, 'Failed to sync column colors with state');
    }
    copyToClipboard(text, targetElement) {
        this.errors.handle(() => {
            navigator.clipboard
                .writeText(text.trim())
                .then(() => {
                this.showTooltip(targetElement, 'Copied!');
                this.services.log(`Copied color value: ${text}`, 'debug');
                setTimeout(() => this.removeTooltip(targetElement), timers.tooltipFadeOut);
            })
                .catch(err => {
                this.services.log(`Error copying to clipboard: ${err}`, 'error');
            });
        }, 'Failed to copy to clipboard');
    }
    // observes palette container for new elements
    createPaletteObserver() {
        this.errors.handle(() => {
            const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
            if (!paletteContainer)
                return;
            const observer = new MutationObserver((mutationsList) => {
                mutationsList.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLElement &&
                            node.classList.contains(classes.paletteColumn)) {
                            if (!this.stateManager.getState()
                                .paletteContainer) {
                                this.services.log('Skipping initializeColumnPositions() - State is not ready!', 'warn');
                                return;
                            }
                            this.initializeColumnPositions();
                        }
                    });
                });
            });
            observer.observe(paletteContainer, {
                childList: true,
                subtree: true
            });
            this.services.log('Palette Container MutationObserver created');
        }, 'Failed to create palette observer');
    }
    getColorByPreference(colorData, preference) {
        return (colorData[preference] || colorData.hex);
    }
    handleColorInputChange(event, column, columnID) {
        this.errors.handle(() => {
            const newColor = event.target.value.trim();
            if (!this.utils.validate.userColorInput(newColor))
                return;
            column.style.backgroundColor = newColor;
            const colorInput = this.utils.core.getElement(`color-input-${columnID}`);
            if (colorInput)
                colorInput.value = newColor;
            const numericColumnID = parseInt(columnID.replace(/\D/g, ''), 10);
            if (!isNaN(numericColumnID)) {
                this.paletteState.updatePaletteItemColor(numericColumnID, newColor);
            }
        }, 'Failed to handle color input change');
    }
    // hides tooltip for a given element
    hideTooltip() {
        this.utils.dom.hideTooltip();
    }
    removeTooltip(element) {
        this.errors.handle(() => {
            const tooltipId = element.dataset.tooltipId;
            if (!tooltipId)
                return;
            const tooltip = document.getElementById(tooltipId);
            if (tooltip)
                tooltip.remove();
            delete element.dataset.tooltipId;
        }, 'Failed to remove tooltip');
    }
    showTooltip(element, text) {
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
    startResize(event, column) {
        this.errors.handle(() => {
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
        }, 'Failed to start column resize');
    }
    toggleColorModal(button) {
        this.errors.handle(() => {
            const modalID = button.dataset.modalID;
            if (!modalID)
                return;
            const modal = this.utils.core.getElement(modalID);
            modal?.classList.toggle(classes.hidden);
        }, 'Failed to toggle color modal');
    }
    // toggles lock state of a palette column
    toggleLock(button) {
        this.errors.handle(() => {
            const column = button.closest(classes.paletteColumn);
            if (!column)
                return;
            const columnID = parseInt(column.id.split('-').pop());
            this.paletteManager.handleColumnLock(columnID);
        }, 'Failed to toggle lock state');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZUV2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ldmVudHMvUGFsZXR0ZUV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5QkFBeUI7QUFTekIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBSWpELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUVsQyxNQUFNLE9BQU8sYUFBYTtJQUtoQjtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBUkQsYUFBYSxHQUF1QixJQUFJLENBQUM7SUFDekMsTUFBTSxDQUE4QjtJQUU1QyxZQUNTLGNBQThCLEVBQzlCLFlBQTBCLEVBQzFCLFFBQTJCLEVBQzNCLFlBQTBCLEVBQzFCLEtBQXlCO1FBSnpCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUFtQjtRQUMzQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUVqQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVNLElBQUk7UUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDdkIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQ2xELEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQ3pCLENBQUM7WUFFRixJQUFJLENBQUMs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USxDQUFDLENBQUM7UUFDaEQsQ0FBQyxFQUFFLDZCQUE2QixDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXZlbnRzL1BhbGV0ZUV2ZW50cy5qc1xuXG5pbXBvcnQge1xuXHRDb2xvclNwYWNlLFxuXHRQYWxldHRlRXZlbnRzSW50ZXJmYWNlLFxuXHRQYWxldHRlSXRlbSxcblx0U2VydmljZXNJbnRlcmZhY2UsXG5cdFV0aWxpdGllc0ludGVyZmFjZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tICcuL0V2ZW50TWFuYWdlci5qcyc7XG5pbXBvcnQgeyBQYWxldHRlTWFuYWdlciB9IGZyb20gJy4uL3BhbGV0dGUvUGFsZXR0ZU1hbmFnZXIuanMnO1xuaW1wb3J0IHsgUGFsZXR0ZVN0YXRlIH0gZnJvbSAnLi4vc3RhdGUvUGFsZXR0ZVN0YXRlLmpzJztcbmltcG9ydCB7IFN0YXRlTWFuYWdlciB9IGZyb20gJy4uL3N0YXRlL1N0YXRlTWFuYWdlci5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgY2xhc3NlcyA9IGRhdGEuZG9tLmNsYXNzZXM7XG5jb25zdCBpZHMgPSBkYXRhLmRvbS5pZHM7XG5jb25zdCB0aW1lcnMgPSBkYXRhLmNvbmZpZy50aW1lcnM7XG5cbmV4cG9ydCBjbGFzcyBQYWxldHRlRXZlbnRzIGltcGxlbWVudHMgUGFsZXR0ZUV2ZW50c0ludGVyZmFjZSB7XG5cdHByaXZhdGUgZHJhZ2dlZENvbHVtbjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBlcnJvcnM6IFNlcnZpY2VzSW50ZXJmYWNlWydlcnJvcnMnXTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHBhbGV0dGVNYW5hZ2VyOiBQYWxldHRlTWFuYWdlcixcblx0XHRwcml2YXRlIHBhbGV0dGVTdGF0ZTogUGFsZXR0ZVN0YXRlLFxuXHRcdHByaXZhdGUgc2VydmljZXM6IFNlcnZpY2VzSW50ZXJmYWNlLFxuXHRcdHByaXZhdGUgc3RhdGVNYW5hZ2VyOiBTdGF0ZU1hbmFnZXIsXG5cdFx0cHJpdmF0ZSB1dGlsczogVXRpbGl0aWVzSW50ZXJmYWNlXG5cdCkge1xuXHRcdHRoaXMuZXJyb3JzID0gc2VydmljZXMuZXJyb3JzO1xuXHR9XG5cblx0cHVibGljIGluaXQoKSB7XG5cdFx0dGhpcy5lcnJvcnMuaGFuZGxlKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb250YWluZXIgPSB0aGlzLnV0aWxzLmNvcmUuZ2V0RWxlbWVudChcblx0XHRcdFx0aWRzLmRpdnMucGFsZXR0ZUNvbnRhaW5lclxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFwYWxldHRlQ29udGFpbmVyKSByZXR1cm47XG5cblx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnNldE9uU3RhdGVMb2FkKCgpID0+IHtcblx0XHRcdFx0dGhpcy5pbml0aWFsaXplQ29sdW1uUG9zaXRpb25zKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZGVsZWdhdGVkIGV2ZW50IGxpc3RlbmVyIGZvciBjb2xvciBpbnB1dCBjaGFuZ2VzXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdpbnB1dCcsIGV2ZW50ID0+IHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0XHRcdGlmICh0YXJnZXQubWF0Y2hlcyhjbGFzc2VzLmNvbG9yRGlzcGxheSkpIHtcblx0XHRcdFx0XHRjb25zdCBjb2x1bW4gPSB0YXJnZXQuY2xvc2VzdChcblx0XHRcdFx0XHRcdGNsYXNzZXMucGFsZXR0ZUNvbHVtblxuXHRcdFx0XHRcdCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBjb2x1bW4/LmlkLnNwbGl0KCctJykucG9wKCk7XG5cblx0XHRcdFx0XHRpZiAoIWNvbHVtbiB8fCAhY29sdW1uSUQpIHJldHVybjtcblxuXHRcdFx0XHRcdHRoaXMuaGFuZGxlQ29sb3JJbnB1dENoYW5nZShldmVudCwgY29sdW1uLCBjb2x1bW5JRCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBkZWxlZ2F0ZWQgbG9jayBidXR0b24gZXZlbnQgbGlzdGVuZXJcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQocGFsZXR0ZUNvbnRhaW5lciwgJ2NsaWNrJywgZXZlbnQgPT4ge1xuXHRcdFx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdFx0aWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMubG9ja0J0bikpIHtcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZUxvY2sodGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGRlbGVnYXRlZCBldmVudCBsaXN0ZW5lciBmb3IgbW9kYWxzIChvcGVuL2Nsb3NlKVxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChwYWxldHRlQ29udGFpbmVyLCAnY2xpY2snLCBldmVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoY2xhc3Nlcy5jb2xvcklucHV0QnRuKSkge1xuXHRcdFx0XHRcdHRoaXMudG9nZ2xlQ29sb3JNb2RhbCh0YXJnZXQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMuY29sb3JJbnB1dE1vZGFsKSkge1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdGV2ZW50LnRhcmdldCAhPT1cblx0XHRcdFx0XHRcdHRhcmdldC5xdWVyeVNlbGVjdG9yKGNsYXNzZXMuY29sb3JJbnB1dEJ0bilcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzZXMuaGlkZGVuKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBkZWxlZ2F0ZWQgZXZlbnQgbGlzdGVuZXIgZm9yIHJlc2l6aW5nIGNvbHVtbnNcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQocGFsZXR0ZUNvbnRhaW5lciwgJ21vdXNlZG93bicsICgoXG5cdFx0XHRcdGV2ZW50OiBNb3VzZUV2ZW50XG5cdFx0XHQpID0+IHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0XHRcdGlmICh0YXJnZXQubWF0Y2hlcyhjbGFzc2VzLnJlc2l6ZUhhbmRsZSkpIHtcblx0XHRcdFx0XHR0aGlzLnN0YXJ0UmVzaXplKFxuXHRcdFx0XHRcdFx0ZXZlbnQsXG5cdFx0XHRcdFx0XHR0YXJnZXQuY2xvc2VzdChjbGFzc2VzLnBhbGV0dGVDb2x1bW4pIGFzIEhUTUxFbGVtZW50XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cblx0XHRcdC8vIGRlbGVnYXRlZCBldmVudCBsaXN0ZW5lciBmb3IgdG9vbHRpcHMgKDEpXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdtb3VzZW92ZXInLCBldmVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHRpZiAodGFyZ2V0Lm1hdGNoZXMoY2xhc3Nlcy50b29sdGlwVHJpZ2dlcikpIHtcblx0XHRcdFx0XHRjb25zdCB0b29sdGlwVGV4dCA9IHRhcmdldC5kYXRhc2V0LnRvb2x0aXA7XG5cblx0XHRcdFx0XHRpZiAodG9vbHRpcFRleHQpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2hvd1Rvb2x0aXAodGFyZ2V0LCB0b29sdGlwVGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZGVsZWdhdGVkIGV2ZW50IGxpc3RlbmVyIGZvciB0b29sdGlwcyAoMilcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQocGFsZXR0ZUNvbnRhaW5lciwgJ21vdXNlb3V0JywgZXZlbnQgPT4ge1xuXHRcdFx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdFx0aWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMudG9vbHRpcFRyaWdnZXIpKSB7XG5cdFx0XHRcdFx0dGhpcy5oaWRlVG9vbHRpcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gb2JzZXJ2ZSBmb3IgbmV3IGVsZW1lbnRzXG5cdFx0XHR0aGlzLmNyZWF0ZVBhbGV0dGVPYnNlcnZlcigpO1xuXHRcdH0sIGBGYWlsZWQgdG8gY2FsbCBpbml0KClgKTtcblx0fVxuXG5cdHB1YmxpYyBhdHRhY2hDb2xvckNvcHlIYW5kbGVycygpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbnRhaW5lciA9IHRoaXMudXRpbHMuY29yZS5nZXRFbGVtZW50KFxuXHRcdFx0XHRpZHMuZGl2cy5wYWxldHRlQ29udGFpbmVyXG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFwYWxldHRlQ29udGFpbmVyKSByZXR1cm47XG5cblx0XHRcdEV2ZW50TWFuYWdlci5hZGQocGFsZXR0ZUNvbnRhaW5lciwgJ2NsaWNrJywgZXZlbnQgPT4ge1xuXHRcdFx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRcdFx0aWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMuY29sb3JEaXNwbGF5KSlcblx0XHRcdFx0XHR0aGlzLmNvcHlUb0NsaXBib2FyZCh0YXJnZXQudmFsdWUsIHRhcmdldCk7XG5cdFx0XHR9KTtcblx0XHR9LCAnRmFpbGVkIHRvIGF0dGFjaCBjb2xvciBjb3B5IGhhbmRsZXJzJyk7XG5cdH1cblxuXHRwdWJsaWMgYXR0YWNoRHJhZ0FuZERyb3BIYW5kbGVycygpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbnRhaW5lciA9IHRoaXMudXRpbHMuY29yZS5nZXRFbGVtZW50KFxuXHRcdFx0XHRpZHMuZGl2cy5wYWxldHRlQ29udGFpbmVyXG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFwYWxldHRlQ29udGFpbmVyKSB7XG5cdFx0XHRcdHRoaXMuc2VydmljZXMubG9nKFxuXHRcdFx0XHRcdGBQYWxldHRlIGNvbnRhaW5lciBub3QgZm91bmQhIENhbm5vdCBhdHRhY2ggZHJhZy1hbmQtZHJvcCBoYW5kbGVycy5gLFxuXHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBkcmFnIHN0YXJ0XG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdkcmFnc3RhcnQnLCAoKFxuXHRcdFx0XHRldmVudDogRHJhZ0V2ZW50XG5cdFx0XHQpID0+IHtcblx0XHRcdFx0Y29uc3QgZHJhZ0hhbmRsZSA9IChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoXG5cdFx0XHRcdFx0Y2xhc3Nlcy5kcmFnSGFuZGxlXG5cdFx0XHRcdCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0XHRcdGlmICghZHJhZ0hhbmRsZSkgcmV0dXJuO1xuXG5cdFx0XHRcdHRoaXMuZHJhZ2dlZENvbHVtbiA9IGRyYWdIYW5kbGUuY2xvc2VzdChcblx0XHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdFx0KSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdFx0aWYgKCF0aGlzLmRyYWdnZWRDb2x1bW4pIHJldHVybjtcblxuXHRcdFx0XHRldmVudC5kYXRhVHJhbnNmZXI/LnNldERhdGEoXG5cdFx0XHRcdFx0J3RleHQvcGxhaW4nLFxuXHRcdFx0XHRcdHRoaXMuZHJhZ2dlZENvbHVtbi5pZFxuXHRcdFx0XHQpO1xuXHRcdFx0XHR0aGlzLmRyYWdnZWRDb2x1bW4uY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcblxuXHRcdFx0XHR0aGlzLnNlcnZpY2VzLmxvZyhcblx0XHRcdFx0XHRgRHJhZyBzdGFydGVkIGZvciBjb2x1bW46ICR7dGhpcy5kcmFnZ2VkQ29sdW1uLmlkfWAsXG5cdFx0XHRcdFx0J2RlYnVnJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cblx0XHRcdC8vIGRyYWcgb3ZlciAoQWxsb3cgZHJvcHBpbmcpXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdkcmFnb3ZlcicsICgoXG5cdFx0XHRcdGV2ZW50OiBEcmFnRXZlbnRcblx0XHRcdCkgPT4ge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcblx0XHRcdH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG5cdFx0XHQvLyBkcm9wIChTd2FwIGNvbHVtbnMpXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdkcm9wJywgKChldmVudDogRHJhZ0V2ZW50KSA9PiB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgdGFyZ2V0Q29sdW1uID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdChcblx0XHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdFx0KSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdCF0aGlzLmRyYWdnZWRDb2x1bW4gfHxcblx0XHRcdFx0XHQhdGFyZ2V0Q29sdW1uIHx8XG5cdFx0XHRcdFx0dGhpcy5kcmFnZ2VkQ29sdW1uID09PSB0YXJnZXRDb2x1bW5cblx0XHRcdFx0KVxuXHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRjb25zdCBkcmFnZ2VkSUQgPSBwYXJzZUludChcblx0XHRcdFx0XHR0aGlzLmRyYWdnZWRDb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSFcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0SUQgPSBwYXJzZUludCh0YXJnZXRDb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXG5cdFx0XHRcdHRoaXMucGFsZXR0ZU1hbmFnZXIuc3dhcENvbHVtbnMoZHJhZ2dlZElELCB0YXJnZXRJRCk7XG5cblx0XHRcdFx0Ly8gc3dhcCBwb3NpdGlvbnMgaW4gc3RhdGVcblx0XHRcdFx0Y29uc3QgdXBkYXRlZENvbHVtbnMgPSBbXG5cdFx0XHRcdFx0Li4udGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKS5wYWxldHRlQ29udGFpbmVyLmNvbHVtbnNcblx0XHRcdFx0XTtcblx0XHRcdFx0Y29uc3QgZHJhZ2dlZEluZGV4ID0gdXBkYXRlZENvbHVtbnMuZmluZEluZGV4KFxuXHRcdFx0XHRcdGNvbCA9PiBjb2wuaWQgPT09IGRyYWdnZWRJRFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCB0YXJnZXRJbmRleCA9IHVwZGF0ZWRDb2x1bW5zLmZpbmRJbmRleChcblx0XHRcdFx0XHRjb2wgPT4gY29sLmlkID09PSB0YXJnZXRJRFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChkcmFnZ2VkSW5kZXggIT09IC0xICYmIHRhcmdldEluZGV4ICE9PSAtMSkge1xuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdHVwZGF0ZWRDb2x1bW5zW2RyYWdnZWRJbmRleF0ucG9zaXRpb24sXG5cdFx0XHRcdFx0XHR1cGRhdGVkQ29sdW1uc1t0YXJnZXRJbmRleF0ucG9zaXRpb25cblx0XHRcdFx0XHRdID0gW1xuXHRcdFx0XHRcdFx0dXBkYXRlZENvbHVtbnNbdGFyZ2V0SW5kZXhdLnBvc2l0aW9uLFxuXHRcdFx0XHRcdFx0dXBkYXRlZENvbHVtbnNbZHJhZ2dlZEluZGV4XS5wb3NpdGlvblxuXHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHR0aGlzLnN0YXRlTWFuYWdlci51cGRhdGVQYWxldHRlQ29sdW1ucyhcblx0XHRcdFx0XHRcdHVwZGF0ZWRDb2x1bW5zLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHQ1XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuZHJhZ2dlZENvbHVtbi5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuXHRcdFx0XHR0aGlzLnNlcnZpY2VzLmxvZyhcblx0XHRcdFx0XHRgU3VjY2Vzc2Z1bGx5IHN3YXBwZWQgY29sdW1uczogJHt0aGlzLmRyYWdnZWRDb2x1bW4uaWR9IGFuZCAke3RhcmdldENvbHVtbi5pZH1gLFxuXHRcdFx0XHRcdCdkZWJ1Zydcblx0XHRcdFx0KTtcblxuXHRcdFx0XHR0aGlzLmRyYWdnZWRDb2x1bW4gPSBudWxsO1xuXHRcdFx0fSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cblx0XHRcdC8vIGRyYWcgZW5kXG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKHBhbGV0dGVDb250YWluZXIsICdkcmFnZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5kcmFnZ2VkQ29sdW1uKSB7XG5cdFx0XHRcdFx0dGhpcy5kcmFnZ2VkQ29sdW1uLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG5cdFx0XHRcdFx0dGhpcy5zZXJ2aWNlcy5sb2coJ0RyYWcgZW5kZWQgZm9yIGNvbHVtbi4nLCAnZGVidWcnKTtcblx0XHRcdFx0XHR0aGlzLmRyYWdnZWRDb2x1bW4gPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5zZXJ2aWNlcy5sb2coXG5cdFx0XHRcdGBEcmFnIGFuZCBkcm9wIGV2ZW50IGxpc3RlbmVycyBhdHRhY2hlZGAsXG5cdFx0XHRcdCdkZWJ1Zydcblx0XHRcdCk7XG5cdFx0fSwgJ0ZhaWxlZCB0byBhdHRhY2ggZHJhZy1hbmQtZHJvcCBoYW5kbGVycycpO1xuXHR9XG5cblx0Ly8gaW5pdGlhbGllenMgY29sdW1uIHBvc2l0aW9ucyBvbiBwYWdlIGxvYWRcblx0cHVibGljIGluaXRpYWxpemVDb2x1bW5Qb3NpdGlvbnMoKTogdm9pZCB7XG5cdFx0dGhpcy5lcnJvcnMuaGFuZGxlKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5zID0gdGhpcy51dGlscy5jb3JlLmdldEFsbEVsZW1lbnRzKFxuXHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IHVwZGF0ZWRDb2x1bW5zID0gQXJyYXkuZnJvbShwYWxldHRlQ29sdW1ucykubWFwKFxuXHRcdFx0XHQoY29sdW1uLCBpbmRleCkgPT4gKHtcblx0XHRcdFx0XHRpZDogcGFyc2VJbnQoY29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkgfHwgJzAnKSxcblx0XHRcdFx0XHRpc0xvY2tlZDogZmFsc2UsXG5cdFx0XHRcdFx0cG9zaXRpb246IGluZGV4ICsgMSxcblx0XHRcdFx0XHRzaXplOiBjb2x1bW4ub2Zmc2V0V2lkdGhcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cblx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKHVwZGF0ZWRDb2x1bW5zLCBmYWxzZSwgNCk7XG5cdFx0fSwgJ0ZhaWxlZCB0byBpbml0aWFsaXplIGNvbHVtbiBwb3NpdGlvbnMnKTtcblx0fVxuXG5cdC8vIHJlbmRlcnMgY29sdW1uIHNpemVzIGJhc2VkIG9uIHN0b3JlZCBzdGF0ZVxuXHRwdWJsaWMgcmVuZGVyQ29sdW1uU2l6ZUNoYW5nZSgpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbHVtbnMgPSB0aGlzLnV0aWxzLmNvcmUuZ2V0QWxsRWxlbWVudHMoXG5cdFx0XHRcdGNsYXNzZXMucGFsZXR0ZUNvbHVtblxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGNvbHVtbnNTdGF0ZSA9XG5cdFx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCkucGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zO1xuXG5cdFx0XHRwYWxldHRlQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG5cdFx0XHRcdGNvbnN0IGNvbHVtbklEID0gcGFyc2VJbnQoY29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkhKTtcblx0XHRcdFx0Y29uc3QgY29sdW1uRGF0YSA9IGNvbHVtbnNTdGF0ZS5maW5kKFxuXHRcdFx0XHRcdGNvbCA9PiBjb2wuaWQgPT09IGNvbHVtbklEXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKGNvbHVtbkRhdGEpIHtcblx0XHRcdFx0XHQoY29sdW1uIGFzIEhUTUxFbGVtZW50KS5zdHlsZS53aWR0aCA9IGAke2NvbHVtbkRhdGEuc2l6ZX0lYDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSwgJ0ZhaWxlZCB0byByZW5kZXIgY29sdW1uIHNpemUgY2hhbmdlcycpO1xuXHR9XG5cblx0cHVibGljIHN5bmNDb2x1bW5Db2xvcnNXaXRoU3RhdGUoKTogdm9pZCB7XG5cdFx0dGhpcy5lcnJvcnMuaGFuZGxlKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5zID1cblx0XHRcdFx0dGhpcy51dGlscy5jb3JlLmdldEFsbEVsZW1lbnRzPEhUTUxEaXZFbGVtZW50Pihcblx0XHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdFx0KTtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWxldHRlID0gdGhpcy5zdGF0ZU1hbmFnZXJcblx0XHRcdFx0LmdldFN0YXRlKClcblx0XHRcdFx0LnBhbGV0dGVIaXN0b3J5LmF0KC0xKTtcblxuXHRcdFx0aWYgKCFjdXJyZW50UGFsZXR0ZSB8fCAhY3VycmVudFBhbGV0dGUuaXRlbXMpIHtcblx0XHRcdFx0dGhpcy5zZXJ2aWNlcy5sb2coXG5cdFx0XHRcdFx0J05vIHZhbGlkIHBhbGV0dGUgZGF0YSBmb3VuZCBpbiBoaXN0b3J5IScsXG5cdFx0XHRcdFx0J3dhcm4nXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdXNlclByZWZlcmVuY2UgPVxuXHRcdFx0XHRsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29sb3JQcmVmZXJlbmNlJykgfHwgJ2hleCc7XG5cdFx0XHRjb25zdCB2YWxpZENvbG9yU3BhY2UgPSB0aGlzLnV0aWxzLnR5cGVHdWFyZHMuaXNDb2xvclNwYWNlKFxuXHRcdFx0XHR1c2VyUHJlZmVyZW5jZVxuXHRcdFx0KVxuXHRcdFx0XHQ/IHVzZXJQcmVmZXJlbmNlXG5cdFx0XHRcdDogJ2hleCc7XG5cblx0XHRcdHBhbGV0dGVDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcblx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBwYXJzZUludChjb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXHRcdFx0XHRjb25zdCBwYWxldHRlSXRlbSA9IGN1cnJlbnRQYWxldHRlLml0ZW1zLmZpbmQoXG5cdFx0XHRcdFx0aXRlbSA9PiBpdGVtLml0ZW1JRCA9PT0gY29sdW1uSURcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAocGFsZXR0ZUl0ZW0pIHtcblx0XHRcdFx0XHRjb25zdCBjb2xvclZhbHVlID0gdGhpcy5nZXRDb2xvckJ5UHJlZmVyZW5jZShcblx0XHRcdFx0XHRcdHBhbGV0dGVJdGVtLmNzcyxcblx0XHRcdFx0XHRcdHZhbGlkQ29sb3JTcGFjZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29sdW1uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yVmFsdWU7XG5cblx0XHRcdFx0XHRjb25zdCBjb2xvckRpc3BsYXkgPSBjb2x1bW4ucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdGNsYXNzZXMuY29sb3JEaXNwbGF5XG5cdFx0XHRcdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdFx0XHRcdGlmIChjb2xvckRpc3BsYXkpIGNvbG9yRGlzcGxheS52YWx1ZSA9IGNvbG9yVmFsdWU7XG5cblx0XHRcdFx0XHR0aGlzLnNlcnZpY2VzLmxvZyhcblx0XHRcdFx0XHRcdGBVcGRhdGVkIGNvbG9yIGZvciBjb2x1bW4gJHtjb2x1bW5JRH06ICR7Y29sb3JWYWx1ZX1gLFxuXHRcdFx0XHRcdFx0J2RlYnVnJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sICdGYWlsZWQgdG8gc3luYyBjb2x1bW4gY29sb3JzIHdpdGggc3RhdGUnKTtcblx0fVxuXG5cdHByaXZhdGUgY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0XHQud3JpdGVUZXh0KHRleHQudHJpbSgpKVxuXHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5zaG93VG9vbHRpcCh0YXJnZXRFbGVtZW50LCAnQ29waWVkIScpO1xuXHRcdFx0XHRcdHRoaXMuc2VydmljZXMubG9nKGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7dGV4dH1gLCAnZGVidWcnKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdFx0KCkgPT4gdGhpcy5yZW1vdmVUb29sdGlwKHRhcmdldEVsZW1lbnQpLFxuXHRcdFx0XHRcdFx0dGltZXJzLnRvb2x0aXBGYWRlT3V0XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdFx0dGhpcy5zZXJ2aWNlcy5sb2coXG5cdFx0XHRcdFx0XHRgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6ICR7ZXJyfWAsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSk7XG5cdFx0fSwgJ0ZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZCcpO1xuXHR9XG5cblx0Ly8gb2JzZXJ2ZXMgcGFsZXR0ZSBjb250YWluZXIgZm9yIG5ldyBlbGVtZW50c1xuXHRwcml2YXRlIGNyZWF0ZVBhbGV0dGVPYnNlcnZlcigpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbnRhaW5lciA9IHRoaXMudXRpbHMuY29yZS5nZXRFbGVtZW50KFxuXHRcdFx0XHRpZHMuZGl2cy5wYWxldHRlQ29udGFpbmVyXG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFwYWxldHRlQ29udGFpbmVyKSByZXR1cm47XG5cblx0XHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG5cdFx0XHRcdChtdXRhdGlvbnNMaXN0OiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG5cdFx0XHRcdFx0bXV0YXRpb25zTGlzdC5mb3JFYWNoKG11dGF0aW9uID0+IHtcblx0XHRcdFx0XHRcdG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuXHRcdFx0XHRcdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzZXMucGFsZXR0ZUNvbHVtbilcblx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0IXRoaXMuc3RhdGVNYW5hZ2VyLmdldFN0YXRlKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0LnBhbGV0dGVDb250YWluZXJcblx0XHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuc2VydmljZXMubG9nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQnU2tpcHBpbmcgaW5pdGlhbGl6ZUNvbHVtblBvc2l0aW9ucygpIC0gU3RhdGUgaXMgbm90IHJlYWR5IScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCd3YXJuJ1xuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5pbml0aWFsaXplQ29sdW1uUG9zaXRpb25zKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRvYnNlcnZlci5vYnNlcnZlKHBhbGV0dGVDb250YWluZXIsIHtcblx0XHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0XHRzdWJ0cmVlOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5zZXJ2aWNlcy5sb2coJ1BhbGV0dGUgQ29udGFpbmVyIE11dGF0aW9uT2JzZXJ2ZXIgY3JlYXRlZCcpO1xuXHRcdH0sICdGYWlsZWQgdG8gY3JlYXRlIHBhbGV0dGUgb2JzZXJ2ZXInKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0Q29sb3JCeVByZWZlcmVuY2UoXG5cdFx0Y29sb3JEYXRhOiBQYWxldHRlSXRlbVsnY3NzJ10sXG5cdFx0cHJlZmVyZW5jZTogQ29sb3JTcGFjZVxuXHQpOiBzdHJpbmcge1xuXHRcdHJldHVybiAoXG5cdFx0XHRjb2xvckRhdGFbcHJlZmVyZW5jZSBhcyBrZXlvZiBQYWxldHRlSXRlbVsnY3NzJ11dIHx8IGNvbG9yRGF0YS5oZXhcblx0XHQpO1xuXHR9XG5cblx0cHJpdmF0ZSBoYW5kbGVDb2xvcklucHV0Q2hhbmdlKFxuXHRcdGV2ZW50OiBFdmVudCxcblx0XHRjb2x1bW46IEhUTUxFbGVtZW50LFxuXHRcdGNvbHVtbklEOiBzdHJpbmdcblx0KTogdm9pZCB7XG5cdFx0dGhpcy5lcnJvcnMuaGFuZGxlKCgpID0+IHtcblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZS50cmltKCk7XG5cdFx0XHRpZiAoIXRoaXMudXRpbHMudmFsaWRhdGUudXNlckNvbG9ySW5wdXQobmV3Q29sb3IpKSByZXR1cm47XG5cblx0XHRcdGNvbHVtbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBuZXdDb2xvcjtcblxuXHRcdFx0Y29uc3QgY29sb3JJbnB1dCA9IHRoaXMudXRpbHMuY29yZS5nZXRFbGVtZW50KFxuXHRcdFx0XHRgY29sb3ItaW5wdXQtJHtjb2x1bW5JRH1gXG5cdFx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXHRcdFx0aWYgKGNvbG9ySW5wdXQpIGNvbG9ySW5wdXQudmFsdWUgPSBuZXdDb2xvcjtcblxuXHRcdFx0Y29uc3QgbnVtZXJpY0NvbHVtbklEID0gcGFyc2VJbnQoY29sdW1uSUQucmVwbGFjZSgvXFxEL2csICcnKSwgMTApO1xuXHRcdFx0aWYgKCFpc05hTihudW1lcmljQ29sdW1uSUQpKSB7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZVN0YXRlLnVwZGF0ZVBhbGV0dGVJdGVtQ29sb3IoXG5cdFx0XHRcdFx0bnVtZXJpY0NvbHVtbklELFxuXHRcdFx0XHRcdG5ld0NvbG9yXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgJ0ZhaWxlZCB0byBoYW5kbGUgY29sb3IgaW5wdXQgY2hhbmdlJyk7XG5cdH1cblxuXHQvLyBoaWRlcyB0b29sdGlwIGZvciBhIGdpdmVuIGVsZW1lbnRcblx0cHJpdmF0ZSBoaWRlVG9vbHRpcCgpOiB2b2lkIHtcblx0XHR0aGlzLnV0aWxzLmRvbS5oaWRlVG9vbHRpcCgpO1xuXHR9XG5cblx0cHJpdmF0ZSByZW1vdmVUb29sdGlwKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0dGhpcy5lcnJvcnMuaGFuZGxlKCgpID0+IHtcblx0XHRcdGNvbnN0IHRvb2x0aXBJZCA9IGVsZW1lbnQuZGF0YXNldC50b29sdGlwSWQ7XG5cdFx0XHRpZiAoIXRvb2x0aXBJZCkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRcdGlmICh0b29sdGlwKSB0b29sdGlwLnJlbW92ZSgpO1xuXG5cdFx0XHRkZWxldGUgZWxlbWVudC5kYXRhc2V0LnRvb2x0aXBJZDtcblx0XHR9LCAnRmFpbGVkIHRvIHJlbW92ZSB0b29sdGlwJyk7XG5cdH1cblxuXHRwcml2YXRlIHNob3dUb29sdGlwKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0dGhpcy5yZW1vdmVUb29sdGlwKGVsZW1lbnQpO1xuXG5cdFx0XHRjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHR0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAnKTtcblx0XHRcdHRvb2x0aXAudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcblxuXHRcdFx0Y29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHR0b29sdGlwLnN0eWxlLmxlZnQgPSBgJHtyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWH1weGA7XG5cdFx0XHR0b29sdGlwLnN0eWxlLnRvcCA9IGAke3JlY3QudG9wICsgd2luZG93LnNjcm9sbFkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIDV9cHhgO1xuXG5cdFx0XHRlbGVtZW50LmRhdGFzZXQudG9vbHRpcElkID0gdG9vbHRpcC5pZDtcblx0XHR9LCAnRmFpbGVkIHRvIHNob3cgdG9vbHRpcCcpO1xuXHR9XG5cblx0Ly8gaGFuZGxlcyByZXNpemluZyBvZiBwYWxldHRlIGNvbHVtbnNcblx0cHJpdmF0ZSBzdGFydFJlc2l6ZShldmVudDogTW91c2VFdmVudCwgY29sdW1uOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdHRoaXMuZXJyb3JzLmhhbmRsZSgoKSA9PiB7XG5cdFx0XHRpZiAoIWNvbHVtbiB8fCBjb2x1bW4uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzZXMubG9ja2VkKSkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBzdGFydFggPSBldmVudC5jbGllbnRYO1xuXHRcdFx0Y29uc3Qgc3RhcnRXaWR0aCA9IGNvbHVtbi5vZmZzZXRXaWR0aDtcblxuXHRcdFx0Y29uc3Qgb25Nb3VzZU1vdmUgPSAobW92ZUV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRpZmYgPSBtb3ZlRXZlbnQuY2xpZW50WCAtIHN0YXJ0WDtcblx0XHRcdFx0Y29uc3QgbmV3U2l6ZSA9IHN0YXJ0V2lkdGggKyBkaWZmO1xuXG5cdFx0XHRcdGNvbnN0IGNvbHVtbklEID0gcGFyc2VJbnQoY29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkhKTtcblx0XHRcdFx0dGhpcy5wYWxldHRlTWFuYWdlci5oYW5kbGVDb2x1bW5SZXNpemUoY29sdW1uSUQsIG5ld1NpemUpO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3Qgb25Nb3VzZVVwID0gKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cblx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBwYXJzZUludChjb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXHRcdFx0XHRjb25zdCB1cGRhdGVkQ29sdW1ucyA9IHRoaXMuc3RhdGVNYW5hZ2VyXG5cdFx0XHRcdFx0LmdldFN0YXRlKClcblx0XHRcdFx0XHQucGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zLm1hcChjb2wgPT5cblx0XHRcdFx0XHRcdGNvbC5pZCA9PT0gY29sdW1uSURcblx0XHRcdFx0XHRcdFx0PyB7IC4uLmNvbCwgc2l6ZTogY29sdW1uLm9mZnNldFdpZHRoIH1cblx0XHRcdFx0XHRcdFx0OiBjb2xcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKFxuXHRcdFx0XHRcdHVwZGF0ZWRDb2x1bW5zLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdDRcblx0XHRcdFx0KTtcblx0XHRcdH07XG5cblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cdFx0fSwgJ0ZhaWxlZCB0byBzdGFydCBjb2x1bW4gcmVzaXplJyk7XG5cdH1cblxuXHRwcml2YXRlIHRvZ2dsZUNvbG9yTW9kYWwoYnV0dG9uOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdHRoaXMuZXJyb3JzLmhhbmRsZSgoKSA9PiB7XG5cdFx0XHRjb25zdCBtb2RhbElEID0gYnV0dG9uLmRhdGFzZXQubW9kYWxJRDtcblx0XHRcdGlmICghbW9kYWxJRCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgbW9kYWwgPSB0aGlzLnV0aWxzLmNvcmUuZ2V0RWxlbWVudDxIVE1MRGl2RWxlbWVudD4obW9kYWxJRCk7XG5cdFx0XHRtb2RhbD8uY2xhc3NMaXN0LnRvZ2dsZShjbGFzc2VzLmhpZGRlbik7XG5cdFx0fSwgJ0ZhaWxlZCB0byB0b2dnbGUgY29sb3IgbW9kYWwnKTtcblx0fVxuXG5cdC8vIHRvZ2dsZXMgbG9jayBzdGF0ZSBvZiBhIHBhbGV0dGUgY29sdW1uXG5cdHByaXZhdGUgdG9nZ2xlTG9jayhidXR0b246IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0dGhpcy5lcnJvcnMuaGFuZGxlKCgpID0+IHtcblx0XHRcdGNvbnN0IGNvbHVtbiA9IGJ1dHRvbi5jbG9zZXN0KFxuXHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdCkgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdFx0aWYgKCFjb2x1bW4pIHJldHVybjtcblxuXHRcdFx0Y29uc3QgY29sdW1uSUQgPSBwYXJzZUludChjb2x1bW4uaWQuc3BsaXQoJy0nKS5wb3AoKSEpO1xuXHRcdFx0dGhpcy5wYWxldHRlTWFuYWdlci5oYW5kbGVDb2x1bW5Mb2NrKGNvbHVtbklEKTtcblx0XHR9LCAnRmFpbGVkIHRvIHRvZ2dsZSBsb2NrIHN0YXRlJyk7XG5cdH1cbn1cbiJdfQ==