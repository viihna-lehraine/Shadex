// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE


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
    
    return generateButton, saturateButton, sTudTe.selectedColorOptions, selectedColor;
};