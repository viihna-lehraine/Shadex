// File: src/ui/UIManager.ts
import { common, core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';
import { dom } from '../dom/index.js';
import { io } from '../io/index.js';
import { logger } from '../logger/index.js';
export class UIManager {
    static instanceCounter = 0; // static instance ID counter
    static instances = new Map(); // instance registry
    id; // unique instance ID
    currentPalette = null;
    paletteHistory = [];
    logger;
    errorUtils;
    conversionUtils;
    dom;
    io = io;
    elements;
    logMode = data.mode.logging;
    mode = data.mode;
    getCurrentPaletteFn;
    getStoredPalette;
    constructor(elements) {
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.paletteHistory = [];
        this.logger = logger;
        this.errorUtils = utils.errors;
        this.conversionUtils = common.convert;
        this.elements = elements;
        this.dom = dom;
        this.io = io;
    }
    /* PUBLIC METHODS */
    addPaletteToHistory(palette) {
        this.paletteHistory.unshift(palette);
        if (this.paletteHistory.length >= 50)
            this.paletteHistory.pop();
    }
    applyCustomColor() {
        try {
            const colorPicker = document.getElementById('custom-color-picker');
            if (!colorPicker) {
                throw new Error('Color picker element not found');
            }
            const rawValue = colorPicker.value.trim();
            // *DEV-NOTE* Add this to the Data object
            const selectedFormat = document.getElementById('custom-color-format')?.value;
            if (!utils.color.isColorSpace(selectedFormat)) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Unsupported color format: ${selectedFormat}`);
            }
            const parsedColor = utils.color.parseColor(selectedFormat, rawValue);
            if (!parsedColor) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Invalid color value: ${rawValue}`);
            }
            const hslColor = utils.color.isHSLColor(parsedColor)
                ? parsedColor
                : this.conversionUtils.toHSL(parsedColor);
            return hslColor;
        }
        catch (error) {
            if (this.logMode.errors)
                this.logger.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
            return utils.random.hsl(false);
        }
    }
    applyFirstColorToUI(color) {
        try {
            const colorBox1 = this.elements.colorBox1;
            if (!colorBox1) {
                if (this.logMode.errors)
                    this.logger.error('color-box-1 is null');
                return color;
            }
            const formatColorString = core.convert.colorToCSSColorString(color);
            if (!formatColorString) {
                if (this.logMode.errors)
                    this.logger.error('Unexpected or unsupported color format.');
                return color;
            }
            colorBox1.style.backgroundColor = formatColorString;
            utils.palette.populateOutputBox(color, 1);
            return color;
        }
        catch (error) {
            if (this.logMode.errors)
                this.logger.error(`Failed to apply first color to UI: ${error}`);
            return utils.random.hsl(false);
        }
    }
    copyToClipboard(text, tooltipElement) {
        try {
            const colorValue = text.replace('Copied to clipboard!', '').trim();
            navigator.clipboard
                .writeText(colorValue)
                .then(() => {
                helpers.dom.showTooltip(tooltipElement);
                if (!this.mode.quiet &&
                    this.mode.debug &&
                    this.logMode.verbosity > 2 &&
                    this.logMode.info) {
                    this.logger.info(`Copied color value: ${colorValue}`);
                }
                setTimeout(() => tooltipElement.classList.remove('show'), data.consts.timeouts.tooltip || 1000);
            })
                .catch(err => {
                if (this.logMode.errors)
                    this.logger.error(`Error copying to clipboard: ${err}`);
            });
        }
        catch (error) {
            if (this.logMode.errors)
                this.logger.error(`Failed to copy to clipboard: ${error}`);
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
            colorBox.style.backgroundColor = item.cssStrings.hexCSSString;
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
            if (this.logMode.errors)
                this.logger.error(`Failed to desaturate color: ${error}`);
        }
    }
    getElementsForSelectedColor(selectedColor) {
        const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
        if (!selectedColorBox) {
            if (this.logMode.warnings)
                this.logger.warning(`Element not found for color ${selectedColor}`);
            helpers.dom.showToast('Please select a valid color.');
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
        try {
            const palette = await this.getCurrentPalette();
            if (!palette) {
                this.logger.error('No palette available for export');
                return;
            }
            switch (format) {
                case 'css':
                    this.io.exportPalette(palette, format);
                    break;
                case 'json':
                    this.io.exportPalette(palette, format);
                    break;
                case 'xml':
                    this.io.exportPalette(palette, format);
                    break;
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
        }
        catch (error) {
            if (this.logMode.errors && this.logMode.verbosity > 1)
                this.logger.error(`Failed to export palette: ${error}`);
        }
    }
    async handleImport(file, format) {
        try {
            const data = await this.dom.fileUtils.readFile(file);
            let palette = null;
            switch (format) {
                case 'JSON':
                    palette = await this.io.deserialize.fromJSON(data);
                    if (!palette) {
                        if (this.logMode.errors && this.logMode.verbosity > 1) {
                            this.logger.error('Failed to deserialize JSON data');
                        }
                        return;
                    }
                    break;
                case 'XML':
                    palette = (await this.io.deserialize.fromXML(data)) || null;
                    break;
                case 'CSS':
                    palette = (await this.io.deserialize.fromCSS(data)) || null;
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            if (!palette) {
                if (this.logMode.errors && this.logMode.verbosity > 1) {
                    this.logger.error(`Failed to deserialize ${format} data`);
                }
                return;
            }
            this.addPaletteToHistory(palette);
            if (this.logMode.info && this.logMode.verbosity > 1) {
                this.logger.info(`Successfully imported palette in ${format} format.`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to import file: ${error}`);
        }
    }
    pullParamsFromUI() {
        try {
            const paletteTypeOptionsElement = data.consts.dom.elements.paletteTypeOptions;
            const numBoxesElement = data.consts.dom.elements.paletteNumberOptions;
            const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
            const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
            const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
            const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
            return {
                paletteType: paletteTypeOptionsElement
                    ? parseInt(paletteTypeOptionsElement.value, 10)
                    : 0,
                numBoxes: numBoxesElement
                    ? parseInt(numBoxesElement.value, 10)
                    : 0,
                enableAlpha: enableAlphaCheckbox?.checked || false,
                limitDarkness: limitDarknessCheckbox?.checked || false,
                limitGrayness: limitGraynessCheckbox?.checked || false,
                limitLightness: limitLightnessCheckbox?.checked || false
            };
        }
        catch (error) {
            if (this.logMode.errors)
                this.logger.error(`Failed to pull parameters from UI: ${error}`);
            return {
                paletteType: 0,
                numBoxes: 0,
                enableAlpha: false,
                limitDarkness: false,
                limitGrayness: false,
                limitLightness: false
            };
        }
    }
    async renderPalette(tableId) {
        if (!this.getStoredPalette) {
            throw new Error('Palette fetching function has not been set.');
        }
        return this.errorUtils.handleAsync(async () => {
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
                logger.info(`Rendered palette ${tableId}.`);
        }, 'UIManager.renderPalette(): Error rendering palette');
    }
    saturateColor(selectedColor) {
        try {
            this.getElementsForSelectedColor(selectedColor);
            // *DEV-NOTE* unfinished function
        }
        catch (error) {
            if (this.logMode.errors)
                logger.error(`Failed to saturate color: ${error}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL1VJTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFnQjVCLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFNUMsTUFBTSxPQUFPLFNBQVM7SUFDYixNQUFNLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtJQUN6RCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFDLENBQUMsb0JBQW9CO0lBQ3JFLEVBQUUsQ0FBUyxDQUFDLHFCQUFxQjtJQUNqQyxjQUFjLEdBQW1CLElBQUksQ0FBQztJQUN0QyxjQUFjLEdBQWMsRUFBRSxDQUFDO0lBRS9CLE1BQU0sQ0FBb0I7SUFDMUIsVUFBVSxDQUE2QztJQUN2RCxlQUFlLENBQXFDO0lBQ3BELEdBQUcsQ0FBdUI7SUFDMUIsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUVSLFFBQVEsQ0FBNkM7SUFFckQsT0FBTyxHQUFxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUM5RCxJQUFJLEdBQTBCLElBQUksQ0FBQyxJQUFJLENBQUM7SUFFeEMsbUJBQW1CLENBQWlDO0lBQ3BELGdCQUFnQixDQUFpRDtJQUV6RSxZQUFZLFFBQW9EO1FBQy9ELElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3RDLFNBQVMsQ0FBQyxT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QixDQUFDO0lBRU0sc0JBQXNCLENBQUMsRUFBaUM7UUFDOUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sbUJBQW1CLENBQ3pCLE1BQXFEO1FBRXJELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7SUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy91aS9VSU1hbmFnZXIudHNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbW1vbkZuTWFzdGVySW50ZXJmYWNlLFxuXHREYXRhSW50ZXJmYWNlLFxuXHRET01Gbk1hc3RlckludGVyZmFjZSxcblx0SFNMLFxuXHRQYWxldHRlLFxuXHRTTCxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFN5bmNMb2dnZXJGYWN0b3J5LFxuXHRVSU1hbmFnZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29tbW9uLCBjb3JlLCBoZWxwZXJzLCB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkb20gfSBmcm9tICcuLi9kb20vaW5kZXguanMnO1xuaW1wb3J0IHsgaW8gfSBmcm9tICcuLi9pby9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuXG5leHBvcnQgY2xhc3MgVUlNYW5hZ2VyIGltcGxlbWVudHMgVUlNYW5hZ2VySW50ZXJmYWNlIHtcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VDb3VudGVyID0gMDsgLy8gc3RhdGljIGluc3RhbmNlIElEIGNvdW50ZXJcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VzID0gbmV3IE1hcDxudW1iZXIsIFVJTWFuYWdlcj4oKTsgLy8gaW5zdGFuY2UgcmVnaXN0cnlcblx0cHJpdmF0ZSBpZDogbnVtYmVyOyAvLyB1bmlxdWUgaW5zdGFuY2UgSURcblx0cHJpdmF0ZSBjdXJyZW50UGFsZXR0ZTogUGFsZXR0ZSB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIHBhbGV0dGVIaXN0b3J5OiBQYWxldHRlW10gPSBbXTtcblxuXHRwcml2YXRlIGxvZ2dlcjogU3luY0xvZ2dlckZhY3Rvcnk7XG5cdHByaXZhdGUgZXJyb3JVdGlsczogQ29tbW9uRm5NYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ11bJ2Vycm9ycyddO1xuXHRwcml2YXRlIGNvbnZlcnNpb25VdGlsczogQ29tbW9uRm5NYXN0ZXJJbnRlcmZhY2VbJ2NvbnZlcnQnXTtcblx0cHJpdmF0ZSBkb206IERPTUZuTWFzdGVySW50ZXJmYWNlO1xuXHRwcml2YXRlIGlvID0gaW87XG5cblx0cHJpdmF0ZSBlbGVtZW50czogRGF0YUludGVyZmFjZVsnY29uc3RzJ11bJ2RvbSddWydlbGVtZW50cyddO1xuXG5cdHByaXZhdGUgbG9nTW9kZTogRGF0YUludGVyZmFjZVsnbW9kZSddWydsb2dnaW5nJ10gPSBkYXRhLm1vZGUubG9nZ2luZztcblx0cHJpdmF0ZSBtb2RlOiBEYXRhSW50ZXJmYWNlWydtb2RlJ10gPSBkYXRhLm1vZGU7XG5cblx0cHJpdmF0ZSBnZXRDdXJyZW50UGFsZXR0ZUZuPzogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD47XG5cdHByaXZhdGUgZ2V0U3RvcmVkUGFsZXR0ZT86IChpZDogc3RyaW5nKSA9PiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPjtcblxuXHRjb25zdHJ1Y3RvcihlbGVtZW50czogRGF0YUludGVyZmFjZVsnY29uc3RzJ11bJ2RvbSddWydlbGVtZW50cyddKSB7XG5cdFx0dGhpcy5pZCA9IFVJTWFuYWdlci5pbnN0YW5jZUNvdW50ZXIrKztcblx0XHRVSU1hbmFnZXIuaW5zdGFuY2VzLnNldCh0aGlzLmlkLCB0aGlzKTtcblx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5ID0gW107XG5cdFx0dGhpcy5sb2dnZXIgPSBsb2dnZXI7XG5cdFx0dGhpcy5lcnJvclV0aWxzID0gdXRpbHMuZXJyb3JzO1xuXHRcdHRoaXMuY29udmVyc2lvblV0aWxzID0gY29tbW9uLmNvbnZlcnQ7XG5cdFx0dGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xuXHRcdHRoaXMuZG9tID0gZG9tO1xuXHRcdHRoaXMuaW8gPSBpbztcblx0fVxuXG5cdC8qIFBVQkxJQyBNRVRIT0RTICovXG5cblx0cHVibGljIGFkZFBhbGV0dGVUb0hpc3RvcnkocGFsZXR0ZTogUGFsZXR0ZSk6IHZvaWQge1xuXHRcdHRoaXMucGFsZXR0ZUhpc3RvcnkudW5zaGlmdChwYWxldHRlKTtcblxuXHRcdGlmICh0aGlzLnBhbGV0dGVIaXN0b3J5Lmxlbmd0aCA+PSA1MCkgdGhpcy5wYWxldHRlSGlzdG9yeS5wb3AoKTtcblx0fVxuXG5cdHB1YmxpYyBhcHBseUN1c3RvbUNvbG9yKCk6IEhTTCB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbG9yUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdCdjdXN0b20tY29sb3ItcGlja2VyJ1xuXHRcdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0aWYgKCFjb2xvclBpY2tlcikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIHBpY2tlciBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByYXdWYWx1ZSA9IGNvbG9yUGlja2VyLnZhbHVlLnRyaW0oKTtcblxuXHRcdFx0Ly8gKkRFVi1OT1RFKiBBZGQgdGhpcyB0byB0aGUgRGF0YSBvYmplY3Rcblx0XHRcdGNvbnN0IHNlbGVjdGVkRm9ybWF0ID0gKFxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0XHQnY3VzdG9tLWNvbG9yLWZvcm1hdCdcblx0XHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGxcblx0XHRcdCk/LnZhbHVlIGFzIENvbG9yU3BhY2U7XG5cblx0XHRcdGlmICghdXRpbHMuY29sb3IuaXNDb2xvclNwYWNlKHNlbGVjdGVkRm9ybWF0KSkge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke3NlbGVjdGVkRm9ybWF0fWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHV0aWxzLmNvbG9yLnBhcnNlQ29sb3IoXG5cdFx0XHRcdHNlbGVjdGVkRm9ybWF0LFxuXHRcdFx0XHRyYXdWYWx1ZVxuXHRcdFx0KSBhcyBFeGNsdWRlPENvbG9yLCBTTCB8IFNWPjtcblxuXHRcdFx0aWYgKCFwYXJzZWRDb2xvcikge1xuXHRcdFx0XHRpZiAoIXRoaXMubW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWU6ICR7cmF3VmFsdWV9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhzbENvbG9yID0gdXRpbHMuY29sb3IuaXNIU0xDb2xvcihwYXJzZWRDb2xvcilcblx0XHRcdFx0PyBwYXJzZWRDb2xvclxuXHRcdFx0XHQ6IHRoaXMuY29udmVyc2lvblV0aWxzLnRvSFNMKHBhcnNlZENvbG9yKTtcblxuXHRcdFx0cmV0dXJuIGhzbENvbG9yO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBhcHBseSBjdXN0b20gY29sb3I6ICR7ZXJyb3J9LiBSZXR1cm5pbmcgcmFuZG9tbHkgZ2VuZXJhdGVkIGhleCBjb2xvcmBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHV0aWxzLnJhbmRvbS5oc2woZmFsc2UpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogSFNMIHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JCb3gxID0gdGhpcy5lbGVtZW50cy5jb2xvckJveDE7XG5cblx0XHRcdGlmICghY29sb3JCb3gxKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKCdjb2xvci1ib3gtMSBpcyBudWxsJyk7XG5cblx0XHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9IGNvcmUuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J1VuZXhwZWN0ZWQgb3IgdW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0Lidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0XHR1dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCAxKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gXG5cdFx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gdXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHRcdC53cml0ZVRleHQoY29sb3JWYWx1ZSlcblx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb29sdGlwKHRvb2x0aXBFbGVtZW50KTtcblxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCF0aGlzLm1vZGUucXVpZXQgJiZcblx0XHRcdFx0XHRcdHRoaXMubW9kZS5kZWJ1ZyAmJlxuXHRcdFx0XHRcdFx0dGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDIgJiZcblx0XHRcdFx0XHRcdHRoaXMubG9nTW9kZS5pbmZvXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvKGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdFx0KCkgPT4gdG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0XHRcdFx0ZGF0YS5jb25zdHMudGltZW91dHMudG9vbHRpcCB8fCAxMDAwXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6ICR7ZXJyfWApO1xuXHRcdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQ6ICR7ZXJyb3J9YCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGNyZWF0ZVBhbGV0dGVUYWJsZShwYWxldHRlOiBTdG9yZWRQYWxldHRlKTogSFRNTEVsZW1lbnQge1xuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcblx0XHR0YWJsZS5jbGFzc0xpc3QuYWRkKCdwYWxldHRlLXRhYmxlJyk7XG5cblx0XHRwYWxldHRlLnBhbGV0dGUuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcblx0XHRcdGNvbnN0IGNvbG9yQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdGNlbGwudGV4dENvbnRlbnQgPSBgQ29sb3IgJHtpbmRleCArIDF9YDtcblx0XHRcdGNvbG9yQm94LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWJveCcpO1xuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXRlbS5jc3NTdHJpbmdzLmhleENTU1N0cmluZztcblxuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNvbG9yQm94KTtcblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKHJvdyk7XG5cdFx0fSk7XG5cblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCh0YWJsZSk7XG5cblx0XHRyZXR1cm4gZnJhZ21lbnQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudDtcblx0fVxuXG5cdHB1YmxpYyBkZXNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBkZXNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKToge1xuXHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFx0c2VsZWN0ZWRDb2xvckJveDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0fSB7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdCk7XG5cblx0XHRpZiAoIXNlbGVjdGVkQ29sb3JCb3gpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRcdHRoaXMubG9nZ2VyLndhcm5pbmcoXG5cdFx0XHRcdFx0YEVsZW1lbnQgbm90IGZvdW5kIGZvciBjb2xvciAke3NlbGVjdGVkQ29sb3J9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ1BsZWFzZSBzZWxlY3QgYSB2YWxpZCBjb2xvci4nKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IG51bGwsXG5cdFx0XHRcdHNlbGVjdGVkQ29sb3JCb3g6IG51bGwsXG5cdFx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IG51bGxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0YGNvbG9yLXRleHQtb3V0cHV0LWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdFx0KSxcblx0XHRcdHNlbGVjdGVkQ29sb3JCb3gsXG5cdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdFx0KVxuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgZ2V0SUQoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5pZDtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZ2V0QWxsSW5zdGFuY2VzKCk6IFVJTWFuYWdlcltdIHtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShVSU1hbmFnZXIuaW5zdGFuY2VzLnZhbHVlcygpKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBnZXRDdXJyZW50UGFsZXR0ZSgpOiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPiB7XG5cdFx0aWYgKHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbikge1xuXHRcdFx0cmV0dXJuIGF3YWl0IHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbigpO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdFx0dGhpcy5jdXJyZW50UGFsZXR0ZSB8fFxuXHRcdFx0KHRoaXMucGFsZXR0ZUhpc3RvcnkubGVuZ3RoID4gMCA/IHRoaXMucGFsZXR0ZUhpc3RvcnlbMF0gOiBudWxsKVxuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlQnlJZChpZDogbnVtYmVyKTogVUlNYW5hZ2VyIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gVUlNYW5hZ2VyLmluc3RhbmNlcy5nZXQoaWQpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBkZWxldGVJbnN0YW5jZUJ5SWQoaWQ6IG51bWJlcik6IHZvaWQge1xuXHRcdFVJTWFuYWdlci5pbnN0YW5jZXMuZGVsZXRlKGlkKTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVFeHBvcnQoZm9ybWF0OiAnY3NzJyB8ICdqc29uJyB8ICd4bWwnKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlKCk7XG5cblx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcignTm8gcGFsZXR0ZSBhdmFpbGFibGUgZm9yIGV4cG9ydCcpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnY3NzJzpcblx0XHRcdFx0XHR0aGlzLmlvLmV4cG9ydFBhbGV0dGUocGFsZXR0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnanNvbic6XG5cdFx0XHRcdFx0dGhpcy5pby5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3htbCc6XG5cdFx0XHRcdFx0dGhpcy5pby5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBleHBvcnQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gZXhwb3J0IHBhbGV0dGU6ICR7ZXJyb3J9YCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUltcG9ydChcblx0XHRmaWxlOiBGaWxlLFxuXHRcdGZvcm1hdDogJ0pTT04nIHwgJ1hNTCcgfCAnQ1NTJ1xuXHQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZG9tLmZpbGVVdGlscy5yZWFkRmlsZShmaWxlKTtcblxuXHRcdFx0bGV0IHBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnSlNPTic6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IGF3YWl0IHRoaXMuaW8uZGVzZXJpYWxpemUuZnJvbUpTT04oZGF0YSk7XG5cdFx0XHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycyAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0XHQnRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT04gZGF0YSdcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ1hNTCc6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IChhd2FpdCB0aGlzLmlvLmRlc2VyaWFsaXplLmZyb21YTUwoZGF0YSkpIHx8IG51bGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ0NTUyc6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IChhd2FpdCB0aGlzLmlvLmRlc2VyaWFsaXplLmZyb21DU1MoZGF0YSkpIHx8IG51bGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Zm9ybWF0fWApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXBhbGV0dGUpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGRlc2VyaWFsaXplICR7Zm9ybWF0fSBkYXRhYCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmFkZFBhbGV0dGVUb0hpc3RvcnkocGFsZXR0ZSk7XG5cblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuaW5mbyAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSkge1xuXHRcdFx0XHR0aGlzLmxvZ2dlci5pbmZvKFxuXHRcdFx0XHRcdGBTdWNjZXNzZnVsbHkgaW1wb3J0ZWQgcGFsZXR0ZSBpbiAke2Zvcm1hdH0gZm9ybWF0LmBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBpbXBvcnQgZmlsZTogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgcHVsbFBhcmFtc0Zyb21VSSgpOiB7XG5cdFx0cGFsZXR0ZVR5cGU6IG51bWJlcjtcblx0XHRudW1Cb3hlczogbnVtYmVyO1xuXHRcdGVuYWJsZUFscGhhOiBib29sZWFuO1xuXHRcdGxpbWl0RGFya25lc3M6IGJvb2xlYW47XG5cdFx0bGltaXRHcmF5bmVzczogYm9vbGVhbjtcblx0XHRsaW1pdExpZ2h0bmVzczogYm9vbGVhbjtcblx0fSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQgPVxuXHRcdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdFx0Y29uc3QgbnVtQm94ZXNFbGVtZW50ID1cblx0XHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnBhbGV0dGVOdW1iZXJPcHRpb25zO1xuXHRcdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9XG5cdFx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID1cblx0XHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRcdGNvbnN0IGxpbWl0R3JheW5lc3NDaGVja2JveCA9XG5cdFx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID1cblx0XHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHBhbGV0dGVUeXBlOiBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50XG5cdFx0XHRcdFx0PyBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0XHQ6IDAsXG5cdFx0XHRcdG51bUJveGVzOiBudW1Cb3hlc0VsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KG51bUJveGVzRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrbmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXluZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHBhbGV0dGVUeXBlOiAwLFxuXHRcdFx0XHRudW1Cb3hlczogMCxcblx0XHRcdFx0ZW5hYmxlQWxwaGE6IGZhbHNlLFxuXHRcdFx0XHRsaW1pdERhcmtuZXNzOiBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5bmVzczogZmFsc2UsXG5cdFx0XHRcdGxpbWl0TGlnaHRuZXNzOiBmYWxzZVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgcmVuZGVyUGFsZXR0ZSh0YWJsZUlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBudWxsPiB7XG5cdFx0aWYgKCF0aGlzLmdldFN0b3JlZFBhbGV0dGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSBmZXRjaGluZyBmdW5jdGlvbiBoYXMgbm90IGJlZW4gc2V0LicpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVycm9yVXRpbHMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc3RvcmVkUGFsZXR0ZSA9IGF3YWl0IHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSEodGFibGVJZCk7XG5cdFx0XHRjb25zdCBwYWxldHRlUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbGV0dGUtcm93Jyk7XG5cblx0XHRcdGlmICghc3RvcmVkUGFsZXR0ZSlcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQYWxldHRlICR7dGFibGVJZH0gbm90IGZvdW5kLmApO1xuXHRcdFx0aWYgKCFwYWxldHRlUm93KSB0aHJvdyBuZXcgRXJyb3IoJ1BhbGV0dGUgcm93IGVsZW1lbnQgbm90IGZvdW5kLicpO1xuXG5cdFx0XHRwYWxldHRlUm93LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0XHRjb25zdCB0YWJsZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVBhbGV0dGVUYWJsZShzdG9yZWRQYWxldHRlKTtcblx0XHRcdHBhbGV0dGVSb3cuYXBwZW5kQ2hpbGQodGFibGVFbGVtZW50KTtcblxuXHRcdFx0aWYgKCF0aGlzLm1vZGUucXVpZXQpIGxvZ2dlci5pbmZvKGBSZW5kZXJlZCBwYWxldHRlICR7dGFibGVJZH0uYCk7XG5cdFx0fSwgJ1VJTWFuYWdlci5yZW5kZXJQYWxldHRlKCk6IEVycm9yIHJlbmRlcmluZyBwYWxldHRlJyk7XG5cdH1cblxuXHRwdWJsaWMgc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0XHQvLyAqREVWLU5PVEUqIHVuZmluaXNoZWQgZnVuY3Rpb25cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzZXRDdXJyZW50UGFsZXR0ZShwYWxldHRlOiBQYWxldHRlKTogdm9pZCB7XG5cdFx0dGhpcy5jdXJyZW50UGFsZXR0ZSA9IHBhbGV0dGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0R2V0Q3VycmVudFBhbGV0dGVGbihmbjogKCkgPT4gUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4pOiB2b2lkIHtcblx0XHR0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4gPSBmbjtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRTdG9yZWRQYWxldHRlKFxuXHRcdGdldHRlcjogKGlkOiBzdHJpbmcpID0+IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+XG5cdCk6IHZvaWQge1xuXHRcdHRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSA9IGdldHRlcjtcblx0fVxuXG5cdC8qIFBSSVZBVEUgTUVUSE9EUyAqL1xufVxuIl19