// File: src/classes/ui/UIManager.ts
import { common, core, helpers, utils } from '../../common/index.js';
import { data } from '../../data/index.js';
import { dom } from '../../dom/index.js';
import { io as paletteIO } from '../../palette/io/index.js';
import { log } from '../logger/index.js';
import { ui } from '../../ui/index.js';
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
    paletteIO;
    ui;
    elements;
    logMode = data.mode.logging;
    mode = data.mode;
    getCurrentPaletteFn;
    getStoredPalette;
    constructor(elements) {
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.paletteHistory = [];
        this.logger = log;
        this.errorUtils = utils.errors;
        this.conversionUtils = common.convert;
        this.elements = elements;
        this.dom = dom;
        this.paletteIO = paletteIO;
        this.ui = ui;
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
            const formatColorString = core.convert.toCSSColorString(color);
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
    async handleExport(format, colorSpace = 'hsl') {
        try {
            const palette = await this.getCurrentPalette();
            if (!palette) {
                this.logger.error('No palette available for export');
                return;
            }
            switch (format) {
                case 'CSS':
                    this.ui.io.exportPalette.asCSS(palette, colorSpace);
                    break;
                case 'JSON':
                    this.ui.io.exportPalette.asJSON(palette);
                    break;
                case 'XML':
                    this.ui.io.exportPalette.asXML(palette);
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
            let palette;
            switch (format) {
                case 'JSON':
                    palette = this.paletteIO.deserialize.fromJSON(data);
                    break;
                case 'XML':
                    palette = this.paletteIO.deserialize.fromXML(data);
                    break;
                case 'CSS':
                    palette = this.paletteIO.deserialize.fromCSS(data);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            this.addPaletteToHistory(palette);
            if (this.logMode.info && this.logMode.verbosity > 1)
                this.logger.info(`Successfully imported palette in ${format} format.`);
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
                log.info(`Rendered palette ${tableId}.`);
        }, 'UIManager.renderPalette(): Error rendering palette');
    }
    saturateColor(selectedColor) {
        try {
            this.getElementsForSelectedColor(selectedColor);
            // *DEV-NOTE* unfinished function
        }
        catch (error) {
            if (this.logMode.errors)
                log.error(`Failed to saturate color: ${error}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NsYXNzZXMvdWkvVUlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQWtCcEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDekMsT0FBTyxFQUFFLEVBQUUsSUFBSSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDekMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXZDLE1BQU0sT0FBTyxTQUFTO0lBQ2IsTUFBTSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7SUFDekQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQyxDQUFDLG9CQUFvQjtJQUNyRSxFQUFFLENBQVMsQ0FBQyxxQkFBcUI7SUFDakMsY0FBYyxHQUFtQixJQUFJLENBQUM7SUFDdEMsY0FBYyxHQUFjLEVBQUUsQ0FBQztJQUUvQixNQUFNLENBQW9CO0lBQzFCLFVBQVUsQ0FBNkM7SUFDdkQsZUFBZSxDQUFxQztJQUNwRCxHQUFHLENBQXVCO0lBQzFCLFNBQVMsQ0FBdUI7SUFDaEMsRUFBRSxDQUFzQjtJQUV4QixRQUFRLENBQTZDO0lBRXJELE9BQU8sR0FBcUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDOUQsSUFBSSxHQUEwQixJQUFJLENBQUMsSUFBSSxDQUFDO0lBRXhDLG1CQUFtQixDQUFpQztJQUNwRCxnQkFBZ0IsQ0FBaUQ7SUFFekUsWUFBWSxR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QUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFFMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVELFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsRUFBRSxvREFBb0QsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxhQUFhLENBQUMsYUFBcUI7UUFDekMsSUFBSSxDQUFDO1lBQ0osSUFBSSxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hELGlDQUFpQztRQUNsQyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDdEIsR0FBRyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0YsQ0FBQztJQUVNLGlCQUFpQixDQUFDLE9BQWdCO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO0lBQy9CLENBQUM7SUFFTSxzQkFBc0IsQ0FBQyxFQUFpQztRQUM5RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxtQkFBbUIsQ0FDekIsTUFBcUQ7UUFFckQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NsYXNzZXMvdWkvVUlNYW5hZ2VyLnRzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvclNwYWNlLFxuXHRDb21tb25Gbk1hc3RlckludGVyZmFjZSxcblx0RGF0YUludGVyZmFjZSxcblx0RE9NRm5NYXN0ZXJJbnRlcmZhY2UsXG5cdEhTTCxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUZuSU9JbnRlcmZhY2UsXG5cdFNMLFxuXHRTdG9yZWRQYWxldHRlLFxuXHRTVixcblx0U3luY0xvZ2dlckZhY3RvcnksXG5cdFVJRm5NYXN0ZXJJbnRlcmZhY2UsXG5cdFVJTWFuYWdlckludGVyZmFjZVxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb21tb24sIGNvcmUsIGhlbHBlcnMsIHV0aWxzIH0gZnJvbSAnLi4vLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbSB9IGZyb20gJy4uLy4uL2RvbS9pbmRleC5qcyc7XG5pbXBvcnQgeyBpbyBhcyBwYWxldHRlSU8gfSBmcm9tICcuLi8uLi9wYWxldHRlL2lvL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyB1aSB9IGZyb20gJy4uLy4uL3VpL2luZGV4LmpzJztcblxuZXhwb3J0IGNsYXNzIFVJTWFuYWdlciBpbXBsZW1lbnRzIFVJTWFuYWdlckludGVyZmFjZSB7XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlQ291bnRlciA9IDA7IC8vIHN0YXRpYyBpbnN0YW5jZSBJRCBjb3VudGVyXG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlcyA9IG5ldyBNYXA8bnVtYmVyLCBVSU1hbmFnZXI+KCk7IC8vIGluc3RhbmNlIHJlZ2lzdHJ5XG5cdHByaXZhdGUgaWQ6IG51bWJlcjsgLy8gdW5pcXVlIGluc3RhbmNlIElEXG5cdHByaXZhdGUgY3VycmVudFBhbGV0dGU6IFBhbGV0dGUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBwYWxldHRlSGlzdG9yeTogUGFsZXR0ZVtdID0gW107XG5cblx0cHJpdmF0ZSBsb2dnZXI6IFN5bmNMb2dnZXJGYWN0b3J5O1xuXHRwcml2YXRlIGVycm9yVXRpbHM6IENvbW1vbkZuTWFzdGVySW50ZXJmYWNlWyd1dGlscyddWydlcnJvcnMnXTtcblx0cHJpdmF0ZSBjb252ZXJzaW9uVXRpbHM6IENvbW1vbkZuTWFzdGVySW50ZXJmYWNlWydjb252ZXJ0J107XG5cdHByaXZhdGUgZG9tOiBET01Gbk1hc3RlckludGVyZmFjZTtcblx0cHJpdmF0ZSBwYWxldHRlSU86IFBhbGV0dGVGbklPSW50ZXJmYWNlO1xuXHRwcml2YXRlIHVpOiBVSUZuTWFzdGVySW50ZXJmYWNlO1xuXG5cdHByaXZhdGUgZWxlbWVudHM6IERhdGFJbnRlcmZhY2VbJ2NvbnN0cyddWydkb20nXVsnZWxlbWVudHMnXTtcblxuXHRwcml2YXRlIGxvZ01vZGU6IERhdGFJbnRlcmZhY2VbJ21vZGUnXVsnbG9nZ2luZyddID0gZGF0YS5tb2RlLmxvZ2dpbmc7XG5cdHByaXZhdGUgbW9kZTogRGF0YUludGVyZmFjZVsnbW9kZSddID0gZGF0YS5tb2RlO1xuXG5cdHByaXZhdGUgZ2V0Q3VycmVudFBhbGV0dGVGbj86ICgpID0+IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+O1xuXHRwcml2YXRlIGdldFN0b3JlZFBhbGV0dGU/OiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD47XG5cblx0Y29uc3RydWN0b3IoZWxlbWVudHM6IERhdGFJbnRlcmZhY2VbJ2NvbnN0cyddWydkb20nXVsnZWxlbWVudHMnXSkge1xuXHRcdHRoaXMuaWQgPSBVSU1hbmFnZXIuaW5zdGFuY2VDb3VudGVyKys7XG5cdFx0VUlNYW5hZ2VyLmluc3RhbmNlcy5zZXQodGhpcy5pZCwgdGhpcyk7XG5cdFx0dGhpcy5wYWxldHRlSGlzdG9yeSA9IFtdO1xuXHRcdHRoaXMubG9nZ2VyID0gbG9nO1xuXHRcdHRoaXMuZXJyb3JVdGlscyA9IHV0aWxzLmVycm9ycztcblx0XHR0aGlzLmNvbnZlcnNpb25VdGlscyA9IGNvbW1vbi5jb252ZXJ0O1xuXHRcdHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcblx0XHR0aGlzLmRvbSA9IGRvbTtcblx0XHR0aGlzLnBhbGV0dGVJTyA9IHBhbGV0dGVJTztcblx0XHR0aGlzLnVpID0gdWk7XG5cdH1cblxuXHQvKiBQVUJMSUMgTUVUSE9EUyAqL1xuXG5cdHB1YmxpYyBhZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGU6IFBhbGV0dGUpOiB2b2lkIHtcblx0XHR0aGlzLnBhbGV0dGVIaXN0b3J5LnVuc2hpZnQocGFsZXR0ZSk7XG5cblx0XHRpZiAodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPj0gNTApIHRoaXMucGFsZXR0ZUhpc3RvcnkucG9wKCk7XG5cdH1cblxuXHRwdWJsaWMgYXBwbHlDdXN0b21Db2xvcigpOiBIU0wge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cblx0XHRcdC8vICpERVYtTk9URSogQWRkIHRoaXMgdG8gdGhlIERhdGEgb2JqZWN0XG5cdFx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIXV0aWxzLmNvbG9yLmlzQ29sb3JTcGFjZShzZWxlY3RlZEZvcm1hdCkpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0YFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB1dGlscy5jb2xvci5wYXJzZUNvbG9yKFxuXHRcdFx0XHRzZWxlY3RlZEZvcm1hdCxcblx0XHRcdFx0cmF3VmFsdWVcblx0XHRcdCkgYXMgRXhjbHVkZTxDb2xvciwgU0wgfCBTVj47XG5cblx0XHRcdGlmICghcGFyc2VkQ29sb3IpIHtcblx0XHRcdFx0aWYgKCF0aGlzLm1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoc2xDb2xvciA9IHV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHRcdD8gcGFyc2VkQ29sb3Jcblx0XHRcdFx0OiB0aGlzLmNvbnZlcnNpb25VdGlscy50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRcdHJldHVybiBoc2xDb2xvcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGFwcGx5Rmlyc3RDb2xvclRvVUkoY29sb3I6IEhTTCk6IEhTTCB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbG9yQm94MSA9IHRoaXMuZWxlbWVudHMuY29sb3JCb3gxO1xuXG5cdFx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcignY29sb3ItYm94LTEgaXMgbnVsbCcpO1xuXG5cdFx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPSBjb3JlLmNvbnZlcnQudG9DU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdFx0aWYgKHRoaXMubG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHQnVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2xvckJveDEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZm9ybWF0Q29sb3JTdHJpbmc7XG5cblx0XHRcdHV0aWxzLnBhbGV0dGUucG9wdWxhdGVPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWBcblx0XHRcdFx0KTtcblx0XHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGNvcHlUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcsIHRvb2x0aXBFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRcdG5hdmlnYXRvci5jbGlwYm9hcmRcblx0XHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0aGVscGVycy5kb20uc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQpO1xuXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0IXRoaXMubW9kZS5xdWlldCAmJlxuXHRcdFx0XHRcdFx0dGhpcy5tb2RlLmRlYnVnICYmXG5cdFx0XHRcdFx0XHR0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMiAmJlxuXHRcdFx0XHRcdFx0dGhpcy5sb2dNb2RlLmluZm9cblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oYENvcGllZCBjb2xvciB2YWx1ZTogJHtjb2xvclZhbHVlfWApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0XHRkYXRhLmNvbnN0cy50aW1lb3V0cy50b29sdGlwIHx8IDEwMDBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRcdHRoaXMubG9nZ2VyLmVycm9yKGBFcnJvciBjb3B5aW5nIHRvIGNsaXBib2FyZDogJHtlcnJ9YCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgY3JlYXRlUGFsZXR0ZVRhYmxlKHBhbGV0dGU6IFN0b3JlZFBhbGV0dGUpOiBIVE1MRWxlbWVudCB7XG5cdFx0Y29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0Y29uc3QgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuXHRcdHRhYmxlLmNsYXNzTGlzdC5hZGQoJ3BhbGV0dGUtdGFibGUnKTtcblxuXHRcdHBhbGV0dGUucGFsZXR0ZS5pdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblx0XHRcdGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRcdFx0Y2VsbC50ZXh0Q29udGVudCA9IGBDb2xvciAke2luZGV4ICsgMX1gO1xuXHRcdFx0Y29sb3JCb3guY2xhc3NMaXN0LmFkZCgnY29sb3ItYm94Jyk7XG5cdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpdGVtLmNzc1N0cmluZ3MuaGV4Q1NTU3RyaW5nO1xuXG5cdFx0XHRyb3cuYXBwZW5kQ2hpbGQoY29sb3JCb3gpO1xuXHRcdFx0cm93LmFwcGVuZENoaWxkKGNlbGwpO1xuXHRcdFx0dGFibGUuYXBwZW5kQ2hpbGQocm93KTtcblx0XHR9KTtcblxuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKHRhYmxlKTtcblxuXHRcdHJldHVybiBmcmFnbWVudCBhcyB1bmtub3duIGFzIEhUTUxFbGVtZW50O1xuXHR9XG5cblx0cHVibGljIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5nZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB7XG5cdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0XHRzZWxlY3RlZENvbG9yQm94OiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHR9IHtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KTtcblxuXHRcdGlmICghc2VsZWN0ZWRDb2xvckJveCkge1xuXHRcdFx0aWYgKHRoaXMubG9nTW9kZS53YXJuaW5ncylcblx0XHRcdFx0dGhpcy5sb2dnZXIud2FybmluZyhcblx0XHRcdFx0XHRgRWxlbWVudCBub3QgZm91bmQgZm9yIGNvbG9yICR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLicpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogbnVsbCxcblx0XHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogbnVsbFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3Itc3RyaXBlLSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBnZXRJRCgpOiBudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLmlkO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXRBbGxJbnN0YW5jZXMoKTogVUlNYW5hZ2VyW10ge1xuXHRcdHJldHVybiBBcnJheS5mcm9tKFVJTWFuYWdlci5pbnN0YW5jZXMudmFsdWVzKCkpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGdldEN1cnJlbnRQYWxldHRlKCk6IFByb21pc2U8UGFsZXR0ZSB8IG51bGw+IHtcblx0XHRpZiAodGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuKSB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZUZuKCk7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWxldHRlIHx8XG5cdFx0XHQodGhpcy5wYWxldHRlSGlzdG9yeS5sZW5ndGggPiAwID8gdGhpcy5wYWxldHRlSGlzdG9yeVswXSA6IG51bGwpXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2VCeUlkKGlkOiBudW1iZXIpOiBVSU1hbmFnZXIgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBVSU1hbmFnZXIuaW5zdGFuY2VzLmdldChpZCk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGRlbGV0ZUluc3RhbmNlQnlJZChpZDogbnVtYmVyKTogdm9pZCB7XG5cdFx0VUlNYW5hZ2VyLmluc3RhbmNlcy5kZWxldGUoaWQpO1xuXHR9XG5cblx0cHVibGljIGFzeW5jIGhhbmRsZUV4cG9ydChcblx0XHRmb3JtYXQ6ICdDU1MnIHwgJ0pTT04nIHwgJ1hNTCcsXG5cdFx0Y29sb3JTcGFjZTogQ29sb3JTcGFjZSA9ICdoc2wnXG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBwYWxldHRlID0gYXdhaXQgdGhpcy5nZXRDdXJyZW50UGFsZXR0ZSgpO1xuXG5cdFx0XHRpZiAoIXBhbGV0dGUpIHtcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoJ05vIHBhbGV0dGUgYXZhaWxhYmxlIGZvciBleHBvcnQnKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAoZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ0NTUyc6XG5cdFx0XHRcdFx0dGhpcy51aS5pby5leHBvcnRQYWxldHRlLmFzQ1NTKHBhbGV0dGUsIGNvbG9yU3BhY2UpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdKU09OJzpcblx0XHRcdFx0XHR0aGlzLnVpLmlvLmV4cG9ydFBhbGV0dGUuYXNKU09OKHBhbGV0dGUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdYTUwnOlxuXHRcdFx0XHRcdHRoaXMudWkuaW8uZXhwb3J0UGFsZXR0ZS5hc1hNTChwYWxldHRlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGV4cG9ydCBmb3JtYXQ6ICR7Zm9ybWF0fWApO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycyAmJiB0aGlzLmxvZ01vZGUudmVyYm9zaXR5ID4gMSlcblx0XHRcdFx0dGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBleHBvcnQgcGFsZXR0ZTogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgaGFuZGxlSW1wb3J0KFxuXHRcdGZpbGU6IEZpbGUsXG5cdFx0Zm9ybWF0OiAnSlNPTicgfCAnWE1MJyB8ICdDU1MnXG5cdCk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5kb20uZmlsZVV0aWxzLnJlYWRGaWxlKGZpbGUpO1xuXG5cdFx0XHRsZXQgcGFsZXR0ZTogUGFsZXR0ZTtcblxuXHRcdFx0c3dpdGNoIChmb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnSlNPTic6XG5cdFx0XHRcdFx0cGFsZXR0ZSA9IHRoaXMucGFsZXR0ZUlPLmRlc2VyaWFsaXplLmZyb21KU09OKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdYTUwnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSB0aGlzLnBhbGV0dGVJTy5kZXNlcmlhbGl6ZS5mcm9tWE1MKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdDU1MnOlxuXHRcdFx0XHRcdHBhbGV0dGUgPSB0aGlzLnBhbGV0dGVJTy5kZXNlcmlhbGl6ZS5mcm9tQ1NTKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Zvcm1hdH1gKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hZGRQYWxldHRlVG9IaXN0b3J5KHBhbGV0dGUpO1xuXG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmluZm8gJiYgdGhpcy5sb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRcdHRoaXMubG9nZ2VyLmluZm8oXG5cdFx0XHRcdFx0YFN1Y2Nlc3NmdWxseSBpbXBvcnRlZCBwYWxldHRlIGluICR7Zm9ybWF0fSBmb3JtYXQuYFxuXHRcdFx0XHQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGltcG9ydCBmaWxlOiAke2Vycm9yfWApO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBwdWxsUGFyYW1zRnJvbVVJKCk6IHtcblx0XHRwYWxldHRlVHlwZTogbnVtYmVyO1xuXHRcdG51bUJveGVzOiBudW1iZXI7XG5cdFx0ZW5hYmxlQWxwaGE6IGJvb2xlYW47XG5cdFx0bGltaXREYXJrbmVzczogYm9vbGVhbjtcblx0XHRsaW1pdEdyYXluZXNzOiBib29sZWFuO1xuXHRcdGxpbWl0TGlnaHRuZXNzOiBib29sZWFuO1xuXHR9IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudCA9XG5cdFx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPVxuXHRcdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID1cblx0XHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPVxuXHRcdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXHRcdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID1cblx0XHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPVxuXHRcdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cGFsZXR0ZVR5cGU6IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnRcblx0XHRcdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHRcdDogMCxcblx0XHRcdFx0bnVtQm94ZXM6IG51bUJveGVzRWxlbWVudFxuXHRcdFx0XHRcdD8gcGFyc2VJbnQobnVtQm94ZXNFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0XHQ6IDAsXG5cdFx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYUNoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2Vcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmICh0aGlzLmxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIHB1bGwgcGFyYW1ldGVycyBmcm9tIFVJOiAke2Vycm9yfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cGFsZXR0ZVR5cGU6IDAsXG5cdFx0XHRcdG51bUJveGVzOiAwLFxuXHRcdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRcdGxpbWl0RGFya25lc3M6IGZhbHNlLFxuXHRcdFx0XHRsaW1pdEdyYXluZXNzOiBmYWxzZSxcblx0XHRcdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyByZW5kZXJQYWxldHRlKHRhYmxlSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IG51bGw+IHtcblx0XHRpZiAoIXRoaXMuZ2V0U3RvcmVkUGFsZXR0ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQYWxldHRlIGZldGNoaW5nIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBzZXQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZXJyb3JVdGlscy5oYW5kbGVBc3luYyhhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCBzdG9yZWRQYWxldHRlID0gYXdhaXQgdGhpcy5nZXRTdG9yZWRQYWxldHRlISh0YWJsZUlkKTtcblx0XHRcdGNvbnN0IHBhbGV0dGVSb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFsZXR0ZS1yb3cnKTtcblxuXHRcdFx0aWYgKCFzdG9yZWRQYWxldHRlKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBhbGV0dGUgJHt0YWJsZUlkfSBub3QgZm91bmQuYCk7XG5cdFx0XHRpZiAoIXBhbGV0dGVSb3cpIHRocm93IG5ldyBFcnJvcignUGFsZXR0ZSByb3cgZWxlbWVudCBub3QgZm91bmQuJyk7XG5cblx0XHRcdHBhbGV0dGVSb3cuaW5uZXJIVE1MID0gJyc7XG5cblx0XHRcdGNvbnN0IHRhYmxlRWxlbWVudCA9IHRoaXMuY3JlYXRlUGFsZXR0ZVRhYmxlKHN0b3JlZFBhbGV0dGUpO1xuXHRcdFx0cGFsZXR0ZVJvdy5hcHBlbmRDaGlsZCh0YWJsZUVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoIXRoaXMubW9kZS5xdWlldCkgbG9nLmluZm8oYFJlbmRlcmVkIHBhbGV0dGUgJHt0YWJsZUlkfS5gKTtcblx0XHR9LCAnVUlNYW5hZ2VyLnJlbmRlclBhbGV0dGUoKTogRXJyb3IgcmVuZGVyaW5nIHBhbGV0dGUnKTtcblx0fVxuXG5cdHB1YmxpYyBzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLmdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0XHRcdC8vICpERVYtTk9URSogdW5maW5pc2hlZCBmdW5jdGlvblxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAodGhpcy5sb2dNb2RlLmVycm9ycylcblx0XHRcdFx0bG9nLmVycm9yKGBGYWlsZWQgdG8gc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHNldEN1cnJlbnRQYWxldHRlKHBhbGV0dGU6IFBhbGV0dGUpOiB2b2lkIHtcblx0XHR0aGlzLmN1cnJlbnRQYWxldHRlID0gcGFsZXR0ZTtcblx0fVxuXG5cdHB1YmxpYyBzZXRHZXRDdXJyZW50UGFsZXR0ZUZuKGZuOiAoKSA9PiBQcm9taXNlPFBhbGV0dGUgfCBudWxsPik6IHZvaWQge1xuXHRcdHRoaXMuZ2V0Q3VycmVudFBhbGV0dGVGbiA9IGZuO1xuXHR9XG5cblx0cHVibGljIHNldEdldFN0b3JlZFBhbGV0dGUoXG5cdFx0Z2V0dGVyOiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZTxTdG9yZWRQYWxldHRlIHwgbnVsbD5cblx0KTogdm9pZCB7XG5cdFx0dGhpcy5nZXRTdG9yZWRQYWxldHRlID0gZ2V0dGVyO1xuXHR9XG5cblx0LyogUFJJVkFURSBNRVRIT0RTICovXG59XG4iXX0=