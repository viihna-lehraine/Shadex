// File: src/common/superUtils/dom.js
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { utils } from '../utils/index.js';
const mode = data.mode;
function getGenButtonArgs() {
    try {
        const paletteNumberOptions = data.consts.dom.elements.paletteNumberOptions;
        const paletteTypeOptions = data.consts.dom.elements.paletteTypeOptions;
        const customColorRaw = data.consts.dom.elements.customColorElement?.value;
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
            if (mode.errorLogs)
                console.error('One or more elements are null');
            return null;
        }
        if (!mode.quiet)
            console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
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
        if (mode.errorLogs)
            console.error(`Failed to retrieve generateButton parameters: ${error}`);
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
                if (mode.errorLogs)
                    console.error('Invalid color values. Cannot display toast.');
                helpers.dom.showToast('Invalid color.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode.quiet)
                console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (mode.errorLogs)
                    console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                if (mode.errorLogs)
                    console.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (mode.errorLogs)
                    console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                if (mode.errorLogs)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (mode.errorLogs)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        helpers.dom.showToast('Failed to convert colors.');
        if (!mode.quiet)
            console.log('Failed to convert colors.');
        else if (!mode.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (mode.errorLogs)
            console.error(`Failed to convert colors: ${error}`);
    }
}
export const dom = {
    getGenButtonArgs,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFTckMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsU0FBUyxnQkFBZ0I7SUFDeEIsSUFBSSxDQUFDO1FBQ0osTUFBTSxvQkFBb0IsR0FDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1FBQy9DLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZFLE1BQU0sY0FBYyxHQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDO1FBQ3BELE1BQU0sbUJBQW1CLEdBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztRQUM5QyxNQUFNLHFCQUFxQixHQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7UUFDaEQsTUFBTSxxQkFBcUIsR0FDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1FBQ2hELE1BQU0sc0JBQXNCLEdBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFB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UUFBUSxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLENBQUMsU0FBUztvQkFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsWUFBWSxVQUFVLENBQUMsQ0FBQztnQkFFeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFNUMsT0FBTztZQUNSLENBQUM7WUFFRCxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFjLEVBQUUsQ0FBQyxDQUFDO2FBQzNELElBQUksSUFBSSxDQUFDLFNBQVM7WUFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBd0I7SUFDdkMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL3N1cGVyVXRpbHMvZG9tLmpzXG5cbmltcG9ydCB7XG5cdENvbG9ySW5wdXRFbGVtZW50LFxuXHRDb2xvclNwYWNlLFxuXHRDb21tb25TdXBlclV0aWxzRE9NLFxuXHRHZW5CdXR0b25BcmdzLFxuXHRIU0xcbn0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgaGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvaW5kZXguanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICcuLi91dGlscy9pbmRleC5qcyc7XG5cbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmZ1bmN0aW9uIGdldEdlbkJ1dHRvbkFyZ3MoKTogR2VuQnV0dG9uQXJncyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVOdW1iZXJPcHRpb25zID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnMgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yUmF3ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jdXN0b21Db2xvckVsZW1lbnQ/LnZhbHVlO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdGlmIChcblx0XHRcdHBhbGV0dGVOdW1iZXJPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRwYWxldHRlVHlwZU9wdGlvbnMgPT09IG51bGwgfHxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID09PSBudWxsXG5cdFx0KSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoJ09uZSBvciBtb3JlIGVsZW1lbnRzIGFyZSBudWxsJyk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgbnVtQm94ZXM6ICR7cGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKX1cXG5wYWxldHRlVHlwZTogJHtwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKX1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG51bUJveGVzOiBwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApLFxuXHRcdFx0cGFsZXR0ZVR5cGU6IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IGN1c3RvbUNvbG9yUmF3XG5cdFx0XHRcdD8gKGNvcmUuYmFzZS5wYXJzZUN1c3RvbUNvbG9yKGN1c3RvbUNvbG9yUmF3KSBhcyBIU0wgfCBudWxsKVxuXHRcdFx0XHQ6IG51bGwsXG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrbmVzc0NoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXluZXNzQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94LmNoZWNrZWRcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVyczogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3dpdGNoQ29sb3JTcGFjZSh0YXJnZXRGb3JtYXQ6IENvbG9yU3BhY2UpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3hlcyA9XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdFx0XHQnLmNvbG9yLXRleHQtb3V0cHV0LWJveCdcblx0XHRcdCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XG5cdFx0XHRjb25zdCBpbnB1dEJveCA9IGJveCBhcyBDb2xvcklucHV0RWxlbWVudDtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWVzID0gaW5wdXRCb3guY29sb3JWYWx1ZXM7XG5cblx0XHRcdGlmICghY29sb3JWYWx1ZXMgfHwgIWNvcmUudmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3JWYWx1ZXMpKSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0J0ludmFsaWQgY29sb3IgdmFsdWVzLiBDYW5ub3QgZGlzcGxheSB0b2FzdC4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjdXJyZW50Rm9ybWF0ID0gaW5wdXRCb3guZ2V0QXR0cmlidXRlKFxuXHRcdFx0XHQnZGF0YS1mb3JtYXQnXG5cdFx0XHQpIGFzIENvbG9yU3BhY2U7XG5cblx0XHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdFx0YENvbnZlcnRpbmcgZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fWBcblx0XHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgY29udmVydEZuID0gdXRpbHMuY29udmVyc2lvbi5nZXRDb252ZXJzaW9uRm4oXG5cdFx0XHRcdGN1cnJlbnRGb3JtYXQsXG5cdFx0XHRcdHRhcmdldEZvcm1hdFxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCFjb252ZXJ0Rm4pIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHRgQ29udmVyc2lvbiBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9IGlzIG5vdCBzdXBwb3J0ZWQuYFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29sb3JWYWx1ZXMuZm9ybWF0ID09PSAneHl6Jykge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB1dGlscy5jb2xvci5uYXJyb3dUb0NvbG9yKGNvbG9yVmFsdWVzKTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhY2xvbmVkQ29sb3IgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTTENvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NWQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzWFlaKGNsb25lZENvbG9yKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gU0wsIFNWLCBvciBYWVogY29sb3Igc3BhY2VzLiBQbGVhc2UgY29udmVydCB0byBhIHN1cHBvcnRlZCBmb3JtYXQgZmlyc3QuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWNsb25lZENvbG9yKSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZS5iYXNlLmNsb25lKGNvbnZlcnRGbihjbG9uZWRDb2xvcikpO1xuXG5cdFx0XHRpZiAoIW5ld0NvbG9yKSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlucHV0Qm94LnZhbHVlID0gU3RyaW5nKG5ld0NvbG9yKTtcblxuXHRcdFx0aW5wdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIHRhcmdldEZvcm1hdCk7XG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyk7XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY29udmVydCBjb2xvcnMuJyk7XG5cdFx0ZWxzZSBpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjb252ZXJ0IGNvbG9yczogJHtlcnJvciBhcyBFcnJvcn1gKTtcblx0XHRlbHNlIGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb252ZXJ0IGNvbG9yczogJHtlcnJvciBhcyBFcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgZG9tOiBDb21tb25TdXBlclV0aWxzRE9NID0ge1xuXHRnZXRHZW5CdXR0b25BcmdzLFxuXHRzd2l0Y2hDb2xvclNwYWNlXG59IGFzIGNvbnN0O1xuIl19