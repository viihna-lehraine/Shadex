import { convertColors } from '../modules/color-convert/convert';

// defines buttons for the main UI 
function defineUIButtons() {
    const generateButton = document.getElementById('generate-button');
    const saturateButton = document.getElementById('saturate-button');
    const desaturateButton = document.getElementById('desaturate-button');
    const popupDivButton = document.getElementById('custom-color-button');
    const applyCustomColorButton = document.getElementById('apply-custom-color-button');
    const clearCustomColorButton = document.getElementById('clear-custom-color-button');
    const advancedMenuToggleButton = document.getElementById('advanced-menu-toggle-button');
    const applyInitialColorSpaceButton = document.getElementById('apply-initial-color-space-button');
    const selectedColorOptions = document.getElementById('selected-color-options') as HTMLSelectElement | null;
    const selectedColor = selectedColorOptions ? parseInt(selectedColorOptions.value, 10) : 0;

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
    }
};

// add conversion button event listeners
function addConversionButtonEventListeners() {
    const addListener = (id: string, colorSpace: string) => {
        const button = document.getElementById(id) as HTMLButtonElement | null;
        if (button) {
            button.addEventListener('click', () => convertColors(colorSpace));
        } else {
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

//extracts user-defined parameters
function pullParametersFromUI() {
    const paletteTypeElement = document.getElementById('palette-type-options') as HTMLSelectElement | null;
    const numBoxesElement = document.getElementById('palette-number-options') as HTMLSelectElement | null;
    const limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox') as HTMLInputElement | null;
    const limitLightCheckbox = document.getElementById('limitLightCheckbox') as HTMLInputElement | null;
    const initialColorSpaceElement = document.getElementById('initial-color-space-options') as HTMLSelectElement | null;

    const paletteType = paletteTypeElement ? parseInt(paletteTypeElement.value, 10) : 0;
    const numBoxes = numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0;
    const limitGrayAndBlack = limitGrayAndBlackCheckbox ? limitGrayAndBlackCheckbox.checked : false;
    const limitLight = limitLightCheckbox ? limitLightCheckbox.checked : false;

    const validColorSpaces = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab'];
    let initialColorSpace = initialColorSpaceElement ? initialColorSpaceElement.value : 'hex';

    if (!validColorSpaces.includes(initialColorSpace)) {
        initialColorSpace = 'hex';
        console.log('No user-defined initial color space found. Using default value');
    }

    return {
        paletteType,
        numBoxes,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    };
}

export { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI };