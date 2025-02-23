import '../../../../config/partials/defaults.js';
import { domConfig, domIndex } from '../../../../config/partials/dom.js';
import '../../../../config/partials/regex.js';

// File: common/utils/partials/dom/main.ts
const classes = domIndex.classes;
const ids = domIndex.ids;
function partialDOMUtilsFactory(colorUtils, helpers, services, validate) {
    const { data: { clone }, dom: { getElement, getAllElements } } = helpers;
    const { errors, log } = services;
    function createTooltip(element, text) {
        return errors.handleSync(() => {
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
            }, domConfig.tooltipFadeOut);
            return tooltip;
        }, 'Error occurred while creating tooltip.');
    }
    function downloadFile(data, filename, type) {
        return errors.handleSync(() => {
            const blob = new Blob([data], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }, 'Error occurred while downloading file.');
    }
    function enforceSwatchRules(minSwatches, maxSwatches) {
        return errors.handleSync(() => {
            const paletteColumnSelector = document.getElementById(domIndex.ids.inputs.paletteColumn);
            if (!paletteColumnSelector) {
                log('paletteColumnSelector not found', {
                    caller: 'enforceMinimumSwatches',
                    level: 'error'
                });
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
                    log(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, {
                        caller: 'enforceMinimumSwatches',
                        level: 'error'
                    });
                    throw new Error(`Failed to dispatch change event: ${error}`);
                }
            }
        }, 'Error occurred while enforcing swatch rules.');
    }
    function hideTooltip() {
        return errors.handleSync(() => {
            const tooltip = getElement('.tooltip');
            if (!tooltip)
                return;
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.remove();
            }, domConfig.tooltipFadeOut);
        }, 'Error occurred while hiding tooltip.');
    }
    function positionTooltip(element, tooltip) {
        return errors.handleSync(() => {
            const rect = element.getBoundingClientRect();
            tooltip.style.position = 'absolute';
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s ease-in-out';
        }, 'Error occurred while positioning tooltip.');
    }
    function removeTooltip(element) {
        return errors.handleSync(() => {
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
        }, 'Error occurred while removing tooltip.');
    }
    function readFile(file) {
        return errors.handleAsync(async () => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
        }, 'Error occurred while reading file.');
    }
    function scanPaletteColumns() {
        return errors.handleSync(() => {
            if (document.readyState === 'loading') {
                log('[scanPaletteColumns] Document not ready. Returning empty array.', {
                    caller: 'scanPaletteColumns',
                    level: 'warn'
                });
                return [];
            }
            const paletteColumns = getAllElements(classes.paletteColumn);
            if (!paletteColumns.length) {
                log('[scanPaletteColumns] No palette columns found.', {
                    caller: 'scanPaletteColumns',
                    level: 'warn'
                });
                return [];
            }
            return Array.from(paletteColumns).map((column, index) => {
                const id = parseInt(column.id.split('-').pop() || `${index + 1}`, 10);
                const size = column.clientWidth / paletteColumns.length;
                const isLocked = column.classList.contains(classes.locked);
                return { id, position: index + 1, size, isLocked };
            });
        }, 'Error occurred while scanning palette columns.');
    }
    function switchColorSpaceInDOM(targetFormat) {
        return errors.handleSync(() => {
            const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
            for (const box of colorTextOutputBoxes) {
                const inputBox = box;
                const colorValues = inputBox.colorValues;
                if (!colorValues || !validate.colorValue(colorValues)) {
                    log('Invalid color values. Cannot display toast.', {
                        caller: 'switchColorSpaceInDOM',
                        level: 'error'
                    });
                    continue;
                }
                const currentFormat = inputBox.getAttribute('data-format');
                log(`Converting from ${currentFormat} to ${targetFormat}`, {
                    caller: 'switchColorSpaceInDOM',
                    level: 'info'
                });
                const convertFn = helpers.color.getConversionFn(currentFormat, targetFormat);
                if (!convertFn) {
                    log(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`, {
                        caller: 'switchColorSpaceInDOM',
                        level: 'error'
                    });
                    continue;
                }
                if (colorValues.format === 'xyz') {
                    log('Cannot convert from XYZ to another color space.', {
                        caller: 'switchColorSpaceInDOM',
                        level: 'error'
                    });
                    continue;
                }
                const clonedColor = clone(colorValues);
                if (!helpers.typeguards.isConvertibleColor(clonedColor)) {
                    log('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', {
                        caller: 'switchColorSpaceInDOM',
                        level: 'error'
                    });
                    continue;
                }
                const newColor = convertFn(clonedColor);
                if (!newColor) {
                    log(`Conversion to ${targetFormat} failed.`, {
                        caller: 'switchColorSpaceInDOM',
                        level: 'error'
                    });
                    continue;
                }
                inputBox.value = String(newColor);
                inputBox.setAttribute('data-format', targetFormat);
            }
        }, 'Error occurred while converting colors.');
    }
    function updateColorBox(color, boxId) {
        return errors.handleSync(() => {
            const colorBox = document.getElementById(boxId);
            if (colorBox) {
                colorBox.style.backgroundColor =
                    colorUtils.formatColorAsCSS(color);
            }
        }, 'Error occurred while updating color box.');
    }
    function updateHistory(history) {
        return errors.handleSync(() => {
            const historyList = getElement(ids.divs.paletteHistory);
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
                    // TODO: save to history somehow
                });
                historyList.appendChild(entry);
            });
        }, 'Error occurred while updating history.');
    }
    const domUtilsPartial = {
        createTooltip,
        downloadFile,
        enforceSwatchRules,
        hideTooltip,
        positionTooltip,
        removeTooltip,
        readFile,
        scanPaletteColumns,
        switchColorSpaceInDOM,
        updateColorBox,
        updateHistory
    };
    return errors.handleSync(() => domUtilsPartial, 'Error occurred while creating partial DOM utilities group.', { context: { domUtilsPartial } });
}

export { partialDOMUtilsFactory };
//# sourceMappingURL=main.js.map
