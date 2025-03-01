import '../config/partials/defaults.js';
import { domIndex, domConfig } from '../config/partials/dom.js';
import '../config/partials/regex.js';

// File: state/PaletteState.ts
const caller = 'PaletteState';
class PaletteStateService {
    static #instance = null;
    #errors;
    #getElement;
    #getAllElements;
    #helpers;
    #log;
    #validateColorInput;
    #stateManager;
    #utils;
    constructor(helpers, services, stateManager, utils) {
        try {
            services.log.info(`Constructing PaletteState instance`, `${caller} constructor`);
            this.#errors = services.errors;
            this.#getElement = helpers.dom.getElement;
            this.#getAllElements = helpers.dom.getAllElements;
            this.#helpers = helpers;
            this.#log = services.log;
            this.#stateManager = stateManager;
            this.#validateColorInput = utils.validate.colorInput;
            this.#utils = utils;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, services, stateManager, utils) {
        return services.errors.handleSync(() => {
            if (!PaletteStateService.#instance) {
                services.log.debug(`Creating ${caller} instance`, `${caller}.getInstance`);
                PaletteStateService.#instance = new PaletteStateService(helpers, services, stateManager, utils);
            }
            return PaletteStateService.#instance;
        }, `[${caller}.getInstance]: Failed to create PaletteState instance.`);
    }
    async handleColumnLock(columnID) {
        return this.#errors.handleAsync(async () => {
            const paletteContainer = this.#stateManager.get('paletteContainer');
            const updatedColumns = paletteContainer.columns.map(col => col.id === columnID ? { ...col, isLocked: !col.isLocked } : col);
            await this.#stateManager.batchUpdate({
                paletteContainer: {
                    ...paletteContainer,
                    columns: updatedColumns
                }
            });
        }, `[${caller}.handleColumnLock]: Failed to toggle lock for column ${columnID}`);
    }
    async handleColumnResize(columnID, newSize) {
        return this.#errors.handleAsync(async () => {
            const paletteContainer = this.#stateManager.get('paletteContainer');
            const columns = paletteContainer.columns;
            const columnIndex = columns.findIndex(col => col.id === columnID);
            if (columnIndex === -1) {
                this.#log.warn(`Column with ID ${columnID} not found.`, `${caller}.handleColumnResize`);
                return;
            }
            const adjustedSize = Math.max(domConfig.minColumnSize, Math.min(newSize, domConfig.maxColumnSize));
            const sizeDiff = adjustedSize - columns[columnIndex].size;
            // created new columns array with updated columns
            const updatedColumns = columns.map(col => {
                if (col.id === columnID) {
                    return { ...col, size: adjustedSize };
                }
                return col;
            });
            // distribute size difference among locked columns
            const unlockedColumns = updatedColumns.filter(col => col.id !== columnID && !col.isLocked);
            const distributeAmount = unlockedColumns.length > 0 ? sizeDiff / unlockedColumns.length : 0;
            const resizedColumns = updatedColumns.map(col => {
                if (col.id !== columnID && !col.isLocked) {
                    return { ...col, size: col.size - distributeAmount };
                }
                return col;
            });
            // normalize sizes to total 100%
            const totalSize = resizedColumns.reduce((sum, col) => sum + col.size, 0);
            const normalizedColumns = resizedColumns.map(col => ({
                ...col,
                size: col.size * (100 / totalSize)
            }));
            await this.#stateManager.batchUpdate({
                paletteContainer: {
                    ...paletteContainer,
                    columns: normalizedColumns
                }
            });
        }, `[${caller}.handleColumnResize]: Failed to resize column ${columnID}`);
    }
    async scanPaletteColumnColors() {
        return this.#errors.handleAsync(async () => {
            const paletteContainer = this.#getElement(domIndex.ids.divs.paletteContainer);
            if (!paletteContainer) {
                this.#log.warn(`No palette container found in State.`, `${caller}.scanPaletteColumnColors`);
                return;
            }
            const columnElements = Array.from(this.#getAllElements(domIndex.classes.paletteColumn));
            if (columnElements.length === 0) {
                this.#log.warn('No palette columns found in the DOM.', `${caller}.scanPaletteColumnColors`);
                return;
            }
            const extractedColumns = columnElements.map((column, index) => {
                const columnID = index + 1; // sequential IDs based on order
                // get the input element for the color
                const inputElement = column.querySelector(`input.color-display`);
                if (!inputElement) {
                    this.#log.warn(`No color input found in column ID ${columnID}.`, `${caller}.scanPaletteColumnColors`);
                    return null;
                }
                const inputValue = inputElement.value.trim();
                // validate the color
                if (!this.#validateColorInput(inputValue)) {
                    this.#log.warn(`Invalid color detected in column ID ${columnID}: "${inputValue}"`, `${caller}.scanPaletteColumnColors`);
                    return null;
                }
                // Apply background color to the column
                column.style.backgroundColor = inputValue;
                const parsedColor = this.#utils.color.formatCSSAsColor(inputValue);
                if (!parsedColor) {
                    this.#log.warn(`Failed to parse color value "${inputValue}" for column ID ${columnID}.`, `${caller}.scanPaletteColumnColors`);
                    return null;
                }
                const hslColor = parsedColor.format === 'hsl'
                    ? parsedColor
                    : this.#utils.color.convertToHSL(parsedColor);
                const allColors = this.#utils.palette.generateAllColorValues(hslColor);
                const structuredColors = {
                    cmyk: allColors.cmyk.value,
                    hex: allColors.hex.value,
                    hsl: allColors.hsl.value,
                    hsv: allColors.hsv.value,
                    lab: allColors.lab.value,
                    rgb: allColors.rgb.value,
                    xyz: allColors.xyz.value
                };
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
                    id: columnID,
                    position: columnID, // maintain order from DOM
                    isLocked: column.classList.contains('locked'),
                    size: 100 / columnElements.length, // even distribution for now
                    color: structuredColors,
                    css: structuredCSS
                };
            });
            // remove any null values if elements were missing
            const validColumns = extractedColumns.filter((col) => col !== null);
            if (validColumns.length === 0) {
                this.#log.warn('No valid colors extracted from the DOM.', `${caller}.scanPaletteColumnColors`);
                return;
            }
            // construct a new palette object based on extracted colors
            const newPalette = {
                id: `custom_${crypto.randomUUID()}`,
                items: validColumns.map(col => ({
                    itemID: col.id,
                    colors: col.color,
                    css: col.css
                })),
                metadata: {
                    columnCount: validColumns.length,
                    limitDark: false,
                    limitGray: false,
                    limitLight: false,
                    timestamp: this.#helpers.data.getFormattedTimestamp(),
                    type: 'custom'
                }
            };
            // update State with scanned colors
            await this.#stateManager.batchUpdate({
                paletteContainer: {
                    columns: validColumns.map(({ color, ...col }) => col)
                },
                paletteHistory: [newPalette]
            });
            this.#log.debug(`Scanned ${validColumns.length} colors from the DOM and updated state.`, `${caller}.scanPaletteColumnColors`);
        }, `[${caller}.scanPaletteColumnColors]: Scan failed!`);
    }
    async swapColumns(draggedID, targetID) {
        return await this.#errors.handleAsync(async () => {
            const paletteContainer = this.#stateManager.get('paletteContainer');
            const columns = paletteContainer.columns;
            const draggedColumn = columns.find(col => col.id === draggedID);
            const targetColumn = columns.find(col => col.id === targetID);
            if (!draggedColumn || !targetColumn) {
                this.#log.warn(`Failed to swap columns: Column ID ${draggedID} or ${targetID} not found.`, `${caller}.swapColumns`);
                return;
            }
            // create updated columns with immutably swapped positions
            const updatedColumns = columns.map(col => {
                if (col.id === draggedID)
                    return { ...col, position: targetColumn.position };
                if (col.id === targetID)
                    return { ...col, position: draggedColumn.position };
                return col;
            });
            // sort columns based on updated positions
            const sortedColumns = [...updatedColumns].sort((a, b) => a.position - b.position);
            // update state with the new column order
            this.#stateManager.batchUpdate({
                paletteContainer: {
                    ...paletteContainer,
                    columns: sortedColumns
                }
            });
            this.#log.debug(`Swapped columns ${draggedID} and ${targetID}. New order: ${sortedColumns.map(col => col.id).join(', ')}`, `${caller}.swapColumns`);
        }, `[${caller}.swapColumns]: Failed to swap columns with IDs ${draggedID} and ${targetID}`);
    }
    async updateColumnSize(columnID, newSize) {
        return await this.#errors.handleAsync(async () => {
            const paletteContainer = this.#stateManager.get('paletteContainer');
            const { columns } = paletteContainer;
            const columnIndex = columns.findIndex(col => col.id === columnID);
            if (columnIndex === -1)
                return;
            const minSize = domConfig.minColumnSize;
            const maxSize = domConfig.maxColumnSize;
            const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));
            const updatedColumns = columns.map(col => col.id === columnID ? { ...col, size: adjustedSize } : col);
            await this.#stateManager.batchUpdate({
                paletteContainer: {
                    ...paletteContainer,
                    columns: updatedColumns
                }
            });
        }, `[${caller}.updateColumnSize]: Failed to update size for column ${columnID}`);
    }
}

export { PaletteStateService };
//# sourceMappingURL=PaletteStateService.js.map
