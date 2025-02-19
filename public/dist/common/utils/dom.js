// File: common/utils/dom.js
import { data } from '../../config/index.js';
const classes = data.dom.classes;
const ids = data.dom.ids;
const mode = data.mode;
const timers = data.config.timers;
export function createDOMUtils(services, utils) {
    const addConversionListener = (id, colorSpace) => {
        const log = services.log;
        const btn = document.getElementById(id);
        if (btn) {
            if (utils.typeGuards.isColorSpace(colorSpace)) {
                btn.addEventListener('click', () => switchColorSpaceInDOM(colorSpace));
            }
            else {
                log(`Invalid color space provided: ${colorSpace}`, 'warn');
            }
        }
        else {
            log(`Element with id "${id}" not found.`, 'warn');
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
                    log('Invalid color values. Cannot display toast.', 'error');
                    continue;
                }
                const currentFormat = inputBox.getAttribute('data-format');
                log(`Converting from ${currentFormat} to ${targetFormat}`, 'debug');
                const convertFn = utils.color.getConversionFn(currentFormat, targetFormat);
                if (!convertFn) {
                    log(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`, 'warn');
                    continue;
                }
                if (colorValues.format === 'xyz') {
                    log('Cannot convert from XYZ to another color space.', 'warn');
                    continue;
                }
                const clonedColor = utils.color.narrowToColor(colorValues);
                if (!clonedColor ||
                    utils.typeGuards.isSLColor(clonedColor) ||
                    utils.typeGuards.isSVColor(clonedColor) ||
                    utils.typeGuards.isXYZ(clonedColor)) {
                    log('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', 'error');
                    continue;
                }
                if (!clonedColor) {
                    log(`Conversion to ${targetFormat} failed.`, 'error');
                    continue;
                }
                const newColor = utils.core.clone(convertFn(clonedColor));
                if (!newColor) {
                    log(`Conversion to ${targetFormat} failed.`, 'error');
                    continue;
                }
                inputBox.value = String(newColor);
                inputBox.setAttribute('data-format', targetFormat);
            }
        }
        catch (error) {
            log('Color conversion failure.', 'warn');
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
                log(`Element with id "${id}" not found.`, 'warn');
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
                log('paletteColumnSelector not found', 'error');
                if (mode.stackTrace) {
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
                    log(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, 'error');
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
                    log(`No element type mapping found for category "${category}". Skipping...`, 'warn');
                    continue;
                }
                for (const [key, id] of Object.entries(elementsGroup)) {
                    const element = utils.core.getElement(id);
                    if (!element) {
                        log(`Element with ID "${id}" not found`, 'error');
                        missingElements.push(id);
                    }
                    else {
                        elements[category][key] = element;
                    }
                }
            }
            if (missingElements.length) {
                log(`Missing elements: ${missingElements.join(', ')}`, 'warn');
                return null;
            }
            log('All static elements are present.', 'debug');
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
            }, timers.tooltipFadeOut || 500);
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
                    // TODO: save to history somehow
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
                    log(`No element type mapping found for category "${category}". Skipping...`, 'warn');
                    return;
                }
                // validate each ID within each category
                Object.values(elements).forEach(unvalidatedIDs => {
                    if (typeof unvalidatedIDs !== 'string') {
                        log(`Invalid ID "${unvalidatedIDs}" in category "${category}". Expected string.`, 'error');
                        return;
                    }
                    const element = utils.core.getElement(unvalidatedIDs);
                    if (!element) {
                        log(`Element with ID "${unvalidatedIDs}" not found`, 'error');
                        missingElements.push(unvalidatedIDs);
                    }
                });
            });
            if (missingElements.length) {
                log(`Missing elements: ${missingElements.join(', ')}`, 'warn');
            }
            else {
                log('All static elements are present! 🩷', 'debug');
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi91dGlscy9kb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBYzVCLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBRWxDLE1BQU0sVUFBVSxjQUFjLENBQzdCLFFBQTJCLEVBQzNCLEtBQXlCO0lBRXpCLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxFQUFVLEVBQUUsVUFBa0IsRUFBRSxFQUFFO1FBQ2hFLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDekIsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQTZCLENBQUM7UUFFcEUsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNULElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDL0MsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FDbEMscUJBQXFCLENBQUMsVUFBd0IsQ0FBQyxDQUMvQyxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLEdBQUcsQ0FBQyxpQ0FBaUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNGLENBQUM7YUFBTSxDQUFDO1lBQ1AsR0FBRyxDQUFDLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0YsQ0FBQyxDQUFDO0lBRUYsU0FBUyxlQUFlLENBQUMsT0FBb0IsRUFBRSxPQUFvQjtRQUNsRSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUU3QyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksQ0FBQztRQUN2RCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ2hGLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLDBCQUEwQixDQUFDO0lBQ3ZELENBQUM7SUFFRCxTQUFTLGFBQWEsQ0FBQyxPQUFvQjtRQUMxQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUU1QyxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU87UUFFdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQzVCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ25CLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNULENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxTQUFTLHFCQUFxQixDQUFDLFlBQXdCO1FBQ3RELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFFekIsSUFBSSxDQUFDO1lBQ0osTUFBTSxvQkFBb0IsR0FDekIsUUFBUSxDQUFDLGdCQUFnQixDQUN4Qix3QkFBd0IsQ0FDeEIsQ0FBQztZQUVILEtBQUssTUFBTSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxRQUFRLEdBQUcsR0FBd0IsQ0FBQztnQkFDMUMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztnQkFFekMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7b0JBQzdELEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFFNUQsU0FBUztnQkFDVixDQUFDO2dCQUVELE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQzFDLGFBQWEsQ0FDQyxDQUFDO2dCQUVoQixHQUFHLENBQ0YsbUJBQW1CLGFBQWEsT0FBTyxZQUFZLEVBQUUsRUFDckQsT0FBTyxDQUNQLENBQUM7Z0JBRUYsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQzVDLGFBQWEsRUFDYixZQUFZLENBQ1osQ0FBQztnQkFFRixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2hCLEdBQUcsQ0FDRixtQkFBbUIsYUFBYSxPQUFPLFlBQVksb0JBQW9CLEVBQ3ZFLE1BQU0sQ0FDTixDQUFDO29CQUVGLFNBQVM7Z0JBQ1YsQ0FBQztnQkFFRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFLENBQUM7b0JBQ2xDLEdBQUcsQ0FDRixpREFBaUQsRUFDakQsTUFBTSxDQUNOLENBQUM7b0JBRUYsU0FBUztnQkFDVixDQUFDO2dCQUVELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUUzRCxJQUNDLENBQUMsV0FBVztvQkFDWixLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7b0JBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztvQkFDdkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQ2xDLENBQUM7b0JBQ0YsR0FBRyxDQUNGLDhGQUE4RixFQUM5RixPQUFPLENBQ1AsQ0FBQztvQkFFRixTQUFTO2dCQUNWLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNsQixHQUFHLENBQUMsaUJBQWlCLFlBQVksVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUV0RCxTQUFTO2dCQUNWLENBQUM7Z0JBQ0QsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDZixHQUFHLENBQUMsaUJBQWlCLFlBQVksVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN0RCxTQUFTO2dCQUNWLENBQUM7Z0JBRUQsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRWxDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3BELENBQUM7UUFDRixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNoQixHQUFHLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFekMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO0lBQ0YsQ0FBQztJQUVELE9BQU87UUFDTixxQkFBcUI7UUFDckIsYUFBYTtRQUNiLHFCQUFxQjtRQUNyQixnQkFBZ0IsQ0FDZixFQUFVLEVBQ1YsU0FBWSxFQUNaLFFBQThDO1lBRTlDLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDekIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUU1QyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0MsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNGLENBQUM7UUFDRCxhQUFhLENBQUMsT0FBb0IsRUFBRSxJQUFZO1lBQy9DLHFDQUFxQztZQUNyQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUUzQixjQUFjO1lBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbkMsY0FBYztZQUNkLGVBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFbEMsK0NBQStDO1lBQy9DLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFFdkMsbUNBQW1DO1lBQ25DLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQzdCLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFMUIsT0FBTyxPQUFPLENBQUM7UUFDaEIsQ0FBQztRQUNELFlBQVksQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxJQUFZO1lBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV0QyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVWLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELGtCQUFrQixDQUFDLFdBQW1CLEVBQUUsV0FBbUI7WUFDMUQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUN6QixNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ3BELEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUNILENBQUM7WUFFdkIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFaEQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDckQsQ0FBQztnQkFFRCxPQUFPO1lBQ1IsQ0FBQztZQUVELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFL0QsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDO1lBRTVCLCtDQUErQztZQUMvQyxJQUFJLFlBQVksR0FBRyxXQUFXLEVBQUUsQ0FBQztnQkFDaEMsUUFBUSxHQUFHLFdBQVcsQ0FBQztZQUN4QixDQUFDO2lCQUFNLElBQ04sV0FBVyxLQUFLLFNBQVM7Z0JBQ3pCLFlBQVksR0FBRyxXQUFXLEVBQ3pCLENBQUM7Z0JBQ0YsUUFBUSxHQUFHLFdBQVcsQ0FBQztZQUN4QixDQUFDO1lBRUQsSUFBSSxRQUFRLEtBQUssWUFBWSxFQUFFLENBQUM7Z0JBQy9CLG9DQUFvQztnQkFDcEMscUJBQXFCLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFbEQsbURBQW1EO2dCQUNuRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNKLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztnQkFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO29CQUNoQixHQUFHLENBQ0YsNEVBQTRFLEtBQUssRUFBRSxFQUNuRixPQUFPLENBQ1AsQ0FBQztvQkFFRixNQUFNLElBQUksS0FBSyxDQUNkLG9DQUFvQyxLQUFLLEVBQUUsQ0FDM0MsQ0FBQztnQkFDSCxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7UUFDRCx1QkFBdUIsQ0FDdEIsaUJBQTBCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRztZQUV0QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ3pCLE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztZQUVyQyxNQUFNLGNBQWMsR0FHaEI7Z0JBQ0gsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLE9BQU87YUFDZixDQUFDO1lBRUYsTUFBTSxRQUFRLEdBQXlCO2dCQUN0QyxJQUFJLEVBQUUsRUFBeUI7Z0JBQy9CLElBQUksRUFBRSxFQUF5QjtnQkFDL0IsTUFBTSxFQUFFLEVBQTJCO2FBQ25DLENBQUM7WUFFRixLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FDckQsY0FBYyxDQUNkLEVBQUUsQ0FBQztnQkFFSCxNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsUUFBb0IsQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2QsR0FBRyxDQUNGLCtDQUErQyxRQUFRLGdCQUFnQixFQUN2RSxNQUFNLENBQ04sQ0FBQztvQkFDRixTQUFTO2dCQUNWLENBQUM7Z0JBRUQsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQ3JDLGFBQXVDLENBQ3ZDLEVBQUUsQ0FBQztvQkFDSCxNQUFNLE9BQU8sR0FDWixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FFbkIsRUFBRSxDQUFDLENBQUM7b0JBRVAsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNkLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ2xELGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzFCLENBQUM7eUJBQU0sQ0FBQzt3QkFFTixRQUFRLENBQUMsUUFBb0IsQ0FJN0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7b0JBQ2xCLENBQUM7Z0JBQ0YsQ0FBQztZQUNGLENBQUM7WUFFRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLHFCQUFxQixlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQztZQUVELEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVqRCxPQUFPLFFBQXVCLENBQUM7UUFDaEMsQ0FBQztRQUNELFdBQVc7WUFDVixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBaUIsVUFBVSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUVyQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFFNUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0Qsa0JBQWtCO1lBQ2pCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUMvQyxPQUFPLENBQUMsYUFBYSxDQUNyQixDQUFDO1lBRUYsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDdkQsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUNsQixNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFDNUMsRUFBRSxDQUNGLENBQUM7Z0JBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO2dCQUN4RCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRTNELE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUNELFFBQVEsQ0FBQyxJQUFVO1lBQ2xCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBRWhDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFnQixDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7UUFDRCxjQUFjLENBQUMsS0FBVSxFQUFFLEtBQWE7WUFDdkMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVoRCxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNkLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZTtvQkFDN0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxDQUFDO1FBQ0YsQ0FBQztRQUNELGFBQWEsQ0FBQyxPQUFrQjtZQUMvQixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FDeEMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQ3ZCLENBQUM7WUFFRixJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPO1lBRXpCLFdBQVcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBRTNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3pCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTVDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNwQyxLQUFLLENBQUMsRUFBRSxHQUFHLFdBQVcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQyxLQUFLLENBQUMsU0FBUyxHQUFHO21CQUNILE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxFQUFFOztRQUU5QyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDhDQUE4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7b0RBRS9ELE9BQU8sQ0FBQyxFQUFFO0tBQ3pELENBQUM7Z0JBQ0YsS0FBSztxQkFDSCxhQUFhLENBQUMsc0JBQXNCLENBQUM7b0JBQ3RDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFO29CQUN0QyxnQ0FBZ0M7Z0JBQ2pDLENBQUMsQ0FBQyxDQUFDO2dCQUNKLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxDQUFDLHNCQUFzQjtZQUMzQixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUNwQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ3pCLE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztZQUVyQyxNQUFNLGNBQWMsR0FHaEI7Z0JBQ0gsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLE9BQU87YUFDTixDQUFDO1lBRVgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFO2dCQUMvRCxNQUFNLE9BQU8sR0FDWixjQUFjLENBQUMsUUFBdUMsQ0FBQyxDQUFDO2dCQUV6RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2QsR0FBRyxDQUNGLCtDQUErQyxRQUFRLGdCQUFnQixFQUN2RSxNQUFNLENBQ04sQ0FBQztvQkFDRixPQUFPO2dCQUNSLENBQUM7Z0JBRUQsd0NBQXdDO2dCQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtvQkFDaEQsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUUsQ0FBQzt3QkFDeEMsR0FBRyxDQUNGLGVBQWUsY0FBYyxrQkFBa0IsUUFBUSxxQkFBcUIsRUFDNUUsT0FBTyxDQUNQLENBQUM7d0JBQ0YsT0FBTztvQkFDUixDQUFDO29CQUVELE1BQU0sT0FBTyxHQUNaLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUVuQixjQUFjLENBQUMsQ0FBQztvQkFFbkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNkLEdBQUcsQ0FDRixvQkFBb0IsY0FBYyxhQUFhLEVBQy9DLE9BQU8sQ0FDUCxDQUFDO3dCQUNGLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3RDLENBQUM7Z0JBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUM1QixHQUFHLENBQUMscUJBQXFCLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNoRSxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDRixDQUFDO0tBQ0QsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vdXRpbHMvZG9tLmpzXG5cbmltcG9ydCB7XG5cdENvbG9ySW5wdXRFbGVtZW50LFxuXHRDb2xvclNwYWNlLFxuXHRET01FbGVtZW50cyxcblx0RE9NX0lEcyxcblx0RE9NVXRpbHNJbnRlcmZhY2UsXG5cdEhTTCxcblx0UGFsZXR0ZSxcblx0U2VydmljZXNJbnRlcmZhY2UsXG5cdFN0YXRlLFxuXHRVdGlsaXRpZXNJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNsYXNzZXMgPSBkYXRhLmRvbS5jbGFzc2VzO1xuY29uc3QgaWRzID0gZGF0YS5kb20uaWRzO1xuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcbmNvbnN0IHRpbWVycyA9IGRhdGEuY29uZmlnLnRpbWVycztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURPTVV0aWxzKFxuXHRzZXJ2aWNlczogU2VydmljZXNJbnRlcmZhY2UsXG5cdHV0aWxzOiBVdGlsaXRpZXNJbnRlcmZhY2Vcbik6IERPTVV0aWxzSW50ZXJmYWNlIHtcblx0Y29uc3QgYWRkQ29udmVyc2lvbkxpc3RlbmVyID0gKGlkOiBzdHJpbmcsIGNvbG9yU3BhY2U6IHN0cmluZykgPT4ge1xuXHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblx0XHRjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKGJ0bikge1xuXHRcdFx0aWYgKHV0aWxzLnR5cGVHdWFyZHMuaXNDb2xvclNwYWNlKGNvbG9yU3BhY2UpKSB7XG5cdFx0XHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0c3dpdGNoQ29sb3JTcGFjZUluRE9NKGNvbG9yU3BhY2UgYXMgQ29sb3JTcGFjZSlcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhgSW52YWxpZCBjb2xvciBzcGFjZSBwcm92aWRlZDogJHtjb2xvclNwYWNlfWAsICd3YXJuJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvZyhgRWxlbWVudCB3aXRoIGlkIFwiJHtpZH1cIiBub3QgZm91bmQuYCwgJ3dhcm4nKTtcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gcG9zaXRpb25Ub29sdGlwKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB0b29sdGlwOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHRcdGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0dG9vbHRpcC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0dG9vbHRpcC5zdHlsZS5sZWZ0ID0gYCR7cmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFh9cHhgO1xuXHRcdHRvb2x0aXAuc3R5bGUudG9wID0gYCR7cmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gNX1weGA7XG5cdFx0dG9vbHRpcC5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG5cdFx0dG9vbHRpcC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXHRcdHRvb2x0aXAuc3R5bGUub3BhY2l0eSA9ICcwJztcblx0XHR0b29sdGlwLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjJzIGVhc2UtaW4tb3V0Jztcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHRjb25zdCB0b29sdGlwSWQgPSBlbGVtZW50LmRhdGFzZXQudG9vbHRpcElkO1xuXG5cdFx0aWYgKCF0b29sdGlwSWQpIHJldHVybjtcblxuXHRcdGNvbnN0IHRvb2x0aXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xuXHRcdGlmICh0b29sdGlwKSB7XG5cdFx0XHR0b29sdGlwLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dG9vbHRpcD8ucmVtb3ZlKCk7XG5cdFx0XHR9LCAzMDApO1xuXHRcdH1cblxuXHRcdGRlbGV0ZSBlbGVtZW50LmRhdGFzZXQudG9vbHRpcElkO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3dpdGNoQ29sb3JTcGFjZUluRE9NKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IHZvaWQge1xuXHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3hlcyA9XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHRcdCk7XG5cblx0XHRcdGZvciAoY29uc3QgYm94IG9mIGNvbG9yVGV4dE91dHB1dEJveGVzKSB7XG5cdFx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGlucHV0Qm94LmNvbG9yVmFsdWVzO1xuXG5cdFx0XHRcdGlmICghY29sb3JWYWx1ZXMgfHwgIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoY29sb3JWYWx1ZXMpKSB7XG5cdFx0XHRcdFx0bG9nKCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4gQ2Fubm90IGRpc3BsYXkgdG9hc3QuJywgJ2Vycm9yJyk7XG5cblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRGb3JtYXQgPSBpbnB1dEJveC5nZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0XHQpIGFzIENvbG9yU3BhY2U7XG5cblx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gLFxuXHRcdFx0XHRcdCdkZWJ1Zydcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRjb25zdCBjb252ZXJ0Rm4gPSB1dGlscy5jb2xvci5nZXRDb252ZXJzaW9uRm4oXG5cdFx0XHRcdFx0Y3VycmVudEZvcm1hdCxcblx0XHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoIWNvbnZlcnRGbikge1xuXHRcdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH0gaXMgbm90IHN1cHBvcnRlZC5gLFxuXHRcdFx0XHRcdFx0J3dhcm4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbG9yVmFsdWVzLmZvcm1hdCA9PT0gJ3h5eicpIHtcblx0XHRcdFx0XHRsb2coXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBYWVogdG8gYW5vdGhlciBjb2xvciBzcGFjZS4nLFxuXHRcdFx0XHRcdFx0J3dhcm4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB1dGlscy5jb2xvci5uYXJyb3dUb0NvbG9yKGNvbG9yVmFsdWVzKTtcblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0IWNsb25lZENvbG9yIHx8XG5cdFx0XHRcdFx0dXRpbHMudHlwZUd1YXJkcy5pc1NMQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdFx0dXRpbHMudHlwZUd1YXJkcy5pc1NWQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdFx0dXRpbHMudHlwZUd1YXJkcy5pc1hZWihjbG9uZWRDb2xvcilcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gU0wsIFNWLCBvciBYWVogY29sb3Igc3BhY2VzLiBQbGVhc2UgY29udmVydCB0byBhIHN1cHBvcnRlZCBmb3JtYXQgZmlyc3QuJyxcblx0XHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWNsb25lZENvbG9yKSB7XG5cdFx0XHRcdFx0bG9nKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBuZXdDb2xvciA9IHV0aWxzLmNvcmUuY2xvbmUoY29udmVydEZuKGNsb25lZENvbG9yKSk7XG5cdFx0XHRcdGlmICghbmV3Q29sb3IpIHtcblx0XHRcdFx0XHRsb2coYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gLCAnZXJyb3InKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlucHV0Qm94LnZhbHVlID0gU3RyaW5nKG5ld0NvbG9yKTtcblxuXHRcdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0bG9nKCdDb2xvciBjb252ZXJzaW9uIGZhaWx1cmUuJywgJ3dhcm4nKTtcblxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRhZGRDb252ZXJzaW9uTGlzdGVuZXIsXG5cdFx0cmVtb3ZlVG9vbHRpcCxcblx0XHRzd2l0Y2hDb2xvclNwYWNlSW5ET00sXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcjxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRFdmVudE1hcD4oXG5cdFx0XHRpZDogc3RyaW5nLFxuXHRcdFx0ZXZlbnRUeXBlOiBLLFxuXHRcdFx0Y2FsbGJhY2s6IChldjogSFRNTEVsZW1lbnRFdmVudE1hcFtLXSkgPT4gdm9pZFxuXHRcdCk6IHZvaWQge1xuXHRcdFx0Y29uc3QgbG9nID0gc2VydmljZXMubG9nO1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuXHRcdFx0aWYgKGVsZW1lbnQpIHtcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gLCAnd2FybicpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y3JlYXRlVG9vbHRpcChlbGVtZW50OiBIVE1MRWxlbWVudCwgdGV4dDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuXHRcdFx0Ly8gcmVtb3ZlIGV4aXN0aW5nIHRvb2x0aXAgaWYgcHJlc2VudFxuXHRcdFx0cmVtb3ZlVG9vbHRpcChlbGVtZW50KTtcblxuXHRcdFx0Y29uc3QgdG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0dG9vbHRpcC5jbGFzc0xpc3QuYWRkKCd0b29sdGlwJyk7XG5cdFx0XHR0b29sdGlwLnRleHRDb250ZW50ID0gdGV4dDtcblxuXHRcdFx0Ly8gYWRkIHRvIGJvZHlcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cblx0XHRcdC8vIHBvc2l0aW9uIGl0XG5cdFx0XHRwb3NpdGlvblRvb2x0aXAoZWxlbWVudCwgdG9vbHRpcCk7XG5cblx0XHRcdC8vIHN0b3JlIHJlZmVyZW5jZSBpbiBkYXRhc2V0IGZvciBsYXRlciByZW1vdmFsXG5cdFx0XHRlbGVtZW50LmRhdGFzZXQudG9vbHRpcElkID0gdG9vbHRpcC5pZDtcblxuXHRcdFx0Ly8gc2hvdyB0b29sdGlwIHdpdGggZmFkZS1pbiBlZmZlY3Rcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0b29sdGlwLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG5cdFx0XHR9LCB0aW1lcnMudG9vbHRpcEZhZGVPdXQpO1xuXG5cdFx0XHRyZXR1cm4gdG9vbHRpcDtcblx0XHR9LFxuXHRcdGRvd25sb2FkRmlsZShkYXRhOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0Y29uc3QgYmxvYiA9IG5ldyBCbG9iKFtkYXRhXSwgeyB0eXBlIH0pO1xuXHRcdFx0Y29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblx0XHRcdGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cblx0XHRcdGEuaHJlZiA9IHVybDtcblx0XHRcdGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcblx0XHRcdGEuY2xpY2soKTtcblxuXHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuXHRcdH0sXG5cdFx0ZW5mb3JjZVN3YXRjaFJ1bGVzKG1pblN3YXRjaGVzOiBudW1iZXIsIG1heFN3YXRjaGVzOiBudW1iZXIpOiB2b2lkIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5TZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRpZHMuaW5wdXRzLnBhbGV0dGVDb2x1bW5cblx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cblx0XHRcdGlmICghcGFsZXR0ZUNvbHVtblNlbGVjdG9yKSB7XG5cdFx0XHRcdGxvZygncGFsZXR0ZUNvbHVtblNlbGVjdG9yIG5vdCBmb3VuZCcsICdlcnJvcicpO1xuXG5cdFx0XHRcdGlmIChtb2RlLnN0YWNrVHJhY2UpIHtcblx0XHRcdFx0XHRjb25zb2xlLnRyYWNlKCdlbmZvcmNlTWluaW11bVN3YXRjaGVzIHN0YWNrIHRyYWNlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHBhcnNlSW50KHBhbGV0dGVDb2x1bW5TZWxlY3Rvci52YWx1ZSwgMTApO1xuXG5cdFx0XHRsZXQgbmV3VmFsdWUgPSBjdXJyZW50VmFsdWU7XG5cblx0XHRcdC8vIGVuc3VyZSB0aGUgdmFsdWUgaXMgd2l0aGluIHRoZSBhbGxvd2VkIHJhbmdlXG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbWluU3dhdGNoZXMpIHtcblx0XHRcdFx0bmV3VmFsdWUgPSBtaW5Td2F0Y2hlcztcblx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdG1heFN3YXRjaGVzICE9PSB1bmRlZmluZWQgJiZcblx0XHRcdFx0Y3VycmVudFZhbHVlID4gbWF4U3dhdGNoZXNcblx0XHRcdCkge1xuXHRcdFx0XHRuZXdWYWx1ZSA9IG1heFN3YXRjaGVzO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV3VmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuXHRcdFx0XHQvLyB1cGRhdGUgdmFsdWUgaW4gdGhlIGRyb3Bkb3duIG1lbnVcblx0XHRcdFx0cGFsZXR0ZUNvbHVtblNlbGVjdG9yLnZhbHVlID0gbmV3VmFsdWUudG9TdHJpbmcoKTtcblxuXHRcdFx0XHQvLyB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50IHRvIG5vdGlmeSB0aGUgYXBwbGljYXRpb25cblx0XHRcdFx0Y29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRwYWxldHRlQ29sdW1uU2VsZWN0b3IuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdFx0YEZhaWxlZCB0byBkaXNwYXRjaCBjaGFuZ2UgZXZlbnQgdG8gcGFsZXR0ZS1udW1iZXItb3B0aW9ucyBkcm9wZG93biBtZW51OiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gZGlzcGF0Y2ggY2hhbmdlIGV2ZW50OiAke2Vycm9yfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnZXRWYWxpZGF0ZWRET01FbGVtZW50cyhcblx0XHRcdHVudmFsaWRhdGVkSURzOiBET01fSURzID0gZGF0YS5kb20uaWRzXG5cdFx0KTogRE9NRWxlbWVudHMgfCBudWxsIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblx0XHRcdGNvbnN0IG1pc3NpbmdFbGVtZW50czogc3RyaW5nW10gPSBbXTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudFR5cGVNYXA6IFJlY29yZDxcblx0XHRcdFx0a2V5b2YgRE9NX0lEcyxcblx0XHRcdFx0a2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwXG5cdFx0XHQ+ID0ge1xuXHRcdFx0XHRidG5zOiAnYnV0dG9uJyxcblx0XHRcdFx0ZGl2czogJ2RpdicsXG5cdFx0XHRcdGlucHV0czogJ2lucHV0J1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudHM6IFBhcnRpYWw8RE9NRWxlbWVudHM+ID0ge1xuXHRcdFx0XHRidG5zOiB7fSBhcyBET01FbGVtZW50c1snYnRucyddLFxuXHRcdFx0XHRkaXZzOiB7fSBhcyBET01FbGVtZW50c1snZGl2cyddLFxuXHRcdFx0XHRpbnB1dHM6IHt9IGFzIERPTUVsZW1lbnRzWydpbnB1dHMnXVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChjb25zdCBbY2F0ZWdvcnksIGVsZW1lbnRzR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKFxuXHRcdFx0XHR1bnZhbGlkYXRlZElEc1xuXHRcdFx0KSkge1xuXHRcdFx0XHR0eXBlIENhdGVnb3J5ID0ga2V5b2YgRE9NX0lEcztcblx0XHRcdFx0Y29uc3QgdGFnTmFtZSA9IGVsZW1lbnRUeXBlTWFwW2NhdGVnb3J5IGFzIENhdGVnb3J5XTtcblxuXHRcdFx0XHRpZiAoIXRhZ05hbWUpIHtcblx0XHRcdFx0XHRsb2coXG5cdFx0XHRcdFx0XHRgTm8gZWxlbWVudCB0eXBlIG1hcHBpbmcgZm91bmQgZm9yIGNhdGVnb3J5IFwiJHtjYXRlZ29yeX1cIi4gU2tpcHBpbmcuLi5gLFxuXHRcdFx0XHRcdFx0J3dhcm4nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAoY29uc3QgW2tleSwgaWRdIG9mIE9iamVjdC5lbnRyaWVzKFxuXHRcdFx0XHRcdGVsZW1lbnRzR3JvdXAgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXHRcdFx0XHQpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZWxlbWVudCA9XG5cdFx0XHRcdFx0XHR1dGlscy5jb3JlLmdldEVsZW1lbnQ8XG5cdFx0XHRcdFx0XHRcdEhUTUxFbGVtZW50VGFnTmFtZU1hcFt0eXBlb2YgdGFnTmFtZV1cblx0XHRcdFx0XHRcdD4oaWQpO1xuXG5cdFx0XHRcdFx0aWYgKCFlbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRsb2coYEVsZW1lbnQgd2l0aCBJRCBcIiR7aWR9XCIgbm90IGZvdW5kYCwgJ2Vycm9yJyk7XG5cdFx0XHRcdFx0XHRtaXNzaW5nRWxlbWVudHMucHVzaChpZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdChcblx0XHRcdFx0XHRcdFx0ZWxlbWVudHNbY2F0ZWdvcnkgYXMgQ2F0ZWdvcnldIGFzIFJlY29yZDxcblx0XHRcdFx0XHRcdFx0XHRzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdFx0SFRNTEVsZW1lbnRcblx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0KVtrZXldID0gZWxlbWVudDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG1pc3NpbmdFbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0bG9nKGBNaXNzaW5nIGVsZW1lbnRzOiAke21pc3NpbmdFbGVtZW50cy5qb2luKCcsICcpfWAsICd3YXJuJyk7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRsb2coJ0FsbCBzdGF0aWMgZWxlbWVudHMgYXJlIHByZXNlbnQuJywgJ2RlYnVnJyk7XG5cblx0XHRcdHJldHVybiBlbGVtZW50cyBhcyBET01FbGVtZW50cztcblx0XHR9LFxuXHRcdGhpZGVUb29sdGlwKCk6IHZvaWQge1xuXHRcdFx0Y29uc3QgdG9vbHRpcCA9IHV0aWxzLmNvcmUuZ2V0RWxlbWVudDxIVE1MRGl2RWxlbWVudD4oJy50b29sdGlwJyk7XG5cdFx0XHRpZiAoIXRvb2x0aXApIHJldHVybjtcblxuXHRcdFx0dG9vbHRpcC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dG9vbHRpcC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cdFx0XHRcdHRvb2x0aXAucmVtb3ZlKCk7XG5cdFx0XHR9LCB0aW1lcnMudG9vbHRpcEZhZGVPdXQgfHwgNTAwKTtcblx0XHR9LFxuXHRcdHNjYW5QYWxldHRlQ29sdW1ucygpOiBTdGF0ZVsncGFsZXR0ZUNvbnRhaW5lciddWydjb2x1bW5zJ10ge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUNvbHVtbnMgPSB1dGlscy5jb3JlLmdldEFsbEVsZW1lbnRzPEhUTUxEaXZFbGVtZW50Pihcblx0XHRcdFx0Y2xhc3Nlcy5wYWxldHRlQ29sdW1uXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gQXJyYXkuZnJvbShwYWxldHRlQ29sdW1ucykubWFwKChjb2x1bW4sIGluZGV4KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlkID0gcGFyc2VJbnQoXG5cdFx0XHRcdFx0Y29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkgfHwgYCR7aW5kZXggKyAxfWAsXG5cdFx0XHRcdFx0MTBcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3Qgc2l6ZSA9IGNvbHVtbi5jbGllbnRXaWR0aCAvIHBhbGV0dGVDb2x1bW5zLmxlbmd0aDtcblx0XHRcdFx0Y29uc3QgaXNMb2NrZWQgPSBjb2x1bW4uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzZXMubG9ja2VkKTtcblxuXHRcdFx0XHRyZXR1cm4geyBpZCwgcG9zaXRpb246IGluZGV4ICsgMSwgc2l6ZSwgaXNMb2NrZWQgfTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVhZEZpbGUoZmlsZTogRmlsZSk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdFx0XHRcdHJlYWRlci5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcblx0XHRcdFx0cmVhZGVyLm9uZXJyb3IgPSAoKSA9PiByZWplY3QocmVhZGVyLmVycm9yKTtcblxuXHRcdFx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0dXBkYXRlQ29sb3JCb3goY29sb3I6IEhTTCwgYm94SWQ6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChib3hJZCk7XG5cblx0XHRcdGlmIChjb2xvckJveCkge1xuXHRcdFx0XHRjb2xvckJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPVxuXHRcdFx0XHRcdHV0aWxzLmNvbG9yLmNvbnZlcnRDb2xvclRvQ1NTKGNvbG9yKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHVwZGF0ZUhpc3RvcnkoaGlzdG9yeTogUGFsZXR0ZVtdKTogdm9pZCB7XG5cdFx0XHRjb25zdCBoaXN0b3J5TGlzdCA9IHV0aWxzLmNvcmUuZ2V0RWxlbWVudDxIVE1MRGl2RWxlbWVudD4oXG5cdFx0XHRcdGlkcy5kaXZzLnBhbGV0dGVIaXN0b3J5XG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWhpc3RvcnlMaXN0KSByZXR1cm47XG5cblx0XHRcdGhpc3RvcnlMaXN0LmlubmVySFRNTCA9ICcnO1xuXG5cdFx0XHRoaXN0b3J5LmZvckVhY2gocGFsZXR0ZSA9PiB7XG5cdFx0XHRcdGNvbnN0IGVudHJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRcdFx0ZW50cnkuY2xhc3NMaXN0LmFkZCgnaGlzdG9yeS1pdGVtJyk7XG5cdFx0XHRcdGVudHJ5LmlkID0gYHBhbGV0dGVfJHtwYWxldHRlLmlkfWA7XG5cdFx0XHRcdGVudHJ5LmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHQ8cD5QYWxldHRlICMke3BhbGV0dGUubWV0YWRhdGEubmFtZSB8fCBwYWxldHRlLmlkfTwvcD5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sb3ItcHJldmlld1wiPlxuXHRcdFx0XHRcdFx0JHtwYWxldHRlLml0ZW1zLm1hcChpdGVtID0+IGA8c3BhbiBjbGFzcz1cImNvbG9yLWJveFwiIHN0eWxlPVwiYmFja2dyb3VuZDogJHtpdGVtLmNzcy5oZXh9O1wiPjwvc3Bhbj5gKS5qb2luKCcgJyl9XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInJlbW92ZS1oaXN0b3J5LWl0ZW1cIiBkYXRhLWlkPVwiJHtwYWxldHRlLmlkfS1oaXN0b3J5LXJlbW92ZS1idG5cIj5SZW1vdmU8L2J1dHRvbj5cblx0XHRcdFx0YDtcblx0XHRcdFx0ZW50cnlcblx0XHRcdFx0XHQucXVlcnlTZWxlY3RvcignLnJlbW92ZS1oaXN0b3J5LWl0ZW0nKVxuXHRcdFx0XHRcdD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBzYXZlIHRvIGhpc3Rvcnkgc29tZWhvd1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRoaXN0b3J5TGlzdC5hcHBlbmRDaGlsZChlbnRyeSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGFzeW5jIHZhbGlkYXRlU3RhdGljRWxlbWVudHMoKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0XHRjb25zdCB1bnZhbGlkYXRlZElEcyA9IGRhdGEuZG9tLmlkcztcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblx0XHRcdGNvbnN0IG1pc3NpbmdFbGVtZW50czogc3RyaW5nW10gPSBbXTtcblxuXHRcdFx0Y29uc3QgZWxlbWVudFR5cGVNYXA6IFJlY29yZDxcblx0XHRcdFx0a2V5b2YgdHlwZW9mIGlkcyxcblx0XHRcdFx0a2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwXG5cdFx0XHQ+ID0ge1xuXHRcdFx0XHRidG5zOiAnYnV0dG9uJyxcblx0XHRcdFx0ZGl2czogJ2RpdicsXG5cdFx0XHRcdGlucHV0czogJ2lucHV0J1xuXHRcdFx0fSBhcyBjb25zdDtcblxuXHRcdFx0T2JqZWN0LmVudHJpZXModW52YWxpZGF0ZWRJRHMpLmZvckVhY2goKFtjYXRlZ29yeSwgZWxlbWVudHNdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhZ05hbWUgPVxuXHRcdFx0XHRcdGVsZW1lbnRUeXBlTWFwW2NhdGVnb3J5IGFzIGtleW9mIHR5cGVvZiBlbGVtZW50VHlwZU1hcF07XG5cblx0XHRcdFx0aWYgKCF0YWdOYW1lKSB7XG5cdFx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdFx0YE5vIGVsZW1lbnQgdHlwZSBtYXBwaW5nIGZvdW5kIGZvciBjYXRlZ29yeSBcIiR7Y2F0ZWdvcnl9XCIuIFNraXBwaW5nLi4uYCxcblx0XHRcdFx0XHRcdCd3YXJuJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdmFsaWRhdGUgZWFjaCBJRCB3aXRoaW4gZWFjaCBjYXRlZ29yeVxuXHRcdFx0XHRPYmplY3QudmFsdWVzKGVsZW1lbnRzKS5mb3JFYWNoKHVudmFsaWRhdGVkSURzID0+IHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHVudmFsaWRhdGVkSURzICE9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdFx0XHRgSW52YWxpZCBJRCBcIiR7dW52YWxpZGF0ZWRJRHN9XCIgaW4gY2F0ZWdvcnkgXCIke2NhdGVnb3J5fVwiLiBFeHBlY3RlZCBzdHJpbmcuYCxcblx0XHRcdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCBlbGVtZW50ID1cblx0XHRcdFx0XHRcdHV0aWxzLmNvcmUuZ2V0RWxlbWVudDxcblx0XHRcdFx0XHRcdFx0SFRNTEVsZW1lbnRUYWdOYW1lTWFwW3R5cGVvZiB0YWdOYW1lXVxuXHRcdFx0XHRcdFx0Pih1bnZhbGlkYXRlZElEcyk7XG5cblx0XHRcdFx0XHRpZiAoIWVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRcdFx0YEVsZW1lbnQgd2l0aCBJRCBcIiR7dW52YWxpZGF0ZWRJRHN9XCIgbm90IGZvdW5kYCxcblx0XHRcdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdG1pc3NpbmdFbGVtZW50cy5wdXNoKHVudmFsaWRhdGVkSURzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChtaXNzaW5nRWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdGxvZyhgTWlzc2luZyBlbGVtZW50czogJHttaXNzaW5nRWxlbWVudHMuam9pbignLCAnKX1gLCAnd2FybicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKCdBbGwgc3RhdGljIGVsZW1lbnRzIGFyZSBwcmVzZW50ISDwn6m3JywgJ2RlYnVnJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuIl19