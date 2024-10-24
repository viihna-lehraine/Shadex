import { getConversionFn } from '../color-conversion/conversion.js';
import { conversionHelpers } from '../helpers/conversion.js';
import { domHelpers } from '../helpers/dom.js';
import { generate } from '../palette-gen/generate.js';
import { random } from '../utils/color-randomizer.js';
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
            if (!(box instanceof HTMLInputElement)) {
                console.error('Invalid input element.');
                return;
            }
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues) {
                console.error('Missing color values.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!guards.isColorSpace(currentFormat) ||
                !guards.isColorSpace(targetFormat)) {
                console.error(`Invalid format: ${currentFormat} or ${targetFormat}`);
                return;
            }
            if (colorValues.format === 'xyz') {
                console.warn('Skipping XYZ color type');
                return;
            }
            const convertFn = getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                return;
            }
            if (guards.isConvertibleColor(colorValues)) {
                const newColor = convertFn(colorValues);
                if (!newColor) {
                    console.error(`Conversion to ${targetFormat} failed.`);
                    return;
                }
                inputBox.value = String(newColor);
                inputBox.setAttribute('data-format', targetFormat);
            }
            else {
                console.error(`Invalid color type for conversion.`);
            }
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
    try {
        return {
            selectedColorTextOutputBox: document.getElementById(`color-text-output-box-${selectedColor}`),
            selectedColorBox: document.getElementById(`color-box-${selectedColor}`),
            selectedColorStripe: document.getElementById(`color-stripe-${selectedColor}`)
        };
    }
    catch (error) {
        console.error('Failed to get elements for selected color:', error);
        return {
            selectedColorTextOutputBox: null,
            selectedColorBox: null,
            selectedColorStripe: null
        };
    }
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
function handleGenButtonClick() {
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
}
function populateColorTextOutputBox(color, boxNumber) {
    try {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZG9tL2RvbS1tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRTlDLFNBQVMsaUNBQWlDO0lBQ3pDLElBQUksQ0FBQztRQUNKLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBVSxFQUFFLFVBQTRCLEVBQUUsRUFBRTtZQUNoRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNyQyxFQUFFLENBQzBCLENBQUM7WUFFOUIsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDWixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUNyQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQ3pCLENBQUM7WUFDSCxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNwRCxDQUFDO1FBQ0YsQ0FBQyxDQUFDO1FBRUYsV0FBVyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUMsV0FBVyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5QyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FDWix3REFBd0QsS0FBSyxFQUFFLENBQy9ELENBQUM7UUFDRixPQUFPO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGdCQUFnQjtJQUN4QixJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUMxQyxxQkFBcUIsQ0FDTSxDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUMsTUFBTSxjQUFjLEdBQ25CLFFBQVEsQ0FBQyxjQUFjLENBQ3RCLHFCQUFxQixDQUV0QixFQUFFLEtBQXlCLENBQUM7UUFFN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDcEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FDWixpQ0FBaUMsS0FBSywwQ0FBMEMsQ0FDaEYsQ0FBQztRQUNGLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsaUJBQW1DO0lBQy9ELElBQUksQ0FBQztRQUNKLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDckMsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUN6RCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxTQUFTLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztRQUVwRCwwQkFBMEIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckMsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsc0JBQXNCO0lBQzlCLElBQUksQ0FBQztRQUNKLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ3RDLDRCQUE0QixDQUNQLENBQUM7UUFFdkIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUU1QixJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNoQyxPQUFPLEtBQXlCLENBQUM7UUFDbEMsQ0FBQzthQUFNLENBQUM7WUFDUCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdELE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxZQUE4QjtJQUNwRCxJQUFJLENBQUM7UUFDSixNQUFNLG9CQUFvQixHQUN6QixRQUFRLENBQUMsZ0JBQWdCLENBQ3hCLHdCQUF3QixDQUN4QixDQUFDO1FBRUgsb0JBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDeEMsT0FBTztZQUNSLENBQUM7WUFFRCxNQUFNLFFBQVEsR0FBRyxHQUFtQyxDQUFDO1lBQ3JELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFFekMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3ZDLE9BQU87WUFDUixDQUFDO1lBRUQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FDMUMsYUFBYSxDQUNPLENBQUM7WUFFdEIsSUFDQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO2dCQUNuQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQ2pDLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLEtBQUssQ0FDWixtQkFBbUIsYUFBYSxPQUFPLFlBQVksRUFBRSxDQUNyRCxDQUFDO2dCQUNGLE9BQU87WUFDUixDQUFDO1lBRUQsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRSxDQUFDO2dCQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7Z0JBQ3hDLE9BQU87WUFDUixDQUFDO1lBRUQsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQ1osbUJBQW1CLGFBQWEsT0FBTyxZQUFZLG9CQUFvQixDQUN2RSxDQUFDO2dCQUNGLE9BQU87WUFDUixDQUFDO1lBRUQsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDNUMsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsWUFBWSxVQUFVLENBQUMsQ0FBQztvQkFDdkQsT0FBTztnQkFDUixDQUFDO2dCQUVELFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNwRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxJQUFZLEVBQUUsY0FBMkI7SUFDakUsSUFBSSxDQUFDO1FBQ0osTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVuRSxTQUFTLENBQUMsU0FBUzthQUNqQixTQUFTLENBQUMsVUFBVSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVixVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGVBQWU7SUFDdkIsSUFBSSxDQUFDO1FBQ0osTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNsRSxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN0RSxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdEUsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNyRCwyQkFBMkIsQ0FDM0IsQ0FBQztRQUNGLE1BQU0sc0JBQXNCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDckQsMkJBQTJCLENBQzNCLENBQUM7UUFDRixNQUFNLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ3ZELDZCQUE2QixDQUM3QixDQUFDO1FBQ0YsTUFBTSw0QkFBNEIsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUMzRCxrQ0FBa0MsQ0FDbEMsQ0FBQztRQUNGLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDbkQsd0JBQXdCLENBQ0ksQ0FBQztRQUM5QixNQUFNLGFBQWEsR0FBRyxvQkFBb0I7WUFDekMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTCxPQUFPO1lBQ04sY0FBYztZQUNkLGNBQWM7WUFDZCxnQkFBZ0I7WUFDaEIsY0FBYztZQUNkLHNCQUFzQjtZQUN0QixzQkFBc0I7WUFDdEIsd0JBQXdCO1lBQ3hCLDRCQUE0QjtZQUM1QixhQUFhO1NBQ2IsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsT0FBTztZQUNOLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsY0FBYyxFQUFFLElBQUk7WUFDcEIsc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixzQkFBc0IsRUFBRSxJQUFJO1lBQzVCLHdCQUF3QixFQUFFLElBQUk7WUFDOUIsNEJBQTRCLEVBQUUsSUFBSTtZQUNsQyxhQUFhLEVBQUUsQ0FBQztTQUNoQixDQUFDO0lBQ0gsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxhQUFxQjtJQUM3QyxJQUFJLENBQUM7UUFDSiwyQkFBMkIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUywyQkFBMkIsQ0FDbkMsYUFBcUI7SUFFckIsSUFBSSxDQUFDO1FBQ0osT0FBTztZQUNOLDBCQUEwQixFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQ2xELHlCQUF5QixhQUFhLEVBQUUsQ0FDeEM7WUFDRCxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUN4QyxhQUFhLGFBQWEsRUFBRSxDQUM1QjtZQUNELG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQzNDLGdCQUFnQixhQUFhLEVBQUUsQ0FDL0I7U0FDRCxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRSxPQUFPO1lBQ04sMEJBQTBCLEVBQUUsSUFBSTtZQUNoQyxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLG1CQUFtQixFQUFFLElBQUk7U0FDekIsQ0FBQztJQUNILENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUyx1QkFBdUI7SUFDL0IsSUFBSSxDQUFDO1FBQ0osTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNqRCxzQkFBc0IsQ0FDRCxDQUFDO1FBQ3ZCLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDbkQsd0JBQXdCLENBQ0osQ0FBQztRQUN0QixNQUFNLGVBQWUsR0FDcEIsUUFBUSxDQUFDLGNBQWMsQ0FDdEIsNEJBQTRCLENBRTdCLEVBQUUsS0FBSyxDQUFDO1FBQ1QsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQztZQUM3RCxDQUFDLENBQUUsZUFBb0M7WUFDdkMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNULE1BQU0sY0FBYyxHQUNuQixRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FDdEMsRUFBRSxLQUFLLENBQUM7UUFDVCxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQzlDLGlCQUFpQixFQUNqQixjQUFjLENBQ2QsQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQ1YsYUFBYSxRQUFRLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsd0JBQXdCLGlCQUFpQixrQkFBa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUNyTSxDQUFDO1FBRUYsT0FBTztZQUNOLFFBQVEsRUFBRSxRQUFRLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUNsRCxXQUFXLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDbkQsaUJBQWlCO1lBQ2pCLFdBQVc7U0FDWCxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQywrQ0FBK0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RSxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUyxvQkFBb0I7SUFDNUIsSUFBSSxDQUFDO1FBQ0osTUFBTSxNQUFNLEdBQUcsdUJBQXVCLEVBQUUsQ0FBQztRQUV6QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDOUQsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsR0FDOUQsTUFBTSxDQUFDO1FBRVIsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztZQUMzRCxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFxQixpQkFBaUIsSUFBSSxLQUFLLENBQUM7UUFFM0QsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUywwQkFBMEIsQ0FDbEMsS0FBa0IsRUFDbEIsU0FBaUI7SUFFakIsSUFBSSxDQUFDO1FBQ0osTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNqRCx5QkFBeUIsU0FBUyxFQUFFLENBQ1QsQ0FBQztRQUU3QixJQUFJLENBQUMsa0JBQWtCO1lBQUUsT0FBTztRQUVoQyxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDaEQsT0FBTztRQUNSLENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXRFLGtCQUFrQixDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUM5QyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEUsT0FBTztJQUNSLENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUyxnQkFBZ0I7SUFDeEIsSUFBSSxDQUFDO1FBQ0osTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNqRCxzQkFBc0IsQ0FDTSxDQUFDO1FBQzlCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQzlDLHdCQUF3QixDQUNJLENBQUM7UUFDOUIsTUFBTSx3QkFBd0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUN2RCw2QkFBNkIsQ0FDRCxDQUFDO1FBRTlCLE1BQU0sV0FBVyxHQUFHLGtCQUFrQjtZQUNyQyxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNMLE1BQU0sUUFBUSxHQUFHLGVBQWU7WUFDL0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsTUFBTSxpQkFBaUIsR0FDdEIsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDO1lBQ2xELENBQUMsQ0FBRSx3QkFBd0IsQ0FBQyxLQUEwQjtZQUN0RCxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRVYsT0FBTztZQUNOLFdBQVc7WUFDWCxRQUFRO1lBQ1IsaUJBQWlCO1NBQ2pCLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU87WUFDTixXQUFXLEVBQUUsQ0FBQztZQUNkLFFBQVEsRUFBRSxDQUFDO1lBQ1gsaUJBQWlCLEVBQUUsS0FBSztTQUN4QixDQUFDO0lBQ0gsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxhQUFxQjtJQUMzQyxJQUFJLENBQUM7UUFDSiwyQkFBMkIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUyx1QkFBdUI7SUFDL0IsSUFBSSxDQUFDO1FBQ0osTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVuRCxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQzthQUFNLENBQUM7WUFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7WUFDbkUsT0FBTztRQUNSLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFrQjtJQUNqQyxpQ0FBaUM7SUFDakMsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixzQkFBc0I7SUFDdEIsYUFBYTtJQUNiLGVBQWU7SUFDZixlQUFlO0lBQ2YsZUFBZTtJQUNmLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLHVCQUF1QjtDQUN2QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0Q29udmVyc2lvbkZuIH0gZnJvbSAnLi4vY29sb3ItY29udmVyc2lvbi9jb252ZXJzaW9uJztcbmltcG9ydCB7IGNvbnZlcnNpb25IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uJztcbmltcG9ydCB7IGRvbUhlbHBlcnMgfSBmcm9tICcuLi9oZWxwZXJzL2RvbSc7XG5pbXBvcnQgKiBhcyBmbk9iamVjdHMgZnJvbSAnLi4vaW5kZXgvZm4tb2JqZWN0cyc7XG5pbXBvcnQgKiBhcyBpbnRlcmZhY2VzIGZyb20gJy4uL2luZGV4L2ludGVyZmFjZXMnO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vaW5kZXgvdHlwZXMnO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICcuLi9wYWxldHRlLWdlbi9nZW5lcmF0ZSc7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tICcuLi91dGlscy9jb2xvci1yYW5kb21pemVyJztcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuLi91dGlscy90cmFuc2Zvcm1zJztcbmltcG9ydCB7IGd1YXJkcyB9IGZyb20gJy4uL3V0aWxzL3R5cGUtZ3VhcmRzJztcblxuZnVuY3Rpb24gYWRkQ29udmVyc2lvbkJ1dHRvbkV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkZExpc3RlbmVyID0gKGlkOiBzdHJpbmcsIGNvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UpID0+IHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRpZFxuXHRcdFx0KSBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGw7XG5cblx0XHRcdGlmIChidXR0b24pIHtcblx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cblx0XHRcdFx0XHRjb252ZXJ0Q29sb3JzKGNvbG9yU3BhY2UpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRhZGRMaXN0ZW5lcignaGV4LWNvbnZlcnNpb24tYnV0dG9uJywgJ2hleCcpO1xuXHRcdGFkZExpc3RlbmVyKCdyZ2ItY29udmVyc2lvbi1idXR0b24nLCAncmdiJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ2hzdi1jb252ZXJzaW9uLWJ1dHRvbicsICdoc3YnKTtcblx0XHRhZGRMaXN0ZW5lcignaHNsLWNvbnZlcnNpb24tYnV0dG9uJywgJ2hzbCcpO1xuXHRcdGFkZExpc3RlbmVyKCdjbXlrLWNvbnZlcnNpb24tYnV0dG9uJywgJ2NteWsnKTtcblx0XHRhZGRMaXN0ZW5lcignbGFiLWNvbnZlcnNpb24tYnV0dG9uJywgJ2xhYicpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgRmFpbGVkIHRvIGFkZCBldmVudCBsaXN0ZW5lcnMgdG8gY29udmVyc2lvbiBidXR0b25zOiAke2Vycm9yfWBcblx0XHQpO1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUN1c3RvbUNvbG9yKCk6IHR5cGVzLkNvbG9yIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRGb3JtYXQgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbFxuXHRcdCk/LnZhbHVlIGFzIHR5cGVzLkNvbG9yU3BhY2U7XG5cblx0XHRpZiAoIWd1YXJkcy5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtzZWxlY3RlZEZvcm1hdH1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJzZWRDb2xvciA9IHRyYW5zZm9ybXMucGFyc2VDb2xvcihzZWxlY3RlZEZvcm1hdCwgcmF3VmFsdWUpO1xuXG5cdFx0aWYgKCFwYXJzZWRDb2xvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlOiAke3Jhd1ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXJzZWRDb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0YEZhaWxlZCB0byBhcHBseSBjdXN0b20gY29sb3I6ICR7ZXJyb3J9LiBSZXR1cm5pbmcgcmFuZG9tbHkgZ2VuZXJhdGVkIGhleCBjb2xvcmBcblx0XHQpO1xuXHRcdHJldHVybiByYW5kb20ucmFuZG9tQ29sb3IoJ2hleCcpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Rmlyc3RDb2xvclRvVUkoaW5pdGlhbENvbG9yU3BhY2U6IHR5cGVzLkNvbG9yU3BhY2UpOiB0eXBlcy5Db2xvciB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3IgPSByYW5kb20ucmFuZG9tQ29sb3IoaW5pdGlhbENvbG9yU3BhY2UpO1xuXHRcdGNvbnN0IGNvbG9yQm94MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1ib3gtMScpO1xuXG5cdFx0aWYgKCFjb2xvckJveDEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHR9XG5cblx0XHRjb25zdCBmb3JtYXRDb2xvclN0cmluZyA9IHRyYW5zZm9ybXMuZ2V0Q29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0aWYgKCFmb3JtYXRDb2xvclN0cmluZykge1xuXHRcdFx0Y29uc29sZS5lcnJvcignVW5leHBlY3RlZCBvciB1bnN1cHBvcnRlZCBjb2xvciBmb3JtYXQuJyk7XG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0cG9wdWxhdGVDb2xvclRleHRPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gcmFuZG9tLnJhbmRvbUNvbG9yKCdoZXgnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUluaXRpYWxDb2xvclNwYWNlKCk6IHR5cGVzLkNvbG9yU3BhY2Uge1xuXHR0cnkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdpbml0aWFsLWNvbG9yc3BhY2Utb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG5cdFx0Y29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXG5cdFx0aWYgKGd1YXJkcy5pc0NvbG9yU3BhY2UodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgYXMgdHlwZXMuQ29sb3JTcGFjZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICdoZXgnO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gYXBwbHkgaW5pdGlhbCBjb2xvciBzcGFjZTonLCBlcnJvcik7XG5cdFx0cmV0dXJuICdoZXgnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDb2xvcnModGFyZ2V0Rm9ybWF0OiB0eXBlcy5Db2xvclNwYWNlKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JUZXh0T3V0cHV0Qm94ZXMgPVxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHQpO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94ZXMuZm9yRWFjaChib3ggPT4ge1xuXHRcdFx0aWYgKCEoYm94IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBpbnB1dCBlbGVtZW50LicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlucHV0Qm94ID0gYm94IGFzIGludGVyZmFjZXMuQ29sb3JJbnB1dEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBjb2xvclZhbHVlcyA9IGlucHV0Qm94LmNvbG9yVmFsdWVzO1xuXG5cdFx0XHRpZiAoIWNvbG9yVmFsdWVzKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ01pc3NpbmcgY29sb3IgdmFsdWVzLicpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRGb3JtYXQgPSBpbnB1dEJveC5nZXRBdHRyaWJ1dGUoXG5cdFx0XHRcdCdkYXRhLWZvcm1hdCdcblx0XHRcdCkgYXMgdHlwZXMuQ29sb3JTcGFjZTtcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQhZ3VhcmRzLmlzQ29sb3JTcGFjZShjdXJyZW50Rm9ybWF0KSB8fFxuXHRcdFx0XHQhZ3VhcmRzLmlzQ29sb3JTcGFjZSh0YXJnZXRGb3JtYXQpXG5cdFx0XHQpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBmb3JtYXQ6ICR7Y3VycmVudEZvcm1hdH0gb3IgJHt0YXJnZXRGb3JtYXR9YFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvclZhbHVlcy5mb3JtYXQgPT09ICd4eXonKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybignU2tpcHBpbmcgWFlaIGNvbG9yIHR5cGUnKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjb252ZXJ0Rm4gPSBnZXRDb252ZXJzaW9uRm4oY3VycmVudEZvcm1hdCwgdGFyZ2V0Rm9ybWF0KTtcblx0XHRcdGlmICghY29udmVydEZuKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0YENvbnZlcnNpb24gZnJvbSAke2N1cnJlbnRGb3JtYXR9IHRvICR7dGFyZ2V0Rm9ybWF0fSBpcyBub3Qgc3VwcG9ydGVkLmBcblx0XHRcdFx0KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZ3VhcmRzLmlzQ29udmVydGlibGVDb2xvcihjb2xvclZhbHVlcykpIHtcblx0XHRcdFx0Y29uc3QgbmV3Q29sb3IgPSBjb252ZXJ0Rm4oY29sb3JWYWx1ZXMpO1xuXHRcdFx0XHRpZiAoIW5ld0NvbG9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgQ29udmVyc2lvbiB0byAke3RhcmdldEZvcm1hdH0gZmFpbGVkLmApO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlucHV0Qm94LnZhbHVlID0gU3RyaW5nKG5ld0NvbG9yKTtcblx0XHRcdFx0aW5wdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIHRhcmdldEZvcm1hdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHR5cGUgZm9yIGNvbnZlcnNpb24uYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNvbnZlcnQgY29sb3JzOicsIGVycm9yKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGRvbUhlbHBlcnMuc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQ29waWVkIGNvbG9yIHZhbHVlOiAke2NvbG9yVmFsdWV9YCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvcHlpbmcgdG8gY2xpcGJvYXJkOicsIGVycik7XG5cdFx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQ6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lVUlCdXR0b25zKCk6IGludGVyZmFjZXMuVUlCdXR0b25zIHtcblx0dHJ5IHtcblx0XHRjb25zdCBnZW5lcmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZS1idXR0b24nKTtcblx0XHRjb25zdCBzYXR1cmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXR1cmF0ZS1idXR0b24nKTtcblx0XHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2F0dXJhdGUtYnV0dG9uJyk7XG5cdFx0Y29uc3QgcG9wdXBEaXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLWNvbG9yLWJ1dHRvbicpO1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhcHBseS1jdXN0b20tY29sb3ItYnV0dG9uJ1xuXHRcdCk7XG5cdFx0Y29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2NsZWFyLWN1c3RvbS1jb2xvci1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBhZHZhbmNlZE1lbnVUb2dnbGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdhZHZhbmNlZC1tZW51LXRvZ2dsZS1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBhcHBseUluaXRpYWxDb2xvclNwYWNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHQnYXBwbHktaW5pdGlhbC1jb2xvci1zcGFjZS1idXR0b24nXG5cdFx0KTtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J3NlbGVjdGVkLWNvbG9yLW9wdGlvbnMnXG5cdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGw7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25zXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb25zLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbixcblx0XHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0XHRcdHBvcHVwRGl2QnV0dG9uLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRhZHZhbmNlZE1lbnVUb2dnbGVCdXR0b24sXG5cdFx0XHRhcHBseUluaXRpYWxDb2xvclNwYWNlQnV0dG9uLFxuXHRcdFx0c2VsZWN0ZWRDb2xvclxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRlZmluZSBVSSBidXR0b25zOicsIGVycm9yKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2VuZXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGRlc2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRwb3B1cERpdkJ1dHRvbjogbnVsbCxcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0YWR2YW5jZWRNZW51VG9nZ2xlQnV0dG9uOiBudWxsLFxuXHRcdFx0YXBwbHlJbml0aWFsQ29sb3JTcGFjZUJ1dHRvbjogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3I6IDBcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKFxuXHRzZWxlY3RlZENvbG9yOiBudW1iZXJcbik6IGludGVyZmFjZXMuR2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0XHQpLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHRcdCksXG5cdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdFx0KVxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGdldCBlbGVtZW50cyBmb3Igc2VsZWN0ZWQgY29sb3I6JywgZXJyb3IpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JCb3g6IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBudWxsXG5cdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRHZW5lcmF0ZUJ1dHRvblBhcmFtcygpOiBpbnRlcmZhY2VzLkdlbkJ1dHRvblBhcmFtcyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J3BhbGV0dGUtdHlwZS1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cdFx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLW51bWJlci1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRjb25zdCBjb2xvclNwYWNlVmFsdWUgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2luaXRpYWwtY29sb3JzcGFjZS1vcHRpb25zJ1xuXHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudFxuXHRcdCk/LnZhbHVlO1xuXHRcdGNvbnN0IGluaXRpYWxDb2xvclNwYWNlID0gZ3VhcmRzLmlzQ29sb3JTcGFjZShjb2xvclNwYWNlVmFsdWUpXG5cdFx0XHQ/IChjb2xvclNwYWNlVmFsdWUgYXMgdHlwZXMuQ29sb3JTcGFjZSlcblx0XHRcdDogJ2hleCc7XG5cdFx0Y29uc3QgY3VzdG9tQ29sb3JSYXcgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLWNvbG9yJykgYXMgSFRNTElucHV0RWxlbWVudFxuXHRcdCk/LnZhbHVlO1xuXHRcdGNvbnN0IGN1c3RvbUNvbG9yID0gdHJhbnNmb3Jtcy5wYXJzZUN1c3RvbUNvbG9yKFxuXHRcdFx0aW5pdGlhbENvbG9yU3BhY2UsXG5cdFx0XHRjdXN0b21Db2xvclJhd1xuXHRcdCk7XG5cblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGBudW1Cb3hlczogJHtwYXJzZUludChwYWxldHRlTnVtYmVyT3B0aW9ucy52YWx1ZSwgMTApfVxcbnBhbGV0dGVUeXBlOiAke3BhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9ucy52YWx1ZSwgMTApfVxcbmluaXRpYWxDb2xvclNwYWNlOiAke2luaXRpYWxDb2xvclNwYWNlfVxcbmN1c3RvbUNvbG9yOiAke0pTT04uc3RyaW5naWZ5KGN1c3RvbUNvbG9yKX1gXG5cdFx0KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRudW1Cb3hlczogcGFyc2VJbnQocGFsZXR0ZU51bWJlck9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdHBhbGV0dGVUeXBlOiBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnMudmFsdWUsIDEwKSxcblx0XHRcdGluaXRpYWxDb2xvclNwYWNlLFxuXHRcdFx0Y3VzdG9tQ29sb3Jcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzOicsIGVycm9yKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHZW5CdXR0b25DbGljaygpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYXJhbXMgPSBnZXRHZW5lcmF0ZUJ1dHRvblBhcmFtcygpO1xuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byByZXRyaWV2ZSBnZW5lcmF0ZUJ1dHRvbiBwYXJhbWV0ZXJzJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBwYWxldHRlVHlwZSwgbnVtQm94ZXMsIGluaXRpYWxDb2xvclNwYWNlLCBjdXN0b21Db2xvciB9ID1cblx0XHRcdHBhcmFtcztcblxuXHRcdGlmICghcGFsZXR0ZVR5cGUgfHwgIW51bUJveGVzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlVHlwZSBhbmQvb3IgbnVtQm94ZXMgYXJlIHVuZGVmaW5lZCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNwYWNlOiB0eXBlcy5Db2xvclNwYWNlID0gaW5pdGlhbENvbG9yU3BhY2UgPz8gJ2hleCc7XG5cblx0XHRnZW5lcmF0ZS5zdGFydFBhbGV0dGVHZW4ocGFsZXR0ZVR5cGUsIG51bUJveGVzLCBzcGFjZSwgY3VzdG9tQ29sb3IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBoYW5kbGUgZ2VuZXJhdGUgYnV0dG9uIGNsaWNrOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94KFxuXHRjb2xvcjogdHlwZXMuQ29sb3IsXG5cdGJveE51bWJlcjogbnVtYmVyXG4pOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3QgaGV4Q29sb3IgPSBjb252ZXJzaW9uSGVscGVycy5jb252ZXJ0Q29sb3JUb0hleChjb2xvcik7XG5cblx0XHRpZiAoIWhleENvbG9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY29udmVydCBjb2xvciB0byBoZXgnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZyhgSGV4IGNvbG9yIHZhbHVlOiAke0pTT04uc3RyaW5naWZ5KGhleENvbG9yLnZhbHVlLmhleCl9YCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWUgPSBoZXhDb2xvci52YWx1ZS5oZXg7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCAnaGV4Jyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHBvcHVsYXRlIGNvbG9yIHRleHQgb3V0cHV0IGJveDonLCBlcnJvcik7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHB1bGxQYXJhbXNGcm9tVUkoKTogaW50ZXJmYWNlcy5QdWxsUGFyYW1zRnJvbVVJIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlVHlwZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLXR5cGUtb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdwYWxldHRlLW51bWJlci1vcHRpb25zJ1xuXHRcdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuXHRcdGNvbnN0IGluaXRpYWxDb2xvclNwYWNlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2luaXRpYWwtY29sb3Itc3BhY2Utb3B0aW9ucydcblx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblxuXHRcdGNvbnN0IHBhbGV0dGVUeXBlID0gcGFsZXR0ZVR5cGVFbGVtZW50XG5cdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHQ6IDA7XG5cdFx0Y29uc3QgbnVtQm94ZXMgPSBudW1Cb3hlc0VsZW1lbnRcblx0XHRcdD8gcGFyc2VJbnQobnVtQm94ZXNFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdDogMDtcblx0XHRjb25zdCBpbml0aWFsQ29sb3JTcGFjZSA9XG5cdFx0XHRpbml0aWFsQ29sb3JTcGFjZUVsZW1lbnQgJiZcblx0XHRcdGd1YXJkcy5pc0NvbG9yU3BhY2UoaW5pdGlhbENvbG9yU3BhY2VFbGVtZW50LnZhbHVlKVxuXHRcdFx0XHQ/IChpbml0aWFsQ29sb3JTcGFjZUVsZW1lbnQudmFsdWUgYXMgdHlwZXMuQ29sb3JTcGFjZSlcblx0XHRcdFx0OiAnaGV4JztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0aW5pdGlhbENvbG9yU3BhY2Vcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGU6IDAsXG5cdFx0XHRudW1Cb3hlczogMCxcblx0XHRcdGluaXRpYWxDb2xvclNwYWNlOiAnaGV4J1xuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNob3dDdXN0b21Db2xvclBvcHVwRGl2KCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWRpdicpO1xuXG5cdFx0aWYgKHBvcHVwKSB7XG5cdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtZGl2JykgaXMgdW5kZWZpbmVkXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2hvdyBjdXN0b20gY29sb3IgcG9wdXAgZGl2OiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkb206IGZuT2JqZWN0cy5ET00gPSB7XG5cdGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycyxcblx0YXBwbHlDdXN0b21Db2xvcixcblx0YXBwbHlGaXJzdENvbG9yVG9VSSxcblx0YXBwbHlJbml0aWFsQ29sb3JTcGFjZSxcblx0Y29udmVydENvbG9ycyxcblx0Y29weVRvQ2xpcGJvYXJkLFxuXHRkZWZpbmVVSUJ1dHRvbnMsXG5cdGRlc2F0dXJhdGVDb2xvcixcblx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRnZXRHZW5lcmF0ZUJ1dHRvblBhcmFtcyxcblx0aGFuZGxlR2VuQnV0dG9uQ2xpY2ssXG5cdHBvcHVsYXRlQ29sb3JUZXh0T3V0cHV0Qm94LFxuXHRwdWxsUGFyYW1zRnJvbVVJLFxuXHRzYXR1cmF0ZUNvbG9yLFxuXHRzaG93Q3VzdG9tQ29sb3JQb3B1cERpdlxufTtcbiJdfQ==