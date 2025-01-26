// File: src/ui/UIManager.ts
import { common, core, helpers, utils } from '../common/index.js';
import { createLogger } from '../logger/index.js';
import { consts, mode } from '../common/data/base.js';
import { fileUtils } from '../dom/fileUtils.js';
import { io } from '../io/index.js';
const logger = await createLogger();
export class UIManager {
    static instanceCounter = 0; // static instance ID counter
    static instances = new Map(); // instance registry
    id; // unique instance ID
    currentPalette = null;
    paletteHistory = [];
    errorUtils;
    conversionUtils;
    fileUtils = fileUtils;
    io = io;
    elements;
    logMode = mode.logging;
    mode = mode;
    getCurrentPaletteFn;
    getStoredPalette;
    constructor(elements) {
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.paletteHistory = [];
        this.errorUtils = utils.errors;
        this.conversionUtils = common.convert;
        this.elements = elements;
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
            if (this.logMode.error)
                logger.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`, 'UIManager.applyCustomColor()');
            return utils.random.hsl(false);
        }
    }
    async applyFirstColorToUI(color) {
        try {
            const colorBox1 = this.elements.divs.colorBox1;
            if (!colorBox1) {
                if (this.logMode.error)
                    logger.error('color-box-1 is null', 'UIManager.applyFirstColorToUI()');
                return color;
            }
            const formatColorString = await core.convert.colorToCSSColorString(color);
            if (!formatColorString) {
                if (this.logMode.error)
                    logger.error('Unexpected or unsupported color format.', 'UIManager.applyFirstColorToUI()');
                return color;
            }
            colorBox1.style.backgroundColor = formatColorString;
            utils.palette.populateOutputBox(color, 1);
            return color;
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to apply first color to UI: ${error}`, 'UIManager.applyFirstColorToUI()');
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
                    logger.info(`Copied color value: ${colorValue}`, 'UIManager.copyToClipboard()');
                }
                setTimeout(() => tooltipElement.classList.remove('show'), consts.timeouts.tooltip || 1000);
            })
                .catch(err => {
                if (this.logMode.error)
                    logger.error(`Error copying to clipboard: ${err}`, 'UIManager.copyToClipboard()');
            });
        }
        catch (error) {
            if (this.logMode.error)
                logger.error(`Failed to copy to clipboard: ${error}`, 'UIManager.copyToClipboard()');
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
            if (this.logMode.error)
                logger.error(`Failed to desaturate color: ${error}`, 'UIManager.desaturateColor()');
        }
    }
    getElementsForSelectedColor(selectedColor) {
        const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
        if (!selectedColorBox) {
            if (this.logMode.warn)
                logger.warn(`Element not found for color ${selectedColor}`, 'UIManager.getElementsForSelectedColor()');
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
                logger.error('No palette available for export');
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
            if (this.logMode.error && this.logMode.verbosity > 1)
                logger.error(`Failed to export palette: ${error}`);
        }
    }
    async handleImport(file, format) {
        try {
            const data = await this.fileUtils.readFile(file);
            let palette = null;
            switch (format) {
                case 'JSON':
                    palette = await this.io.deserialize.fromJSON(data);
                    if (!palette) {
                        if (this.logMode.error && this.logMode.verbosity > 1) {
                            logger.error('Failed to deserialize JSON data');
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
                if (this.logMode.error && this.logMode.verbosity > 1) {
                    logger.error(`Failed to deserialize ${format} data`);
                }
                return;
            }
            this.addPaletteToHistory(palette);
            if (this.logMode.info && this.logMode.verbosity > 1) {
                logger.info(`Successfully imported palette in ${format} format.`);
            }
        }
        catch (error) {
            logger.error(`Failed to import file: ${error}`);
        }
    }
    pullParamsFromUI() {
        try {
            const paletteTypeOptionsElement = consts.dom.elements.inputs.paletteTypeOptions;
            const numBoxesElement = consts.dom.elements.inputs.paletteNumberOptions;
            const enableAlphaCheckbox = consts.dom.elements.inputs.enableAlphaCheckbox;
            const limitDarknessCheckbox = consts.dom.elements.inputs.limitDarknessCheckbox;
            const limitGraynessCheckbox = consts.dom.elements.inputs.limitGraynessCheckbox;
            const limitLightnessCheckbox = consts.dom.elements.inputs.limitLightnessCheckbox;
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
                logger.error(`Failed to pull parameters from UI: ${error}`);
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
            if (this.logMode.error)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL1VJTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFlNUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE9BQU8sU0FBUztJQUNiLE1BQU0sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsNkJBQTZCO0lBQ3pELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUMsQ0FBQyxvQkFBb0I7SUFDckUsRUFBRSxDQUFTLENBQUMscUJBQXFCO0lBQ2pDLGNBQWMsR0FBbUIsSUFBSSxDQUFDO0lBQ3RDLGNBQWMsR0FBYyxFQUFFLENBQUM7SUFFL0IsVUFBVSxDQUFvRDtJQUM5RCxlQUFlLENBQTRDO0lBQzNELFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDdEIsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUVSLFFBQVEsQ0FBeUM7SUFFakQsT0FBTyxHQUFpQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3JELElBQUksR0FBc0IsSUFBSSxDQUFDO0lBRS9CLG1CQUFtQixDQUFpQztJQUNwRCxnQkFBZ0IsQ0FBaUQ7SUFFekUsWUFBWSxRQUFnRDtRQUMzRCxJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxlQUFlLEVBQUUs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Q3pCLE1BQXFEO1FBRXJELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7SUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy91aS9VSU1hbmFnZXIudHNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZSxcblx0Q29uc3RzRGF0YUludGVyZmFjZSxcblx0SFNMLFxuXHRNb2RlRGF0YUludGVyZmFjZSxcblx0UGFsZXR0ZSxcblx0U0wsXG5cdFN0b3JlZFBhbGV0dGUsXG5cdFNWLFxuXHRVSU1hbmFnZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgY29tbW9uLCBjb3JlLCBoZWxwZXJzLCB1dGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgY29uc3RzLCBtb2RlIH0gZnJvbSAnLi4vY29tbW9uL2RhdGEvYmFzZS5qcyc7XG5pbXBvcnQgeyBmaWxlVXRpbHMgfSBmcm9tICcuLi9kb20vZmlsZVV0aWxzLmpzJztcbmltcG9ydCB7IGlvIH0gZnJvbSAnLi4vaW8vaW5kZXguanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZXhwb3J0IGNsYXNzIFVJTWFuYWdlciBpbXBsZW1lbnRzIFVJTWFuYWdlckludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlQ291bnRlciA9IDA7IC8vIHN0YXRpYyBpbnN0YW5jZSBJRCBjb3VudGVyXG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlcyA9IG5ldyBNYXA8bnVtYmVyLCBVSU1hbmFnZXI+KCk7IC8vIGluc3RhbmNlIHJlZ2lzdHJ5XG5cdHByaXZhdGUgaWQ6IG51bWJlcjsgLy8gdW5pcXVlIGluc3RhbmNlIElEXG5cdHByaXZhdGUgY3VycmVudFBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBwYWxldHRlSGlzdG9yeTogUGFsZXR0ZVtdID0gW107XG5cblx0cHJpdmF0ZSBlcnJvclV0aWxzOiBDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ11bJ2Vycm9ycyddO1xuXHRwcml2YXRlIGNvbnZlcnNpb25VdGlsczogQ29tbW9uRnVuY3Rpb25zTWFzdGVySW50ZXJmYWNlWydjb252ZXJ0J107XG5cdHByaXZhdGUgZmlsZVV0aWxzID0gZmlsZVV0aWxzO1xuXHRwcml2YXRlIGlvID0gaW87XG5cblx0cHJpdmF0ZSBlbGVtZW50czogQ29uc3RzRGF0YUludGVyZmFjZVsnZG9tJ11bJ2VsZW1lbnRzJ107XG5cblx0cHJpdmF0ZSBsb2dNb2RlOiBNb2RlRGF0YUludGVyZmFjZVsnbG9nZ2luZyddID0gbW9kZS5sb2dnaW5nO1xuXHRwcml2YXRlIG1vZGU6IE1vZGVEYXRhSW50ZXJmYWNlID0gbW9kZTtcblxuXHRwcml2YXRlIGdldEN1cnJlbnRQYWxldHRlRm4/OiAoKSA9PiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPjtcblx0cHJpdmF0ZSBnZXRTdG9yZWRQYWxldHRlPzogKGlkOiBzdHJpbmcpID0+IFByb21pc2U8U3RvcmVkUGFsZXR0ZSB8IG51bGw+O1xuXG5cdGNvbnN0cnVjdG9yKGVsZW1lbnRzOiBDb25zdHNEYXRhSW50ZXJmYWNlWydkb20nXVsnZWxlbWVudHMnXSkge1xuXHRcdHRoaXMuaWQgPSBVSU1hbmFnZXIuaW5zdGFuY2VDb3VudGVyKys7XG5cdFx0VUlNYW5hZ2VyLmluc3RhbmNlcy5zZXQodGhpcy5pZCwgdGhpcyk7XG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IFtdO1xuXHRcdHRoaXMuZXJyb3JVdGlscyA9IHV0aWxzLmVycm9ycztcblx0XHR0aGlzLmNvbnZlcnNpb25VdGlscyA9IGNvbW1vbi5jb252ZXJ0O1xuXHRcdHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcblx0XHR0aGlzLmlvID0gaW87XG5cdH1cblxuXHQvKiBQVUJMSUMgTUVUSE9EUyAqL1xuXG5cdHB1YmxpYyBhZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGU6IFBhbGV0dGUpOiB2b2lkIHtcblx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5LnVuc2hpZnQocGFsZXR0ZSk7XG5cblx0XHRpZiAodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPj0gNTApIHRoaXMucGFsZXR0ZUhpc3RvcnkucG9wKCk7XG5cdH1cblxuXHRwdWJsaWMgYXBwbHlDdXN0b21Db2xvcigpOiBIU0wge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cblx0XHRcdC8vICpERVYtTk9URSogQWRkIHRoaXMgdG8gdGhlIERhdGEgb2JqZWN0XG5cdFx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIXV0aWxzLmNvbG9yLmlzQ29sb3JTcGFjZShzZWxlY3RlZEZvcm1hdCkpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0YFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB1dGlscy5jb2xvci5wYXJzZUNvbG9yKFxuXHRcdFx0XHRzZWxlY3RlZEZvcm1hdCxcblx0XHRcdFx0cmF3VmFsdWVcblx0XHRcdCkgYXMgRXhjbHVkZTxDb2xvciwgU0wgfCBTVj47XG5cblx0XHRcdGlmICghcGFyc2VkQ29sb3IpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoc2xDb2xvciA9IHV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHRcdD8gcGFyc2VkQ29sb3Jcblx0XHRcdFx0OiB0aGlzLmNvbnZlcnNpb25VdGlscy50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRcdHJldHVybiBoc2xDb2xvcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgLFxuXHRcdFx0XHRcdCdVSU1hbmFnZXIuYXBwbHlDdXN0b21Db2xvcigpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gdXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyBhcHBseUZpcnN0Q29sb3JUb1VJKGNvbG9yOiBIU0wpOiBQcm9taXNlPEhTTD4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvckJveDEgPSB0aGlzLmVsZW1lbnRzLmRpdnMuY29sb3JCb3gxO1xuXG5cdFx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdCdjb2xvci1ib3gtMSBpcyBudWxsJyxcblx0XHRcdFx0XHRcdCdVSU1hbmFnZXIuYXBwbHlGaXJzdENvbG9yVG9VSSgpJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9XG5cdFx0XHRcdGF3YWl0IGNvcmUuY29udmVydC5jb2xvclRvQ1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdFx0J1VuZXhwZWN0ZWQgb3IgdW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0LicsXG5cdFx0XHRcdFx0XHQnVUlNYW5hZ2VyLmFwcGx5Rmlyc3RDb2xvclRvVUkoKSdcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0XHR1dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCAxKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdCdVSU1hbmFnZXIuYXBwbHlGaXJzdENvbG9yVG9VSSgpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0cmV0dXJuIHV0aWxzLnJhbmRvbS5oc2woZmFsc2UpIGFzIEhTTDtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWUgPSB0ZXh0LnJlcGxhY2UoJ0NvcGllZCB0byBjbGlwYm9hcmQhJywgJycpLnRyaW0oKTtcblxuXHRcdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQhdGhpcy5tb2RlLnF1aWV0ICYmXG5cdFx0XHRcdFx0XHR0aGlzLm1vZGUuZGVidWcgJiZcblx0XHRcdFx0XHRcdHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAyICYmXG5cdFx0XHRcdFx0XHR0aGlzLmxvZ01vZGUuaW5mb1xuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0XHRcdGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gLFxuXHRcdFx0XHRcdFx0XHQnVUlNYW5hZ2VyLmNvcHlUb0NsaXBib2FyZCgpJ1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdFx0KCkgPT4gdG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0XHRcdFx0Y29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdGBFcnJvciBjb3B5aW5nIHRvIGNsaXBib2FyZDogJHtlcnJ9YCxcblx0XHRcdFx0XHRcdFx0J1VJTWFuYWdlci5jb3B5VG9DbGlwYm9hcmQoKSdcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdCdVSU1hbmFnZXIuY29weVRvQ2xpcGJvYXJkKCknXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGNyZWF0ZVBhbGV0dGVUYWJsZShwYWxldHRlOiBTdG9yZWRQYWxldHRlKTogSFRNTEVsZW1lbnQge1xuXHRcdGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcblx0XHR0YWJsZS5jbGFzc0xpc3QuYWRkKCdwYWxldHRlLXRhYmxlJyk7XG5cblx0XHRwYWxldHRlLnBhbGV0dGUuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRcdGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cdFx0XHRjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcblx0XHRcdGNvbnN0IGNvbG9yQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdGNlbGwudGV4dENvbnRlbnQgPSBgQ29sb3IgJHtpbmRleCArIDF9YDtcblx0XHRcdGNvbG9yQm94LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWJveCcpO1xuXHRcdFx0Y29sb3JCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXRlbS5jc3NTdHJpbmdzLmhleENTU1N0cmluZztcblxuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNvbG9yQm94KTtcblx0XHRcdHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcblx0XHRcdHRhYmxlLmFwcGVuZENoaWxkKHJvdyk7XG5cdFx0fSk7XG5cblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCh0YWJsZSk7XG5cblx0XHRyZXR1cm4gZnJhZ21lbnQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudDtcblx0fVxuXG5cdHB1YmxpYyBkZXNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMuZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBkZXNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0J1VJTWFuYWdlci5kZXNhdHVyYXRlQ29sb3IoKSdcblx0XHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHRcdHNlbGVjdGVkQ29sb3JCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdH0ge1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpO1xuXG5cdFx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLndhcm4pXG5cdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWAsXG5cdFx0XHRcdFx0J1VJTWFuYWdlci5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3IoKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdQbGVhc2Ugc2VsZWN0IGEgdmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBudWxsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdCksXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci1zdHJpcGUtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdClcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIGdldElEKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuaWQ7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGdldEFsbEluc3RhbmNlcygpOiBVSU1hbmFnZXJbXSB7XG5cdFx0cmV0dXJuIEFycmF5LmZyb20oVUlNYW5hZ2VyLmluc3RhbmNlcy52YWx1ZXMoKSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgZ2V0Q3VycmVudFBhbGV0dGUoKTogUHJvbWlzZTxQYWxldHRlIHwgbnVsbD4ge1xuXHRcdGlmICh0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4pIHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlRm4oKTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRcdHRoaXMuY3VycmVudFBhbGV0dGUgfHxcblx0XHRcdCh0aGlzLnBhbGV0dGVIaXN0b3J5Lmxlbmd0aCA+IDAgPyB0aGlzLnBhbGV0dGVIaXN0b3J5WzBdIDogbnVsbClcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZUJ5SWQoaWQ6IG51bWJlcik6IFVJTWFuYWdlciB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIFVJTWFuYWdlci5pbnN0YW5jZXMuZ2V0KGlkKTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZGVsZXRlSW5zdGFuY2VCeUlkKGlkOiBudW1iZXIpOiB2b2lkIHtcblx0XHRVSU1hbmFnZXIuaW5zdGFuY2VzLmRlbGV0ZShpZCk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgaGFuZGxlRXhwb3J0KGZvcm1hdDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHBhbGV0dGUgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRQYWxldHRlKCk7XG5cblx0XHRcdGlmICghcGFsZXR0ZSkge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoJ05vIHBhbGV0dGUgYXZhaWxhYmxlIGZvciBleHBvcnQnKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAoZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ2Nzcyc6XG5cdFx0XHRcdFx0dGhpcy5pby5leHBvcnRQYWxldHRlKHBhbGV0dGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2pzb24nOlxuXHRcdFx0XHRcdHRoaXMuaW8uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd4bWwnOlxuXHRcdFx0XHRcdHRoaXMuaW8uZXhwb3J0UGFsZXR0ZShwYWxldHRlLCBmb3JtYXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZXhwb3J0IGZvcm1hdDogJHtmb3JtYXR9YCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGV4cG9ydCBwYWxldHRlOiAke2Vycm9yfWApO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVJbXBvcnQoXG5cdFx0ZmlsZTogRmlsZSxcblx0XHRmb3JtYXQ6ICdKU09OJyB8ICdYTUwnIHwgJ0NTUydcblx0KTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmZpbGVVdGlscy5yZWFkRmlsZShmaWxlKTtcblxuXHRcdFx0bGV0IHBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnSlNPTic6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IGF3YWl0IHRoaXMuaW8uZGVzZXJpYWxpemUuZnJvbUpTT04oZGF0YSk7XG5cdFx0XHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yICYmIHRoaXMubG9nTW9kZS52ZXJib3NpdHkgPiAxKSB7XG5cdFx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIGRlc2VyaWFsaXplIEpTT04gZGF0YScpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdYTUwnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSAoYXdhaXQgdGhpcy5pby5kZXNlcmlhbGl6ZS5mcm9tWE1MKGRhdGEpKSB8fCBudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdDU1MnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSAoYXdhaXQgdGhpcy5pby5kZXNlcmlhbGl6ZS5mcm9tQ1NTKGRhdGEpKSB8fCBudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFwYWxldHRlKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3IgJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBkZXNlcmlhbGl6ZSAke2Zvcm1hdH0gZGF0YWApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGUpO1xuXG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmluZm8gJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpIHtcblx0XHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFN1Y2Nlc3NmdWxseSBpbXBvcnRlZCBwYWxldHRlIGluICR7Zm9ybWF0fSBmb3JtYXQuYFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBpbXBvcnQgZmlsZTogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgcHVsbFBhcmFtc0Zyb21VSSgpOiB7XG5cdFx0dHlwZTogbnVtYmVyO1xuXHRcdHN3YXRjaGVzOiBudW1iZXI7XG5cdFx0ZW5hYmxlQWxwaGE6IGJvb2xlYW47XG5cdFx0bGltaXREYXJrbmVzczogYm9vbGVhbjtcblx0XHRsaW1pdEdyYXluZXNzOiBib29sZWFuO1xuXHRcdGxpbWl0TGlnaHRuZXNzOiBib29sZWFuO1xuXHR9IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudCA9XG5cdFx0XHRcdGNvbnN0cy5kb20uZWxlbWVudHMuaW5wdXRzLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRcdGNvbnN0IG51bUJveGVzRWxlbWVudCA9XG5cdFx0XHRcdGNvbnN0cy5kb20uZWxlbWVudHMuaW5wdXRzLnBhbGV0dGVOdW1iZXJPcHRpb25zO1xuXHRcdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9XG5cdFx0XHRcdGNvbnN0cy5kb20uZWxlbWVudHMuaW5wdXRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPVxuXHRcdFx0XHRjb25zdHMuZG9tLmVsZW1lbnRzLmlucHV0cy5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPVxuXHRcdFx0XHRjb25zdHMuZG9tLmVsZW1lbnRzLmlucHV0cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID1cblx0XHRcdFx0Y29uc3RzLmRvbS5lbGVtZW50cy5pbnB1dHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudFxuXHRcdFx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0XHRzd2F0Y2hlczogbnVtQm94ZXNFbGVtZW50XG5cdFx0XHRcdFx0PyBwYXJzZUludChudW1Cb3hlc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHRcdDogMCxcblx0XHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFya25lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodG5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZVxuXHRcdFx0fTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gcHVsbCBwYXJhbWV0ZXJzIGZyb20gVUk6ICR7ZXJyb3J9YCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IDAsXG5cdFx0XHRcdHN3YXRjaGVzOiAwLFxuXHRcdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRcdGxpbWl0RGFya25lc3M6IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXluZXNzOiBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZW5kZXJQYWxldHRlKHRhYmxlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRpZiAoIXRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIGZldGNoaW5nIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBzZXQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZWRQYWxldHRlID0gYXdhaXQgdGhpcy5nZXRTdG9yZWRQYWxldHRlISh0YWJsZUlkKTtcblx0XHRcdGNvbnN0IHBhbGV0dGVSb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFsZXR0ZS1yb3cnKTtcblxuXHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlkfSBub3QgZm91bmQuYCk7XG5cdFx0XHRpZiAoIXBhbGV0dGVSb3cpIHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSByb3cgZWxlbWVudCBub3QgZm91bmQuJyk7XG5cblx0XHRcdHBhbGV0dGVSb3cuaW5uZXJIVE1MID0gJyc7XG5cblx0XHRcdGNvbnN0IHRhYmxlRWxlbWVudCA9IHRoaXMuY3JlYXRlUGFsZXR0ZVRhYmxlKHN0b3JlZFBhbGV0dGUpO1xuXHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZCh0YWJsZUVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkgbG9nZ2VyLmluZm8oYFJlbmRlcmVkIHBhbGV0dGUgJHt0YWJsZUlkfS5gKTtcblx0XHR9LCAnVUlNYW5hZ2VyLnJlbmRlclBhbGV0dGUoKTogRXJyb3IgcmVuZGVyaW5nIHBhbGV0dGUnKTtcblx0fVxuXG5cdHB1YmxpYyBzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHRcdC8vICpERVYtTk9URSogdW5maW5pc2hlZCBmdW5jdGlvblxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgc2V0Q3VycmVudFBhbGV0dGUocGFsZXR0ZTogUGFsZXR0ZSk6IHZvaWQge1xuXHRcdHRoaXMuY3VycmVudFBhbGV0dGUgPSBwYWxldHRlO1xuXHR9XG5cblx0cHVibGljIHNldEdldEN1cnJlbnRQYWxldHRlRm4oZm46ICgpID0+IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+KTogdm9pZCB7XG5cdFx0dGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuID0gZm47XG5cdH1cblxuXHRwdWJsaWMgc2V0R2V0U3RvcmVkUGFsZXR0ZShcblx0XHRnZXR0ZXI6IChpZDogc3RyaW5nKSA9PiBQcm9taXNlPFN0b3JlZFBhbGV0dGUgfCBudWxsPlxuXHQpOiB2b2lkIHtcblx0XHR0aGlzLmdldFN0b3JlZFBhbGV0dGUgPSBnZXR0ZXI7XG5cdH1cblxuXHQvKiBQUklWQVRFIE1FVEhPRFMgKi9cbn1cbiJdfQ==