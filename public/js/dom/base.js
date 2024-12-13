// File: src/dom/base.js
import { convert } from '../common/convert/index.js';
import { core, helpers, utils, superUtils } from '../common/index.js';
import { data } from '../data/index.js';
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
const loadPartials = async () => {
    const files = [
        './html/advanced-menu.html',
        './html/custom-color-menu.html',
        './html/help-menu.html',
        './html/history-menu.html'
    ];
    try {
        await Promise.all(files.map(file => fetch(file)
            .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.statusText}`);
            }
            return response.text();
        })
            .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })));
        if (!mode.quiet)
            console.log('HTML partials successfully loaded.');
    }
    catch (error) {
        console.error(`Error loading partials: ${error}`);
    }
};
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
    initializeUI,
    loadPartials,
    pullParamsFromUI,
    saturateColor,
    showCustomColorPopupDiv
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFheEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV2QixTQUFTLGlDQUFpQztJQUN6QyxJQUFJLENBQUM7UUFDSixNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQVUsRUFBRSxVQUFzQixFQUFFLEVBQUU7WUFDMUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDckMsRUFBRSxDQUMwQixDQUFDO1lBRTlCLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FDckMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FDM0MsQ0FBQztZQUNILENBQUM7aUJBQU0sQ0FBQztnQkFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNGLENBQUMsQ0FBQztRQUVGLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztR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QzthQUFNLENBQUM7WUFDUCxJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUNaLG1EQUFtRCxDQUNuRCxDQUFDO1lBRUgsT0FBTztRQUNSLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUF1QjtJQUN2QyxpQ0FBaUM7SUFDakMsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZiwyQkFBMkI7SUFDM0IsWUFBWTtJQUNaLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLHVCQUF1QjtDQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZG9tL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdERPTUJhc2VGbkludGVyZmFjZSxcblx0R2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRIU0wsXG5cdFB1bGxQYXJhbXNGcm9tVUksXG5cdFNMLFxuXHRTVixcblx0VUlFbGVtZW50c1xufSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb252ZXJ0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnZlcnQvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSwgaGVscGVycywgdXRpbHMsIHN1cGVyVXRpbHMgfSBmcm9tICcuLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEvaW5kZXguanMnO1xuXG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuXG5mdW5jdGlvbiBhZGRDb252ZXJzaW9uQnV0dG9uRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgYWRkTGlzdGVuZXIgPSAoaWQ6IHN0cmluZywgY29sb3JTcGFjZTogQ29sb3JTcGFjZSkgPT4ge1xuXHRcdFx0Y29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGlkXG5cdFx0XHQpIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0aWYgKGJ1dHRvbikge1xuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuXHRcdFx0XHRcdHN1cGVyVXRpbHMuZG9tLnN3aXRjaENvbG9yU3BhY2UoY29sb3JTcGFjZSlcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghbW9kZS53YXJuTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgd2l0aCBpZCBcIiR7aWR9XCIgbm90IGZvdW5kLmApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1jbXlrLWJ1dHRvbicsICdjbXlrJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtaGV4LWJ1dHRvbicsICdoZXgnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1oc2wtYnV0dG9uJywgJ2hzbCcpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWhzdi1idXR0b24nLCAnaHN2Jyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtbGFiLWJ1dHRvbicsICdsYWInKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1yZ2ItYnV0dG9uJywgJ3JnYicpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gYWRkIGV2ZW50IGxpc3RlbmVycyB0byBjb252ZXJzaW9uIGJ1dHRvbnM6ICR7ZXJyb3J9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUN1c3RvbUNvbG9yKCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdCdjdXN0b20tY29sb3ItcGlja2VyJ1xuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yUGlja2VyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yIHBpY2tlciBlbGVtZW50IG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJhd1ZhbHVlID0gY29sb3JQaWNrZXIudmFsdWUudHJpbSgpO1xuXHRcdGNvbnN0IHNlbGVjdGVkRm9ybWF0ID0gKFxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdCdjdXN0b20tY29sb3ItZm9ybWF0J1xuXHRcdFx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGxcblx0XHQpPy52YWx1ZSBhcyBDb2xvclNwYWNlO1xuXG5cdFx0aWYgKCF1dGlscy5jb2xvci5pc0NvbG9yU3BhY2Uoc2VsZWN0ZWRGb3JtYXQpKSB7XG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke3NlbGVjdGVkRm9ybWF0fWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHBhcnNlZENvbG9yID0gdXRpbHMuY29sb3IucGFyc2VDb2xvcihcblx0XHRcdHNlbGVjdGVkRm9ybWF0LFxuXHRcdFx0cmF3VmFsdWVcblx0XHQpIGFzIEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+O1xuXG5cdFx0aWYgKCFwYXJzZWRDb2xvcikge1xuXHRcdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWU6ICR7cmF3VmFsdWV9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaHNsQ29sb3IgPSB1dGlscy5jb2xvci5pc0hTTENvbG9yKHBhcnNlZENvbG9yKVxuXHRcdFx0PyBwYXJzZWRDb2xvclxuXHRcdFx0OiBjb252ZXJ0LnRvSFNMKHBhcnNlZENvbG9yKTtcblxuXHRcdHJldHVybiBoc2xDb2xvcjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGFwcGx5IGN1c3RvbSBjb2xvcjogJHtlcnJvcn0uIFJldHVybmluZyByYW5kb21seSBnZW5lcmF0ZWQgaGV4IGNvbG9yYFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaXJzdENvbG9yVG9VSShjb2xvcjogSFNMKTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvckJveDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3ItYm94LTEnKTtcblxuXHRcdGlmICghY29sb3JCb3gxKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoJ2NvbG9yLWJveC0xIGlzIG51bGwnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvcm1hdENvbG9yU3RyaW5nID0gY29yZS5jb252ZXJ0LnRvQ1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0aWYgKCFmb3JtYXRDb2xvclN0cmluZykge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIG9yIHVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdC4nKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbG9yQm94MS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmb3JtYXRDb2xvclN0cmluZztcblxuXHRcdHV0aWxzLnBhbGV0dGUucG9wdWxhdGVPdXRwdXRCb3goY29sb3IsIDEpO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBhcHBseSBmaXJzdCBjb2xvciB0byBVSTogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiB1dGlscy5yYW5kb20uaHNsKGZhbHNlKSBhcyBIU0w7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZywgdG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29sb3JWYWx1ZSA9IHRleHQucmVwbGFjZSgnQ29waWVkIHRvIGNsaXBib2FyZCEnLCAnJykudHJpbSgpO1xuXG5cdFx0bmF2aWdhdG9yLmNsaXBib2FyZFxuXHRcdFx0LndyaXRlVGV4dChjb2xvclZhbHVlKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9vbHRpcCh0b29sdGlwRWxlbWVudCk7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgQ29waWVkIGNvbG9yIHZhbHVlOiAke2NvbG9yVmFsdWV9YCk7XG5cblx0XHRcdFx0c2V0VGltZW91dChcblx0XHRcdFx0XHQoKSA9PiB0b29sdGlwRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksXG5cdFx0XHRcdFx0ZGF0YS5jb25zdHMudGltZW91dHMudG9vbHRpcCB8fCAxMDAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBjb3B5aW5nIHRvIGNsaXBib2FyZDonLCBlcnIpO1xuXHRcdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGNvcHkgdG8gY2xpcGJvYXJkOiAke2Vycm9yfWApO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBkZWZpbmVVSUVsZW1lbnRzKCk6IFVJRWxlbWVudHMge1xuXHR0cnkge1xuXHRcdGNvbnN0IGFkdmFuY2VkTWVudUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5hZHZhbmNlZE1lbnVCdXR0b247XG5cdFx0Y29uc3QgYXBwbHlDdXN0b21Db2xvckJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuYXBwbHlDdXN0b21Db2xvckJ1dHRvbjtcblx0XHRjb25zdCBjbGVhckN1c3RvbUNvbG9yQnV0dG9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jbGVhckN1c3RvbUNvbG9yQnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbjtcblx0XHRjb25zdCBjbG9zZUhlbHBNZW51QnV0dG9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5jbG9zZUhlbHBNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlSGlzdG9yeU1lbnVCdXR0b24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmNsb3NlSGlzdG9yeU1lbnVCdXR0b247XG5cdFx0Y29uc3QgZGVzYXR1cmF0ZUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5kZXNhdHVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmVuYWJsZUFscGhhQ2hlY2tib3g7XG5cdFx0Y29uc3QgZ2VuZXJhdGVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZ2VuZXJhdGVCdXR0b247XG5cdFx0Y29uc3QgaGVscE1lbnVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuaGVscE1lbnVCdXR0b247XG5cdFx0Y29uc3QgaGlzdG9yeU1lbnVCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuaGlzdG9yeU1lbnVCdXR0b247XG5cdFx0Y29uc3QgbGltaXREYXJrbmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdERhcmtuZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdEdyYXluZXNzQ2hlY2tib3g7XG5cdFx0Y29uc3QgbGltaXRMaWdodG5lc3NDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMubGltaXRMaWdodG5lc3NDaGVja2JveDtcblx0XHRjb25zdCBzYXR1cmF0ZUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zYXR1cmF0ZUJ1dHRvbjtcblx0XHRjb25zdCBzZWxlY3RlZENvbG9yT3B0aW9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zZWxlY3RlZENvbG9yT3B0aW9uO1xuXHRcdGNvbnN0IHNob3dBc0NNWUtCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzQ01ZS0J1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIZXhCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzSGV4QnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hTTEJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNIU0xCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSFNWQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0hTVkJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNMQUJCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzTEFCQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc1JHQkJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNSR0JCdXR0b247XG5cblx0XHRjb25zdCBzZWxlY3RlZENvbG9yID0gc2VsZWN0ZWRDb2xvck9wdGlvblxuXHRcdFx0PyBwYXJzZUludChzZWxlY3RlZENvbG9yT3B0aW9uLnZhbHVlLCAxMClcblx0XHRcdDogMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRhZHZhbmNlZE1lbnVCdXR0b24sXG5cdFx0XHRhcHBseUN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbixcblx0XHRcdGNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uLFxuXHRcdFx0Y2xvc2VIZWxwTWVudUJ1dHRvbixcblx0XHRcdGNsb3NlSGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0XHRkZXNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0ZW5hYmxlQWxwaGFDaGVja2JveCxcblx0XHRcdGdlbmVyYXRlQnV0dG9uLFxuXHRcdFx0aGVscE1lbnVCdXR0b24sXG5cdFx0XHRoaXN0b3J5TWVudUJ1dHRvbixcblx0XHRcdGxpbWl0RGFya25lc3NDaGVja2JveCxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveCxcblx0XHRcdGxpbWl0TGlnaHRuZXNzQ2hlY2tib3gsXG5cdFx0XHRzYXR1cmF0ZUJ1dHRvbixcblx0XHRcdHNlbGVjdGVkQ29sb3IsXG5cdFx0XHRzaG93QXNDTVlLQnV0dG9uLFxuXHRcdFx0c2hvd0FzSGV4QnV0dG9uLFxuXHRcdFx0c2hvd0FzSFNMQnV0dG9uLFxuXHRcdFx0c2hvd0FzSFNWQnV0dG9uLFxuXHRcdFx0c2hvd0FzTEFCQnV0dG9uLFxuXHRcdFx0c2hvd0FzUkdCQnV0dG9uXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gZGVmaW5lIFVJIGJ1dHRvbnM6ICR7ZXJyb3J9LmApO1xuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRlZmluZSBVSSBidXR0b25zLicpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFkdmFuY2VkTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUhlbHBNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0Y2xvc2VIaXN0b3J5TWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGRlc2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94OiBudWxsLFxuXHRcdFx0Z2VuZXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRoZWxwTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGhpc3RvcnlNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0bGltaXREYXJrbmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveDogbnVsbCxcblx0XHRcdGxpbWl0R3JheW5lc3NDaGVja2JveDogbnVsbCxcblx0XHRcdHNhdHVyYXRlQnV0dG9uOiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvcjogMCxcblx0XHRcdHNob3dBc0NNWUtCdXR0b246IG51bGwsXG5cdFx0XHRzaG93QXNIZXhCdXR0b246IG51bGwsXG5cdFx0XHRzaG93QXNIU0xCdXR0b246IG51bGwsXG5cdFx0XHRzaG93QXNIU1ZCdXR0b246IG51bGwsXG5cdFx0XHRzaG93QXNMQUJCdXR0b246IG51bGwsXG5cdFx0XHRzaG93QXNSR0JCdXR0b246IG51bGxcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGVDb2xvcihzZWxlY3RlZENvbG9yOiBudW1iZXIpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3Ioc2VsZWN0ZWRDb2xvcik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlc2F0dXJhdGUgY29sb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKFxuXHRzZWxlY3RlZENvbG9yOiBudW1iZXJcbik6IEdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvciB7XG5cdGNvbnN0IHNlbGVjdGVkQ29sb3JCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRgY29sb3ItYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdCk7XG5cblx0aWYgKCFzZWxlY3RlZENvbG9yQm94KSB7XG5cdFx0aWYgKG1vZGUud2FybkxvZ3MpXG5cdFx0XHRjb25zb2xlLndhcm4oYEVsZW1lbnQgbm90IGZvdW5kIGZvciBjb2xvciAke3NlbGVjdGVkQ29sb3J9YCk7XG5cblx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ1BsZWFzZSBzZWxlY3QgYSB2YWxpZCBjb2xvci4nKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JCb3g6IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBudWxsXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0c2VsZWN0ZWRDb2xvclRleHRPdXRwdXRCb3g6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXRleHQtb3V0cHV0LWJveC0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdCksXG5cdFx0c2VsZWN0ZWRDb2xvckJveCxcblx0XHRzZWxlY3RlZENvbG9yU3RyaXBlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci1zdHJpcGUtJHtzZWxlY3RlZENvbG9yfWBcblx0XHQpXG5cdH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemVVSSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0Y29uc29sZS5sb2coJ0luaXRpYWxpemluZyBVSSB3aXRoIGR5bmFtaWNhbGx5IGxvYWRlZCBlbGVtZW50cycpO1xuXHRjb25zdCBidXR0b25zID0gZGVmaW5lVUlFbGVtZW50cygpO1xuXG5cdGlmICghYnV0dG9ucykge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFVJIGJ1dHRvbnMnKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRidXR0b25zLmFwcGx5Q3VzdG9tQ29sb3JCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZSA9PiB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGNvbnNvbGUubG9nKCdhcHBseUN1c3RvbUNvbG9yQnV0dG9uIGNsaWNrZWQnKTtcblx0XHQvLyAqREVWLU5PVEUqIGFkZCBsb2dpYyBoZXJlLi4uXG5cdH0pO1xufVxuXG5jb25zdCBsb2FkUGFydGlhbHMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG5cdGNvbnN0IGZpbGVzID0gW1xuXHRcdCcuL2h0bWwvYWR2YW5jZWQtbWVudS5odG1sJyxcblx0XHQnLi9odG1sL2N1c3RvbS1jb2xvci1tZW51Lmh0bWwnLFxuXHRcdCcuL2h0bWwvaGVscC1tZW51Lmh0bWwnLFxuXHRcdCcuL2h0bWwvaGlzdG9yeS1tZW51Lmh0bWwnXG5cdF07XG5cblx0dHJ5IHtcblx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdGZpbGVzLm1hcChmaWxlID0+XG5cdFx0XHRcdGZldGNoKGZpbGUpXG5cdFx0XHRcdFx0LnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFx0YEZhaWxlZCB0byBsb2FkICR7ZmlsZX06ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oaHRtbCA9PiB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgaHRtbCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdClcblx0XHQpO1xuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ0hUTUwgcGFydGlhbHMgc3VjY2Vzc2Z1bGx5IGxvYWRlZC4nKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBsb2FkaW5nIHBhcnRpYWxzOiAke2Vycm9yfWApO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBwdWxsUGFyYW1zRnJvbVVJKCk6IFB1bGxQYXJhbXNGcm9tVUkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQgPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZW5hYmxlQWxwaGFDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdExpZ2h0bmVzc0NoZWNrYm94O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50XG5cdFx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdDogMCxcblx0XHRcdG51bUJveGVzOiBudW1Cb3hlc0VsZW1lbnQgPyBwYXJzZUludChudW1Cb3hlc0VsZW1lbnQudmFsdWUsIDEwKSA6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFya25lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcHVsbCBwYXJhbWV0ZXJzIGZyb20gVUk6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGU6IDAsXG5cdFx0XHRudW1Cb3hlczogMCxcblx0XHRcdGVuYWJsZUFscGhhOiBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5bmVzczogZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogZmFsc2Vcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNob3dDdXN0b21Db2xvclBvcHVwRGl2KCk6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWRpdicpO1xuXG5cdFx0aWYgKHBvcHVwKSB7XG5cdFx0XHRwb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1kaXYnKSBpcyB1bmRlZmluZWRcIlxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBzaG93IGN1c3RvbSBjb2xvciBwb3B1cCBkaXY6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IERPTUJhc2VGbkludGVyZmFjZSA9IHtcblx0YWRkQ29udmVyc2lvbkJ1dHRvbkV2ZW50TGlzdGVuZXJzLFxuXHRhcHBseUN1c3RvbUNvbG9yLFxuXHRhcHBseUZpcnN0Q29sb3JUb1VJLFxuXHRjb3B5VG9DbGlwYm9hcmQsXG5cdGRlZmluZVVJRWxlbWVudHMsXG5cdGRlc2F0dXJhdGVDb2xvcixcblx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRpbml0aWFsaXplVUksXG5cdGxvYWRQYXJ0aWFscyxcblx0cHVsbFBhcmFtc0Zyb21VSSxcblx0c2F0dXJhdGVDb2xvcixcblx0c2hvd0N1c3RvbUNvbG9yUG9wdXBEaXZcbn0gYXMgY29uc3Q7XG4iXX0=