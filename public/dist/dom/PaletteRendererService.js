import '../config/partials/defaults.js';
import { domConfig } from '../config/partials/dom.js';
import '../config/partials/regex.js';

// File: dom/PaletteRendererService.ts
const caller = 'PaletteRendererService';
class PaletteRendererService {
    static #instance = null;
    #common;
    #domStore;
    #errors;
    #log;
    #helpers;
    #stateManager;
    #utils;
    #generatePalette;
    #generatePaletteFns;
    #generateHues;
    constructor(common, domStore, generateHues, generatePaletteFnGroup, generatePalette, stateManager) {
        try {
            common.services.log.info(`Constructing PaletteRendererService instance.`, `${caller}.constructor`);
            this.#common = common;
            this.#domStore = domStore;
            this.#errors = common.services.errors;
            this.#helpers = common.helpers;
            this.#log = common.services.log;
            this.#utils = common.utils;
            this.#generatePalette = generatePalette;
            this.#generatePaletteFns = generatePaletteFnGroup;
            this.#generateHues = generateHues;
            this.#stateManager = stateManager;
        }
        catch (error) {
            throw new Error(`[${caller}.constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(common, domStore, generateHues, generatePaletteFnGroup, generatePalette, stateManager) {
        return common.services.errors.handleSync(() => {
            if (!PaletteRendererService.#instance) {
                common.services.log.info(`Creating PaletteRendererService instance.`, `${caller}.getInstance`);
                return new PaletteRendererService(common, domStore, generateHues, generatePaletteFnGroup, generatePalette, stateManager);
            }
            return PaletteRendererService.#instance;
        }, `[${caller}.getInstance]: Failed to create PaletteRendererService instance.`);
    }
    renderColumns(columns) {
        const container = this.#domStore.getElement('divs', 'paletteContainer');
        if (!container) {
            this.#log.warn('Palette container not found.', `${caller}.renderColumns`);
            return;
        }
        container.innerHTML = '';
        columns.forEach(column => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'palette-column';
            columnDiv.style.width = `${column.size}%`;
            container.appendChild(columnDiv);
        });
        this.#log.debug(`Rendered ${columns.length} columns.c`, `${caller}.renderColumns`);
    }
    async renderNewPalette() {
        return await this.#errors.handleAsync(async () => {
            const paletteContainer = this.#domStore.getElement('divs', 'paletteContainer');
            if (!paletteContainer) {
                throw new Error('Palette container not found');
            }
            // retrieve palette generation options
            const options = this.#utils.palette.getPaletteOptionsFromUI();
            this.#log.debug(`Palette options: ${JSON.stringify(options)}`, `${caller}.renderNewPalette`);
            // store the old palette in history
            const oldPalette = (await this.#stateManager.getState()).paletteHistory.at(-1);
            if (oldPalette)
                this.#stateManager.addPaletteToHistory(oldPalette);
            // clear the existing palette
            paletteContainer.innerHTML = '';
            // generate a new palette
            const newPalette = this.#generatePalette(options, this.#common, this.#generateHues, this.#generatePaletteFns);
            // ensure valid palette before storing
            if (!this.#helpers.typeguards.isPalette(newPalette)) {
                throw new Error('Generated palette is invalid.');
            }
            this.#stateManager.addPaletteToHistory(newPalette);
            await this.#stateManager.saveState();
            // create and append palette columns
            const columnWidth = 100 / newPalette.items.length;
            const validColorSpace = ['hex', 'hsl', 'rgb'].includes((await this.#stateManager.getState()).preferences.colorSpace)
                ? (await this.#stateManager.getState()).preferences.colorSpace
                : 'hex';
            const columns = newPalette.items.map((item, index) => {
                const columnID = index + 1;
                const colorValue = item.css[validColorSpace] || item.css.hex;
                const column = document.createElement('div');
                column.id = `palette-column-${columnID}`;
                column.className = 'palette-column';
                column.setAttribute('draggable', 'true');
                column.style.backgroundColor = colorValue;
                // add UI elements inside the column
                this.#renderPaletteColumn(column, columnID, colorValue);
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
            this.#stateManager.updatePaletteColumns(columns.map(col => col.state), true);
        }, `[${caller}]: Failed to render a new palette.`);
    }
    async renderPaletteFromState() {
        return await this.#errors.handleAsync(async () => {
            await this.#stateManager.ensureStateReady();
            const paletteContainer = this.#domStore.getElement('divs', 'paletteContainer');
            if (!paletteContainer) {
                this.#log.warn('Palette container not found', `${caller}.renderPaletteFromState`);
                return;
            }
            // clear existing content
            paletteContainer.innerHTML = '';
            // get the most recent palette from history
            const currentState = await this.#stateManager.getState();
            const latestPalette = currentState.paletteHistory.at(-1);
            if (!latestPalette) {
                this.#log.warn('No saved palettes in history. Cannot render.', `${caller}.renderPaletteFromState`);
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
                const colorValue = item.css[validColorSpace] || item.css.hex;
                const column = document.createElement('div');
                column.id = `palette-column-${columnID}`;
                column.className = 'palette-column';
                column.setAttribute('draggable', 'true');
                column.style.backgroundColor = colorValue;
                // add UI elements inside the column
                this.#renderPaletteColumn(column, columnID, colorValue);
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
            // append new columns to the palette container
            columns.forEach(({ column }) => paletteContainer.appendChild(column));
            // update state with new columns
            this.#stateManager.updatePaletteColumns(columns.map(col => col.state), true);
            this.#stateManager.updatePaletteHistory([latestPalette], true);
            await this.#stateManager.saveState();
            this.#log.debug(`Restored ${columns.length} columns from saved state.`, `${caller}.renderPaletteFromState`);
        }, `[${caller}]: Failed to render palette from state.`);
    }
    async updatePaletteColumnSize(columnID, newSize) {
        return this.#errors.handleAsync(async () => {
            const currentState = await this.#stateManager.getState();
            const columns = currentState.paletteContainer.columns;
            const columnIndex = columns.findIndex(col => col.id === columnID);
            if (columnIndex === -1) {
                this.#log.warn(`Column with ID ${columnID} not found.`, `${caller}.updatePaletteColumnSize`);
                return;
            }
            // adjust size with min/max boundaries
            const adjustedSize = Math.max(domConfig.minColumnSize, Math.min(newSize, domConfig.maxColumnSize));
            const sizeDifference = adjustedSize - columns[columnIndex].size;
            // create updated column sizes
            const updatedColumns = columns.map((col, index) => {
                if (index === columnIndex) {
                    return { ...col, size: adjustedSize };
                }
                // distribute size difference among unlocked columns
                if (!col.isLocked) {
                    return {
                        ...col,
                        size: col.size - sizeDifference / (columns.length - 1)
                    };
                }
                // locked columns remain unchanged
                return col;
            });
            // normalize sizes to ensure total is exactly 100%
            const totalSize = updatedColumns.reduce((sum, col) => sum + col.size, 0);
            const normalizedColumns = updatedColumns.map(col => ({
                ...col,
                size: col.size * (100 / totalSize)
            }));
            // update state using Partial<State>
            await this.#stateManager.batchUpdate({
                paletteContainer: {
                    ...currentState.paletteContainer,
                    columns: normalizedColumns
                }
            });
            this.#log.debug(`Palette column size updated (ID: ${columnID}, New Size: ${adjustedSize}).`, `${caller}.updatePaletteColumnSize`);
        }, `[${caller}]: Failed to update palette column size.`);
    }
    async updatePaletteItemColor(columnID, newColor, state) {
        return this.#errors.handleAsync(async () => {
            const currentState = this.#helpers.data.clone(state);
            const latestPalette = currentState.paletteHistory[0];
            if (!latestPalette)
                return;
            // find the PaletteItem corresponding to this column
            const updatedItems = latestPalette.items.map(item => {
                if (item.itemID !== columnID)
                    return item;
                const parsedNewColor = this.#utils.color.formatCSSAsColor(newColor);
                if (!parsedNewColor)
                    throw new Error('Invalid color value');
                // ensure color is in HSL format
                const hslColor = parsedNewColor.format === 'hsl'
                    ? parsedNewColor
                    : this.#utils.color.convertToHSL(parsedNewColor);
                // generate all color representations (ensuring correct branded types)
                const allColors = this.#utils.palette.generateAllColorValues(hslColor);
                // ensure CSS representations match expected format
                const structuredCSS = {
                    cmyk: this.#utils.color.formatColorAsCSS(allColors.cmyk),
                    hex: this.#utils.color.formatColorAsCSS(allColors.hex),
                    hsl: this.#utils.color.formatColorAsCSS(allColors.hsl),
                    hsv: this.#utils.color.formatColorAsCSS(allColors.hsv),
                    lab: this.#utils.color.formatColorAsCSS(allColors.lab),
                    rgb: this.#utils.color.formatColorAsCSS(allColors.rgb),
                    xyz: this.#utils.color.formatColorAsCSS(allColors.xyz)
                };
                return {
                    ...item,
                    colors: allColors,
                    css: structuredCSS
                };
            });
            // ensure column state is updated
            const updatedColumns = updatedItems.map((item, index) => ({
                id: item.itemID,
                isLocked: currentState.paletteContainer.columns[index].isLocked,
                position: index + 1,
                size: currentState.paletteContainer.columns[index].size
            }));
            // update state history with type assertions
            this.#stateManager.updatePaletteColumns(updatedColumns, true);
            this.#stateManager.updatePaletteHistory([
                {
                    ...latestPalette,
                    items: updatedItems
                },
                ...currentState.paletteHistory.slice(1)
            ], true);
        }, `[${caller}]: Failed to update palette item color.`, { context: { columnID, newColor } });
    }
    async #renderPaletteColumn(column, columnID, colorValue) {
        return this.#errors.handleAsync(async () => {
            const currentState = await this.#stateManager.getState();
            const colorSpace = currentState.preferences.colorSpace;
            if (!this.#utils.validate.userColorInput(colorValue)) {
                this.#log.warn(`Invalid color value: ${colorValue}. Unable to render column UI.`, `${caller}.#createColumnInUI`);
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
        }, `[${caller}]: Failed to create column UI elements.`, { context: { columnID, colorValue } });
    }
}

export { PaletteRendererService };
//# sourceMappingURL=PaletteRendererService.js.map
