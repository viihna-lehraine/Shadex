// File: dom/PaletteRendererService.ts
import { domConfig } from '../config/index.js';
const caller = 'PaletteRendererService';
export class PaletteRendererService {
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
                const colorValue = item.css[validColorSpace] ||
                    item.css.hex;
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
                const colorValue = item.css[validColorSpace] ||
                    item.css.hex;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZVJlbmRlcmVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vUGFsZXR0ZVJlbmRlcmVyU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQ0FBc0M7QUFnQnRDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUvQyxNQUFNLE1BQU0sR0FBRyx3QkFBd0IsQ0FBQztBQVF4QyxNQUFNLE9BQU8sc0JBQXNCO0lBQ2xDLE1BQU0sQ0FBQyxTQUFTLEdBQWtDLElBQUksQ0FBQztJQUV2RCxPQUFPLENBQWtCO0lBQ3pCLFNBQVMsQ0FBVztJQUNwQixPQUFPLENBQXFCO0lBQzVCLElBQUksQ0FBa0I7SUFDdEIsUUFBUSxDQUFVO0lBQ2xCLGFBQWEsQ0FBZTtJQUM1QixNQUFNLENBQVk7SUFFbEIsZ0JBQWdCLENBQW9CO0lBQ3BDLG1CQUFtQixDQUF5QjtJQUM1QyxhQUFhLENBQXNCO0lBRW5DLFlBQ0MsTUFBdUIsRUFDdkIsUUFBa0IsRUFDbEIsWUFBaUMsRUFDakMsc0JBQThDLEVBQzlDLGVBQWtDLEVBQ2xDLFlBQTBCO1FBRTFCLElBQUksQ0FBQztZQUNKLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDdkIsK0NBQStDLEVBQy9DLEdBQUcsTUFBTSxjQUFjLENBQ3ZCLENBQUM7WUFFRixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFB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LENBQUMsRUFBRSxHQUFHLGVBQWUsUUFBUSxFQUFFLENBQUM7WUFDMUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7WUFDckMsVUFBVSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDMUIsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7WUFFOUIsa0NBQWtDO1lBQ2xDLGVBQWUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUNELElBQUksTUFBTSx5Q0FBeUMsRUFDbkQsRUFBRSxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FDckMsQ0FBQztJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBkb20vUGFsZXR0ZVJlbmRlcmVyU2VydmljZS50c1xuXG5pbXBvcnQge1xuXHRBbGxDb2xvcnMsXG5cdENvbW1vbkZ1bmN0aW9ucyxcblx0R2VuZXJhdGVIdWVzRm5Hcm91cCxcblx0R2VuZXJhdGVQYWxldHRlRm4sXG5cdEdlbmVyYXRlUGFsZXR0ZUZuR3JvdXAsXG5cdEhlbHBlcnMsXG5cdFBhbGV0dGVJdGVtLFxuXHRTZXJ2aWNlcyxcblx0U3RhdGUsXG5cdFV0aWxpdGllc1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBTdGF0ZU1hbmFnZXIgfSBmcm9tICcuLi9zdGF0ZS9TdGF0ZU1hbmFnZXIuanMnO1xuaW1wb3J0IHsgRE9NU3RvcmUgfSBmcm9tICcuL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbUNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNhbGxlciA9ICdQYWxldHRlUmVuZGVyZXJTZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBQYWxldHRlUmVuZGVyZXJDb250cmFjdCB7XG5cdHJlbmRlckNvbHVtbnMoY29sdW1uczogU3RhdGVbJ3BhbGV0dGVDb250YWluZXInXVsnY29sdW1ucyddKTogdm9pZDtcblx0cmVuZGVyTmV3UGFsZXR0ZSgpOiBQcm9taXNlPHZvaWQ+O1xuXHRyZW5kZXJQYWxldHRlRnJvbVN0YXRlKCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBQYWxldHRlUmVuZGVyZXJTZXJ2aWNlIGltcGxlbWVudHMgUGFsZXR0ZVJlbmRlcmVyQ29udHJhY3Qge1xuXHRzdGF0aWMgI2luc3RhbmNlOiBQYWxldHRlUmVuZGVyZXJTZXJ2aWNlIHwgbnVsbCA9IG51bGw7XG5cblx0I2NvbW1vbjogQ29tbW9uRnVuY3Rpb25zO1xuXHQjZG9tU3RvcmU6IERPTVN0b3JlO1xuXHQjZXJyb3JzOiBTZXJ2aWNlc1snZXJyb3JzJ107XG5cdCNsb2c6IFNlcnZpY2VzWydsb2cnXTtcblx0I2hlbHBlcnM6IEhlbHBlcnM7XG5cdCNzdGF0ZU1hbmFnZXI6IFN0YXRlTWFuYWdlcjtcblx0I3V0aWxzOiBVdGlsaXRpZXM7XG5cblx0I2dlbmVyYXRlUGFsZXR0ZTogR2VuZXJhdGVQYWxldHRlRm47XG5cdCNnZW5lcmF0ZVBhbGV0dGVGbnM6IEdlbmVyYXRlUGFsZXR0ZUZuR3JvdXA7XG5cdCNnZW5lcmF0ZUh1ZXM6IEdlbmVyYXRlSHVlc0ZuR3JvdXA7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3Rvcihcblx0XHRjb21tb246IENvbW1vbkZ1bmN0aW9ucyxcblx0XHRkb21TdG9yZTogRE9NU3RvcmUsXG5cdFx0Z2VuZXJhdGVIdWVzOiBHZW5lcmF0ZUh1ZXNGbkdyb3VwLFxuXHRcdGdlbmVyYXRlUGFsZXR0ZUZuR3JvdXA6IEdlbmVyYXRlUGFsZXR0ZUZuR3JvdXAsXG5cdFx0Z2VuZXJhdGVQYWxldHRlOiBHZW5lcmF0ZVBhbGV0dGVGbixcblx0XHRzdGF0ZU1hbmFnZXI6IFN0YXRlTWFuYWdlclxuXHQpIHtcblx0XHR0cnkge1xuXHRcdFx0Y29tbW9uLnNlcnZpY2VzLmxvZy5pbmZvKFxuXHRcdFx0XHRgQ29uc3RydWN0aW5nIFBhbGV0dGVSZW5kZXJlclNlcnZpY2UgaW5zdGFuY2UuYCxcblx0XHRcdFx0YCR7Y2FsbGVyfS5jb25zdHJ1Y3RvcmBcblx0XHRcdCk7XG5cblx0XHRcdHRoaXMuI2NvbW1vbiA9IGNvbW1vbjtcblx0XHRcdHRoaXMuI2RvbVN0b3JlID0gZG9tU3RvcmU7XG5cdFx0XHR0aGlzLiNlcnJvcnMgPSBjb21tb24uc2VydmljZXMuZXJyb3JzO1xuXHRcdFx0dGhpcy4jaGVscGVycyA9IGNvbW1vbi5oZWxwZXJzO1xuXHRcdFx0dGhpcy4jbG9nID0gY29tbW9uLnNlcnZpY2VzLmxvZztcblx0XHRcdHRoaXMuI3V0aWxzID0gY29tbW9uLnV0aWxzO1xuXG5cdFx0XHR0aGlzLiNnZW5lcmF0ZVBhbGV0dGUgPSBnZW5lcmF0ZVBhbGV0dGU7XG5cdFx0XHR0aGlzLiNnZW5lcmF0ZVBhbGV0dGVGbnMgPSBnZW5lcmF0ZVBhbGV0dGVGbkdyb3VwO1xuXHRcdFx0dGhpcy4jZ2VuZXJhdGVIdWVzID0gZ2VuZXJhdGVIdWVzO1xuXG5cdFx0XHR0aGlzLiNzdGF0ZU1hbmFnZXIgPSBzdGF0ZU1hbmFnZXI7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn0uY29uc3RydWN0b3JdOiAke1xuXHRcdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3Jcblx0XHRcdFx0fWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGdldEluc3RhbmNlKFxuXHRcdGNvbW1vbjogQ29tbW9uRnVuY3Rpb25zLFxuXHRcdGRvbVN0b3JlOiBET01TdG9yZSxcblx0XHRnZW5lcmF0ZUh1ZXM6IEdlbmVyYXRlSHVlc0ZuR3JvdXAsXG5cdFx0Z2VuZXJhdGVQYWxldHRlRm5Hcm91cDogR2VuZXJhdGVQYWxldHRlRm5Hcm91cCxcblx0XHRnZW5lcmF0ZVBhbGV0dGU6IEdlbmVyYXRlUGFsZXR0ZUZuLFxuXHRcdHN0YXRlTWFuYWdlcjogU3RhdGVNYW5hZ2VyXG5cdCk6IFBhbGV0dGVSZW5kZXJlclNlcnZpY2Uge1xuXHRcdHJldHVybiBjb21tb24uc2VydmljZXMuZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCFQYWxldHRlUmVuZGVyZXJTZXJ2aWNlLiNpbnN0YW5jZSkge1xuXHRcdFx0XHRjb21tb24uc2VydmljZXMubG9nLmluZm8oXG5cdFx0XHRcdFx0YENyZWF0aW5nIFBhbGV0dGVSZW5kZXJlclNlcnZpY2UgaW5zdGFuY2UuYCxcblx0XHRcdFx0XHRgJHtjYWxsZXJ9LmdldEluc3RhbmNlYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBuZXcgUGFsZXR0ZVJlbmRlcmVyU2VydmljZShcblx0XHRcdFx0XHRjb21tb24sXG5cdFx0XHRcdFx0ZG9tU3RvcmUsXG5cdFx0XHRcdFx0Z2VuZXJhdGVIdWVzLFxuXHRcdFx0XHRcdGdlbmVyYXRlUGFsZXR0ZUZuR3JvdXAsXG5cdFx0XHRcdFx0Z2VuZXJhdGVQYWxldHRlLFxuXHRcdFx0XHRcdHN0YXRlTWFuYWdlclxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gUGFsZXR0ZVJlbmRlcmVyU2VydmljZS4jaW5zdGFuY2U7XG5cdFx0fSwgYFske2NhbGxlcn0uZ2V0SW5zdGFuY2VdOiBGYWlsZWQgdG8gY3JlYXRlIFBhbGV0dGVSZW5kZXJlclNlcnZpY2UgaW5zdGFuY2UuYCk7XG5cdH1cblxuXHRyZW5kZXJDb2x1bW5zKGNvbHVtbnM6IFN0YXRlWydwYWxldHRlQ29udGFpbmVyJ11bJ2NvbHVtbnMnXSk6IHZvaWQge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuI2RvbVN0b3JlLmdldEVsZW1lbnQoJ2RpdnMnLCAncGFsZXR0ZUNvbnRhaW5lcicpO1xuXG5cdFx0aWYgKCFjb250YWluZXIpIHtcblx0XHRcdHRoaXMuI2xvZy53YXJuKFxuXHRcdFx0XHQnUGFsZXR0ZSBjb250YWluZXIgbm90IGZvdW5kLicsXG5cdFx0XHRcdGAke2NhbGxlcn0ucmVuZGVyQ29sdW1uc2Bcblx0XHRcdCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG5cdFx0Y29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG5cdFx0XHRjb25zdCBjb2x1bW5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGNvbHVtbkRpdi5jbGFzc05hbWUgPSAncGFsZXR0ZS1jb2x1bW4nO1xuXHRcdFx0Y29sdW1uRGl2LnN0eWxlLndpZHRoID0gYCR7Y29sdW1uLnNpemV9JWA7XG5cdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoY29sdW1uRGl2KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdGBSZW5kZXJlZCAke2NvbHVtbnMubGVuZ3RofSBjb2x1bW5zLmNgLFxuXHRcdFx0YCR7Y2FsbGVyfS5yZW5kZXJDb2x1bW5zYFxuXHRcdCk7XG5cdH1cblxuXHRhc3luYyByZW5kZXJOZXdQYWxldHRlKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHJldHVybiBhd2FpdCB0aGlzLiNlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbnRhaW5lciA9IHRoaXMuI2RvbVN0b3JlLmdldEVsZW1lbnQoXG5cdFx0XHRcdCdkaXZzJyxcblx0XHRcdFx0J3BhbGV0dGVDb250YWluZXInXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXBhbGV0dGVDb250YWluZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIGNvbnRhaW5lciBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcmV0cmlldmUgcGFsZXR0ZSBnZW5lcmF0aW9uIG9wdGlvbnNcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB0aGlzLiN1dGlscy5wYWxldHRlLmdldFBhbGV0dGVPcHRpb25zRnJvbVVJKCk7XG5cdFx0XHR0aGlzLiNsb2cuZGVidWcoXG5cdFx0XHRcdGBQYWxldHRlIG9wdGlvbnM6ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucyl9YCxcblx0XHRcdFx0YCR7Y2FsbGVyfS5yZW5kZXJOZXdQYWxldHRlYFxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gc3RvcmUgdGhlIG9sZCBwYWxldHRlIGluIGhpc3Rvcnlcblx0XHRcdGNvbnN0IG9sZFBhbGV0dGUgPSAoXG5cdFx0XHRcdGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5nZXRTdGF0ZSgpXG5cdFx0XHQpLnBhbGV0dGVIaXN0b3J5LmF0KC0xKTtcblx0XHRcdGlmIChvbGRQYWxldHRlKSB0aGlzLiNzdGF0ZU1hbmFnZXIuYWRkUGFsZXR0ZVRvSGlzdG9yeShvbGRQYWxldHRlKTtcblxuXHRcdFx0Ly8gY2xlYXIgdGhlIGV4aXN0aW5nIHBhbGV0dGVcblx0XHRcdHBhbGV0dGVDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cblx0XHRcdC8vIGdlbmVyYXRlIGEgbmV3IHBhbGV0dGVcblx0XHRcdGNvbnN0IG5ld1BhbGV0dGUgPSB0aGlzLiNnZW5lcmF0ZVBhbGV0dGUoXG5cdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdHRoaXMuI2NvbW1vbixcblx0XHRcdFx0dGhpcy4jZ2VuZXJhdGVIdWVzLFxuXHRcdFx0XHR0aGlzLiNnZW5lcmF0ZVBhbGV0dGVGbnNcblx0XHRcdCk7XG5cblx0XHRcdC8vIGVuc3VyZSB2YWxpZCBwYWxldHRlIGJlZm9yZSBzdG9yaW5nXG5cdFx0XHRpZiAoIXRoaXMuI2hlbHBlcnMudHlwZWd1YXJkcy5pc1BhbGV0dGUobmV3UGFsZXR0ZSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdHZW5lcmF0ZWQgcGFsZXR0ZSBpcyBpbnZhbGlkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNzdGF0ZU1hbmFnZXIuYWRkUGFsZXR0ZVRvSGlzdG9yeShuZXdQYWxldHRlKTtcblx0XHRcdGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5zYXZlU3RhdGUoKTtcblxuXHRcdFx0Ly8gY3JlYXRlIGFuZCBhcHBlbmQgcGFsZXR0ZSBjb2x1bW5zXG5cdFx0XHRjb25zdCBjb2x1bW5XaWR0aCA9IDEwMCAvIG5ld1BhbGV0dGUuaXRlbXMubGVuZ3RoO1xuXHRcdFx0Y29uc3QgdmFsaWRDb2xvclNwYWNlID0gWydoZXgnLCAnaHNsJywgJ3JnYiddLmluY2x1ZGVzKFxuXHRcdFx0XHQoYXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCkpLnByZWZlcmVuY2VzLmNvbG9yU3BhY2Vcblx0XHRcdClcblx0XHRcdFx0PyAoYXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCkpLnByZWZlcmVuY2VzLmNvbG9yU3BhY2Vcblx0XHRcdFx0OiAnaGV4JztcblxuXHRcdFx0Y29uc3QgY29sdW1ucyA9IG5ld1BhbGV0dGUuaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb2x1bW5JRCA9IGluZGV4ICsgMTtcblx0XHRcdFx0Y29uc3QgY29sb3JWYWx1ZSA9XG5cdFx0XHRcdFx0aXRlbS5jc3NbdmFsaWRDb2xvclNwYWNlIGFzIGtleW9mIFBhbGV0dGVJdGVtWydjc3MnXV0gfHxcblx0XHRcdFx0XHRpdGVtLmNzcy5oZXg7XG5cblx0XHRcdFx0Y29uc3QgY29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbHVtbi5pZCA9IGBwYWxldHRlLWNvbHVtbi0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGNvbHVtbi5jbGFzc05hbWUgPSAncGFsZXR0ZS1jb2x1bW4nO1xuXHRcdFx0XHRjb2x1bW4uc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xuXHRcdFx0XHRjb2x1bW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JWYWx1ZTtcblxuXHRcdFx0XHQvLyBhZGQgVUkgZWxlbWVudHMgaW5zaWRlIHRoZSBjb2x1bW5cblx0XHRcdFx0dGhpcy4jcmVuZGVyUGFsZXR0ZUNvbHVtbihjb2x1bW4sIGNvbHVtbklELCBjb2xvclZhbHVlKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbHVtbixcblx0XHRcdFx0XHRzdGF0ZToge1xuXHRcdFx0XHRcdFx0aWQ6IGNvbHVtbklELFxuXHRcdFx0XHRcdFx0aXNMb2NrZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cG9zaXRpb246IGNvbHVtbklELFxuXHRcdFx0XHRcdFx0c2l6ZTogY29sdW1uV2lkdGhcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYXBwZW5kIG5ldyBjb2x1bW5zIHRvIHRoZSBwYWxldHRlIGNvbnRhaW5lclxuXHRcdFx0Y29sdW1ucy5mb3JFYWNoKCh7IGNvbHVtbiB9KSA9PlxuXHRcdFx0XHRwYWxldHRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbHVtbilcblx0XHRcdCk7XG5cblx0XHRcdC8vIHVwZGF0ZSBzdGF0ZSB3aXRoIG5ldyBjb2x1bW5zXG5cdFx0XHR0aGlzLiNzdGF0ZU1hbmFnZXIudXBkYXRlUGFsZXR0ZUNvbHVtbnMoXG5cdFx0XHRcdGNvbHVtbnMubWFwKGNvbCA9PiBjb2wuc3RhdGUpLFxuXHRcdFx0XHR0cnVlXG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHJlbmRlciBhIG5ldyBwYWxldHRlLmApO1xuXHR9XG5cblx0YXN5bmMgcmVuZGVyUGFsZXR0ZUZyb21TdGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gYXdhaXQgdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5lbnN1cmVTdGF0ZVJlYWR5KCk7XG5cdFx0XHRjb25zdCBwYWxldHRlQ29udGFpbmVyID0gdGhpcy4jZG9tU3RvcmUuZ2V0RWxlbWVudChcblx0XHRcdFx0J2RpdnMnLFxuXHRcdFx0XHQncGFsZXR0ZUNvbnRhaW5lcidcblx0XHRcdCk7XG5cdFx0XHRpZiAoIXBhbGV0dGVDb250YWluZXIpIHtcblx0XHRcdFx0dGhpcy4jbG9nLndhcm4oXG5cdFx0XHRcdFx0J1BhbGV0dGUgY29udGFpbmVyIG5vdCBmb3VuZCcsXG5cdFx0XHRcdFx0YCR7Y2FsbGVyfS5yZW5kZXJQYWxldHRlRnJvbVN0YXRlYFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBjbGVhciBleGlzdGluZyBjb250ZW50XG5cdFx0XHRwYWxldHRlQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0Ly8gZ2V0IHRoZSBtb3N0IHJlY2VudCBwYWxldHRlIGZyb20gaGlzdG9yeVxuXHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gYXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCk7XG5cdFx0XHRjb25zdCBsYXRlc3RQYWxldHRlID0gY3VycmVudFN0YXRlLnBhbGV0dGVIaXN0b3J5LmF0KC0xKTtcblx0XHRcdGlmICghbGF0ZXN0UGFsZXR0ZSkge1xuXHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHQnTm8gc2F2ZWQgcGFsZXR0ZXMgaW4gaGlzdG9yeS4gQ2Fubm90IHJlbmRlci4nLFxuXHRcdFx0XHRcdGAke2NhbGxlcn0ucmVuZGVyUGFsZXR0ZUZyb21TdGF0ZWBcblx0XHRcdFx0KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Ly8gcmV0cmlldmUgdXNlcidzIHByZWZlcnJlZCBjb2xvciBmb3JtYXRcblx0XHRcdGNvbnN0IGNvbG9yU3BhY2UgPSBjdXJyZW50U3RhdGUucHJlZmVyZW5jZXM/LmNvbG9yU3BhY2UgfHwgJ2hleCc7XG5cdFx0XHRjb25zdCB2YWxpZENvbG9yU3BhY2UgPSBbJ2hleCcsICdoc2wnLCAncmdiJ10uaW5jbHVkZXMoY29sb3JTcGFjZSlcblx0XHRcdFx0PyBjb2xvclNwYWNlXG5cdFx0XHRcdDogJ2hleCc7XG5cdFx0XHRjb25zdCBjb2x1bW5Db3VudCA9IGxhdGVzdFBhbGV0dGUubWV0YWRhdGEuY29sdW1uQ291bnQ7XG5cdFx0XHRjb25zdCBjb2x1bW5XaWR0aCA9IDEwMCAvIGNvbHVtbkNvdW50O1xuXHRcdFx0Y29uc3QgY29sdW1ucyA9IGxhdGVzdFBhbGV0dGUuaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb2x1bW5JRCA9IGl0ZW0uaXRlbUlEO1xuXHRcdFx0XHRjb25zdCBjb2xvclZhbHVlID1cblx0XHRcdFx0XHRpdGVtLmNzc1t2YWxpZENvbG9yU3BhY2UgYXMga2V5b2YgUGFsZXR0ZUl0ZW1bJ2NzcyddXSB8fFxuXHRcdFx0XHRcdGl0ZW0uY3NzLmhleDtcblx0XHRcdFx0Y29uc3QgY29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbHVtbi5pZCA9IGBwYWxldHRlLWNvbHVtbi0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGNvbHVtbi5jbGFzc05hbWUgPSAncGFsZXR0ZS1jb2x1bW4nO1xuXHRcdFx0XHRjb2x1bW4uc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xuXHRcdFx0XHRjb2x1bW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JWYWx1ZTtcblx0XHRcdFx0Ly8gYWRkIFVJIGVsZW1lbnRzIGluc2lkZSB0aGUgY29sdW1uXG5cdFx0XHRcdHRoaXMuI3JlbmRlclBhbGV0dGVDb2x1bW4oY29sdW1uLCBjb2x1bW5JRCwgY29sb3JWYWx1ZSk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Y29sdW1uLFxuXHRcdFx0XHRcdHN0YXRlOiB7XG5cdFx0XHRcdFx0XHRpZDogY29sdW1uSUQsXG5cdFx0XHRcdFx0XHRpc0xvY2tlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogaW5kZXggKyAxLFxuXHRcdFx0XHRcdFx0c2l6ZTogY29sdW1uV2lkdGhcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRcdC8vIGFwcGVuZCBuZXcgY29sdW1ucyB0byB0aGUgcGFsZXR0ZSBjb250YWluZXJcblx0XHRcdGNvbHVtbnMuZm9yRWFjaCgoeyBjb2x1bW4gfSkgPT5cblx0XHRcdFx0cGFsZXR0ZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjb2x1bW4pXG5cdFx0XHQpO1xuXHRcdFx0Ly8gdXBkYXRlIHN0YXRlIHdpdGggbmV3IGNvbHVtbnNcblx0XHRcdHRoaXMuI3N0YXRlTWFuYWdlci51cGRhdGVQYWxldHRlQ29sdW1ucyhcblx0XHRcdFx0Y29sdW1ucy5tYXAoY29sID0+IGNvbC5zdGF0ZSksXG5cdFx0XHRcdHRydWVcblx0XHRcdCk7XG5cblx0XHRcdHRoaXMuI3N0YXRlTWFuYWdlci51cGRhdGVQYWxldHRlSGlzdG9yeShbbGF0ZXN0UGFsZXR0ZV0sIHRydWUpO1xuXG5cdFx0XHRhd2FpdCB0aGlzLiNzdGF0ZU1hbmFnZXIuc2F2ZVN0YXRlKCk7XG5cblx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0YFJlc3RvcmVkICR7Y29sdW1ucy5sZW5ndGh9IGNvbHVtbnMgZnJvbSBzYXZlZCBzdGF0ZS5gLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LnJlbmRlclBhbGV0dGVGcm9tU3RhdGVgXG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHJlbmRlciBwYWxldHRlIGZyb20gc3RhdGUuYCk7XG5cdH1cblxuXHRhc3luYyB1cGRhdGVQYWxldHRlQ29sdW1uU2l6ZShcblx0XHRjb2x1bW5JRDogbnVtYmVyLFxuXHRcdG5ld1NpemU6IG51bWJlclxuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGF3YWl0IHRoaXMuI3N0YXRlTWFuYWdlci5nZXRTdGF0ZSgpO1xuXHRcdFx0Y29uc3QgY29sdW1ucyA9IGN1cnJlbnRTdGF0ZS5wYWxldHRlQ29udGFpbmVyLmNvbHVtbnM7XG5cblx0XHRcdGNvbnN0IGNvbHVtbkluZGV4ID0gY29sdW1ucy5maW5kSW5kZXgoY29sID0+IGNvbC5pZCA9PT0gY29sdW1uSUQpO1xuXHRcdFx0aWYgKGNvbHVtbkluZGV4ID09PSAtMSkge1xuXHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHRgQ29sdW1uIHdpdGggSUQgJHtjb2x1bW5JRH0gbm90IGZvdW5kLmAsXG5cdFx0XHRcdFx0YCR7Y2FsbGVyfS51cGRhdGVQYWxldHRlQ29sdW1uU2l6ZWBcblx0XHRcdFx0KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhZGp1c3Qgc2l6ZSB3aXRoIG1pbi9tYXggYm91bmRhcmllc1xuXHRcdFx0Y29uc3QgYWRqdXN0ZWRTaXplID0gTWF0aC5tYXgoXG5cdFx0XHRcdGRvbUNvbmZpZy5taW5Db2x1bW5TaXplLFxuXHRcdFx0XHRNYXRoLm1pbihuZXdTaXplLCBkb21Db25maWcubWF4Q29sdW1uU2l6ZSlcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IHNpemVEaWZmZXJlbmNlID0gYWRqdXN0ZWRTaXplIC0gY29sdW1uc1tjb2x1bW5JbmRleF0uc2l6ZTtcblxuXHRcdFx0Ly8gY3JlYXRlIHVwZGF0ZWQgY29sdW1uIHNpemVzXG5cdFx0XHRjb25zdCB1cGRhdGVkQ29sdW1ucyA9IGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XG5cdFx0XHRcdGlmIChpbmRleCA9PT0gY29sdW1uSW5kZXgpIHtcblx0XHRcdFx0XHRyZXR1cm4geyAuLi5jb2wsIHNpemU6IGFkanVzdGVkU2l6ZSB9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGRpc3RyaWJ1dGUgc2l6ZSBkaWZmZXJlbmNlIGFtb25nIHVubG9ja2VkIGNvbHVtbnNcblx0XHRcdFx0aWYgKCFjb2wuaXNMb2NrZWQpIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0Li4uY29sLFxuXHRcdFx0XHRcdFx0c2l6ZTogY29sLnNpemUgLSBzaXplRGlmZmVyZW5jZSAvIChjb2x1bW5zLmxlbmd0aCAtIDEpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBsb2NrZWQgY29sdW1ucyByZW1haW4gdW5jaGFuZ2VkXG5cdFx0XHRcdHJldHVybiBjb2w7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gbm9ybWFsaXplIHNpemVzIHRvIGVuc3VyZSB0b3RhbCBpcyBleGFjdGx5IDEwMCVcblx0XHRcdGNvbnN0IHRvdGFsU2l6ZSA9IHVwZGF0ZWRDb2x1bW5zLnJlZHVjZShcblx0XHRcdFx0KHN1bSwgY29sKSA9PiBzdW0gKyBjb2wuc2l6ZSxcblx0XHRcdFx0MFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IG5vcm1hbGl6ZWRDb2x1bW5zID0gdXBkYXRlZENvbHVtbnMubWFwKGNvbCA9PiAoe1xuXHRcdFx0XHQuLi5jb2wsXG5cdFx0XHRcdHNpemU6IGNvbC5zaXplICogKDEwMCAvIHRvdGFsU2l6ZSlcblx0XHRcdH0pKTtcblxuXHRcdFx0Ly8gdXBkYXRlIHN0YXRlIHVzaW5nIFBhcnRpYWw8U3RhdGU+XG5cdFx0XHRhd2FpdCB0aGlzLiNzdGF0ZU1hbmFnZXIuYmF0Y2hVcGRhdGUoe1xuXHRcdFx0XHRwYWxldHRlQ29udGFpbmVyOiB7XG5cdFx0XHRcdFx0Li4uY3VycmVudFN0YXRlLnBhbGV0dGVDb250YWluZXIsXG5cdFx0XHRcdFx0Y29sdW1uczogbm9ybWFsaXplZENvbHVtbnNcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0YFBhbGV0dGUgY29sdW1uIHNpemUgdXBkYXRlZCAoSUQ6ICR7Y29sdW1uSUR9LCBOZXcgU2l6ZTogJHthZGp1c3RlZFNpemV9KS5gLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LnVwZGF0ZVBhbGV0dGVDb2x1bW5TaXplYFxuXHRcdFx0KTtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byB1cGRhdGUgcGFsZXR0ZSBjb2x1bW4gc2l6ZS5gKTtcblx0fVxuXG5cdGFzeW5jIHVwZGF0ZVBhbGV0dGVJdGVtQ29sb3IoXG5cdFx0Y29sdW1uSUQ6IG51bWJlcixcblx0XHRuZXdDb2xvcjogc3RyaW5nLFxuXHRcdHN0YXRlOiBTdGF0ZVxuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZUFzeW5jKFxuXHRcdFx0YXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50U3RhdGUgPSB0aGlzLiNoZWxwZXJzLmRhdGEuY2xvbmUoc3RhdGUpO1xuXHRcdFx0XHRjb25zdCBsYXRlc3RQYWxldHRlID0gY3VycmVudFN0YXRlLnBhbGV0dGVIaXN0b3J5WzBdO1xuXG5cdFx0XHRcdGlmICghbGF0ZXN0UGFsZXR0ZSkgcmV0dXJuO1xuXG5cdFx0XHRcdC8vIGZpbmQgdGhlIFBhbGV0dGVJdGVtIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBjb2x1bW5cblx0XHRcdFx0Y29uc3QgdXBkYXRlZEl0ZW1zID0gbGF0ZXN0UGFsZXR0ZS5pdGVtcy5tYXAoaXRlbSA9PiB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0uaXRlbUlEICE9PSBjb2x1bW5JRCkgcmV0dXJuIGl0ZW07XG5cblx0XHRcdFx0XHRjb25zdCBwYXJzZWROZXdDb2xvciA9XG5cdFx0XHRcdFx0XHR0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDU1NBc0NvbG9yKG5ld0NvbG9yKTtcblx0XHRcdFx0XHRpZiAoIXBhcnNlZE5ld0NvbG9yKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWUnKTtcblxuXHRcdFx0XHRcdC8vIGVuc3VyZSBjb2xvciBpcyBpbiBIU0wgZm9ybWF0XG5cdFx0XHRcdFx0Y29uc3QgaHNsQ29sb3IgPVxuXHRcdFx0XHRcdFx0cGFyc2VkTmV3Q29sb3IuZm9ybWF0ID09PSAnaHNsJ1xuXHRcdFx0XHRcdFx0XHQ/IHBhcnNlZE5ld0NvbG9yXG5cdFx0XHRcdFx0XHRcdDogdGhpcy4jdXRpbHMuY29sb3IuY29udmVydFRvSFNMKHBhcnNlZE5ld0NvbG9yKTtcblxuXHRcdFx0XHRcdC8vIGdlbmVyYXRlIGFsbCBjb2xvciByZXByZXNlbnRhdGlvbnMgKGVuc3VyaW5nIGNvcnJlY3QgYnJhbmRlZCB0eXBlcylcblx0XHRcdFx0XHRjb25zdCBhbGxDb2xvcnM6IEFsbENvbG9ycyA9XG5cdFx0XHRcdFx0XHR0aGlzLiN1dGlscy5wYWxldHRlLmdlbmVyYXRlQWxsQ29sb3JWYWx1ZXMoaHNsQ29sb3IpO1xuXG5cdFx0XHRcdFx0Ly8gZW5zdXJlIENTUyByZXByZXNlbnRhdGlvbnMgbWF0Y2ggZXhwZWN0ZWQgZm9ybWF0XG5cdFx0XHRcdFx0Y29uc3Qgc3RydWN0dXJlZENTUyA9IHtcblx0XHRcdFx0XHRcdGNteWs6IHRoaXMuI3V0aWxzLmNvbG9yLmZvcm1hdENvbG9yQXNDU1MoXG5cdFx0XHRcdFx0XHRcdGFsbENvbG9ycy5jbXlrXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0aGV4OiB0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDb2xvckFzQ1NTKGFsbENvbG9ycy5oZXgpLFxuXHRcdFx0XHRcdFx0aHNsOiB0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDb2xvckFzQ1NTKGFsbENvbG9ycy5oc2wpLFxuXHRcdFx0XHRcdFx0aHN2OiB0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDb2xvckFzQ1NTKGFsbENvbG9ycy5oc3YpLFxuXHRcdFx0XHRcdFx0bGFiOiB0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDb2xvckFzQ1NTKGFsbENvbG9ycy5sYWIpLFxuXHRcdFx0XHRcdFx0cmdiOiB0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDb2xvckFzQ1NTKGFsbENvbG9ycy5yZ2IpLFxuXHRcdFx0XHRcdFx0eHl6OiB0aGlzLiN1dGlscy5jb2xvci5mb3JtYXRDb2xvckFzQ1NTKGFsbENvbG9ycy54eXopXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHQuLi5pdGVtLFxuXHRcdFx0XHRcdFx0Y29sb3JzOiBhbGxDb2xvcnMsXG5cdFx0XHRcdFx0XHRjc3M6IHN0cnVjdHVyZWRDU1Ncblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBlbnN1cmUgY29sdW1uIHN0YXRlIGlzIHVwZGF0ZWRcblx0XHRcdFx0Y29uc3QgdXBkYXRlZENvbHVtbnMgPSB1cGRhdGVkSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gKHtcblx0XHRcdFx0XHRpZDogaXRlbS5pdGVtSUQsXG5cdFx0XHRcdFx0aXNMb2NrZWQ6XG5cdFx0XHRcdFx0XHRjdXJyZW50U3RhdGUucGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zW2luZGV4XS5pc0xvY2tlZCxcblx0XHRcdFx0XHRwb3NpdGlvbjogaW5kZXggKyAxLFxuXHRcdFx0XHRcdHNpemU6IGN1cnJlbnRTdGF0ZS5wYWxldHRlQ29udGFpbmVyLmNvbHVtbnNbaW5kZXhdLnNpemVcblx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdC8vIHVwZGF0ZSBzdGF0ZSBoaXN0b3J5IHdpdGggdHlwZSBhc3NlcnRpb25zXG5cdFx0XHRcdHRoaXMuI3N0YXRlTWFuYWdlci51cGRhdGVQYWxldHRlQ29sdW1ucyh1cGRhdGVkQ29sdW1ucywgdHJ1ZSk7XG5cdFx0XHRcdHRoaXMuI3N0YXRlTWFuYWdlci51cGRhdGVQYWxldHRlSGlzdG9yeShcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC4uLmxhdGVzdFBhbGV0dGUsXG5cdFx0XHRcdFx0XHRcdGl0ZW1zOiB1cGRhdGVkSXRlbXMgYXMgUGFsZXR0ZUl0ZW1bXVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdC4uLmN1cnJlbnRTdGF0ZS5wYWxldHRlSGlzdG9yeS5zbGljZSgxKVxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIHVwZGF0ZSBwYWxldHRlIGl0ZW0gY29sb3IuYCxcblx0XHRcdHsgY29udGV4dDogeyBjb2x1bW5JRCwgbmV3Q29sb3IgfSB9XG5cdFx0KTtcblx0fVxuXG5cdGFzeW5jICNyZW5kZXJQYWxldHRlQ29sdW1uKFxuXHRcdGNvbHVtbjogSFRNTEVsZW1lbnQsXG5cdFx0Y29sdW1uSUQ6IG51bWJlcixcblx0XHRjb2xvclZhbHVlOiBzdHJpbmdcblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0cmV0dXJuIHRoaXMuI2Vycm9ycy5oYW5kbGVBc3luYyhcblx0XHRcdGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gYXdhaXQgdGhpcy4jc3RhdGVNYW5hZ2VyLmdldFN0YXRlKCk7XG5cdFx0XHRcdGNvbnN0IGNvbG9yU3BhY2UgPSBjdXJyZW50U3RhdGUucHJlZmVyZW5jZXMuY29sb3JTcGFjZTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuI3V0aWxzLnZhbGlkYXRlLnVzZXJDb2xvcklucHV0KGNvbG9yVmFsdWUpKSB7XG5cdFx0XHRcdFx0dGhpcy4jbG9nLndhcm4oXG5cdFx0XHRcdFx0XHRgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtjb2xvclZhbHVlfS4gVW5hYmxlIHRvIHJlbmRlciBjb2x1bW4gVUkuYCxcblx0XHRcdFx0XHRcdGAke2NhbGxlcn0uI2NyZWF0ZUNvbHVtbkluVUlgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB2YWxpZENvbG9yU3BhY2UgPSBbJ2hleCcsICdoc2wnLCAncmdiJ10uaW5jbHVkZXMoXG5cdFx0XHRcdFx0Y29sb3JTcGFjZVxuXHRcdFx0XHQpXG5cdFx0XHRcdFx0PyBjb2xvclNwYWNlXG5cdFx0XHRcdFx0OiAnaGV4JztcblxuXHRcdFx0XHRjb2x1bW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JWYWx1ZTtcblxuXHRcdFx0XHQvLyBjcmVhdGUgY29sb3IgZGlzcGxheSBpbnB1dFxuXHRcdFx0XHRjb25zdCBjb2xvckRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0XHRjb2xvckRpc3BsYXkuaWQgPSBgY29sb3ItZGlzcGxheS0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGNvbG9yRGlzcGxheS5jbGFzc05hbWUgPSAnY29sb3ItZGlzcGxheSc7XG5cdFx0XHRcdGNvbG9yRGlzcGxheS50eXBlID0gJ3RleHQnO1xuXHRcdFx0XHRjb2xvckRpc3BsYXkudmFsdWUgPSBjb2xvclZhbHVlO1xuXHRcdFx0XHRjb2xvckRpc3BsYXkuc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIHZhbGlkQ29sb3JTcGFjZSk7XG5cblx0XHRcdFx0Ly8gY3JlYXRlIGNvbG9yIGlucHV0IGJ1dHRvblxuXHRcdFx0XHRjb25zdCBjb2xvcklucHV0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHRcdGNvbG9ySW5wdXRCdG4uaWQgPSBgY29sb3ItaW5wdXQtYnRuLSR7Y29sdW1uSUR9YDtcblx0XHRcdFx0Y29sb3JJbnB1dEJ0bi5jbGFzc05hbWUgPSAnY29sb3ItaW5wdXQtYnRuJztcblx0XHRcdFx0Y29sb3JJbnB1dEJ0bi50ZXh0Q29udGVudCA9ICdDaGFuZ2UgQ29sb3InO1xuXG5cdFx0XHRcdC8vIGNyZWF0ZSBsb2NrIGJ1dHRvblxuXHRcdFx0XHRjb25zdCBsb2NrQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHRcdGxvY2tCdG4uaWQgPSBgbG9jay1idG4tJHtjb2x1bW5JRH1gO1xuXHRcdFx0XHRsb2NrQnRuLmNsYXNzTmFtZSA9ICdsb2NrLWJ0bic7XG5cdFx0XHRcdGxvY2tCdG4udGV4dENvbnRlbnQgPSAnTG9jayDwn5SSJztcblxuXHRcdFx0XHQvLyBjcmVhdGUgZHJhZyBoYW5kbGUgYnV0dG9uXG5cdFx0XHRcdGNvbnN0IGRyYWdIYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRcdFx0ZHJhZ0hhbmRsZS5pZCA9IGBkcmFnLWhhbmRsZS0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGRyYWdIYW5kbGUuY2xhc3NOYW1lID0gJ2RyYWctaGFuZGxlJztcblx0XHRcdFx0ZHJhZ0hhbmRsZS50ZXh0Q29udGVudCA9ICdNb3ZlIOKYsCc7XG5cblx0XHRcdFx0Ly8gY3JlYXRlIHJlc2l6ZSBoYW5kbGVcblx0XHRcdFx0Y29uc3QgcmVzaXplSGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHJlc2l6ZUhhbmRsZS5pZCA9IGByZXNpemUtaGFuZGxlLSR7Y29sdW1uSUR9YDtcblx0XHRcdFx0cmVzaXplSGFuZGxlLmNsYXNzTmFtZSA9ICdyZXNpemUtaGFuZGxlJztcblxuXHRcdFx0XHQvLyBjcmVhdGUgY29sb3IgaW5wdXQgbW9kYWxcblx0XHRcdFx0Y29uc3QgY29sb3JJbnB1dE1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbG9ySW5wdXRNb2RhbC5pZCA9IGBjb2xvci1pbnB1dC1tb2RhbC0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGNvbG9ySW5wdXRNb2RhbC5jbGFzc05hbWUgPSAnY29sb3ItaW5wdXQtbW9kYWwgaGlkZGVuJztcblxuXHRcdFx0XHQvLyBjcmVhdGUgY29sb3IgaW5wdXQgaW5zaWRlIHRoZSBtb2RhbFxuXHRcdFx0XHRjb25zdCBjb2xvcklucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdFx0Y29sb3JJbnB1dC5pZCA9IGBjb2xvci1pbnB1dC0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGNvbG9ySW5wdXQuY2xhc3NOYW1lID0gJ2NvbG9yLWlucHV0Jztcblx0XHRcdFx0Y29sb3JJbnB1dC50eXBlID0gJ2NvbG9yJztcblx0XHRcdFx0Y29sb3JJbnB1dC52YWx1ZSA9IGNvbG9yVmFsdWU7XG5cblx0XHRcdFx0Ly8gYXBwZW5kIGVsZW1lbnRzIHRvIHRoZWlyIHBhcmVudFxuXHRcdFx0XHRjb2xvcklucHV0TW9kYWwuYXBwZW5kQ2hpbGQoY29sb3JJbnB1dCk7XG5cdFx0XHRcdGNvbHVtbi5hcHBlbmRDaGlsZChjb2xvckRpc3BsYXkpO1xuXHRcdFx0XHRjb2x1bW4uYXBwZW5kQ2hpbGQoY29sb3JJbnB1dEJ0bik7XG5cdFx0XHRcdGNvbHVtbi5hcHBlbmRDaGlsZChsb2NrQnRuKTtcblx0XHRcdFx0Y29sdW1uLmFwcGVuZENoaWxkKGRyYWdIYW5kbGUpO1xuXHRcdFx0XHRjb2x1bW4uYXBwZW5kQ2hpbGQocmVzaXplSGFuZGxlKTtcblx0XHRcdFx0Y29sdW1uLmFwcGVuZENoaWxkKGNvbG9ySW5wdXRNb2RhbCk7XG5cdFx0XHR9LFxuXHRcdFx0YFske2NhbGxlcn1dOiBGYWlsZWQgdG8gY3JlYXRlIGNvbHVtbiBVSSBlbGVtZW50cy5gLFxuXHRcdFx0eyBjb250ZXh0OiB7IGNvbHVtbklELCBjb2xvclZhbHVlIH0gfVxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==