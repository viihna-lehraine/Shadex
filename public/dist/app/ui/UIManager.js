// File: app/ui/UIManager.ts
import { IDBManager } from '../db/IDBManager.js';
import { appUtils } from '../appUtils.js';
import { commonFn } from '../../common/index.js';
import { constsData as consts } from '../../data/consts.js';
import { domData } from '../../data/dom.js';
import { download, readFile } from './dom/utils.js';
import { ioFn } from './io/index.js';
import { modeData as mode } from '../../data/mode.js';
const thisModule = 'ui/UIManager.ts';
const fileUtils = {
    download,
    readFile
};
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
    appUtils;
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
        this.appUtils = appUtils;
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
            this.appUtils.log('error', `Failed to apply custom color: ${error}. Returning randomly generated hex color`, `UIManager.applyCustomColor()`, 1);
            return this.utils.random.hsl();
        }
    }
    async applyFirstColorToUI(color) {
        try {
            const colorBox1 = this.domData.elements.dynamic.divs.colorBox1;
            if (!colorBox1) {
                this.appUtils.log('error', 'color-box-1 is null', `UIManager.applyFirstColorToUI()`);
                return color;
            }
            const formatColorString = await this.coreUtils.convert.colorToCSSColorString(color);
            if (!formatColorString) {
                this.appUtils.log('error', 'Unexpected or unsupported color format.', `UIManager.applyFirstColorToUI()`);
                return color;
            }
            colorBox1.style.backgroundColor = formatColorString;
            this.utils.palette.populateOutputBox(color, 1);
            return color;
        }
        catch (error) {
            if (this.logMode.error)
                this.appUtils.log('error', `Failed to apply first color to UI: ${error}`, `UIManager.applyFirstColorToUI()`);
            return this.utils.random.hsl();
        }
    }
    copyToClipboard(text, tooltipElement) {
        try {
            const colorValue = text.replace('Copied to clipboard!', '').trim();
            navigator.clipboard
                .writeText(colorValue)
                .then(() => {
                this.getEventListenerFn().temp.showTooltip(tooltipElement);
                this.appUtils.log('debug', `Copied color value: ${colorValue}`, `UIManager.copyToClipboard()`, 4);
                setTimeout(() => tooltipElement.classList.remove('show'), this.consts.timeouts.tooltip || 1000);
            })
                .catch(err => {
                this.appUtils.log('error', `Error copying to clipboard: ${err}`, `UIManager.copyToClipboard()`);
            });
        }
        catch (error) {
            if (this.logMode.error)
                this.appUtils.log('error', `Failed to copy to clipboard: ${error}`, `UIManager.copyToClipboard()`);
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
        try {
            this.getElementsForSelectedColor(selectedColor);
        }
        catch (error) {
            this.appUtils.log('error', `Failed to desaturate color: ${error}`, `UIManager.desaturateColor()`, 2);
        }
    }
    getElementsForSelectedColor(selectedColor) {
        const thisMethod = 'getElementsForSelectedColor()';
        const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
        if (!selectedColorBox) {
            this.appUtils.log('warn', `Element not found for color ${selectedColor}`, `${thisModule} > ${thisMethod}`, 2);
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
    getInstanceID() {
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
        try {
            const palette = await this.getCurrentPalette();
            if (!palette) {
                this.appUtils.log('error', 'No palette available for export', `UIManager.handleExport()`);
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
                this.appUtils.log('error', `Failed to export palette: ${error}`, `UIManager.handleExport()`, 1);
        }
    }
    async handleImport(file, format) {
        try {
            const data = await fileUtils.readFile(file);
            let palette = null;
            switch (format) {
                case 'JSON':
                    palette = await ioFn.deserialize.fromJSON(data);
                    if (!palette) {
                        this.appUtils.log('error', 'Failed to deserialize JSON data', `UIManager.handleImport()`, 1);
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
                this.appUtils.log('error', `Failed to deserialize ${format} data`, `UIManager.handleImport()`, 1);
                return;
            }
            this.addPaletteToHistory(palette);
            this.appUtils.log('debug', `Successfully imported palette in ${format} format.`, `UIManager.handleImport()`, 2);
        }
        catch (error) {
            this.appUtils.log('error', `Failed to import file: ${error}`, `UIManager.handleImport()`);
        }
    }
    async loadPaletteHistory() {
        const history = await this.idbManager.getPaletteHistory();
        this.updateHistoryUI(history);
    }
    async makePaletteBox(color, swatchCount) {
        try {
            if (!this.coreUtils.validate.colorValues(color)) {
                this.appUtils.log('error', `Invalid ${color.format} color value ${JSON.stringify(color)}`, `UIManager.makePaletteBox()`);
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
                    this.appUtils.log('error', `Failed to copy: ${error}`, `UIManager.makePaletteBox()`);
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
            this.appUtils.log('error', `Failed to execute makePaletteBox: ${error}`, `UIManager.makePaletteBox()`);
            return {
                colorStripe: document.createElement('div'),
                swatchCount
            };
        }
    }
    pullParamsFromUI() {
        try {
            const paletteTypeElement = domData.elements.static.selects.paletteType;
            const numSwatchesElement = domData.elements.static.selects.swatchGen;
            const limitDarkChkbx = domData.elements.static.inputs.limitDarkChkbx;
            const limitGrayChkbx = domData.elements.static.inputs.limitGrayChkbx;
            const limitLightChkbx = domData.elements.static.inputs.limitLightChkbx;
            if (!paletteTypeElement) {
                this.appUtils.log('warn', 'paletteTypeOptions DOM element not found', `UIManager.pullParamsFromUI()`, 2);
            }
            if (!numSwatchesElement) {
                this.appUtils.log('warn', `numBoxes DOM element not found`, `UIManager.pullParamsFromUI()`, 2);
            }
            if ((!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) &&
                this.logMode.verbosity >= 2) {
                this.appUtils.log('warn', `One or more checkboxes not found`, `UIManager.pullParamsFromUI()`);
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
            this.appUtils.log('error', `Failed to pull parameters from UI: ${error}`, `UIManager.pullParamsFromUI()`);
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
        if (!this.getStoredPalette) {
            throw new Error('Palette fetching function has not been set.');
        }
        return this.appUtils.handleAsync(async () => {
            const storedPalette = await this.getStoredPalette(tableId);
            const paletteRow = document.getElementById('palette-row');
            if (!storedPalette)
                throw new Error(`Palette ${tableId} not found.`);
            if (!paletteRow)
                throw new Error('Palette row element not found.');
            paletteRow.innerHTML = '';
            const tableElement = this.createPaletteTable(storedPalette);
            paletteRow.appendChild(tableElement);
            this.appUtils.log('debug', `Rendered palette ${tableId}.`, `UIManager.renderPalette()`, 2);
        }, 'Error rendering palette', 'UIManager.renderPalette()');
    }
    saturateColor(selectedColor) {
        try {
            this.getElementsForSelectedColor(selectedColor);
            // *DEV-NOTE* unfinished function
        }
        catch (error) {
            this.appUtils.log('error', `Failed to saturate color: ${error}`, `UIManager.saturateColor()`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC91aS9VSU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBb0I1QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsVUFBVSxJQUFJLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUV0RCxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQztBQUVyQyxNQUFNLFNBQVMsR0FBRztJQUNqQixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUM7QUFFRixNQUFNLE9BQU8sU0FBUztJQUNiLE1BQU0sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsNkJBQTZCO0lBQ3pELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUMsQ0FBQyxvQkFBb0I7SUFDckUsRUFBRSxDQUFTLENBQUMscUJBQXFCO0lBRWpDLGNBQWMsR0FBbUIsSUFBSSxDQUFDO0lBQ3RDLGNBQWMsR0FBYyxFQUFFLENBQUM7SUFFL0IsVUFBVSxDQUFjO0lBRXhCLE1BQU0sQ0FBc0I7SUFDNUIsT0FBTyxDQUFtQjtJQUMxQixPQUFPLENBQStCO0lBQ3RDLElBQUksQ0FBb0I7SUFFeEIsZUFBZSxDQUFz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SSxDQUFDLGNBQWMsQ0FBQztRQUNyRSxJQUFJLENBQUMsV0FBVztZQUFFLE9BQU87UUFFekIsV0FBVyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFM0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN6QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxFQUFFLEdBQUcsV0FBVyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUM7WUFFbkMsS0FBSyxDQUFDLFNBQVMsR0FBRztrQkFDSCxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsRUFBRTs7T0FFOUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyw4Q0FBOEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDOzttREFFdEUsT0FBTyxDQUFDLEVBQUU7SUFDekQsQ0FBQztZQUVGLEtBQUs7aUJBQ0gsYUFBYSxDQUFDLHNCQUFzQixDQUFDO2dCQUN0QyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtnQkFDdEMsTUFBTSxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1lBRUosV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBhcHAvdWkvVUlNYW5hZ2VyLnRzXG5cbmltcG9ydCB7XG5cdEFwcFV0aWxzSW50ZXJmYWNlLFxuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0Q29uc3RzRGF0YUludGVyZmFjZSxcblx0RE9NRGF0YUludGVyZmFjZSxcblx0RE9NRm5fRXZlbnRMaXN0ZW5lckZuSW50ZXJmYWNlLFxuXHRIU0wsXG5cdE1vZGVEYXRhSW50ZXJmYWNlLFxuXHRQYWxldHRlLFxuXHRQYWxldHRlQm94T2JqZWN0LFxuXHRTTCxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFVJTWFuYWdlcl9DbGFzc0ludGVyZmFjZVxufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBJREJNYW5hZ2VyIH0gZnJvbSAnLi4vZGIvSURCTWFuYWdlci5qcyc7XG5pbXBvcnQgeyBhcHBVdGlscyB9IGZyb20gJy4uL2FwcFV0aWxzLmpzJztcbmltcG9ydCB7IGNvbW1vbkZuIH0gZnJvbSAnLi4vLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbnN0c0RhdGEgYXMgY29uc3RzIH0gZnJvbSAnLi4vLi4vZGF0YS9jb25zdHMuanMnO1xuaW1wb3J0IHsgZG9tRGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvZG9tLmpzJztcbmltcG9ydCB7IGRvd25sb2FkLCByZWFkRmlsZSB9IGZyb20gJy4vZG9tL3V0aWxzLmpzJztcbmltcG9ydCB7IGlvRm4gfSBmcm9tICcuL2lvL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi8uLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCB0aGlzTW9kdWxlID0gJ3VpL1VJTWFuYWdlci50cyc7XG5cbmNvbnN0IGZpbGVVdGlscyA9IHtcblx0ZG93bmxvYWQsXG5cdHJlYWRGaWxlXG59O1xuXG5leHBvcnQgY2xhc3MgVUlNYW5hZ2VyIGltcGxlbWVudHMgVUlNYW5hZ2VyX0NsYXNzSW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VDb3VudGVyID0gMDsgLy8gc3RhdGljIGluc3RhbmNlIElEIGNvdW50ZXJcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VzID0gbmV3IE1hcDxudW1iZXIsIFVJTWFuYWdlcj4oKTsgLy8gaW5zdGFuY2UgcmVnaXN0cnlcblx0cHJpdmF0ZSBpZDogbnVtYmVyOyAvLyB1bmlxdWUgaW5zdGFuY2UgSURcblxuXHRwcml2YXRlIGN1cnJlbnRQYWxldHRlOiBQYWxldHRlIHwgbnVsbCA9IG51bGw7XG5cdHByaXZhdGUgcGFsZXR0ZUhpc3Rvcnk6IFBhbGV0dGVbXSA9IFtdO1xuXG5cdHByaXZhdGUgaWRiTWFuYWdlciE6IElEQk1hbmFnZXI7XG5cblx0cHJpdmF0ZSBjb25zdHM6IENvbnN0c0RhdGFJbnRlcmZhY2U7XG5cdHByaXZhdGUgZG9tRGF0YTogRE9NRGF0YUludGVyZmFjZTtcblx0cHJpdmF0ZSBsb2dNb2RlOiBNb2RlRGF0YUludGVyZmFjZVsnbG9nZ2luZyddO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhSW50ZXJmYWNlO1xuXG5cdHByaXZhdGUgY29udmVyc2lvblV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2NvbnZlcnQnXTtcblx0cHJpdmF0ZSBjb3JlVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddO1xuXHRwcml2YXRlIGFwcFV0aWxzOiBBcHBVdGlsc0ludGVyZmFjZTtcblx0cHJpdmF0ZSB1dGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd1dGlscyddO1xuXG5cdHByaXZhdGUgZ2V0Q3VycmVudFBhbGV0dGVGbj86ICgpID0+IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+O1xuXHRwcml2YXRlIGdldFN0b3JlZFBhbGV0dGU/OiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD47XG5cblx0cHJpdmF0ZSBldmVudExpc3RlbmVyRm46IERPTUZuX0V2ZW50TGlzdGVuZXJGbkludGVyZmFjZTtcblxuXHRjb25zdHJ1Y3RvcihldmVudExpc3RlbmVyRm46IERPTUZuX0V2ZW50TGlzdGVuZXJGbkludGVyZmFjZSkge1xuXHRcdHRoaXMuaW5pdCgpO1xuXG5cdFx0dGhpcy5pZCA9IFVJTWFuYWdlci5pbnN0YW5jZUNvdW50ZXIrKztcblxuXHRcdFVJTWFuYWdlci5pbnN0YW5jZXMuc2V0KHRoaXMuaWQsIHRoaXMpO1xuXG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IFtdO1xuXG5cdFx0dGhpcy5jb25zdHMgPSBjb25zdHM7XG5cdFx0dGhpcy5kb21EYXRhID0gZG9tRGF0YTtcblx0XHR0aGlzLmxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cdFx0dGhpcy5tb2RlID0gbW9kZTtcblxuXHRcdHRoaXMuY29yZVV0aWxzID0gY29tbW9uRm4uY29yZTtcblx0XHR0aGlzLmFwcFV0aWxzID0gYXBwVXRpbHM7XG5cdFx0dGhpcy51dGlscyA9IGNvbW1vbkZuLnV0aWxzO1xuXHRcdHRoaXMuY29udmVyc2lvblV0aWxzID0gY29tbW9uRm4uY29udmVydDtcblxuXHRcdHRoaXMuZXZlbnRMaXN0ZW5lckZuID0gZXZlbnRMaXN0ZW5lckZuO1xuXHR9XG5cblx0Ly8vICogKiAqICogKiAqIFBVQkxJQyBNRVRIT0RTICogKiAqICogKiAqICpcblx0Ly8gKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKlxuXG5cdHB1YmxpYyBhc3luYyBhZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGU6IFBhbGV0dGUpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmlkYk1hbmFnZXIuYWRkUGFsZXR0ZVRvSGlzdG9yeShwYWxldHRlKTtcblxuXHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKCk7XG5cdH1cblxuXHRwdWJsaWMgYXBwbHlDdXN0b21Db2xvcigpOiBIU0wge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cblx0XHRcdGNvbnN0IHNlbGVjdGVkRm9ybWF0ID0gKFxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0XHQnY3VzdG9tLWNvbG9yLWZvcm1hdCdcblx0XHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGxcblx0XHRcdCk/LnZhbHVlIGFzIENvbG9yU3BhY2U7XG5cblx0XHRcdGlmICghdGhpcy51dGlscy5jb2xvci5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7c2VsZWN0ZWRGb3JtYXR9YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHBhcnNlZENvbG9yID0gdGhpcy51dGlscy5jb2xvci5wYXJzZUNvbG9yKFxuXHRcdFx0XHRzZWxlY3RlZEZvcm1hdCxcblx0XHRcdFx0cmF3VmFsdWVcblx0XHRcdCkgYXMgRXhjbHVkZTxDb2xvciwgU0wgfCBTVj47XG5cblx0XHRcdGlmICghcGFyc2VkQ29sb3IpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoc2xDb2xvciA9IHRoaXMudXRpbHMuY29sb3IuaXNIU0xDb2xvcihwYXJzZWRDb2xvcilcblx0XHRcdFx0PyBwYXJzZWRDb2xvclxuXHRcdFx0XHQ6IHRoaXMuY29udmVyc2lvblV0aWxzLnRvSFNMKHBhcnNlZENvbG9yKTtcblxuXHRcdFx0cmV0dXJuIGhzbENvbG9yO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0J2Vycm9yJyxcblx0XHRcdFx0YEZhaWxlZCB0byBhcHBseSBjdXN0b20gY29sb3I6ICR7ZXJyb3J9LiBSZXR1cm5pbmcgcmFuZG9tbHkgZ2VuZXJhdGVkIGhleCBjb2xvcmAsXG5cdFx0XHRcdGBVSU1hbmFnZXIuYXBwbHlDdXN0b21Db2xvcigpYCxcblx0XHRcdFx0MVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbCgpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogUHJvbWlzZTxIU0w+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JCb3gxID0gdGhpcy5kb21EYXRhLmVsZW1lbnRzLmR5bmFtaWMuZGl2cy5jb2xvckJveDE7XG5cblx0XHRcdGlmICghY29sb3JCb3gxKSB7XG5cdFx0XHRcdHRoaXMuYXBwVXRpbHMubG9nKFxuXHRcdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdFx0J2NvbG9yLWJveC0xIGlzIG51bGwnLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIuYXBwbHlGaXJzdENvbG9yVG9VSSgpYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPVxuXHRcdFx0XHRhd2FpdCB0aGlzLmNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdFx0J2Vycm9yJyxcblx0XHRcdFx0XHQnVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyxcblx0XHRcdFx0XHRgVUlNYW5hZ2VyLmFwcGx5Rmlyc3RDb2xvclRvVUkoKWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbG9yQm94MS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmb3JtYXRDb2xvclN0cmluZztcblxuXHRcdFx0dGhpcy51dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCAxKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHQnZXJyb3InLFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgZmlyc3QgY29sb3IgdG8gVUk6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgVUlNYW5hZ2VyLmFwcGx5Rmlyc3RDb2xvclRvVUkoKWBcblx0XHRcdFx0KTtcblx0XHRcdHJldHVybiB0aGlzLnV0aWxzLnJhbmRvbS5oc2woKSBhcyBIU0w7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGNvcHlUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcsIHRvb2x0aXBFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRcdG5hdmlnYXRvci5jbGlwYm9hcmRcblx0XHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5nZXRFdmVudExpc3RlbmVyRm4oKS50ZW1wLnNob3dUb29sdGlwKHRvb2x0aXBFbGVtZW50KTtcblxuXHRcdFx0XHRcdHRoaXMuYXBwVXRpbHMubG9nKFxuXHRcdFx0XHRcdFx0J2RlYnVnJyxcblx0XHRcdFx0XHRcdGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gLFxuXHRcdFx0XHRcdFx0YFVJTWFuYWdlci5jb3B5VG9DbGlwYm9hcmQoKWAsXG5cdFx0XHRcdFx0XHQ0XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0XHR0aGlzLmNvbnN0cy50aW1lb3V0cy50b29sdGlwIHx8IDEwMDBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdFx0XHRgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6ICR7ZXJyfWAsXG5cdFx0XHRcdFx0XHRgVUlNYW5hZ2VyLmNvcHlUb0NsaXBib2FyZCgpYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHQnZXJyb3InLFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQ6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgVUlNYW5hZ2VyLmNvcHlUb0NsaXBib2FyZCgpYFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBjcmVhdGVQYWxldHRlVGFibGUocGFsZXR0ZTogU3RvcmVkUGFsZXR0ZSk6IEhUTUxFbGVtZW50IHtcblx0XHRjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRjb25zdCB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyk7XG5cdFx0dGFibGUuY2xhc3NMaXN0LmFkZCgncGFsZXR0ZS10YWJsZScpO1xuXG5cdFx0cGFsZXR0ZS5wYWxldHRlLml0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG5cdFx0XHRjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXHRcdFx0Y29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHRjZWxsLnRleHRDb250ZW50ID0gYENvbG9yICR7aW5kZXggKyAxfWA7XG5cdFx0XHRjb2xvckJveC5jbGFzc0xpc3QuYWRkKCdjb2xvci1ib3gnKTtcblx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGl0ZW0uY29sb3JzLmNzcy5oZXg7XG5cblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjb2xvckJveCk7XG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG5cdFx0XHR0YWJsZS5hcHBlbmRDaGlsZChyb3cpO1xuXHRcdH0pO1xuXG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGFibGUpO1xuXG5cdFx0cmV0dXJuIGZyYWdtZW50IGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnQ7XG5cdH1cblxuXHRwdWJsaWMgZGVzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdGBGYWlsZWQgdG8gZGVzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgVUlNYW5hZ2VyLmRlc2F0dXJhdGVDb2xvcigpYCxcblx0XHRcdFx0MlxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdHNlbGVjdGVkQ29sb3JCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdH0ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKCknO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpO1xuXG5cdFx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0J3dhcm4nLFxuXHRcdFx0XHRgRWxlbWVudCBub3QgZm91bmQgZm9yIGNvbG9yICR7c2VsZWN0ZWRDb2xvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gLFxuXHRcdFx0XHQyXG5cdFx0XHQpO1xuXG5cdFx0XHR0aGlzLmdldEV2ZW50TGlzdGVuZXJGbigpLnRlbXAuc2hvd1RvYXN0KFxuXHRcdFx0XHQnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLidcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBudWxsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdCksXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci1zdHJpcGUtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdClcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIGdldEluc3RhbmNlSUQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5pZDtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZ2V0QWxsSW5zdGFuY2VzKCk6IFVJTWFuYWdlcltdIHtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShVSU1hbmFnZXIuaW5zdGFuY2VzLnZhbHVlcygpKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXJyZW50UGFsZXR0ZSgpOiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPiB7XG5cdFx0aWYgKHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbikge1xuXHRcdFx0cmV0dXJuIGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbigpO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdFx0dGhpcy5jdXJyZW50UGFsZXR0ZSB8fFxuXHRcdFx0KHRoaXMucGFsZXR0ZUhpc3RvcnkubGVuZ3RoID4gMCA/IHRoaXMucGFsZXR0ZUhpc3RvcnlbMF0gOiBudWxsKVxuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlQnlJZChpZDogbnVtYmVyKTogVUlNYW5hZ2VyIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gVUlNYW5hZ2VyLmluc3RhbmNlcy5nZXQoaWQpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBkZWxldGVJbnN0YW5jZUJ5SWQoaWQ6IG51bWJlcik6IHZvaWQge1xuXHRcdFVJTWFuYWdlci5pbnN0YW5jZXMuZGVsZXRlKGlkKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVFeHBvcnQoZm9ybWF0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGUoKTtcblxuXHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdHRoaXMuYXBwVXRpbHMubG9nKFxuXHRcdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdFx0J05vIHBhbGV0dGUgYXZhaWxhYmxlIGZvciBleHBvcnQnLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIuaGFuZGxlRXhwb3J0KClgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKGZvcm1hdCkge1xuXHRcdFx0XHRjYXNlICdjc3MnOlxuXHRcdFx0XHRcdGlvRm4uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdqc29uJzpcblx0XHRcdFx0XHRpb0ZuLmV4cG9ydFBhbGV0dGUocGFsZXR0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAneG1sJzpcblx0XHRcdFx0XHRpb0ZuLmV4cG9ydFBhbGV0dGUocGFsZXR0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV4cG9ydCBmb3JtYXQ6ICR7Zm9ybWF0fWApO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAxKVxuXHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHQnZXJyb3InLFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZXhwb3J0IHBhbGV0dGU6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgVUlNYW5hZ2VyLmhhbmRsZUV4cG9ydCgpYCxcblx0XHRcdFx0XHQxXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUltcG9ydChcblx0XHRmaWxlOiBGaWxlLFxuXHRcdGZvcm1hdDogJ0pTT04nIHwgJ1hNTCcgfCAnQ1NTJ1xuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IGZpbGVVdGlscy5yZWFkRmlsZShmaWxlKTtcblxuXHRcdFx0bGV0IHBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnSlNPTic6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IGF3YWl0IGlvRm4uZGVzZXJpYWxpemUuZnJvbUpTT04oZGF0YSk7XG5cdFx0XHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHRcdFx0J2Vycm9yJyxcblx0XHRcdFx0XHRcdFx0J0ZhaWxlZCB0byBkZXNlcmlhbGl6ZSBKU09OIGRhdGEnLFxuXHRcdFx0XHRcdFx0XHRgVUlNYW5hZ2VyLmhhbmRsZUltcG9ydCgpYCxcblx0XHRcdFx0XHRcdFx0MVxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnWE1MJzpcblx0XHRcdFx0XHRwYWxldHRlID0gKGF3YWl0IGlvRm4uZGVzZXJpYWxpemUuZnJvbVhNTChkYXRhKSkgfHwgbnVsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnQ1NTJzpcblx0XHRcdFx0XHRwYWxldHRlID0gKGF3YWl0IGlvRm4uZGVzZXJpYWxpemUuZnJvbUNTUyhkYXRhKSkgfHwgbnVsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtmb3JtYXR9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHQnZXJyb3InLFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzZXJpYWxpemUgJHtmb3JtYXR9IGRhdGFgLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIuaGFuZGxlSW1wb3J0KClgLFxuXHRcdFx0XHRcdDFcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYWRkUGFsZXR0ZVRvSGlzdG9yeShwYWxldHRlKTtcblxuXHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdCdkZWJ1ZycsXG5cdFx0XHRcdGBTdWNjZXNzZnVsbHkgaW1wb3J0ZWQgcGFsZXR0ZSBpbiAke2Zvcm1hdH0gZm9ybWF0LmAsXG5cdFx0XHRcdGBVSU1hbmFnZXIuaGFuZGxlSW1wb3J0KClgLFxuXHRcdFx0XHQyXG5cdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0J2Vycm9yJyxcblx0XHRcdFx0YEZhaWxlZCB0byBpbXBvcnQgZmlsZTogJHtlcnJvcn1gLFxuXHRcdFx0XHRgVUlNYW5hZ2VyLmhhbmRsZUltcG9ydCgpYFxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgbG9hZFBhbGV0dGVIaXN0b3J5KCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IGhpc3RvcnkgPSBhd2FpdCB0aGlzLmlkYk1hbmFnZXIuZ2V0UGFsZXR0ZUhpc3RvcnkoKTtcblxuXHRcdHRoaXMudXBkYXRlSGlzdG9yeVVJKGhpc3RvcnkpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIG1ha2VQYWxldHRlQm94KFxuXHRcdGNvbG9yOiBDb2xvcixcblx0XHRzd2F0Y2hDb3VudDogbnVtYmVyXG5cdCk6IFByb21pc2U8UGFsZXR0ZUJveE9iamVjdD4ge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXRoaXMuY29yZVV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHQnZXJyb3InLFxuXHRcdFx0XHRcdGBJbnZhbGlkICR7Y29sb3IuZm9ybWF0fSBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIubWFrZVBhbGV0dGVCb3goKWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbG9yU3RyaXBlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdFx0XHRzd2F0Y2hDb3VudFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHRoaXMuY29yZVV0aWxzLmJhc2UuY2xvbmUoY29sb3IpO1xuXG5cdFx0XHRjb25zdCBwYWxldHRlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRwYWxldHRlQm94LmNsYXNzTmFtZSA9ICdwYWxldHRlLWJveCc7XG5cdFx0XHRwYWxldHRlQm94LmlkID0gYHBhbGV0dGUtYm94LSR7c3dhdGNoQ291bnR9YDtcblxuXHRcdFx0Y29uc3QgcGFsZXR0ZUJveFRvcEhhbGYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdHBhbGV0dGVCb3hUb3BIYWxmLmNsYXNzTmFtZSA9XG5cdFx0XHRcdCdwYWxldHRlLWJveC1oYWxmIHBhbGV0dGUtYm94LXRvcC1oYWxmJztcblx0XHRcdHBhbGV0dGVCb3hUb3BIYWxmLmlkID0gYHBhbGV0dGUtYm94LXRvcC1oYWxmLSR7c3dhdGNoQ291bnR9YDtcblxuXHRcdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2lucHV0J1xuXHRcdFx0KSBhcyBDb2xvcklucHV0RWxlbWVudDtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC50eXBlID0gJ3RleHQnO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmNsYXNzTmFtZSA9ICdjb2xvci10ZXh0LW91dHB1dC1ib3ggdG9vbHRpcCc7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guaWQgPSBgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c3dhdGNoQ291bnR9YDtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgJ2hleCcpO1xuXG5cdFx0XHRjb25zdCBjb2xvclN0cmluZyA9XG5cdFx0XHRcdGF3YWl0IHRoaXMuY29yZVV0aWxzLmNvbnZlcnQuY29sb3JUb0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnZhbHVlID0gY29sb3JTdHJpbmcgfHwgJyc7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3guY29sb3JWYWx1ZXMgPSBjbG9uZWRDb2xvcjtcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5yZWFkT25seSA9IGZhbHNlO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnN0eWxlLmN1cnNvciA9ICd0ZXh0Jztcblx0XHRcdGNvbG9yVGV4dE91dHB1dEJveC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG5cdFx0XHRjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHRjb3B5QnV0dG9uLmNsYXNzTmFtZSA9ICdjb3B5LWJ1dHRvbic7XG5cdFx0XHRjb3B5QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHknO1xuXG5cdFx0XHRjb25zdCB0b29sdGlwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdHRvb2x0aXBUZXh0LmNsYXNzTmFtZSA9ICd0b29sdGlwdGV4dCc7XG5cdFx0XHR0b29sdGlwVGV4dC50ZXh0Q29udGVudCA9ICdDb3BpZWQgdG8gY2xpcGJvYXJkISc7XG5cblx0XHRcdGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0YXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoXG5cdFx0XHRcdFx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWVcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0dGhpcy5nZXRFdmVudExpc3RlbmVyRm4oKS50ZW1wLnNob3dUb29sdGlwKFxuXHRcdFx0XHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNsZWFyVGltZW91dChjb25zdHMudGltZW91dHMudG9vbHRpcCB8fCAxMDAwKTtcblxuXHRcdFx0XHRcdGNvcHlCdXR0b24udGV4dENvbnRlbnQgPSAnQ29waWVkISc7XG5cdFx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHRcdCgpID0+IChjb3B5QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHknKSxcblx0XHRcdFx0XHRcdGNvbnN0cy50aW1lb3V0cy5jb3B5QnV0dG9uVGV4dCB8fCAxMDAwXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdFx0XHRgRmFpbGVkIHRvIGNvcHk6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRcdGBVSU1hbmFnZXIubWFrZVBhbGV0dGVCb3goKWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmFkZEV2ZW50TGlzdGVuZXIoXG5cdFx0XHRcdCdpbnB1dCcsXG5cdFx0XHRcdHRoaXMuY29yZVV0aWxzLmJhc2UuZGVib3VuY2UoKGU6IEV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cdFx0XHRcdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgY3NzQ29sb3IgPSB0YXJnZXQudmFsdWUudHJpbSgpO1xuXHRcdFx0XHRcdFx0Y29uc3QgYm94RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRcdFx0XHRgY29sb3ItYm94LSR7c3dhdGNoQ291bnR9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGNvbnN0IHN0cmlwZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0XHRcdFx0YGNvbG9yLXN0cmlwZS0ke3N3YXRjaENvdW50fWBcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdGlmIChib3hFbGVtZW50KVxuXHRcdFx0XHRcdFx0XHRib3hFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNzc0NvbG9yO1xuXHRcdFx0XHRcdFx0aWYgKHN0cmlwZUVsZW1lbnQpXG5cdFx0XHRcdFx0XHRcdHN0cmlwZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY3NzQ29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBjb25zdHMuZGVib3VuY2UuaW5wdXQgfHwgMjAwKVxuXHRcdFx0KTtcblxuXHRcdFx0cGFsZXR0ZUJveFRvcEhhbGYuYXBwZW5kQ2hpbGQoY29sb3JUZXh0T3V0cHV0Qm94KTtcblx0XHRcdHBhbGV0dGVCb3hUb3BIYWxmLmFwcGVuZENoaWxkKGNvcHlCdXR0b24pO1xuXG5cdFx0XHRjb25zdCBwYWxldHRlQm94Qm90dG9tSGFsZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0cGFsZXR0ZUJveEJvdHRvbUhhbGYuY2xhc3NOYW1lID1cblx0XHRcdFx0J3BhbGV0dGUtYm94LWhhbGYgcGFsZXR0ZS1ib3gtYm90dG9tLWhhbGYnO1xuXHRcdFx0cGFsZXR0ZUJveEJvdHRvbUhhbGYuaWQgPSBgcGFsZXR0ZS1ib3gtYm90dG9tLWhhbGYtJHtzd2F0Y2hDb3VudH1gO1xuXG5cdFx0XHRjb25zdCBjb2xvckJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y29sb3JCb3guY2xhc3NOYW1lID0gJ2NvbG9yLWJveCc7XG5cdFx0XHRjb2xvckJveC5pZCA9IGBjb2xvci1ib3gtJHtzd2F0Y2hDb3VudH1gO1xuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JTdHJpbmcgfHwgJyNmZmZmZmYnO1xuXG5cdFx0XHRwYWxldHRlQm94Qm90dG9tSGFsZi5hcHBlbmRDaGlsZChjb2xvckJveCk7XG5cdFx0XHRwYWxldHRlQm94LmFwcGVuZENoaWxkKHBhbGV0dGVCb3hUb3BIYWxmKTtcblx0XHRcdHBhbGV0dGVCb3guYXBwZW5kQ2hpbGQocGFsZXR0ZUJveEJvdHRvbUhhbGYpO1xuXG5cdFx0XHRjb25zdCBjb2xvclN0cmlwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y29sb3JTdHJpcGUuY2xhc3NOYW1lID0gJ2NvbG9yLXN0cmlwZSc7XG5cdFx0XHRjb2xvclN0cmlwZS5pZCA9IGBjb2xvci1zdHJpcGUtJHtzd2F0Y2hDb3VudH1gO1xuXHRcdFx0Y29sb3JTdHJpcGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JTdHJpbmcgfHwgJyNmZmZmZmYnO1xuXG5cdFx0XHRjb2xvclN0cmlwZS5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG5cblx0XHRcdHRoaXMuZ2V0RXZlbnRMaXN0ZW5lckZuKCkuZGFkLmF0dGFjaChjb2xvclN0cmlwZSk7XG5cblx0XHRcdGNvbG9yU3RyaXBlLmFwcGVuZENoaWxkKHBhbGV0dGVCb3gpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb2xvclN0cmlwZSxcblx0XHRcdFx0c3dhdGNoQ291bnQ6IHN3YXRjaENvdW50ICsgMVxuXHRcdFx0fTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdGBGYWlsZWQgdG8gZXhlY3V0ZSBtYWtlUGFsZXR0ZUJveDogJHtlcnJvcn1gLFxuXHRcdFx0XHRgVUlNYW5hZ2VyLm1ha2VQYWxldHRlQm94KClgXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb2xvclN0cmlwZTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRcdHN3YXRjaENvdW50XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBwdWxsUGFyYW1zRnJvbVVJKCk6IHtcblx0XHR0eXBlOiBudW1iZXI7XG5cdFx0c3dhdGNoZXM6IG51bWJlcjtcblx0XHRsaW1pdERhcms6IGJvb2xlYW47XG5cdFx0bGltaXRHcmF5OiBib29sZWFuO1xuXHRcdGxpbWl0TGlnaHQ6IGJvb2xlYW47XG5cdH0ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBwYWxldHRlVHlwZUVsZW1lbnQgPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLnN0YXRpYy5zZWxlY3RzLnBhbGV0dGVUeXBlO1xuXHRcdFx0Y29uc3QgbnVtU3dhdGNoZXNFbGVtZW50ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuc2VsZWN0cy5zd2F0Y2hHZW47XG5cdFx0XHRjb25zdCBsaW1pdERhcmtDaGtieCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuc3RhdGljLmlucHV0cy5saW1pdERhcmtDaGtieDtcblx0XHRcdGNvbnN0IGxpbWl0R3JheUNoa2J4ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuaW5wdXRzLmxpbWl0R3JheUNoa2J4O1xuXHRcdFx0Y29uc3QgbGltaXRMaWdodENoa2J4ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuaW5wdXRzLmxpbWl0TGlnaHRDaGtieDtcblxuXHRcdFx0aWYgKCFwYWxldHRlVHlwZUVsZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdFx0J3dhcm4nLFxuXHRcdFx0XHRcdCdwYWxldHRlVHlwZU9wdGlvbnMgRE9NIGVsZW1lbnQgbm90IGZvdW5kJyxcblx0XHRcdFx0XHRgVUlNYW5hZ2VyLnB1bGxQYXJhbXNGcm9tVUkoKWAsXG5cdFx0XHRcdFx0MlxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFudW1Td2F0Y2hlc0VsZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdFx0J3dhcm4nLFxuXHRcdFx0XHRcdGBudW1Cb3hlcyBET00gZWxlbWVudCBub3QgZm91bmRgLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIucHVsbFBhcmFtc0Zyb21VSSgpYCxcblx0XHRcdFx0XHQyXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoXG5cdFx0XHRcdCghbGltaXREYXJrQ2hrYnggfHwgIWxpbWl0R3JheUNoa2J4IHx8ICFsaW1pdExpZ2h0Q2hrYngpICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPj0gMlxuXHRcdFx0KSB7XG5cdFx0XHRcdHRoaXMuYXBwVXRpbHMubG9nKFxuXHRcdFx0XHRcdCd3YXJuJyxcblx0XHRcdFx0XHRgT25lIG9yIG1vcmUgY2hlY2tib3hlcyBub3QgZm91bmRgLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIucHVsbFBhcmFtc0Zyb21VSSgpYFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBwYWxldHRlVHlwZUVsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRzd2F0Y2hlczogbnVtU3dhdGNoZXNFbGVtZW50XG5cdFx0XHRcdFx0PyBwYXJzZUludChudW1Td2F0Y2hlc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHRcdDogMCxcblx0XHRcdFx0bGltaXREYXJrOiBsaW1pdERhcmtDaGtieD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5OiBsaW1pdEdyYXlDaGtieD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodDogbGltaXRMaWdodENoa2J4Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcFV0aWxzLmxvZyhcblx0XHRcdFx0J2Vycm9yJyxcblx0XHRcdFx0YEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gLFxuXHRcdFx0XHRgVUlNYW5hZ2VyLnB1bGxQYXJhbXNGcm9tVUkoKWBcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IDAsXG5cdFx0XHRcdHN3YXRjaGVzOiAwLFxuXHRcdFx0XHRsaW1pdERhcms6IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXk6IGZhbHNlLFxuXHRcdFx0XHRsaW1pdExpZ2h0OiBmYWxzZVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVtb3ZlUGFsZXR0ZUZyb21IaXN0b3J5KHBhbGV0dGVJRDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgaGlzdG9yeSA9IGF3YWl0IHRoaXMuaWRiTWFuYWdlci5nZXRQYWxldHRlSGlzdG9yeSgpO1xuXHRcdGNvbnN0IHVwZGF0ZWRIaXN0b3J5ID0gaGlzdG9yeS5maWx0ZXIocCA9PiBwLmlkICE9PSBwYWxldHRlSUQpO1xuXG5cdFx0YXdhaXQgdGhpcy5pZGJNYW5hZ2VyLnNhdmVQYWxldHRlSGlzdG9yeSh1cGRhdGVkSGlzdG9yeSk7XG5cdFx0dGhpcy51cGRhdGVIaXN0b3J5VUkoKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZW5kZXJQYWxldHRlKHRhYmxlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRpZiAoIXRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIGZldGNoaW5nIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBzZXQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuYXBwVXRpbHMuaGFuZGxlQXN5bmMoXG5cdFx0XHRhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlZFBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldFN0b3JlZFBhbGV0dGUhKHRhYmxlSWQpO1xuXHRcdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgUGFsZXR0ZSAke3RhYmxlSWR9IG5vdCBmb3VuZC5gKTtcblx0XHRcdFx0aWYgKCFwYWxldHRlUm93KVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSByb3cgZWxlbWVudCBub3QgZm91bmQuJyk7XG5cblx0XHRcdFx0cGFsZXR0ZVJvdy5pbm5lckhUTUwgPSAnJztcblxuXHRcdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblx0XHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZCh0YWJsZUVsZW1lbnQpO1xuXG5cdFx0XHRcdHRoaXMuYXBwVXRpbHMubG9nKFxuXHRcdFx0XHRcdCdkZWJ1ZycsXG5cdFx0XHRcdFx0YFJlbmRlcmVkIHBhbGV0dGUgJHt0YWJsZUlkfS5gLFxuXHRcdFx0XHRcdGBVSU1hbmFnZXIucmVuZGVyUGFsZXR0ZSgpYCxcblx0XHRcdFx0XHQyXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0J0Vycm9yIHJlbmRlcmluZyBwYWxldHRlJyxcblx0XHRcdCdVSU1hbmFnZXIucmVuZGVyUGFsZXR0ZSgpJ1xuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0XHQvLyAqREVWLU5PVEUqIHVuZmluaXNoZWQgZnVuY3Rpb25cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHBVdGlscy5sb2coXG5cdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdGBGYWlsZWQgdG8gc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YFVJTWFuYWdlci5zYXR1cmF0ZUNvbG9yKClgXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzZXRDdXJyZW50UGFsZXR0ZShwYWxldHRlOiBQYWxldHRlKTogdm9pZCB7XG5cdFx0dGhpcy5jdXJyZW50UGFsZXR0ZSA9IHBhbGV0dGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0R2V0Q3VycmVudFBhbGV0dGVGbihmbjogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4pOiB2b2lkIHtcblx0XHR0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4gPSBmbjtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRTdG9yZWRQYWxldHRlKFxuXHRcdGdldHRlcjogKGlkOiBzdHJpbmcpID0+IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+XG5cdCk6IHZvaWQge1xuXHRcdHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSA9IGdldHRlcjtcblx0fVxuXG5cdHB1YmxpYyBzZXRJREJNYW5hZ2VyKGlkYk1hbmFnZXI6IElEQk1hbmFnZXIpIHtcblx0XHR0aGlzLmlkYk1hbmFnZXIgPSBpZGJNYW5hZ2VyO1xuXHR9XG5cblx0Ly8vICogKiAqICogKiAqIFBSSVZBVEUgTUVUSE9EUyAqICogKiAqICogKiAqXG5cdC8vICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICogKiAqICpcblxuXHRwcml2YXRlIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dGhpcy5pZGJNYW5hZ2VyID0gYXdhaXQgSURCTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG5cdFx0YXdhaXQgdGhpcy5sb2FkUGFsZXR0ZUhpc3RvcnkoKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RXZlbnRMaXN0ZW5lckZuKCk6IERPTUZuX0V2ZW50TGlzdGVuZXJGbkludGVyZmFjZSB7XG5cdFx0aWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJGbikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFdmVudCBsaXN0ZW5lcnMgaGF2ZSBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZXZlbnRMaXN0ZW5lckZuO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVIaXN0b3J5VUkoaGlzdG9yeTogUGFsZXR0ZVtdID0gW10pOiB2b2lkIHtcblx0XHRjb25zdCBoaXN0b3J5TGlzdCA9IHRoaXMuZG9tRGF0YS5lbGVtZW50cy5zdGF0aWMuZGl2cy5wYWxldHRlSGlzdG9yeTtcblx0XHRpZiAoIWhpc3RvcnlMaXN0KSByZXR1cm47XG5cblx0XHRoaXN0b3J5TGlzdC5pbm5lckhUTUwgPSAnJztcblxuXHRcdGhpc3RvcnkuZm9yRWFjaChwYWxldHRlID0+IHtcblx0XHRcdGNvbnN0IGVudHJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRlbnRyeS5jbGFzc0xpc3QuYWRkKCdoaXN0b3J5LWl0ZW0nKTtcblx0XHRcdGVudHJ5LmlkID0gYHBhbGV0dGVfJHtwYWxldHRlLmlkfWA7XG5cblx0XHRcdGVudHJ5LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHA+UGFsZXR0ZSAjJHtwYWxldHRlLm1ldGFkYXRhLm5hbWUgfHwgcGFsZXR0ZS5pZH08L3A+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2xvci1wcmV2aWV3XCI+XG5cdFx0XHRcdFx0JHtwYWxldHRlLml0ZW1zLm1hcChpdGVtID0+IGA8c3BhbiBjbGFzcz1cImNvbG9yLWJveFwiIHN0eWxlPVwiYmFja2dyb3VuZDogJHtpdGVtLmNvbG9ycy5jc3MuaGV4fTtcIj48L3NwYW4+YCkuam9pbignICcpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInJlbW92ZS1oaXN0b3J5LWl0ZW1cIiBkYXRhLWlkPVwiJHtwYWxldHRlLmlkfS1oaXN0b3J5LXJlbW92ZS1idG5cIj5SZW1vdmU8L2J1dHRvbj5cblx0XHRcdGA7XG5cblx0XHRcdGVudHJ5XG5cdFx0XHRcdC5xdWVyeVNlbGVjdG9yKCcucmVtb3ZlLWhpc3RvcnktaXRlbScpXG5cdFx0XHRcdD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5yZW1vdmVQYWxldHRlRnJvbUhpc3RvcnkocGFsZXR0ZS5pZCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRoaXN0b3J5TGlzdC5hcHBlbmRDaGlsZChlbnRyeSk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==