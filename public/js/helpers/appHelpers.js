// Defines buttons for the main UI 
function defineUIButtons() {
    const generateButton = document.getElementById('generate-button');
    const saturateButton = document.getElementById('saturate-button');
    const desaturateButton = document.getElementById('desaturate-button');
    const popupDivButton = document.getElementById('custom-color-button');
    const applyCustomColorButton = document.getElementById('apply-custom-color-button');
    const clearCustomColorButton = document.getElementById('clear-custom-color-button');
    const advancedMenuToggleButton = document.getElementById('advanced-menu-toggle-button');
    const applyInitialColorSpaceButton = document.getElementById('apply-initial-color-space-button');
    let selectedColorOptions = document.getElementById('selected-color-options');
    let selectedColor = parseInt(selectedColorOptions.value, 10);

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


// Add conversion button event listeners
function addConversionButtonEventListeners() {
    document.getElementById('hex-conversion-button').addEventListener('click', () => convertColors('hex'));
    document.getElementById('rgb-conversion-button').addEventListener('click', () => convertColors('rgb'));
    document.getElementById('hsv-conversion-button').addEventListener('click', () => convertColors('hsv'));
    document.getElementById('hsl-conversion-button').addEventListener('click', () => convertColors('hsl'));
    document.getElementById('cmyk-conversion-button').addEventListener('click', () => convertColors('cmyk'));
    document.getElementById('lab-conversion-button').addEventListener('click', () => convertColors('lab'));
};


//Extracts user-defined parameters
function pullParametersFromUI() {
    const paletteType = parseInt(document.getElementById('palette-type-options').value);
    const numBoxes = parseInt(document.getElementById('palette-number-options').value);
    const limitGrayAndBlack = document.getElementById('limitGrayAndBlackCheckbox').checked;
    const limitLight = document.getElementById('limitLightCheckbox').checked;
    const validColorSpaces = [ 'hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab' ];
    let initialColorSpace = document.getElementById('initial-color-space-options').value;

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
    }
};


export { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI };