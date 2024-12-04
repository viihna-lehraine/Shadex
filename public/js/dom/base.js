// File: src/dom/base.ts
import { config } from '../config';
import { core, helpers, utils, superUtils } from '../common';
import { paletteUtils } from '../palette/common';
const mode = config.mode;
function addConversionButtonEventListeners() {
    try {
        const addListener = (id, colorSpace) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => superUtils.dom.switchColorSpace(colorSpace));
            }
            else {
                if (!mode.logWarnings)
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
        if (mode.logErrors)
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
        if (mode.logErrors)
            console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return utils.random.hsl(false);
    }
}
function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            if (mode.logErrors)
                console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = core.getCSSColorString(color);
        if (!formatColorString) {
            if (mode.logErrors)
                console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        utils.palette.populateOutputBox(color, 1);
        return color;
    }
    catch (error) {
        if (mode.logErrors)
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
            setTimeout(() => tooltipElement.classList.remove('show'), config.consts.timeouts.tooltip || 1000);
        })
            .catch(err => {
            if (mode.logErrors)
                console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Failed to copy to clipboard: ${error}`);
        else if (!mode.quiet)
            console.error('Failed to copy to clipboard');
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
        if (mode.logErrors)
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
        if (mode.logErrors)
            console.error(`Failed to desaturate color: ${error}`);
    }
}
function getElementsForSelectedColor(selectedColor) {
    const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    if (!selectedColorBox) {
        if (mode.logWarnings)
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
        if (mode.logErrors)
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
        if (mode.logErrors)
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
            if (mode.logErrors)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFZeEIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzdELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBRXpCLFNBQVMsaUNBQWlDO0lBQ3pDLElBQUksQ0FBQztRQUNKLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBVSxFQUFFLFVBQXNCLEVBQUUsRUFBRTtZQUMxRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNyQyxFQUFFLENBQzBCLENBQUM7WUFFOUIsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDWixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUNyQyxVQUFVLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUMzQyxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVztvQkFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNyRCxDQUFDO1FBQ0YsQ0FBQyxDQUFDO1FBRUYsV0FBVyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pD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U0FBUyxhQUFhLENBQUMsYUFBcUI7SUFDM0MsSUFBSSxDQUFDO1FBQ0osMkJBQTJCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLHVCQUF1QjtJQUMvQixJQUFJLENBQUM7UUFDSixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5ELElBQUksS0FBSyxFQUFFLENBQUM7WUFDWCxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDO2FBQU0sQ0FBQztZQUNQLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQ1osbURBQW1ELENBQ25ELENBQUM7WUFFSCxPQUFPO1FBQ1IsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUc7SUFDbkIsaUNBQWlDO0lBQ2pDLGdCQUFnQjtJQUNoQixtQkFBbUI7SUFDbkIsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsMkJBQTJCO0lBQzNCLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsdUJBQXVCO0NBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vYmFzZS50c1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0R2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRIU0wsXG5cdFB1bGxQYXJhbXNGcm9tVUksXG5cdFNMLFxuXHRTVixcblx0VUlFbGVtZW50c1xufSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgY29yZSwgaGVscGVycywgdXRpbHMsIHN1cGVyVXRpbHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgcGFsZXR0ZVV0aWxzIH0gZnJvbSAnLi4vcGFsZXR0ZS9jb21tb24nO1xuXG5jb25zdCBtb2RlID0gY29uZmlnLm1vZGU7XG5cbmZ1bmN0aW9uIGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycygpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBhZGRMaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBDb2xvclNwYWNlKSA9PiB7XG5cdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0aWRcblx0XHRcdCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0XHRpZiAoYnV0dG9uKSB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0c3VwZXJVdGlscy5kb20uc3dpdGNoQ29sb3JTcGFjZShjb2xvclNwYWNlKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFtb2RlLmxvZ1dhcm5pbmdzKVxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCB3aXRoIGlkIFwiJHtpZH1cIiBub3QgZm91bmQuYCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWNteWstYnV0dG9uJywgJ2NteWsnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1oZXgtYnV0dG9uJywgJ2hleCcpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWhzbC1idXR0b24nLCAnaHNsJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtaHN2LWJ1dHRvbicsICdoc3YnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1sYWItYnV0dG9uJywgJ2xhYicpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLXJnYi1idXR0b24nLCAncmdiJyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBhZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGNvbnZlcnNpb24gYnV0dG9uczogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ29sb3IoKTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRGb3JtYXQgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbFxuXHRcdCk/LnZhbHVlIGFzIENvbG9yU3BhY2U7XG5cblx0XHRpZiAoIXV0aWxzLmNvbG9yLmlzQ29sb3JTcGFjZShzZWxlY3RlZEZvcm1hdCkpIHtcblx0XHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7c2VsZWN0ZWRGb3JtYXR9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB1dGlscy5jb2xvci5wYXJzZUNvbG9yKFxuXHRcdFx0c2VsZWN0ZWRGb3JtYXQsXG5cdFx0XHRyYXdWYWx1ZVxuXHRcdCkgYXMgRXhjbHVkZTxDb2xvciwgU0wgfCBTVj47XG5cblx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBoc2xDb2xvciA9IHV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHQ/IHBhcnNlZENvbG9yXG5cdFx0XHQ6IHBhbGV0dGVVdGlscy5jb252ZXJ0LnRvSFNMKHBhcnNlZENvbG9yKTtcblxuXHRcdHJldHVybiBoc2xDb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGN1c3RvbSBjb2xvcjogJHtlcnJvcn0uIFJldHVybmluZyByYW5kb21seSBnZW5lcmF0ZWQgaGV4IGNvbG9yYFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvckJveDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItYm94LTEnKTtcblxuXHRcdGlmICghY29sb3JCb3gxKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvcm1hdENvbG9yU3RyaW5nID0gY29yZS5nZXRDU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1VuZXhwZWN0ZWQgb3IgdW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0LicpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0dXRpbHMucGFsZXR0ZS5wb3B1bGF0ZU91dHB1dEJveChjb2xvciwgMSk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHV0aWxzLnJhbmRvbS5oc2woZmFsc2UpIGFzIEhTTDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb29sdGlwKHRvb2x0aXBFbGVtZW50KTtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gKTtcblxuXHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdCgpID0+IHRvb2x0aXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSxcblx0XHRcdFx0XHRjb25maWcuY29uc3RzLnRpbWVvdXRzLnRvb2x0aXAgfHwgMTAwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6JywgZXJyKTtcblx0XHRcdH0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZDogJHtlcnJvcn1gKTtcblx0XHRlbHNlIGlmICghbW9kZS5xdWlldCkgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkJyk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVVJRWxlbWVudHMoKTogVUlFbGVtZW50cyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgYWR2YW5jZWRNZW51QnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uYWR2YW5jZWRNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5hcHBseUN1c3RvbUNvbG9yQnV0dG9uO1xuXHRcdGNvbnN0IGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5jbGVhckN1c3RvbUNvbG9yQnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uID1cblx0XHRcdGNvbmZpZy5jb25zdHMuZG9tLmNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlSGVscE1lbnVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5jbG9zZUhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlSGlzdG9yeU1lbnVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5jbG9zZUhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGRlc2F0dXJhdGVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5kZXNhdHVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGdlbmVyYXRlQnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uZ2VuZXJhdGVCdXR0b247XG5cdFx0Y29uc3QgaGVscE1lbnVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5oZWxwTWVudUJ1dHRvbjtcblx0XHRjb25zdCBoaXN0b3J5TWVudUJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLmhpc3RvcnlNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3Qgc2F0dXJhdGVCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5zYXR1cmF0ZUJ1dHRvbjtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9uID0gY29uZmlnLmNvbnN0cy5kb20uc2VsZWN0ZWRDb2xvck9wdGlvbjtcblx0XHRjb25zdCBzaG93QXNDTVlLQnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uc2hvd0FzQ01ZS0J1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIZXhCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5zaG93QXNIZXhCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSFNMQnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uc2hvd0FzSFNMQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hTVkJ1dHRvbiA9IGNvbmZpZy5jb25zdHMuZG9tLnNob3dBc0hTVkJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNMQUJCdXR0b24gPSBjb25maWcuY29uc3RzLmRvbS5zaG93QXNMQUJCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzUkdCQnV0dG9uID0gY29uZmlnLmNvbnN0cy5kb20uc2hvd0FzUkdCQnV0dG9uO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBzZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFkdmFuY2VkTWVudUJ1dHRvbixcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdFx0Y2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhlbHBNZW51QnV0dG9uLFxuXHRcdFx0Y2xvc2VIaXN0b3J5TWVudUJ1dHRvbixcblx0XHRcdGRlc2F0dXJhdGVCdXR0b24sXG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94LFxuXHRcdFx0Z2VuZXJhdGVCdXR0b24sXG5cdFx0XHRoZWxwTWVudUJ1dHRvbixcblx0XHRcdGhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0bGltaXREYXJrbmVzc0NoZWNrYm94LFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94LFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCxcblx0XHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0c2VsZWN0ZWRDb2xvcixcblx0XHRcdHNob3dBc0NNWUtCdXR0b24sXG5cdFx0XHRzaG93QXNIZXhCdXR0b24sXG5cdFx0XHRzaG93QXNIU0xCdXR0b24sXG5cdFx0XHRzaG93QXNIU1ZCdXR0b24sXG5cdFx0XHRzaG93QXNMQUJCdXR0b24sXG5cdFx0XHRzaG93QXNSR0JCdXR0b25cblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9uczogJHtlcnJvcn0uYCk7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZGVmaW5lIFVJIGJ1dHRvbnMuJyk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWR2YW5jZWRNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGhlbHBNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0aGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0c2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yOiAwLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hleEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTTEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTVkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0xBQkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc1JHQkJ1dHRvbjogbnVsbFxuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gZGVzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3IoXG5cdHNlbGVjdGVkQ29sb3I6IG51bWJlclxuKTogR2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yIHtcblx0Y29uc3Qgc2VsZWN0ZWRDb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0KTtcblxuXHRpZiAoIXNlbGVjdGVkQ29sb3JCb3gpIHtcblx0XHRpZiAobW9kZS5sb2dXYXJuaW5ncylcblx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCBub3QgZm91bmQgZm9yIGNvbG9yICR7c2VsZWN0ZWRDb2xvcn1gKTtcblxuXHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLicpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KSxcblx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdClcblx0fTtcbn1cblxuZnVuY3Rpb24gcHVsbFBhcmFtc0Zyb21VSSgpOiBQdWxsUGFyYW1zRnJvbVVJIHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50ID0gY29uZmlnLmNvbnN0cy5kb20ucGFsZXR0ZVR5cGVPcHRpb25zO1xuXHRcdGNvbnN0IG51bUJveGVzRWxlbWVudCA9IGNvbmZpZy5jb25zdHMuZG9tLnBhbGV0dGVOdW1iZXJPcHRpb25zO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5lbmFibGVBbHBoYUNoZWNrYm94O1xuXHRcdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPSBjb25maWcuY29uc3RzLmRvbS5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9IGNvbmZpZy5jb25zdHMuZG9tLmxpbWl0TGlnaHRuZXNzQ2hlY2tib3g7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGU6IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnRcblx0XHRcdFx0PyBwYXJzZUludChwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50LnZhbHVlLCAxMClcblx0XHRcdFx0OiAwLFxuXHRcdFx0bnVtQm94ZXM6IG51bUJveGVzRWxlbWVudCA/IHBhcnNlSW50KG51bUJveGVzRWxlbWVudC52YWx1ZSwgMTApIDogMCxcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYUNoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrbmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlLFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3g/LmNoZWNrZWQgfHwgZmFsc2Vcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBwdWxsIHBhcmFtZXRlcnMgZnJvbSBVSTogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwYWxldHRlVHlwZTogMCxcblx0XHRcdG51bUJveGVzOiAwLFxuXHRcdFx0ZW5hYmxlQWxwaGE6IGZhbHNlLFxuXHRcdFx0bGltaXREYXJrbmVzczogZmFsc2UsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBmYWxzZVxuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2hvd0N1c3RvbUNvbG9yUG9wdXBEaXYoKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtZGl2Jyk7XG5cblx0XHRpZiAocG9wdXApIHtcblx0XHRcdHBvcHVwLmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdFwiZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWRpdicpIGlzIHVuZGVmaW5lZFwiXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNob3cgY3VzdG9tIGNvbG9yIHBvcHVwIGRpdjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYmFzZSA9IHtcblx0YWRkQ29udmVyc2lvbkJ1dHRvbkV2ZW50TGlzdGVuZXJzLFxuXHRhcHBseUN1c3RvbUNvbG9yLFxuXHRhcHBseUZpcnN0Q29sb3JUb1VJLFxuXHRjb3B5VG9DbGlwYm9hcmQsXG5cdGRlZmluZVVJRWxlbWVudHMsXG5cdGRlc2F0dXJhdGVDb2xvcixcblx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRwdWxsUGFyYW1zRnJvbVVJLFxuXHRzYXR1cmF0ZUNvbG9yLFxuXHRzaG93Q3VzdG9tQ29sb3JQb3B1cERpdlxufSBhcyBjb25zdDtcbiJdfQ==