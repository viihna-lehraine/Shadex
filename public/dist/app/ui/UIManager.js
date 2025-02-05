// File: app/ui/UIManager.ts
import { IDBManager } from '../db/IDBManager.js';
import { commonFn } from '../../common/index.js';
import { createLogger } from '../../logger/index.js';
import { constsData as consts } from '../../data/consts.js';
import { dbUtils } from '../db/dbUtils.js';
import { domData } from '../../data/dom.js';
import { download, readFile } from '../dom/utils.js';
import { ioFn } from '../io/index.js';
import { modeData as mode } from '../../data/mode.js';
const thisModule = 'ui/UIManager.ts';
const fileUtils = {
    download,
    readFile
};
const logger = await createLogger();
export class UIManager {
    static instanceCounter = 0; // static instance ID counter
    static instances = new Map(); // instance registry
    id; // unique instance ID
    currentPalette = null;
    paletteHistory = [];
    idbManager;
    consts;
    domData;
    logMode;
    mode;
    conversionUtils;
    coreUtils;
    dbUtils;
    utils;
    getCurrentPaletteFn;
    getStoredPalette;
    eventListenerFn;
    constructor(eventListenerFn) {
        this.init();
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.paletteHistory = [];
        this.consts = consts;
        this.domData = domData;
        this.logMode = mode.logging;
        this.mode = mode;
        this.coreUtils = commonFn.core;
        this.dbUtils = dbUtils;
        this.utils = commonFn.utils;
        this.conversionUtils = commonFn.convert;
        this.eventListenerFn = eventListenerFn;
    }
    /// * * * * * * PUBLIC METHODS * * * * * * *
    // * * * * * * * * * * * * * * * * * * * * * *
    async addPaletteToHistory(palette) {
        await this.idbManager.addPaletteToHistory(palette);
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
                this.getEventListenerFn().temp.showTooltip(tooltipElement);
                if (this.logMode.verbosity > 2) {
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
            this.getEventListenerFn().temp.showToast('Please select a valid color.');
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
                    ioFn.exportPalette(palette, format);
                    break;
                case 'json':
                    ioFn.exportPalette(palette, format);
                    break;
                case 'xml':
                    ioFn.exportPalette(palette, format);
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
            const data = await fileUtils.readFile(file);
            let palette = null;
            switch (format) {
                case 'JSON':
                    palette = await ioFn.deserialize.fromJSON(data);
                    if (!palette) {
                        if (this.logMode.error && this.logMode.verbosity > 1) {
                            logger.error('Failed to deserialize JSON data', `${thisModule} > ${thisMethod}`);
                        }
                        return;
                    }
                    break;
                case 'XML':
                    palette = (await ioFn.deserialize.fromXML(data)) || null;
                    break;
                case 'CSS':
                    palette = (await ioFn.deserialize.fromCSS(data)) || null;
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
            if (this.logMode.verbosity > 1) {
                logger.info(`Successfully imported palette in ${format} format.`, `${thisModule} > ${thisMethod}`);
            }
        }
        catch (error) {
            logger.error(`Failed to import file: ${error}`, `${thisModule} > handleImport()`);
        }
    }
    async loadPaletteHistory() {
        const history = await this.idbManager.getPaletteHistory();
        this.updateHistoryUI(history);
    }
    async makePaletteBox(color, swatchCount) {
        const thisMethod = 'makePaletteBox()';
        try {
            if (!this.coreUtils.validate.colorValues(color)) {
                if (!this.logMode.error)
                    logger.error(`Invalid ${color.format} color value ${JSON.stringify(color)}`, `${thisModule} > ${thisMethod}`);
                return {
                    colorStripe: document.createElement('div'),
                    swatchCount
                };
            }
            const clonedColor = this.coreUtils.base.clone(color);
            const paletteBox = document.createElement('div');
            paletteBox.className = 'palette-box';
            paletteBox.id = `palette-box-${swatchCount}`;
            const paletteBoxTopHalf = document.createElement('div');
            paletteBoxTopHalf.className =
                'palette-box-half palette-box-top-half';
            paletteBoxTopHalf.id = `palette-box-top-half-${swatchCount}`;
            const colorTextOutputBox = document.createElement('input');
            colorTextOutputBox.type = 'text';
            colorTextOutputBox.className = 'color-text-output-box tooltip';
            colorTextOutputBox.id = `color-text-output-box-${swatchCount}`;
            colorTextOutputBox.setAttribute('data-format', 'hex');
            const colorString = await this.coreUtils.convert.colorToCSSColorString(clonedColor);
            colorTextOutputBox.value = colorString || '';
            colorTextOutputBox.colorValues = clonedColor;
            colorTextOutputBox.readOnly = false;
            colorTextOutputBox.style.cursor = 'text';
            colorTextOutputBox.style.pointerEvents = 'none';
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'Copy';
            const tooltipText = document.createElement('span');
            tooltipText.className = 'tooltiptext';
            tooltipText.textContent = 'Copied to clipboard!';
            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(colorTextOutputBox.value);
                    this.getEventListenerFn().temp.showTooltip(colorTextOutputBox);
                    clearTimeout(consts.timeouts.tooltip || 1000);
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => (copyButton.textContent = 'Copy'), consts.timeouts.copyButtonText || 1000);
                }
                catch (error) {
                    if (!this.logMode.error)
                        logger.error(`Failed to copy: ${error}`, `${thisModule} > ${thisMethod}`);
                }
            });
            colorTextOutputBox.addEventListener('input', this.coreUtils.base.debounce((e) => {
                const target = e.target;
                if (target) {
                    const cssColor = target.value.trim();
                    const boxElement = document.getElementById(`color-box-${swatchCount}`);
                    const stripeElement = document.getElementById(`color-stripe-${swatchCount}`);
                    if (boxElement)
                        boxElement.style.backgroundColor = cssColor;
                    if (stripeElement)
                        stripeElement.style.backgroundColor = cssColor;
                }
            }, consts.debounce.input || 200));
            paletteBoxTopHalf.appendChild(colorTextOutputBox);
            paletteBoxTopHalf.appendChild(copyButton);
            const paletteBoxBottomHalf = document.createElement('div');
            paletteBoxBottomHalf.className =
                'palette-box-half palette-box-bottom-half';
            paletteBoxBottomHalf.id = `palette-box-bottom-half-${swatchCount}`;
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.id = `color-box-${swatchCount}`;
            colorBox.style.backgroundColor = colorString || '#ffffff';
            paletteBoxBottomHalf.appendChild(colorBox);
            paletteBox.appendChild(paletteBoxTopHalf);
            paletteBox.appendChild(paletteBoxBottomHalf);
            const colorStripe = document.createElement('div');
            colorStripe.className = 'color-stripe';
            colorStripe.id = `color-stripe-${swatchCount}`;
            colorStripe.style.backgroundColor = colorString || '#ffffff';
            colorStripe.setAttribute('draggable', 'true');
            this.getEventListenerFn().dad.attach(colorStripe);
            colorStripe.appendChild(paletteBox);
            return {
                colorStripe,
                swatchCount: swatchCount + 1
            };
        }
        catch (error) {
            if (!this.logMode.error)
                logger.error(`Failed to execute makePaletteBox: ${error}`, `${thisModule} > ${thisMethod}`);
            return {
                colorStripe: document.createElement('div'),
                swatchCount
            };
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
            if (!paletteTypeElement && this.logMode.verbosity >= 2) {
                logger.warn('paletteTypeOptions DOM element not found', `${thisModule} > ${thisMethod}`);
            }
            if (!numSwatchesElement && this.logMode.verbosity >= 2) {
                logger.warn(`numBoxes DOM element not found`, `${thisModule} > ${thisMethod}`);
            }
            if ((!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) &&
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
        const history = await this.idbManager.getPaletteHistory();
        const updatedHistory = history.filter(p => p.id !== paletteID);
        await this.idbManager.savePaletteHistory(updatedHistory);
        this.updateHistoryUI();
    }
    async renderPalette(tableId) {
        const thisMethod = 'renderPalette()';
        if (!this.getStoredPalette) {
            throw new Error('Palette fetching function has not been set.');
        }
        return this.dbUtils.handleAsync(async () => {
            const storedPalette = await this.getStoredPalette(tableId);
            const paletteRow = document.getElementById('palette-row');
            if (!storedPalette)
                throw new Error(`Palette ${tableId} not found.`);
            if (!paletteRow)
                throw new Error('Palette row element not found.');
            paletteRow.innerHTML = '';
            const tableElement = this.createPaletteTable(storedPalette);
            paletteRow.appendChild(tableElement);
            if (this.logMode.verbosity > 2)
                logger.info(`Rendered palette ${tableId}.`, `${thisModule} > ${thisMethod}`);
        }, 'Error rendering palette', 'UIManager.renderPalette()');
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
    setIDBManager(idbManager) {
        this.idbManager = idbManager;
    }
    /// * * * * * * PRIVATE METHODS * * * * * * *
    // * * * * * * * * * * * * * * * * * * * * * *
    async init() {
        this.idbManager = await IDBManager.getInstance();
        await this.loadPaletteHistory();
    }
    getEventListenerFn() {
        if (!this.eventListenerFn) {
            throw new Error('Event listeners have not been initialized yet.');
        }
        return this.eventListenerFn;
    }
    updateHistoryUI(history = []) {
        const historyList = this.domData.elements.static.divs.paletteHistory;
        if (!historyList)
            return;
        historyList.innerHTML = '';
        history.forEach(palette => {
            const entry = document.createElement('div');
            entry.classList.add('history-item');
            entry.id = `palette_${palette.id}`;
            entry.innerHTML = `
				<p>Palette #${palette.metadata.name || palette.id}</p>
				<div class="color-preview">
					${palette.items.map(item => `<span class="color-box" style="background: ${item.colors.css.hex};"></span>`).join(' ')}
				</div>
				<button class="remove-history-item" data-id="${palette.id}-history-remove-btn">Remove</button>
			`;
            entry
                .querySelector('.remove-history-item')
                ?.addEventListener('click', async () => {
                await this.removePaletteFromHistory(palette.id);
            });
            historyList.appendChild(entry);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC91aS9VSU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBb0I1QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxJQUFJLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEMsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUV0RCxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQztBQUVyQyxNQUFNLFNBQVMsR0FBRztJQUNqQixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sT0FBTyxTQUFTO0lBQ2IsTUFBTSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7SUFDekQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQyxDQUFDLG9CQUFvQjtJQUNyRSxFQUFFLENBQVMsQ0FBQyxxQkFBcUI7SUFFakMsY0FBYyxHQUFtQixJQUFJLENBQUM7SUFDdEMsY0FBYyxHQUFjLEVBQUUsQ0FBQztJQUUvQixVQUFVLENB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QyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogYXBwL3VpL1VJTWFuYWdlci50c1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0Q29uc3RzRGF0YUludGVyZmFjZSxcblx0REJVdGlsc0ludGVyZmFjZSxcblx0RE9NRGF0YUludGVyZmFjZSxcblx0RE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlLFxuXHRIU0wsXG5cdE1vZGVEYXRhSW50ZXJmYWNlLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlQm94T2JqZWN0LFxuXHRTTCxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFVJTWFuYWdlcl9DbGFzc0ludGVyZmFjZVxufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBJREJNYW5hZ2VyIH0gZnJvbSAnLi4vZGIvSURCTWFuYWdlci5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uLy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgY29uc3RzRGF0YSBhcyBjb25zdHMgfSBmcm9tICcuLi8uLi9kYXRhL2NvbnN0cy5qcyc7XG5pbXBvcnQgeyBkYlV0aWxzIH0gZnJvbSAnLi4vZGIvZGJVdGlscy5qcyc7XG5pbXBvcnQgeyBkb21EYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9kb20uanMnO1xuaW1wb3J0IHsgZG93bmxvYWQsIHJlYWRGaWxlIH0gZnJvbSAnLi4vZG9tL3V0aWxzLmpzJztcbmltcG9ydCB7IGlvRm4gfSBmcm9tICcuLi9pby9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgdGhpc01vZHVsZSA9ICd1aS9VSU1hbmFnZXIudHMnO1xuXG5jb25zdCBmaWxlVXRpbHMgPSB7XG5cdGRvd25sb2FkLFxuXHRyZWFkRmlsZVxufTtcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmV4cG9ydCBjbGFzcyBVSU1hbmFnZXIgaW1wbGVtZW50cyBVSU1hbmFnZXJfQ2xhc3NJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZUNvdW50ZXIgPSAwOyAvLyBzdGF0aWMgaW5zdGFuY2UgSUQgY291bnRlclxuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZXMgPSBuZXcgTWFwPG51bWJlciwgVUlNYW5hZ2VyPigpOyAvLyBpbnN0YW5jZSByZWdpc3RyeVxuXHRwcml2YXRlIGlkOiBudW1iZXI7IC8vIHVuaXF1ZSBpbnN0YW5jZSBJRFxuXG5cdHByaXZhdGUgY3VycmVudFBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBwYWxldHRlSGlzdG9yeTogUGFsZXR0ZVtdID0gW107XG5cblx0cHJpdmF0ZSBpZGJNYW5hZ2VyITogSURCTWFuYWdlcjtcblxuXHRwcml2YXRlIGNvbnN0czogQ29uc3RzRGF0YUludGVyZmFjZTtcblx0cHJpdmF0ZSBkb21EYXRhOiBET01EYXRhSW50ZXJmYWNlO1xuXHRwcml2YXRlIGxvZ01vZGU6IE1vZGVEYXRhSW50ZXJmYWNlWydsb2dnaW5nJ107XG5cdHByaXZhdGUgbW9kZTogTW9kZURhdGFJbnRlcmZhY2U7XG5cblx0cHJpdmF0ZSBjb252ZXJzaW9uVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29udmVydCddO1xuXHRwcml2YXRlIGNvcmVVdGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWydjb3JlJ107XG5cdHByaXZhdGUgZGJVdGlsczogREJVdGlsc0ludGVyZmFjZTtcblx0cHJpdmF0ZSB1dGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd1dGlscyddO1xuXG5cdHByaXZhdGUgZ2V0Q3VycmVudFBhbGV0dGVGbj86ICgpID0+IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+O1xuXHRwcml2YXRlIGdldFN0b3JlZFBhbGV0dGU/OiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD47XG5cblx0cHJpdmF0ZSBldmVudExpc3RlbmVyRm46IERPTUZuX0V2ZW50TGlzdGVuZXJGbkludGVyZmFjZTtcblxuXHRjb25zdHJ1Y3RvcihldmVudExpc3RlbmVyRm46IERPTUZuX0V2ZW50TGlzdGVuZXJGbkludGVyZmFjZSkge1xuXHRcdHRoaXMuaW5pdCgpO1xuXG5cdFx0dGhpcy5pZCA9IFVJTWFuYWdlci5pbnN0YW5jZUNvdW50ZXIrKztcblxuXHRcdFVJTWFuYWdlci5pbnN0YW5jZXMuc2V0KHRoaXMuaWQsIHRoaXMpO1xuXG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IFtdO1xuXG5cdFx0dGhpcy5jb25zdHMgPSBjb25zdHM7XG5cdFx0dGhpcy5kb21EYXRhID0gZG9tRGF0YTtcblx0XHR0aGlzLmxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cdFx0dGhpcy5tb2RlID0gbW9kZTtcblxuXHRcdHRoaXMuY29yZVV0aWxzID0gY29tbW9uRm4uY29yZTtcblx0XHR0aGlzLmRiVXRpbHMgPSBkYlV0aWxzO1xuXHRcdHRoaXMudXRpbHMgPSBjb21tb25Gbi51dGlscztcblx0XHR0aGlzLmNvbnZlcnNpb25VdGlscyA9IGNvbW1vbkZuLmNvbnZlcnQ7XG5cblx0XHR0aGlzLmV2ZW50TGlzdGVuZXJGbiA9IGV2ZW50TGlzdGVuZXJGbjtcblx0fVxuXG5cdC8vLyAqICogKiAqICogKiBQVUJMSUMgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblxuXHRwdWJsaWMgYXN5bmMgYWRkUGFsZXR0ZVRvSGlzdG9yeShwYWxldHRlOiBQYWxldHRlKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0YXdhaXQgdGhpcy5pZGJNYW5hZ2VyLmFkZFBhbGV0dGVUb0hpc3RvcnkocGFsZXR0ZSk7XG5cblx0XHR0aGlzLnVwZGF0ZUhpc3RvcnlVSSgpO1xuXHR9XG5cblx0cHVibGljIGFwcGx5Q3VzdG9tQ29sb3IoKTogSFNMIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2FwcGx5Q3VzdG9tQ29sb3IoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXG5cdFx0XHRpZiAoIWNvbG9yUGlja2VyKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJhd1ZhbHVlID0gY29sb3JQaWNrZXIudmFsdWUudHJpbSgpO1xuXG5cdFx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIXRoaXMudXRpbHMuY29sb3IuaXNDb2xvclNwYWNlKHNlbGVjdGVkRm9ybWF0KSkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke3NlbGVjdGVkRm9ybWF0fWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHRoaXMudXRpbHMuY29sb3IucGFyc2VDb2xvcihcblx0XHRcdFx0c2VsZWN0ZWRGb3JtYXQsXG5cdFx0XHRcdHJhd1ZhbHVlXG5cdFx0XHQpIGFzIEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+O1xuXG5cdFx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaHNsQ29sb3IgPSB0aGlzLnV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHRcdD8gcGFyc2VkQ29sb3Jcblx0XHRcdFx0OiB0aGlzLmNvbnZlcnNpb25VdGlscy50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRcdHJldHVybiBoc2xDb2xvcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbCgpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogUHJvbWlzZTxIU0w+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2FwcGx5Rmlyc3RDb2xvclRvVUkoKSc7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbG9yQm94MSA9IHRoaXMuZG9tRGF0YS5lbGVtZW50cy5keW5hbWljLmRpdnMuY29sb3JCb3gxO1xuXG5cdFx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdjb2xvci1ib3gtMSBpcyBudWxsJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPVxuXHRcdFx0XHRhd2FpdCB0aGlzLmNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0XHR0aGlzLnV0aWxzLnBhbGV0dGUucG9wdWxhdGVPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbCgpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdjb3B5VG9DbGlwYm9hcmQoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHRcdC53cml0ZVRleHQoY29sb3JWYWx1ZSlcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZ2V0RXZlbnRMaXN0ZW5lckZuKCkudGVtcC5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDIpIHtcblx0XHRcdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdFx0XHRgQ29waWVkIGNvbG9yIHZhbHVlOiAke2NvbG9yVmFsdWV9YCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdFx0KCkgPT4gdG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0XHRcdFx0dGhpcy5jb25zdHMudGltZW91dHMudG9vbHRpcCB8fCAxMDAwXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0YEVycm9yIGNvcHlpbmcgdG8gY2xpcGJvYXJkOiAke2Vycn1gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQ6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGNyZWF0ZVBhbGV0dGVUYWJsZShwYWxldHRlOiBTdG9yZWRQYWxldHRlKTogSFRNTEVsZW1lbnQge1xuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcblx0XHR0YWJsZS5jbGFzc0xpc3QuYWRkKCdwYWxldHRlLXRhYmxlJyk7XG5cblx0XHRwYWxldHRlLnBhbGV0dGUuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcblx0XHRcdGNvbnN0IGNvbG9yQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdGNlbGwudGV4dENvbnRlbnQgPSBgQ29sb3IgJHtpbmRleCArIDF9YDtcblx0XHRcdGNvbG9yQm94LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWJveCcpO1xuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXRlbS5jb2xvcnMuY3NzLmhleDtcblxuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNvbG9yQm94KTtcblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKHJvdyk7XG5cdFx0fSk7XG5cblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCh0YWJsZSk7XG5cblx0XHRyZXR1cm4gZnJhZ21lbnQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudDtcblx0fVxuXG5cdHB1YmxpYyBkZXNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdkZXNhdHVyYXRlQ29sb3IoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB7XG5cdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRzZWxlY3RlZENvbG9yQm94OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHR9IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2dldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcigpJztcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KTtcblxuXHRcdGlmICghc2VsZWN0ZWRDb2xvckJveCkge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuKVxuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRgRWxlbWVudCBub3QgZm91bmQgZm9yIGNvbG9yICR7c2VsZWN0ZWRDb2xvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0dGhpcy5nZXRFdmVudExpc3RlbmVyRm4oKS50ZW1wLnNob3dUb2FzdChcblx0XHRcdFx0J1BsZWFzZSBzZWxlY3QgYSB2YWxpZCBjb2xvci4nXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogbnVsbCxcblx0XHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogbnVsbFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3Itc3RyaXBlLSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJRCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmlkO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXRBbGxJbnN0YW5jZXMoKTogVUlNYW5hZ2VyW10ge1xuXHRcdHJldHVybiBBcnJheS5mcm9tKFVJTWFuYWdlci5pbnN0YW5jZXMudmFsdWVzKCkpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1cnJlbnRQYWxldHRlKCk6IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+IHtcblx0XHRpZiAodGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuKSB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuKCk7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWxldHRlIHx8XG5cdFx0XHQodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPiAwID8gdGhpcy5wYWxldHRlSGlzdG9yeVswXSA6IG51bGwpXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2VCeUlkKGlkOiBudW1iZXIpOiBVSU1hbmFnZXIgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBVSU1hbmFnZXIuaW5zdGFuY2VzLmdldChpZCk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGRlbGV0ZUluc3RhbmNlQnlJZChpZDogbnVtYmVyKTogdm9pZCB7XG5cdFx0VUlNYW5hZ2VyLmluc3RhbmNlcy5kZWxldGUoaWQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUV4cG9ydChmb3JtYXQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnaGFuZGxlRXhwb3J0KCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlKCk7XG5cblx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0J05vIHBhbGV0dGUgYXZhaWxhYmxlIGZvciBleHBvcnQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAoZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ2Nzcyc6XG5cdFx0XHRcdFx0aW9Gbi5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2pzb24nOlxuXHRcdFx0XHRcdGlvRm4uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd4bWwnOlxuXHRcdFx0XHRcdGlvRm4uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXhwb3J0IGZvcm1hdDogJHtmb3JtYXR9YCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGV4cG9ydCBwYWxldHRlOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVJbXBvcnQoXG5cdFx0ZmlsZTogRmlsZSxcblx0XHRmb3JtYXQ6ICdKU09OJyB8ICdYTUwnIHwgJ0NTUydcblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnaGFuZGxlSW1wb3J0KCknO1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IGZpbGVVdGlscy5yZWFkRmlsZShmaWxlKTtcblxuXHRcdFx0bGV0IHBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnSlNPTic6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IGF3YWl0IGlvRm4uZGVzZXJpYWxpemUuZnJvbUpTT04oZGF0YSk7XG5cdFx0XHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0XHQnRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT04gZGF0YScsXG5cdFx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdYTUwnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSAoYXdhaXQgaW9Gbi5kZXNlcmlhbGl6ZS5mcm9tWE1MKGRhdGEpKSB8fCBudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdDU1MnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSAoYXdhaXQgaW9Gbi5kZXNlcmlhbGl6ZS5mcm9tQ1NTKGRhdGEpKSB8fCBudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgRmFpbGVkIHRvIGRlc2VyaWFsaXplICR7Zm9ybWF0fSBkYXRhYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGUpO1xuXG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFN1Y2Nlc3NmdWxseSBpbXBvcnRlZCBwYWxldHRlIGluICR7Zm9ybWF0fSBmb3JtYXQuYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBpbXBvcnQgZmlsZTogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+IGhhbmRsZUltcG9ydCgpYFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgbG9hZFBhbGV0dGVIaXN0b3J5KCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGhpc3RvcnkgPSBhd2FpdCB0aGlzLmlkYk1hbmFnZXIuZ2V0UGFsZXR0ZUhpc3RvcnkoKTtcblxuXHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKGhpc3RvcnkpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIG1ha2VQYWxldHRlQm94KFxuXHRcdGNvbG9yOiBDb2xvcixcblx0XHRzd2F0Y2hDb3VudDogbnVtYmVyXG5cdCk6IFByb21pc2U8UGFsZXR0ZUJveE9iamVjdD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnbWFrZVBhbGV0dGVCb3goKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKCF0aGlzLmNvcmVVdGlscy52YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdFx0aWYgKCF0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEludmFsaWQgJHtjb2xvci5mb3JtYXR9IGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbG9yU3RyaXBlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdFx0XHRzd2F0Y2hDb3VudFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHRoaXMuY29yZVV0aWxzLmJhc2UuY2xvbmUoY29sb3IpO1xuXG5cdFx0XHRjb25zdCBwYWxldHRlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRwYWxldHRlQm94LmNsYXNzTmFtZSA9ICdwYWxldHRlLWJveCc7XG5cdFx0XHRwYWxldHRlQm94LmlkID0gYHBhbGV0dGUtYm94LSR7c3dhdGNoQ291bnR9YDtcblxuXHRcdFx0Y29uc3QgcGFsZXR0ZUJveFRvcEhhbGYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdHBhbGV0dGVCb3hUb3BIYWxmLmNsYXNzTmFtZSA9XG5cdFx0XHRcdCdwYWxldHRlLWJveC1oYWxmIHBhbGV0dGUtYm94LXRvcC1oYWxmJztcblx0XHRcdHBhbGV0dGVCb3hUb3BIYWxmLmlkID0gYHBhbGV0dGUtYm94LXRvcC1oYWxmLSR7c3dhdGNoQ291bnR9YDtcblxuXHRcdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2lucHV0J1xuXHRcdFx0KSBhcyBDb2xvcklucHV0RWxlbWVudDtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC50eXBlID0gJ3RleHQnO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmNsYXNzTmFtZSA9ICdjb2xvci10ZXh0LW91dHB1dC1ib3ggdG9vbHRpcCc7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guaWQgPSBgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c3dhdGNoQ291bnR9YDtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgJ2hleCcpO1xuXG5cdFx0XHRjb25zdCBjb2xvclN0cmluZyA9XG5cdFx0XHRcdGF3YWl0IHRoaXMuY29yZVV0aWxzLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnZhbHVlID0gY29sb3JTdHJpbmcgfHwgJyc7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guY29sb3JWYWx1ZXMgPSBjbG9uZWRDb2xvcjtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5yZWFkT25seSA9IGZhbHNlO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnN0eWxlLmN1cnNvciA9ICd0ZXh0Jztcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG5cdFx0XHRjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHRjb3B5QnV0dG9uLmNsYXNzTmFtZSA9ICdjb3B5LWJ1dHRvbic7XG5cdFx0XHRjb3B5QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHknO1xuXG5cdFx0XHRjb25zdCB0b29sdGlwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdHRvb2x0aXBUZXh0LmNsYXNzTmFtZSA9ICd0b29sdGlwdGV4dCc7XG5cdFx0XHR0b29sdGlwVGV4dC50ZXh0Q29udGVudCA9ICdDb3BpZWQgdG8gY2xpcGJvYXJkISc7XG5cblx0XHRcdGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0YXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoXG5cdFx0XHRcdFx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWVcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0dGhpcy5nZXRFdmVudExpc3RlbmVyRm4oKS50ZW1wLnNob3dUb29sdGlwKFxuXHRcdFx0XHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNsZWFyVGltZW91dChjb25zdHMudGltZW91dHMudG9vbHRpcCB8fCAxMDAwKTtcblxuXHRcdFx0XHRcdGNvcHlCdXR0b24udGV4dENvbnRlbnQgPSAnQ29waWVkISc7XG5cdFx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHRcdCgpID0+IChjb3B5QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHknKSxcblx0XHRcdFx0XHRcdGNvbnN0cy50aW1lb3V0cy5jb3B5QnV0dG9uVGV4dCB8fCAxMDAwXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRpZiAoIXRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0YEZhaWxlZCB0byBjb3B5OiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guYWRkRXZlbnRMaXN0ZW5lcihcblx0XHRcdFx0J2lucHV0Jyxcblx0XHRcdFx0dGhpcy5jb3JlVXRpbHMuYmFzZS5kZWJvdW5jZSgoZTogRXZlbnQpID0+IHtcblx0XHRcdFx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblx0XHRcdFx0XHRpZiAodGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjc3NDb2xvciA9IHRhcmdldC52YWx1ZS50cmltKCk7XG5cdFx0XHRcdFx0XHRjb25zdCBib3hFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdFx0XHRcdGBjb2xvci1ib3gtJHtzd2F0Y2hDb3VudH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgc3RyaXBlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRcdFx0XHRgY29sb3Itc3RyaXBlLSR7c3dhdGNoQ291bnR9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0aWYgKGJveEVsZW1lbnQpXG5cdFx0XHRcdFx0XHRcdGJveEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY3NzQ29sb3I7XG5cdFx0XHRcdFx0XHRpZiAoc3RyaXBlRWxlbWVudClcblx0XHRcdFx0XHRcdFx0c3RyaXBlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjc3NDb2xvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGNvbnN0cy5kZWJvdW5jZS5pbnB1dCB8fCAyMDApXG5cdFx0XHQpO1xuXG5cdFx0XHRwYWxldHRlQm94VG9wSGFsZi5hcHBlbmRDaGlsZChjb2xvclRleHRPdXRwdXRCb3gpO1xuXHRcdFx0cGFsZXR0ZUJveFRvcEhhbGYuYXBwZW5kQ2hpbGQoY29weUJ1dHRvbik7XG5cblx0XHRcdGNvbnN0IHBhbGV0dGVCb3hCb3R0b21IYWxmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRwYWxldHRlQm94Qm90dG9tSGFsZi5jbGFzc05hbWUgPVxuXHRcdFx0XHQncGFsZXR0ZS1ib3gtaGFsZiBwYWxldHRlLWJveC1ib3R0b20taGFsZic7XG5cdFx0XHRwYWxldHRlQm94Qm90dG9tSGFsZi5pZCA9IGBwYWxldHRlLWJveC1ib3R0b20taGFsZi0ke3N3YXRjaENvdW50fWA7XG5cblx0XHRcdGNvbnN0IGNvbG9yQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRjb2xvckJveC5jbGFzc05hbWUgPSAnY29sb3ItYm94Jztcblx0XHRcdGNvbG9yQm94LmlkID0gYGNvbG9yLWJveC0ke3N3YXRjaENvdW50fWA7XG5cdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvclN0cmluZyB8fCAnI2ZmZmZmZic7XG5cblx0XHRcdHBhbGV0dGVCb3hCb3R0b21IYWxmLmFwcGVuZENoaWxkKGNvbG9yQm94KTtcblx0XHRcdHBhbGV0dGVCb3guYXBwZW5kQ2hpbGQocGFsZXR0ZUJveFRvcEhhbGYpO1xuXHRcdFx0cGFsZXR0ZUJveC5hcHBlbmRDaGlsZChwYWxldHRlQm94Qm90dG9tSGFsZik7XG5cblx0XHRcdGNvbnN0IGNvbG9yU3RyaXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRjb2xvclN0cmlwZS5jbGFzc05hbWUgPSAnY29sb3Itc3RyaXBlJztcblx0XHRcdGNvbG9yU3RyaXBlLmlkID0gYGNvbG9yLXN0cmlwZS0ke3N3YXRjaENvdW50fWA7XG5cdFx0XHRjb2xvclN0cmlwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvclN0cmluZyB8fCAnI2ZmZmZmZic7XG5cblx0XHRcdGNvbG9yU3RyaXBlLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgJ3RydWUnKTtcblxuXHRcdFx0dGhpcy5nZXRFdmVudExpc3RlbmVyRm4oKS5kYWQuYXR0YWNoKGNvbG9yU3RyaXBlKTtcblxuXHRcdFx0Y29sb3JTdHJpcGUuYXBwZW5kQ2hpbGQocGFsZXR0ZUJveCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvbG9yU3RyaXBlLFxuXHRcdFx0XHRzd2F0Y2hDb3VudDogc3dhdGNoQ291bnQgKyAxXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAoIXRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZXhlY3V0ZSBtYWtlUGFsZXR0ZUJveDogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29sb3JTdHJpcGU6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0XHRzd2F0Y2hDb3VudFxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgcHVsbFBhcmFtc0Zyb21VSSgpOiB7XG5cdFx0dHlwZTogbnVtYmVyO1xuXHRcdHN3YXRjaGVzOiBudW1iZXI7XG5cdFx0bGltaXREYXJrOiBib29sZWFuO1xuXHRcdGxpbWl0R3JheTogYm9vbGVhbjtcblx0XHRsaW1pdExpZ2h0OiBib29sZWFuO1xuXHR9IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3B1bGxQYXJhbXNGcm9tVUkoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGVFbGVtZW50ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuc2VsZWN0cy5wYWxldHRlVHlwZTtcblx0XHRcdGNvbnN0IG51bVN3YXRjaGVzRWxlbWVudCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLnNlbGVjdHMuc3dhdGNoR2VuO1xuXHRcdFx0Y29uc3QgbGltaXREYXJrQ2hrYnggPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5pbnB1dHMubGltaXREYXJrQ2hrYng7XG5cdFx0XHRjb25zdCBsaW1pdEdyYXlDaGtieCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLmlucHV0cy5saW1pdEdyYXlDaGtieDtcblx0XHRcdGNvbnN0IGxpbWl0TGlnaHRDaGtieCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLmlucHV0cy5saW1pdExpZ2h0Q2hrYng7XG5cblx0XHRcdGlmICghcGFsZXR0ZVR5cGVFbGVtZW50ICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPj0gMikge1xuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHQncGFsZXR0ZVR5cGVPcHRpb25zIERPTSBlbGVtZW50IG5vdCBmb3VuZCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFudW1Td2F0Y2hlc0VsZW1lbnQgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+PSAyKSB7XG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBudW1Cb3hlcyBET00gZWxlbWVudCBub3QgZm91bmRgLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0KCFsaW1pdERhcmtDaGtieCB8fCAhbGltaXRHcmF5Q2hrYnggfHwgIWxpbWl0TGlnaHRDaGtieCkgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+PSAyXG5cdFx0XHQpIHtcblx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0YE9uZSBvciBtb3JlIGNoZWNrYm94ZXMgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IHBhbGV0dGVUeXBlRWxlbWVudFxuXHRcdFx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0XHQ6IDAsXG5cdFx0XHRcdHN3YXRjaGVzOiBudW1Td2F0Y2hlc0VsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KG51bVN3YXRjaGVzRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRsaW1pdERhcms6IGxpbWl0RGFya0Noa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXk6IGxpbWl0R3JheUNoa2J4Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdExpZ2h0OiBsaW1pdExpZ2h0Q2hrYng/LmNoZWNrZWQgfHwgZmFsc2Vcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIHB1bGwgcGFyYW1ldGVycyBmcm9tIFVJOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiAwLFxuXHRcdFx0XHRzd2F0Y2hlczogMCxcblx0XHRcdFx0bGltaXREYXJrOiBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5OiBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodDogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlbW92ZVBhbGV0dGVGcm9tSGlzdG9yeShwYWxldHRlSUQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGhpc3RvcnkgPSBhd2FpdCB0aGlzLmlkYk1hbmFnZXIuZ2V0UGFsZXR0ZUhpc3RvcnkoKTtcblx0XHRjb25zdCB1cGRhdGVkSGlzdG9yeSA9IGhpc3RvcnkuZmlsdGVyKHAgPT4gcC5pZCAhPT0gcGFsZXR0ZUlEKTtcblxuXHRcdGF3YWl0IHRoaXMuaWRiTWFuYWdlci5zYXZlUGFsZXR0ZUhpc3RvcnkodXBkYXRlZEhpc3RvcnkpO1xuXHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKCk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVuZGVyUGFsZXR0ZSh0YWJsZUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdyZW5kZXJQYWxldHRlKCknO1xuXG5cdFx0aWYgKCF0aGlzLmdldFN0b3JlZFBhbGV0dGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSBmZXRjaGluZyBmdW5jdGlvbiBoYXMgbm90IGJlZW4gc2V0LicpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmRiVXRpbHMuaGFuZGxlQXN5bmMoXG5cdFx0XHRhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlZFBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldFN0b3JlZFBhbGV0dGUhKHRhYmxlSWQpO1xuXHRcdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSWR9IG5vdCBmb3VuZC5gKTtcblx0XHRcdFx0aWYgKCFwYWxldHRlUm93KVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSByb3cgZWxlbWVudCBub3QgZm91bmQuJyk7XG5cblx0XHRcdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblxuXHRcdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblx0XHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZCh0YWJsZUVsZW1lbnQpO1xuXG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMilcblx0XHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRcdGBSZW5kZXJlZCBwYWxldHRlICR7dGFibGVJZH0uYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdCdFcnJvciByZW5kZXJpbmcgcGFsZXR0ZScsXG5cdFx0XHQnVUlNYW5hZ2VyLnJlbmRlclBhbGV0dGUoKSdcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIHNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdzYXR1cmF0ZUNvbG9yKCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHRcdFx0Ly8gKkRFVi1OT1RFKiB1bmZpbmlzaGVkIGZ1bmN0aW9uXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzZXRDdXJyZW50UGFsZXR0ZShwYWxldHRlOiBQYWxldHRlKTogdm9pZCB7XG5cdFx0dGhpcy5jdXJyZW50UGFsZXR0ZSA9IHBhbGV0dGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0R2V0Q3VycmVudFBhbGV0dGVGbihmbjogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4pOiB2b2lkIHtcblx0XHR0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4gPSBmbjtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRTdG9yZWRQYWxldHRlKFxuXHRcdGdldHRlcjogKGlkOiBzdHJpbmcpID0+IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+XG5cdCk6IHZvaWQge1xuXHRcdHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSA9IGdldHRlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXRJREJNYW5hZ2VyKGlkYk1hbmFnZXI6IElEQk1hbmFnZXIpIHtcblx0XHR0aGlzLmlkYk1hbmFnZXIgPSBpZGJNYW5hZ2VyO1xuXHR9XG5cblx0Ly8vICogKiAqICogKiAqIFBSSVZBVEUgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblxuXHRwcml2YXRlIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dGhpcy5pZGJNYW5hZ2VyID0gYXdhaXQgSURCTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG5cdFx0YXdhaXQgdGhpcy5sb2FkUGFsZXR0ZUhpc3RvcnkoKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RXZlbnRMaXN0ZW5lckZuKCk6IERPTUZuX0V2ZW50TGlzdGVuZXJGbkludGVyZmFjZSB7XG5cdFx0aWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJGbikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZXZlbnRMaXN0ZW5lckZuO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVIaXN0b3J5VUkoaGlzdG9yeTogUGFsZXR0ZVtdID0gW10pOiB2b2lkIHtcblx0XHRjb25zdCBoaXN0b3J5TGlzdCA9IHRoaXMuZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuZGl2cy5wYWxldHRlSGlzdG9yeTtcblx0XHRpZiAoIWhpc3RvcnlMaXN0KSByZXR1cm47XG5cblx0XHRoaXN0b3J5TGlzdC5pbm5lckhUTUwgPSAnJztcblxuXHRcdGhpc3RvcnkuZm9yRWFjaChwYWxldHRlID0+IHtcblx0XHRcdGNvbnN0IGVudHJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRlbnRyeS5jbGFzc0xpc3QuYWRkKCdoaXN0b3J5LWl0ZW0nKTtcblx0XHRcdGVudHJ5LmlkID0gYHBhbGV0dGVfJHtwYWxldHRlLmlkfWA7XG5cblx0XHRcdGVudHJ5LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHA+UGFsZXR0ZSAjJHtwYWxldHRlLm1ldGFkYXRhLm5hbWUgfHwgcGFsZXR0ZS5pZH08L3A+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2xvci1wcmV2aWV3XCI+XG5cdFx0XHRcdFx0JHtwYWxldHRlLml0ZW1zLm1hcChpdGVtID0+IGA8c3BhbiBjbGFzcz1cImNvbG9yLWJveFwiIHN0eWxlPVwiYmFja2dyb3VuZDogJHtpdGVtLmNvbG9ycy5jc3MuaGV4fTtcIj48L3NwYW4+YCkuam9pbignICcpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInJlbW92ZS1oaXN0b3J5LWl0ZW1cIiBkYXRhLWlkPVwiJHtwYWxldHRlLmlkfS1oaXN0b3J5LXJlbW92ZS1idG5cIj5SZW1vdmU8L2J1dHRvbj5cblx0XHRcdGA7XG5cblx0XHRcdGVudHJ5XG5cdFx0XHRcdC5xdWVyeVNlbGVjdG9yKCcucmVtb3ZlLWhpc3RvcnktaXRlbScpXG5cdFx0XHRcdD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5yZW1vdmVQYWxldHRlRnJvbUhpc3RvcnkocGFsZXR0ZS5pZCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRoaXN0b3J5TGlzdC5hcHBlbmRDaGlsZChlbnRyeSk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==