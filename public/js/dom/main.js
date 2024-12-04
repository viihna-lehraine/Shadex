// File: src/dom/main.ts
import { config } from '../config.js';
import { core, helpers, utils } from '../common.js';
import { paletteUtils } from '../palette/utils.js';
export function addConversionButtonEventListeners() {
    try {
        const addListener = (id, colorSpace) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => switchColorSpace(colorSpace));
            }
            else {
                console.warn(`Element with id "${id}" not found.`);
            }
        };
        addListener('show-as-cmyk-button', 'cmyk');
        addListener('show-as-hex-button', 'hex');
        addListener('show-as-hsl-button', 'hsl');
        addListener('show-as-hsv-button', 'hsv');
        addListener('show-as-lab-button', 'lab');
        addListener('show-as-rgb-button', 'rgb');
    }
    catch (error) {
        console.error(`Failed to add event listeners to conversion buttons: ${error}`);
        return;
    }
}
export function applyCustomColor() {
    try {
        const colorPicker = document.getElementById('custom-color-picker');
        if (!colorPicker) {
            throw new Error('Color picker element not found');
        }
        const rawValue = colorPicker.value.trim();
        const selectedFormat = document.getElementById('custom-color-format')?.value;
        if (!utils.color.isColorSpace(selectedFormat)) {
            throw new Error(`Unsupported color format: ${selectedFormat}`);
        }
        const parsedColor = utils.color.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            throw new Error(`Invalid color value: ${rawValue}`);
        }
        const hslColor = utils.color.isHSLColor(parsedColor)
            ? parsedColor
            : paletteUtils.toHSL(parsedColor);
        return hslColor;
    }
    catch (error) {
        console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return utils.random.hsl(false);
    }
}
export function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = core.getCSSColorString(color);
        if (!formatColorString) {
            console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        utils.palette.populateOutputBox(color, 1);
        return color;
    }
    catch (error) {
        console.error(`Failed to apply first color to UI: ${error}`);
        return utils.random.hsl(false);
    }
}
export function copyToClipboard(text, tooltipElement) {
    try {
        const colorValue = text.replace('Copied to clipboard!', '').trim();
        navigator.clipboard
            .writeText(colorValue)
            .then(() => {
            helpers.dom.showTooltip(tooltipElement);
            console.log(`Copied color value: ${colorValue}`);
            setTimeout(() => tooltipElement.classList.remove('show'), config.consts.timeouts.tooltip || 1000);
        })
            .catch(err => {
            console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        console.error(`Failed to copy to clipboard: ${error}`);
    }
}
export function defineUIElements() {
    try {
        const advancedMenuButton = config.consts.dom.advancedMenuButton;
        const applyCustomColorButton = config.consts.dom.applyCustomColorButton;
        const clearCustomColorButton = config.consts.dom.clearCustomColorButton;
        const closeCustomColorMenuButton = config.consts.dom.closeCustomColorMenuButton;
        const closeHelpMenuButton = config.consts.dom.closeHelpMenuButton;
        const closeHistoryMenuButton = config.consts.dom.closeHistoryMenuButton;
        const desaturateButton = config.consts.dom.desaturateButton;
        const enableAlphaCheckbox = config.consts.dom.enableAlphaCheckbox;
        const generateButton = config.consts.dom.generateButton;
        const helpMenuButton = config.consts.dom.helpMenuButton;
        const historyMenuButton = config.consts.dom.historyMenuButton;
        const limitDarknessCheckbox = config.consts.dom.limitDarknessCheckbox;
        const limitGraynessCheckbox = config.consts.dom.limitGraynessCheckbox;
        const limitLightnessCheckbox = config.consts.dom.limitLightnessCheckbox;
        const saturateButton = config.consts.dom.saturateButton;
        const selectedColorOption = config.consts.dom.selectedColorOption;
        const showAsCMYKButton = config.consts.dom.showAsCMYKButton;
        const showAsHexButton = config.consts.dom.showAsHexButton;
        const showAsHSLButton = config.consts.dom.showAsHSLButton;
        const showAsHSVButton = config.consts.dom.showAsHSVButton;
        const showAsLABButton = config.consts.dom.showAsLABButton;
        const showAsRGBButton = config.consts.dom.showAsRGBButton;
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
        console.error('Failed to define UI buttons:', error);
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
export function desaturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        console.error(`Failed to desaturate color: ${error}`);
    }
}
export function getElementsForSelectedColor(selectedColor) {
    const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    if (!selectedColorBox) {
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
export function pullParamsFromUI() {
    try {
        const paletteTypeOptionsElement = config.consts.dom.paletteTypeOptions;
        const numBoxesElement = config.consts.dom.paletteNumberOptions;
        const enableAlphaCheckbox = config.consts.dom.enableAlphaCheckbox;
        const limitDarknessCheckbox = config.consts.dom.limitDarknessCheckbox;
        const limitGraynessCheckbox = config.consts.dom.limitGraynessCheckbox;
        const limitLightnessCheckbox = config.consts.dom.limitLightnessCheckbox;
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
export function saturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        console.error(`Failed to saturate color: ${error}`);
    }
}
export function showCustomColorPopupDiv() {
    try {
        const popup = document.getElementById('popup-div');
        if (popup) {
            popup.classList.toggle('show');
        }
        else {
            console.error("document.getElementById('popup-div') is undefined");
            return;
        }
    }
    catch (error) {
        console.error(`Failed to show custom color popup div: ${error}`);
    }
}
export function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !core.validateColorValues(colorValues)) {
                console.error('Invalid color values.');
                helpers.dom.showToast('Invalid color values.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                console.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.clone(convertFn(clonedColor));
            if (!newColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        throw new Error(`Failed to convert colors: ${error}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFheEIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE1BQU0sVUFBVSxpQ0FBaUM7SUFDaEQsSUFBSSxDQUFDO1FBQ0osTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFVLEVBQUUsVUFBc0IsRUFBRSxFQUFFO1lBQzFELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ3JDLEVBQUUsQ0FDMEIsQ0FBQztZQUU5QixJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQ3JDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUM1QixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDcEQsQ0FBQztRQUNGLENBQUMsQ0FBQztRQUVGLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFBQyxP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aEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsS0FBYyxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vbWFpbi50c1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JJbnB1dEVsZW1lbnQsXG5cdENvbG9yU3BhY2UsXG5cdEdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcixcblx0SFNMLFxuXHRQdWxsUGFyYW1zRnJvbVVJLFxuXHRTTCxcblx0U1YsXG5cdFVJRWxlbWVudHNcbn0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IGNvcmUsIGhlbHBlcnMsIHV0aWxzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IHBhbGV0dGVVdGlscyB9IGZyb20gJy4uL3BhbGV0dGUvdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29udmVyc2lvbkJ1dHRvbkV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkZExpc3RlbmVyID0gKGlkOiBzdHJpbmcsIGNvbG9yU3BhY2U6IENvbG9yU3BhY2UpID0+IHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRpZFxuXHRcdFx0KSBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmIChidXR0b24pIHtcblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cblx0XHRcdFx0XHRzd2l0Y2hDb2xvclNwYWNlKGNvbG9yU3BhY2UpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1jbXlrLWJ1dHRvbicsICdjbXlrJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtaGV4LWJ1dHRvbicsICdoZXgnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1oc2wtYnV0dG9uJywgJ2hzbCcpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWhzdi1idXR0b24nLCAnaHN2Jyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtbGFiLWJ1dHRvbicsICdsYWInKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1yZ2ItYnV0dG9uJywgJ3JnYicpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgRmFpbGVkIHRvIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gY29udmVyc2lvbiBidXR0b25zOiAke2Vycm9yfWBcblx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUN1c3RvbUNvbG9yKCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdjdXN0b20tY29sb3ItcGlja2VyJ1xuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yUGlja2VyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIHBpY2tlciBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJhd1ZhbHVlID0gY29sb3JQaWNrZXIudmFsdWUudHJpbSgpO1xuXHRcdGNvbnN0IHNlbGVjdGVkRm9ybWF0ID0gKFxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdCdjdXN0b20tY29sb3ItZm9ybWF0J1xuXHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGxcblx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0aWYgKCF1dGlscy5jb2xvci5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHV0aWxzLmNvbG9yLnBhcnNlQ29sb3IoXG5cdFx0XHRzZWxlY3RlZEZvcm1hdCxcblx0XHRcdHJhd1ZhbHVlXG5cdFx0KSBhcyBFeGNsdWRlPENvbG9yLCBTTCB8IFNWPjtcblxuXHRcdGlmICghcGFyc2VkQ29sb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBoc2xDb2xvciA9IHV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHQ/IHBhcnNlZENvbG9yXG5cdFx0XHQ6IHBhbGV0dGVVdGlscy50b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRyZXR1cm4gaHNsQ29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgXG5cdFx0KTtcblxuXHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Rmlyc3RDb2xvclRvVUkoY29sb3I6IEhTTCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JCb3gxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLWJveC0xJyk7XG5cblx0XHRpZiAoIWNvbG9yQm94MSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignY29sb3ItYm94LTEgaXMgbnVsbCcpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPSBjb3JlLmdldENTU0NvbG9yU3RyaW5nKGNvbG9yKTtcblxuXHRcdGlmICghZm9ybWF0Q29sb3JTdHJpbmcpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1VuZXhwZWN0ZWQgb3IgdW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0LicpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0dXRpbHMucGFsZXR0ZS5wb3B1bGF0ZU91dHB1dEJveChjb2xvciwgMSk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHV0aWxzLnJhbmRvbS5oc2woZmFsc2UpIGFzIEhTTDtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKFxuXHR0ZXh0OiBzdHJpbmcsXG5cdHRvb2x0aXBFbGVtZW50OiBIVE1MRWxlbWVudFxuKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gKTtcblxuXHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdCgpID0+IHRvb2x0aXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSxcblx0XHRcdFx0XHRjb25maWcuY29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBjb3B5aW5nIHRvIGNsaXBib2FyZDonLCBlcnIpO1xuXHRcdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVVSUVsZW1lbnRzKCk6IFVJRWxlbWVudHMge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkdmFuY2VkTWVudUJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLmFkdmFuY2VkTWVudUJ1dHRvbjtcblxuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5hcHBseUN1c3RvbUNvbG9yQnV0dG9uO1xuXG5cdFx0Y29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLmNsZWFyQ3VzdG9tQ29sb3JCdXR0b247XG5cblx0XHRjb25zdCBjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbiA9XG5cdFx0XHRjb25maWcuY29uc3RzLmRvbS5jbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbjtcblxuXHRcdGNvbnN0IGNsb3NlSGVscE1lbnVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5jbG9zZUhlbHBNZW51QnV0dG9uO1xuXG5cdFx0Y29uc3QgY2xvc2VIaXN0b3J5TWVudUJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLmNsb3NlSGlzdG9yeU1lbnVCdXR0b247XG5cblx0XHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uZGVzYXR1cmF0ZUJ1dHRvbjtcblxuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXG5cdFx0Y29uc3QgZ2VuZXJhdGVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5nZW5lcmF0ZUJ1dHRvbjtcblxuXHRcdGNvbnN0IGhlbHBNZW51QnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uaGVscE1lbnVCdXR0b247XG5cblx0XHRjb25zdCBoaXN0b3J5TWVudUJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLmhpc3RvcnlNZW51QnV0dG9uO1xuXG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID0gY29uZmlnLmNvbnN0cy5kb20ubGltaXREYXJrbmVzc0NoZWNrYm94O1xuXG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID0gY29uZmlnLmNvbnN0cy5kb20ubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRjb25zdCBzYXR1cmF0ZUJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNhdHVyYXRlQnV0dG9uO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvck9wdGlvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNlbGVjdGVkQ29sb3JPcHRpb247XG5cblx0XHRjb25zdCBzaG93QXNDTVlLQnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uc2hvd0FzQ01ZS0J1dHRvbjtcblxuXHRcdGNvbnN0IHNob3dBc0hleEJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNob3dBc0hleEJ1dHRvbjtcblxuXHRcdGNvbnN0IHNob3dBc0hTTEJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNob3dBc0hTTEJ1dHRvbjtcblxuXHRcdGNvbnN0IHNob3dBc0hTVkJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNob3dBc0hTVkJ1dHRvbjtcblxuXHRcdGNvbnN0IHNob3dBc0xBQkJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNob3dBc0xBQkJ1dHRvbjtcblxuXHRcdGNvbnN0IHNob3dBc1JHQkJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNob3dBc1JHQkJ1dHRvbjtcblxuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBzZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFkdmFuY2VkTWVudUJ1dHRvbixcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdFx0Y2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhlbHBNZW51QnV0dG9uLFxuXHRcdFx0Y2xvc2VIaXN0b3J5TWVudUJ1dHRvbixcblx0XHRcdGRlc2F0dXJhdGVCdXR0b24sXG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94LFxuXHRcdFx0Z2VuZXJhdGVCdXR0b24sXG5cdFx0XHRoZWxwTWVudUJ1dHRvbixcblx0XHRcdGhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0bGltaXREYXJrbmVzc0NoZWNrYm94LFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94LFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCxcblx0XHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0c2VsZWN0ZWRDb2xvcixcblx0XHRcdHNob3dBc0NNWUtCdXR0b24sXG5cdFx0XHRzaG93QXNIZXhCdXR0b24sXG5cdFx0XHRzaG93QXNIU0xCdXR0b24sXG5cdFx0XHRzaG93QXNIU1ZCdXR0b24sXG5cdFx0XHRzaG93QXNMQUJCdXR0b24sXG5cdFx0XHRzaG93QXNSR0JCdXR0b25cblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9uczonLCBlcnJvcik7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWR2YW5jZWRNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGhlbHBNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0aGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0c2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yOiAwLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hleEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTTEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTVkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0xBQkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc1JHQkJ1dHRvbjogbnVsbFxuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihcblx0c2VsZWN0ZWRDb2xvcjogbnVtYmVyXG4pOiBHZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ige1xuXHRjb25zdCBzZWxlY3RlZENvbG9yQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0YGNvbG9yLWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHQpO1xuXG5cdGlmICghc2VsZWN0ZWRDb2xvckJveCkge1xuXHRcdGNvbnNvbGUud2FybihgRWxlbWVudCBub3QgZm91bmQgZm9yIGNvbG9yICR7c2VsZWN0ZWRDb2xvcn1gKTtcblxuXHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLicpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KSxcblx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdClcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1bGxQYXJhbXNGcm9tVUkoKTogUHVsbFBhcmFtc0Zyb21VSSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudCA9IGNvbmZpZy5jb25zdHMuZG9tLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBjb25maWcuY29uc3RzLmRvbS5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID0gY29uZmlnLmNvbnN0cy5kb20uZW5hYmxlQWxwaGFDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID0gY29uZmlnLmNvbnN0cy5kb20ubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5saW1pdExpZ2h0bmVzc0NoZWNrYm94O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50XG5cdFx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdDogMCxcblx0XHRcdG51bUJveGVzOiBudW1Cb3hlc0VsZW1lbnQgPyBwYXJzZUludChudW1Cb3hlc0VsZW1lbnQudmFsdWUsIDEwKSA6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFya25lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcHVsbCBwYXJhbWV0ZXJzIGZyb20gVUk6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiAwLFxuXHRcdFx0bnVtQm94ZXM6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93Q3VzdG9tQ29sb3JQb3B1cERpdigpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1kaXYnKTtcblxuXHRcdGlmIChwb3B1cCkge1xuXHRcdFx0cG9wdXAuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWRpdicpIGlzIHVuZGVmaW5lZFwiKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2hvdyBjdXN0b20gY29sb3IgcG9wdXAgZGl2OiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hDb2xvclNwYWNlKHRhcmdldEZvcm1hdDogQ29sb3JTcGFjZSk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveGVzID1cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0XHRcdCcuY29sb3ItdGV4dC1vdXRwdXQtYm94J1xuXHRcdFx0KTtcblxuXHRcdGNvbG9yVGV4dE91dHB1dEJveGVzLmZvckVhY2goYm94ID0+IHtcblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIENvbG9ySW5wdXRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY29sb3JWYWx1ZXMgPSBpbnB1dEJveC5jb2xvclZhbHVlcztcblxuXHRcdFx0aWYgKCFjb2xvclZhbHVlcyB8fCAhY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0KSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhgQ29udmVydGluZyBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9YCk7XG5cblx0XHRcdGNvbnN0IGNvbnZlcnRGbiA9IHV0aWxzLmNvbnZlcnNpb24uZ2V0Q29udmVyc2lvbkZuKFxuXHRcdFx0XHRjdXJyZW50Rm9ybWF0LFxuXHRcdFx0XHR0YXJnZXRGb3JtYXRcblx0XHRcdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gWFlaIHRvIGFub3RoZXIgY29sb3Igc3BhY2UuJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB1dGlscy5jb2xvci5uYXJyb3dUb0NvbG9yKGNvbG9yVmFsdWVzKTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhY2xvbmVkQ29sb3IgfHxcblx0XHRcdFx0dXRpbHMuY29sb3IuaXNTTENvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHR1dGlscy5jb2xvci5pc1NWQ29sb3IoY2xvbmVkQ29sb3IpIHx8XG5cdFx0XHRcdHV0aWxzLmNvbG9yLmlzWFlaKGNsb25lZENvbG9yKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gU0wsIFNWLCBvciBYWVogY29sb3Igc3BhY2VzLiBQbGVhc2UgY29udmVydCB0byBhIHN1cHBvcnRlZCBmb3JtYXQgZmlyc3QuJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbG9uZWRDb2xvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZS5jbG9uZShjb252ZXJ0Rm4oY2xvbmVkQ29sb3IpKTtcblxuXHRcdFx0aWYgKCFuZXdDb2xvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlucHV0Qm94LnZhbHVlID0gU3RyaW5nKG5ld0NvbG9yKTtcblxuXHRcdFx0aW5wdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIHRhcmdldEZvcm1hdCk7XG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29udmVydCBjb2xvcnM6ICR7ZXJyb3IgYXMgRXJyb3J9YCk7XG5cdH1cbn1cbiJdfQ==