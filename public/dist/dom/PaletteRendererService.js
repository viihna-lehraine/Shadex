import { PaletteHistoryManager } from '../palette/PaletteHistoryManager.js';
import '../config/partials/defaults.js';
import { domIndex, domConfig } from '../config/partials/dom.js';
import '../config/partials/regex.js';

const caller = 'PaletteRendererService';
class PaletteRendererService {
    static #instance = null;
    #common;
    #domStore;
    #errors;
    #log;
    #helpers;
    #paletteHistoryManager;
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
            this.#paletteHistoryManager = PaletteHistoryManager.getInstance(common.helpers, common.services);
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
        const allColumns = Array.from(container.querySelectorAll(`.${domIndex.classes.paletteColumn}`));
        // ensure exactly 5 columns exist
        if (allColumns.length !== 5) {
            this.#log.error(`Expected 5 columns, but found ${allColumns.length}`, `${caller}.renderColumns`);
            return;
        }
        const latestPalette = this.#paletteHistoryManager.getCurrentPalette();
        if (!latestPalette) {
            this.#log.warn('No saved palettes in history. Cannot render column colors.', `${caller}.renderColumns`);
            return;
        }
        // map color values to column IDs
        const colorMap = new Map();
        latestPalette.items.forEach(item => {
            colorMap.set(item.itemID, item.css.hex);
        });
        // render each column with the correct color
        allColumns.forEach((columnElement, index) => {
            const columnData = columns[index];
            if (!columnData) {
                this.#log.warn(`No column data found for index ${index}`, `${caller}.renderColumns`);
                return;
            }
            const typedColumnElement = columnElement;
            typedColumnElement.style.width = `${columnData.size}%`;
            // retrieve color from palette history
            const columnColor = colorMap.get(columnData.id) ?? '';
            typedColumnElement.style.backgroundColor = columnColor;
            typedColumnElement.classList.toggle('locked', columnData.isLocked);
        });
        this.#log.debug(`Rendered ${columns.length} columns with colors.`, `${caller}.renderColumns`);
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
            const paletteHistory = this.#paletteHistoryManager.getCurrentPalette();
            const oldPalette = (Array.isArray(paletteHistory) ? paletteHistory : []).at(-1);
            if (oldPalette)
                this.#paletteHistoryManager.addPalette(oldPalette);
            // clear the existing palette
            paletteContainer.innerHTML = '';
            // generate a new palette
            const newPalette = this.#generatePalette(options, this.#common, this.#generateHues, this.#generatePaletteFns);
            // ensure valid palette before storing
            if (!this.#helpers.typeGuards.isPalette(newPalette)) {
                throw new Error('Generated palette is invalid.');
            }
            this.#paletteHistoryManager.addPalette(newPalette);
            await this.#stateManager.saveState();
            const allColumns = paletteContainer.querySelectorAll('.palette-column');
            const columnWidth = 100 / newPalette.items.length;
            newPalette.items.forEach((item, index) => {
                const column = allColumns[index];
                if (!column)
                    return;
                const columnID = index + 1;
                const colorValue = item.css.hex;
                const columnElement = column;
                columnElement.style.backgroundColor = colorValue;
                columnElement.classList.remove('hidden');
                columnElement.style.width = `${columnWidth}%`;
                // update UI elements inside the column
                this.#renderPaletteColumn(columnElement, columnID, colorValue);
            });
            const normalizedColumns = newPalette.items.map((item, index) => ({
                id: index + 1,
                isLocked: false,
                position: index + 1,
                size: 100 / 5, // each column gets 20%
                color: item.colors,
                css: item.css
            }));
            // Update DOM elements
            allColumns.forEach((columnElement, index) => {
                const columnData = normalizedColumns[index];
                const typedColumnElement = columnElement;
                typedColumnElement.style.width = `${columnData.size}%`;
                typedColumnElement.style.backgroundColor =
                    columnData.color?.hex.hex ?? '';
            });
            // Update state
            await this.#stateManager.batchUpdate(state => ({
                paletteContainer: {
                    ...state.paletteContainer,
                    columns: normalizedColumns
                }
            }));
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
            // get latest saved palette
            const latestPalette = this.#paletteHistoryManager.getCurrentPalette();
            if (!latestPalette) {
                this.#log.warn('No saved palettes in history. Cannot render.', `${caller}.renderPaletteFromState`);
                return;
            }
            const columnCount = latestPalette.metadata.columnCount;
            const columnWidth = 100 / columnCount;
            const allColumns = paletteContainer.querySelectorAll('.palette-column');
            latestPalette.items.forEach((item, index) => {
                const column = allColumns[index];
                if (!column)
                    return;
                const columnID = item.itemID;
                const colorValue = item.css.hex;
                const columnElement = column;
                columnElement.style.backgroundColor = colorValue;
                columnElement.classList.remove('hidden');
                columnElement.style.width = `${columnWidth}%`;
                // update column UI elements
                this.#renderPaletteColumn(columnElement, columnID, colorValue);
            });
            // hide any extra columns
            const normalizedColumns = latestPalette.items.map((item, index) => ({
                id: index + 1,
                isLocked: false,
                position: index + 1,
                size: 100 / 5, // Ensure each column is evenly sized
                color: item.colors,
                css: item.css
            }));
            // update DOM elements
            allColumns.forEach((columnElement, index) => {
                const columnData = normalizedColumns[index];
                const typedColumnElement = columnElement;
                typedColumnElement.style.width = `${columnData.size}%`;
                typedColumnElement.style.backgroundColor =
                    columnData.color?.hex.hex ?? '';
            });
            // Update state
            await this.#stateManager.batchUpdate(state => ({
                paletteContainer: {
                    ...state.paletteContainer,
                    columns: normalizedColumns
                }
            }));
            await this.#stateManager.saveState();
            this.#log.debug(`Restored ${columnCount} columns from saved state.`, `${caller}.renderPaletteFromState`);
        }, `[${caller}]: Failed to render palette from state.`);
    }
    async updatePaletteColumnSize(columnID, newSize) {
        return this.#errors.handleAsync(async () => {
            const paletteContainer = this.#stateManager.get('paletteContainer');
            const columns = paletteContainer.columns;
            const columnIndex = columns.findIndex(col => col.id === columnID);
            if (columnIndex === -1) {
                this.#log.warn(`Column with ID ${columnID} not found.`, `${caller}.updatePaletteColumnSize`);
                return;
            }
            // adjust size with min/max boundaries
            const adjustedSize = Math.max(domConfig.minColumnSize, Math.min(newSize, domConfig.maxColumnSize));
            const updatedColumns = columns.map(col => col.id === columnID ? { ...col, size: newSize } : col);
            // Normalize sizes to ensure 100% total
            const totalSize = updatedColumns.reduce((sum, col) => sum + col.size, 0);
            const normalizedColumns = updatedColumns.map(col => ({
                ...col,
                size: col.size * (100 / totalSize)
            }));
            await this.#stateManager.batchUpdate(state => ({
                paletteContainer: {
                    ...state.paletteContainer,
                    columns: normalizedColumns
                }
            }));
            this.#log.debug(`Palette column size updated (ID: ${columnID}, New Size: ${adjustedSize}).`, `${caller}.updatePaletteColumnSize`);
        }, `[${caller}]: Failed to update palette column size.`);
    }
    async updatePaletteItemColor(columnID, newColor, state) {
        return this.#errors.handleAsync(async () => {
            const currentState = this.#helpers.data.deepClone(state);
            const latestPalette = this.#paletteHistoryManager.getCurrentPalette();
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
            await this.#stateManager.batchUpdate(state => ({
                paletteContainer: {
                    ...state.paletteContainer,
                    columns: updatedColumns
                }
            }));
        }, `[${caller}]: Failed to update palette item color.`, { context: { columnID, newColor } });
    }
    async #renderPaletteColumn(column, columnID, colorValue) {
        return this.#errors.handleAsync(async () => {
            const preferences = this.#stateManager.get('preferences');
            const colorSpace = preferences.colorSpace;
            if (!this.#utils.validate.colorInput(colorValue)) {
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
