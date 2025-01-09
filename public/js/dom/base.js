// File: src/dom/base.js
import { convert } from '../common/convert/index.js';
import { core, helpers, utils, superUtils } from '../common/index.js';
import { data } from '../data/index.js';
const files = data.consts.dom.files;
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
    saturateColor
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3QkFBd0I7QUFheEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3BDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsU0FBUyxpQ0FBaUM7SUFDekMsSUFBSSxDQUFDO1FBQ0osTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFVLEVBQUUsVUFBc0IsRUFBRSxFQUFFO1lBQzFELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ3JDLEVBQUUsQ0FDMEIsQ0FBQztZQUU5QixJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQ3JDLFVBQVUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQzNDLENBQUM7WUFDSCxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO29CQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDRixDQUFDLENBQUM7UUFFRixXQUFXLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsV0FBVyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLFdBQVcsQ0FBQyxvQkFBb0IsRUFB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aWxlOiBzcmMvZG9tL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdERPTUJhc2VGbkludGVyZmFjZSxcblx0R2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yLFxuXHRIU0wsXG5cdFB1bGxQYXJhbXNGcm9tVUksXG5cdFNMLFxuXHRTVixcblx0VUlFbGVtZW50c1xufSBmcm9tICcuLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb252ZXJ0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnZlcnQvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSwgaGVscGVycywgdXRpbHMsIHN1cGVyVXRpbHMgfSBmcm9tICcuLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEvaW5kZXguanMnO1xuXG5jb25zdCBmaWxlcyA9IGRhdGEuY29uc3RzLmRvbS5maWxlcztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmZ1bmN0aW9uIGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycygpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBhZGRMaXN0ZW5lciA9IChpZDogc3RyaW5nLCBjb2xvclNwYWNlOiBDb2xvclNwYWNlKSA9PiB7XG5cdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0aWRcblx0XHRcdCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuXG5cdFx0XHRpZiAoYnV0dG9uKSB7XG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG5cdFx0XHRcdFx0c3VwZXJVdGlscy5kb20uc3dpdGNoQ29sb3JTcGFjZShjb2xvclNwYWNlKVxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFtb2RlLndhcm5Mb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCB3aXRoIGlkIFwiJHtpZH1cIiBub3QgZm91bmQuYCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWNteWstYnV0dG9uJywgJ2NteWsnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1oZXgtYnV0dG9uJywgJ2hleCcpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLWhzbC1idXR0b24nLCAnaHNsJyk7XG5cdFx0YWRkTGlzdGVuZXIoJ3Nob3ctYXMtaHN2LWJ1dHRvbicsICdoc3YnKTtcblx0XHRhZGRMaXN0ZW5lcignc2hvdy1hcy1sYWItYnV0dG9uJywgJ2xhYicpO1xuXHRcdGFkZExpc3RlbmVyKCdzaG93LWFzLXJnYi1idXR0b24nLCAncmdiJyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEZhaWxlZCB0byBhZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGNvbnZlcnNpb24gYnV0dG9uczogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ29sb3IoKTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0J2N1c3RvbS1jb2xvci1waWNrZXInXG5cdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdGlmICghY29sb3JQaWNrZXIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQ29sb3IgcGlja2VyIGVsZW1lbnQgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmF3VmFsdWUgPSBjb2xvclBpY2tlci52YWx1ZS50cmltKCk7XG5cdFx0Y29uc3Qgc2VsZWN0ZWRGb3JtYXQgPSAoXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0J2N1c3RvbS1jb2xvci1mb3JtYXQnXG5cdFx0XHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbFxuXHRcdCk/LnZhbHVlIGFzIENvbG9yU3BhY2U7XG5cblx0XHRpZiAoIXV0aWxzLmNvbG9yLmlzQ29sb3JTcGFjZShzZWxlY3RlZEZvcm1hdCkpIHtcblx0XHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7c2VsZWN0ZWRGb3JtYXR9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFyc2VkQ29sb3IgPSB1dGlscy5jb2xvci5wYXJzZUNvbG9yKFxuXHRcdFx0c2VsZWN0ZWRGb3JtYXQsXG5cdFx0XHRyYXdWYWx1ZVxuXHRcdCkgYXMgRXhjbHVkZTxDb2xvciwgU0wgfCBTVj47XG5cblx0XHRpZiAoIXBhcnNlZENvbG9yKSB7XG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZTogJHtyYXdWYWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBoc2xDb2xvciA9IHV0aWxzLmNvbG9yLmlzSFNMQ29sb3IocGFyc2VkQ29sb3IpXG5cdFx0XHQ/IHBhcnNlZENvbG9yXG5cdFx0XHQ6IGNvbnZlcnQudG9IU0wocGFyc2VkQ29sb3IpO1xuXG5cdFx0cmV0dXJuIGhzbENvbG9yO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBGYWlsZWQgdG8gYXBwbHkgY3VzdG9tIGNvbG9yOiAke2Vycm9yfS4gUmV0dXJuaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBoZXggY29sb3JgXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIHV0aWxzLnJhbmRvbS5oc2woZmFsc2UpIGFzIEhTTDtcblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseUZpcnN0Q29sb3JUb1VJKGNvbG9yOiBIU0wpOiBIU0wge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbG9yQm94MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1ib3gtMScpO1xuXG5cdFx0aWYgKCFjb2xvckJveDEpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcignY29sb3ItYm94LTEgaXMgbnVsbCcpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm9ybWF0Q29sb3JTdHJpbmcgPSBjb3JlLmNvbnZlcnQudG9DU1NDb2xvclN0cmluZyhjb2xvcik7XG5cblx0XHRpZiAoIWZvcm1hdENvbG9yU3RyaW5nKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1VuZXhwZWN0ZWQgb3IgdW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0LicpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29sb3JCb3gxLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZvcm1hdENvbG9yU3RyaW5nO1xuXG5cdFx0dXRpbHMucGFsZXR0ZS5wb3B1bGF0ZU91dHB1dEJveChjb2xvciwgMSk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGFwcGx5IGZpcnN0IGNvbG9yIHRvIFVJOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHV0aWxzLnJhbmRvbS5oc2woZmFsc2UpIGFzIEhTTDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb3B5VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nLCB0b29sdGlwRWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjb2xvclZhbHVlID0gdGV4dC5yZXBsYWNlKCdDb3BpZWQgdG8gY2xpcGJvYXJkIScsICcnKS50cmltKCk7XG5cblx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkXG5cdFx0XHQud3JpdGVUZXh0KGNvbG9yVmFsdWUpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb29sdGlwKHRvb2x0aXBFbGVtZW50KTtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBDb3BpZWQgY29sb3IgdmFsdWU6ICR7Y29sb3JWYWx1ZX1gKTtcblxuXHRcdFx0XHRzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdCgpID0+IHRvb2x0aXBFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSxcblx0XHRcdFx0XHRkYXRhLmNvbnN0cy50aW1lb3V0cy50b29sdGlwIHx8IDEwMDBcblx0XHRcdFx0KTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvcHlpbmcgdG8gY2xpcGJvYXJkOicsIGVycik7XG5cdFx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY29weSB0byBjbGlwYm9hcmQ6ICR7ZXJyb3J9YCk7XG5cdFx0ZWxzZSBpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjb3B5IHRvIGNsaXBib2FyZCcpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlZmluZVVJRWxlbWVudHMoKTogVUlFbGVtZW50cyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgYWR2YW5jZWRNZW51QnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmFkdmFuY2VkTWVudUJ1dHRvbjtcblx0XHRjb25zdCBhcHBseUN1c3RvbUNvbG9yQnV0dG9uID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5hcHBseUN1c3RvbUNvbG9yQnV0dG9uO1xuXHRcdGNvbnN0IGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmNsZWFyQ3VzdG9tQ29sb3JCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmNsb3NlQ3VzdG9tQ29sb3JNZW51QnV0dG9uO1xuXHRcdGNvbnN0IGNsb3NlSGVscE1lbnVCdXR0b24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmNsb3NlSGVscE1lbnVCdXR0b247XG5cdFx0Y29uc3QgY2xvc2VIaXN0b3J5TWVudUJ1dHRvbiA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuY2xvc2VIaXN0b3J5TWVudUJ1dHRvbjtcblx0XHRjb25zdCBkZXNhdHVyYXRlQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmRlc2F0dXJhdGVCdXR0b247XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZW5hYmxlQWxwaGFDaGVja2JveDtcblx0XHRjb25zdCBnZW5lcmF0ZUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5nZW5lcmF0ZUJ1dHRvbjtcblx0XHRjb25zdCBoZWxwTWVudUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5oZWxwTWVudUJ1dHRvbjtcblx0XHRjb25zdCBoaXN0b3J5TWVudUJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5oaXN0b3J5TWVudUJ1dHRvbjtcblx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdExpZ2h0bmVzc0NoZWNrYm94O1xuXHRcdGNvbnN0IHNhdHVyYXRlQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNhdHVyYXRlQnV0dG9uO1xuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3JPcHRpb24gPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNlbGVjdGVkQ29sb3JPcHRpb247XG5cdFx0Y29uc3Qgc2hvd0FzQ01ZS0J1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNDTVlLQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0hleEJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNIZXhCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzSFNMQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc0hTTEJ1dHRvbjtcblx0XHRjb25zdCBzaG93QXNIU1ZCdXR0b24gPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuc2hvd0FzSFNWQnV0dG9uO1xuXHRcdGNvbnN0IHNob3dBc0xBQkJ1dHRvbiA9IGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5zaG93QXNMQUJCdXR0b247XG5cdFx0Y29uc3Qgc2hvd0FzUkdCQnV0dG9uID0gZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnNob3dBc1JHQkJ1dHRvbjtcblxuXHRcdGNvbnN0IHNlbGVjdGVkQ29sb3IgPSBzZWxlY3RlZENvbG9yT3B0aW9uXG5cdFx0XHQ/IHBhcnNlSW50KHNlbGVjdGVkQ29sb3JPcHRpb24udmFsdWUsIDEwKVxuXHRcdFx0OiAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFkdmFuY2VkTWVudUJ1dHRvbixcblx0XHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0XHRjbGVhckN1c3RvbUNvbG9yQnV0dG9uLFxuXHRcdFx0Y2xvc2VDdXN0b21Db2xvck1lbnVCdXR0b24sXG5cdFx0XHRjbG9zZUhlbHBNZW51QnV0dG9uLFxuXHRcdFx0Y2xvc2VIaXN0b3J5TWVudUJ1dHRvbixcblx0XHRcdGRlc2F0dXJhdGVCdXR0b24sXG5cdFx0XHRlbmFibGVBbHBoYUNoZWNrYm94LFxuXHRcdFx0Z2VuZXJhdGVCdXR0b24sXG5cdFx0XHRoZWxwTWVudUJ1dHRvbixcblx0XHRcdGhpc3RvcnlNZW51QnV0dG9uLFxuXHRcdFx0bGltaXREYXJrbmVzc0NoZWNrYm94LFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94LFxuXHRcdFx0bGltaXRMaWdodG5lc3NDaGVja2JveCxcblx0XHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdFx0c2VsZWN0ZWRDb2xvcixcblx0XHRcdHNob3dBc0NNWUtCdXR0b24sXG5cdFx0XHRzaG93QXNIZXhCdXR0b24sXG5cdFx0XHRzaG93QXNIU0xCdXR0b24sXG5cdFx0XHRzaG93QXNIU1ZCdXR0b24sXG5cdFx0XHRzaG93QXNMQUJCdXR0b24sXG5cdFx0XHRzaG93QXNSR0JCdXR0b25cblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBkZWZpbmUgVUkgYnV0dG9uczogJHtlcnJvcn0uYCk7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KSBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZGVmaW5lIFVJIGJ1dHRvbnMuJyk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWR2YW5jZWRNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbjogbnVsbCxcblx0XHRcdGNsZWFyQ3VzdG9tQ29sb3JCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUN1c3RvbUNvbG9yTWVudUJ1dHRvbjogbnVsbCxcblx0XHRcdGNsb3NlSGVscE1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRjbG9zZUhpc3RvcnlNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0ZGVzYXR1cmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGVuYWJsZUFscGhhQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRnZW5lcmF0ZUJ1dHRvbjogbnVsbCxcblx0XHRcdGhlbHBNZW51QnV0dG9uOiBudWxsLFxuXHRcdFx0aGlzdG9yeU1lbnVCdXR0b246IG51bGwsXG5cdFx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3g6IG51bGwsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94OiBudWxsLFxuXHRcdFx0c2F0dXJhdGVCdXR0b246IG51bGwsXG5cdFx0XHRzZWxlY3RlZENvbG9yOiAwLFxuXHRcdFx0c2hvd0FzQ01ZS0J1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hleEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTTEJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0hTVkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc0xBQkJ1dHRvbjogbnVsbCxcblx0XHRcdHNob3dBc1JHQkJ1dHRvbjogbnVsbFxuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVzYXR1cmF0ZUNvbG9yKHNlbGVjdGVkQ29sb3I6IG51bWJlcik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcihzZWxlY3RlZENvbG9yKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gZGVzYXR1cmF0ZSBjb2xvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50c0ZvclNlbGVjdGVkQ29sb3IoXG5cdHNlbGVjdGVkQ29sb3I6IG51bWJlclxuKTogR2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yIHtcblx0Y29uc3Qgc2VsZWN0ZWRDb2xvckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdGBjb2xvci1ib3gtJHtzZWxlY3RlZENvbG9yfWBcblx0KTtcblxuXHRpZiAoIXNlbGVjdGVkQ29sb3JCb3gpIHtcblx0XHRpZiAobW9kZS53YXJuTG9ncylcblx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCBub3QgZm91bmQgZm9yIGNvbG9yICR7c2VsZWN0ZWRDb2xvcn1gKTtcblxuXHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnUGxlYXNlIHNlbGVjdCBhIHZhbGlkIGNvbG9yLicpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkQ29sb3JUZXh0T3V0cHV0Qm94OiBudWxsLFxuXHRcdFx0c2VsZWN0ZWRDb2xvckJveDogbnVsbCxcblx0XHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzZWxlY3RlZENvbG9yVGV4dE91dHB1dEJveDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7c2VsZWN0ZWRDb2xvcn1gXG5cdFx0KSxcblx0XHRzZWxlY3RlZENvbG9yQm94LFxuXHRcdHNlbGVjdGVkQ29sb3JTdHJpcGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0YGNvbG9yLXN0cmlwZS0ke3NlbGVjdGVkQ29sb3J9YFxuXHRcdClcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZVVJKCk6IFByb21pc2U8dm9pZD4ge1xuXHRjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIFVJIHdpdGggZHluYW1pY2FsbHkgbG9hZGVkIGVsZW1lbnRzJyk7XG5cdGNvbnN0IGJ1dHRvbnMgPSBkZWZpbmVVSUVsZW1lbnRzKCk7XG5cblx0aWYgKCFidXR0b25zKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgVUkgYnV0dG9ucycpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbnMuYXBwbHlDdXN0b21Db2xvckJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBlID0+IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29uc29sZS5sb2coJ2FwcGx5Q3VzdG9tQ29sb3JCdXR0b24gY2xpY2tlZCcpO1xuXHRcdC8vICpERVYtTk9URSogYWRkIGxvZ2ljIGhlcmUuLi5cblx0fSk7XG59XG5cbmNvbnN0IGxvYWRQYXJ0aWFscyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcblx0dHJ5IHtcblx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdGZpbGVzLm1hcChmaWxlID0+XG5cdFx0XHRcdGZldGNoKGZpbGUpXG5cdFx0XHRcdFx0LnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFx0YEZhaWxlZCB0byBsb2FkICR7ZmlsZX06ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LnRoZW4oaHRtbCA9PiB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgaHRtbCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdClcblx0XHQpO1xuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5sb2coJ0hUTUwgcGFydGlhbHMgc3VjY2Vzc2Z1bGx5IGxvYWRlZC4nKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBsb2FkaW5nIHBhcnRpYWxzOiAke2Vycm9yfWApO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBwdWxsUGFyYW1zRnJvbVVJKCk6IFB1bGxQYXJhbXNGcm9tVUkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9uc0VsZW1lbnQgPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLnBhbGV0dGVUeXBlT3B0aW9ucztcblx0XHRjb25zdCBudW1Cb3hlc0VsZW1lbnQgPSBkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMucGFsZXR0ZU51bWJlck9wdGlvbnM7XG5cdFx0Y29uc3QgZW5hYmxlQWxwaGFDaGVja2JveCA9XG5cdFx0XHRkYXRhLmNvbnN0cy5kb20uZWxlbWVudHMuZW5hYmxlQWxwaGFDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0RGFya25lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdEdyYXluZXNzQ2hlY2tib3ggPVxuXHRcdFx0ZGF0YS5jb25zdHMuZG9tLmVsZW1lbnRzLmxpbWl0R3JheW5lc3NDaGVja2JveDtcblx0XHRjb25zdCBsaW1pdExpZ2h0bmVzc0NoZWNrYm94ID1cblx0XHRcdGRhdGEuY29uc3RzLmRvbS5lbGVtZW50cy5saW1pdExpZ2h0bmVzc0NoZWNrYm94O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhbGV0dGVUeXBlOiBwYWxldHRlVHlwZU9wdGlvbnNFbGVtZW50XG5cdFx0XHRcdD8gcGFyc2VJbnQocGFsZXR0ZVR5cGVPcHRpb25zRWxlbWVudC52YWx1ZSwgMTApXG5cdFx0XHRcdDogMCxcblx0XHRcdG51bUJveGVzOiBudW1Cb3hlc0VsZW1lbnQgPyBwYXJzZUludChudW1Cb3hlc0VsZW1lbnQudmFsdWUsIDEwKSA6IDAsXG5cdFx0XHRlbmFibGVBbHBoYTogZW5hYmxlQWxwaGFDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFya25lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheW5lc3NDaGVja2JveD8uY2hlY2tlZCB8fCBmYWxzZSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0bmVzc0NoZWNrYm94Py5jaGVja2VkIHx8IGZhbHNlXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcHVsbCBwYXJhbWV0ZXJzIGZyb20gVUk6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFsZXR0ZVR5cGU6IDAsXG5cdFx0XHRudW1Cb3hlczogMCxcblx0XHRcdGVuYWJsZUFscGhhOiBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5bmVzczogZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogZmFsc2Vcblx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNhdHVyYXRlQ29sb3Ioc2VsZWN0ZWRDb2xvcjogbnVtYmVyKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Z2V0RWxlbWVudHNGb3JTZWxlY3RlZENvbG9yKHNlbGVjdGVkQ29sb3IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNhdHVyYXRlIGNvbG9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBET01CYXNlRm5JbnRlcmZhY2UgPSB7XG5cdGFkZENvbnZlcnNpb25CdXR0b25FdmVudExpc3RlbmVycyxcblx0YXBwbHlDdXN0b21Db2xvcixcblx0YXBwbHlGaXJzdENvbG9yVG9VSSxcblx0Y29weVRvQ2xpcGJvYXJkLFxuXHRkZWZpbmVVSUVsZW1lbnRzLFxuXHRkZXNhdHVyYXRlQ29sb3IsXG5cdGdldEVsZW1lbnRzRm9yU2VsZWN0ZWRDb2xvcixcblx0aW5pdGlhbGl6ZVVJLFxuXHRsb2FkUGFydGlhbHMsXG5cdHB1bGxQYXJhbXNGcm9tVUksXG5cdHNhdHVyYXRlQ29sb3Jcbn0gYXMgY29uc3Q7XG4iXX0=