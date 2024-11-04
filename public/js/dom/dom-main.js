import { getConversionFn } from '../utils/conversion-utils.js';
import { config } from '../config/constants.js';
import { domHelpers } from '../helpers/dom.js';
import { notification } from '../helpers/notification.js';
import { toHSL } from '../palette-gen/conversion-index.js';
import { generate } from '../palette-gen/generate.js';
import { randomHSL } from '../utils/random-color-utils.js';
import { core } from '../utils/core-utils.js';
import { colorUtils } from '../utils/color-utils.js';
import { commonUtils } from '../utils/common-utils.js';
import { paletteUtils } from '../utils/palette-utils.js';
function addConversionButtonEventListeners() {
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
function applyCustomColor() {
    try {
        const colorPicker = document.getElementById('custom-color-picker');
        if (!colorPicker) {
            throw new Error('Color picker element not found');
        }
        const rawValue = colorPicker.value.trim();
        const selectedFormat = document.getElementById('custom-color-format')?.value;
        if (!colorUtils.isColorSpace(selectedFormat)) {
            throw new Error(`Unsupported color format: ${selectedFormat}`);
        }
        const parsedColor = colorUtils.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            throw new Error(`Invalid color value: ${rawValue}`);
        }
        const hslColor = colorUtils.isHSLColor(parsedColor)
            ? parsedColor
            : toHSL(parsedColor);
        return hslColor;
    }
    catch (error) {
        console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return randomHSL(false);
    }
}
function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = colorUtils.getCSSColorString(color);
        if (!formatColorString) {
            console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        paletteUtils.populateColorTextOutputBox(color, 1);
        return color;
    }
    catch (error) {
        console.error(`Failed to apply first color to UI: ${error}`);
        return randomHSL(false);
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
function defineUIElements() {
    try {
        const applyCustomColorButton = config.applyCustomColorButton;
        const clearCustomColorButton = config.clearCustomColorButton;
        const customColorToggleButton = config.customColorToggleButton;
        const closeHelpMenuButton = config.closeHelpMenuButton;
        const closeHistoryMenuButton = config.closeHistoryMenuButton;
        const closeSubMenuAButton = config.closeSubMenuAButton;
        const closeSubMenuBButton = config.closeSubMenuBButton;
        const desaturateButton = config.desaturateButton;
        const enableAlphaCheckbox = config.enableAlphaCheckbox;
        const generateButton = config.generateButton;
        const limitBrightCheckbox = config.limitBrightCheckbox;
        const limitDarkCheckbox = config.limitDarkCheckbox;
        const limitGrayCheckbox = config.limitGrayCheckbox;
        const saturateButton = config.saturateButton;
        const selectedColorOptions = config.selectedColorOptions;
        const showAsCMYKButton = config.showAsCMYKButton;
        const showAsHexButton = config.showAsHexButton;
        const showAsHSLButton = config.showAsHSLButton;
        const showAsHSVButton = config.showAsHSVButton;
        const showAsLABButton = config.showAsLABButton;
        const showAsRGBButton = config.showAsRGBButton;
        const showHelpMenuButton = config.showHelpMenuButton;
        const showHistoryMenuButton = config.showHistoryMenuButton;
        const subMenuToggleButtonA = config.subMenuToggleButtonA;
        const subMenuToggleButtonB = config.subMenuToggleButtonB;
        const selectedColor = selectedColorOptions
            ? parseInt(selectedColorOptions.value, 10)
            : 0;
        return {
            applyCustomColorButton,
            clearCustomColorButton,
            closeHelpMenuButton,
            closeHistoryMenuButton,
            closeSubMenuAButton,
            closeSubMenuBButton,
            customColorToggleButton,
            desaturateButton,
            enableAlphaCheckbox,
            generateButton,
            limitBrightCheckbox,
            limitDarkCheckbox,
            limitGrayCheckbox,
            saturateButton,
            selectedColor,
            showAsCMYKButton,
            showAsHexButton,
            showAsHSLButton,
            showAsHSVButton,
            showAsLABButton,
            showAsRGBButton,
            showHelpMenuButton,
            showHistoryMenuButton,
            subMenuToggleButtonA,
            subMenuToggleButtonB
        };
    }
    catch (error) {
        console.error('Failed to define UI buttons:', error);
        return {
            applyCustomColorButton: null,
            clearCustomColorButton: null,
            closeHelpMenuButton: null,
            closeHistoryMenuButton: null,
            closeSubMenuAButton: null,
            closeSubMenuBButton: null,
            customColorToggleButton: null,
            desaturateButton: null,
            enableAlphaCheckbox: null,
            generateButton: null,
            limitBrightCheckbox: null,
            limitDarkCheckbox: null,
            limitGrayCheckbox: null,
            saturateButton: null,
            selectedColor: 0,
            showAsCMYKButton: null,
            showAsHexButton: null,
            showAsHSLButton: null,
            showAsHSVButton: null,
            showAsLABButton: null,
            showAsRGBButton: null,
            showHelpMenuButton: null,
            showHistoryMenuButton: null,
            subMenuToggleButtonA: null,
            subMenuToggleButtonB: null
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
        notification.showToast('Please select a valid color.');
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
        const paletteNumberOptions = config.paletteNumberOptions;
        const paletteTypeOptions = config.paletteTypeOptions;
        const customColorRaw = config.customColorElement?.value;
        const enableAlphaCheckbox = config.enableAlphaCheckbox;
        const limitBrightCheckbox = config.limitBrightCheckbox;
        const limitDarkCheckbox = config.limitDarkCheckbox;
        const limitGrayCheckbox = config.limitGrayCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitBrightCheckbox === null ||
            limitDarkCheckbox === null ||
            limitGrayCheckbox === null) {
            console.error('One or more elements are null');
            return null;
        }
        console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? colorUtils.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitBright: limitBrightCheckbox.checked,
            limitDark: limitDarkCheckbox.checked,
            limitGray: limitGrayCheckbox.checked
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
        const { numBoxes, customColor, paletteType, enableAlpha, limitBright, limitDark, limitGray } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const options = {
            numBoxes,
            customColor,
            paletteType,
            enableAlpha,
            limitBright,
            limitDark,
            limitGray
        };
        generate.startPaletteGen(options);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, config.buttonDebounce || 300);
function pullParamsFromUI() {
    try {
        const paletteTypeOptionsElement = config.paletteTypeOptions;
        const numBoxesElement = config.paletteNumberOptions;
        const enableAlphaCheckbox = config.enableAlphaCheckbox;
        const limitBrightCheckbox = config.limitBrightCheckbox;
        const limitDarkCheckbox = config.limitDarkCheckbox;
        const limitGrayCheckbox = config.limitGrayCheckbox;
        return {
            paletteType: paletteTypeOptionsElement
                ? parseInt(paletteTypeOptionsElement.value, 10)
                : 0,
            numBoxes: numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0,
            enableAlpha: enableAlphaCheckbox?.checked || false,
            limitBright: limitBrightCheckbox?.checked || false,
            limitDark: limitDarkCheckbox?.checked || false,
            limitGray: limitGrayCheckbox?.checked || false
        };
    }
    catch (error) {
        console.error(`Failed to pull parameters from UI: ${error}`);
        return {
            paletteType: 0,
            numBoxes: 0,
            enableAlpha: false,
            limitBright: false,
            limitDark: false,
            limitGray: false
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
function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !commonUtils.validateColorValues(colorValues)) {
                console.error('Invalid color values.');
                notification.showToast('Invalid color values.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                notification.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                console.error('Cannot convert from XYZ to another color space.');
                notification.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = colorUtils.narrowToColor(colorValues);
            if (!clonedColor ||
                colorUtils.isSLColor(clonedColor) ||
                colorUtils.isSVColor(clonedColor) ||
                colorUtils.isXYZ(clonedColor)) {
                console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                notification.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                notification.showToast('Conversion failed.');
                return;
            }
            const newColor = core.clone(convertFn(clonedColor));
            if (!newColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                notification.showToast('Conversion failed.');
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
export const domFn = {
    addConversionButtonEventListeners,
    applyCustomColor,
    applyFirstColorToUI,
    copyToClipboard,
    defineUIElements,
    desaturateColor,
    getElementsForSelectedColor,
    getGenerateButtonParams,
    handleGenButtonClick,
    pullParamsFromUI,
    saturateColor,
    showCustomColorPopupDiv,
    switchColorSpace
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZG9tL2RvbS1tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUl2RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDeEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdEQsU0FBUyxpQ0FBaUM7SUFDekMsSUFBSSxDQUFDO1FBQ0osTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFVLEVBQUUsVUFBNkIsRUFBRSxFQUFFO1lBQ2pFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ3JDLEVBQUUsQ0FDMEIsQ0FBQztZQUU5QixJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQ3JDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUM1QixDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVB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QUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLGdCQUFnQjtDQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0Q29udmVyc2lvbkZuIH0gZnJvbSAnLi4vdXRpbHMvY29udmVyc2lvbi11dGlscyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uc3RhbnRzJztcbmltcG9ydCB7IGRvbUhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tICcuLi9oZWxwZXJzL25vdGlmaWNhdGlvbic7XG5pbXBvcnQgKiBhcyBmbk9iamVjdHMgZnJvbSAnLi4vaW5kZXgvZm4tb2JqZWN0cyc7XG5pbXBvcnQgKiBhcyBjb2xvcnMgZnJvbSAnLi4vaW5kZXgvY29sb3JzJztcbmltcG9ydCAqIGFzIGRvbVR5cGVzIGZyb20gJy4uL2luZGV4L2RvbS10eXBlcyc7XG5pbXBvcnQgeyB0b0hTTCB9IGZyb20gJy4uL3BhbGV0dGUtZ2VuL2NvbnZlcnNpb24taW5kZXgnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICcuLi9wYWxldHRlLWdlbi9nZW5lcmF0ZSc7XG5pbXBvcnQgeyByYW5kb21IU0wgfSBmcm9tICcuLi91dGlscy9yYW5kb20tY29sb3ItdXRpbHMnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL3V0aWxzL2NvcmUtdXRpbHMnO1xuaW1wb3J0IHsgY29sb3JVdGlscyB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7IGNvbW1vblV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvY29tbW9uLXV0aWxzJztcbmltcG9ydCB7IHBhbGV0dGVVdGlscyB9IGZyb20gJy4uL3V0aWxzL3BhbGV0dGUtdXRpbHMnO1xuXG5mdW5jdGlvbiBhZGRDb252ZXJzaW9uQnV0dG9uRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgYWRkTGlzdGVuZXIgPSAoaWQ6IHN0cmluZywgY29sb3JTcGFjZTogY29sb3JzLkNvbG9yU3BhY2UpID0+IHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRpZFxuXHRcdFx0KSBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmIChidXR0b24pIHtcblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cblx0XHRcdFx0XHRzd2l0Y2hDb2xvclNwYWNlKGNvbG9yU3BhY2UpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1jbXlrLWJ1dHRvbicsICdjbXlrJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtaGV4LWJ1dHRvbicsICdoZXgnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1oc2wtYnV0dG9uJywgJ2hzbCcpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWhzdi1idXR0b24nLCAnaHN2Jyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtbGFiLWJ1dHRvbicsICdsYWInKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1yZ2ItYnV0dG9uJywgJ3JnYicpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgRmFpbGVkIHRvIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gY29udmVyc2lvbiBidXR0b25zOiAke2Vycm9yfWBcblx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ29sb3IoKTogY29sb3JzLkhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdjdXN0b20tY29sb3ItcGlja2VyJ1xuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yUGlja2VyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIHBpY2tlciBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJhd1ZhbHVlID0gY29sb3JQaWNrZXIudmFsdWUudHJpbSgpO1xuXHRcdGNvbnN0IHNlbGVjdGVkRm9ybWF0ID0gKFxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdCdjdXN0b20tY29sb3ItZm9ybWF0J1xuXHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGxcblx0XHQpPy52YWx1ZSBhcyBjb2xvcnMuQ29sb3JTcGFjZTtcblxuXHRcdGlmICghY29sb3JVdGlscy5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJzZWRDb2xvciA9IGNvbG9yVXRpbHMucGFyc2VDb2xvcihcblx0XHRcdHNlbGVjdGVkRm9ybWF0LFxuXHRcdFx0cmF3VmFsdWVcblx0XHQpIGFzIEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuU0wgfCBjb2xvcnMuU1Y+O1xuXG5cdFx0aWYgKCFwYXJzZWRDb2xvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGhzbENvbG9yID0gY29sb3JVdGlscy5pc0hTTENvbG9yKHBhcnNlZENvbG9yKVxuXHRcdFx0PyBwYXJzZWRDb2xvclxuXHRcdFx0OiB0b0hTTChwYXJzZWRDb2xvcik7XG5cblx0XHRyZXR1cm4gaHNsQ29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgXG5cdFx0KTtcblxuXHRcdHJldHVybiByYW5kb21IU0woZmFsc2UpIGFzIGNvbG9ycy5IU0w7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogY29sb3JzLkhTTCk6IGNvbG9ycy5IU0wge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yQm94MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1ib3gtMScpO1xuXG5cdFx0aWYgKCFjb2xvckJveDEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvcm1hdENvbG9yU3RyaW5nID0gY29sb3JVdGlscy5nZXRDU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIG9yIHVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdC4nKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbG9yQm94MS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmb3JtYXRDb2xvclN0cmluZztcblxuXHRcdHBhbGV0dGVVdGlscy5wb3B1bGF0ZUNvbG9yVGV4dE91dHB1dEJveChjb2xvciwgMSk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHJhbmRvbUhTTChmYWxzZSkgYXMgY29sb3JzLkhTTDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGRvbUhlbHBlcnMuc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQ29waWVkIGNvbG9yIHZhbHVlOiAke2NvbG9yVmFsdWV9YCk7XG5cblx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0Y29uZmlnLnRvb2x0aXBUaW1lb3V0IHx8IDEwMDBcblx0XHRcdFx0KTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6JywgZXJyKTtcblx0XHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZWZpbmVVSUVsZW1lbnRzKCk6IGRvbVR5cGVzLlVJRWxlbWVudHMge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBjb25maWcuYXBwbHlDdXN0b21Db2xvckJ1dHRvbjtcblx0XHRjb25zdCBjbGVhckN1c3RvbUNvbG9yQnV0dG9uID0gY29uZmlnLmNsZWFyQ3VzdG9tQ29sb3JCdXR0b247XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JUb2dnbGVCdXR0b24gPSBjb25maWcuY3VzdG9tQ29sb3JUb2dnbGVCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VIZWxwTWVudUJ1dHRvbiA9IGNvbmZpZy5jbG9zZUhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlSGlzdG9yeU1lbnVCdXR0b24gPSBjb25maWcuY2xvc2VIaXN0b3J5TWVudUJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZVN1Yk1lbnVBQnV0dG9uID0gY29uZmlnLmNsb3NlU3ViTWVudUFCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VTdWJNZW51QkJ1dHRvbiA9IGNvbmZpZy5jbG9zZVN1Yk1lbnVCQnV0dG9uO1xuXHRcdGNvbnN0IGRlc2F0dXJhdGVCdXR0b24gPSBjb25maWcuZGVzYXR1cmF0ZUJ1dHRvbjtcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID0gY29uZmlnLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgZ2VuZXJhdGVCdXR0b24gPSBjb25maWcuZ2VuZXJhdGVCdXR0b247XG5cdFx0Y29uc3QgbGltaXRCcmlnaHRDaGVja2JveCA9IGNvbmZpZy5saW1pdEJyaWdodENoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya0NoZWNrYm94ID0gY29uZmlnLmxpbWl0RGFya0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0R3JheUNoZWNrYm94ID0gY29uZmlnLmxpbWl0R3JheUNoZWNrYm94O1xuXHRcdGNvbnN0IHNhdHVyYXRlQnV0dG9uID0gY29uZmlnLnNhdHVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb25zID0gY29uZmlnLnNlbGVjdGVkQ29sb3JPcHRpb25zO1xuXHRcdGNvbnN0IHNob3dBc0NNWUtCdXR0b24gPSBjb25maWcuc2hvd0FzQ01ZS0J1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIZXhCdXR0b24gPSBjb25maWcuc2hvd0FzSGV4QnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hTTEJ1dHRvbiA9IGNvbmZpZy5zaG93QXNIU0xCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSFNWQnV0dG9uID0gY29uZmlnLnNob3dBc0hTVkJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNMQUJCdXR0b24gPSBjb25maWcuc2hvd0FzTEFCQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc1JHQkJ1dHRvbiA9IGNvbmZpZy5zaG93QXNSR0JCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0hlbHBNZW51QnV0dG9uID0gY29uZmlnLnNob3dIZWxwTWVudUJ1dHRvbjtcblx0XHRjb25zdCBzaG93SGlzdG9yeU1lbnVCdXR0b24gPSBjb25maWcuc2hvd0hpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IHN1Yk1lbnVUb2dnbGVCdXR0b25BID0gY29uZmlnLnN1Yk1lbnVUb2dnbGVCdXR0b25BO1xuXHRcdGNvbnN0IHN1Yk1lbnVUb2dnbGVCdXR0b25CID0gY29uZmlnLnN1Yk1lbnVUb2dnbGVCdXR0b25CO1xuXG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25zXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb25zLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0Y2xvc2VTdWJNZW51QUJ1dHRvbixcblx0XHRcdGNsb3NlU3ViTWVudUJCdXR0b24sXG5cdFx0XHRjdXN0b21Db2xvclRvZ2dsZUJ1dHRvbixcblx0XHRcdGRlc2F0dXJhdGVCdXR0b24sXG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94LFxuXHRcdFx0Z2VuZXJhdGVCdXR0b24sXG5cdFx0XHRsaW1pdEJyaWdodENoZWNrYm94LFxuXHRcdFx0bGltaXREYXJrQ2hlY2tib3gsXG5cdFx0XHRsaW1pdEdyYXlDaGVja2JveCxcblx0XHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0c2VsZWN0ZWRDb2xvcixcblx0XHRcdHNob3dBc0NNWUtCdXR0b24sXG5cdFx0XHRzaG93QXNIZXhCdXR0b24sXG5cdFx0XHRzaG93QXNIU0xCdXR0b24sXG5cdFx0XHRzaG93QXNIU1ZCdXR0b24sXG5cdFx0XHRzaG93QXNMQUJCdXR0b24sXG5cdFx0XHRzaG93QXNSR0JCdXR0b24sXG5cdFx0XHRzaG93SGVscE1lbnVCdXR0b24sXG5cdFx0XHRzaG93SGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0XHRzdWJNZW51VG9nZ2xlQnV0dG9uQSxcblx0XHRcdHN1Yk1lbnVUb2dnbGVCdXR0b25CXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZGVmaW5lIFVJIGJ1dHRvbnM6JywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VIZWxwTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZVN1Yk1lbnVBQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VTdWJNZW51QkJ1dHRvbjogbnVsbCxcblx0XHRcdGN1c3RvbUNvbG9yVG9nZ2xlQnV0dG9uOiBudWxsLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGxpbWl0QnJpZ2h0Q2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdERhcmtDaGVja2JveDogbnVsbCxcblx0XHRcdGxpbWl0R3JheUNoZWNrYm94OiBudWxsLFxuXHRcdFx0c2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yOiAwLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hleEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTTEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTVkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0xBQkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc1JHQkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dIZWxwTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dIaXN0b3J5TWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdHN1Yk1lbnVUb2dnbGVCdXR0b25BOiBudWxsLFxuXHRcdFx0c3ViTWVudVRvZ2dsZUJ1dHRvbkI6IG51bGxcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKFxuXHRzZWxlY3RlZENvbG9yOiBudW1iZXJcbik6IGRvbVR5cGVzLkdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvciB7XG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRgY29sb3ItYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdCk7XG5cblx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0Y29uc29sZS53YXJuKGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdFx0bm90aWZpY2F0aW9uLnNob3dUb2FzdCgnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLicpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KSxcblx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdClcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2V0R2VuZXJhdGVCdXR0b25QYXJhbXMoKTogZG9tVHlwZXMuR2VuQnV0dG9uUGFyYW1zIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBjb25maWcucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0Y29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zID0gY29uZmlnLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRjb25zdCBjdXN0b21Db2xvclJhdyA9IGNvbmZpZy5jdXN0b21Db2xvckVsZW1lbnQ/LnZhbHVlO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBjb25maWcuZW5hYmxlQWxwaGFDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEJyaWdodENoZWNrYm94ID0gY29uZmlnLmxpbWl0QnJpZ2h0Q2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXREYXJrQ2hlY2tib3ggPSBjb25maWcubGltaXREYXJrQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5Q2hlY2tib3ggPSBjb25maWcubGltaXRHcmF5Q2hlY2tib3g7XG5cblx0XHRpZiAoXG5cdFx0XHRwYWxldHRlTnVtYmVyT3B0aW9ucyA9PT0gbnVsbCB8fFxuXHRcdFx0cGFsZXR0ZVR5cGVPcHRpb25zID09PSBudWxsIHx8XG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdEJyaWdodENoZWNrYm94ID09PSBudWxsIHx8XG5cdFx0XHRsaW1pdERhcmtDaGVja2JveCA9PT0gbnVsbCB8fFxuXHRcdFx0bGltaXRHcmF5Q2hlY2tib3ggPT09IG51bGxcblx0XHQpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ09uZSBvciBtb3JlIGVsZW1lbnRzIGFyZSBudWxsJyk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0YG51bUJveGVzOiAke3BhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCl9XFxucGFsZXR0ZVR5cGU6ICR7cGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCl9YFxuXHRcdCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bnVtQm94ZXM6IHBhcnNlSW50KHBhbGV0dGVOdW1iZXJPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRwYWxldHRlVHlwZTogcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zLnZhbHVlLCAxMCksXG5cdFx0XHRjdXN0b21Db2xvcjogY3VzdG9tQ29sb3JSYXdcblx0XHRcdFx0PyAoY29sb3JVdGlscy5wYXJzZUN1c3RvbUNvbG9yKFxuXHRcdFx0XHRcdFx0Y3VzdG9tQ29sb3JSYXdcblx0XHRcdFx0XHQpIGFzIGNvbG9ycy5IU0wgfCBudWxsKVxuXHRcdFx0XHQ6IG51bGwsXG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveC5jaGVja2VkLFxuXHRcdFx0bGltaXRCcmlnaHQ6IGxpbWl0QnJpZ2h0Q2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0RGFyazogbGltaXREYXJrQ2hlY2tib3guY2hlY2tlZCxcblx0XHRcdGxpbWl0R3JheTogbGltaXRHcmF5Q2hlY2tib3guY2hlY2tlZFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIGdlbmVyYXRlQnV0dG9uIHBhcmFtZXRlcnM6JywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuY29uc3QgaGFuZGxlR2VuQnV0dG9uQ2xpY2sgPSBjb3JlLmRlYm91bmNlKCgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYXJhbXMgPSBnZXRHZW5lcmF0ZUJ1dHRvblBhcmFtcygpO1xuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdEJyaWdodCxcblx0XHRcdGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheVxuXHRcdH0gPSBwYXJhbXM7XG5cblx0XHRpZiAoIXBhbGV0dGVUeXBlIHx8ICFudW1Cb3hlcykge1xuXHRcdFx0Y29uc29sZS5lcnJvcigncGFsZXR0ZVR5cGUgYW5kL29yIG51bUJveGVzIGFyZSB1bmRlZmluZWQnKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IGNvbG9ycy5QYWxldHRlT3B0aW9ucyA9IHtcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXRCcmlnaHQsXG5cdFx0XHRsaW1pdERhcmssXG5cdFx0XHRsaW1pdEdyYXlcblx0XHR9O1xuXG5cdFx0Z2VuZXJhdGUuc3RhcnRQYWxldHRlR2VuKG9wdGlvbnMpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBoYW5kbGUgZ2VuZXJhdGUgYnV0dG9uIGNsaWNrOiAke2Vycm9yfWApO1xuXHR9XG59LCBjb25maWcuYnV0dG9uRGVib3VuY2UgfHwgMzAwKTtcblxuZnVuY3Rpb24gcHVsbFBhcmFtc0Zyb21VSSgpOiBkb21UeXBlcy5QdWxsUGFyYW1zRnJvbVVJIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50ID0gY29uZmlnLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBjb25maWcucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9IGNvbmZpZy5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0QnJpZ2h0Q2hlY2tib3ggPSBjb25maWcubGltaXRCcmlnaHRDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdERhcmtDaGVja2JveCA9IGNvbmZpZy5saW1pdERhcmtDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXlDaGVja2JveCA9IGNvbmZpZy5saW1pdEdyYXlDaGVja2JveDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwYWxldHRlVHlwZTogcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudFxuXHRcdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHQ6IDAsXG5cdFx0XHRudW1Cb3hlczogbnVtQm94ZXNFbGVtZW50ID8gcGFyc2VJbnQobnVtQm94ZXNFbGVtZW50LnZhbHVlLCAxMCkgOiAwLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdEJyaWdodDogbGltaXRCcmlnaHRDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0RGFyazogbGltaXREYXJrQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdEdyYXk6IGxpbWl0R3JheUNoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcHVsbCBwYXJhbWV0ZXJzIGZyb20gVUk6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiAwLFxuXHRcdFx0bnVtQm94ZXM6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRsaW1pdEJyaWdodDogZmFsc2UsXG5cdFx0XHRsaW1pdERhcms6IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5OiBmYWxzZVxuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNob3dDdXN0b21Db2xvclBvcHVwRGl2KCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWRpdicpO1xuXG5cdFx0aWYgKHBvcHVwKSB7XG5cdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtZGl2JykgaXMgdW5kZWZpbmVkXCIpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBzaG93IGN1c3RvbSBjb2xvciBwb3B1cCBkaXY6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3dpdGNoQ29sb3JTcGFjZSh0YXJnZXRGb3JtYXQ6IGNvbG9ycy5Db2xvclNwYWNlKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94ZXMuZm9yRWFjaChib3ggPT4ge1xuXHRcdFx0Y29uc3QgaW5wdXRCb3ggPSBib3ggYXMgZG9tVHlwZXMuQ29sb3JJbnB1dEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGlucHV0Qm94LmNvbG9yVmFsdWVzO1xuXG5cdFx0XHRpZiAoIWNvbG9yVmFsdWVzIHx8ICFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yVmFsdWVzKSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0XHRub3RpZmljYXRpb24uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yIHZhbHVlcy4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRGb3JtYXQgPSBpbnB1dEJveC5nZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdkYXRhLWZvcm1hdCdcblx0XHRcdCkgYXMgY29sb3JzLkNvbG9yU3BhY2U7XG5cblx0XHRcdGNvbnNvbGUubG9nKGBDb252ZXJ0aW5nIGZyb20gJHtjdXJyZW50Rm9ybWF0fSB0byAke3RhcmdldEZvcm1hdH1gKTtcblxuXHRcdFx0Y29uc3QgY29udmVydEZuID0gZ2V0Q29udmVyc2lvbkZuKGN1cnJlbnRGb3JtYXQsIHRhcmdldEZvcm1hdCk7XG5cblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRub3RpZmljYXRpb24uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29sb3JWYWx1ZXMuZm9ybWF0ID09PSAneHl6Jykge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFhZWiB0byBhbm90aGVyIGNvbG9yIHNwYWNlLidcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRub3RpZmljYXRpb24uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNvbG9yVXRpbHMubmFycm93VG9Db2xvcihjb2xvclZhbHVlcyk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0IWNsb25lZENvbG9yIHx8XG5cdFx0XHRcdGNvbG9yVXRpbHMuaXNTTENvbG9yKGNsb25lZENvbG9yKSB8fFxuXHRcdFx0XHRjb2xvclV0aWxzLmlzU1ZDb2xvcihjbG9uZWRDb2xvcikgfHxcblx0XHRcdFx0Y29sb3JVdGlscy5pc1hZWihjbG9uZWRDb2xvcilcblx0XHRcdCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdCdDYW5ub3QgY29udmVydCBmcm9tIFNMLCBTViwgb3IgWFlaIGNvbG9yIHNwYWNlcy4gUGxlYXNlIGNvbnZlcnQgdG8gYSBzdXBwb3J0ZWQgZm9ybWF0IGZpcnN0Lidcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRub3RpZmljYXRpb24uc2hvd1RvYXN0KCdDb252ZXJzaW9uIG5vdCBzdXBwb3J0ZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWNsb25lZENvbG9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYENvbnZlcnNpb24gdG8gJHt0YXJnZXRGb3JtYXR9IGZhaWxlZC5gKTtcblxuXHRcdFx0XHRub3RpZmljYXRpb24uc2hvd1RvYXN0KCdDb252ZXJzaW9uIGZhaWxlZC4nKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld0NvbG9yID0gY29yZS5jbG9uZShjb252ZXJ0Rm4oY2xvbmVkQ29sb3IpKTtcblxuXHRcdFx0aWYgKCFuZXdDb2xvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBDb252ZXJzaW9uIHRvICR7dGFyZ2V0Rm9ybWF0fSBmYWlsZWQuYCk7XG5cblx0XHRcdFx0bm90aWZpY2F0aW9uLnNob3dUb2FzdCgnQ29udmVyc2lvbiBmYWlsZWQuJyk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpbnB1dEJveC52YWx1ZSA9IFN0cmluZyhuZXdDb2xvcik7XG5cblx0XHRcdGlucHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCB0YXJnZXRGb3JtYXQpO1xuXHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOiAke2Vycm9yIGFzIEVycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb21GbjogZm5PYmplY3RzLkRPTUZuID0ge1xuXHRhZGRDb252ZXJzaW9uQnV0dG9uRXZlbnRMaXN0ZW5lcnMsXG5cdGFwcGx5Q3VzdG9tQ29sb3IsXG5cdGFwcGx5Rmlyc3RDb2xvclRvVUksXG5cdGNvcHlUb0NsaXBib2FyZCxcblx0ZGVmaW5lVUlFbGVtZW50cyxcblx0ZGVzYXR1cmF0ZUNvbG9yLFxuXHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3IsXG5cdGdldEdlbmVyYXRlQnV0dG9uUGFyYW1zLFxuXHRoYW5kbGVHZW5CdXR0b25DbGljayxcblx0cHVsbFBhcmFtc0Zyb21VSSxcblx0c2F0dXJhdGVDb2xvcixcblx0c2hvd0N1c3RvbUNvbG9yUG9wdXBEaXYsXG5cdHN3aXRjaENvbG9yU3BhY2Vcbn07XG4iXX0=