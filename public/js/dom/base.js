// File: src/dom/base.ts
import { core, helpers, utils, superUtils } from '../common/index.js';
import { data } from '../data/index.js';
import { paletteUtils } from '../palette/common/index.js';
const mode = data.mode;
function addConversionButtonEventListeners() {
    try {
        const addListener = (id, colorSpace) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => superUtils.dom.switchColorSpace(colorSpace));
            }
            else {
                if (!mode.warnLogs)
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
        if (mode.errorLogs)
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
            : paletteUtils.convert.toHSL(parsedColor);
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
        const advancedMenuButton = data.consts.dom.advancedMenuButton;
        const applyCustomColorButton = data.consts.dom.applyCustomColorButton;
        const clearCustomColorButton = data.consts.dom.clearCustomColorButton;
        const closeCustomColorMenuButton = data.consts.dom.closeCustomColorMenuButton;
        const closeHelpMenuButton = data.consts.dom.closeHelpMenuButton;
        const closeHistoryMenuButton = data.consts.dom.closeHistoryMenuButton;
        const desaturateButton = data.consts.dom.desaturateButton;
        const enableAlphaCheckbox = data.consts.dom.enableAlphaCheckbox;
        const generateButton = data.consts.dom.generateButton;
        const helpMenuButton = data.consts.dom.helpMenuButton;
        const historyMenuButton = data.consts.dom.historyMenuButton;
        const limitDarknessCheckbox = data.consts.dom.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.limitLightnessCheckbox;
        const saturateButton = data.consts.dom.saturateButton;
        const selectedColorOption = data.consts.dom.selectedColorOption;
        const showAsCMYKButton = data.consts.dom.showAsCMYKButton;
        const showAsHexButton = data.consts.dom.showAsHexButton;
        const showAsHSLButton = data.consts.dom.showAsHSLButton;
        const showAsHSVButton = data.consts.dom.showAsHSVButton;
        const showAsLABButton = data.consts.dom.showAsLABButton;
        const showAsRGBButton = data.consts.dom.showAsRGBButton;
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
function pullParamsFromUI() {
    try {
        const paletteTypeOptionsElement = data.consts.dom.paletteTypeOptions;
        const numBoxesElement = data.consts.dom.paletteNumberOptions;
        const enableAlphaCheckbox = data.consts.dom.enableAlphaCheckbox;
        const limitDarknessCheckbox = data.consts.dom.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.limitLightnessCheckbox;
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
function showCustomColorPopupDiv() {
    try {
        const popup = document.getElementById('popup-div');
        if (popup) {
            popup.classList.toggle('show');
        }
        else {
            if (mode.errorLogs)
                console.error("document.getElementById('popup-div') is undefined");
            return;
        }
    }
    catch (error) {
        console.error(`Failed to show custom color popup div: ${error}`);
    }
}
export const base = {
    addConversionButtonEventListeners,
    applyCustomColor,
    applyFirstColorToUI,
    copyToClipboard,
    defineUIElements,
    desaturateColor,
    getElementsForSelectedColor,
    pullParamsFromUI,
    saturateColor,
    showCustomColorPopupDiv
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFheEIsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFMUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV2QixTQUFTLGlDQUFpQztJQUN6QyxJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQVUsRUFBRSxVQUFzQixFQUFFLEVBQUU7WUFDMUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDckMsRUFBRSxDQUMwQixDQUFDO1lBRTlCLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FDckMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FDM0MsQ0FBQztZQUNILENBQUM7aUJBQU0sQ0FBQztnQkFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNGLENBQUMsQ0FBQztRQUVGLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FDWix3REFBd0QsS0FBSyxFQUFFLENBQy9ELENBQUM7UUFFSCxPQUFPO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGdCQUFnQjtJQUN4QixJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUMxQyxxQkFBcUIsQ0FDTSxDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUMsTUFBTSxjQUFjLEdBQ25CLFFBQVEsQ0FBQyxjQUFjLENBQ3RCLHFCQUFxQixDQUV0QixFQUFFLEtBQW1CLENBQUM7UUFFdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7WUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FDekMsY0FBYyxFQUNkLFFBQVEsQ0FDbUIsQ0FBQztRQUU3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7WUFDbkQsQ0FBQyxDQUFDLFdBQVc7WUFDYixDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFM0MsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUNaLGlDQUFpQyxLQUFLLDBDQUEwQyxDQUNoRixDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQVEsQ0FBQztJQUN2QyxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsS0FBVTtJQUN0QyxJQUFJLENBQUM7UUFDSixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUV6RCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1lBRTFELE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELFNBQVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLGlCQUFpQixDQUFDO1FBRXBELEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFDLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRTlELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFRLENBQUM7SUFDdkMsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxJQUFZLEVBQUUsY0FBMkI7SUFDakUsSUFBSSxDQUFDO1FBQ0osTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVuRSxTQUFTLENBQUMsU0FBUzthQUNqQixTQUFTLENBQUMsVUFBVSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUVsRCxVQUFVLENBQ1QsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQ3BDLENBQUM7UUFDSCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDWixJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUNwRSxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsZ0JBQWdCO0lBQ3hCLElBQUksQ0FBQztRQUNKLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDOUQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztRQUN0RSxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDO1FBQ3RFLE1BQU0sMEJBQTBCLEdBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDO1FBQzVDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7UUFDaEUsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztRQUN0RSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO1FBQzFELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7UUFDaEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO1FBQ3RELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztRQUN0RCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDO1FBQzVELE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUM7UUFDcEUsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztRQUNwRSxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDO1FBQ3RFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztRQUN0RCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDO1FBQ2hFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7UUFDMUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQ3hELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztRQUN4RCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7UUFDeEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQ3hELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztRQUN4RCxNQUFNLGFBQWEsR0FBRyxtQkFBbUI7WUFDeEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTCxPQUFPO1lBQ04sa0JBQWtCO1lBQ2xCLHNCQUFzQjtZQUN0QixzQkFBc0I7WUFDdEIsMEJBQTBCO1lBQzFCLG1CQUFtQjtZQUNuQixzQkFBc0I7WUFDdEIsZ0JBQWdCO1lBQ2hCLG1CQUFtQjtZQUNuQixjQUFjO1lBQ2QsY0FBYztZQUNkLGlCQUFpQjtZQUNqQixxQkFBcUI7WUFDckIscUJBQXFCO1lBQ3JCLHNCQUFzQjtZQUN0QixjQUFjO1lBQ2QsYUFBYTtZQUNiLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsZUFBZTtZQUNmLGVBQWU7WUFDZixlQUFlO1lBQ2YsZUFBZTtTQUNmLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRS9ELE9BQU87WUFDTixrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLHNCQUFzQixFQUFFLElBQUk7WUFDNUIsc0JBQXNCLEVBQUUsSUFBSTtZQUM1QiwwQkFBMEIsRUFBRSxJQUFJO1lBQ2hDLG1CQUFtQixFQUFFLElBQUk7WUFDekIsc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLG1CQUFtQixFQUFFLElBQUk7WUFDekIsY0FBYyxFQUFFLElBQUk7WUFDcEIsY0FBYyxFQUFFLElBQUk7WUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixxQkFBcUIsRUFBRSxJQUFJO1lBQzNCLHNCQUFzQixFQUFFLElBQUk7WUFDNUIscUJBQXFCLEVBQUUsSUFBSTtZQUMzQixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsQ0FBQztZQUNoQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1NBQ3JCLENBQUM7SUFDSCxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLGFBQXFCO0lBQzdDLElBQUksQ0FBQztRQUNKLDJCQUEyQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsMkJBQTJCLENBQ25DLGFBQXFCO0lBRXJCLE1BQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDL0MsYUFBYSxhQUFhLEVBQUUsQ0FDNUIsQ0FBQztJQUVGLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFFBQVE7WUFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUU5RCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRXRELE9BQU87WUFDTiwwQkFBMEIsRUFBRSxJQUFJO1lBQ2hDLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsbUJBQW1CLEVBQUUsSUFBSTtTQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTiwwQkFBMEIsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUNsRCx5QkFBeUIsYUFBYSxFQUFFLENBQ3hDO1FBQ0QsZ0JBQWdCO1FBQ2hCLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQzNDLGdCQUFnQixhQUFhLEVBQUUsQ0FDL0I7S0FDRCxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsZ0JBQWdCO0lBQ3hCLElBQUksQ0FBQztRQUNKLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDckUsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUM7UUFDN0QsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztRQUNoRSxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO1FBQ3BFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUM7UUFDcEUsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztRQUV0RSxPQUFPO1lBQ04sV0FBVyxFQUFFLHlCQUF5QjtnQkFDckMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQztZQUNKLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxPQUFPLElBQUksS0FBSztZQUNsRCxhQUFhLEVBQUUscUJBQXFCLEVBQUUsT0FBTyxJQUFJLEtBQUs7WUFDdEQsYUFBYSxFQUFFLHFCQUFxQixFQUFFLE9BQU8sSUFBSSxLQUFLO1lBQ3RELGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxPQUFPLElBQUksS0FBSztTQUN4RCxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRTlELE9BQU87WUFDTixXQUFXLEVBQUUsQ0FBQztZQUNkLFFBQVEsRUFBRSxDQUFDO1lBQ1gsV0FBVyxFQUFFLEtBQUs7WUFDbEIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsY0FBYyxFQUFFLEtBQUs7U0FDckIsQ0FBQztJQUNILENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsYUFBcUI7SUFDM0MsSUFBSSxDQUFDO1FBQ0osMkJBQTJCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLHVCQUF1QjtJQUMvQixJQUFJLENBQUM7UUFDSixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5ELElBQUksS0FBSyxFQUFFLENBQUM7WUFDWCxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDO2FBQU0sQ0FBQztZQUNQLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQ1osbURBQW1ELENBQ25ELENBQUM7WUFFSCxPQUFPO1FBQ1IsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQXVCO0lBQ3ZDLGlDQUFpQztJQUNqQyxnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLDJCQUEyQjtJQUMzQixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLHVCQUF1QjtDQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZG9tL2Jhc2UudHNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdERPTUJhc2VGbkludGVyZmFjZSxcblx0R2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRIU0wsXG5cdFB1bGxQYXJhbXNGcm9tVUksXG5cdFNMLFxuXHRTVixcblx0VUlFbGVtZW50c1xufSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlLCBoZWxwZXJzLCB1dGlscywgc3VwZXJVdGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBwYWxldHRlVXRpbHMgfSBmcm9tICcuLi9wYWxldHRlL2NvbW1vbi9pbmRleC5qcyc7XG5cbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmZ1bmN0aW9uIGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycygpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBhZGRMaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBDb2xvclNwYWNlKSA9PiB7XG5cdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0aWRcblx0XHRcdCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0XHRpZiAoYnV0dG9uKSB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0c3VwZXJVdGlscy5kb20uc3dpdGNoQ29sb3JTcGFjZShjb2xvclNwYWNlKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFtb2RlLndhcm5Mb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCB3aXRoIGlkIFwiJHtpZH1cIiBub3QgZm91bmQuYCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWNteWstYnV0dG9uJywgJ2NteWsnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1oZXgtYnV0dG9uJywgJ2hleCcpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWhzbC1idXR0b24nLCAnaHNsJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtaHN2LWJ1dHRvbicsICdoc3YnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1sYWItYnV0dG9uJywgJ2xhYicpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLXJnYi1idXR0b24nLCAncmdiJyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBhZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGNvbnZlcnNpb24gYnV0dG9uczogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ29sb3IoKTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRGb3JtYXQgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbFxuXHRcdCk/LnZhbHVlIGFzIENvbG9yU3BhY2U7XG5cblx0XHRpZiAoIXV0aWxzLmNvbG9yLmlzQ29sb3JTcGFjZShzZWxlY3RlZEZvcm1hdCkpIHtcblx0XHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7c2VsZWN0ZWRGb3JtYXR9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB1dGlscy5jb2xvci5wYXJzZUNvbG9yKFxuXHRcdFx0c2VsZWN0ZWRGb3JtYXQsXG5cdFx0XHRyYXdWYWx1ZVxuXHRcdCkgYXMgRXhjbHVkZTxDb2xvciwgU0wgfCBTVj47XG5cblx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBoc2xDb2xvciA9IHV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHQ/IHBhcnNlZENvbG9yXG5cdFx0XHQ6IHBhbGV0dGVVdGlscy5jb252ZXJ0LnRvSFNMKHBhcnNlZENvbG9yKTtcblxuXHRcdHJldHVybiBoc2xDb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGN1c3RvbSBjb2xvcjogJHtlcnJvcn0uIFJldHVybmluZyByYW5kb21seSBnZW5lcmF0ZWQgaGV4IGNvbG9yYFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvckJveDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItYm94LTEnKTtcblxuXHRcdGlmICghY29sb3JCb3gxKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvcm1hdENvbG9yU3RyaW5nID0gY29yZS5jb252ZXJ0LnRvQ1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0aWYgKCFmb3JtYXRDb2xvclN0cmluZykge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIG9yIHVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdC4nKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbG9yQm94MS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmb3JtYXRDb2xvclN0cmluZztcblxuXHRcdHV0aWxzLnBhbGV0dGUucG9wdWxhdGVPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgQ29waWVkIGNvbG9yIHZhbHVlOiAke2NvbG9yVmFsdWV9YCk7XG5cblx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0ZGF0YS5jb25zdHMudGltZW91dHMudG9vbHRpcCB8fCAxMDAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBjb3B5aW5nIHRvIGNsaXBib2FyZDonLCBlcnIpO1xuXHRcdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkOiAke2Vycm9yfWApO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZWZpbmVVSUVsZW1lbnRzKCk6IFVJRWxlbWVudHMge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkdmFuY2VkTWVudUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5hZHZhbmNlZE1lbnVCdXR0b247XG5cdFx0Y29uc3QgYXBwbHlDdXN0b21Db2xvckJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5hcHBseUN1c3RvbUNvbG9yQnV0dG9uO1xuXHRcdGNvbnN0IGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uY2xlYXJDdXN0b21Db2xvckJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uY2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VIZWxwTWVudUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5jbG9zZUhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlSGlzdG9yeU1lbnVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uY2xvc2VIaXN0b3J5TWVudUJ1dHRvbjtcblx0XHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmRlc2F0dXJhdGVCdXR0b247XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9IGRhdGEuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGdlbmVyYXRlQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmdlbmVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IGhlbHBNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGhpc3RvcnlNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGRhdGEuY29uc3RzLmRvbS5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID0gZGF0YS5jb25zdHMuZG9tLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID0gZGF0YS5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3Qgc2F0dXJhdGVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uc2F0dXJhdGVCdXR0b247XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvck9wdGlvbiA9IGRhdGEuY29uc3RzLmRvbS5zZWxlY3RlZENvbG9yT3B0aW9uO1xuXHRcdGNvbnN0IHNob3dBc0NNWUtCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uc2hvd0FzQ01ZS0J1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIZXhCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uc2hvd0FzSGV4QnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hTTEJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5zaG93QXNIU0xCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSFNWQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLnNob3dBc0hTVkJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNMQUJCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uc2hvd0FzTEFCQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc1JHQkJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5zaG93QXNSR0JCdXR0b247XG5cdFx0Y29uc3Qgc2VsZWN0ZWRDb2xvciA9IHNlbGVjdGVkQ29sb3JPcHRpb25cblx0XHRcdD8gcGFyc2VJbnQoc2VsZWN0ZWRDb2xvck9wdGlvbi52YWx1ZSwgMTApXG5cdFx0XHQ6IDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWR2YW5jZWRNZW51QnV0dG9uLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbixcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3gsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbixcblx0XHRcdGhlbHBNZW51QnV0dG9uLFxuXHRcdFx0aGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3gsXG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3gsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94LFxuXHRcdFx0c2F0dXJhdGVCdXR0b24sXG5cdFx0XHRzZWxlY3RlZENvbG9yLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbixcblx0XHRcdHNob3dBc0hleEJ1dHRvbixcblx0XHRcdHNob3dBc0hTTEJ1dHRvbixcblx0XHRcdHNob3dBc0hTVkJ1dHRvbixcblx0XHRcdHNob3dBc0xBQkJ1dHRvbixcblx0XHRcdHNob3dBc1JHQkJ1dHRvblxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlZmluZSBVSSBidXR0b25zOiAke2Vycm9yfS5gKTtcblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9ucy4nKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRhZHZhbmNlZE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VIZWxwTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRkZXNhdHVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0ZW5hYmxlQWxwaGFDaGVja2JveDogbnVsbCxcblx0XHRcdGdlbmVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0aGVscE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRoaXN0b3J5TWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveDogbnVsbCxcblx0XHRcdGxpbWl0TGlnaHRuZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdEdyYXluZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3I6IDAsXG5cdFx0XHRzaG93QXNDTVlLQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSGV4QnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSFNMQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzSFNWQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzTEFCQnV0dG9uOiBudWxsLFxuXHRcdFx0c2hvd0FzUkdCQnV0dG9uOiBudWxsXG5cdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZXNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBkZXNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihcblx0c2VsZWN0ZWRDb2xvcjogbnVtYmVyXG4pOiBHZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ige1xuXHRjb25zdCBzZWxlY3RlZENvbG9yQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0YGNvbG9yLWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHQpO1xuXG5cdGlmICghc2VsZWN0ZWRDb2xvckJveCkge1xuXHRcdGlmIChtb2RlLndhcm5Mb2dzKVxuXHRcdFx0Y29uc29sZS53YXJuKGBFbGVtZW50IG5vdCBmb3VuZCBmb3IgY29sb3IgJHtzZWxlY3RlZENvbG9yfWApO1xuXG5cdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdQbGVhc2Ugc2VsZWN0IGEgdmFsaWQgY29sb3IuJyk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yQm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogbnVsbFxuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpLFxuXHRcdHNlbGVjdGVkQ29sb3JCb3gsXG5cdFx0c2VsZWN0ZWRDb2xvclN0cmlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3Itc3RyaXBlLSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KVxuXHR9O1xufVxuXG5mdW5jdGlvbiBwdWxsUGFyYW1zRnJvbVVJKCk6IFB1bGxQYXJhbXNGcm9tVUkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQgPSBkYXRhLmNvbnN0cy5kb20ucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdGNvbnN0IG51bUJveGVzRWxlbWVudCA9IGRhdGEuY29uc3RzLmRvbS5wYWxldHRlTnVtYmVyT3B0aW9ucztcblx0XHRjb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID0gZGF0YS5jb25zdHMuZG9tLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID0gZGF0YS5jb25zdHMuZG9tLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPSBkYXRhLmNvbnN0cy5kb20ubGltaXRHcmF5bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPSBkYXRhLmNvbnN0cy5kb20ubGltaXRMaWdodG5lc3NDaGVja2JveDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwYWxldHRlVHlwZTogcGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudFxuXHRcdFx0XHQ/IHBhcnNlSW50KHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQudmFsdWUsIDEwKVxuXHRcdFx0XHQ6IDAsXG5cdFx0XHRudW1Cb3hlczogbnVtQm94ZXNFbGVtZW50ID8gcGFyc2VJbnQobnVtQm94ZXNFbGVtZW50LnZhbHVlLCAxMCkgOiAwLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBsaW1pdERhcmtuZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBsaW1pdEdyYXluZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogbGltaXRMaWdodG5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZVxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHB1bGwgcGFyYW1ldGVycyBmcm9tIFVJOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiAwLFxuXHRcdFx0bnVtQm94ZXM6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBzaG93Q3VzdG9tQ29sb3JQb3B1cERpdigpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1kaXYnKTtcblxuXHRcdGlmIChwb3B1cCkge1xuXHRcdFx0cG9wdXAuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XCJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtZGl2JykgaXMgdW5kZWZpbmVkXCJcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2hvdyBjdXN0b20gY29sb3IgcG9wdXAgZGl2OiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBET01CYXNlRm5JbnRlcmZhY2UgPSB7XG5cdGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycyxcblx0YXBwbHlDdXN0b21Db2xvcixcblx0YXBwbHlGaXJzdENvbG9yVG9VSSxcblx0Y29weVRvQ2xpcGJvYXJkLFxuXHRkZWZpbmVVSUVsZW1lbnRzLFxuXHRkZXNhdHVyYXRlQ29sb3IsXG5cdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcixcblx0cHVsbFBhcmFtc0Zyb21VSSxcblx0c2F0dXJhdGVDb2xvcixcblx0c2hvd0N1c3RvbUNvbG9yUG9wdXBEaXZcbn0gYXMgY29uc3Q7XG4iXX0=