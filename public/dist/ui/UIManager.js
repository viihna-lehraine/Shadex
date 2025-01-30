// File: src/ui/UIManager.ts
import { IDBManager } from '../db/IDBManager.js';
import { commonFn } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { constsData as consts } from '../data/consts.js';
import { domData } from '../data/dom.js';
import { fileUtils } from '../dom/fileUtils.js';
import { ioFn } from '../io/index.js';
import { modeData as mode } from '../data/mode.js';
const thisModule = 'ui/UIManager.ts';
const logger = await createLogger();
export class UIManager {
    static instanceCounter = 0; // static instance ID counter
    static instances = new Map(); // instance registry
    id; // unique instance ID
    currentPalette = null;
    paletteHistory = [];
    idbManager = null;
    consts;
    domData;
    logMode;
    mode;
    conversionUtils;
    coreUtils;
    helpers;
    utils;
    fileUtils;
    ioFn;
    getCurrentPaletteFn;
    getStoredPalette;
    constructor() {
        this.init();
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.paletteHistory = [];
        this.consts = consts;
        this.domData = domData;
        this.logMode = mode.logging;
        this.mode = mode;
        this.coreUtils = commonFn.core;
        this.helpers = commonFn.helpers;
        this.utils = commonFn.utils;
        this.conversionUtils = commonFn.convert;
        this.fileUtils = fileUtils;
        this.ioFn = ioFn;
    }
    /* PUBLIC METHODS */
    async addPaletteToHistory(palette) {
        const thisMethod = 'addPaletteToHistory()';
        const idbManager = await IDBManager.getInstance();
        const maxHistory = (await idbManager.getSettings()).maxHistory;
        try {
            const history = await idbManager.getPaletteHistory();
            const newID = await idbManager.getNextPaletteID();
            const idString = `${palette.metadata.type}_${newID}`;
            await idbManager.savePaletteHistory(history);
            if (!this.mode.quiet &&
                this.mode.debug &&
                this.logMode.verbosity > 2)
                logger.info(`Added palette with ID ${idString} to history`, `${thisModule} > ${thisMethod}`);
        }
        catch (error) {
            logger.error(`Error adding palette to history: ${error}`, `${thisModule} > ${thisMethod}`);
        }
        this.paletteHistory.unshift(palette);
        if (this.paletteHistory.length > maxHistory)
            this.paletteHistory.pop();
        if (this.idbManager) {
            await this.idbManager.savePaletteHistory(this.paletteHistory);
        }
        else {
            const idbManager = await IDBManager.getInstance();
            await idbManager.savePaletteHistory(this.paletteHistory);
        }
        this.updateHistoryUI();
    }
    applyCustomColor() {
        const thisMethod = 'applyCustomColor()';
        try {
            const colorPicker = document.getElementById('custom-color-picker');
            if (!colorPicker) {
                throw new Error('Color picker element not found');
            }
            const rawValue = colorPicker.value.trim();
            // *DEV-NOTE* Add this to the Data object
            const selectedFormat = document.getElementById('custom-color-format')?.value;
            if (!this.utils.color.isColorSpace(selectedFormat)) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Unsupported color format: ${selectedFormat}`);
            }
            const parsedColor = this.utils.color.parseColor(selectedFormat, rawValue);
            if (!parsedColor) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Invalid color value: ${rawValue}`);
            }
            const hslColor = this.utils.color.isHSLColor(parsedColor)
                ? parsedColor
                : this.conversionUtils.toHSL(parsedColor);
            return hslColor;
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`, `${thisModule} > ${thisMethod}`);
            return this.utils.random.hsl();
        }
    }
    async applyFirstColorToUI(color) {
        const thisMethod = 'applyFirstColorToUI()';
        try {
            const colorBox1 = this.domData.elements.dynamic.divs.colorBox1;
            if (!colorBox1) {
                if (this.logMode.error)
                    logger.error('color-box-1 is null', `${thisModule} > ${thisMethod}`);
                return color;
            }
            const formatColorString = await this.coreUtils.convert.colorToCSSColorString(color);
            if (!formatColorString) {
                if (this.logMode.error)
                    logger.error('Unexpected or unsupported color format.', `${thisModule} > ${thisMethod}`);
                return color;
            }
            colorBox1.style.backgroundColor = formatColorString;
            this.utils.palette.populateOutputBox(color, 1);
            return color;
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to apply first color to UI: ${error}`, `${thisModule} > ${thisMethod}`);
            return this.utils.random.hsl();
        }
    }
    copyToClipboard(text, tooltipElement) {
        const thisMethod = 'copyToClipboard()';
        try {
            const colorValue = text.replace('Copied to clipboard!', '').trim();
            navigator.clipboard
                .writeText(colorValue)
                .then(() => {
                this.helpers.dom.showTooltip(tooltipElement);
                if (!this.mode.quiet &&
                    this.mode.debug &&
                    this.logMode.verbosity > 2 &&
                    this.logMode.info) {
                    logger.info(`Copied color value: ${colorValue}`, `${thisModule} > ${thisMethod}`);
                }
                setTimeout(() => tooltipElement.classList.remove('show'), this.consts.timeouts.tooltip || 1000);
            })
                .catch(err => {
                if (this.logMode.error)
                    logger.error(`Error copying to clipboard: ${err}`, `${thisModule} > ${thisMethod}`);
            });
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to copy to clipboard: ${error}`, `${thisModule} > ${thisMethod}`);
        }
    }
    createPaletteTable(palette) {
        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        table.classList.add('palette-table');
        palette.palette.items.forEach((item, index) => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            const colorBox = document.createElement('div');
            cell.textContent = `Color ${index + 1}`;
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = item.colors.css.hex;
            row.appendChild(colorBox);
            row.appendChild(cell);
            table.appendChild(row);
        });
        fragment.appendChild(table);
        return fragment;
    }
    desaturateColor(selectedColor) {
        const thisMethod = 'desaturateColor()';
        try {
            this.getElementsForSelectedColor(selectedColor);
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to desaturate color: ${error}`, `${thisModule} > ${thisMethod}`);
        }
    }
    getElementsForSelectedColor(selectedColor) {
        const thisMethod = 'getElementsForSelectedColor()';
        const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
        if (!selectedColorBox) {
            if (this.logMode.warn)
                logger.warn(`Element not found for color ${selectedColor}`, `${thisModule} > ${thisMethod}`);
            this.helpers.dom.showToast('Please select a valid color.');
            return {
                selectedColorTextOutputBox: null,
                selectedColorBox: null,
                selectedColorStripe: null
            };
        }
        return {
            selectedColorTextOutputBox: document.getElementById(`color-text-output-box-${selectedColor}`),
            selectedColorBox,
            selectedColorStripe: document.getElementById(`color-stripe-${selectedColor}`)
        };
    }
    getID() {
        return this.id;
    }
    static getAllInstances() {
        return Array.from(UIManager.instances.values());
    }
    async getCurrentPalette() {
        if (this.getCurrentPaletteFn) {
            return await this.getCurrentPaletteFn();
        }
        return (this.currentPalette ||
            (this.paletteHistory.length > 0 ? this.paletteHistory[0] : null));
    }
    static getInstanceById(id) {
        return UIManager.instances.get(id);
    }
    static deleteInstanceById(id) {
        UIManager.instances.delete(id);
    }
    async handleExport(format) {
        const thisMethod = 'handleExport()';
        try {
            const palette = await this.getCurrentPalette();
            if (!palette) {
                logger.error('No palette available for export', `${thisModule} > ${thisMethod}`);
                return;
            }
            switch (format) {
                case 'css':
                    this.ioFn.exportPalette(palette, format);
                    break;
                case 'json':
                    this.ioFn.exportPalette(palette, format);
                    break;
                case 'xml':
                    this.ioFn.exportPalette(palette, format);
                    break;
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
        }
        catch (error) {
            if (this.logMode.error && this.logMode.verbosity > 1)
                logger.error(`Failed to export palette: ${error}`, `${thisModule} > ${thisMethod}`);
        }
    }
    async handleImport(file, format) {
        try {
            const thisMethod = 'handleImport()';
            const data = await this.fileUtils.readFile(file);
            let palette = null;
            switch (format) {
                case 'JSON':
                    palette = await this.ioFn.deserialize.fromJSON(data);
                    if (!palette) {
                        if (this.logMode.error && this.logMode.verbosity > 1) {
                            logger.error('Failed to deserialize JSON data', `${thisModule} > ${thisMethod}`);
                        }
                        return;
                    }
                    break;
                case 'XML':
                    palette =
                        (await this.ioFn.deserialize.fromXML(data)) || null;
                    break;
                case 'CSS':
                    palette =
                        (await this.ioFn.deserialize.fromCSS(data)) || null;
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            if (!palette) {
                if (this.logMode.error && this.logMode.verbosity > 1) {
                    logger.error(`Failed to deserialize ${format} data`, `${thisModule} > ${thisMethod}`);
                }
                return;
            }
            this.addPaletteToHistory(palette);
            if (this.logMode.info && this.logMode.verbosity > 1) {
                logger.info(`Successfully imported palette in ${format} format.`, `${thisModule} > ${thisMethod}`);
            }
        }
        catch (error) {
            logger.error(`Failed to import file: ${error}`, `${thisModule} > handleImport()`);
        }
    }
    pullParamsFromUI() {
        const thisMethod = 'pullParamsFromUI()';
        try {
            const paletteTypeElement = domData.elements.static.selects.paletteType;
            const numSwatchesElement = domData.elements.static.selects.swatchGen;
            const limitDarkChkbx = domData.elements.static.inputs.limitDarkChkbx;
            const limitGrayChkbx = domData.elements.static.inputs.limitGrayChkbx;
            const limitLightChkbx = domData.elements.static.inputs.limitLightChkbx;
            if (!paletteTypeElement &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger.warn('paletteTypeOptions DOM element not found', `${thisModule} > ${thisMethod}`);
            }
            if (!numSwatchesElement &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger.warn(`numBoxes DOM element not found`, `${thisModule} > ${thisMethod}`);
            }
            if ((!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger.warn(`One or more checkboxes not found`, `${thisModule} > ${thisMethod}`);
            }
            return {
                type: paletteTypeElement
                    ? parseInt(paletteTypeElement.value, 10)
                    : 0,
                swatches: numSwatchesElement
                    ? parseInt(numSwatchesElement.value, 10)
                    : 0,
                limitDark: limitDarkChkbx?.checked || false,
                limitGray: limitGrayChkbx?.checked || false,
                limitLight: limitLightChkbx?.checked || false
            };
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to pull parameters from UI: ${error}`, `${thisModule} > ${thisMethod}`);
            return {
                type: 0,
                swatches: 0,
                limitDark: false,
                limitGray: false,
                limitLight: false
            };
        }
    }
    async removePaletteFromHistory(paletteID) {
        const thisMethod = 'removePaletteFromHistory()';
        try {
            const entry = document.getElementById(`palette_${paletteID}`);
            if (!entry)
                return;
            entry.remove();
            const idbManager = await IDBManager.getInstance();
            this.paletteHistory = this.paletteHistory.filter(p => p.id !== paletteID);
            await idbManager.savePaletteHistory(this.paletteHistory);
            if (!this.mode.quiet)
                logger.info(`Removed palette ${paletteID} from history`, `${thisModule} > ${thisMethod}`);
        }
        catch (error) {
            logger.error(`Error removing palette ${paletteID}: ${error}`, `${thisModule} > ${thisMethod}`);
        }
    }
    async renderPalette(tableId) {
        const thisMethod = 'renderPalette()';
        if (!this.getStoredPalette) {
            throw new Error('Palette fetching function has not been set.');
        }
        return this.utils.errors.handleAsync(async () => {
            const storedPalette = await this.getStoredPalette(tableId);
            const paletteRow = document.getElementById('palette-row');
            if (!storedPalette)
                throw new Error(`Palette ${tableId} not found.`);
            if (!paletteRow)
                throw new Error('Palette row element not found.');
            paletteRow.innerHTML = '';
            const tableElement = this.createPaletteTable(storedPalette);
            paletteRow.appendChild(tableElement);
            if (!this.mode.quiet)
                logger.info(`Rendered palette ${tableId}.`, `${thisModule} > ${thisMethod}`);
        }, 'UIManager.renderPalette(): Error rendering palette');
    }
    saturateColor(selectedColor) {
        const thisMethod = 'saturateColor()';
        try {
            this.getElementsForSelectedColor(selectedColor);
            // *DEV-NOTE* unfinished function
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to saturate color: ${error}`, `${thisModule} > ${thisMethod}`);
        }
    }
    setCurrentPalette(palette) {
        this.currentPalette = palette;
    }
    setGetCurrentPaletteFn(fn) {
        this.getCurrentPaletteFn = fn;
    }
    setGetStoredPalette(getter) {
        this.getStoredPalette = getter;
    }
    async setHistoryLimit(limit) {
        const thisMethod = 'setHistoryLimit()';
        try {
            if (limit < 1 || limit > 1000) {
                if (this.logMode.warn)
                    logger.warn(`Invalid history limit: ${limit}. Keeping current limit.`, `${thisModule} > ${thisMethod}`);
                return;
            }
            const idbManager = await IDBManager.getInstance();
            const settings = await idbManager.getSettings();
            settings.maxHistory = limit;
            await idbManager.saveSettings(settings);
            if (this.paletteHistory.length > limit) {
                this.paletteHistory = this.paletteHistory.slice(0, limit);
                await idbManager.savePaletteHistory(this.paletteHistory);
            }
            this.updateHistoryUI();
            if (!this.mode.quiet)
                logger.info(`History limit set to ${limit}`, `${thisModule} > ${thisMethod}`);
        }
        catch (error) {
            logger.error(`Error setting history limit: ${error}`, `${thisModule} > ${thisMethod}`);
        }
    }
    /* PRIVATE METHODS */
    async init() {
        this.idbManager = await IDBManager.getInstance();
        await this.loadPaletteHistory();
    }
    async loadPaletteHistory() {
        if (!this.idbManager)
            return;
        const history = await this.idbManager.getPaletteHistory();
        const settings = await this.idbManager.getSettings();
        const maxHistory = settings.maxHistory || 50;
        if (history) {
            this.paletteHistory = history.slice(0, maxHistory);
            this.updateHistoryUI();
        }
    }
    updateHistoryUI() {
        const historyList = this.domData.elements.static.divs.paletteHistory;
        if (!historyList)
            return;
        historyList.innerHTML = '';
        this.paletteHistory.forEach(palette => {
            const entryID = `palette_${palette.id}`;
            const entry = document.createElement('div');
            entry.classList.add('history-item');
            entry.id = entryID;
            const colors = palette.items
                .map(item => 
            /*html*/
            `<span class="color-box" style="background: ${item.colors.css.hex};">
						</span>`)
                .join(' ');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('remove-history-item');
            removeBtn.dataset.id = `${palette.id}-history-remove-btn`;
            removeBtn.addEventListener('click', async () => {
                await this.removePaletteFromHistory(palette.id);
            });
            entry.innerHTML =
                /*html*/
                `
				<p>Palette #${palette.metadata.name || palette.id}</p>
				<div class="color-preview">${colors}</div>
				`;
            historyList.appendChild(entry);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL1VJTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFrQjVCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLElBQUksTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVuRCxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQztBQUVyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sT0FBTyxTQUFTO0lBQ2IsTUFBTSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7SUFDekQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQyxDQUFDLG9CQUFvQjtJQUNyRSxFQUFFLENBQVMsQ0FBQyxxQkFBcUI7SUFDakMsY0FBYyxHQUFtQixJQUFJLENBQUM7SUFDdEMsY0FBYyxHQUFjLEVBQUUsQ0FBQztJQUUvQixVQUFVLEdBQXNCLElBQUksQ0FBQztJQUVyQyxNQUFNLENBQXNCO0lBQzVCLE9BQU8sQ0FBbUI7SUFDMUIsT0FBTyxDQUErQjtJQUN0QyxJQUFJLENBQW9CO0lBRXhCLGVBQWUsQ0FBc0M7SUFDckQsU0FBUyxD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dHNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0Q29uc3RzRGF0YUludGVyZmFjZSxcblx0RE9NRGF0YUludGVyZmFjZSxcblx0RE9NRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRIU0wsXG5cdElPRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRNb2RlRGF0YUludGVyZmFjZSxcblx0UGFsZXR0ZSxcblx0U0wsXG5cdFN0b3JlZFBhbGV0dGUsXG5cdFNWLFxuXHRVSU1hbmFnZXJfQ2xhc3NJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgSURCTWFuYWdlciB9IGZyb20gJy4uL2RiL0lEQk1hbmFnZXIuanMnO1xuaW1wb3J0IHsgY29tbW9uRm4gfSBmcm9tICcuLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbnN0c0RhdGEgYXMgY29uc3RzIH0gZnJvbSAnLi4vZGF0YS9jb25zdHMuanMnO1xuaW1wb3J0IHsgZG9tRGF0YSB9IGZyb20gJy4uL2RhdGEvZG9tLmpzJztcbmltcG9ydCB7IGZpbGVVdGlscyB9IGZyb20gJy4uL2RvbS9maWxlVXRpbHMuanMnO1xuaW1wb3J0IHsgaW9GbiB9IGZyb20gJy4uL2lvL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ3VpL1VJTWFuYWdlci50cyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5leHBvcnQgY2xhc3MgVUlNYW5hZ2VyIGltcGxlbWVudHMgVUlNYW5hZ2VyX0NsYXNzSW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VDb3VudGVyID0gMDsgLy8gc3RhdGljIGluc3RhbmNlIElEIGNvdW50ZXJcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VzID0gbmV3IE1hcDxudW1iZXIsIFVJTWFuYWdlcj4oKTsgLy8gaW5zdGFuY2UgcmVnaXN0cnlcblx0cHJpdmF0ZSBpZDogbnVtYmVyOyAvLyB1bmlxdWUgaW5zdGFuY2UgSURcblx0cHJpdmF0ZSBjdXJyZW50UGFsZXR0ZTogUGFsZXR0ZSB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIHBhbGV0dGVIaXN0b3J5OiBQYWxldHRlW10gPSBbXTtcblxuXHRwcml2YXRlIGlkYk1hbmFnZXI6IElEQk1hbmFnZXIgfCBudWxsID0gbnVsbDtcblxuXHRwcml2YXRlIGNvbnN0czogQ29uc3RzRGF0YUludGVyZmFjZTtcblx0cHJpdmF0ZSBkb21EYXRhOiBET01EYXRhSW50ZXJmYWNlO1xuXHRwcml2YXRlIGxvZ01vZGU6IE1vZGVEYXRhSW50ZXJmYWNlWydsb2dnaW5nJ107XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGFJbnRlcmZhY2U7XG5cblx0cHJpdmF0ZSBjb252ZXJzaW9uVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29udmVydCddO1xuXHRwcml2YXRlIGNvcmVVdGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWydjb3JlJ107XG5cdHByaXZhdGUgaGVscGVyczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWydoZWxwZXJzJ107XG5cdHByaXZhdGUgdXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsndXRpbHMnXTtcblxuXHRwcml2YXRlIGZpbGVVdGlsczogRE9NRm5fTWFzdGVySW50ZXJmYWNlWydmaWxlVXRpbHMnXTtcblx0cHJpdmF0ZSBpb0ZuOiBJT0ZuX01hc3RlckludGVyZmFjZTtcblxuXHRwcml2YXRlIGdldEN1cnJlbnRQYWxldHRlRm4/OiAoKSA9PiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPjtcblx0cHJpdmF0ZSBnZXRTdG9yZWRQYWxldHRlPzogKGlkOiBzdHJpbmcpID0+IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuaW5pdCgpO1xuXG5cdFx0dGhpcy5pZCA9IFVJTWFuYWdlci5pbnN0YW5jZUNvdW50ZXIrKztcblxuXHRcdFVJTWFuYWdlci5pbnN0YW5jZXMuc2V0KHRoaXMuaWQsIHRoaXMpO1xuXG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IFtdO1xuXG5cdFx0dGhpcy5jb25zdHMgPSBjb25zdHM7XG5cdFx0dGhpcy5kb21EYXRhID0gZG9tRGF0YTtcblx0XHR0aGlzLmxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cdFx0dGhpcy5tb2RlID0gbW9kZTtcblxuXHRcdHRoaXMuY29yZVV0aWxzID0gY29tbW9uRm4uY29yZTtcblx0XHR0aGlzLmhlbHBlcnMgPSBjb21tb25Gbi5oZWxwZXJzO1xuXHRcdHRoaXMudXRpbHMgPSBjb21tb25Gbi51dGlscztcblx0XHR0aGlzLmNvbnZlcnNpb25VdGlscyA9IGNvbW1vbkZuLmNvbnZlcnQ7XG5cblx0XHR0aGlzLmZpbGVVdGlscyA9IGZpbGVVdGlscztcblx0XHR0aGlzLmlvRm4gPSBpb0ZuO1xuXHR9XG5cblx0LyogUFVCTElDIE1FVEhPRFMgKi9cblxuXHRwdWJsaWMgYXN5bmMgYWRkUGFsZXR0ZVRvSGlzdG9yeShwYWxldHRlOiBQYWxldHRlKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdhZGRQYWxldHRlVG9IaXN0b3J5KCknO1xuXG5cdFx0Y29uc3QgaWRiTWFuYWdlciA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblx0XHRjb25zdCBtYXhIaXN0b3J5ID0gKGF3YWl0IGlkYk1hbmFnZXIuZ2V0U2V0dGluZ3MoKSkubWF4SGlzdG9yeTtcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBoaXN0b3J5ID0gYXdhaXQgaWRiTWFuYWdlci5nZXRQYWxldHRlSGlzdG9yeSgpO1xuXHRcdFx0Y29uc3QgbmV3SUQgPSBhd2FpdCBpZGJNYW5hZ2VyLmdldE5leHRQYWxldHRlSUQoKTtcblx0XHRcdGNvbnN0IGlkU3RyaW5nID0gYCR7cGFsZXR0ZS5tZXRhZGF0YS50eXBlfV8ke25ld0lEfWA7XG5cblx0XHRcdGF3YWl0IGlkYk1hbmFnZXIuc2F2ZVBhbGV0dGVIaXN0b3J5KGhpc3RvcnkpO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCF0aGlzLm1vZGUucXVpZXQgJiZcblx0XHRcdFx0dGhpcy5tb2RlLmRlYnVnICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAyXG5cdFx0XHQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBBZGRlZCBwYWxldHRlIHdpdGggSUQgJHtpZFN0cmluZ30gdG8gaGlzdG9yeWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBhZGRpbmcgcGFsZXR0ZSB0byBoaXN0b3J5OiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeS51bnNoaWZ0KHBhbGV0dGUpO1xuXG5cdFx0aWYgKHRoaXMucGFsZXR0ZUhpc3RvcnkubGVuZ3RoID4gbWF4SGlzdG9yeSkgdGhpcy5wYWxldHRlSGlzdG9yeS5wb3AoKTtcblxuXHRcdGlmICh0aGlzLmlkYk1hbmFnZXIpIHtcblx0XHRcdGF3YWl0IHRoaXMuaWRiTWFuYWdlci5zYXZlUGFsZXR0ZUhpc3RvcnkodGhpcy5wYWxldHRlSGlzdG9yeSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGlkYk1hbmFnZXIgPSBhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cdFx0XHRhd2FpdCBpZGJNYW5hZ2VyLnNhdmVQYWxldHRlSGlzdG9yeSh0aGlzLnBhbGV0dGVIaXN0b3J5KTtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZUhpc3RvcnlVSSgpO1xuXHR9XG5cblx0cHVibGljIGFwcGx5Q3VzdG9tQ29sb3IoKTogSFNMIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2FwcGx5Q3VzdG9tQ29sb3IoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXG5cdFx0XHRpZiAoIWNvbG9yUGlja2VyKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJhd1ZhbHVlID0gY29sb3JQaWNrZXIudmFsdWUudHJpbSgpO1xuXG5cdFx0XHQvLyAqREVWLU5PVEUqIEFkZCB0aGlzIHRvIHRoZSBEYXRhIG9iamVjdFxuXHRcdFx0Y29uc3Qgc2VsZWN0ZWRGb3JtYXQgPSAoXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRcdCdjdXN0b20tY29sb3ItZm9ybWF0J1xuXHRcdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbFxuXHRcdFx0KT8udmFsdWUgYXMgQ29sb3JTcGFjZTtcblxuXHRcdFx0aWYgKCF0aGlzLnV0aWxzLmNvbG9yLmlzQ29sb3JTcGFjZShzZWxlY3RlZEZvcm1hdCkpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0YFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB0aGlzLnV0aWxzLmNvbG9yLnBhcnNlQ29sb3IoXG5cdFx0XHRcdHNlbGVjdGVkRm9ybWF0LFxuXHRcdFx0XHRyYXdWYWx1ZVxuXHRcdFx0KSBhcyBFeGNsdWRlPENvbG9yLCBTTCB8IFNWPjtcblxuXHRcdFx0aWYgKCFwYXJzZWRDb2xvcikge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWU6ICR7cmF3VmFsdWV9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhzbENvbG9yID0gdGhpcy51dGlscy5jb2xvci5pc0hTTENvbG9yKHBhcnNlZENvbG9yKVxuXHRcdFx0XHQ/IHBhcnNlZENvbG9yXG5cdFx0XHRcdDogdGhpcy5jb252ZXJzaW9uVXRpbHMudG9IU0wocGFyc2VkQ29sb3IpO1xuXG5cdFx0XHRyZXR1cm4gaHNsQ29sb3I7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGN1c3RvbSBjb2xvcjogJHtlcnJvcn0uIFJldHVybmluZyByYW5kb21seSBnZW5lcmF0ZWQgaGV4IGNvbG9yYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB0aGlzLnV0aWxzLnJhbmRvbS5oc2woKSBhcyBIU0w7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIGFwcGx5Rmlyc3RDb2xvclRvVUkoY29sb3I6IEhTTCk6IFByb21pc2U8SFNMPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdhcHBseUZpcnN0Q29sb3JUb1VJKCknO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvckJveDEgPSB0aGlzLmRvbURhdGEuZWxlbWVudHMuZHluYW1pYy5kaXZzLmNvbG9yQm94MTtcblxuXHRcdFx0aWYgKCFjb2xvckJveDEpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnY29sb3ItYm94LTEgaXMgbnVsbCcsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGZvcm1hdENvbG9yU3RyaW5nID1cblx0XHRcdFx0YXdhaXQgdGhpcy5jb3JlVXRpbHMuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J1VuZXhwZWN0ZWQgb3IgdW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0LicsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbG9yQm94MS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmb3JtYXRDb2xvclN0cmluZztcblxuXHRcdFx0dGhpcy51dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCAxKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdHJldHVybiB0aGlzLnV0aWxzLnJhbmRvbS5oc2woKSBhcyBIU0w7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGNvcHlUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcsIHRvb2x0aXBFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnY29weVRvQ2xpcGJvYXJkKCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWUgPSB0ZXh0LnJlcGxhY2UoJ0NvcGllZCB0byBjbGlwYm9hcmQhJywgJycpLnRyaW0oKTtcblxuXHRcdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmhlbHBlcnMuZG9tLnNob3dUb29sdGlwKHRvb2x0aXBFbGVtZW50KTtcblxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCF0aGlzLm1vZGUucXVpZXQgJiZcblx0XHRcdFx0XHRcdHRoaXMubW9kZS5kZWJ1ZyAmJlxuXHRcdFx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDIgJiZcblx0XHRcdFx0XHRcdHRoaXMubG9nTW9kZS5pbmZvXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdFx0YENvcGllZCBjb2xvciB2YWx1ZTogJHtjb2xvclZhbHVlfWAsXG5cdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHRcdCgpID0+IHRvb2x0aXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSxcblx0XHRcdFx0XHRcdHRoaXMuY29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdGBFcnJvciBjb3B5aW5nIHRvIGNsaXBib2FyZDogJHtlcnJ9YCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBjcmVhdGVQYWxldHRlVGFibGUocGFsZXR0ZTogU3RvcmVkUGFsZXR0ZSk6IEhUTUxFbGVtZW50IHtcblx0XHRjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRjb25zdCB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XG5cdFx0dGFibGUuY2xhc3NMaXN0LmFkZCgncGFsZXR0ZS10YWJsZScpO1xuXG5cdFx0cGFsZXR0ZS5wYWxldHRlLml0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG5cdFx0XHRjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHRjZWxsLnRleHRDb250ZW50ID0gYENvbG9yICR7aW5kZXggKyAxfWA7XG5cdFx0XHRjb2xvckJveC5jbGFzc0xpc3QuYWRkKCdjb2xvci1ib3gnKTtcblx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGl0ZW0uY29sb3JzLmNzcy5oZXg7XG5cblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjb2xvckJveCk7XG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0XHR0YWJsZS5hcHBlbmRDaGlsZChyb3cpO1xuXHRcdH0pO1xuXG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGFibGUpO1xuXG5cdFx0cmV0dXJuIGZyYWdtZW50IGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnQ7XG5cdH1cblxuXHRwdWJsaWMgZGVzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZGVzYXR1cmF0ZUNvbG9yKCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBkZXNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKToge1xuXHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFx0c2VsZWN0ZWRDb2xvckJveDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0fSB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3IoKSc7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdCk7XG5cblx0XHRpZiAoIXNlbGVjdGVkQ29sb3JCb3gpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2Fybilcblx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0YEVsZW1lbnQgbm90IGZvdW5kIGZvciBjb2xvciAke3NlbGVjdGVkQ29sb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHRoaXMuaGVscGVycy5kb20uc2hvd1RvYXN0KCdQbGVhc2Ugc2VsZWN0IGEgdmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBudWxsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdCksXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci1zdHJpcGUtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdClcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIGdldElEKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuaWQ7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEFsbEluc3RhbmNlcygpOiBVSU1hbmFnZXJbXSB7XG5cdFx0cmV0dXJuIEFycmF5LmZyb20oVUlNYW5hZ2VyLmluc3RhbmNlcy52YWx1ZXMoKSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGUoKTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdGlmICh0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4pIHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4oKTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRcdHRoaXMuY3VycmVudFBhbGV0dGUgfHxcblx0XHRcdCh0aGlzLnBhbGV0dGVIaXN0b3J5Lmxlbmd0aCA+IDAgPyB0aGlzLnBhbGV0dGVIaXN0b3J5WzBdIDogbnVsbClcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZUJ5SWQoaWQ6IG51bWJlcik6IFVJTWFuYWdlciB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIFVJTWFuYWdlci5pbnN0YW5jZXMuZ2V0KGlkKTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZGVsZXRlSW5zdGFuY2VCeUlkKGlkOiBudW1iZXIpOiB2b2lkIHtcblx0XHRVSU1hbmFnZXIuaW5zdGFuY2VzLmRlbGV0ZShpZCk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgaGFuZGxlRXhwb3J0KGZvcm1hdDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdoYW5kbGVFeHBvcnQoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGUoKTtcblxuXHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHQnTm8gcGFsZXR0ZSBhdmFpbGFibGUgZm9yIGV4cG9ydCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnY3NzJzpcblx0XHRcdFx0XHR0aGlzLmlvRm4uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0XHR0aGlzLmlvRm4uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd4bWwnOlxuXHRcdFx0XHRcdHRoaXMuaW9Gbi5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBleHBvcnQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvciAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZXhwb3J0IHBhbGV0dGU6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUltcG9ydChcblx0XHRmaWxlOiBGaWxlLFxuXHRcdGZvcm1hdDogJ0pTT04nIHwgJ1hNTCcgfCAnQ1NTJ1xuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdoYW5kbGVJbXBvcnQoKSc7XG5cdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5maWxlVXRpbHMucmVhZEZpbGUoZmlsZSk7XG5cblx0XHRcdGxldCBwYWxldHRlOiBQYWxldHRlIHwgbnVsbCA9IG51bGw7XG5cblx0XHRcdHN3aXRjaCAoZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ0pTT04nOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSBhd2FpdCB0aGlzLmlvRm4uZGVzZXJpYWxpemUuZnJvbUpTT04oZGF0YSk7XG5cdFx0XHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0XHQnRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT04gZGF0YScsXG5cdFx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdYTUwnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPVxuXHRcdFx0XHRcdFx0KGF3YWl0IHRoaXMuaW9Gbi5kZXNlcmlhbGl6ZS5mcm9tWE1MKGRhdGEpKSB8fCBudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdDU1MnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPVxuXHRcdFx0XHRcdFx0KGF3YWl0IHRoaXMuaW9Gbi5kZXNlcmlhbGl6ZS5mcm9tQ1NTKGRhdGEpKSB8fCBudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgRmFpbGVkIHRvIGRlc2VyaWFsaXplICR7Zm9ybWF0fSBkYXRhYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGUpO1xuXG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmluZm8gJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFN1Y2Nlc3NmdWxseSBpbXBvcnRlZCBwYWxldHRlIGluICR7Zm9ybWF0fSBmb3JtYXQuYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBpbXBvcnQgZmlsZTogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGhhbmRsZUltcG9ydCgpYFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgcHVsbFBhcmFtc0Zyb21VSSgpOiB7XG5cdFx0dHlwZTogbnVtYmVyO1xuXHRcdHN3YXRjaGVzOiBudW1iZXI7XG5cdFx0bGltaXREYXJrOiBib29sZWFuO1xuXHRcdGxpbWl0R3JheTogYm9vbGVhbjtcblx0XHRsaW1pdExpZ2h0OiBib29sZWFuO1xuXHR9IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3B1bGxQYXJhbXNGcm9tVUkoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGVFbGVtZW50ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuc2VsZWN0cy5wYWxldHRlVHlwZTtcblx0XHRcdGNvbnN0IG51bVN3YXRjaGVzRWxlbWVudCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLnNlbGVjdHMuc3dhdGNoR2VuO1xuXHRcdFx0Y29uc3QgbGltaXREYXJrQ2hrYnggPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5pbnB1dHMubGltaXREYXJrQ2hrYng7XG5cdFx0XHRjb25zdCBsaW1pdEdyYXlDaGtieCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLmlucHV0cy5saW1pdEdyYXlDaGtieDtcblx0XHRcdGNvbnN0IGxpbWl0TGlnaHRDaGtieCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLmlucHV0cy5saW1pdExpZ2h0Q2hrYng7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IXBhbGV0dGVUeXBlRWxlbWVudCAmJlxuXHRcdFx0XHQhdGhpcy5tb2RlLnF1aWV0ICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS5kZWJ1ZyAmJlxuXHRcdFx0XHR0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID49IDJcblx0XHRcdCkge1xuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHQncGFsZXR0ZVR5cGVPcHRpb25zIERPTSBlbGVtZW50IG5vdCBmb3VuZCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhbnVtU3dhdGNoZXNFbGVtZW50ICYmXG5cdFx0XHRcdCF0aGlzLm1vZGUucXVpZXQgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLmRlYnVnICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPj0gMlxuXHRcdFx0KSB7XG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBudW1Cb3hlcyBET00gZWxlbWVudCBub3QgZm91bmRgLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0KCFsaW1pdERhcmtDaGtieCB8fCAhbGltaXRHcmF5Q2hrYnggfHwgIWxpbWl0TGlnaHRDaGtieCkgJiZcblx0XHRcdFx0IXRoaXMubW9kZS5xdWlldCAmJlxuXHRcdFx0XHR0aGlzLmxvZ01vZGUuZGVidWcgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+PSAyXG5cdFx0XHQpIHtcblx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0YE9uZSBvciBtb3JlIGNoZWNrYm94ZXMgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IHBhbGV0dGVUeXBlRWxlbWVudFxuXHRcdFx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0XHQ6IDAsXG5cdFx0XHRcdHN3YXRjaGVzOiBudW1Td2F0Y2hlc0VsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KG51bVN3YXRjaGVzRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRsaW1pdERhcms6IGxpbWl0RGFya0Noa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXk6IGxpbWl0R3JheUNoa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdExpZ2h0OiBsaW1pdExpZ2h0Q2hrYng/LmNoZWNrZWQgfHwgZmFsc2Vcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIHB1bGwgcGFyYW1ldGVycyBmcm9tIFVJOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiAwLFxuXHRcdFx0XHRzd2F0Y2hlczogMCxcblx0XHRcdFx0bGltaXREYXJrOiBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5OiBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodDogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlbW92ZVBhbGV0dGVGcm9tSGlzdG9yeShwYWxldHRlSUQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVtb3ZlUGFsZXR0ZUZyb21IaXN0b3J5KCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGVudHJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHBhbGV0dGVfJHtwYWxldHRlSUR9YCk7XG5cblx0XHRcdGlmICghZW50cnkpIHJldHVybjtcblxuXHRcdFx0ZW50cnkucmVtb3ZlKCk7XG5cblx0XHRcdGNvbnN0IGlkYk1hbmFnZXIgPSBhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cdFx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5ID0gdGhpcy5wYWxldHRlSGlzdG9yeS5maWx0ZXIoXG5cdFx0XHRcdHAgPT4gcC5pZCAhPT0gcGFsZXR0ZUlEXG5cdFx0XHQpO1xuXHRcdFx0YXdhaXQgaWRiTWFuYWdlci5zYXZlUGFsZXR0ZUhpc3RvcnkodGhpcy5wYWxldHRlSGlzdG9yeSk7XG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFJlbW92ZWQgcGFsZXR0ZSAke3BhbGV0dGVJRH0gZnJvbSBoaXN0b3J5YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIHJlbW92aW5nIHBhbGV0dGUgJHtwYWxldHRlSUR9OiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlbmRlclBhbGV0dGUodGFibGVJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVuZGVyUGFsZXR0ZSgpJztcblxuXHRcdGlmICghdGhpcy5nZXRTdG9yZWRQYWxldHRlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgZmV0Y2hpbmcgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHNldC4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSEodGFibGVJZCk7XG5cdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0aWYgKCFwYWxldHRlUm93KSB0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgcm93IGVsZW1lbnQgbm90IGZvdW5kLicpO1xuXG5cdFx0XHRwYWxldHRlUm93LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblx0XHRcdHBhbGV0dGVSb3cuYXBwZW5kQ2hpbGQodGFibGVFbGVtZW50KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBSZW5kZXJlZCBwYWxldHRlICR7dGFibGVJZH0uYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSwgJ1VJTWFuYWdlci5yZW5kZXJQYWxldHRlKCk6IEVycm9yIHJlbmRlcmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3NhdHVyYXRlQ29sb3IoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0XHQvLyAqREVWLU5PVEUqIHVuZmluaXNoZWQgZnVuY3Rpb25cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHNldEN1cnJlbnRQYWxldHRlKHBhbGV0dGU6IFBhbGV0dGUpOiB2b2lkIHtcblx0XHR0aGlzLmN1cnJlbnRQYWxldHRlID0gcGFsZXR0ZTtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRDdXJyZW50UGFsZXR0ZUZuKGZuOiAoKSA9PiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPik6IHZvaWQge1xuXHRcdHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbiA9IGZuO1xuXHR9XG5cblx0cHVibGljIHNldEdldFN0b3JlZFBhbGV0dGUoXG5cdFx0Z2V0dGVyOiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD5cblx0KTogdm9pZCB7XG5cdFx0dGhpcy5nZXRTdG9yZWRQYWxldHRlID0gZ2V0dGVyO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIHNldEhpc3RvcnlMaW1pdChsaW1pdDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdzZXRIaXN0b3J5TGltaXQoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKGxpbWl0IDwgMSB8fCBsaW1pdCA+IDEwMDApIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YEludmFsaWQgaGlzdG9yeSBsaW1pdDogJHtsaW1pdH0uIEtlZXBpbmcgY3VycmVudCBsaW1pdC5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaWRiTWFuYWdlciA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgaWRiTWFuYWdlci5nZXRTZXR0aW5ncygpO1xuXG5cdFx0XHRzZXR0aW5ncy5tYXhIaXN0b3J5ID0gbGltaXQ7XG5cdFx0XHRhd2FpdCBpZGJNYW5hZ2VyLnNhdmVTZXR0aW5ncyhzZXR0aW5ncyk7XG5cblx0XHRcdGlmICh0aGlzLnBhbGV0dGVIaXN0b3J5Lmxlbmd0aCA+IGxpbWl0KSB7XG5cdFx0XHRcdHRoaXMucGFsZXR0ZUhpc3RvcnkgPSB0aGlzLnBhbGV0dGVIaXN0b3J5LnNsaWNlKDAsIGxpbWl0KTtcblx0XHRcdFx0YXdhaXQgaWRiTWFuYWdlci5zYXZlUGFsZXR0ZUhpc3RvcnkodGhpcy5wYWxldHRlSGlzdG9yeSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKCk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgSGlzdG9yeSBsaW1pdCBzZXQgdG8gJHtsaW1pdH1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3Igc2V0dGluZyBoaXN0b3J5IGxpbWl0OiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0LyogUFJJVkFURSBNRVRIT0RTICovXG5cblx0cHJpdmF0ZSBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRoaXMuaWRiTWFuYWdlciA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuXHRcdGF3YWl0IHRoaXMubG9hZFBhbGV0dGVIaXN0b3J5KCk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGxvYWRQYWxldHRlSGlzdG9yeSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRpZiAoIXRoaXMuaWRiTWFuYWdlcikgcmV0dXJuO1xuXG5cdFx0Y29uc3QgaGlzdG9yeSA9IGF3YWl0IHRoaXMuaWRiTWFuYWdlci5nZXRQYWxldHRlSGlzdG9yeSgpO1xuXHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5pZGJNYW5hZ2VyLmdldFNldHRpbmdzKCk7XG5cblx0XHRjb25zdCBtYXhIaXN0b3J5ID0gc2V0dGluZ3MubWF4SGlzdG9yeSB8fCA1MDtcblxuXHRcdGlmIChoaXN0b3J5KSB7XG5cdFx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5ID0gaGlzdG9yeS5zbGljZSgwLCBtYXhIaXN0b3J5KTtcblx0XHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVIaXN0b3J5VUkoKTogdm9pZCB7XG5cdFx0Y29uc3QgaGlzdG9yeUxpc3QgPSB0aGlzLmRvbURhdGEuZWxlbWVudHMuc3RhdGljLmRpdnMucGFsZXR0ZUhpc3Rvcnk7XG5cblx0XHRpZiAoIWhpc3RvcnlMaXN0KSByZXR1cm47XG5cblx0XHRoaXN0b3J5TGlzdC5pbm5lckhUTUwgPSAnJztcblxuXHRcdHRoaXMucGFsZXR0ZUhpc3RvcnkuZm9yRWFjaChwYWxldHRlID0+IHtcblx0XHRcdGNvbnN0IGVudHJ5SUQgPSBgcGFsZXR0ZV8ke3BhbGV0dGUuaWR9YDtcblx0XHRcdGNvbnN0IGVudHJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRlbnRyeS5jbGFzc0xpc3QuYWRkKCdoaXN0b3J5LWl0ZW0nKTtcblx0XHRcdGVudHJ5LmlkID0gZW50cnlJRDtcblxuXHRcdFx0Y29uc3QgY29sb3JzID0gcGFsZXR0ZS5pdGVtc1xuXHRcdFx0XHQubWFwKFxuXHRcdFx0XHRcdGl0ZW0gPT5cblx0XHRcdFx0XHRcdC8qaHRtbCovXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCJjb2xvci1ib3hcIiBzdHlsZT1cImJhY2tncm91bmQ6ICR7aXRlbS5jb2xvcnMuY3NzLmhleH07XCI+XG5cdFx0XHRcdFx0XHQ8L3NwYW4+YFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5qb2luKCcgJyk7XG5cblx0XHRcdGNvbnN0IHJlbW92ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG5cdFx0XHRyZW1vdmVCdG4udGV4dENvbnRlbnQgPSAnUmVtb3ZlJztcblx0XHRcdHJlbW92ZUJ0bi5jbGFzc0xpc3QuYWRkKCdyZW1vdmUtaGlzdG9yeS1pdGVtJyk7XG5cdFx0XHRyZW1vdmVCdG4uZGF0YXNldC5pZCA9IGAke3BhbGV0dGUuaWR9LWhpc3RvcnktcmVtb3ZlLWJ0bmA7XG5cblx0XHRcdHJlbW92ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcblx0XHRcdFx0YXdhaXQgdGhpcy5yZW1vdmVQYWxldHRlRnJvbUhpc3RvcnkocGFsZXR0ZS5pZCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZW50cnkuaW5uZXJIVE1MID1cblx0XHRcdFx0LypodG1sKi9cblx0XHRcdFx0YFxuXHRcdFx0XHQ8cD5QYWxldHRlICMke3BhbGV0dGUubWV0YWRhdGEubmFtZSB8fCBwYWxldHRlLmlkfTwvcD5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbG9yLXByZXZpZXdcIj4ke2NvbG9yc308L2Rpdj5cblx0XHRcdFx0YDtcblxuXHRcdFx0aGlzdG9yeUxpc3QuYXBwZW5kQ2hpbGQoZW50cnkpO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=