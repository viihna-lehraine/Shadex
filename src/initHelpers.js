function initializeButtons() {
    const generateButton = document.getElementById('generate-button');
    const saturateButton = document.getElementById('saturate-button');
    const desaturateButton = document.getElementById('desaturate-button');
    const popupDivButton = document.getElementById('custom-color-button');
    const applyColorButton = document.getElementById('apply-color-button');
    const clearColorButton = document.getElementById('clear-color-button');
    const advancedMenuToggleButton = document.getElementById('advanced-menu-toggle-button');
    const applyInitialColorSpaceButton = document.getElementById('apply-initial-color-space-button');
    let selectedColorOptions = document.getElementById('selected-color-options');
    let selectedColor = parseInt(selectedColorOptions.value, 10);
    
    return selectedColorOptions, selectedColor;
};