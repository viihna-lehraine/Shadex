import { getConversionFn } from '../color-conversion/conversion.js';
import { config } from '../config/constants.js';
import { conversionHelpers } from '../helpers/conversion.js';
import { domHelpers } from '../helpers/dom.js';
import { paletteHelpers } from '../helpers/palette.js';
import { generate } from '../palette-gen/generate.js';
import { random } from '../utils/color-randomizer.js';
import { core } from '../utils/core.js';
import { transforms } from '../utils/transforms.js';
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
        const parsedColor = transforms.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            throw new Error(`Invalid color value: ${rawValue}`);
        }
        return parsedColor;
    }
    catch (error) {
        console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return random.randomColor('hex');
    }
}
function applyFirstColorToUI(initialColorSpace) {
    try {
        const color = random.randomColor(initialColorSpace);
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = transforms.getColorString(color);
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
        return random.randomColor('hex');
    }
}
function applyInitialColorSpace() {
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
            const newColor = core.clone(convertFn(colorValues));
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
        const applyInitialColorSpaceButton = document.getElementById('apply-initial-color-space-button');
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
            applyInitialColorSpaceButton,
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
            applyInitialColorSpaceButton: null,
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
        const initialColorSpace = guards.isColorSpace(colorSpaceValue)
            ? colorSpaceValue
            : 'hex';
        const customColorRaw = document.getElementById('custom-color')?.value;
        const customColor = transforms.parseCustomColor(initialColorSpace, customColorRaw);
        console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}\ninitialColorSpace: ${initialColorSpace}\ncustomColor: ${JSON.stringify(customColor)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            initialColorSpace,
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
        const { paletteType, numBoxes, initialColorSpace, customColor } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const space = initialColorSpace ?? 'hex';
        generate.startPaletteGen(paletteType, numBoxes, space, customColor);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, config.buttonDebounce || 300);
