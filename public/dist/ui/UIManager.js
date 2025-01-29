// File: src/ui/UIManager.ts
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
    addPaletteToHistory(palette) {
        this.paletteHistory.unshift(palette);
        if (this.paletteHistory.length >= 50)
            this.paletteHistory.pop();
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
            return this.utils.random.hsl(false);
        }
    }
    async applyFirstColorToUI(color) {
        const thisMethod = 'applyFirstColorToUI()';
        try {
            const colorBox1 = this.domData.elements.divs.colorBox1;
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
            return this.utils.random.hsl(false);
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
            const paletteTypeOptionsElement = domData.elements.inputs.paletteTypeOptions;
            const numBoxesElement = domData.elements.inputs.paletteNumberOptions;
            const enableAlphaCheckbox = domData.elements.inputs.enableAlphaCheckbox;
            const limitDarknessCheckbox = domData.elements.inputs.limitDarknessCheckbox;
            const limitGraynessCheckbox = domData.elements.inputs.limitGraynessCheckbox;
            const limitLightnessCheckbox = domData.elements.inputs.limitLightnessCheckbox;
            if (!paletteTypeOptionsElement &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger.warn('paletteTypeOptions DOM element not found', `${thisModule} > ${thisMethod}`);
            }
            if (!numBoxesElement &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger.warn(`numBoxes DOM element not found`, `${thisModule} > ${thisMethod}`);
            }
            if ((!enableAlphaCheckbox ||
                !limitDarknessCheckbox ||
                !limitGraynessCheckbox ||
                !limitLightnessCheckbox) &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger.warn(`One or more checkboxes not found`, `${thisModule} > ${thisMethod}`);
            }
            return {
                type: paletteTypeOptionsElement
                    ? parseInt(paletteTypeOptionsElement.value, 10)
                    : 0,
                swatches: numBoxesElement
                    ? parseInt(numBoxesElement.value, 10)
                    : 0,
                enableAlpha: enableAlphaCheckbox?.checked || false,
                limitDarkness: limitDarknessCheckbox?.checked || false,
                limitGrayness: limitGraynessCheckbox?.checked || false,
                limitLightness: limitLightnessCheckbox?.checked || false
            };
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to pull parameters from UI: ${error}`, `${thisModule} > ${thisMethod}`);
            return {
                type: 0,
                swatches: 0,
                enableAlpha: false,
                limitDarkness: false,
                limitGrayness: false,
                limitLightness: false
            };
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL1VJTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFrQjVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsSUFBSSxNQUFNLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE1BQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDO0FBRXJDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxPQUFPLFNBQVM7SUFDYixNQUFNLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtJQUN6RCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFDLENBQUMsb0JBQW9CO0lBQ3JFLEVBQUUsQ0FBUyxDQUFDLHFCQUFxQjtJQUNqQyxjQUFjLEdBQW1CLElBQUksQ0FBQztJQUN0QyxjQUFjLEdBQWMsRUFBRSxDQUFDO0lBRS9CLE1BQU0sQ0FBc0I7SUFDNUIsT0FBTyxDQUFtQjtJQUMxQixPQUFPLENBQStCO0lBQ3RDLElBQUksQ0FBb0I7SUFFeEIsZUFBZSxDQUFzQztJQUNyRCxTQUFTLENBQW1DO0lBQzVDLE9BQU8sQ0FBc0M7SUFDN0MsS0FBSyxDQUFvQztJQUV6QyxTQUFTLENBQXFDO0lBQzlDLElBQUksQ0FB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SUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7SUFDL0IsQ0FBQztJQUVNLHNCQUFzQixDQUFDLEVBQWlDO1FBQzlELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVNLG1CQUFtQixDQUN6QixNQUFxRDtRQUVyRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvdWkvVUlNYW5hZ2VyLnRzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvclNwYWNlLFxuXHRDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdENvbnN0c0RhdGFJbnRlcmZhY2UsXG5cdERPTURhdGFJbnRlcmZhY2UsXG5cdERPTUZuX01hc3RlckludGVyZmFjZSxcblx0SFNMLFxuXHRJT0ZuX01hc3RlckludGVyZmFjZSxcblx0TW9kZURhdGFJbnRlcmZhY2UsXG5cdFBhbGV0dGUsXG5cdFNMLFxuXHRTdG9yZWRQYWxldHRlLFxuXHRTVixcblx0VUlNYW5hZ2VyX0NsYXNzSW50ZXJmYWNlXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbW1vbkZuIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25zdHNEYXRhIGFzIGNvbnN0cyB9IGZyb20gJy4uL2RhdGEvY29uc3RzLmpzJztcbmltcG9ydCB7IGRvbURhdGEgfSBmcm9tICcuLi9kYXRhL2RvbS5qcyc7XG5pbXBvcnQgeyBmaWxlVXRpbHMgfSBmcm9tICcuLi9kb20vZmlsZVV0aWxzLmpzJztcbmltcG9ydCB7IGlvRm4gfSBmcm9tICcuLi9pby9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgdGhpc01vZHVsZSA9ICd1aS9VSU1hbmFnZXIudHMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZXhwb3J0IGNsYXNzIFVJTWFuYWdlciBpbXBsZW1lbnRzIFVJTWFuYWdlcl9DbGFzc0ludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlQ291bnRlciA9IDA7IC8vIHN0YXRpYyBpbnN0YW5jZSBJRCBjb3VudGVyXG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlcyA9IG5ldyBNYXA8bnVtYmVyLCBVSU1hbmFnZXI+KCk7IC8vIGluc3RhbmNlIHJlZ2lzdHJ5XG5cdHByaXZhdGUgaWQ6IG51bWJlcjsgLy8gdW5pcXVlIGluc3RhbmNlIElEXG5cdHByaXZhdGUgY3VycmVudFBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBwYWxldHRlSGlzdG9yeTogUGFsZXR0ZVtdID0gW107XG5cblx0cHJpdmF0ZSBjb25zdHM6IENvbnN0c0RhdGFJbnRlcmZhY2U7XG5cdHByaXZhdGUgZG9tRGF0YTogRE9NRGF0YUludGVyZmFjZTtcblx0cHJpdmF0ZSBsb2dNb2RlOiBNb2RlRGF0YUludGVyZmFjZVsnbG9nZ2luZyddO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhSW50ZXJmYWNlO1xuXG5cdHByaXZhdGUgY29udmVyc2lvblV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2NvbnZlcnQnXTtcblx0cHJpdmF0ZSBjb3JlVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddO1xuXHRwcml2YXRlIGhlbHBlcnM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnaGVscGVycyddO1xuXHRwcml2YXRlIHV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ107XG5cblx0cHJpdmF0ZSBmaWxlVXRpbHM6IERPTUZuX01hc3RlckludGVyZmFjZVsnZmlsZVV0aWxzJ107XG5cdHByaXZhdGUgaW9GbjogSU9Gbl9NYXN0ZXJJbnRlcmZhY2U7XG5cblx0cHJpdmF0ZSBnZXRDdXJyZW50UGFsZXR0ZUZuPzogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD47XG5cdHByaXZhdGUgZ2V0U3RvcmVkUGFsZXR0ZT86IChpZDogc3RyaW5nKSA9PiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPjtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmlkID0gVUlNYW5hZ2VyLmluc3RhbmNlQ291bnRlcisrO1xuXG5cdFx0VUlNYW5hZ2VyLmluc3RhbmNlcy5zZXQodGhpcy5pZCwgdGhpcyk7XG5cblx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5ID0gW107XG5cblx0XHR0aGlzLmNvbnN0cyA9IGNvbnN0cztcblx0XHR0aGlzLmRvbURhdGEgPSBkb21EYXRhO1xuXHRcdHRoaXMubG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblx0XHR0aGlzLm1vZGUgPSBtb2RlO1xuXG5cdFx0dGhpcy5jb3JlVXRpbHMgPSBjb21tb25Gbi5jb3JlO1xuXHRcdHRoaXMuaGVscGVycyA9IGNvbW1vbkZuLmhlbHBlcnM7XG5cdFx0dGhpcy51dGlscyA9IGNvbW1vbkZuLnV0aWxzO1xuXHRcdHRoaXMuY29udmVyc2lvblV0aWxzID0gY29tbW9uRm4uY29udmVydDtcblxuXHRcdHRoaXMuZmlsZVV0aWxzID0gZmlsZVV0aWxzO1xuXHRcdHRoaXMuaW9GbiA9IGlvRm47XG5cdH1cblxuXHQvKiBQVUJMSUMgTUVUSE9EUyAqL1xuXG5cdHB1YmxpYyBhZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGU6IFBhbGV0dGUpOiB2b2lkIHtcblx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5LnVuc2hpZnQocGFsZXR0ZSk7XG5cblx0XHRpZiAodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPj0gNTApIHRoaXMucGFsZXR0ZUhpc3RvcnkucG9wKCk7XG5cdH1cblxuXHRwdWJsaWMgYXBwbHlDdXN0b21Db2xvcigpOiBIU0wge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnYXBwbHlDdXN0b21Db2xvcigpJztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cblx0XHRcdC8vICpERVYtTk9URSogQWRkIHRoaXMgdG8gdGhlIERhdGEgb2JqZWN0XG5cdFx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIXRoaXMudXRpbHMuY29sb3IuaXNDb2xvclNwYWNlKHNlbGVjdGVkRm9ybWF0KSkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke3NlbGVjdGVkRm9ybWF0fWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHRoaXMudXRpbHMuY29sb3IucGFyc2VDb2xvcihcblx0XHRcdFx0c2VsZWN0ZWRGb3JtYXQsXG5cdFx0XHRcdHJhd1ZhbHVlXG5cdFx0XHQpIGFzIEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+O1xuXG5cdFx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHRcdGlmICghdGhpcy5tb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaHNsQ29sb3IgPSB0aGlzLnV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHRcdD8gcGFyc2VkQ29sb3Jcblx0XHRcdFx0OiB0aGlzLmNvbnZlcnNpb25VdGlscy50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRcdHJldHVybiBoc2xDb2xvcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyBhcHBseUZpcnN0Q29sb3JUb1VJKGNvbG9yOiBIU0wpOiBQcm9taXNlPEhTTD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnYXBwbHlGaXJzdENvbG9yVG9VSSgpJztcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JCb3gxID0gdGhpcy5kb21EYXRhLmVsZW1lbnRzLmRpdnMuY29sb3JCb3gxO1xuXG5cdFx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdjb2xvci1ib3gtMSBpcyBudWxsJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPVxuXHRcdFx0XHRhd2FpdCB0aGlzLmNvcmVVdGlscy5jb252ZXJ0LmNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0XHR0aGlzLnV0aWxzLnBhbGV0dGUucG9wdWxhdGVPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0cmV0dXJuIHRoaXMudXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2NvcHlUb0NsaXBib2FyZCgpJztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRcdG5hdmlnYXRvci5jbGlwYm9hcmRcblx0XHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5oZWxwZXJzLmRvbS5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQhdGhpcy5tb2RlLnF1aWV0ICYmXG5cdFx0XHRcdFx0XHR0aGlzLm1vZGUuZGVidWcgJiZcblx0XHRcdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAyICYmXG5cdFx0XHRcdFx0XHR0aGlzLmxvZ01vZGUuaW5mb1xuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0XHR0aGlzLmNvbnN0cy50aW1lb3V0cy50b29sdGlwIHx8IDEwMDBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6ICR7ZXJyfWAsXG5cdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgY3JlYXRlUGFsZXR0ZVRhYmxlKHBhbGV0dGU6IFN0b3JlZFBhbGV0dGUpOiBIVE1MRWxlbWVudCB7XG5cdFx0Y29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0Y29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuXHRcdHRhYmxlLmNsYXNzTGlzdC5hZGQoJ3BhbGV0dGUtdGFibGUnKTtcblxuXHRcdHBhbGV0dGUucGFsZXR0ZS5pdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRcdFx0Y2VsbC50ZXh0Q29udGVudCA9IGBDb2xvciAke2luZGV4ICsgMX1gO1xuXHRcdFx0Y29sb3JCb3guY2xhc3NMaXN0LmFkZCgnY29sb3ItYm94Jyk7XG5cdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpdGVtLmNvbG9ycy5jc3MuaGV4O1xuXG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY29sb3JCb3gpO1xuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdFx0dGFibGUuYXBwZW5kQ2hpbGQocm93KTtcblx0XHR9KTtcblxuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKHRhYmxlKTtcblxuXHRcdHJldHVybiBmcmFnbWVudCBhcyB1bmtub3duIGFzIEhUTUxFbGVtZW50O1xuXHR9XG5cblx0cHVibGljIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ2Rlc2F0dXJhdGVDb2xvcigpJztcblxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGVzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdHNlbGVjdGVkQ29sb3JCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdH0ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKCknO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpO1xuXG5cdFx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm4pXG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHR0aGlzLmhlbHBlcnMuZG9tLnNob3dUb2FzdCgnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLicpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogbnVsbCxcblx0XHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogbnVsbFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3Itc3RyaXBlLSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJRCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmlkO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXRBbGxJbnN0YW5jZXMoKTogVUlNYW5hZ2VyW10ge1xuXHRcdHJldHVybiBBcnJheS5mcm9tKFVJTWFuYWdlci5pbnN0YW5jZXMudmFsdWVzKCkpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1cnJlbnRQYWxldHRlKCk6IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+IHtcblx0XHRpZiAodGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuKSB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuKCk7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWxldHRlIHx8XG5cdFx0XHQodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPiAwID8gdGhpcy5wYWxldHRlSGlzdG9yeVswXSA6IG51bGwpXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2VCeUlkKGlkOiBudW1iZXIpOiBVSU1hbmFnZXIgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBVSU1hbmFnZXIuaW5zdGFuY2VzLmdldChpZCk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGRlbGV0ZUluc3RhbmNlQnlJZChpZDogbnVtYmVyKTogdm9pZCB7XG5cdFx0VUlNYW5hZ2VyLmluc3RhbmNlcy5kZWxldGUoaWQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUV4cG9ydChmb3JtYXQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnaGFuZGxlRXhwb3J0KCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlKCk7XG5cblx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0J05vIHBhbGV0dGUgYXZhaWxhYmxlIGZvciBleHBvcnQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAoZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ2Nzcyc6XG5cdFx0XHRcdFx0dGhpcy5pb0ZuLmV4cG9ydFBhbGV0dGUocGFsZXR0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnanNvbic6XG5cdFx0XHRcdFx0dGhpcy5pb0ZuLmV4cG9ydFBhbGV0dGUocGFsZXR0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAneG1sJzpcblx0XHRcdFx0XHR0aGlzLmlvRm4uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXhwb3J0IGZvcm1hdDogJHtmb3JtYXR9YCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGV4cG9ydCBwYWxldHRlOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVJbXBvcnQoXG5cdFx0ZmlsZTogRmlsZSxcblx0XHRmb3JtYXQ6ICdKU09OJyB8ICdYTUwnIHwgJ0NTUydcblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRoaXNNZXRob2QgPSAnaGFuZGxlSW1wb3J0KCknO1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZmlsZVV0aWxzLnJlYWRGaWxlKGZpbGUpO1xuXG5cdFx0XHRsZXQgcGFsZXR0ZTogUGFsZXR0ZSB8IG51bGwgPSBudWxsO1xuXG5cdFx0XHRzd2l0Y2ggKGZvcm1hdCkge1xuXHRcdFx0XHRjYXNlICdKU09OJzpcblx0XHRcdFx0XHRwYWxldHRlID0gYXdhaXQgdGhpcy5pb0ZuLmRlc2VyaWFsaXplLmZyb21KU09OKGRhdGEpO1xuXHRcdFx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvciAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdFx0J0ZhaWxlZCB0byBkZXNlcmlhbGl6ZSBKU09OIGRhdGEnLFxuXHRcdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnWE1MJzpcblx0XHRcdFx0XHRwYWxldHRlID1cblx0XHRcdFx0XHRcdChhd2FpdCB0aGlzLmlvRm4uZGVzZXJpYWxpemUuZnJvbVhNTChkYXRhKSkgfHwgbnVsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnQ1NTJzpcblx0XHRcdFx0XHRwYWxldHRlID1cblx0XHRcdFx0XHRcdChhd2FpdCB0aGlzLmlvRm4uZGVzZXJpYWxpemUuZnJvbUNTUyhkYXRhKSkgfHwgbnVsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtmb3JtYXR9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byBkZXNlcmlhbGl6ZSAke2Zvcm1hdH0gZGF0YWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYWRkUGFsZXR0ZVRvSGlzdG9yeShwYWxldHRlKTtcblxuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5pbmZvICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBTdWNjZXNzZnVsbHkgaW1wb3J0ZWQgcGFsZXR0ZSBpbiAke2Zvcm1hdH0gZm9ybWF0LmAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gaW1wb3J0IGZpbGU6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBoYW5kbGVJbXBvcnQoKWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHB1bGxQYXJhbXNGcm9tVUkoKToge1xuXHRcdHR5cGU6IG51bWJlcjtcblx0XHRzd2F0Y2hlczogbnVtYmVyO1xuXHRcdGVuYWJsZUFscGhhOiBib29sZWFuO1xuXHRcdGxpbWl0RGFya25lc3M6IGJvb2xlYW47XG5cdFx0bGltaXRHcmF5bmVzczogYm9vbGVhbjtcblx0XHRsaW1pdExpZ2h0bmVzczogYm9vbGVhbjtcblx0fSB7XG5cdFx0Y29uc3QgdGhpc01ldGhvZCA9ICdwdWxsUGFyYW1zRnJvbVVJKCknO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQgPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLmlucHV0cy5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLmlucHV0cy5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPVxuXHRcdFx0XHRkb21EYXRhLmVsZW1lbnRzLmlucHV0cy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5pbnB1dHMubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXHRcdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID1cblx0XHRcdFx0ZG9tRGF0YS5lbGVtZW50cy5pbnB1dHMubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9XG5cdFx0XHRcdGRvbURhdGEuZWxlbWVudHMuaW5wdXRzLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IXBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQgJiZcblx0XHRcdFx0IXRoaXMubW9kZS5xdWlldCAmJlxuXHRcdFx0XHR0aGlzLmxvZ01vZGUuZGVidWcgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+PSAyXG5cdFx0XHQpIHtcblx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0J3BhbGV0dGVUeXBlT3B0aW9ucyBET00gZWxlbWVudCBub3QgZm91bmQnLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0IW51bUJveGVzRWxlbWVudCAmJlxuXHRcdFx0XHQhdGhpcy5tb2RlLnF1aWV0ICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS5kZWJ1ZyAmJlxuXHRcdFx0XHR0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID49IDJcblx0XHRcdCkge1xuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRgbnVtQm94ZXMgRE9NIGVsZW1lbnQgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoXG5cdFx0XHRcdCghZW5hYmxlQWxwaGFDaGVja2JveCB8fFxuXHRcdFx0XHRcdCFsaW1pdERhcmtuZXNzQ2hlY2tib3ggfHxcblx0XHRcdFx0XHQhbGltaXRHcmF5bmVzc0NoZWNrYm94IHx8XG5cdFx0XHRcdFx0IWxpbWl0TGlnaHRuZXNzQ2hlY2tib3gpICYmXG5cdFx0XHRcdCF0aGlzLm1vZGUucXVpZXQgJiZcblx0XHRcdFx0dGhpcy5sb2dNb2RlLmRlYnVnICYmXG5cdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPj0gMlxuXHRcdFx0KSB7XG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBPbmUgb3IgbW9yZSBjaGVja2JveGVzIG5vdCBmb3VuZGAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50XG5cdFx0XHRcdFx0PyBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0XHQ6IDAsXG5cdFx0XHRcdHN3YXRjaGVzOiBudW1Cb3hlc0VsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KG51bUJveGVzRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrbmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXluZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogMCxcblx0XHRcdFx0c3dhdGNoZXM6IDAsXG5cdFx0XHRcdGVuYWJsZUFscGhhOiBmYWxzZSxcblx0XHRcdFx0bGltaXREYXJrbmVzczogZmFsc2UsXG5cdFx0XHRcdGxpbWl0R3JheW5lc3M6IGZhbHNlLFxuXHRcdFx0XHRsaW1pdExpZ2h0bmVzczogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIHJlbmRlclBhbGV0dGUodGFibGVJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgbnVsbD4ge1xuXHRcdGNvbnN0IHRoaXNNZXRob2QgPSAncmVuZGVyUGFsZXR0ZSgpJztcblxuXHRcdGlmICghdGhpcy5nZXRTdG9yZWRQYWxldHRlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgZmV0Y2hpbmcgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHNldC4nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy51dGlscy5lcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSEodGFibGVJZCk7XG5cdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0aWYgKCFwYWxldHRlUm93KSB0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgcm93IGVsZW1lbnQgbm90IGZvdW5kLicpO1xuXG5cdFx0XHRwYWxldHRlUm93LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblx0XHRcdHBhbGV0dGVSb3cuYXBwZW5kQ2hpbGQodGFibGVFbGVtZW50KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBSZW5kZXJlZCBwYWxldHRlICR7dGFibGVJZH0uYCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fSwgJ1VJTWFuYWdlci5yZW5kZXJQYWxldHRlKCk6IEVycm9yIHJlbmRlcmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHRjb25zdCB0aGlzTWV0aG9kID0gJ3NhdHVyYXRlQ29sb3IoKSc7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0XHQvLyAqREVWLU5PVEUqIHVuZmluaXNoZWQgZnVuY3Rpb25cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHNldEN1cnJlbnRQYWxldHRlKHBhbGV0dGU6IFBhbGV0dGUpOiB2b2lkIHtcblx0XHR0aGlzLmN1cnJlbnRQYWxldHRlID0gcGFsZXR0ZTtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRDdXJyZW50UGFsZXR0ZUZuKGZuOiAoKSA9PiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPik6IHZvaWQge1xuXHRcdHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbiA9IGZuO1xuXHR9XG5cblx0cHVibGljIHNldEdldFN0b3JlZFBhbGV0dGUoXG5cdFx0Z2V0dGVyOiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD5cblx0KTogdm9pZCB7XG5cdFx0dGhpcy5nZXRTdG9yZWRQYWxldHRlID0gZ2V0dGVyO1xuXHR9XG59XG4iXX0=