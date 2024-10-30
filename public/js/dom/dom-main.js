import { getConversionFn } from '../color-spaces/conversion.js';
import { config } from '../config/constants.js';
import { domHelpers } from '../helpers/dom.js';
import { paletteHelpers } from '../helpers/palette.js';
import { generate } from '../palette-gen/generate.js';
import { genRandomColor } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
import { transform } from '../utils/transform.js';
import { guards } from '../utils/type-guards.js';
function addConversionButtonEventListeners() {
    try {
        const addListener = (id, colorSpace) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => convertColors(colorSpace));
            }
            else {
                console.warn(`Element with id "${id}" not found.`);
            }
        };
        addListener('hex-conversion-button', 'hex');
        addListener('rgb-conversion-button', 'rgb');
        addListener('hsv-conversion-button', 'hsv');
        addListener('hsl-conversion-button', 'hsl');
        addListener('cmyk-conversion-button', 'cmyk');
        addListener('lab-conversion-button', 'lab');
    }
    catch (error) {
        console.error(`Failed to add event listeners to conversion buttons: ${error}`);
        return;
    }
}
function applyCustomColor() {
    try {
        const colorPicker = document.getElementById('custom-color-picker');
        if (!colorPicker) {
            throw new Error('Color picker element not found');
        }
        const rawValue = colorPicker.value.trim();
        const selectedFormat = document.getElementById('custom-color-format')?.value;
        if (!guards.isColorSpace(selectedFormat)) {
            throw new Error(`Unsupported color format: ${selectedFormat}`);
        }
        const parsedColor = transform.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            throw new Error(`Invalid color value: ${rawValue}`);
        }
        return parsedColor;
    }
    catch (error) {
        console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return genRandomColor('hex');
    }
}
function applyFirstColorToUI(colorSpace) {
    try {
        const color = genRandomColor(colorSpace);
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = transform.getColorString(color);
        if (!formatColorString) {
            console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        populateColorTextOutputBox(color, 1);
        return color;
    }
    catch (error) {
        console.error(`Failed to apply first color to UI: ${error}`);
        return genRandomColor('hex');
    }
}
function applySelectedColorSpace() {
    try {
        const element = document.getElementById('initial-colorspace-options');
        const value = element.value;
        if (guards.isColorSpace(value)) {
            return value;
        }
        else {
            return 'hex';
        }
    }
    catch (error) {
        console.error('Failed to apply initial color space:', error);
        return 'hex';
    }
}
function convertColors(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues ||
                !paletteHelpers.validateColorValues(colorValues)) {
                console.error('Invalid color values.');
                domHelpers.showToast('Invalid color values.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                domHelpers.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                console.error('Cannot convert from XYZ to another color space.');
                domHelpers.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = guards.narrowToColor(colorValues);
            if (!clonedColor ||
                guards.isSLColor(clonedColor) ||
                guards.isSVColor(clonedColor) ||
                guards.isXYZ(clonedColor)) {
                console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                domHelpers.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                domHelpers.showToast('Conversion failed.');
                return;
            }
            const newColor = core.clone(convertFn(clonedColor));
            if (!newColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                domHelpers.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        console.error('Failed to convert colors:', error);
    }
}
function copyToClipboard(text, tooltipElement) {
    try {
        const colorValue = text.replace('Copied to clipboard!', '').trim();
        navigator.clipboard
            .writeText(colorValue)
            .then(() => {
            domHelpers.showTooltip(tooltipElement);
            console.log(`Copied color value: ${colorValue}`);
            setTimeout(() => tooltipElement.classList.remove('show'), config.tooltipTimeout || 1000);
        })
            .catch(err => {
            console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        console.error(`Failed to copy to clipboard: ${error}`);
    }
}
function defineUIButtons() {
    try {
        const generateButton = document.getElementById('generate-button');
        const saturateButton = document.getElementById('saturate-button');
        const desaturateButton = document.getElementById('desaturate-button');
        const popupDivButton = document.getElementById('custom-color-button');
        const applyCustomColorButton = document.getElementById('apply-custom-color-button');
        const clearCustomColorButton = document.getElementById('clear-custom-color-button');
        const advancedMenuToggleButton = document.getElementById('advanced-menu-toggle-button');
        const applyColorSpaceButton = document.getElementById('apply-initial-color-space-button');
        const selectedColorOptions = document.getElementById('selected-color-options');
        const selectedColor = selectedColorOptions
            ? parseInt(selectedColorOptions.value, 10)
            : 0;
        return {
            generateButton,
            saturateButton,
            desaturateButton,
            popupDivButton,
            applyCustomColorButton,
            clearCustomColorButton,
            advancedMenuToggleButton,
            applyColorSpaceButton,
            selectedColor
        };
    }
    catch (error) {
        console.error('Failed to define UI buttons:', error);
        return {
            generateButton: null,
            saturateButton: null,
            desaturateButton: null,
            popupDivButton: null,
            applyCustomColorButton: null,
            clearCustomColorButton: null,
            advancedMenuToggleButton: null,
            applyColorSpaceButton: null,
            selectedColor: 0
        };
    }
}
function desaturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        console.error(`Failed to desaturate color: ${error}`);
    }
}
function getElementsForSelectedColor(selectedColor) {
    const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    if (!selectedColorBox) {
        console.warn(`Element not found for color ${selectedColor}`);
        domHelpers.showToast('Please select a valid color.');
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
function getGenerateButtonParams() {
    try {
        const paletteTypeOptions = document.getElementById('palette-type-options');
        const paletteNumberOptions = document.getElementById('palette-number-options');
        const colorSpaceValue = document.getElementById('initial-colorspace-options')?.value;
        const colorSpace = guards.isColorSpace(colorSpaceValue)
            ? colorSpaceValue
            : 'hex';
        const customColorRaw = document.getElementById('custom-color')?.value;
        const customColor = transform.parseCustomColor(colorSpace, customColorRaw);
        console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}\ncolorSpace: ${colorSpace}\ncustomColor: ${JSON.stringify(customColor)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            colorSpace,
            customColor
        };
    }
    catch (error) {
        console.error('Failed to retrieve generateButton parameters:', error);
        return null;
    }
}
const handleGenButtonClick = core.debounce(() => {
    try {
        const params = getGenerateButtonParams();
        if (!params) {
            console.error('Failed to retrieve generateButton parameters');
            return;
        }
        const { paletteType, numBoxes, colorSpace, customColor } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const options = {
            paletteType,
            numBoxes,
            colorSpace,
            customColor
        };
        generate.startPaletteGen(options);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, config.buttonDebounce || 300);
function populateColorTextOutputBox(color, boxNumber) {
    try {
        const clonedColor = guards.isColor(color)
            ? core.clone(color)
            : transform.colorStringToColor(color);
        if (!paletteHelpers.validateColorValues(clonedColor)) {
            console.error('Invalid color values.');
            domHelpers.showToast('Invalid color values.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = transform.getCSSColorString(clonedColor);
        console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        console.error('Failed to populate color text output box:', error);
        return;
    }
}
function pullParamsFromUI() {
    try {
        const paletteTypeElement = document.getElementById('palette-type-options');
        const numBoxesElement = document.getElementById('palette-number-options');
        const colorSpaceElement = document.getElementById('initial-color-space-options');
        const paletteType = paletteTypeElement
            ? parseInt(paletteTypeElement.value, 10)
            : 0;
        const numBoxes = numBoxesElement
            ? parseInt(numBoxesElement.value, 10)
            : 0;
        const colorSpace = colorSpaceElement && guards.isColorSpace(colorSpaceElement.value)
            ? colorSpaceElement.value
            : 'hex';
        return {
            paletteType,
            numBoxes,
            colorSpace
        };
    }
    catch (error) {
        console.error(`Failed to pull parameters from UI: ${error}`);
        return {
            paletteType: 0,
            numBoxes: 0,
            colorSpace: 'hex'
        };
    }
}
function saturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        console.error(`Failed to saturate color: ${error}`);
    }
}
function showCustomColorPopupDiv() {
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
export const domFn = {
    addConversionButtonEventListeners,
    applyCustomColor,
    applyFirstColorToUI,
    applySelectedColorSpace,
    convertColors,
    copyToClipboard,
    defineUIButtons,
    desaturateColor,
    getElementsForSelectedColor,
    getGenerateButtonParams,
    handleGenButtonClick,
    populateColorTextOutputBox,
    pullParamsFromUI,
    saturateColor,
    showCustomColorPopupDiv
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZG9tL2RvbS1tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUlwRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QyxTQUFTLGlDQUFpQztJQUN6QyxJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQVUsRUFBRSxVQUE2QixFQUFFLEVBQUU7WUFDakUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDckMsRUFBRSxDQUMwQixDQUFDO1lBRTlCLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FDckMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUN6QixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDcEQsQ0FBQztRQUNGLENBQUMsQ0FBQztRQUVGLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1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Q0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQzthQUFNLENBQUM7WUFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7WUFDbkUsT0FBTztRQUNSLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFvQjtJQUNyQyxpQ0FBaUM7SUFDakMsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsYUFBYTtJQUNiLGVBQWU7SUFDZixlQUFlO0lBQ2YsZUFBZTtJQUNmLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLHVCQUF1QjtDQUN2QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0Q29udmVyc2lvbkZuIH0gZnJvbSAnLi4vY29sb3Itc3BhY2VzL2NvbnZlcnNpb24nO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBkb21IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9kb20nO1xuaW1wb3J0IHsgcGFsZXR0ZUhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL3BhbGV0dGUnO1xuaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0ICogYXMgY29sb3JzIGZyb20gJy4uL2luZGV4L2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBkb21UeXBlcyBmcm9tICcuLi9pbmRleC9kb20tdHlwZXMnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICcuLi9wYWxldHRlLWdlbi9nZW5lcmF0ZSc7XG5pbXBvcnQgeyBnZW5SYW5kb21Db2xvciB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXJhbmRvbWl6ZXInO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL3V0aWxzL2NvcmUnO1xuaW1wb3J0IHsgdHJhbnNmb3JtIH0gZnJvbSAnLi4vdXRpbHMvdHJhbnNmb3JtJztcbmltcG9ydCB7IGd1YXJkcyB9IGZyb20gJy4uL3V0aWxzL3R5cGUtZ3VhcmRzJztcblxuZnVuY3Rpb24gYWRkQ29udmVyc2lvbkJ1dHRvbkV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkZExpc3RlbmVyID0gKGlkOiBzdHJpbmcsIGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlKSA9PiB7XG5cdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0aWRcblx0XHRcdCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0XHRpZiAoYnV0dG9uKSB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0Y29udmVydENvbG9ycyhjb2xvclNwYWNlKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBFbGVtZW50IHdpdGggaWQgXCIke2lkfVwiIG5vdCBmb3VuZC5gKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0YWRkTGlzdGVuZXIoJ2hleC1jb252ZXJzaW9uLWJ1dHRvbicsICdoZXgnKTtcblx0XHRhZGRMaXN0ZW5lcigncmdiLWNvbnZlcnNpb24tYnV0dG9uJywgJ3JnYicpO1xuXHRcdGFkZExpc3RlbmVyKCdoc3YtY29udmVyc2lvbi1idXR0b24nLCAnaHN2Jyk7XG5cdFx0YWRkTGlzdGVuZXIoJ2hzbC1jb252ZXJzaW9uLWJ1dHRvbicsICdoc2wnKTtcblx0XHRhZGRMaXN0ZW5lcignY215ay1jb252ZXJzaW9uLWJ1dHRvbicsICdjbXlrJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ2xhYi1jb252ZXJzaW9uLWJ1dHRvbicsICdsYWInKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0YEZhaWxlZCB0byBhZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGNvbnZlcnNpb24gYnV0dG9uczogJHtlcnJvcn1gXG5cdFx0KTtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlDdXN0b21Db2xvcigpOiBjb2xvcnMuQ29sb3Ige1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQnY3VzdG9tLWNvbG9yLXBpY2tlcidcblx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXG5cdFx0aWYgKCFjb2xvclBpY2tlcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb2xvciBwaWNrZXIgZWxlbWVudCBub3QgZm91bmQnKTtcblx0XHR9XG5cblx0XHRjb25zdCByYXdWYWx1ZSA9IGNvbG9yUGlja2VyLnZhbHVlLnRyaW0oKTtcblx0XHRjb25zdCBzZWxlY3RlZEZvcm1hdCA9IChcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnY3VzdG9tLWNvbG9yLWZvcm1hdCdcblx0XHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsXG5cdFx0KT8udmFsdWUgYXMgY29sb3JzLkNvbG9yU3BhY2U7XG5cblx0XHRpZiAoIWd1YXJkcy5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHRyYW5zZm9ybS5wYXJzZUNvbG9yKHNlbGVjdGVkRm9ybWF0LCByYXdWYWx1ZSk7XG5cblx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWU6ICR7cmF3VmFsdWV9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcnNlZENvbG9yO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGN1c3RvbSBjb2xvcjogJHtlcnJvcn0uIFJldHVybmluZyByYW5kb21seSBnZW5lcmF0ZWQgaGV4IGNvbG9yYFxuXHRcdCk7XG5cdFx0cmV0dXJuIGdlblJhbmRvbUNvbG9yKCdoZXgnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUZpcnN0Q29sb3JUb1VJKGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlKTogY29sb3JzLkNvbG9yIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvciA9IGdlblJhbmRvbUNvbG9yKGNvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGNvbG9yQm94MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1ib3gtMScpO1xuXG5cdFx0aWYgKCFjb2xvckJveDEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9IHRyYW5zZm9ybS5nZXRDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIG9yIHVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdC4nKTtcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb2xvckJveDEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZm9ybWF0Q29sb3JTdHJpbmc7XG5cblx0XHRwb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChjb2xvciwgMSk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBnZW5SYW5kb21Db2xvcignaGV4Jyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlTZWxlY3RlZENvbG9yU3BhY2UoKTogY29sb3JzLkNvbG9yU3BhY2Uge1xuXHR0cnkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdpbml0aWFsLWNvbG9yc3BhY2Utb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG5cdFx0Y29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXG5cdFx0aWYgKGd1YXJkcy5pc0NvbG9yU3BhY2UodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgYXMgY29sb3JzLkNvbG9yU3BhY2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAnaGV4Jztcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGFwcGx5IGluaXRpYWwgY29sb3Igc3BhY2U6JywgZXJyb3IpO1xuXHRcdHJldHVybiAnaGV4Jztcblx0fVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0Q29sb3JzKHRhcmdldEZvcm1hdDogY29sb3JzLkNvbG9yU3BhY2UpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3hlcyA9XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdFx0XHQnLmNvbG9yLXRleHQtb3V0cHV0LWJveCdcblx0XHRcdCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3hlcy5mb3JFYWNoKGJveCA9PiB7XG5cdFx0XHRjb25zdCBpbnB1dEJveCA9IGJveCBhcyBkb21UeXBlcy5Db2xvcklucHV0RWxlbWVudDtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWVzID0gaW5wdXRCb3guY29sb3JWYWx1ZXM7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IWNvbG9yVmFsdWVzIHx8XG5cdFx0XHRcdCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXHRcdFx0XHRkb21IZWxwZXJzLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvciB2YWx1ZXMuJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VycmVudEZvcm1hdCA9IGlucHV0Qm94LmdldEF0dHJpYnV0ZShcblx0XHRcdFx0J2RhdGEtZm9ybWF0J1xuXHRcdFx0KSBhcyBjb2xvcnMuQ29sb3JTcGFjZTtcblxuXHRcdFx0Y29uc29sZS5sb2coYENvbnZlcnRpbmcgZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fWApO1xuXG5cdFx0XHRjb25zdCBjb252ZXJ0Rm4gPSBnZXRDb252ZXJzaW9uRm4oY3VycmVudEZvcm1hdCwgdGFyZ2V0Rm9ybWF0KTtcblxuXHRcdFx0aWYgKCFjb252ZXJ0Rm4pIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRgQ29udmVyc2lvbiBmcm9tICR7Y3VycmVudEZvcm1hdH0gdG8gJHt0YXJnZXRGb3JtYXR9IGlzIG5vdCBzdXBwb3J0ZWQuYFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRkb21IZWxwZXJzLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0J0Nhbm5vdCBjb252ZXJ0IGZyb20gWFlaIHRvIGFub3RoZXIgY29sb3Igc3BhY2UuJ1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRkb21IZWxwZXJzLnNob3dUb2FzdCgnQ29udmVyc2lvbiBub3Qgc3VwcG9ydGVkLicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gZ3VhcmRzLm5hcnJvd1RvQ29sb3IoY29sb3JWYWx1ZXMpO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCFjbG9uZWRDb2xvciB8fFxuXHRcdFx0XHRndWFyZHMuaXNTTENvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHRndWFyZHMuaXNTVkNvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHRndWFyZHMuaXNYWVooY2xvbmVkQ29sb3IpXG5cdFx0XHQpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHQnQ2Fubm90IGNvbnZlcnQgZnJvbSBTTCwgU1YsIG9yIFhZWiBjb2xvciBzcGFjZXMuIFBsZWFzZSBjb252ZXJ0IHRvIGEgc3VwcG9ydGVkIGZvcm1hdCBmaXJzdC4nXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0ZG9tSGVscGVycy5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghY2xvbmVkQ29sb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmApO1xuXG5cdFx0XHRcdGRvbUhlbHBlcnMuc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZS5jbG9uZShjb252ZXJ0Rm4oY2xvbmVkQ29sb3IpKTtcblxuXHRcdFx0aWYgKCFuZXdDb2xvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0ZG9tSGVscGVycy5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aW5wdXRCb3gudmFsdWUgPSBTdHJpbmcobmV3Q29sb3IpO1xuXHRcdFx0aW5wdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIHRhcmdldEZvcm1hdCk7XG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOicsIGVycm9yKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGRvbUhlbHBlcnMuc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQ29waWVkIGNvbG9yIHZhbHVlOiAke2NvbG9yVmFsdWV9YCk7XG5cblx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0Y29uZmlnLnRvb2x0aXBUaW1lb3V0IHx8IDEwMDBcblx0XHRcdFx0KTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6JywgZXJyKTtcblx0XHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZWZpbmVVSUJ1dHRvbnMoKTogZG9tVHlwZXMuVUlCdXR0b25zIHtcblx0dHJ5IHtcblx0XHRjb25zdCBnZW5lcmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZS1idXR0b24nKTtcblx0XHRjb25zdCBzYXR1cmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXR1cmF0ZS1idXR0b24nKTtcblx0XHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2F0dXJhdGUtYnV0dG9uJyk7XG5cdFx0Y29uc3QgcG9wdXBEaXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLWNvbG9yLWJ1dHRvbicpO1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhcHBseS1jdXN0b20tY29sb3ItYnV0dG9uJ1xuXHRcdCk7XG5cdFx0Y29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2NsZWFyLWN1c3RvbS1jb2xvci1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBhZHZhbmNlZE1lbnVUb2dnbGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhZHZhbmNlZC1tZW51LXRvZ2dsZS1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBhcHBseUNvbG9yU3BhY2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhcHBseS1pbml0aWFsLWNvbG9yLXNwYWNlLWJ1dHRvbidcblx0XHQpO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQnc2VsZWN0ZWQtY29sb3Itb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yID0gc2VsZWN0ZWRDb2xvck9wdGlvbnNcblx0XHRcdD8gcGFyc2VJbnQoc2VsZWN0ZWRDb2xvck9wdGlvbnMudmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGdlbmVyYXRlQnV0dG9uLFxuXHRcdFx0c2F0dXJhdGVCdXR0b24sXG5cdFx0XHRkZXNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0cG9wdXBEaXZCdXR0b24sXG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGFkdmFuY2VkTWVudVRvZ2dsZUJ1dHRvbixcblx0XHRcdGFwcGx5Q29sb3JTcGFjZUJ1dHRvbixcblx0XHRcdHNlbGVjdGVkQ29sb3Jcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9uczonLCBlcnJvcik7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGdlbmVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0c2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRkZXNhdHVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0cG9wdXBEaXZCdXR0b246IG51bGwsXG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGFkdmFuY2VkTWVudVRvZ2dsZUJ1dHRvbjogbnVsbCxcblx0XHRcdGFwcGx5Q29sb3JTcGFjZUJ1dHRvbjogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3I6IDBcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKFxuXHRzZWxlY3RlZENvbG9yOiBudW1iZXJcbik6IGRvbVR5cGVzLkdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvciB7XG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRgY29sb3ItYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdCk7XG5cblx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0Y29uc29sZS53YXJuKGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWApO1xuXHRcdGRvbUhlbHBlcnMuc2hvd1RvYXN0KCdQbGVhc2Ugc2VsZWN0IGEgdmFsaWQgY29sb3IuJyk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KSxcblx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdClcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2V0R2VuZXJhdGVCdXR0b25QYXJhbXMoKTogZG9tVHlwZXMuR2VuQnV0dG9uUGFyYW1zIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQncGFsZXR0ZS10eXBlLW9wdGlvbnMnXG5cdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblx0XHRjb25zdCBwYWxldHRlTnVtYmVyT3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J3BhbGV0dGUtbnVtYmVyLW9wdGlvbnMnXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGNvbnN0IGNvbG9yU3BhY2VWYWx1ZSA9IChcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHQnaW5pdGlhbC1jb2xvcnNwYWNlLW9wdGlvbnMnXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50XG5cdFx0KT8udmFsdWU7XG5cdFx0Y29uc3QgY29sb3JTcGFjZSA9IGd1YXJkcy5pc0NvbG9yU3BhY2UoY29sb3JTcGFjZVZhbHVlKVxuXHRcdFx0PyAoY29sb3JTcGFjZVZhbHVlIGFzIGNvbG9ycy5Db2xvclNwYWNlKVxuXHRcdFx0OiAnaGV4Jztcblx0XHRjb25zdCBjdXN0b21Db2xvclJhdyA9IChcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b20tY29sb3InKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cdFx0KT8udmFsdWU7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3IgPSB0cmFuc2Zvcm0ucGFyc2VDdXN0b21Db2xvcihcblx0XHRcdGNvbG9yU3BhY2UsXG5cdFx0XHRjdXN0b21Db2xvclJhd1xuXHRcdCk7XG5cblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGBudW1Cb3hlczogJHtwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApfVxcbnBhbGV0dGVUeXBlOiAke3BhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApfVxcbmNvbG9yU3BhY2U6ICR7Y29sb3JTcGFjZX1cXG5jdXN0b21Db2xvcjogJHtKU09OLnN0cmluZ2lmeShjdXN0b21Db2xvcil9YFxuXHRcdCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bnVtQm94ZXM6IHBhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRwYWxldHRlVHlwZTogcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRjb2xvclNwYWNlLFxuXHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOicsIGVycm9yKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5jb25zdCBoYW5kbGVHZW5CdXR0b25DbGljayA9IGNvcmUuZGVib3VuY2UoKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IGdldEdlbmVyYXRlQnV0dG9uUGFyYW1zKCk7XG5cblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnMnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB7IHBhbGV0dGVUeXBlLCBudW1Cb3hlcywgY29sb3JTcGFjZSwgY3VzdG9tQ29sb3IgfSA9IHBhcmFtcztcblxuXHRcdGlmICghcGFsZXR0ZVR5cGUgfHwgIW51bUJveGVzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlVHlwZSBhbmQvb3IgbnVtQm94ZXMgYXJlIHVuZGVmaW5lZCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IGNvbG9ycy5QYWxldHRlT3B0aW9ucyA9IHtcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjb2xvclNwYWNlLFxuXHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHR9O1xuXG5cdFx0Z2VuZXJhdGUuc3RhcnRQYWxldHRlR2VuKG9wdGlvbnMpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBoYW5kbGUgZ2VuZXJhdGUgYnV0dG9uIGNsaWNrOiAke2Vycm9yfWApO1xuXHR9XG59LCBjb25maWcuYnV0dG9uRGVib3VuY2UgfHwgMzAwKTtcblxuZnVuY3Rpb24gcG9wdWxhdGVDb2xvclRleHRPdXRwdXRCb3goXG5cdGNvbG9yOiBjb2xvcnMuQ29sb3IgfCBjb2xvcnMuQ29sb3JTdHJpbmcsXG5cdGJveE51bWJlcjogbnVtYmVyXG4pOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjbG9uZWRDb2xvcjogY29sb3JzLkNvbG9yID0gZ3VhcmRzLmlzQ29sb3IoY29sb3IpXG5cdFx0XHQ/IGNvcmUuY2xvbmUoY29sb3IpXG5cdFx0XHQ6IHRyYW5zZm9ybS5jb2xvclN0cmluZ1RvQ29sb3IoY29sb3IpO1xuXG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNsb25lZENvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBjb2xvciB2YWx1ZXMuJyk7XG5cblx0XHRcdGRvbUhlbHBlcnMuc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbG9yVGV4dE91dHB1dEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXRleHQtb3V0cHV0LWJveC0ke2JveE51bWJlcn1gXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JUZXh0T3V0cHV0Qm94KSByZXR1cm47XG5cblx0XHRjb25zdCBzdHJpbmdpZmllZENvbG9yID0gdHJhbnNmb3JtLmdldENTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdGNvbnNvbGUubG9nKGBBZGRpbmcgQ1NTLWZvcm1hdHRlZCBjb2xvciB0byBET00gJHtzdHJpbmdpZmllZENvbG9yfWApO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnZhbHVlID0gc3RyaW5naWZpZWRDb2xvcjtcblx0XHRjb2xvclRleHRPdXRwdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIGNvbG9yLmZvcm1hdCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHBvcHVsYXRlIGNvbG9yIHRleHQgb3V0cHV0IGJveDonLCBlcnJvcik7XG5cblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gcHVsbFBhcmFtc0Zyb21VSSgpOiBkb21UeXBlcy5QdWxsUGFyYW1zRnJvbVVJIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlVHlwZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLXR5cGUtb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLW51bWJlci1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuXHRcdGNvbnN0IGNvbG9yU3BhY2VFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQnaW5pdGlhbC1jb2xvci1zcGFjZS1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuXG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGUgPSBwYWxldHRlVHlwZUVsZW1lbnRcblx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdDogMDtcblx0XHRjb25zdCBudW1Cb3hlcyA9IG51bUJveGVzRWxlbWVudFxuXHRcdFx0PyBwYXJzZUludChudW1Cb3hlc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXHRcdGNvbnN0IGNvbG9yU3BhY2UgPVxuXHRcdFx0Y29sb3JTcGFjZUVsZW1lbnQgJiYgZ3VhcmRzLmlzQ29sb3JTcGFjZShjb2xvclNwYWNlRWxlbWVudC52YWx1ZSlcblx0XHRcdFx0PyAoY29sb3JTcGFjZUVsZW1lbnQudmFsdWUgYXMgY29sb3JzLkNvbG9yU3BhY2UpXG5cdFx0XHRcdDogJ2hleCc7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGUsXG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdGNvbG9yU3BhY2Vcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGU6IDAsXG5cdFx0XHRudW1Cb3hlczogMCxcblx0XHRcdGNvbG9yU3BhY2U6ICdoZXgnXG5cdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2hvd0N1c3RvbUNvbG9yUG9wdXBEaXYoKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtZGl2Jyk7XG5cblx0XHRpZiAocG9wdXApIHtcblx0XHRcdHBvcHVwLmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1kaXYnKSBpcyB1bmRlZmluZWRcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBzaG93IGN1c3RvbSBjb2xvciBwb3B1cCBkaXY6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGRvbUZuOiBmbk9iamVjdHMuRE9NRm4gPSB7XG5cdGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycyxcblx0YXBwbHlDdXN0b21Db2xvcixcblx0YXBwbHlGaXJzdENvbG9yVG9VSSxcblx0YXBwbHlTZWxlY3RlZENvbG9yU3BhY2UsXG5cdGNvbnZlcnRDb2xvcnMsXG5cdGNvcHlUb0NsaXBib2FyZCxcblx0ZGVmaW5lVUlCdXR0b25zLFxuXHRkZXNhdHVyYXRlQ29sb3IsXG5cdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcixcblx0Z2V0R2VuZXJhdGVCdXR0b25QYXJhbXMsXG5cdGhhbmRsZUdlbkJ1dHRvbkNsaWNrLFxuXHRwb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveCxcblx0cHVsbFBhcmFtc0Zyb21VSSxcblx0c2F0dXJhdGVDb2xvcixcblx0c2hvd0N1c3RvbUNvbG9yUG9wdXBEaXZcbn07XG4iXX0=