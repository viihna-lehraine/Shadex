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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9zdXBlclV0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFTckMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsU0FBUyxnQkFBZ0I7SUFDeEIsSUFBSSxDQUFDO1FBQ0osTUFBTSxvQkFBb0IsR0FDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1FBQy9DLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUM7UUFDeEUsTUFBTSxtQkFBbUIsR0FDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO1FBQzlDLE1BQU0scUJBQXFCLEdBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztRQUNoRCxNQUFNLHFCQUFxQixHQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7UUFDaEQsTUFBTSxzQkFBc0IsR0FDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFB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QUFRLEVBQUUsQ0FBQztnQkFDZixJQUFJLElBQUksQ0FBQyxTQUFTO29CQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixZQUFZLFVBQVUsQ0FBQyxDQUFDO2dCQUV4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUU1QyxPQUFPO1lBQ1IsQ0FBQztZQUVELFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7YUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEtBQWMsRUFBRSxDQUFDLENBQUM7YUFDM0QsSUFBSSxJQUFJLENBQUMsU0FBUztZQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixLQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUF3QjtJQUN2QyxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0NBQ1AsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vc3VwZXJVdGlscy9kb20uanNcblxuaW1wb3J0IHtcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbG9yU3BhY2UsXG5cdENvbW1vblN1cGVyVXRpbHNET00sXG5cdEdlbkJ1dHRvbkFyZ3MsXG5cdEhTTFxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9pbmRleC5qcyc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJy4uL3V0aWxzL2luZGV4LmpzJztcblxuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcblxuZnVuY3Rpb24gZ2V0R2VuQnV0dG9uQXJncygpOiBHZW5CdXR0b25BcmdzIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnBhbGV0dGVOdW1iZXJPcHRpb25zO1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9ucyA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JSYXcgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY3VzdG9tQ29sb3JJbnB1dD8udmFsdWU7XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZW5hYmxlQWxwaGFDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdExpZ2h0bmVzc0NoZWNrYm94O1xuXG5cdFx0aWYgKFxuXHRcdFx0cGFsZXR0ZU51bWJlck9wdGlvbnMgPT09IG51bGwgfHxcblx0XHRcdHBhbGV0dGVUeXBlT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0ZW5hYmxlQWxwaGFDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXREYXJrbmVzc0NoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3ggPT09IG51bGwgfHxcblx0XHRcdGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPT09IG51bGxcblx0XHQpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcignT25lIG9yIG1vcmUgZWxlbWVudHMgYXJlIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBudW1Cb3hlczogJHtwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApfVxcbnBhbGV0dGVUeXBlOiAke3BhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bnVtQm94ZXM6IHBhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRwYWxldHRlVHlwZTogcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JSYXdcblx0XHRcdFx0PyAoY29yZS5iYXNlLnBhcnNlQ3VzdG9tQ29sb3IoY3VzdG9tQ29sb3JSYXcpIGFzIEhTTCB8IG51bGwpXG5cdFx0XHRcdDogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYUNoZWNrYm94LmNoZWNrZWQsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3guY2hlY2tlZFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOiAke2Vycm9yfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hDb2xvclNwYWNlKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveGVzID1cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdCcuY29sb3ItdGV4dC1vdXRwdXQtYm94J1xuXHRcdFx0KTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveGVzLmZvckVhY2goYm94ID0+IHtcblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblxuXHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhY29yZS52YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvclZhbHVlcykpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHQnSW52YWxpZCBjb2xvciB2YWx1ZXMuIENhbm5vdCBkaXNwbGF5IHRvYXN0Lidcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvci4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRGb3JtYXQgPSBpbnB1dEJveC5nZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdkYXRhLWZvcm1hdCdcblx0XHRcdCkgYXMgQ29sb3JTcGFjZTtcblxuXHRcdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRgQ29udmVydGluZyBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBjb252ZXJ0Rm4gPSB1dGlscy5jb252ZXJzaW9uLmdldENvbnZlcnNpb25Gbihcblx0XHRcdFx0Y3VycmVudEZvcm1hdCxcblx0XHRcdFx0dGFyZ2V0Rm9ybWF0XG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIWNvbnZlcnRGbikge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdGBDb252ZXJzaW9uIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH0gaXMgbm90IHN1cHBvcnRlZC5gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gWFlaIHRvIGFub3RoZXIgY29sb3Igc3BhY2UuJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHV0aWxzLmNvbG9yLm5hcnJvd1RvQ29sb3IoY29sb3JWYWx1ZXMpO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFjbG9uZWRDb2xvciB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NMQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzU1ZDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNYWVooY2xvbmVkQ29sb3IpXG5cdFx0XHQpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBTTCwgU1YsIG9yIFhZWiBjb2xvciBzcGFjZXMuIFBsZWFzZSBjb252ZXJ0IHRvIGEgc3VwcG9ydGVkIGZvcm1hdCBmaXJzdC4nXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghY2xvbmVkQ29sb3IpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gKTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbmV3Q29sb3IgPSBjb3JlLmJhc2UuY2xvbmUoY29udmVydEZuKGNsb25lZENvbG9yKSk7XG5cblx0XHRcdGlmICghbmV3Q29sb3IpIHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gKTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXG5cdFx0XHRpbnB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgdGFyZ2V0Rm9ybWF0KTtcblx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9ycy4nKTtcblx0XHRlbHNlIGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHRcdGVsc2UgaWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb206IENvbW1vblN1cGVyVXRpbHNET00gPSB7XG5cdGdldEdlbkJ1dHRvbkFyZ3MsXG5cdHN3aXRjaENvbG9yU3BhY2Vcbn0gYXMgY29uc3Q7XG4iXX0=