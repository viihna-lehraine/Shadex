import { data } from '../../data/index.js';

// File: common/utils/dom.js
const classes = data.dom.classes;
const ids = data.dom.ids;
const timers = data.config.timers;
function createDOMUtils(services, utils) {
    const addConversionListener = (id, colorSpace) => {
        const log = services.log;
        const btn = document.getElementById(id);
        if (btn) {
            if (utils.typeGuards.isColorSpace(colorSpace)) {
                btn.addEventListener('click', () => switchColorSpaceInDOM(colorSpace));
            }
            else {
                log('warn', `Invalid color space provided: ${colorSpace}`, 'domUtils.addConversionListener');
            }
        }
        else {
            log('warn', `Element with id "${id}" not found.`, 'domUtils.addConversionListener');
        }
    };
    function positionTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s ease-in-out';
    }
    function removeTooltip(element) {
        const tooltipId = element.dataset.tooltipId;
        if (!tooltipId)
            return;
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip?.remove();
            }, 300);
        }
        delete element.dataset.tooltipId;
    }
    function switchColorSpaceInDOM(targetFormat) {
        const log = services.log;
        try {
            const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
            for (const box of colorTextOutputBoxes) {
                const inputBox = box;
                const colorValues = inputBox.colorValues;
                if (!colorValues || !utils.validate.colorValue(colorValues)) {
                    log('error', 'Invalid color values. Cannot display toast.', 'domUtils.switchColorSpaceInDOM()');
                    continue;
                }
                const currentFormat = inputBox.getAttribute('data-format');
                log('debug', `Converting from ${currentFormat} to ${targetFormat}`, 'domUtils.switchColorSpaceInDOM()', 2);
                const convertFn = utils.color.getConversionFn(currentFormat, targetFormat);
                if (!convertFn) {
                    log('warn', `Conversion from ${currentFormat} to ${targetFormat} is not supported.`, 'domUtils.switchColorSpaceInDOM()');
                    continue;
                }
                if (colorValues.format === 'xyz') {
                    log('warn', 'Cannot convert from XYZ to another color space.', 'domUtils.switchColorSpaceInDOM()');
                    continue;
                }
                const clonedColor = utils.color.narrowToColor(colorValues);
                if (!clonedColor ||
                    utils.typeGuards.isSLColor(clonedColor) ||
                    utils.typeGuards.isSVColor(clonedColor) ||
                    utils.typeGuards.isXYZ(clonedColor)) {
                    log('error', 'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', 'domUtils.switchColorSpaceInDOM()', 3);
                    continue;
                }
                if (!clonedColor) {
                    log('error', `Conversion to ${targetFormat} failed.`, 'domUtils.switchColorSpaceInDOM()');
                    continue;
                }
                const newColor = utils.core.clone(convertFn(clonedColor));
                if (!newColor) {
                    log('error', `Conversion to ${targetFormat} failed.`, 'domUtils.switchColorSpaceInDOM()');
                    continue;
                }
                inputBox.value = String(newColor);
                inputBox.setAttribute('data-format', targetFormat);
            }
        }
        catch (error) {
            log('warn', 'Color conversion failure.', 'domUtils.switchColorSpaceInDOM()');
            throw new Error(`Failed to convert colors: ${error}`);
        }
    }
    return {
        addConversionListener,
        removeTooltip,
        switchColorSpaceInDOM,
        addEventListener(id, eventType, callback) {
            const log = services.log;
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(eventType, callback);
            }
            else {
                log('warn', `Element with id "${id}" not found.`, 'domUtils.addEventListener()', 2);
            }
        },
        createTooltip(element, text) {
            // remove existing tooltip if present
            removeTooltip(element);
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = text;
            // add to body
            document.body.appendChild(tooltip);
            // position it
            positionTooltip(element, tooltip);
            // store reference in dataset for later removal
            element.dataset.tooltipId = tooltip.id;
            // show tooltip with fade-in effect
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, timers.tooltipFadeOut);
            return tooltip;
        },
        downloadFile(data, filename, type) {
            const blob = new Blob([data], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        },
        enforceSwatchRules(minSwatches, maxSwatches) {
            const log = services.log;
            const paletteColumnSelector = document.getElementById(ids.inputs.paletteColumn);
            if (!paletteColumnSelector) {
                log('error', 'paletteColumnSelector not found', 'domUtils.enforceSwatchRules()');
                {
                    console.trace('enforceMinimumSwatches stack trace');
                }
                return;
            }
            const currentValue = parseInt(paletteColumnSelector.value, 10);
            let newValue = currentValue;
            // ensure the value is within the allowed range
            if (currentValue < minSwatches) {
                newValue = minSwatches;
            }
            else if (maxSwatches !== undefined &&
                currentValue > maxSwatches) {
                newValue = maxSwatches;
            }
            if (newValue !== currentValue) {
                // update value in the dropdown menu
                paletteColumnSelector.value = newValue.toString();
                // trigger a change event to notify the application
                const event = new Event('change', { bubbles: true });
                try {
                    paletteColumnSelector.dispatchEvent(event);
                }
                catch (error) {
                    log('warn', `Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, 'domUtils.enforceSwatchRules()');
                    throw new Error(`Failed to dispatch change event: ${error}`);
                }
            }
        },
        getValidatedDOMElements(unvalidatedIDs = data.dom.ids) {
            const log = services.log;
            const missingElements = [];
            const elementTypeMap = {
                btns: 'button',
                divs: 'div',
                inputs: 'input'
            };
            const elements = {
                btns: {},
                divs: {},
                inputs: {}
            };
            for (const [category, elementsGroup] of Object.entries(unvalidatedIDs)) {
                const tagName = elementTypeMap[category];
                if (!tagName) {
                    log('warn', `No element type mapping found for category "${category}". Skipping...`, 'getValidatedDOMElements()', 3);
                    continue;
                }
                for (const [key, id] of Object.entries(elementsGroup)) {
                    const element = utils.core.getElement(id);
                    if (!element) {
                        log('error', `Element with ID "${id}" not found`, 'getValidatedDOMElements()', 2);
                        missingElements.push(id);
                    }
                    else {
                        elements[category][key] = element;
                    }
                }
            }
            if (missingElements.length) {
                log('warn', `Missing elements: ${missingElements.join(', ')}`, 'getValidatedDOMElements()', 2);
                return null;
            }
            log('debug', 'All static elements are present.', 'getValidatedDOMElements()', 3);
            return elements;
        },
        hideTooltip() {
            const tooltip = utils.core.getElement('.tooltip');
            if (!tooltip)
                return;
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.remove();
            }, timers.tooltipFadeOut);
        },
        scanPaletteColumns() {
            const paletteColumns = utils.core.getAllElements(classes.paletteColumn);
            return Array.from(paletteColumns).map((column, index) => {
                const id = parseInt(column.id.split('-').pop() || `${index + 1}`, 10);
                const size = column.clientWidth / paletteColumns.length;
                const isLocked = column.classList.contains(classes.locked);
                return { id, position: index + 1, size, isLocked };
            });
        },
        readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
        },
        updateColorBox(color, boxId) {
            const colorBox = document.getElementById(boxId);
            if (colorBox) {
                colorBox.style.backgroundColor =
                    utils.color.convertColorToCSS(color);
            }
        },
        updateHistory(history) {
            const historyList = utils.core.getElement(ids.divs.paletteHistory);
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
						${palette.items.map(item => `<span class="color-box" style="background: ${item.css.hex};"></span>`).join(' ')}
					</div>
					<button class="remove-history-item" data-id="${palette.id}-history-remove-btn">Remove</button>
				`;
                entry
                    .querySelector('.remove-history-item')
                    ?.addEventListener('click', async () => {
                    // *DEV-NOTE* save to history somehow
                });
                historyList.appendChild(entry);
            });
        },
        async validateStaticElements() {
            const unvalidatedIDs = data.dom.ids;
            const log = services.log;
            const missingElements = [];
            const elementTypeMap = {
                btns: 'button',
                divs: 'div',
                inputs: 'input'
            };
            Object.entries(unvalidatedIDs).forEach(([category, elements]) => {
                const tagName = elementTypeMap[category];
                if (!tagName) {
                    log('warn', `No element type mapping found for category "${category}". Skipping...`, 'domUtils.validateStaticElements', 3);
                    return;
                }
                // validate each ID within each category
                Object.values(elements).forEach(unvalidatedIDs => {
                    if (typeof unvalidatedIDs !== 'string') {
                        log('error', `Invalid ID "${unvalidatedIDs}" in category "${category}". Expected string.`, 'domUtils.validateStaticElements', 2);
                        return;
                    }
                    const element = utils.core.getElement(unvalidatedIDs);
                    if (!element) {
                        log('error', `Element with ID "${unvalidatedIDs}" not found`, 'validateStaticElements', 2);
                        missingElements.push(unvalidatedIDs);
                    }
                });
            });
            if (missingElements.length) {
                log('warn', `Missing elements: ${missingElements.join(', ')}`, 'domUtils.validateStaticElements', 2);
            }
            else {
                log('debug', 'All static elements are present.', 'domUtils.validateStaticElements', 3);
            }
        }
    };
}

export { createDOMUtils };
//# sourceMappingURL=dom.js.map
