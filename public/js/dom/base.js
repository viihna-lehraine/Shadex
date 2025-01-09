// File: src/dom/base.js
import { convert } from '../common/convert/index.js';
import { core, helpers, utils } from '../common/index.js';
import { data } from '../data/index.js';
const mode = data.mode;
function applyCustomColor() {
    try {
        const colorPicker = document.getElementById('custom-color-picker');
        if (!colorPicker) {
            throw new Error('Color picker element not found');
        }
        const rawValue = colorPicker.value.trim();
        const selectedFormat = document.getElementById('custom-color-format')?.value;
        if (!utils.color.isColorSpace(selectedFormat)) {
            if (!mode.gracefulErrors)
                throw new Error(`Unsupported color format: ${selectedFormat}`);
        }
        const parsedColor = utils.color.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            if (!mode.gracefulErrors)
                throw new Error(`Invalid color value: ${rawValue}`);
        }
        const hslColor = utils.color.isHSLColor(parsedColor)
            ? parsedColor
            : convert.toHSL(parsedColor);
        return hslColor;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return utils.random.hsl(false);
    }
}
function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            if (mode.errorLogs)
                console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = core.convert.toCSSColorString(color);
        if (!formatColorString) {
            if (mode.errorLogs)
                console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        utils.palette.populateOutputBox(color, 1);
        return color;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to apply first color to UI: ${error}`);
        return utils.random.hsl(false);
    }
}
function copyToClipboard(text, tooltipElement) {
    try {
        const colorValue = text.replace('Copied to clipboard!', '').trim();
        navigator.clipboard
            .writeText(colorValue)
            .then(() => {
            helpers.dom.showTooltip(tooltipElement);
            if (!mode.quiet)
                console.log(`Copied color value: ${colorValue}`);
            setTimeout(() => tooltipElement.classList.remove('show'), data.consts.timeouts.tooltip || 1000);
        })
            .catch(err => {
            if (mode.errorLogs)
                console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to copy to clipboard: ${error}`);
        else if (!mode.quiet)
            console.error('Failed to copy to clipboard');
    }
}
function defineUIElements() {
    try {
        const advancedMenuButton = data.consts.dom.elements.advancedMenuButton;
        const applyCustomColorButton = data.consts.dom.elements.applyCustomColorButton;
        const clearCustomColorButton = data.consts.dom.elements.clearCustomColorButton;
        const closeCustomColorMenuButton = data.consts.dom.elements.closeCustomColorMenuButton;
        const closeHelpMenuButton = data.consts.dom.elements.closeHelpMenuButton;
        const closeHistoryMenuButton = data.consts.dom.elements.closeHistoryMenuButton;
        const desaturateButton = data.consts.dom.elements.desaturateButton;
        const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
        const generateButton = data.consts.dom.elements.generateButton;
        const helpMenuButton = data.consts.dom.elements.helpMenuButton;
        const historyMenuButton = data.consts.dom.elements.historyMenuButton;
        const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
        const saturateButton = data.consts.dom.elements.saturateButton;
        const selectedColorOption = data.consts.dom.elements.selectedColorOption;
        const showAsCMYKButton = data.consts.dom.elements.showAsCMYKButton;
        const showAsHexButton = data.consts.dom.elements.showAsHexButton;
        const showAsHSLButton = data.consts.dom.elements.showAsHSLButton;
        const showAsHSVButton = data.consts.dom.elements.showAsHSVButton;
        const showAsLABButton = data.consts.dom.elements.showAsLABButton;
        const showAsRGBButton = data.consts.dom.elements.showAsRGBButton;
        const selectedColor = selectedColorOption
            ? parseInt(selectedColorOption.value, 10)
            : 0;
        return {
            advancedMenuButton,
            applyCustomColorButton,
            clearCustomColorButton,
            closeCustomColorMenuButton,
            closeHelpMenuButton,
            closeHistoryMenuButton,
            desaturateButton,
            enableAlphaCheckbox,
            generateButton,
            helpMenuButton,
            historyMenuButton,
            limitDarknessCheckbox,
            limitGraynessCheckbox,
            limitLightnessCheckbox,
            saturateButton,
            selectedColor,
            showAsCMYKButton,
            showAsHexButton,
            showAsHSLButton,
            showAsHSVButton,
            showAsLABButton,
            showAsRGBButton
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to define UI buttons: ${error}.`);
        if (!mode.quiet)
            console.error('Failed to define UI buttons.');
        return {
            advancedMenuButton: null,
            applyCustomColorButton: null,
            clearCustomColorButton: null,
            closeCustomColorMenuButton: null,
            closeHelpMenuButton: null,
            closeHistoryMenuButton: null,
            desaturateButton: null,
            enableAlphaCheckbox: null,
            generateButton: null,
            helpMenuButton: null,
            historyMenuButton: null,
            limitDarknessCheckbox: null,
            limitLightnessCheckbox: null,
            limitGraynessCheckbox: null,
            saturateButton: null,
            selectedColor: 0,
            showAsCMYKButton: null,
            showAsHexButton: null,
            showAsHSLButton: null,
            showAsHSVButton: null,
            showAsLABButton: null,
            showAsRGBButton: null
        };
    }
}
function desaturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to desaturate color: ${error}`);
    }
}
function getElementsForSelectedColor(selectedColor) {
    const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    if (!selectedColorBox) {
        if (mode.warnLogs)
            console.warn(`Element not found for color ${selectedColor}`);
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
async function initializeUI() {
    console.log('Initializing UI with dynamically loaded elements');
    const buttons = defineUIElements();
    if (!buttons) {
        console.error('Failed to initialize UI buttons');
        return;
    }
    buttons.applyCustomColorButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('applyCustomColorButton clicked');
        // *DEV-NOTE* add logic here...
    });
}
function pullParamsFromUI() {
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
            numBoxes: numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0,
            enableAlpha: enableAlphaCheckbox?.checked || false,
            limitDarkness: limitDarknessCheckbox?.checked || false,
            limitGrayness: limitGraynessCheckbox?.checked || false,
            limitLightness: limitLightnessCheckbox?.checked || false
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to pull parameters from UI: ${error}`);
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
function saturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Failed to saturate color: ${error}`);
    }
}
export const base = {
    applyCustomColor,
    applyFirstColorToUI,
    copyToClipboard,
    defineUIElements,
    desaturateColor,
    getElementsForSelectedColor,
    initializeUI,
    pullParamsFromUI,
    saturateColor
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFheEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUV4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLFNBQVMsZ0JBQWdCO0lBQ3hCLElBQUksQ0FBQztRQUNKLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQzFDLHFCQUFxQixDQUNNLENBQUM7UUFFN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxNQUFNLGNBQWMsR0FDbkIsUUFBUSxDQUFDLGNBQWMsQ0FDdEIscUJBQXFCLENBRXRCLEVBQUUsS0FBbUIsQ0FBQztRQUV2QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7Z0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUN6QyxjQUFjLEVBQ2QsUUFBUSxDQUNtQixDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMs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LENBQUMsS0FBSyxDQUFDLDZCQUE2QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUF1QjtJQUN2QyxnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLDJCQUEyQjtJQUMzQixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGFBQWE7Q0FDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2RvbS9iYXNlLmpzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvclNwYWNlLFxuXHRET01CYXNlRm5JbnRlcmZhY2UsXG5cdEdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcixcblx0SFNMLFxuXHRQdWxsUGFyYW1zRnJvbVVJLFxuXHRTTCxcblx0U1YsXG5cdFVJRWxlbWVudHNcbn0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29udmVydCB9IGZyb20gJy4uL2NvbW1vbi9jb252ZXJ0L2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmUsIGhlbHBlcnMsIHV0aWxzIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhL2luZGV4LmpzJztcblxuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcblxuZnVuY3Rpb24gYXBwbHlDdXN0b21Db2xvcigpOiBIU0wge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKCFjb2xvclBpY2tlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHR9XG5cblx0XHRjb25zdCByYXdWYWx1ZSA9IGNvbG9yUGlja2VyLnZhbHVlLnRyaW0oKTtcblx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLWZvcm1hdCdcblx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0KT8udmFsdWUgYXMgQ29sb3JTcGFjZTtcblxuXHRcdGlmICghdXRpbHMuY29sb3IuaXNDb2xvclNwYWNlKHNlbGVjdGVkRm9ybWF0KSkge1xuXHRcdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHV0aWxzLmNvbG9yLnBhcnNlQ29sb3IoXG5cdFx0XHRzZWxlY3RlZEZvcm1hdCxcblx0XHRcdHJhd1ZhbHVlXG5cdFx0KSBhcyBFeGNsdWRlPENvbG9yLCBTTCB8IFNWPjtcblxuXHRcdGlmICghcGFyc2VkQ29sb3IpIHtcblx0XHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGhzbENvbG9yID0gdXRpbHMuY29sb3IuaXNIU0xDb2xvcihwYXJzZWRDb2xvcilcblx0XHRcdD8gcGFyc2VkQ29sb3Jcblx0XHRcdDogY29udmVydC50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRyZXR1cm4gaHNsQ29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBhcHBseSBjdXN0b20gY29sb3I6ICR7ZXJyb3J9LiBSZXR1cm5pbmcgcmFuZG9tbHkgZ2VuZXJhdGVkIGhleCBjb2xvcmBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gdXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Rmlyc3RDb2xvclRvVUkoY29sb3I6IEhTTCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JCb3gxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLWJveC0xJyk7XG5cblx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKCdjb2xvci1ib3gtMSBpcyBudWxsJyk7XG5cblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9IGNvcmUuY29udmVydC50b0NTU0NvbG9yU3RyaW5nKGNvbG9yKTtcblxuXHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyk7XG5cblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb2xvckJveDEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZm9ybWF0Q29sb3JTdHJpbmc7XG5cblx0XHR1dGlscy5wYWxldHRlLnBvcHVsYXRlT3V0cHV0Qm94KGNvbG9yLCAxKTtcblxuXHRcdHJldHVybiBjb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gYXBwbHkgZmlyc3QgY29sb3IgdG8gVUk6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gdXRpbHMucmFuZG9tLmhzbChmYWxzZSkgYXMgSFNMO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvcHlUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcsIHRvb2x0aXBFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yVmFsdWUgPSB0ZXh0LnJlcGxhY2UoJ0NvcGllZCB0byBjbGlwYm9hcmQhJywgJycpLnRyaW0oKTtcblxuXHRcdG5hdmlnYXRvci5jbGlwYm9hcmRcblx0XHRcdC53cml0ZVRleHQoY29sb3JWYWx1ZSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQpO1xuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYENvcGllZCBjb2xvciB2YWx1ZTogJHtjb2xvclZhbHVlfWApO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0KCkgPT4gdG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0XHRcdGRhdGEuY29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6JywgZXJyKTtcblx0XHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gKTtcblx0XHRlbHNlIGlmICghbW9kZS5xdWlldCkgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lVUlFbGVtZW50cygpOiBVSUVsZW1lbnRzIHtcblx0dHJ5IHtcblx0XHRjb25zdCBhZHZhbmNlZE1lbnVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuYWR2YW5jZWRNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmFwcGx5Q3VzdG9tQ29sb3JCdXR0b247XG5cdFx0Y29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xlYXJDdXN0b21Db2xvckJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VIZWxwTWVudUJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xvc2VIZWxwTWVudUJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZUhpc3RvcnlNZW51QnV0dG9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jbG9zZUhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGRlc2F0dXJhdGVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZGVzYXR1cmF0ZUJ1dHRvbjtcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGdlbmVyYXRlQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmdlbmVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IGhlbHBNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGhpc3RvcnlNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0R3JheW5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3Qgc2F0dXJhdGVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2F0dXJhdGVCdXR0b247XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvck9wdGlvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2VsZWN0ZWRDb2xvck9wdGlvbjtcblx0XHRjb25zdCBzaG93QXNDTVlLQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0NNWUtCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSGV4QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0hleEJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIU0xCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzSFNMQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hTVkJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNIU1ZCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzTEFCQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0xBQkJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNSR0JCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzUkdCQnV0dG9uO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHRcdD8gcGFyc2VJbnQoc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0XHQ6IDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWR2YW5jZWRNZW51QnV0dG9uLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbixcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3gsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbixcblx0XHRcdGhlbHBNZW51QnV0dG9uLFxuXHRcdFx0aGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3gsXG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3gsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94LFxuXHRcdFx0c2F0dXJhdGVCdXR0b24sXG5cdFx0XHRzZWxlY3RlZENvbG9yLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbixcblx0XHRcdHNob3dBc0hleEJ1dHRvbixcblx0XHRcdHNob3dBc0hTTEJ1dHRvbixcblx0XHRcdHNob3dBc0hTVkJ1dHRvbixcblx0XHRcdHNob3dBc0xBQkJ1dHRvbixcblx0XHRcdHNob3dBc1JHQkJ1dHRvblxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlZmluZSBVSSBidXR0b25zOiAke2Vycm9yfS5gKTtcblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9ucy4nKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRhZHZhbmNlZE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VIZWxwTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRkZXNhdHVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0ZW5hYmxlQWxwaGFDaGVja2JveDogbnVsbCxcblx0XHRcdGdlbmVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0aGVscE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRoaXN0b3J5TWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveDogbnVsbCxcblx0XHRcdGxpbWl0TGlnaHRuZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3I6IDAsXG5cdFx0XHRzaG93QXNDTVlLQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSGV4QnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSFNMQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSFNWQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzTEFCQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzUkdCQnV0dG9uOiBudWxsXG5cdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZXNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBkZXNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihcblx0c2VsZWN0ZWRDb2xvcjogbnVtYmVyXG4pOiBHZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ige1xuXHRjb25zdCBzZWxlY3RlZENvbG9yQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0YGNvbG9yLWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHQpO1xuXG5cdGlmICghc2VsZWN0ZWRDb2xvckJveCkge1xuXHRcdGlmIChtb2RlLndhcm5Mb2dzKVxuXHRcdFx0Y29uc29sZS53YXJuKGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdQbGVhc2Ugc2VsZWN0IGEgdmFsaWQgY29sb3IuJyk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogbnVsbFxuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpLFxuXHRcdHNlbGVjdGVkQ29sb3JCb3gsXG5cdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3Itc3RyaXBlLSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KVxuXHR9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplVUkoKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgVUkgd2l0aCBkeW5hbWljYWxseSBsb2FkZWQgZWxlbWVudHMnKTtcblx0Y29uc3QgYnV0dG9ucyA9IGRlZmluZVVJRWxlbWVudHMoKTtcblxuXHRpZiAoIWJ1dHRvbnMpIHtcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBVSSBidXR0b25zJyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9ucy5hcHBseUN1c3RvbUNvbG9yQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGUgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRjb25zb2xlLmxvZygnYXBwbHlDdXN0b21Db2xvckJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0Ly8gKkRFVi1OT1RFKiBhZGQgbG9naWMgaGVyZS4uLlxuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHVsbFBhcmFtc0Zyb21VSSgpOiBQdWxsUGFyYW1zRnJvbVVJIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5wYWxldHRlVHlwZU9wdGlvbnM7XG5cdFx0Y29uc3QgbnVtQm94ZXNFbGVtZW50ID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnBhbGV0dGVOdW1iZXJPcHRpb25zO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwYWxldHRlVHlwZTogcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudFxuXHRcdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHQ6IDAsXG5cdFx0XHRudW1Cb3hlczogbnVtQm94ZXNFbGVtZW50ID8gcGFyc2VJbnQobnVtQm94ZXNFbGVtZW50LnZhbHVlLCAxMCkgOiAwLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXluZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodG5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZVxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHB1bGwgcGFyYW1ldGVycyBmcm9tIFVJOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiAwLFxuXHRcdFx0bnVtQm94ZXM6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYmFzZTogRE9NQmFzZUZuSW50ZXJmYWNlID0ge1xuXHRhcHBseUN1c3RvbUNvbG9yLFxuXHRhcHBseUZpcnN0Q29sb3JUb1VJLFxuXHRjb3B5VG9DbGlwYm9hcmQsXG5cdGRlZmluZVVJRWxlbWVudHMsXG5cdGRlc2F0dXJhdGVDb2xvcixcblx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRpbml0aWFsaXplVUksXG5cdHB1bGxQYXJhbXNGcm9tVUksXG5cdHNhdHVyYXRlQ29sb3Jcbn0gYXMgY29uc3Q7XG4iXX0=