function populateColorTextOutputBox(color, boxNumber) {
    try {
        if (!paletteHelpers.validateColorValues(color)) {
            console.error('Invalid color values.');
            domHelpers.showToast('Invalid color values.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const hexColor = conversionHelpers.convertColorToHex(color);
        if (!hexColor) {
            console.error('Failed to convert color to hex');
            return;
        }
        console.log(`Hex color value: ${JSON.stringify(hexColor.value.hex)}`);
        colorTextOutputBox.value = hexColor.value.hex;
        colorTextOutputBox.setAttribute('data-format', 'hex');
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
        const initialColorSpaceElement = document.getElementById('initial-color-space-options');
        const paletteType = paletteTypeElement
            ? parseInt(paletteTypeElement.value, 10)
            : 0;
        const numBoxes = numBoxesElement
            ? parseInt(numBoxesElement.value, 10)
            : 0;
        const initialColorSpace = initialColorSpaceElement &&
            guards.isColorSpace(initialColorSpaceElement.value)
            ? initialColorSpaceElement.value
            : 'hex';
        return {
            paletteType,
            numBoxes,
            initialColorSpace
        };
    }
    catch (error) {
        console.error(`Failed to pull parameters from UI: ${error}`);
        return {
            paletteType: 0,
            numBoxes: 0,
            initialColorSpace: 'hex'
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
export const dom = {
    addConversionButtonEventListeners,
    applyCustomColor,
    applyFirstColorToUI,
    applyInitialColorSpace,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZG9tL2RvbS1tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUlwRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QyxTQUFTLGlDQUFpQztJQUN6QyxJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQVUsRUFBRSxVQUE0QixFQUFFLEVBQUU7WUFDaEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDckMsRUFBRSxDQUMwQixDQUFDO1lBRTlCLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FDckMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUN6QixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDcEQsQ0FBQztRQUNGLENBQUMsQ0FBQztR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M0IsdUJBQXVCO0lBQ3ZCLG9CQUFvQjtJQUNwQiwwQkFBMEI7SUFDMUIsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYix1QkFBdUI7Q0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldENvbnZlcnNpb25GbiB9IGZyb20gJy4uL2NvbG9yLWNvbnZlcnNpb24vY29udmVyc2lvbic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uc3RhbnRzJztcbmltcG9ydCB7IGNvbnZlcnNpb25IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uJztcbmltcG9ydCB7IGRvbUhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgeyBwYWxldHRlSGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvcGFsZXR0ZSc7XG5pbXBvcnQgKiBhcyBmbk9iamVjdHMgZnJvbSAnLi4vaW5kZXgvZm4tb2JqZWN0cyc7XG5pbXBvcnQgKiBhcyBpbnRlcmZhY2VzIGZyb20gJy4uL2luZGV4L2ludGVyZmFjZXMnO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vaW5kZXgvdHlwZXMnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICcuLi9wYWxldHRlLWdlbi9nZW5lcmF0ZSc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi91dGlscy9jb3JlJztcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuLi91dGlscy90cmFuc2Zvcm1zJztcbmltcG9ydCB7IGd1YXJkcyB9IGZyb20gJy4uL3V0aWxzL3R5cGUtZ3VhcmRzJztcblxuZnVuY3Rpb24gYWRkQ29udmVyc2lvbkJ1dHRvbkV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkZExpc3RlbmVyID0gKGlkOiBzdHJpbmcsIGNvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UpID0+IHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRpZFxuXHRcdFx0KSBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmIChidXR0b24pIHtcblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cblx0XHRcdFx0XHRjb252ZXJ0Q29sb3JzKGNvbG9yU3BhY2UpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRhZGRMaXN0ZW5lcignaGV4LWNvbnZlcnNpb24tYnV0dG9uJywgJ2hleCcpO1xuXHRcdGFkZExpc3RlbmVyKCdyZ2ItY29udmVyc2lvbi1idXR0b24nLCAncmdiJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ2hzdi1jb252ZXJzaW9uLWJ1dHRvbicsICdoc3YnKTtcblx0XHRhZGRMaXN0ZW5lcignaHNsLWNvbnZlcnNpb24tYnV0dG9uJywgJ2hzbCcpO1xuXHRcdGFkZExpc3RlbmVyKCdjbXlrLWNvbnZlcnNpb24tYnV0dG9uJywgJ2NteWsnKTtcblx0XHRhZGRMaXN0ZW5lcignbGFiLWNvbnZlcnNpb24tYnV0dG9uJywgJ2xhYicpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgRmFpbGVkIHRvIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gY29udmVyc2lvbiBidXR0b25zOiAke2Vycm9yfWBcblx0XHQpO1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUN1c3RvbUNvbG9yKCk6IHR5cGVzLkNvbG9yIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRGb3JtYXQgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbFxuXHRcdCk/LnZhbHVlIGFzIHR5cGVzLkNvbG9yU3BhY2U7XG5cblx0XHRpZiAoIWd1YXJkcy5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHRyYW5zZm9ybXMucGFyc2VDb2xvcihzZWxlY3RlZEZvcm1hdCwgcmF3VmFsdWUpO1xuXG5cdFx0aWYgKCFwYXJzZWRDb2xvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXJzZWRDb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0YEZhaWxlZCB0byBhcHBseSBjdXN0b20gY29sb3I6ICR7ZXJyb3J9LiBSZXR1cm5pbmcgcmFuZG9tbHkgZ2VuZXJhdGVkIGhleCBjb2xvcmBcblx0XHQpO1xuXHRcdHJldHVybiByYW5kb20ucmFuZG9tQ29sb3IoJ2hleCcpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Rmlyc3RDb2xvclRvVUkoaW5pdGlhbENvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UpOiB0eXBlcy5Db2xvciB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3IgPSByYW5kb20ucmFuZG9tQ29sb3IoaW5pdGlhbENvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGNvbG9yQm94MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1ib3gtMScpO1xuXG5cdFx0aWYgKCFjb2xvckJveDEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9IHRyYW5zZm9ybXMuZ2V0Q29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0aWYgKCFmb3JtYXRDb2xvclN0cmluZykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyk7XG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0cG9wdWxhdGVDb2xvclRleHRPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gcmFuZG9tLnJhbmRvbUNvbG9yKCdoZXgnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUluaXRpYWxDb2xvclNwYWNlKCk6IHR5cGVzLkNvbG9yU3BhY2Uge1xuXHR0cnkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdpbml0aWFsLWNvbG9yc3BhY2Utb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG5cdFx0Y29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXG5cdFx0aWYgKGd1YXJkcy5pc0NvbG9yU3BhY2UodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgYXMgdHlwZXMuQ29sb3JTcGFjZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICdoZXgnO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gYXBwbHkgaW5pdGlhbCBjb2xvciBzcGFjZTonLCBlcnJvcik7XG5cdFx0cmV0dXJuICdoZXgnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDb2xvcnModGFyZ2V0Rm9ybWF0OiB0eXBlcy5Db2xvclNwYWNlKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94ZXMuZm9yRWFjaChib3ggPT4ge1xuXHRcdFx0Y29uc3QgaW5wdXRCb3ggPSBib3ggYXMgaW50ZXJmYWNlcy5Db2xvcklucHV0RWxlbWVudDtcblx0XHRcdGNvbnN0IGNvbG9yVmFsdWVzID0gaW5wdXRCb3guY29sb3JWYWx1ZXM7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IWNvbG9yVmFsdWVzIHx8XG5cdFx0XHRcdCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXHRcdFx0XHRkb21IZWxwZXJzLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvciB2YWx1ZXMuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjdXJyZW50Rm9ybWF0ID0gaW5wdXRCb3guZ2V0QXR0cmlidXRlKFxuXHRcdFx0XHQnZGF0YS1mb3JtYXQnXG5cdFx0XHQpIGFzIHR5cGVzLkNvbG9yU3BhY2U7XG5cblx0XHRcdGNvbnNvbGUubG9nKGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gKTtcblxuXHRcdFx0Y29uc3QgY29udmVydEZuID0gZ2V0Q29udmVyc2lvbkZuKGN1cnJlbnRGb3JtYXQsIHRhcmdldEZvcm1hdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0KTtcblx0XHRcdFx0ZG9tSGVscGVycy5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29sb3JWYWx1ZXMuZm9ybWF0ID09PSAneHl6Jykge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLidcblx0XHRcdFx0KTtcblx0XHRcdFx0ZG9tSGVscGVycy5zaG93VG9hc3QoJ0NvbnZlcnNpb24gbm90IHN1cHBvcnRlZC4nKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgbmV3Q29sb3IgPSBjb3JlLmNsb25lKGNvbnZlcnRGbihjb2xvclZhbHVlcykpO1xuXG5cdFx0XHRpZiAoIW5ld0NvbG9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gKTtcblx0XHRcdFx0ZG9tSGVscGVycy5zaG93VG9hc3QoJ0NvbnZlcnNpb24gZmFpbGVkLicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlucHV0Qm94LnZhbHVlID0gU3RyaW5nKG5ld0NvbG9yKTtcblx0XHRcdGlucHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCB0YXJnZXRGb3JtYXQpO1xuXHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjb252ZXJ0IGNvbG9yczonLCBlcnJvcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRkb21IZWxwZXJzLnNob3dUb29sdGlwKHRvb2x0aXBFbGVtZW50KTtcblx0XHRcdFx0Y29uc29sZS5sb2coYENvcGllZCBjb2xvciB2YWx1ZTogJHtjb2xvclZhbHVlfWApO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0KCkgPT4gdG9vbHRpcEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0XHRcdGNvbmZpZy50b29sdGlwVGltZW91dCB8fCAxMDAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvcHlpbmcgdG8gY2xpcGJvYXJkOicsIGVycik7XG5cdFx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQ6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lVUlCdXR0b25zKCk6IGludGVyZmFjZXMuVUlCdXR0b25zIHtcblx0dHJ5IHtcblx0XHRjb25zdCBnZW5lcmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZS1idXR0b24nKTtcblx0XHRjb25zdCBzYXR1cmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXR1cmF0ZS1idXR0b24nKTtcblx0XHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2F0dXJhdGUtYnV0dG9uJyk7XG5cdFx0Y29uc3QgcG9wdXBEaXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLWNvbG9yLWJ1dHRvbicpO1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhcHBseS1jdXN0b20tY29sb3ItYnV0dG9uJ1xuXHRcdCk7XG5cdFx0Y29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2NsZWFyLWN1c3RvbS1jb2xvci1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBhZHZhbmNlZE1lbnVUb2dnbGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhZHZhbmNlZC1tZW51LXRvZ2dsZS1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBhcHBseUluaXRpYWxDb2xvclNwYWNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQnYXBwbHktaW5pdGlhbC1jb2xvci1zcGFjZS1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J3NlbGVjdGVkLWNvbG9yLW9wdGlvbnMnXG5cdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGw7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25zXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb25zLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbixcblx0XHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0XHRcdHBvcHVwRGl2QnV0dG9uLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRhZHZhbmNlZE1lbnVUb2dnbGVCdXR0b24sXG5cdFx0XHRhcHBseUluaXRpYWxDb2xvclNwYWNlQnV0dG9uLFxuXHRcdFx0c2VsZWN0ZWRDb2xvclxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRlZmluZSBVSSBidXR0b25zOicsIGVycm9yKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2VuZXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGRlc2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRwb3B1cERpdkJ1dHRvbjogbnVsbCxcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0YWR2YW5jZWRNZW51VG9nZ2xlQnV0dG9uOiBudWxsLFxuXHRcdFx0YXBwbHlJbml0aWFsQ29sb3JTcGFjZUJ1dHRvbjogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3I6IDBcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKFxuXHRzZWxlY3RlZENvbG9yOiBudW1iZXJcbik6IGludGVyZmFjZXMuR2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yIHtcblx0Y29uc3Qgc2VsZWN0ZWRDb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0KTtcblxuXHRpZiAoIXNlbGVjdGVkQ29sb3JCb3gpIHtcblx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgbm90IGZvdW5kIGZvciBjb2xvciAke3NlbGVjdGVkQ29sb3J9YCk7XG5cdFx0ZG9tSGVscGVycy5zaG93VG9hc3QoJ1BsZWFzZSBzZWxlY3QgYSB2YWxpZCBjb2xvci4nKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogbnVsbFxuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpLFxuXHRcdHNlbGVjdGVkQ29sb3JCb3gsXG5cdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3Itc3RyaXBlLSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KVxuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRHZW5lcmF0ZUJ1dHRvblBhcmFtcygpOiBpbnRlcmZhY2VzLkdlbkJ1dHRvblBhcmFtcyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J3BhbGV0dGUtdHlwZS1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLW51bWJlci1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRjb25zdCBjb2xvclNwYWNlVmFsdWUgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2luaXRpYWwtY29sb3JzcGFjZS1vcHRpb25zJ1xuXHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudFxuXHRcdCk/LnZhbHVlO1xuXHRcdGNvbnN0IGluaXRpYWxDb2xvclNwYWNlID0gZ3VhcmRzLmlzQ29sb3JTcGFjZShjb2xvclNwYWNlVmFsdWUpXG5cdFx0XHQ/IChjb2xvclNwYWNlVmFsdWUgYXMgdHlwZXMuQ29sb3JTcGFjZSlcblx0XHRcdDogJ2hleCc7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JSYXcgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLWNvbG9yJykgYXMgSFRNTElucHV0RWxlbWVudFxuXHRcdCk/LnZhbHVlO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yID0gdHJhbnNmb3Jtcy5wYXJzZUN1c3RvbUNvbG9yKFxuXHRcdFx0aW5pdGlhbENvbG9yU3BhY2UsXG5cdFx0XHRjdXN0b21Db2xvclJhd1xuXHRcdCk7XG5cblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGBudW1Cb3hlczogJHtwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApfVxcbnBhbGV0dGVUeXBlOiAke3BhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApfVxcbmluaXRpYWxDb2xvclNwYWNlOiAke2luaXRpYWxDb2xvclNwYWNlfVxcbmN1c3RvbUNvbG9yOiAke0pTT04uc3RyaW5naWZ5KGN1c3RvbUNvbG9yKX1gXG5cdFx0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRudW1Cb3hlczogcGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdHBhbGV0dGVUeXBlOiBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdGluaXRpYWxDb2xvclNwYWNlLFxuXHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOicsIGVycm9yKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5jb25zdCBoYW5kbGVHZW5CdXR0b25DbGljayA9IGNvcmUuZGVib3VuY2UoKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IGdldEdlbmVyYXRlQnV0dG9uUGFyYW1zKCk7XG5cblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnMnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB7IHBhbGV0dGVUeXBlLCBudW1Cb3hlcywgaW5pdGlhbENvbG9yU3BhY2UsIGN1c3RvbUNvbG9yIH0gPVxuXHRcdFx0cGFyYW1zO1xuXG5cdFx0aWYgKCFwYWxldHRlVHlwZSB8fCAhbnVtQm94ZXMpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ3BhbGV0dGVUeXBlIGFuZC9vciBudW1Cb3hlcyBhcmUgdW5kZWZpbmVkJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UgPSBpbml0aWFsQ29sb3JTcGFjZSA/PyAnaGV4JztcblxuXHRcdGdlbmVyYXRlLnN0YXJ0UGFsZXR0ZUdlbihwYWxldHRlVHlwZSwgbnVtQm94ZXMsIHNwYWNlLCBjdXN0b21Db2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGhhbmRsZSBnZW5lcmF0ZSBidXR0b24gY2xpY2s6ICR7ZXJyb3J9YCk7XG5cdH1cbn0sIGNvbmZpZy5idXR0b25EZWJvdW5jZSB8fCAzMDApO1xuXG5mdW5jdGlvbiBwb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChcblx0Y29sb3I6IHR5cGVzLkNvbG9yLFxuXHRib3hOdW1iZXI6IG51bWJlclxuKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFwYWxldHRlSGVscGVycy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBjb2xvciB2YWx1ZXMuJyk7XG5cdFx0XHRkb21IZWxwZXJzLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvciB2YWx1ZXMuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3QgaGV4Q29sb3IgPSBjb252ZXJzaW9uSGVscGVycy5jb252ZXJ0Q29sb3JUb0hleChjb2xvcik7XG5cblx0XHRpZiAoIWhleENvbG9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY29udmVydCBjb2xvciB0byBoZXgnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZyhgSGV4IGNvbG9yIHZhbHVlOiAke0pTT04uc3RyaW5naWZ5KGhleENvbG9yLnZhbHVlLmhleCl9YCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWUgPSBoZXhDb2xvci52YWx1ZS5oZXg7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCAnaGV4Jyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHBvcHVsYXRlIGNvbG9yIHRleHQgb3V0cHV0IGJveDonLCBlcnJvcik7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHB1bGxQYXJhbXNGcm9tVUkoKTogaW50ZXJmYWNlcy5QdWxsUGFyYW1zRnJvbVVJIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlVHlwZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLXR5cGUtb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLW51bWJlci1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuXHRcdGNvbnN0IGluaXRpYWxDb2xvclNwYWNlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2luaXRpYWwtY29sb3Itc3BhY2Utb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblxuXHRcdGNvbnN0IHBhbGV0dGVUeXBlID0gcGFsZXR0ZVR5cGVFbGVtZW50XG5cdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHQ6IDA7XG5cdFx0Y29uc3QgbnVtQm94ZXMgPSBudW1Cb3hlc0VsZW1lbnRcblx0XHRcdD8gcGFyc2VJbnQobnVtQm94ZXNFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdDogMDtcblx0XHRjb25zdCBpbml0aWFsQ29sb3JTcGFjZSA9XG5cdFx0XHRpbml0aWFsQ29sb3JTcGFjZUVsZW1lbnQgJiZcblx0XHRcdGd1YXJkcy5pc0NvbG9yU3BhY2UoaW5pdGlhbENvbG9yU3BhY2VFbGVtZW50LnZhbHVlKVxuXHRcdFx0XHQ/IChpbml0aWFsQ29sb3JTcGFjZUVsZW1lbnQudmFsdWUgYXMgdHlwZXMuQ29sb3JTcGFjZSlcblx0XHRcdFx0OiAnaGV4JztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGU6IDAsXG5cdFx0XHRudW1Cb3hlczogMCxcblx0XHRcdGluaXRpYWxDb2xvclNwYWNlOiAnaGV4J1xuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNob3dDdXN0b21Db2xvclBvcHVwRGl2KCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWRpdicpO1xuXG5cdFx0aWYgKHBvcHVwKSB7XG5cdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtZGl2JykgaXMgdW5kZWZpbmVkXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2hvdyBjdXN0b20gY29sb3IgcG9wdXAgZGl2OiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb206IGZuT2JqZWN0cy5ET00gPSB7XG5cdGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycyxcblx0YXBwbHlDdXN0b21Db2xvcixcblx0YXBwbHlGaXJzdENvbG9yVG9VSSxcblx0YXBwbHlJbml0aWFsQ29sb3JTcGFjZSxcblx0Y29udmVydENvbG9ycyxcblx0Y29weVRvQ2xpcGJvYXJkLFxuXHRkZWZpbmVVSUJ1dHRvbnMsXG5cdGRlc2F0dXJhdGVDb2xvcixcblx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRnZXRHZW5lcmF0ZUJ1dHRvblBhcmFtcyxcblx0aGFuZGxlR2VuQnV0dG9uQ2xpY2ssXG5cdHBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94LFxuXHRwdWxsUGFyYW1zRnJvbVVJLFxuXHRzYXR1cmF0ZUNvbG9yLFxuXHRzaG93Q3VzdG9tQ29sb3JQb3B1cERpdlxufTtcbiJdfQ==