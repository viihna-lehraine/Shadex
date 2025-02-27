import '../config/partials/defaults.js';
import { domConfig } from '../config/partials/dom.js';
import '../config/partials/regex.js';

// File: state/PaletteState.ts
const caller = 'PaletteState';
class PaletteStateService {
    static #instance = null;
    #errors;
    #log;
    #stateManager;
    constructor(services, stateManager) {
        try {
            services.log.info(`Constructing PaletteState instance`, `${caller} constructor`);
            this.#errors = services.errors;
            this.#log = services.log;
            this.#stateManager = stateManager;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(services, stateManager) {
        return services.errors.handleSync(() => {
            if (!PaletteStateService.#instance) {
                services.log.debug('Creating PaletteState instance', `${caller}.getInstance`);
                PaletteStateService.#instance = new PaletteStateService(services, stateManager);
            }
            return PaletteStateService.#instance;
        }, `[${caller}.getInstance]: Failed to create PaletteState instance.`);
    }
    async handleColumnLock(columnID) {
        return this.#errors.handleAsync(async () => {
            const state = await this.#stateManager.getState();
            const updatedColumns = state.paletteContainer.columns.map(col => col.id === columnID ? { ...col, isLocked: !col.isLocked } : col);
            this.#stateManager.updatePaletteColumns(updatedColumns, true);
        }, `[${caller}]: Failed to toggle lock for column ${columnID}`);
    }
    async handleColumnResize(columnID, newSize) {
        return this.#errors.handleAsync(async () => {
            const currentState = await this.#stateManager.getState();
            const columns = currentState.paletteContainer.columns;
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
            this.#stateManager.updatePaletteColumns(normalizedColumns, true);
        }, `[${caller}]: Failed to resize column ${columnID}`);
    }
    async swapColumns(draggedID, targetID) {
        return await this.#errors.handleAsync(async () => {
            const currentState = await this.#stateManager.getState();
            const columns = currentState.paletteContainer.columns;
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
            this.#stateManager.updatePaletteColumns(sortedColumns, true);
            this.#log.debug(`Swapped columns ${draggedID} and ${targetID}. New order: ${sortedColumns.map(col => col.id).join(', ')}`, `${caller}.swapColumns`);
        }, `Failed to swap columns ${draggedID} and ${targetID}`);
    }
    async updateColumnSize(columnID, newSize) {
        const currentState = await this.#stateManager.getState();
        const { columns } = currentState.paletteContainer;
        const columnIndex = columns.findIndex(col => col.id === columnID);
        if (columnIndex === -1)
            return;
        const minSize = domConfig.minColumnSize;
        const maxSize = domConfig.maxColumnSize;
        const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));
        const updatedColumns = columns.map(col => col.id === columnID ? { ...col, size: adjustedSize } : col);
        await this.#stateManager.batchUpdate({
            paletteContainer: {
                ...currentState.paletteContainer,
                columns: updatedColumns
            }
        });
    }
}

export { PaletteStateService };
//# sourceMappingURL=PaletteStateService.js.map
