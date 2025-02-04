// File: src/ui/UIManager.ts
import { IDBManager } from '../db/IDBManager.js';
import { commonFn } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { constsData as consts } from '../data/consts.js';
import { domData } from '../data/dom.js';
import { download, readFile } from '../dom/utils.js';
import { ioFn } from '../io/index.js';
import { modeData as mode } from '../data/mode.js';
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
    utils;
    getCurrentPaletteFn;
    getStoredPalette;
    eventListenerFn;
    constructor(eventListenerFn, idbManager) {
        this.init();
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.idbManager = idbManager || null;
        this.paletteHistory = [];
        this.consts = consts;
        this.domData = domData;
        this.logMode = mode.logging;
        this.mode = mode;
        this.coreUtils = commonFn.core;
        this.utils = commonFn.utils;
        this.conversionUtils = commonFn.convert;
        this.eventListenerFn = eventListenerFn;
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
                this.getEventListenerFn().temp.showTooltip(tooltipElement);
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
            if (this.logMode.info && this.logMode.verbosity > 1) {
                logger.info(`Successfully imported palette in ${format} format.`, `${thisModule} > ${thisMethod}`);
            }
        }
        catch (error) {
            logger.error(`Failed to import file: ${error}`, `${thisModule} > handleImport()`);
        }
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
    getEventListenerFn() {
        if (!this.eventListenerFn) {
            throw new Error('Event listeners have not been initialized yet.');
        }
        return this.eventListenerFn;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL1VJTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFtQjVCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLElBQUksTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7QUFFckMsTUFBTSxTQUFTLEdBQUc7SUFDakIsUUFBUTtJQUNSLFFBQVE7Q0FDUixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE9BQU8sU0FBUztJQUNiLE1BQU0sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsNkJBQTZCO0lBQ3pELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUMsQ0FBQyxvQkFBb0I7SUFDckUsRUFBRSxDQUFTLENBQUMscUJBQXFCO0lBQ2pDLGNBQWMsR0FBbUIsSUFBSSxDQUFDO0lBQ3RDLGNBQWMsR0FBYyxFQUFFLENBQUM7SUFFL0IsVUFBVSxDQUFvQjtJQUU5QixNQUFNLENBQXNCO0lBQzVCLE9BQU8sQ0FBbUI7SUFDMUIsT0FBTyxD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LENBQUM7WUFFbkQsU0FBUyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7WUFDakMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUMvQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLHFCQUFxQixDQUFDO1lBRTFELFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQzlDLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxTQUFTO2dCQUNkLFFBQVE7Z0JBQ1I7a0JBQ2MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEVBQUU7aUNBQ3BCLE1BQU07S0FDbEMsQ0FBQztZQUVILFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL3VpL1VJTWFuYWdlci50c1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0Q29uc3RzRGF0YUludGVyZmFjZSxcblx0RE9NRGF0YUludGVyZmFjZSxcblx0RE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlLFxuXHRIU0wsXG5cdE1vZGVEYXRhSW50ZXJmYWNlLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlQm94T2JqZWN0LFxuXHRTTCxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFVJTWFuYWdlcl9DbGFzc0ludGVyZmFjZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBJREJNYW5hZ2VyIH0gZnJvbSAnLi4vZGIvSURCTWFuYWdlci5qcyc7XG5pbXBvcnQgeyBjb21tb25GbiB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgY29uc3RzRGF0YSBhcyBjb25zdHMgfSBmcm9tICcuLi9kYXRhL2NvbnN0cy5qcyc7XG5pbXBvcnQgeyBkb21EYXRhIH0gZnJvbSAnLi4vZGF0YS9kb20uanMnO1xuaW1wb3J0IHsgZG93bmxvYWQsIHJlYWRGaWxlIH0gZnJvbSAnLi4vZG9tL3V0aWxzLmpzJztcbmltcG9ydCB7IGlvRm4gfSBmcm9tICcuLi9pby9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgdGhpc01vZHVsZSA9ICd1aS9VSU1hbmFnZXIudHMnO1xuXG5jb25zdCBmaWxlVXRpbHMgPSB7XG5cdGRvd25sb2FkLFxuXHRyZWFkRmlsZVxufTtcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmV4cG9ydCBjbGFzcyBVSU1hbmFnZXIgaW1wbGVtZW50cyBVSU1hbmFnZXJfQ2xhc3NJbnRlcmZhY2Uge1xuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZUNvdW50ZXIgPSAwOyAvLyBzdGF0aWMgaW5zdGFuY2UgSUQgY291bnRlclxuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZXMgPSBuZXcgTWFwPG51bWJlciwgVUlNYW5hZ2VyPigpOyAvLyBpbnN0YW5jZSByZWdpc3RyeVxuXHRwcml2YXRlIGlkOiBudW1iZXI7IC8vIHVuaXF1ZSBpbnN0YW5jZSBJRFxuXHRwcml2YXRlIGN1cnJlbnRQYWxldHRlOiBQYWxldHRlIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgcGFsZXR0ZUhpc3Rvcnk6IFBhbGV0dGVbXSA9IFtdO1xuXG5cdHByaXZhdGUgaWRiTWFuYWdlcjogSURCTWFuYWdlciB8IG51bGw7XG5cblx0cHJpdmF0ZSBjb25zdHM6IENvbnN0c0RhdGFJbnRlcmZhY2U7XG5cdHByaXZhdGUgZG9tRGF0YTogRE9NRGF0YUludGVyZmFjZTtcblx0cHJpdmF0ZSBsb2dNb2RlOiBNb2RlRGF0YUludGVyZmFjZVsnbG9nZ2luZyddO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhSW50ZXJmYWNlO1xuXG5cdHByaXZhdGUgY29udmVyc2lvblV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2NvbnZlcnQnXTtcblx0cHJpdmF0ZSBjb3JlVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddO1xuXHRwcml2YXRlIHV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ107XG5cblx0cHJpdmF0ZSBnZXRDdXJyZW50UGFsZXR0ZUZuPzogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD47XG5cdHByaXZhdGUgZ2V0U3RvcmVkUGFsZXR0ZT86IChpZDogc3RyaW5nKSA9PiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPjtcblxuXHRwcml2YXRlIGV2ZW50TGlzdGVuZXJGbjogRE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdGV2ZW50TGlzdGVuZXJGbjogRE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlLFxuXHRcdGlkYk1hbmFnZXI/OiBJREJNYW5hZ2VyXG5cdCkge1xuXHRcdHRoaXMuaW5pdCgpO1xuXG5cdFx0dGhpcy5pZCA9IFVJTWFuYWdlci5pbnN0YW5jZUNvdW50ZXIrKztcblxuXHRcdFVJTWFuYWdlci5pbnN0YW5jZXMuc2V0KHRoaXMuaWQsIHRoaXMpO1xuXG5cdFx0dGhpcy5pZGJNYW5hZ2VyID0gaWRiTWFuYWdlciB8fCBudWxsO1xuXG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IFtdO1xuXG5cdFx0dGhpcy5jb25zdHMgPSBjb25zdHM7XG5cdFx0dGhpcy5kb21EYXRhID0gZG9tRGF0YTtcblx0XHR0aGlzLmxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cdFx0dGhpcy5tb2RlID0gbW9kZTtcblxuXHRcdHRoaXMuY29yZVV0aWxzID0gY29tbW9uRm4uY29yZTtcblx0XHR0aGlzLnV0aWxzID0gY29tbW9uRm4udXRpbHM7XG5cdFx0dGhpcy5jb252ZXJzaW9uVXRpbHMgPSBjb21tb25Gbi5jb252ZXJ0O1xuXG5cdFx0dGhpcy5ldmVudExpc3RlbmVyRm4gPSBldmVudExpc3RlbmVyRm47XG5cdH1cblxuXHQvKiBQVUJMSUMgTUVUSE9EUyAqL1xuXG5cdHB1YmxpYyBhc3luYyBhZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGU6IFBhbGV0dGUpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2FkZFBhbGV0dGVUb0hpc3RvcnkoKSc7XG5cblx0XHRjb25zdCBpZGJNYW5hZ2VyID0gYXdhaXQgSURCTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXHRcdGNvbnN0IG1heEhpc3RvcnkgPSAoYXdhaXQgaWRiTWFuYWdlci5nZXRTZXR0aW5ncygpKS5tYXhIaXN0b3J5O1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGhpc3RvcnkgPSBhd2FpdCBpZGJNYW5hZ2VyLmdldFBhbGV0dGVIaXN0b3J5KCk7XG5cdFx0XHRjb25zdCBuZXdJRCA9IGF3YWl0IGlkYk1hbmFnZXIuZ2V0TmV4dFBhbGV0dGVJRCgpO1xuXHRcdFx0Y29uc3QgaWRTdHJpbmcgPSBgJHtwYWxldHRlLm1ldGFkYXRhLnR5cGV9XyR7bmV3SUR9YDtcblxuXHRcdFx0YXdhaXQgaWRiTWFuYWdlci5zYXZlUGFsZXR0ZUhpc3RvcnkoaGlzdG9yeSk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IXRoaXMubW9kZS5xdWlldCAmJlxuXHRcdFx0XHR0aGlzLm1vZGUuZGVidWcgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDJcblx0XHRcdClcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEFkZGVkIHBhbGV0dGUgd2l0aCBJRCAke2lkU3RyaW5nfSB0byBoaXN0b3J5YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIGFkZGluZyBwYWxldHRlIHRvIGhpc3Rvcnk6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5LnVuc2hpZnQocGFsZXR0ZSk7XG5cblx0XHRpZiAodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPiBtYXhIaXN0b3J5KSB0aGlzLnBhbGV0dGVIaXN0b3J5LnBvcCgpO1xuXG5cdFx0aWYgKHRoaXMuaWRiTWFuYWdlcikge1xuXHRcdFx0YXdhaXQgdGhpcy5pZGJNYW5hZ2VyLnNhdmVQYWxldHRlSGlzdG9yeSh0aGlzLnBhbGV0dGVIaXN0b3J5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgaWRiTWFuYWdlciA9IGF3YWl0IElEQk1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblx0XHRcdGF3YWl0IGlkYk1hbmFnZXIuc2F2ZVBhbGV0dGVIaXN0b3J5KHRoaXMucGFsZXR0ZUhpc3RvcnkpO1xuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKCk7XG5cdH1cblxuXHRwdWJsaWMgYXBwbHlDdXN0b21Db2xvcigpOiBIU0wge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnYXBwbHlDdXN0b21Db2xvcigpJztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cblx0XHRcdC8vICpERVYtTk9URSogQWRkIHRoaXMgdG8gdGhlIERhdGEgb2JqZWN0XG5cdFx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIXRoaXMudXRpbHMuY29sb3IuaXNDb2xvclNwYWNlKHNlbGVjdGVkRm9ybWF0KSkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke3NlbGVjdGVkRm9ybWF0fWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHRoaXMudXRpbHMuY29sb3IucGFyc2VDb2xvcihcblx0XHRcdFx0c2VsZWN0ZWRGb3JtYXQsXG5cdFx0XHRcdHJhd1ZhbHVlXG5cdFx0XHQpIGFzIEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+O1xuXG5cdFx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaHNsQ29sb3IgPSB0aGlzLnV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHRcdD8gcGFyc2VkQ29sb3Jcblx0XHRcdFx0OiB0aGlzLmNvbnZlcnNpb25VdGlscy50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRcdHJldHVybiBoc2xDb2xvcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbCgpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogUHJvbWlzZTxIU0w+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2FwcGx5Rmlyc3RDb2xvclRvVUkoKSc7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbG9yQm94MSA9IHRoaXMuZG9tRGF0YS5lbGVtZW50cy5keW5hbWljLmRpdnMuY29sb3JCb3gxO1xuXG5cdFx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdjb2xvci1ib3gtMSBpcyBudWxsJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPVxuXHRcdFx0XHRhd2FpdCB0aGlzLmNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0XHR0aGlzLnV0aWxzLnBhbGV0dGUucG9wdWxhdGVPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbCgpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdjb3B5VG9DbGlwYm9hcmQoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHRcdC53cml0ZVRleHQoY29sb3JWYWx1ZSlcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZ2V0RXZlbnRMaXN0ZW5lckZuKCkudGVtcC5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQhdGhpcy5tb2RlLnF1aWV0ICYmXG5cdFx0XHRcdFx0XHR0aGlzLm1vZGUuZGVidWcgJiZcblx0XHRcdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAyICYmXG5cdFx0XHRcdFx0XHR0aGlzLmxvZ01vZGUuaW5mb1xuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0XHR0aGlzLmNvbnN0cy50aW1lb3V0cy50b29sdGlwIHx8IDEwMDBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6ICR7ZXJyfWAsXG5cdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgY3JlYXRlUGFsZXR0ZVRhYmxlKHBhbGV0dGU6IFN0b3JlZFBhbGV0dGUpOiBIVE1MRWxlbWVudCB7XG5cdFx0Y29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0Y29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuXHRcdHRhYmxlLmNsYXNzTGlzdC5hZGQoJ3BhbGV0dGUtdGFibGUnKTtcblxuXHRcdHBhbGV0dGUucGFsZXR0ZS5pdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRcdFx0Y2VsbC50ZXh0Q29udGVudCA9IGBDb2xvciAke2luZGV4ICsgMX1gO1xuXHRcdFx0Y29sb3JCb3guY2xhc3NMaXN0LmFkZCgnY29sb3ItYm94Jyk7XG5cdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpdGVtLmNvbG9ycy5jc3MuaGV4O1xuXG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY29sb3JCb3gpO1xuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdFx0dGFibGUuYXBwZW5kQ2hpbGQocm93KTtcblx0XHR9KTtcblxuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKHRhYmxlKTtcblxuXHRcdHJldHVybiBmcmFnbWVudCBhcyB1bmtub3duIGFzIEhUTUxFbGVtZW50O1xuXHR9XG5cblx0cHVibGljIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2Rlc2F0dXJhdGVDb2xvcigpJztcblxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdHNlbGVjdGVkQ29sb3JCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdH0ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKCknO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpO1xuXG5cdFx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm4pXG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHR0aGlzLmdldEV2ZW50TGlzdGVuZXJGbigpLnRlbXAuc2hvd1RvYXN0KFxuXHRcdFx0XHQnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLidcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBudWxsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdCksXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci1zdHJpcGUtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdClcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIGdldElEKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuaWQ7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEFsbEluc3RhbmNlcygpOiBVSU1hbmFnZXJbXSB7XG5cdFx0cmV0dXJuIEFycmF5LmZyb20oVUlNYW5hZ2VyLmluc3RhbmNlcy52YWx1ZXMoKSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGUoKTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdGlmICh0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4pIHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4oKTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRcdHRoaXMuY3VycmVudFBhbGV0dGUgfHxcblx0XHRcdCh0aGlzLnBhbGV0dGVIaXN0b3J5Lmxlbmd0aCA+IDAgPyB0aGlzLnBhbGV0dGVIaXN0b3J5WzBdIDogbnVsbClcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZUJ5SWQoaWQ6IG51bWJlcik6IFVJTWFuYWdlciB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIFVJTWFuYWdlci5pbnN0YW5jZXMuZ2V0KGlkKTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZGVsZXRlSW5zdGFuY2VCeUlkKGlkOiBudW1iZXIpOiB2b2lkIHtcblx0XHRVSU1hbmFnZXIuaW5zdGFuY2VzLmRlbGV0ZShpZCk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgaGFuZGxlRXhwb3J0KGZvcm1hdDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdoYW5kbGVFeHBvcnQoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGUoKTtcblxuXHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHQnTm8gcGFsZXR0ZSBhdmFpbGFibGUgZm9yIGV4cG9ydCcsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnY3NzJzpcblx0XHRcdFx0XHRpb0ZuLmV4cG9ydFBhbGV0dGUocGFsZXR0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnanNvbic6XG5cdFx0XHRcdFx0aW9Gbi5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3htbCc6XG5cdFx0XHRcdFx0aW9Gbi5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBleHBvcnQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvciAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZXhwb3J0IHBhbGV0dGU6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUltcG9ydChcblx0XHRmaWxlOiBGaWxlLFxuXHRcdGZvcm1hdDogJ0pTT04nIHwgJ1hNTCcgfCAnQ1NTJ1xuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdoYW5kbGVJbXBvcnQoKSc7XG5cdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgZmlsZVV0aWxzLnJlYWRGaWxlKGZpbGUpO1xuXG5cdFx0XHRsZXQgcGFsZXR0ZTogUGFsZXR0ZSB8IG51bGwgPSBudWxsO1xuXG5cdFx0XHRzd2l0Y2ggKGZvcm1hdCkge1xuXHRcdFx0XHRjYXNlICdKU09OJzpcblx0XHRcdFx0XHRwYWxldHRlID0gYXdhaXQgaW9Gbi5kZXNlcmlhbGl6ZS5mcm9tSlNPTihkYXRhKTtcblx0XHRcdFx0XHRpZiAoIXBhbGV0dGUpIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRcdCdGYWlsZWQgdG8gZGVzZXJpYWxpemUgSlNPTiBkYXRhJyxcblx0XHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ1hNTCc6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IChhd2FpdCBpb0ZuLmRlc2VyaWFsaXplLmZyb21YTUwoZGF0YSkpIHx8IG51bGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0NTUyc6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IChhd2FpdCBpb0ZuLmRlc2VyaWFsaXplLmZyb21DU1MoZGF0YSkpIHx8IG51bGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Zm9ybWF0fWApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXBhbGV0dGUpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvciAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzZXJpYWxpemUgJHtmb3JtYXR9IGRhdGFgLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmFkZFBhbGV0dGVUb0hpc3RvcnkocGFsZXR0ZSk7XG5cblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuaW5mbyAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgU3VjY2Vzc2Z1bGx5IGltcG9ydGVkIHBhbGV0dGUgaW4gJHtmb3JtYXR9IGZvcm1hdC5gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGltcG9ydCBmaWxlOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gaGFuZGxlSW1wb3J0KClgXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyBtYWtlUGFsZXR0ZUJveChcblx0XHRjb2xvcjogQ29sb3IsXG5cdFx0c3dhdGNoQ291bnQ6IG51bWJlclxuXHQpOiBQcm9taXNlPFBhbGV0dGVCb3hPYmplY3Q+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ21ha2VQYWxldHRlQm94KCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdGhpcy5jb3JlVXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRcdGlmICghdGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBJbnZhbGlkICR7Y29sb3IuZm9ybWF0fSBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRjb2xvclN0cmlwZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRcdFx0c3dhdGNoQ291bnRcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB0aGlzLmNvcmVVdGlscy5iYXNlLmNsb25lKGNvbG9yKTtcblxuXHRcdFx0Y29uc3QgcGFsZXR0ZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0cGFsZXR0ZUJveC5jbGFzc05hbWUgPSAncGFsZXR0ZS1ib3gnO1xuXHRcdFx0cGFsZXR0ZUJveC5pZCA9IGBwYWxldHRlLWJveC0ke3N3YXRjaENvdW50fWA7XG5cblx0XHRcdGNvbnN0IHBhbGV0dGVCb3hUb3BIYWxmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRwYWxldHRlQm94VG9wSGFsZi5jbGFzc05hbWUgPVxuXHRcdFx0XHQncGFsZXR0ZS1ib3gtaGFsZiBwYWxldHRlLWJveC10b3AtaGFsZic7XG5cdFx0XHRwYWxldHRlQm94VG9wSGFsZi5pZCA9IGBwYWxldHRlLWJveC10b3AtaGFsZi0ke3N3YXRjaENvdW50fWA7XG5cblx0XHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdpbnB1dCdcblx0XHRcdCkgYXMgQ29sb3JJbnB1dEVsZW1lbnQ7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3gudHlwZSA9ICd0ZXh0Jztcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5jbGFzc05hbWUgPSAnY29sb3ItdGV4dC1vdXRwdXQtYm94IHRvb2x0aXAnO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmlkID0gYGNvbG9yLXRleHQtb3V0cHV0LWJveC0ke3N3YXRjaENvdW50fWA7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsICdoZXgnKTtcblxuXHRcdFx0Y29uc3QgY29sb3JTdHJpbmcgPVxuXHRcdFx0XHRhd2FpdCB0aGlzLmNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhjbG9uZWRDb2xvcik7XG5cblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC52YWx1ZSA9IGNvbG9yU3RyaW5nIHx8ICcnO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmNvbG9yVmFsdWVzID0gY2xvbmVkQ29sb3I7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3gucmVhZE9ubHkgPSBmYWxzZTtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5zdHlsZS5jdXJzb3IgPSAndGV4dCc7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcblxuXHRcdFx0Y29uc3QgY29weUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0Y29weUJ1dHRvbi5jbGFzc05hbWUgPSAnY29weS1idXR0b24nO1xuXHRcdFx0Y29weUJ1dHRvbi50ZXh0Q29udGVudCA9ICdDb3B5JztcblxuXHRcdFx0Y29uc3QgdG9vbHRpcFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHR0b29sdGlwVGV4dC5jbGFzc05hbWUgPSAndG9vbHRpcHRleHQnO1xuXHRcdFx0dG9vbHRpcFRleHQudGV4dENvbnRlbnQgPSAnQ29waWVkIHRvIGNsaXBib2FyZCEnO1xuXG5cdFx0XHRjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KFxuXHRcdFx0XHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnZhbHVlXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHRoaXMuZ2V0RXZlbnRMaXN0ZW5lckZuKCkudGVtcC5zaG93VG9vbHRpcChcblx0XHRcdFx0XHRcdGNvbG9yVGV4dE91dHB1dEJveFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoY29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMCk7XG5cblx0XHRcdFx0XHRjb3B5QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcGllZCEnO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHQoKSA9PiAoY29weUJ1dHRvbi50ZXh0Q29udGVudCA9ICdDb3B5JyksXG5cdFx0XHRcdFx0XHRjb25zdHMudGltZW91dHMuY29weUJ1dHRvblRleHQgfHwgMTAwMFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gY29weTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdCdpbnB1dCcsXG5cdFx0XHRcdHRoaXMuY29yZVV0aWxzLmJhc2UuZGVib3VuY2UoKGU6IEV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cdFx0XHRcdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgY3NzQ29sb3IgPSB0YXJnZXQudmFsdWUudHJpbSgpO1xuXHRcdFx0XHRcdFx0Y29uc3QgYm94RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRcdFx0XHRgY29sb3ItYm94LSR7c3dhdGNoQ291bnR9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGNvbnN0IHN0cmlwZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0XHRcdFx0YGNvbG9yLXN0cmlwZS0ke3N3YXRjaENvdW50fWBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdGlmIChib3hFbGVtZW50KVxuXHRcdFx0XHRcdFx0XHRib3hFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNzc0NvbG9yO1xuXHRcdFx0XHRcdFx0aWYgKHN0cmlwZUVsZW1lbnQpXG5cdFx0XHRcdFx0XHRcdHN0cmlwZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY3NzQ29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBjb25zdHMuZGVib3VuY2UuaW5wdXQgfHwgMjAwKVxuXHRcdFx0KTtcblxuXHRcdFx0cGFsZXR0ZUJveFRvcEhhbGYuYXBwZW5kQ2hpbGQoY29sb3JUZXh0T3V0cHV0Qm94KTtcblx0XHRcdHBhbGV0dGVCb3hUb3BIYWxmLmFwcGVuZENoaWxkKGNvcHlCdXR0b24pO1xuXG5cdFx0XHRjb25zdCBwYWxldHRlQm94Qm90dG9tSGFsZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0cGFsZXR0ZUJveEJvdHRvbUhhbGYuY2xhc3NOYW1lID1cblx0XHRcdFx0J3BhbGV0dGUtYm94LWhhbGYgcGFsZXR0ZS1ib3gtYm90dG9tLWhhbGYnO1xuXHRcdFx0cGFsZXR0ZUJveEJvdHRvbUhhbGYuaWQgPSBgcGFsZXR0ZS1ib3gtYm90dG9tLWhhbGYtJHtzd2F0Y2hDb3VudH1gO1xuXG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y29sb3JCb3guY2xhc3NOYW1lID0gJ2NvbG9yLWJveCc7XG5cdFx0XHRjb2xvckJveC5pZCA9IGBjb2xvci1ib3gtJHtzd2F0Y2hDb3VudH1gO1xuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JTdHJpbmcgfHwgJyNmZmZmZmYnO1xuXG5cdFx0XHRwYWxldHRlQm94Qm90dG9tSGFsZi5hcHBlbmRDaGlsZChjb2xvckJveCk7XG5cdFx0XHRwYWxldHRlQm94LmFwcGVuZENoaWxkKHBhbGV0dGVCb3hUb3BIYWxmKTtcblx0XHRcdHBhbGV0dGVCb3guYXBwZW5kQ2hpbGQocGFsZXR0ZUJveEJvdHRvbUhhbGYpO1xuXG5cdFx0XHRjb25zdCBjb2xvclN0cmlwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y29sb3JTdHJpcGUuY2xhc3NOYW1lID0gJ2NvbG9yLXN0cmlwZSc7XG5cdFx0XHRjb2xvclN0cmlwZS5pZCA9IGBjb2xvci1zdHJpcGUtJHtzd2F0Y2hDb3VudH1gO1xuXHRcdFx0Y29sb3JTdHJpcGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JTdHJpbmcgfHwgJyNmZmZmZmYnO1xuXG5cdFx0XHRjb2xvclN0cmlwZS5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG5cblx0XHRcdHRoaXMuZ2V0RXZlbnRMaXN0ZW5lckZuKCkuZGFkLmF0dGFjaChjb2xvclN0cmlwZSk7XG5cblx0XHRcdGNvbG9yU3RyaXBlLmFwcGVuZENoaWxkKHBhbGV0dGVCb3gpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb2xvclN0cmlwZSxcblx0XHRcdFx0c3dhdGNoQ291bnQ6IHN3YXRjaENvdW50ICsgMVxuXHRcdFx0fTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKCF0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGV4ZWN1dGUgbWFrZVBhbGV0dGVCb3g6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvbG9yU3RyaXBlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdFx0c3dhdGNoQ291bnRcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHB1bGxQYXJhbXNGcm9tVUkoKToge1xuXHRcdHR5cGU6IG51bWJlcjtcblx0XHRzd2F0Y2hlczogbnVtYmVyO1xuXHRcdGxpbWl0RGFyazogYm9vbGVhbjtcblx0XHRsaW1pdEdyYXk6IGJvb2xlYW47XG5cdFx0bGltaXRMaWdodDogYm9vbGVhbjtcblx0fSB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdwdWxsUGFyYW1zRnJvbVVJKCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVUeXBlRWxlbWVudCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLnNlbGVjdHMucGFsZXR0ZVR5cGU7XG5cdFx0XHRjb25zdCBudW1Td2F0Y2hlc0VsZW1lbnQgPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5zZWxlY3RzLnN3YXRjaEdlbjtcblx0XHRcdGNvbnN0IGxpbWl0RGFya0Noa2J4ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuaW5wdXRzLmxpbWl0RGFya0Noa2J4O1xuXHRcdFx0Y29uc3QgbGltaXRHcmF5Q2hrYnggPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5pbnB1dHMubGltaXRHcmF5Q2hrYng7XG5cdFx0XHRjb25zdCBsaW1pdExpZ2h0Q2hrYnggPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5pbnB1dHMubGltaXRMaWdodENoa2J4O1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFwYWxldHRlVHlwZUVsZW1lbnQgJiZcblx0XHRcdFx0IXRoaXMubW9kZS5xdWlldCAmJlxuXHRcdFx0XHR0aGlzLmxvZ01vZGUuZGVidWcgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+PSAyXG5cdFx0XHQpIHtcblx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0J3BhbGV0dGVUeXBlT3B0aW9ucyBET00gZWxlbWVudCBub3QgZm91bmQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0IW51bVN3YXRjaGVzRWxlbWVudCAmJlxuXHRcdFx0XHQhdGhpcy5tb2RlLnF1aWV0ICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS5kZWJ1ZyAmJlxuXHRcdFx0XHR0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID49IDJcblx0XHRcdCkge1xuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRgbnVtQm94ZXMgRE9NIGVsZW1lbnQgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoXG5cdFx0XHRcdCghbGltaXREYXJrQ2hrYnggfHwgIWxpbWl0R3JheUNoa2J4IHx8ICFsaW1pdExpZ2h0Q2hrYngpICYmXG5cdFx0XHRcdCF0aGlzLm1vZGUucXVpZXQgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLmRlYnVnICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPj0gMlxuXHRcdFx0KSB7XG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBPbmUgb3IgbW9yZSBjaGVja2JveGVzIG5vdCBmb3VuZGAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBwYWxldHRlVHlwZUVsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRzd2F0Y2hlczogbnVtU3dhdGNoZXNFbGVtZW50XG5cdFx0XHRcdFx0PyBwYXJzZUludChudW1Td2F0Y2hlc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHRcdDogMCxcblx0XHRcdFx0bGltaXREYXJrOiBsaW1pdERhcmtDaGtieD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5OiBsaW1pdEdyYXlDaGtieD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodDogbGltaXRMaWdodENoa2J4Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogMCxcblx0XHRcdFx0c3dhdGNoZXM6IDAsXG5cdFx0XHRcdGxpbWl0RGFyazogZmFsc2UsXG5cdFx0XHRcdGxpbWl0R3JheTogZmFsc2UsXG5cdFx0XHRcdGxpbWl0TGlnaHQ6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZW1vdmVQYWxldHRlRnJvbUhpc3RvcnkocGFsZXR0ZUlEOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3JlbW92ZVBhbGV0dGVGcm9tSGlzdG9yeSgpJztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBlbnRyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBwYWxldHRlXyR7cGFsZXR0ZUlEfWApO1xuXG5cdFx0XHRpZiAoIWVudHJ5KSByZXR1cm47XG5cblx0XHRcdGVudHJ5LnJlbW92ZSgpO1xuXG5cdFx0XHRjb25zdCBpZGJNYW5hZ2VyID0gYXdhaXQgSURCTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXHRcdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IHRoaXMucGFsZXR0ZUhpc3RvcnkuZmlsdGVyKFxuXHRcdFx0XHRwID0+IHAuaWQgIT09IHBhbGV0dGVJRFxuXHRcdFx0KTtcblx0XHRcdGF3YWl0IGlkYk1hbmFnZXIuc2F2ZVBhbGV0dGVIaXN0b3J5KHRoaXMucGFsZXR0ZUhpc3RvcnkpO1xuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBSZW1vdmVkIHBhbGV0dGUgJHtwYWxldHRlSUR9IGZyb20gaGlzdG9yeWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciByZW1vdmluZyBwYWxldHRlICR7cGFsZXR0ZUlEfTogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZW5kZXJQYWxldHRlKHRhYmxlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3JlbmRlclBhbGV0dGUoKSc7XG5cblx0XHRpZiAoIXRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIGZldGNoaW5nIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBzZXQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuZXJyb3JzLmhhbmRsZUFzeW5jKGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHN0b3JlZFBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldFN0b3JlZFBhbGV0dGUhKHRhYmxlSWQpO1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWxldHRlLXJvdycpO1xuXG5cdFx0XHRpZiAoIXN0b3JlZFBhbGV0dGUpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSWR9IG5vdCBmb3VuZC5gKTtcblx0XHRcdGlmICghcGFsZXR0ZVJvdykgdGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIHJvdyBlbGVtZW50IG5vdCBmb3VuZC4nKTtcblxuXHRcdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblxuXHRcdFx0Y29uc3QgdGFibGVFbGVtZW50ID0gdGhpcy5jcmVhdGVQYWxldHRlVGFibGUoc3RvcmVkUGFsZXR0ZSk7XG5cdFx0XHRwYWxldHRlUm93LmFwcGVuZENoaWxkKHRhYmxlRWxlbWVudCk7XG5cblx0XHRcdGlmICghdGhpcy5tb2RlLnF1aWV0KVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0XHRgUmVuZGVyZWQgcGFsZXR0ZSAke3RhYmxlSWR9LmAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH0sICdVSU1hbmFnZXIucmVuZGVyUGFsZXR0ZSgpOiBFcnJvciByZW5kZXJpbmcgcGFsZXR0ZScpO1xuXHR9XG5cblx0cHVibGljIHNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdzYXR1cmF0ZUNvbG9yKCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHRcdFx0Ly8gKkRFVi1OT1RFKiB1bmZpbmlzaGVkIGZ1bmN0aW9uXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzZXRDdXJyZW50UGFsZXR0ZShwYWxldHRlOiBQYWxldHRlKTogdm9pZCB7XG5cdFx0dGhpcy5jdXJyZW50UGFsZXR0ZSA9IHBhbGV0dGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0R2V0Q3VycmVudFBhbGV0dGVGbihmbjogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4pOiB2b2lkIHtcblx0XHR0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4gPSBmbjtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRTdG9yZWRQYWxldHRlKFxuXHRcdGdldHRlcjogKGlkOiBzdHJpbmcpID0+IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+XG5cdCk6IHZvaWQge1xuXHRcdHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSA9IGdldHRlcjtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzZXRIaXN0b3J5TGltaXQobGltaXQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnc2V0SGlzdG9yeUxpbWl0KCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmIChsaW1pdCA8IDEgfHwgbGltaXQgPiAxMDAwKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2Fybilcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBJbnZhbGlkIGhpc3RvcnkgbGltaXQ6ICR7bGltaXR9LiBLZWVwaW5nIGN1cnJlbnQgbGltaXQuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlkYk1hbmFnZXIgPSBhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cdFx0XHRjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGlkYk1hbmFnZXIuZ2V0U2V0dGluZ3MoKTtcblxuXHRcdFx0c2V0dGluZ3MubWF4SGlzdG9yeSA9IGxpbWl0O1xuXHRcdFx0YXdhaXQgaWRiTWFuYWdlci5zYXZlU2V0dGluZ3Moc2V0dGluZ3MpO1xuXG5cdFx0XHRpZiAodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPiBsaW1pdCkge1xuXHRcdFx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5ID0gdGhpcy5wYWxldHRlSGlzdG9yeS5zbGljZSgwLCBsaW1pdCk7XG5cdFx0XHRcdGF3YWl0IGlkYk1hbmFnZXIuc2F2ZVBhbGV0dGVIaXN0b3J5KHRoaXMucGFsZXR0ZUhpc3RvcnkpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnVwZGF0ZUhpc3RvcnlVSSgpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldClcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YEhpc3RvcnkgbGltaXQgc2V0IHRvICR7bGltaXR9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIHNldHRpbmcgaGlzdG9yeSBsaW1pdDogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdC8qIFBSSVZBVEUgTUVUSE9EUyAqL1xuXG5cdHByaXZhdGUgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0aGlzLmlkYk1hbmFnZXIgPSBhd2FpdCBJREJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cblx0XHRhd2FpdCB0aGlzLmxvYWRQYWxldHRlSGlzdG9yeSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRFdmVudExpc3RlbmVyRm4oKTogRE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlIHtcblx0XHRpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lckZuKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IGxpc3RlbmVycyBoYXZlIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldC4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5ldmVudExpc3RlbmVyRm47XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGxvYWRQYWxldHRlSGlzdG9yeSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRpZiAoIXRoaXMuaWRiTWFuYWdlcikgcmV0dXJuO1xuXG5cdFx0Y29uc3QgaGlzdG9yeSA9IGF3YWl0IHRoaXMuaWRiTWFuYWdlci5nZXRQYWxldHRlSGlzdG9yeSgpO1xuXHRcdGNvbnN0IHNldHRpbmdzID0gYXdhaXQgdGhpcy5pZGJNYW5hZ2VyLmdldFNldHRpbmdzKCk7XG5cblx0XHRjb25zdCBtYXhIaXN0b3J5ID0gc2V0dGluZ3MubWF4SGlzdG9yeSB8fCA1MDtcblxuXHRcdGlmIChoaXN0b3J5KSB7XG5cdFx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5ID0gaGlzdG9yeS5zbGljZSgwLCBtYXhIaXN0b3J5KTtcblx0XHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVIaXN0b3J5VUkoKTogdm9pZCB7XG5cdFx0Y29uc3QgaGlzdG9yeUxpc3QgPSB0aGlzLmRvbURhdGEuZWxlbWVudHMuc3RhdGljLmRpdnMucGFsZXR0ZUhpc3Rvcnk7XG5cblx0XHRpZiAoIWhpc3RvcnlMaXN0KSByZXR1cm47XG5cblx0XHRoaXN0b3J5TGlzdC5pbm5lckhUTUwgPSAnJztcblxuXHRcdHRoaXMucGFsZXR0ZUhpc3RvcnkuZm9yRWFjaChwYWxldHRlID0+IHtcblx0XHRcdGNvbnN0IGVudHJ5SUQgPSBgcGFsZXR0ZV8ke3BhbGV0dGUuaWR9YDtcblx0XHRcdGNvbnN0IGVudHJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRlbnRyeS5jbGFzc0xpc3QuYWRkKCdoaXN0b3J5LWl0ZW0nKTtcblx0XHRcdGVudHJ5LmlkID0gZW50cnlJRDtcblxuXHRcdFx0Y29uc3QgY29sb3JzID0gcGFsZXR0ZS5pdGVtc1xuXHRcdFx0XHQubWFwKFxuXHRcdFx0XHRcdGl0ZW0gPT5cblx0XHRcdFx0XHRcdC8qaHRtbCovXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCJjb2xvci1ib3hcIiBzdHlsZT1cImJhY2tncm91bmQ6ICR7aXRlbS5jb2xvcnMuY3NzLmhleH07XCI+XG5cdFx0XHRcdFx0XHQ8L3NwYW4+YFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5qb2luKCcgJyk7XG5cblx0XHRcdGNvbnN0IHJlbW92ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG5cdFx0XHRyZW1vdmVCdG4udGV4dENvbnRlbnQgPSAnUmVtb3ZlJztcblx0XHRcdHJlbW92ZUJ0bi5jbGFzc0xpc3QuYWRkKCdyZW1vdmUtaGlzdG9yeS1pdGVtJyk7XG5cdFx0XHRyZW1vdmVCdG4uZGF0YXNldC5pZCA9IGAke3BhbGV0dGUuaWR9LWhpc3RvcnktcmVtb3ZlLWJ0bmA7XG5cblx0XHRcdHJlbW92ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcblx0XHRcdFx0YXdhaXQgdGhpcy5yZW1vdmVQYWxldHRlRnJvbUhpc3RvcnkocGFsZXR0ZS5pZCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZW50cnkuaW5uZXJIVE1MID1cblx0XHRcdFx0LypodG1sKi9cblx0XHRcdFx0YFxuXHRcdFx0XHQ8cD5QYWxldHRlICMke3BhbGV0dGUubWV0YWRhdGEubmFtZSB8fCBwYWxldHRlLmlkfTwvcD5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbG9yLXByZXZpZXdcIj4ke2NvbG9yc308L2Rpdj5cblx0XHRcdFx0YDtcblxuXHRcdFx0aGlzdG9yeUxpc3QuYXBwZW5kQ2hpbGQoZW50cnkpO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=