// File: src/common/superUtils/dom.js
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { log } from '../../classes/logger/index.js';
import { utils } from '../utils/index.js';
const mode = data.mode;
const logMode = data.mode.logging;
function getGenButtonArgs() {
    try {
        const paletteNumberOptions = data.consts.dom.elements.paletteNumberOptions;
        const paletteTypeOptions = data.consts.dom.elements.paletteTypeOptions;
        const customColorRaw = data.consts.dom.elements.customColorInput?.value;
        const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
        const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitDarknessCheckbox === null ||
            limitGraynessCheckbox === null ||
            limitLightnessCheckbox === null) {
            if (logMode.errors)
                log.error('One or more elements are null');
            return null;
        }
        if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
            log.info(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? core.base.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitDarkness: limitDarknessCheckbox.checked,
            limitGrayness: limitGraynessCheckbox.checked,
            limitLightness: limitLightnessCheckbox.checked
        };
    }
    catch (error) {
        if (logMode.errors)
            log.error(`Failed to retrieve generateButton parameters: ${error}`);
        return null;
    }
}
function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !core.validate.colorValues(colorValues)) {
                if (logMode.errors)
                    log.error('Invalid color values. Cannot display toast.');
                helpers.dom.showToast('Invalid color.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
                log.info(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (logMode.errors)
                    log.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                if (logMode.errors)
                    log.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (logMode.verbosity >= 3 && logMode.errors)
                    log.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                if (logMode.errors)
                    log.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (logMode.errors)
                    log.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        helpers.dom.showToast('Failed to convert colors.');
        if (!mode.quiet && logMode.warnings)
            log.warning('Failed to convert colors.');
        else if (!mode.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (logMode.errors)
            log.error(`Failed to convert colors: ${error}`);
    }
}
export const dom = {
    getGenButtonArgs,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFTckMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRWxDLFNBQVMsZ0JBQWdCO0lBQ3hCLElBQUksQ0FBQztRQUNKLE1BQU0sb0JBQW9CLEdBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztRQUMvQyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztRQUN2RSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO1FBQ3hFLE1BQU0sbUJBQW1CLEdBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztRQUM5QyxNQUFNLHFCQUFxQixHQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7UUFDaEQsTUFBTSxxQkFBcUIsR0FDMUIsSUFBSSxDQUFDLE1BQU0s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QUFNLEdBQUcsR0FBd0I7SUFDdkMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL3N1cGVyVXRpbHMvZG9tLmpzXG5cbmltcG9ydCB7XG5cdENvbG9ySW5wdXRFbGVtZW50LFxuXHRDb2xvclNwYWNlLFxuXHRDb21tb25TdXBlclV0aWxzRE9NLFxuXHRHZW5CdXR0b25BcmdzLFxuXHRIU0xcbn0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgaGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuLi91dGlscy9pbmRleC5qcyc7XG5cbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5jb25zdCBsb2dNb2RlID0gZGF0YS5tb2RlLmxvZ2dpbmc7XG5cbmZ1bmN0aW9uIGdldEdlbkJ1dHRvbkFyZ3MoKTogR2VuQnV0dG9uQXJncyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVOdW1iZXJPcHRpb25zID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnMgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yUmF3ID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmN1c3RvbUNvbG9ySW5wdXQ/LnZhbHVlO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdGlmIChcblx0XHRcdHBhbGV0dGVOdW1iZXJPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRwYWxldHRlVHlwZU9wdGlvbnMgPT09IG51bGwgfHxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID09PSBudWxsXG5cdFx0KSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIGxvZy5lcnJvcignT25lIG9yIG1vcmUgZWxlbWVudHMgYXJlIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUuaW5mbyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+PSAyKVxuXHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdGBudW1Cb3hlczogJHtwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApfVxcbnBhbGV0dGVUeXBlOiAke3BhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bnVtQm94ZXM6IHBhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRwYWxldHRlVHlwZTogcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JSYXdcblx0XHRcdFx0PyAoY29yZS5iYXNlLnBhcnNlQ3VzdG9tQ29sb3IoY3VzdG9tQ29sb3JSYXcpIGFzIEhTTCB8IG51bGwpXG5cdFx0XHRcdDogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYUNoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3guY2hlY2tlZFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0bG9nLmVycm9yKGBGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVyczogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN3aXRjaENvbG9yU3BhY2UodGFyZ2V0Rm9ybWF0OiBDb2xvclNwYWNlKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94ZXMuZm9yRWFjaChib3ggPT4ge1xuXHRcdFx0Y29uc3QgaW5wdXRCb3ggPSBib3ggYXMgQ29sb3JJbnB1dEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGlucHV0Qm94LmNvbG9yVmFsdWVzO1xuXG5cdFx0XHRpZiAoIWNvbG9yVmFsdWVzIHx8ICFjb3JlLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKSkge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nLmVycm9yKCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4gQ2Fubm90IGRpc3BsYXkgdG9hc3QuJyk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0KSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS5pbmZvICYmIGxvZ01vZGUudmVyYm9zaXR5ID49IDIpXG5cdFx0XHRcdGxvZy5pbmZvKGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gKTtcblxuXHRcdFx0Y29uc3QgY29udmVydEZuID0gdXRpbHMuY29udmVyc2lvbi5nZXRDb252ZXJzaW9uRm4oXG5cdFx0XHRcdGN1cnJlbnRGb3JtYXQsXG5cdFx0XHRcdHRhcmdldEZvcm1hdFxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFjb252ZXJ0Rm4pIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH0gaXMgbm90IHN1cHBvcnRlZC5gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBYWVogdG8gYW5vdGhlciBjb2xvciBzcGFjZS4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gdXRpbHMuY29sb3IubmFycm93VG9Db2xvcihjb2xvclZhbHVlcyk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IWNsb25lZENvbG9yIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzU0xDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTVkNvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1hZWihjbG9uZWRDb2xvcilcblx0XHRcdCkge1xuXHRcdFx0XHRpZiAobG9nTW9kZS52ZXJib3NpdHkgPj0gMyAmJiBsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBTTCwgU1YsIG9yIFhZWiBjb2xvciBzcGFjZXMuIFBsZWFzZSBjb252ZXJ0IHRvIGEgc3VwcG9ydGVkIGZvcm1hdCBmaXJzdC4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghY2xvbmVkQ29sb3IpIHtcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZy5lcnJvcihgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmApO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdDb2xvciA9IGNvcmUuYmFzZS5jbG9uZShjb252ZXJ0Rm4oY2xvbmVkQ29sb3IpKTtcblxuXHRcdFx0aWYgKCFuZXdDb2xvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdFx0bG9nLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlucHV0Qm94LnZhbHVlID0gU3RyaW5nKG5ld0NvbG9yKTtcblxuXHRcdFx0aW5wdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIHRhcmdldEZvcm1hdCk7XG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuaW5ncylcblx0XHRcdGxvZy53YXJuaW5nKCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyk7XG5cdFx0ZWxzZSBpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjb252ZXJ0IGNvbG9yczogJHtlcnJvciBhcyBFcnJvcn1gKTtcblx0XHRlbHNlIGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdGxvZy5lcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb206IENvbW1vblN1cGVyVXRpbHNET00gPSB7XG5cdGdldEdlbkJ1dHRvbkFyZ3MsXG5cdHN3aXRjaENvbG9yU3BhY2Vcbn0gYXMgY29uc3Q7XG4iXX0=