// File: common/utils/partials/dom/main.ts
import { config, domConfig, domIndex } from '../../../../config/index.js';
const classes = domIndex.classes;
const ids = domIndex.ids;
const mode = config.mode;
export function partialDOMUtilitiesFactory(colorUtils, helpers, services, validate) {
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
                log.error('paletteColumnSelector not found', `enforceMinimumSwatches`);
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
                    log.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, `enforceMinimumSwatches`);
                    throw new Error(`Failed to dispatch change event: ${error}`);
                }
            }
        }, 'Error occurred while enforcing swatch rules.');
    }
    function getUpdatedColumnSizes(columns, columnID, newSize) {
        const minSize = domConfig.minColumnSize;
        const maxSize = domConfig.maxColumnSize;
        const adjustedSize = Math.max(minSize, Math.min(newSize, maxSize));
        const columnIndex = columns.findIndex(col => col.id === columnID);
        if (columnIndex === -1)
            return columns;
        const sizeDifference = adjustedSize - columns[columnIndex].size;
        // update the target column and adjust others
        const updatedColumns = columns.map(col => {
            if (col.id === columnID) {
                return { ...col, size: adjustedSize };
            }
            if (!col.isLocked) {
                return {
                    ...col,
                    size: col.size - sizeDifference / (columns.length - 1)
                };
            }
            return col;
        });
        // Normalize to ensure total size is 100%
        const totalSize = updatedColumns.reduce((sum, col) => sum + col.size, 0);
        return updatedColumns.map(col => ({
            ...col,
            size: col.size * (100 / totalSize)
        }));
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
            }, domConfig.tooltipFadeOut || 500);
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
                log.warn('Document not ready. Returning empty array.', `scanPaletteColumns`);
                return [];
            }
            const paletteColumns = getAllElements(classes.paletteColumn);
            if (!paletteColumns.length) {
                log.warn('No palette columns found.', `scanPaletteColumns`);
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
                    log.error('Invalid color values. Cannot display toast.', `switchColorSpaceInDOM`);
                    continue;
                }
                const currentFormat = inputBox.getAttribute('data-format');
                log.info(`Converting from ${currentFormat} to ${targetFormat}`, `switchColorSpaceInDOM`);
                const convertFn = helpers.color.getConversionFn(currentFormat, targetFormat);
                if (!convertFn) {
                    log.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`, `switchColorSpaceInDOM`);
                    continue;
                }
                if (colorValues.format === 'xyz') {
                    log.error('Cannot convert from XYZ to another color space.', `switchColorSpaceInDOM`);
                    continue;
                }
                const clonedColor = clone(colorValues);
                if (!helpers.typeguards.isConvertibleColor(clonedColor)) {
                    log.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', `switchColorSpaceInDOM`);
                    continue;
                }
                const newColor = convertFn(clonedColor);
                if (!newColor) {
                    log.error(`Conversion to ${targetFormat} failed.`, `switchColorSpaceInDOM`);
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
    const domUtilitiesPartial = {
        createTooltip,
        downloadFile,
        enforceSwatchRules,
        getUpdatedColumnSizes,
        hideTooltip,
        positionTooltip,
        removeTooltip,
        readFile,
        scanPaletteColumns,
        switchColorSpaceInDOM,
        updateColorBox,
        updateHistory
    };
    return errors.handleSync(() => domUtilitiesPartial, 'Error occurred while creating partial DOM utilities group.', { context: { domUtilitiesPartial } });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL3BhcnRpYWxzL2RvbS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBDQUEwQztBQWMxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUxRSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ2pDLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDekIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUV6QixNQUFNLFVBQVUsMEJBQTBCLENBQ3pDLFVBQTBCLEVBQzFCLE9BQWdCLEVBQ2hCLFFBQWtCLEVBQ2xCLFFBQTZCO0lBRTdCLE1BQU0sRUFDTCxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFDZixHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLEVBQ25DLEdBQUcsT0FBTyxDQUFDO0lBQ1osTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFFakMsU0FBUyxhQUFhLENBQ3JCLE9BQW9CLEVBQ3BCLElBQVk7UUFFWixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLHFDQUFxQztZQUNyQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUMzQixjQUFjO1lBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkMsY0FBYztZQUNk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T0FBTyxDQUFDLEVBQUU7SUFDekQsQ0FBQztnQkFDRCxLQUFLO3FCQUNILGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztvQkFDdEMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7b0JBQ3RDLGdDQUFnQztnQkFDakMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLG1CQUFtQixHQUF3QjtRQUNoRCxhQUFhO1FBQ2IsWUFBWTtRQUNaLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFDckIsV0FBVztRQUNYLGVBQWU7UUFDZixhQUFhO1FBQ2IsUUFBUTtRQUNSLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFDckIsY0FBYztRQUNkLGFBQWE7S0FDSixDQUFDO0lBRVgsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN2QixHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsRUFDekIsNERBQTRELEVBQzVELEVBQUUsT0FBTyxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxDQUNwQyxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvbW1vbi91dGlscy9wYXJ0aWFscy9kb20vbWFpbi50c1xuXG5pbXBvcnQge1xuXHRDb2xvcklucHV0RWxlbWVudCxcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JVdGlsaXRpZXMsXG5cdERPTVV0aWxpdGllc1BhcnRpYWwsXG5cdEhlbHBlcnMsXG5cdEhTTCxcblx0UGFsZXR0ZSxcblx0U2VydmljZXMsXG5cdFN0YXRlLFxuXHRWYWxpZGF0aW9uVXRpbGl0aWVzXG59IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvbmZpZywgZG9tQ29uZmlnLCBkb21JbmRleCB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNsYXNzZXMgPSBkb21JbmRleC5jbGFzc2VzO1xuY29uc3QgaWRzID0gZG9tSW5kZXguaWRzO1xuY29uc3QgbW9kZSA9IGNvbmZpZy5tb2RlO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFydGlhbERPTVV0aWxpdGllc0ZhY3RvcnkoXG5cdGNvbG9yVXRpbHM6IENvbG9yVXRpbGl0aWVzLFxuXHRoZWxwZXJzOiBIZWxwZXJzLFxuXHRzZXJ2aWNlczogU2VydmljZXMsXG5cdHZhbGlkYXRlOiBWYWxpZGF0aW9uVXRpbGl0aWVzXG4pOiBET01VdGlsaXRpZXNQYXJ0aWFsIHtcblx0Y29uc3Qge1xuXHRcdGRhdGE6IHsgY2xvbmUgfSxcblx0XHRkb206IHsgZ2V0RWxlbWVudCwgZ2V0QWxsRWxlbWVudHMgfVxuXHR9ID0gaGVscGVycztcblx0Y29uc3QgeyBlcnJvcnMsIGxvZyB9ID0gc2VydmljZXM7XG5cblx0ZnVuY3Rpb24gY3JlYXRlVG9vbHRpcChcblx0XHRlbGVtZW50OiBIVE1MRWxlbWVudCxcblx0XHR0ZXh0OiBzdHJpbmdcblx0KTogSFRNTEVsZW1lbnQgfCB2b2lkIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Ly8gcmVtb3ZlIGV4aXN0aW5nIHRvb2x0aXAgaWYgcHJlc2VudFxuXHRcdFx0cmVtb3ZlVG9vbHRpcChlbGVtZW50KTtcblx0XHRcdGNvbnN0IHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgndG9vbHRpcCcpO1xuXHRcdFx0dG9vbHRpcC50ZXh0Q29udGVudCA9IHRleHQ7XG5cdFx0XHQvLyBhZGQgdG8gYm9keVxuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcblx0XHRcdC8vIHBvc2l0aW9uIGl0XG5cdFx0XHRwb3NpdGlvblRvb2x0aXAoZWxlbWVudCwgdG9vbHRpcCk7XG5cdFx0XHQvLyBzdG9yZSByZWZlcmVuY2UgaW4gZGF0YXNldCBmb3IgbGF0ZXIgcmVtb3ZhbFxuXHRcdFx0ZWxlbWVudC5kYXRhc2V0LnRvb2x0aXBJZCA9IHRvb2x0aXAuaWQ7XG5cdFx0XHQvLyBzaG93IHRvb2x0aXAgd2l0aCBmYWRlLWluIGVmZmVjdFxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHRvb2x0aXAuc3R5bGUub3BhY2l0eSA9ICcxJztcblx0XHRcdH0sIGRvbUNvbmZpZy50b29sdGlwRmFkZU91dCk7XG5cdFx0XHRyZXR1cm4gdG9vbHRpcDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY3JlYXRpbmcgdG9vbHRpcC4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRvd25sb2FkRmlsZShkYXRhOiBzdHJpbmcsIGZpbGVuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZyk6IHZvaWQge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBibG9iID0gbmV3IEJsb2IoW2RhdGFdLCB7IHR5cGUgfSk7XG5cdFx0XHRjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXHRcdFx0Y29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdGEuaHJlZiA9IHVybDtcblx0XHRcdGEuZG93bmxvYWQgPSBmaWxlbmFtZTtcblx0XHRcdGEuY2xpY2soKTtcblx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgZG93bmxvYWRpbmcgZmlsZS4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuZm9yY2VTd2F0Y2hSdWxlcyhcblx0XHRtaW5Td2F0Y2hlczogbnVtYmVyLFxuXHRcdG1heFN3YXRjaGVzOiBudW1iZXJcblx0KTogdm9pZCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5TZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRkb21JbmRleC5pZHMuaW5wdXRzLnBhbGV0dGVDb2x1bW5cblx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cdFx0XHRpZiAoIXBhbGV0dGVDb2x1bW5TZWxlY3Rvcikge1xuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0J3BhbGV0dGVDb2x1bW5TZWxlY3RvciBub3QgZm91bmQnLFxuXHRcdFx0XHRcdGBlbmZvcmNlTWluaW11bVN3YXRjaGVzYFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAobW9kZS5zdGFja1RyYWNlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS50cmFjZSgnZW5mb3JjZU1pbmltdW1Td2F0Y2hlcyBzdGFjayB0cmFjZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHBhcnNlSW50KHBhbGV0dGVDb2x1bW5TZWxlY3Rvci52YWx1ZSwgMTApO1xuXHRcdFx0bGV0IG5ld1ZhbHVlID0gY3VycmVudFZhbHVlO1xuXHRcdFx0Ly8gZW5zdXJlIHRoZSB2YWx1ZSBpcyB3aXRoaW4gdGhlIGFsbG93ZWQgcmFuZ2Vcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCBtaW5Td2F0Y2hlcykge1xuXHRcdFx0XHRuZXdWYWx1ZSA9IG1pblN3YXRjaGVzO1xuXHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0bWF4U3dhdGNoZXMgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRjdXJyZW50VmFsdWUgPiBtYXhTd2F0Y2hlc1xuXHRcdFx0KSB7XG5cdFx0XHRcdG5ld1ZhbHVlID0gbWF4U3dhdGNoZXM7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmV3VmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuXHRcdFx0XHQvLyB1cGRhdGUgdmFsdWUgaW4gdGhlIGRyb3Bkb3duIG1lbnVcblx0XHRcdFx0cGFsZXR0ZUNvbHVtblNlbGVjdG9yLnZhbHVlID0gbmV3VmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdFx0Ly8gdHJpZ2dlciBhIGNoYW5nZSBldmVudCB0byBub3RpZnkgdGhlIGFwcGxpY2F0aW9uXG5cdFx0XHRcdGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cGFsZXR0ZUNvbHVtblNlbGVjdG9yLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gZGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHRvIHBhbGV0dGUtbnVtYmVyLW9wdGlvbnMgZHJvcGRvd24gbWVudTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdFx0YGVuZm9yY2VNaW5pbXVtU3dhdGNoZXNgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRgRmFpbGVkIHRvIGRpc3BhdGNoIGNoYW5nZSBldmVudDogJHtlcnJvcn1gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBlbmZvcmNpbmcgc3dhdGNoIHJ1bGVzLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0VXBkYXRlZENvbHVtblNpemVzKFxuXHRcdGNvbHVtbnM6IFN0YXRlWydwYWxldHRlQ29udGFpbmVyJ11bJ2NvbHVtbnMnXSxcblx0XHRjb2x1bW5JRDogbnVtYmVyLFxuXHRcdG5ld1NpemU6IG51bWJlclxuXHQpOiBTdGF0ZVsncGFsZXR0ZUNvbnRhaW5lciddWydjb2x1bW5zJ10ge1xuXHRcdGNvbnN0IG1pblNpemUgPSBkb21Db25maWcubWluQ29sdW1uU2l6ZTtcblx0XHRjb25zdCBtYXhTaXplID0gZG9tQ29uZmlnLm1heENvbHVtblNpemU7XG5cblx0XHRjb25zdCBhZGp1c3RlZFNpemUgPSBNYXRoLm1heChtaW5TaXplLCBNYXRoLm1pbihuZXdTaXplLCBtYXhTaXplKSk7XG5cdFx0Y29uc3QgY29sdW1uSW5kZXggPSBjb2x1bW5zLmZpbmRJbmRleChjb2wgPT4gY29sLmlkID09PSBjb2x1bW5JRCk7XG5cdFx0aWYgKGNvbHVtbkluZGV4ID09PSAtMSkgcmV0dXJuIGNvbHVtbnM7XG5cblx0XHRjb25zdCBzaXplRGlmZmVyZW5jZSA9IGFkanVzdGVkU2l6ZSAtIGNvbHVtbnNbY29sdW1uSW5kZXhdLnNpemU7XG5cblx0XHQvLyB1cGRhdGUgdGhlIHRhcmdldCBjb2x1bW4gYW5kIGFkanVzdCBvdGhlcnNcblx0XHRjb25zdCB1cGRhdGVkQ29sdW1ucyA9IGNvbHVtbnMubWFwKGNvbCA9PiB7XG5cdFx0XHRpZiAoY29sLmlkID09PSBjb2x1bW5JRCkge1xuXHRcdFx0XHRyZXR1cm4geyAuLi5jb2wsIHNpemU6IGFkanVzdGVkU2l6ZSB9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFjb2wuaXNMb2NrZWQpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQuLi5jb2wsXG5cdFx0XHRcdFx0c2l6ZTogY29sLnNpemUgLSBzaXplRGlmZmVyZW5jZSAvIChjb2x1bW5zLmxlbmd0aCAtIDEpXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY29sO1xuXHRcdH0pO1xuXG5cdFx0Ly8gTm9ybWFsaXplIHRvIGVuc3VyZSB0b3RhbCBzaXplIGlzIDEwMCVcblx0XHRjb25zdCB0b3RhbFNpemUgPSB1cGRhdGVkQ29sdW1ucy5yZWR1Y2UoXG5cdFx0XHQoc3VtLCBjb2wpID0+IHN1bSArIGNvbC5zaXplLFxuXHRcdFx0MFxuXHRcdCk7XG5cdFx0cmV0dXJuIHVwZGF0ZWRDb2x1bW5zLm1hcChjb2wgPT4gKHtcblx0XHRcdC4uLmNvbCxcblx0XHRcdHNpemU6IGNvbC5zaXplICogKDEwMCAvIHRvdGFsU2l6ZSlcblx0XHR9KSk7XG5cdH1cblxuXHRmdW5jdGlvbiBoaWRlVG9vbHRpcCgpOiB2b2lkIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgdG9vbHRpcCA9IGdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KCcudG9vbHRpcCcpO1xuXG5cdFx0XHRpZiAoIXRvb2x0aXApIHJldHVybjtcblxuXHRcdFx0dG9vbHRpcC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dG9vbHRpcC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cdFx0XHRcdHRvb2x0aXAucmVtb3ZlKCk7XG5cdFx0XHR9LCBkb21Db25maWcudG9vbHRpcEZhZGVPdXQgfHwgNTAwKTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgaGlkaW5nIHRvb2x0aXAuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwb3NpdGlvblRvb2x0aXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHRvb2x0aXA6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0dG9vbHRpcC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0XHR0b29sdGlwLnN0eWxlLmxlZnQgPSBgJHtyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWH1weGA7XG5cdFx0XHR0b29sdGlwLnN0eWxlLnRvcCA9IGAke3JlY3QudG9wICsgd2luZG93LnNjcm9sbFkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIDV9cHhgO1xuXHRcdFx0dG9vbHRpcC5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG5cdFx0XHR0b29sdGlwLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cdFx0XHR0b29sdGlwLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG5cdFx0XHR0b29sdGlwLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjJzIGVhc2UtaW4tb3V0Jztcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgcG9zaXRpb25pbmcgdG9vbHRpcC4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgdG9vbHRpcElkID0gZWxlbWVudC5kYXRhc2V0LnRvb2x0aXBJZDtcblx0XHRcdGlmICghdG9vbHRpcElkKSByZXR1cm47XG5cdFx0XHRjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcblx0XHRcdGlmICh0b29sdGlwKSB7XG5cdFx0XHRcdHRvb2x0aXAuc3R5bGUub3BhY2l0eSA9ICcwJztcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dG9vbHRpcD8ucmVtb3ZlKCk7XG5cdFx0XHRcdH0sIDMwMCk7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgZWxlbWVudC5kYXRhc2V0LnRvb2x0aXBJZDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgcmVtb3ZpbmcgdG9vbHRpcC4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlYWRGaWxlKGZpbGU6IEZpbGUpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlQXN5bmMoYXN5bmMgKCkgPT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdFx0cmVhZGVyLm9ubG9hZCA9ICgpID0+IHJlc29sdmUocmVhZGVyLnJlc3VsdCBhcyBzdHJpbmcpO1xuXHRcdFx0XHRyZWFkZXIub25lcnJvciA9ICgpID0+IHJlamVjdChyZWFkZXIuZXJyb3IpO1xuXHRcdFx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblx0XHRcdH0pO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSByZWFkaW5nIGZpbGUuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzY2FuUGFsZXR0ZUNvbHVtbnMoKTogU3RhdGVbJ3BhbGV0dGVDb250YWluZXInXVsnY29sdW1ucyddIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuXHRcdFx0XHRsb2cud2Fybihcblx0XHRcdFx0XHQnRG9jdW1lbnQgbm90IHJlYWR5LiBSZXR1cm5pbmcgZW1wdHkgYXJyYXkuJyxcblx0XHRcdFx0XHRgc2NhblBhbGV0dGVDb2x1bW5zYFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHBhbGV0dGVDb2x1bW5zID0gZ2V0QWxsRWxlbWVudHM8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdFx0XHRjbGFzc2VzLnBhbGV0dGVDb2x1bW5cblx0XHRcdCk7XG5cdFx0XHRpZiAoIXBhbGV0dGVDb2x1bW5zLmxlbmd0aCkge1xuXHRcdFx0XHRsb2cud2FybignTm8gcGFsZXR0ZSBjb2x1bW5zIGZvdW5kLicsIGBzY2FuUGFsZXR0ZUNvbHVtbnNgKTtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQXJyYXkuZnJvbShwYWxldHRlQ29sdW1ucykubWFwKChjb2x1bW4sIGluZGV4KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlkID0gcGFyc2VJbnQoXG5cdFx0XHRcdFx0Y29sdW1uLmlkLnNwbGl0KCctJykucG9wKCkgfHwgYCR7aW5kZXggKyAxfWAsXG5cdFx0XHRcdFx0MTBcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3Qgc2l6ZSA9IGNvbHVtbi5jbGllbnRXaWR0aCAvIHBhbGV0dGVDb2x1bW5zLmxlbmd0aDtcblx0XHRcdFx0Y29uc3QgaXNMb2NrZWQgPSBjb2x1bW4uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzZXMubG9ja2VkKTtcblx0XHRcdFx0cmV0dXJuIHsgaWQsIHBvc2l0aW9uOiBpbmRleCArIDEsIHNpemUsIGlzTG9ja2VkIH07XG5cdFx0XHR9KTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgc2Nhbm5pbmcgcGFsZXR0ZSBjb2x1bW5zLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3dpdGNoQ29sb3JTcGFjZUluRE9NKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IHZvaWQge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3hlcyA9XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHRcdCk7XG5cdFx0XHRmb3IgKGNvbnN0IGJveCBvZiBjb2xvclRleHRPdXRwdXRCb3hlcykge1xuXHRcdFx0XHRjb25zdCBpbnB1dEJveCA9IGJveCBhcyBDb2xvcklucHV0RWxlbWVudDtcblx0XHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblx0XHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhdmFsaWRhdGUuY29sb3JWYWx1ZShjb2xvclZhbHVlcykpIHtcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHQnSW52YWxpZCBjb2xvciB2YWx1ZXMuIENhbm5vdCBkaXNwbGF5IHRvYXN0LicsXG5cdFx0XHRcdFx0XHRgc3dpdGNoQ29sb3JTcGFjZUluRE9NYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0XHQnZGF0YS1mb3JtYXQnXG5cdFx0XHRcdCkgYXMgQ29sb3JTcGFjZTtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YENvbnZlcnRpbmcgZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fWAsXG5cdFx0XHRcdFx0YHN3aXRjaENvbG9yU3BhY2VJbkRPTWBcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3QgY29udmVydEZuID0gaGVscGVycy5jb2xvci5nZXRDb252ZXJzaW9uRm4oXG5cdFx0XHRcdFx0Y3VycmVudEZvcm1hdCxcblx0XHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKCFjb252ZXJ0Rm4pIHtcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHRgQ29udmVyc2lvbiBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9IGlzIG5vdCBzdXBwb3J0ZWQuYCxcblx0XHRcdFx0XHRcdGBzd2l0Y2hDb2xvclNwYWNlSW5ET01gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29sb3JWYWx1ZXMuZm9ybWF0ID09PSAneHl6Jykge1xuXHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLicsXG5cdFx0XHRcdFx0XHRgc3dpdGNoQ29sb3JTcGFjZUluRE9NYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yVmFsdWVzKTtcblxuXHRcdFx0XHRpZiAoIWhlbHBlcnMudHlwZWd1YXJkcy5pc0NvbnZlcnRpYmxlQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdFx0bG9nLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gU0wsIFNWLCBvciBYWVogY29sb3Igc3BhY2VzLiBQbGVhc2UgY29udmVydCB0byBhIHN1cHBvcnRlZCBmb3JtYXQgZmlyc3QuJyxcblx0XHRcdFx0XHRcdGBzd2l0Y2hDb2xvclNwYWNlSW5ET01gXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBuZXdDb2xvciA9IGNvbnZlcnRGbihjbG9uZWRDb2xvcik7XG5cdFx0XHRcdGlmICghbmV3Q29sb3IpIHtcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHRgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmAsXG5cdFx0XHRcdFx0XHRgc3dpdGNoQ29sb3JTcGFjZUluRE9NYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXHRcdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHRcdH1cblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY29udmVydGluZyBjb2xvcnMuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVDb2xvckJveChjb2xvcjogSFNMLCBib3hJZDogc3RyaW5nKTogdm9pZCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGNvbG9yQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYm94SWQpO1xuXHRcdFx0aWYgKGNvbG9yQm94KSB7XG5cdFx0XHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XG5cdFx0XHRcdFx0Y29sb3JVdGlscy5mb3JtYXRDb2xvckFzQ1NTKGNvbG9yKTtcblx0XHRcdH1cblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgdXBkYXRpbmcgY29sb3IgYm94LicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlSGlzdG9yeShoaXN0b3J5OiBQYWxldHRlW10pOiB2b2lkIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgaGlzdG9yeUxpc3QgPSBnZXRFbGVtZW50PEhUTUxEaXZFbGVtZW50Pihcblx0XHRcdFx0aWRzLmRpdnMucGFsZXR0ZUhpc3Rvcnlcblx0XHRcdCk7XG5cdFx0XHRpZiAoIWhpc3RvcnlMaXN0KSByZXR1cm47XG5cdFx0XHRoaXN0b3J5TGlzdC5pbm5lckhUTUwgPSAnJztcblx0XHRcdGhpc3RvcnkuZm9yRWFjaChwYWxldHRlID0+IHtcblx0XHRcdFx0Y29uc3QgZW50cnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0ZW50cnkuY2xhc3NMaXN0LmFkZCgnaGlzdG9yeS1pdGVtJyk7XG5cdFx0XHRcdGVudHJ5LmlkID0gYHBhbGV0dGVfJHtwYWxldHRlLmlkfWA7XG5cdFx0XHRcdGVudHJ5LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHA+UGFsZXR0ZSAjJHtwYWxldHRlLm1ldGFkYXRhLm5hbWUgfHwgcGFsZXR0ZS5pZH08L3A+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2xvci1wcmV2aWV3XCI+XG5cdFx0XHRcdFx0JHtwYWxldHRlLml0ZW1zLm1hcChpdGVtID0+IGA8c3BhbiBjbGFzcz1cImNvbG9yLWJveFwiIHN0eWxlPVwiYmFja2dyb3VuZDogJHtpdGVtLmNzcy5oZXh9O1wiPjwvc3Bhbj5gKS5qb2luKCcgJyl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwicmVtb3ZlLWhpc3RvcnktaXRlbVwiIGRhdGEtaWQ9XCIke3BhbGV0dGUuaWR9LWhpc3RvcnktcmVtb3ZlLWJ0blwiPlJlbW92ZTwvYnV0dG9uPlxuXHRcdFx0YDtcblx0XHRcdFx0ZW50cnlcblx0XHRcdFx0XHQucXVlcnlTZWxlY3RvcignLnJlbW92ZS1oaXN0b3J5LWl0ZW0nKVxuXHRcdFx0XHRcdD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBzYXZlIHRvIGhpc3Rvcnkgc29tZWhvd1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRoaXN0b3J5TGlzdC5hcHBlbmRDaGlsZChlbnRyeSk7XG5cdFx0XHR9KTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgdXBkYXRpbmcgaGlzdG9yeS4nKTtcblx0fVxuXG5cdGNvbnN0IGRvbVV0aWxpdGllc1BhcnRpYWw6IERPTVV0aWxpdGllc1BhcnRpYWwgPSB7XG5cdFx0Y3JlYXRlVG9vbHRpcCxcblx0XHRkb3dubG9hZEZpbGUsXG5cdFx0ZW5mb3JjZVN3YXRjaFJ1bGVzLFxuXHRcdGdldFVwZGF0ZWRDb2x1bW5TaXplcyxcblx0XHRoaWRlVG9vbHRpcCxcblx0XHRwb3NpdGlvblRvb2x0aXAsXG5cdFx0cmVtb3ZlVG9vbHRpcCxcblx0XHRyZWFkRmlsZSxcblx0XHRzY2FuUGFsZXR0ZUNvbHVtbnMsXG5cdFx0c3dpdGNoQ29sb3JTcGFjZUluRE9NLFxuXHRcdHVwZGF0ZUNvbG9yQm94LFxuXHRcdHVwZGF0ZUhpc3Rvcnlcblx0fSBhcyBjb25zdDtcblxuXHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoXG5cdFx0KCkgPT4gZG9tVXRpbGl0aWVzUGFydGlhbCxcblx0XHQnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY3JlYXRpbmcgcGFydGlhbCBET00gdXRpbGl0aWVzIGdyb3VwLicsXG5cdFx0eyBjb250ZXh0OiB7IGRvbVV0aWxpdGllc1BhcnRpYWwgfSB9XG5cdCk7XG59XG4iXX0=