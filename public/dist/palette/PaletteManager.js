// File: palette/PaletteManager.js
import { StorageManager } from '../storage/StorageManager.js';
import { data } from '../config/index.js';
const ids = data.dom.ids;
export class PaletteManager {
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
                return data.defaults.palette;
            }
            const extractedItems = Array.from(paletteColumns).map((col, index) => {
                const input = col.querySelector('.color-display');
                const color = input ? input.value.trim() : '#000000';
                this.log(`Extracted color from column ${index + 1}: ${color}`, 'debug');
                if (!data.config.regex.dom.hex.test(color)) {
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
            const minSize = data.config.ui.minColumnSize;
            const maxSize = data.config.ui.maxColumnSize;
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
            // Clear existing content
            paletteContainer.innerHTML = '';
            // Get the most recent palette from history
            const currentState = this.stateManager.getState();
            const latestPalette = currentState.paletteHistory.at(-1);
            if (!latestPalette) {
                this.log('No saved palettes in history. Cannot render.', 'debug');
                return;
            }
            // Retrieve user's preferred color format
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
                // Add UI elements inside the column
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFsZXR0ZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS9QYWxldHRlTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrQ0FBa0M7QUFHbEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBWTlELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUV6QixNQUFNLE9BQU8sY0FBYztJQVdqQjtJQVZELFlBQVksQ0FBc0I7SUFDbEMsa0JBQWtCLENBQXlCO0lBQzNDLGVBQWUsQ0FBb0I7SUFDbkMsTUFBTSxDQUFrQjtJQUN4QixLQUFLLENBQXFCO0lBQzFCLEdBQUcsQ0FBMkI7SUFDOUIsTUFBTSxDQUE4QjtJQUNwQyxPQUFPLENBQWlCO0lBRWhDLFlBQ1MsWUFBMEIsRUFDbEMsTUFBdUIsRUFDdkIsWUFBaUMsRUFDakMsa0JBQTBDLEVBQzFDLGVBQWtDO1FBSjFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBTWxDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FDVixxREFBcUQsRUFDckQsWUFBWSxDQUNaLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUNWLHdEQUF3RCxFQUN4RCxrQkFBa0IsQ0FDbEIsQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQ1Ysa0RBQWtELEVBQ2xELGVBQWUsQ0FDZixDQUFDO1FBRUYsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcs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LENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNyQyxDQUFDLEVBQ0QscUNBQXFDLEVBQ3JDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUN4QixDQUFDO0lBQ0gsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogcGFsZXR0ZS9QYWxldHRlTWFuYWdlci5qc1xuXG5pbXBvcnQgeyBTdGF0ZU1hbmFnZXIgfSBmcm9tICcuLi9zdGF0ZS9TdGF0ZU1hbmFnZXIuanMnO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tICcuLi9zdG9yYWdlL1N0b3JhZ2VNYW5hZ2VyLmpzJztcbmltcG9ydCB7XG5cdENvbW1vbkZ1bmN0aW9ucyxcblx0R2VuZXJhdGVIdWVzRm5Hcm91cCxcblx0R2VuZXJhdGVQYWxldHRlRm4sXG5cdEdlbmVyYXRlUGFsZXR0ZUZuR3JvdXAsXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVJdGVtLFxuXHRQYWxldHRlTWFuYWdlckludGVyZmFjZSxcblx0U2VydmljZXNJbnRlcmZhY2UsXG5cdFV0aWxpdGllc0ludGVyZmFjZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgaWRzID0gZGF0YS5kb20uaWRzO1xuXG5leHBvcnQgY2xhc3MgUGFsZXR0ZU1hbmFnZXIgaW1wbGVtZW50cyBQYWxldHRlTWFuYWdlckludGVyZmFjZSB7XG5cdHByaXZhdGUgZ2VuZXJhdGVIdWVzOiBHZW5lcmF0ZUh1ZXNGbkdyb3VwO1xuXHRwcml2YXRlIGdlbmVyYXRlUGFsZXR0ZUZuczogR2VuZXJhdGVQYWxldHRlRm5Hcm91cDtcblx0cHJpdmF0ZSBnZW5lcmF0ZVBhbGV0dGU6IEdlbmVyYXRlUGFsZXR0ZUZuO1xuXHRwcml2YXRlIGNvbW1vbjogQ29tbW9uRnVuY3Rpb25zO1xuXHRwcml2YXRlIHV0aWxzOiBVdGlsaXRpZXNJbnRlcmZhY2U7XG5cdHByaXZhdGUgbG9nOiBTZXJ2aWNlc0ludGVyZmFjZVsnbG9nJ107XG5cdHByaXZhdGUgZXJyb3JzOiBTZXJ2aWNlc0ludGVyZmFjZVsnZXJyb3JzJ107XG5cdHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZU1hbmFnZXI7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBzdGF0ZU1hbmFnZXI6IFN0YXRlTWFuYWdlcixcblx0XHRjb21tb246IENvbW1vbkZ1bmN0aW9ucyxcblx0XHRnZW5lcmF0ZUh1ZXM6IEdlbmVyYXRlSHVlc0ZuR3JvdXAsXG5cdFx0Z2VuZXJhdGVQYWxldHRlRm5zOiBHZW5lcmF0ZVBhbGV0dGVGbkdyb3VwLFxuXHRcdGdlbmVyYXRlUGFsZXR0ZTogR2VuZXJhdGVQYWxldHRlRm5cblx0KSB7XG5cdFx0Y29uc29sZS5sb2coYFtQYWxldHRlTWFuYWdlci5jb25zdHJ1Y3Rvcl0gRW50ZXJpbmcgY29uc3RydWN0b3IuLi5gKTtcblx0XHRjb25zb2xlLmxvZygnW1BhbGV0dGVNYW5hZ2VyLmNvbnN0cnVjdG9yXSBzdGF0ZU1hbmFnZXInLCBzdGF0ZU1hbmFnZXIpO1xuXHRcdGNvbnNvbGUubG9nKGBbUGFsZXR0ZU1hbmFnZXIuY29uc3RydWN0b3JdIENvbW1vbiBGbiBHcm91cGAsIGNvbW1vbik7XG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgW1BhbGV0dGVNYW5hZ2VyLmNvbnN0cnVjdG9yXSBHZW5lcmF0ZSBIdWVzIEZuIEdyb3VwYCxcblx0XHRcdGdlbmVyYXRlSHVlc1xuXHRcdCk7XG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgW1BhbGV0dGVNYW5hZ2VyLmNvbnN0cnVjdG9yXSBHZW5lcmF0ZSBQYWxldHRlIEZuIEdyb3VwYCxcblx0XHRcdGdlbmVyYXRlUGFsZXR0ZUZuc1xuXHRcdCk7XG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgW1BhbGV0dGVNYW5hZ2VyLmNvbnN0cnVjdG9yXSBHZW5lcmF0ZSBQYWxldHRlIEZuYCxcblx0XHRcdGdlbmVyYXRlUGFsZXR0ZVxuXHRcdCk7XG5cblx0XHR0aGlzLmxvZyA9IGNvbW1vbi5zZXJ2aWNlcy5sb2c7XG5cdFx0dGhpcy5nZW5lcmF0ZUh1ZXMgPSBnZW5lcmF0ZUh1ZXM7XG5cdFx0dGhpcy5nZW5lcmF0ZVBhbGV0dGVGbnMgPSBnZW5lcmF0ZVBhbGV0dGVGbnM7XG5cdFx0dGhpcy5nZW5lcmF0ZVBhbGV0dGUgPSBnZW5lcmF0ZVBhbGV0dGU7XG5cdFx0dGhpcy5jb21tb24gPSBjb21tb247XG5cdFx0dGhpcy5lcnJvcnMgPSBjb21tb24uc2VydmljZXMuZXJyb3JzO1xuXHRcdHRoaXMudXRpbHMgPSBjb21tb24udXRpbHM7XG5cblx0XHR0aGlzLnN0b3JhZ2UgPSBuZXcgU3RvcmFnZU1hbmFnZXIodGhpcy5jb21tb24uc2VydmljZXMpO1xuXG5cdFx0dGhpcy5sb2coJ0NvbXBsZXRpbmcgaW5pdGlhbGl6YXRpb24nLCAnZGVidWcnKTtcblx0fVxuXG5cdHB1YmxpYyBleHRyYWN0UGFsZXR0ZUZyb21ET00oKTogUGFsZXR0ZSB8IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0dGhpcy5sb2coJ0V4dHJhY3RpbmcgcGFsZXR0ZSBmcm9tIERPTScsICdkZWJ1ZycpO1xuXG5cdFx0XHRjb25zdCBwYWxldHRlQ29sdW1ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWxldHRlLWNvbHVtbicpO1xuXHRcdFx0aWYgKHBhbGV0dGVDb2x1bW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR0aGlzLmxvZygnTm8gcGFsZXR0ZSBjb2x1bW5zIGZvdW5kIGluIERPTS4nLCAnZGVidWcnKTtcblx0XHRcdFx0cmV0dXJuIGRhdGEuZGVmYXVsdHMucGFsZXR0ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZXh0cmFjdGVkSXRlbXM6IFBhbGV0dGVJdGVtW10gPSBBcnJheS5mcm9tKFxuXHRcdFx0XHRwYWxldHRlQ29sdW1uc1xuXHRcdFx0KS5tYXAoKGNvbCwgaW5kZXgpID0+IHtcblx0XHRcdFx0Y29uc3QgaW5wdXQgPSBjb2wucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHQnLmNvbG9yLWRpc3BsYXknXG5cdFx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRcdFx0Y29uc3QgY29sb3IgPSBpbnB1dCA/IGlucHV0LnZhbHVlLnRyaW0oKSA6ICcjMDAwMDAwJztcblxuXHRcdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0XHRgRXh0cmFjdGVkIGNvbG9yIGZyb20gY29sdW1uICR7aW5kZXggKyAxfTogJHtjb2xvcn1gLFxuXHRcdFx0XHRcdCdkZWJ1Zydcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoIWRhdGEuY29uZmlnLnJlZ2V4LmRvbS5oZXgudGVzdChjb2xvcikpIHtcblx0XHRcdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0XHRcdGBJbnZhbGlkIGNvbG9yIGZvcm1hdCBmb3IgY29sdW1uICR7aW5kZXggKyAxfTogJHtjb2xvcn1gLFxuXHRcdFx0XHRcdFx0J3dhcm4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNvbnN0IGZhbGxiYWNrQ29sb3IgPSB0aGlzLnV0aWxzLmJyYW5kLmFzSGV4KHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7IGhleDogJyNGRjAwRkYnIH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc3QgZmFsbGJhY2tIU0wgPVxuXHRcdFx0XHRcdFx0dGhpcy51dGlscy5jb2xvci5jb252ZXJ0VG9IU0woZmFsbGJhY2tDb2xvcik7XG5cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy51dGlscy5wYWxldHRlLmNyZWF0ZVBhbGV0dGVJdGVtKFxuXHRcdFx0XHRcdFx0ZmFsbGJhY2tIU0wsXG5cdFx0XHRcdFx0XHRpbmRleCArIDFcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB0aGlzLnV0aWxzLmNvbG9yLmNvbnZlcnRDU1NUb0NvbG9yKGNvbG9yKTtcblx0XHRcdFx0aWYgKCFwYXJzZWRDb2xvcikgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yOiAke2NvbG9yfWApO1xuXG5cdFx0XHRcdGNvbnN0IGhzbENvbG9yID1cblx0XHRcdFx0XHRwYXJzZWRDb2xvci5mb3JtYXQgPT09ICdoc2wnXG5cdFx0XHRcdFx0XHQ/IHBhcnNlZENvbG9yXG5cdFx0XHRcdFx0XHQ6IHRoaXMudXRpbHMuY29sb3IuY29udmVydFRvSFNMKHBhcnNlZENvbG9yKTtcblxuXHRcdFx0XHRjb25zdCBhbGxDb2xvcnMgPVxuXHRcdFx0XHRcdHRoaXMudXRpbHMucGFsZXR0ZS5nZW5lcmF0ZUFsbENvbG9yVmFsdWVzKGhzbENvbG9yKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy51dGlscy5wYWxldHRlLmNyZWF0ZVBhbGV0dGVJdGVtKFxuXHRcdFx0XHRcdGFsbENvbG9ycy5oc2wsXG5cdFx0XHRcdFx0aW5kZXggKyAxXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHRoaXMudXRpbHMucGFsZXR0ZS5nZXRQYWxldHRlT3B0aW9uc0Zyb21VSSgpO1xuXG5cdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0YEV4dHJhY3RlZCBwYWxldHRlIG9wdGlvbnM6ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucyl9YCxcblx0XHRcdFx0J2RlYnVnJ1xuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6IGAke29wdGlvbnMucGFsZXR0ZVR5cGV9XyR7Y3J5cHRvLnJhbmRvbVVVSUQoKX1gLFxuXHRcdFx0XHRtZXRhZGF0YToge1xuXHRcdFx0XHRcdG5hbWU6ICdFWFRSQUNURUQnLFxuXHRcdFx0XHRcdGNvbHVtbkNvdW50OiBleHRyYWN0ZWRJdGVtcy5sZW5ndGgsXG5cdFx0XHRcdFx0ZmxhZ3M6IHtcblx0XHRcdFx0XHRcdGxpbWl0RGFyazogb3B0aW9ucy5saW1pdERhcmssXG5cdFx0XHRcdFx0XHRsaW1pdEdyYXk6IG9wdGlvbnMubGltaXRHcmF5LFxuXHRcdFx0XHRcdFx0bGltaXRMaWdodDogb3B0aW9ucy5saW1pdExpZ2h0XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IHRoaXMudXRpbHMuYXBwLmdldEZvcm1hdHRlZFRpbWVzdGFtcCgpLFxuXHRcdFx0XHRcdHR5cGU6IG9wdGlvbnMucGFsZXR0ZVR5cGVcblx0XHRcdFx0fSxcblx0XHRcdFx0aXRlbXM6IGV4dHJhY3RlZEl0ZW1zXG5cdFx0XHR9O1xuXHRcdH0sICdGYWlsZWQgdG8gZXh0cmFjdCBwYWxldHRlIGZyb20gRE9NJyk7XG5cdH1cblxuXHRwdWJsaWMgaGFuZGxlQ29sdW1uTG9jayhjb2x1bW5JRDogbnVtYmVyKTogdm9pZCB7XG5cdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKTtcblx0XHRjb25zdCBjb2x1bW5zID0gY3VycmVudFN0YXRlLnBhbGV0dGVDb250YWluZXIuY29sdW1ucztcblxuXHRcdC8vIGZpbmQgY29sdW1uIGJ5IElEXG5cdFx0Y29uc3QgY29sdW1uSW5kZXggPSBjb2x1bW5zLmZpbmRJbmRleChjb2wgPT4gY29sLmlkID09PSBjb2x1bW5JRCk7XG5cblx0XHRpZiAoY29sdW1uSW5kZXggPT09IC0xKSB7XG5cdFx0XHR0aGlzLmxvZyhgQ29sdW1uIHdpdGggSUQgJHtjb2x1bW5JRH0gbm90IGZvdW5kLmAsICd3YXJuJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gdG9nZ2xlIGxvY2sgc3RhdGVcblx0XHRjb2x1bW5zW2NvbHVtbkluZGV4XS5pc0xvY2tlZCA9ICFjb2x1bW5zW2NvbHVtbkluZGV4XS5pc0xvY2tlZDtcblxuXHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKGNvbHVtbnMsIHRydWUsIDIpO1xuXHR9XG5cblx0cHVibGljIGhhbmRsZUNvbHVtblJlc2l6ZShjb2x1bW5JRDogbnVtYmVyLCBuZXdTaXplOiBudW1iZXIpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKTtcblx0XHRcdGNvbnN0IGNvbHVtbnMgPSBjdXJyZW50U3RhdGUucGFsZXR0ZUNvbnRhaW5lci5jb2x1bW5zO1xuXG5cdFx0XHRjb25zdCBjb2x1bW5JbmRleCA9IGNvbHVtbnMuZmluZEluZGV4KGNvbCA9PiBjb2wuaWQgPT09IGNvbHVtbklEKTtcblx0XHRcdGlmIChjb2x1bW5JbmRleCA9PT0gLTEpIHtcblx0XHRcdFx0dGhpcy5sb2coYENvbHVtbiB3aXRoIElEICR7Y29sdW1uSUR9IG5vdCBmb3VuZC5gLCAnd2FybicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG1pblNpemUgPSBkYXRhLmNvbmZpZy51aS5taW5Db2x1bW5TaXplO1xuXHRcdFx0Y29uc3QgbWF4U2l6ZSA9IGRhdGEuY29uZmlnLnVpLm1heENvbHVtblNpemU7XG5cdFx0XHRjb25zdCBhZGp1c3RlZFNpemUgPSBNYXRoLm1heChtaW5TaXplLCBNYXRoLm1pbihuZXdTaXplLCBtYXhTaXplKSk7XG5cblx0XHRcdGNvbnN0IHNpemVEaWZmID0gYWRqdXN0ZWRTaXplIC0gY29sdW1uc1tjb2x1bW5JbmRleF0uc2l6ZTtcblx0XHRcdGNvbHVtbnNbY29sdW1uSW5kZXhdLnNpemUgPSBhZGp1c3RlZFNpemU7XG5cblx0XHRcdGNvbnN0IHVubG9ja2VkQ29sdW1ucyA9IGNvbHVtbnMuZmlsdGVyKFxuXHRcdFx0XHQoXywgaSkgPT4gaSAhPT0gY29sdW1uSW5kZXggJiYgIWNvbHVtbnNbaV0uaXNMb2NrZWRcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBkaXN0cmlidXRlQW1vdW50ID0gc2l6ZURpZmYgLyB1bmxvY2tlZENvbHVtbnMubGVuZ3RoO1xuXG5cdFx0XHR1bmxvY2tlZENvbHVtbnMuZm9yRWFjaChjb2wgPT4ge1xuXHRcdFx0XHRjb2wuc2l6ZSA9IE1hdGgubWF4KFxuXHRcdFx0XHRcdG1pblNpemUsXG5cdFx0XHRcdFx0TWF0aC5taW4oY29sLnNpemUgLSBkaXN0cmlidXRlQW1vdW50LCBtYXhTaXplKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIG5vcm1hbGl6ZSB0byAxMDAlXG5cdFx0XHRjb25zdCB0b3RhbFNpemUgPSBjb2x1bW5zLnJlZHVjZSgoc3VtLCBjb2wpID0+IHN1bSArIGNvbC5zaXplLCAwKTtcblx0XHRcdGNvbnN0IGNvcnJlY3Rpb25GYWN0b3IgPSAxMDAgLyB0b3RhbFNpemU7XG5cdFx0XHRjb2x1bW5zLmZvckVhY2goY29sID0+IChjb2wuc2l6ZSAqPSBjb3JyZWN0aW9uRmFjdG9yKSk7XG5cblx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKGNvbHVtbnMsIHRydWUsIDIpO1xuXHRcdH0sIGBGYWlsZWQgdG8gcmVzaXplIGNvbHVtbiAke2NvbHVtbklEfWApO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGxvYWRQYWxldHRlKCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGF3YWl0IHRoaXMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHRoaXMuc3RhdGVNYW5hZ2VyLmVuc3VyZVN0YXRlUmVhZHkoKTtcblxuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuc3RvcmFnZS5nZXRJdGVtKCdwYWxldHRlJyk7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHN0b3JlZFBhbGV0dGUgJiZcblx0XHRcdFx0dGhpcy51dGlscy50eXBlR3VhcmRzLmlzUGFsZXR0ZShzdG9yZWRQYWxldHRlKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLmFkZFBhbGV0dGVUb0hpc3Rvcnkoc3RvcmVkUGFsZXR0ZSk7XG5cdFx0XHRcdHRoaXMubG9nKGBTdG9yZWQgcGFsZXR0ZSBhZGRlZCB0byBoaXN0b3J5YCwgJ2RlYnVnJyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJhbmRvbU9wdGlvbnMgPVxuXHRcdFx0XHR0aGlzLnV0aWxzLnBhbGV0dGUuZ2V0UmFuZG9taXplZFBhbGV0ZU9wdGlvbnMoKTtcblx0XHRcdHRoaXMubG9nKFxuXHRcdFx0XHRgR2VuZXJhdGVkIHJhbmRvbWl6ZWQgcGFsZXR0ZSBvcHRpb25zOiAke0pTT04uc3RyaW5naWZ5KHJhbmRvbU9wdGlvbnMpfWAsXG5cdFx0XHRcdCdkZWJ1Zydcblx0XHRcdCk7XG5cblx0XHRcdGNvbnN0IG5ld1BhbGV0dGUgPSB0aGlzLmdlbmVyYXRlUGFsZXR0ZShcblx0XHRcdFx0cmFuZG9tT3B0aW9ucyxcblx0XHRcdFx0dGhpcy5jb21tb24sXG5cdFx0XHRcdHRoaXMuZ2VuZXJhdGVIdWVzLFxuXHRcdFx0XHR0aGlzLmdlbmVyYXRlUGFsZXR0ZUZuc1xuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy5zdGF0ZU1hbmFnZXIuYWRkUGFsZXR0ZVRvSGlzdG9yeShuZXdQYWxldHRlKTtcblx0XHRcdHRoaXMubG9nKGBOZXcgcGFsZXR0ZSBhZGRlZCB0byBoaXN0b3J5YCwgJ2RlYnVnJyk7XG5cblx0XHRcdGF3YWl0IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCdwYWxldHRlJywgbmV3UGFsZXR0ZSk7XG5cdFx0XHR0aGlzLmxvZyhgTmV3IHBhbGV0dGUgc3RvcmVkYCwgJ2RlYnVnJyk7XG5cblx0XHRcdHRoaXMucmVuZGVyUGFsZXR0ZUZyb21TdGF0ZSgpO1xuXHRcdFx0dGhpcy5sb2coYFBhbGV0dGUgcmVuZGVyZWQgZnJvbSBzdGF0ZWAsICdkZWJ1ZycpO1xuXHRcdH0sICdGYWlsZWQgdG8gbG9hZCBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVuZGVyTmV3UGFsZXR0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmVycm9ycy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBwYWxldHRlQ29udGFpbmVyID0gdGhpcy51dGlscy5jb3JlLmdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdFx0XHRpZHMuZGl2cy5wYWxldHRlQ29udGFpbmVyXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIXBhbGV0dGVDb250YWluZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIGNvbnRhaW5lciBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcmV0cmlldmUgcGFsZXR0ZSBnZW5lcmF0aW9uIG9wdGlvbnNcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB0aGlzLnV0aWxzLnBhbGV0dGUuZ2V0UGFsZXR0ZU9wdGlvbnNGcm9tVUkoKTtcblx0XHRcdHRoaXMubG9nKGBQYWxldHRlIG9wdGlvbnM6ICR7SlNPTi5zdHJpbmdpZnkob3B0aW9ucyl9YCwgJ2RlYnVnJyk7XG5cblx0XHRcdC8vIHN0b3JlIHRoZSBvbGQgcGFsZXR0ZSBpbiBoaXN0b3J5XG5cdFx0XHRjb25zdCBvbGRQYWxldHRlID0gdGhpcy5zdGF0ZU1hbmFnZXJcblx0XHRcdFx0LmdldFN0YXRlKClcblx0XHRcdFx0LnBhbGV0dGVIaXN0b3J5LmF0KC0xKTtcblx0XHRcdGlmIChvbGRQYWxldHRlKSB0aGlzLnN0YXRlTWFuYWdlci5hZGRQYWxldHRlVG9IaXN0b3J5KG9sZFBhbGV0dGUpO1xuXG5cdFx0XHQvLyBjbGVhciB0aGUgZXhpc3RpbmcgcGFsZXR0ZVxuXHRcdFx0cGFsZXR0ZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuXHRcdFx0Ly8gZ2VuZXJhdGUgYSBuZXcgcGFsZXR0ZVxuXHRcdFx0Y29uc3QgbmV3UGFsZXR0ZSA9IHRoaXMuZ2VuZXJhdGVQYWxldHRlKFxuXHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHR0aGlzLmNvbW1vbixcblx0XHRcdFx0dGhpcy5nZW5lcmF0ZUh1ZXMsXG5cdFx0XHRcdHRoaXMuZ2VuZXJhdGVQYWxldHRlRm5zXG5cdFx0XHQpO1xuXG5cdFx0XHQvLyBlbnN1cmUgdmFsaWQgcGFsZXR0ZSBiZWZvcmUgc3RvcmluZ1xuXHRcdFx0aWYgKCF0aGlzLnV0aWxzLnR5cGVHdWFyZHMuaXNQYWxldHRlKG5ld1BhbGV0dGUpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignR2VuZXJhdGVkIHBhbGV0dGUgaXMgaW52YWxpZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zdGF0ZU1hbmFnZXIuYWRkUGFsZXR0ZVRvSGlzdG9yeShuZXdQYWxldHRlKTtcblx0XHRcdGF3YWl0IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCdwYWxldHRlJywgbmV3UGFsZXR0ZSk7XG5cblx0XHRcdC8vIGNyZWF0ZSBhbmQgYXBwZW5kIHBhbGV0dGUgY29sdW1uc1xuXHRcdFx0Y29uc3QgY29sdW1uV2lkdGggPSAxMDAgLyBuZXdQYWxldHRlLml0ZW1zLmxlbmd0aDtcblx0XHRcdGNvbnN0IHZhbGlkQ29sb3JTcGFjZSA9IFsnaGV4JywgJ2hzbCcsICdyZ2InXS5pbmNsdWRlcyhcblx0XHRcdFx0dGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKS5wcmVmZXJlbmNlcy5jb2xvclNwYWNlXG5cdFx0XHQpXG5cdFx0XHRcdD8gdGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKS5wcmVmZXJlbmNlcy5jb2xvclNwYWNlXG5cdFx0XHRcdDogJ2hleCc7XG5cblx0XHRcdGNvbnN0IGNvbHVtbnMgPSBuZXdQYWxldHRlLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBpbmRleCArIDE7XG5cdFx0XHRcdGNvbnN0IGNvbG9yVmFsdWUgPVxuXHRcdFx0XHRcdGl0ZW0uY3NzW3ZhbGlkQ29sb3JTcGFjZSBhcyBrZXlvZiBQYWxldHRlSXRlbVsnY3NzJ11dIHx8XG5cdFx0XHRcdFx0aXRlbS5jc3MuaGV4O1xuXG5cdFx0XHRcdGNvbnN0IGNvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRjb2x1bW4uaWQgPSBgcGFsZXR0ZS1jb2x1bW4tJHtjb2x1bW5JRH1gO1xuXHRcdFx0XHRjb2x1bW4uY2xhc3NOYW1lID0gJ3BhbGV0dGUtY29sdW1uJztcblx0XHRcdFx0Y29sdW1uLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgJ3RydWUnKTtcblx0XHRcdFx0Y29sdW1uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yVmFsdWU7XG5cblx0XHRcdFx0Ly8gYWRkIFVJIGVsZW1lbnRzIGluc2lkZSB0aGUgY29sdW1uXG5cdFx0XHRcdHRoaXMuY3JlYXRlQ29sdW1uSW5VSShjb2x1bW4sIGNvbHVtbklELCBjb2xvclZhbHVlKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbHVtbixcblx0XHRcdFx0XHRzdGF0ZToge1xuXHRcdFx0XHRcdFx0aWQ6IGNvbHVtbklELFxuXHRcdFx0XHRcdFx0aXNMb2NrZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cG9zaXRpb246IGNvbHVtbklELFxuXHRcdFx0XHRcdFx0c2l6ZTogY29sdW1uV2lkdGhcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYXBwZW5kIG5ldyBjb2x1bW5zIHRvIHRoZSBwYWxldHRlIGNvbnRhaW5lclxuXHRcdFx0Y29sdW1ucy5mb3JFYWNoKCh7IGNvbHVtbiB9KSA9PlxuXHRcdFx0XHRwYWxldHRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbHVtbilcblx0XHRcdCk7XG5cblx0XHRcdC8vIHVwZGF0ZSBzdGF0ZSB3aXRoIG5ldyBjb2x1bW5zXG5cdFx0XHR0aGlzLnN0YXRlTWFuYWdlci51cGRhdGVQYWxldHRlQ29sdW1ucyhcblx0XHRcdFx0Y29sdW1ucy5tYXAoY29sID0+IGNvbC5zdGF0ZSksXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdDNcblx0XHRcdCk7XG5cdFx0fSwgJ0ZhaWxlZCB0byByZW5kZXIgYSBuZXcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlbmRlclBhbGV0dGVGcm9tU3RhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgdGhpcy5zdGF0ZU1hbmFnZXIuZW5zdXJlU3RhdGVSZWFkeSgpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbnRhaW5lciA9IHRoaXMudXRpbHMuY29yZS5nZXRFbGVtZW50PEhUTUxEaXZFbGVtZW50Pihcblx0XHRcdFx0aWRzLmRpdnMucGFsZXR0ZUNvbnRhaW5lclxuXHRcdFx0KTtcblx0XHRcdGlmICghcGFsZXR0ZUNvbnRhaW5lcikge1xuXHRcdFx0XHR0aGlzLmxvZygnUGFsZXR0ZSBjb250YWluZXIgbm90IGZvdW5kJywgJ2Vycm9yJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIENsZWFyIGV4aXN0aW5nIGNvbnRlbnRcblx0XHRcdHBhbGV0dGVDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHQvLyBHZXQgdGhlIG1vc3QgcmVjZW50IHBhbGV0dGUgZnJvbSBoaXN0b3J5XG5cdFx0XHRjb25zdCBjdXJyZW50U3RhdGUgPSB0aGlzLnN0YXRlTWFuYWdlci5nZXRTdGF0ZSgpO1xuXHRcdFx0Y29uc3QgbGF0ZXN0UGFsZXR0ZSA9IGN1cnJlbnRTdGF0ZS5wYWxldHRlSGlzdG9yeS5hdCgtMSk7XG5cdFx0XHRpZiAoIWxhdGVzdFBhbGV0dGUpIHtcblx0XHRcdFx0dGhpcy5sb2coXG5cdFx0XHRcdFx0J05vIHNhdmVkIHBhbGV0dGVzIGluIGhpc3RvcnkuIENhbm5vdCByZW5kZXIuJyxcblx0XHRcdFx0XHQnZGVidWcnXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIFJldHJpZXZlIHVzZXIncyBwcmVmZXJyZWQgY29sb3IgZm9ybWF0XG5cdFx0XHRjb25zdCBjb2xvclNwYWNlID0gY3VycmVudFN0YXRlLnByZWZlcmVuY2VzPy5jb2xvclNwYWNlIHx8ICdoZXgnO1xuXHRcdFx0Y29uc3QgdmFsaWRDb2xvclNwYWNlID0gWydoZXgnLCAnaHNsJywgJ3JnYiddLmluY2x1ZGVzKGNvbG9yU3BhY2UpXG5cdFx0XHRcdD8gY29sb3JTcGFjZVxuXHRcdFx0XHQ6ICdoZXgnO1xuXHRcdFx0Y29uc3QgY29sdW1uQ291bnQgPSBsYXRlc3RQYWxldHRlLm1ldGFkYXRhLmNvbHVtbkNvdW50O1xuXHRcdFx0Y29uc3QgY29sdW1uV2lkdGggPSAxMDAgLyBjb2x1bW5Db3VudDtcblx0XHRcdGNvbnN0IGNvbHVtbnMgPSBsYXRlc3RQYWxldHRlLml0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdFx0Y29uc3QgY29sdW1uSUQgPSBpdGVtLml0ZW1JRDtcblx0XHRcdFx0Y29uc3QgY29sb3JWYWx1ZSA9XG5cdFx0XHRcdFx0aXRlbS5jc3NbdmFsaWRDb2xvclNwYWNlIGFzIGtleW9mIFBhbGV0dGVJdGVtWydjc3MnXV0gfHxcblx0XHRcdFx0XHRpdGVtLmNzcy5oZXg7XG5cdFx0XHRcdGNvbnN0IGNvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRjb2x1bW4uaWQgPSBgcGFsZXR0ZS1jb2x1bW4tJHtjb2x1bW5JRH1gO1xuXHRcdFx0XHRjb2x1bW4uY2xhc3NOYW1lID0gJ3BhbGV0dGUtY29sdW1uJztcblx0XHRcdFx0Y29sdW1uLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgJ3RydWUnKTtcblx0XHRcdFx0Y29sdW1uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yVmFsdWU7XG5cdFx0XHRcdC8vIEFkZCBVSSBlbGVtZW50cyBpbnNpZGUgdGhlIGNvbHVtblxuXHRcdFx0XHR0aGlzLmNyZWF0ZUNvbHVtbkluVUkoY29sdW1uLCBjb2x1bW5JRCwgY29sb3JWYWx1ZSk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Y29sdW1uLFxuXHRcdFx0XHRcdHN0YXRlOiB7XG5cdFx0XHRcdFx0XHRpZDogY29sdW1uSUQsXG5cdFx0XHRcdFx0XHRpc0xvY2tlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogaW5kZXggKyAxLFxuXHRcdFx0XHRcdFx0c2l6ZTogY29sdW1uV2lkdGhcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRcdC8vIEFwcGVuZCBuZXcgY29sdW1ucyB0byB0aGUgcGFsZXR0ZSBjb250YWluZXJcblx0XHRcdGNvbHVtbnMuZm9yRWFjaCgoeyBjb2x1bW4gfSkgPT5cblx0XHRcdFx0cGFsZXR0ZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjb2x1bW4pXG5cdFx0XHQpO1xuXHRcdFx0Ly8gVXBkYXRlIHN0YXRlIHdpdGggbmV3IGNvbHVtbnNcblx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKFxuXHRcdFx0XHRjb2x1bW5zLm1hcChjb2wgPT4gY29sLnN0YXRlKSxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0M1xuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy5zdGF0ZU1hbmFnZXIudXBkYXRlUGFsZXR0ZUhpc3RvcnkoW2xhdGVzdFBhbGV0dGVdKTtcblxuXHRcdFx0YXdhaXQgdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3BhbGV0dGUnLCBsYXRlc3RQYWxldHRlKTtcblx0XHRcdHRoaXMubG9nKFxuXHRcdFx0XHRgUmVzdG9yZWQgJHtjb2x1bW5zLmxlbmd0aH0gY29sdW1ucyBmcm9tIHNhdmVkIHN0YXRlLmAsXG5cdFx0XHRcdCdkZWJ1Zydcblx0XHRcdCk7XG5cdFx0fSwgJ0ZhaWxlZCB0byByZW5kZXIgcGFsZXR0ZSBmcm9tIHN0YXRlJyk7XG5cdH1cblxuXHRwdWJsaWMgc3dhcENvbHVtbnMoZHJhZ2dlZElEOiBudW1iZXIsIHRhcmdldElEOiBudW1iZXIpOiB2b2lkIHtcblx0XHR0aGlzLmVycm9ycy5oYW5kbGUoKCkgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKTtcblx0XHRcdGNvbnN0IGNvbHVtbnMgPSBbLi4uY3VycmVudFN0YXRlLnBhbGV0dGVDb250YWluZXIuY29sdW1uc107XG5cblx0XHRcdGNvbnN0IGRyYWdnZWRJbmRleCA9IGNvbHVtbnMuZmluZEluZGV4KGNvbCA9PiBjb2wuaWQgPT09IGRyYWdnZWRJRCk7XG5cdFx0XHRjb25zdCB0YXJnZXRJbmRleCA9IGNvbHVtbnMuZmluZEluZGV4KGNvbCA9PiBjb2wuaWQgPT09IHRhcmdldElEKTtcblxuXHRcdFx0aWYgKGRyYWdnZWRJbmRleCA9PT0gLTEgfHwgdGFyZ2V0SW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdHRoaXMubG9nKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gc3dhcCBjb2x1bW5zOiBDb2x1bW4gSUQgJHtkcmFnZ2VkSUR9IG9yICR7dGFyZ2V0SUR9IG5vdCBmb3VuZC5gLFxuXHRcdFx0XHRcdCd3YXJuJ1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIHN3YXAgcG9zaXRpb25zIGluIHRoZSBhcnJheVxuXHRcdFx0W2NvbHVtbnNbZHJhZ2dlZEluZGV4XS5wb3NpdGlvbiwgY29sdW1uc1t0YXJnZXRJbmRleF0ucG9zaXRpb25dID0gW1xuXHRcdFx0XHRjb2x1bW5zW3RhcmdldEluZGV4XS5wb3NpdGlvbixcblx0XHRcdFx0Y29sdW1uc1tkcmFnZ2VkSW5kZXhdLnBvc2l0aW9uXG5cdFx0XHRdO1xuXG5cdFx0XHQvLyBzb3J0IHRoZSBhcnJheSBiYXNlZCBvbiB0aGUgbmV3IHBvc2l0aW9uc1xuXHRcdFx0Y29sdW1ucy5zb3J0KChhLCBiKSA9PiBhLnBvc2l0aW9uIC0gYi5wb3NpdGlvbik7XG5cblx0XHRcdC8vIHVwZGF0ZSBzdGF0ZSB3aXRoIG5ldyBjb2x1bW4gb3JkZXJcblx0XHRcdHRoaXMuc3RhdGVNYW5hZ2VyLnVwZGF0ZVBhbGV0dGVDb2x1bW5zKGNvbHVtbnMsIHRydWUsIDMpO1xuXG5cdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0YFN3YXBwZWQgY29sdW1ucyAke2RyYWdnZWRJRH0gYW5kICR7dGFyZ2V0SUR9LiBOZXcgb3JkZXI6ICR7Y29sdW1ucy5tYXAoY29sID0+IGNvbC5pZCkuam9pbignLCAnKX1gLFxuXHRcdFx0XHQnZGVidWcnXG5cdFx0XHQpO1xuXHRcdH0sIGBGYWlsZWQgdG8gc3dhcCBjb2x1bW5zICR7ZHJhZ2dlZElEfSBhbmQgJHt0YXJnZXRJRH1gKTtcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlQ29sdW1uSW5VSShcblx0XHRjb2x1bW46IEhUTUxFbGVtZW50LFxuXHRcdGNvbHVtbklEOiBudW1iZXIsXG5cdFx0Y29sb3JWYWx1ZTogc3RyaW5nXG5cdCk6IHZvaWQge1xuXHRcdHRoaXMuZXJyb3JzLmhhbmRsZShcblx0XHRcdCgpID0+IHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZU1hbmFnZXIuZ2V0U3RhdGUoKTtcblx0XHRcdFx0Y29uc3QgY29sb3JTcGFjZSA9IGN1cnJlbnRTdGF0ZS5wcmVmZXJlbmNlcy5jb2xvclNwYWNlO1xuXG5cdFx0XHRcdGlmICghdGhpcy51dGlscy52YWxpZGF0ZS51c2VyQ29sb3JJbnB1dChjb2xvclZhbHVlKSkge1xuXHRcdFx0XHRcdHRoaXMubG9nKFxuXHRcdFx0XHRcdFx0YEludmFsaWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX0uIFVuYWJsZSB0byByZW5kZXIgY29sdW1uIFVJLmBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHZhbGlkQ29sb3JTcGFjZSA9IFsnaGV4JywgJ2hzbCcsICdyZ2InXS5pbmNsdWRlcyhcblx0XHRcdFx0XHRjb2xvclNwYWNlXG5cdFx0XHRcdClcblx0XHRcdFx0XHQ/IGNvbG9yU3BhY2Vcblx0XHRcdFx0XHQ6ICdoZXgnO1xuXG5cdFx0XHRcdGNvbHVtbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvclZhbHVlO1xuXG5cdFx0XHRcdC8vIGNyZWF0ZSBjb2xvciBkaXNwbGF5IGlucHV0XG5cdFx0XHRcdGNvbnN0IGNvbG9yRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdFx0XHRcdGNvbG9yRGlzcGxheS5pZCA9IGBjb2xvci1kaXNwbGF5LSR7Y29sdW1uSUR9YDtcblx0XHRcdFx0Y29sb3JEaXNwbGF5LmNsYXNzTmFtZSA9ICdjb2xvci1kaXNwbGF5Jztcblx0XHRcdFx0Y29sb3JEaXNwbGF5LnR5cGUgPSAndGV4dCc7XG5cdFx0XHRcdGNvbG9yRGlzcGxheS52YWx1ZSA9IGNvbG9yVmFsdWU7XG5cdFx0XHRcdGNvbG9yRGlzcGxheS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdmFsaWRDb2xvclNwYWNlKTtcblxuXHRcdFx0XHQvLyBjcmVhdGUgY29sb3IgaW5wdXQgYnV0dG9uXG5cdFx0XHRcdGNvbnN0IGNvbG9ySW5wdXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRcdFx0Y29sb3JJbnB1dEJ0bi5pZCA9IGBjb2xvci1pbnB1dC1idG4tJHtjb2x1bW5JRH1gO1xuXHRcdFx0XHRjb2xvcklucHV0QnRuLmNsYXNzTmFtZSA9ICdjb2xvci1pbnB1dC1idG4nO1xuXHRcdFx0XHRjb2xvcklucHV0QnRuLnRleHRDb250ZW50ID0gJ0NoYW5nZSBDb2xvcic7XG5cblx0XHRcdFx0Ly8gY3JlYXRlIGxvY2sgYnV0dG9uXG5cdFx0XHRcdGNvbnN0IGxvY2tCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRcdFx0bG9ja0J0bi5pZCA9IGBsb2NrLWJ0bi0ke2NvbHVtbklEfWA7XG5cdFx0XHRcdGxvY2tCdG4uY2xhc3NOYW1lID0gJ2xvY2stYnRuJztcblx0XHRcdFx0bG9ja0J0bi50ZXh0Q29udGVudCA9ICdMb2NrIPCflJInO1xuXG5cdFx0XHRcdC8vIGNyZWF0ZSBkcmFnIGhhbmRsZSBidXR0b25cblx0XHRcdFx0Y29uc3QgZHJhZ0hhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRkcmFnSGFuZGxlLmlkID0gYGRyYWctaGFuZGxlLSR7Y29sdW1uSUR9YDtcblx0XHRcdFx0ZHJhZ0hhbmRsZS5jbGFzc05hbWUgPSAnZHJhZy1oYW5kbGUnO1xuXHRcdFx0XHRkcmFnSGFuZGxlLnRleHRDb250ZW50ID0gJ01vdmUg4piwJztcblxuXHRcdFx0XHQvLyBjcmVhdGUgcmVzaXplIGhhbmRsZVxuXHRcdFx0XHRjb25zdCByZXNpemVIYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0cmVzaXplSGFuZGxlLmlkID0gYHJlc2l6ZS1oYW5kbGUtJHtjb2x1bW5JRH1gO1xuXHRcdFx0XHRyZXNpemVIYW5kbGUuY2xhc3NOYW1lID0gJ3Jlc2l6ZS1oYW5kbGUnO1xuXG5cdFx0XHRcdC8vIGNyZWF0ZSBjb2xvciBpbnB1dCBtb2RhbFxuXHRcdFx0XHRjb25zdCBjb2xvcklucHV0TW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0Y29sb3JJbnB1dE1vZGFsLmlkID0gYGNvbG9yLWlucHV0LW1vZGFsLSR7Y29sdW1uSUR9YDtcblx0XHRcdFx0Y29sb3JJbnB1dE1vZGFsLmNsYXNzTmFtZSA9ICdjb2xvci1pbnB1dC1tb2RhbCBoaWRkZW4nO1xuXG5cdFx0XHRcdC8vIGNyZWF0ZSBjb2xvciBpbnB1dCBpbnNpZGUgdGhlIG1vZGFsXG5cdFx0XHRcdGNvbnN0IGNvbG9ySW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXHRcdFx0XHRjb2xvcklucHV0LmlkID0gYGNvbG9yLWlucHV0LSR7Y29sdW1uSUR9YDtcblx0XHRcdFx0Y29sb3JJbnB1dC5jbGFzc05hbWUgPSAnY29sb3ItaW5wdXQnO1xuXHRcdFx0XHRjb2xvcklucHV0LnR5cGUgPSAnY29sb3InO1xuXHRcdFx0XHRjb2xvcklucHV0LnZhbHVlID0gY29sb3JWYWx1ZTtcblxuXHRcdFx0XHQvLyBhcHBlbmQgZWxlbWVudHMgdG8gdGhlaXIgcGFyZW50XG5cdFx0XHRcdGNvbG9ySW5wdXRNb2RhbC5hcHBlbmRDaGlsZChjb2xvcklucHV0KTtcblx0XHRcdFx0Y29sdW1uLmFwcGVuZENoaWxkKGNvbG9yRGlzcGxheSk7XG5cdFx0XHRcdGNvbHVtbi5hcHBlbmRDaGlsZChjb2xvcklucHV0QnRuKTtcblx0XHRcdFx0Y29sdW1uLmFwcGVuZENoaWxkKGxvY2tCdG4pO1xuXHRcdFx0XHRjb2x1bW4uYXBwZW5kQ2hpbGQoZHJhZ0hhbmRsZSk7XG5cdFx0XHRcdGNvbHVtbi5hcHBlbmRDaGlsZChyZXNpemVIYW5kbGUpO1xuXHRcdFx0XHRjb2x1bW4uYXBwZW5kQ2hpbGQoY29sb3JJbnB1dE1vZGFsKTtcblx0XHRcdH0sXG5cdFx0XHQnRmFpbGVkIHRvIGNyZWF0ZSBjb2x1bW4gVUkgZWxlbWVudHMnLFxuXHRcdFx0eyBjb2x1bW5JRCwgY29sb3JWYWx1ZSB9XG5cdFx0KTtcblx0fVxufVxuIl19