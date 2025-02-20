import { StorageManager } from '../storage/StorageManager.js';
import { config, regex, domIndex, domConfig } from '../config/index.js';

// File: palette/PaletteManager.js
const ids = domIndex.ids;
class PaletteManager {
    stateManager;
    generateHues;
    generatePaletteFns;
    generatePalette;
    common;
    utils;
    log;
    errors;
    storage;
    constructor(stateManager, common, generateHues, generatePaletteFns, generatePalette) {
        this.stateManager = stateManager;
        console.log(`[PaletteManager.constructor] Entering constructor...`);
        console.log('[PaletteManager.constructor] stateManager', stateManager);
        console.log(`[PaletteManager.constructor] Common Fn Group`, common);
        console.log(`[PaletteManager.constructor] Generate Hues Fn Group`, generateHues);
        console.log(`[PaletteManager.constructor] Generate Palette Fn Group`, generatePaletteFns);
        console.log(`[PaletteManager.constructor] Generate Palette Fn`, generatePalette);
        this.log = common.services.log;
        this.generateHues = generateHues;
        this.generatePaletteFns = generatePaletteFns;
        this.generatePalette = generatePalette;
        this.common = common;
        this.errors = common.services.errors;
        this.utils = common.utils;
        this.storage = new StorageManager(this.common.services);
        this.log('Completing initialization', 'debug');
    }
    extractPaletteFromDOM() {
        return this.errors.handle(() => {
            this.log('Extracting palette from DOM', 'debug');
            const paletteColumns = document.querySelectorAll('.palette-column');
            if (paletteColumns.length === 0) {
                this.log('No palette columns found in DOM.', 'debug');
                return config.defaults.palette;
            }
            const extractedItems = Array.from(paletteColumns).map((col, index) => {
                const input = col.querySelector('.color-display');
                const color = input ? input.value.trim() : '#000000';
                this.log(`Extracted color from column ${index + 1}: ${color}`, 'debug');
                if (!regex.dom.hex.test(color)) {
                    this.log(`Invalid color format for column ${index + 1}: ${color}`, 'warn');
                    const fallbackColor = this.utils.brand.asHex({
                        value: { hex: '#FF00FF' },
                        format: 'hex'
                    });
                    const fallbackHSL = this.utils.color.convertToHSL(fallbackColor);
                    return this.utils.palette.createPaletteItem(fallbackHSL, index + 1);
                }
                const parsedColor = this.utils.color.convertCSSToColor(color);
                if (!parsedColor)
                    throw new Error(`Invalid color: ${color}`);
                const hslColor = parsedColor.format === 'hsl'
                    ? parsedColor
                    : this.utils.color.convertToHSL(parsedColor);
                const allColors = this.utils.palette.generateAllColorValues(hslColor);
                return this.utils.palette.createPaletteItem(allColors.hsl, index + 1);
            });
            const options = this.utils.palette.getPaletteOptionsFromUI();
            this.log(`Extracted palette options: ${JSON.stringify(options)}`, 'debug');
            return {
                id: `${options.paletteType}_${crypto.randomUUID()}`,
                metadata: {
                    name: 'EXTRACTED',
                    columnCount: extractedItems.length,
                    flags: {
                        limitDark: options.limitDark,
                        limitGray: options.limitGray,
                        limitLight: options.limitLight
                    },
                    timestamp: this.utils.app.getFormattedTimestamp(),
                    type: options.paletteType
                },
                items: extractedItems
            };
        }, 'Failed to extract palette from DOM');
    }
    handleColumnLock(columnID) {
        const currentState = this.stateManager.getState();
        const columns = currentState.paletteContainer.columns;
        // find column by ID
        const columnIndex = columns.findIndex(col => col.id === columnID);
        if (columnIndex === -1) {
            this.log(`Column with ID ${columnID} not found.`, 'warn');
            return;
        }
        // toggle lock state
        columns[columnIndex].isLocked = !columns[columnIndex].isLocked;
        this.stateManager.updatePaletteColumns(columns, true, 2);
    }
    handleColumnResize(columnID, newSize) {
        this.errors.handle(() => {
            const currentState = this.stateManager.getState();
            const columns = currentState.paletteContainer.columns;
            const columnIndex = columns.findIndex(col => col.id === columnID);
            if (columnIndex === -1) {
                this.log(`Column with ID ${columnID} not found.`, 'warn');
                return;
            }
            const minSize = domConfig.minColumnSize;
            const maxSize = domConfig.maxColumnSize;
            const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));
            const sizeDiff = adjustedSize - columns[columnIndex].size;
            columns[columnIndex].size = adjustedSize;
            const unlockedColumns = columns.filter((_, i) => i !== columnIndex && !columns[i].isLocked);
            const distributeAmount = sizeDiff / unlockedColumns.length;
            unlockedColumns.forEach(col => {
                col.size = Math.max(minSize, Math.min(col.size - distributeAmount, maxSize));
            });
            // normalize to 100%
            const totalSize = columns.reduce((sum, col) => sum + col.size, 0);
            const correctionFactor = 100 / totalSize;
            columns.forEach(col => (col.size *= correctionFactor));
            this.stateManager.updatePaletteColumns(columns, true, 2);
        }, `Failed to resize column ${columnID}`);
    }
    async loadPalette() {
        await this.errors.handleAsync(async () => {
            await this.stateManager.ensureStateReady();
            const storedPalette = await this.storage.getItem('palette');
            if (storedPalette &&
                this.utils.typeGuards.isPalette(storedPalette)) {
                this.stateManager.addPaletteToHistory(storedPalette);
                this.log(`Stored palette added to history`, 'debug');
            }
            const randomOptions = this.utils.palette.getRandomizedPaleteOptions();
            this.log(`Generated randomized palette options: ${JSON.stringify(randomOptions)}`, 'debug');
            const newPalette = this.generatePalette(randomOptions, this.common, this.generateHues, this.generatePaletteFns);
            this.stateManager.addPaletteToHistory(newPalette);
            this.log(`New palette added to history`, 'debug');
            await this.storage.setItem('palette', newPalette);
            this.log(`New palette stored`, 'debug');
            this.renderPaletteFromState();
            this.log(`Palette rendered from state`, 'debug');
        }, 'Failed to load palette');
    }
    async renderNewPalette() {
        await this.errors.handleAsync(async () => {
            const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
            if (!paletteContainer) {
                throw new Error('Palette container not found');
            }
            // retrieve palette generation options
            const options = this.utils.palette.getPaletteOptionsFromUI();
            this.log(`Palette options: ${JSON.stringify(options)}`, 'debug');
            // store the old palette in history
            const oldPalette = this.stateManager
                .getState()
                .paletteHistory.at(-1);
            if (oldPalette)
                this.stateManager.addPaletteToHistory(oldPalette);
            // clear the existing palette
            paletteContainer.innerHTML = '';
            // generate a new palette
            const newPalette = this.generatePalette(options, this.common, this.generateHues, this.generatePaletteFns);
            // ensure valid palette before storing
            if (!this.utils.typeGuards.isPalette(newPalette)) {
                throw new Error('Generated palette is invalid.');
            }
            this.stateManager.addPaletteToHistory(newPalette);
            await this.storage.setItem('palette', newPalette);
            // create and append palette columns
            const columnWidth = 100 / newPalette.items.length;
            const validColorSpace = ['hex', 'hsl', 'rgb'].includes(this.stateManager.getState().preferences.colorSpace)
                ? this.stateManager.getState().preferences.colorSpace
                : 'hex';
            const columns = newPalette.items.map((item, index) => {
                const columnID = index + 1;
                const colorValue = item.css[validColorSpace] ||
                    item.css.hex;
                const column = document.createElement('div');
                column.id = `palette-column-${columnID}`;
                column.className = 'palette-column';
                column.setAttribute('draggable', 'true');
                column.style.backgroundColor = colorValue;
                // add UI elements inside the column
                this.createColumnInUI(column, columnID, colorValue);
                return {
                    column,
                    state: {
                        id: columnID,
                        isLocked: false,
                        position: columnID,
                        size: columnWidth
                    }
                };
            });
            // append new columns to the palette container
            columns.forEach(({ column }) => paletteContainer.appendChild(column));
            // update state with new columns
            this.stateManager.updatePaletteColumns(columns.map(col => col.state), true, 3);
        }, 'Failed to render a new palette');
    }
    async renderPaletteFromState() {
        await this.errors.handleAsync(async () => {
            await this.stateManager.ensureStateReady();
            const paletteContainer = this.utils.core.getElement(ids.divs.paletteContainer);
            if (!paletteContainer) {
                this.log('Palette container not found', 'error');
                return;
            }
            // clear existing content
            paletteContainer.innerHTML = '';
            // get the most recent palette from history
            const currentState = this.stateManager.getState();
            const latestPalette = currentState.paletteHistory.at(-1);
            if (!latestPalette) {
                this.log('No saved palettes in history. Cannot render.', 'debug');
                return;
            }
            // retrieve user's preferred color format
            const colorSpace = currentState.preferences?.colorSpace || 'hex';
            const validColorSpace = ['hex', 'hsl', 'rgb'].includes(colorSpace)
                ? colorSpace
                : 'hex';
            const columnCount = latestPalette.metadata.columnCount;
            const columnWidth = 100 / columnCount;
            const columns = latestPalette.items.map((item, index) => {
                const columnID = item.itemID;
                const colorValue = item.css[validColorSpace] ||
                    item.css.hex;
                const column = document.createElement('div');
                column.id = `palette-column-${columnID}`;
                column.className = 'palette-column';
                column.setAttribute('draggable', 'true');
                column.style.backgroundColor = colorValue;
                // add UI elements inside the column
                this.createColumnInUI(column, columnID, colorValue);
                return {
                    column,
                    state: {
                        id: columnID,
                        isLocked: false,
                        position: index + 1,
                        size: columnWidth
                    }
                };
            });
            // Append new columns to the palette container
            columns.forEach(({ column }) => paletteContainer.appendChild(column));
            // Update state with new columns
            this.stateManager.updatePaletteColumns(columns.map(col => col.state), true, 3);
            this.stateManager.updatePaletteHistory([latestPalette]);
            await this.storage.setItem('palette', latestPalette);
            this.log(`Restored ${columns.length} columns from saved state.`, 'debug');
        }, 'Failed to render palette from state');
    }
    swapColumns(draggedID, targetID) {
        this.errors.handle(() => {
            const currentState = this.stateManager.getState();
            const columns = [...currentState.paletteContainer.columns];
            const draggedIndex = columns.findIndex(col => col.id === draggedID);
            const targetIndex = columns.findIndex(col => col.id === targetID);
            if (draggedIndex === -1 || targetIndex === -1) {
                this.log(`Failed to swap columns: Column ID ${draggedID} or ${targetID} not found.`, 'warn');
                return;
            }
            // swap positions in the array
            [columns[draggedIndex].position, columns[targetIndex].position] = [
                columns[targetIndex].position,
                columns[draggedIndex].position
            ];
            // sort the array based on the new positions
            columns.sort((a, b) => a.position - b.position);
            // update state with new column order
            this.stateManager.updatePaletteColumns(columns, true, 3);
            this.log(`Swapped columns ${draggedID} and ${targetID}. New order: ${columns.map(col => col.id).join(', ')}`, 'debug');
        }, `Failed to swap columns ${draggedID} and ${targetID}`);
    }
    createColumnInUI(column, columnID, colorValue) {
        this.errors.handle(() => {
            const currentState = this.stateManager.getState();
            const colorSpace = currentState.preferences.colorSpace;
            if (!this.utils.validate.userColorInput(colorValue)) {
                this.log(`Invalid color value: ${colorValue}. Unable to render column UI.`);
                return;
            }
            const validColorSpace = ['hex', 'hsl', 'rgb'].includes(colorSpace)
                ? colorSpace
                : 'hex';
            column.style.backgroundColor = colorValue;
            // create color display input
            const colorDisplay = document.createElement('input');
            colorDisplay.id = `color-display-${columnID}`;
            colorDisplay.className = 'color-display';
            colorDisplay.type = 'text';
            colorDisplay.value = colorValue;
            colorDisplay.setAttribute('data-format', validColorSpace);
            // create color input button
            const colorInputBtn = document.createElement('button');
            colorInputBtn.id = `color-input-btn-${columnID}`;
            colorInputBtn.className = 'color-input-btn';
            colorInputBtn.textContent = 'Change Color';
            // create lock button
            const lockBtn = document.createElement('button');
            lockBtn.id = `lock-btn-${columnID}`;
            lockBtn.className = 'lock-btn';
            lockBtn.textContent = 'Lock 🔒';
            // create drag handle button
            const dragHandle = document.createElement('button');
            dragHandle.id = `drag-handle-${columnID}`;
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = 'Move ☰';
            // create resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.id = `resize-handle-${columnID}`;
            resizeHandle.className = 'resize-handle';
            // create color input modal
            const colorInputModal = document.createElement('div');
            colorInputModal.id = `color-input-modal-${columnID}`;
            colorInputModal.className = 'color-input-modal hidden';
            // create color input inside the modal
            const colorInput = document.createElement('input');
            colorInput.id = `color-input-${columnID}`;
            colorInput.className = 'color-input';
            colorInput.type = 'color';
            colorInput.value = colorValue;
            // append elements to their parent
            colorInputModal.appendChild(colorInput);
            column.appendChild(colorDisplay);
            column.appendChild(colorInputBtn);
            column.appendChild(lockBtn);
            column.appendChild(dragHandle);
            column.appendChild(resizeHandle);
            column.appendChild(colorInputModal);
        }, 'Failed to create column UI elements', { columnID, colorValue });
    }
}

export { PaletteManager };
//# sourceMappingURL=PaletteManager.js.map
