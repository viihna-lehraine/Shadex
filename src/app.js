// ColorGen - version 0.5

// Author: Viihna Leraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// All code herein is STRICTLY free (as in freedom). You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful! I only ask that you show me what you did so that I can observe and learn.

// This program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND

// This file initializes the application before further handling by additional JS modules. Modules are located at /src/modules/ and /src/utils/


// BEGIN CODE



import { convertColors, showCustomColorPopupDiv, applyCustomColor } from './modules/index.js';
import { generatePalette } from './modules/palette-generation/index.js';

// Initialize customColor variable
let customColor = null;

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const popupDivButton = document.getElementById('custom-color-button');
    const applyColorButton = document.getElementById('apply-color-button');
    const clearColorButton = document.getElementById('clear-color-button');

    // Add event listeners for conversion buttons
    document.getElementById('hex-conversion-button').addEventListener('click', () => convertColors('hex'));
    document.getElementById('rgb-conversion-button').addEventListener('click', () => convertColors('rgb'));
    document.getElementById('hsv-conversion-button').addEventListener('click', () => convertColors('hsv'));
    document.getElementById('hsl-conversion-button').addEventListener('click', () => convertColors('hsl'));
    document.getElementById('cmyk-conversion-button').addEventListener('click', () => convertColors('cmyk'));
    document.getElementById('lab-conversion-button').addEventListener('click', () => convertColors('lab'));

    // Generate Button click event
    generateButton.addEventListener('click', function(e) {
        e.preventDefault();
        const paletteType = parseInt(document.getElementById('palette-type-options').value);
        const numBoxes = parseInt(document.getElementById('palette-number-options').value);
        const limitGrayAndBlack = document.getElementById('limitGrayAndBlackCheckbox').checked;
        const limitLight = document.getElementById('limitLightCheckbox').checked;
        generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor);
    });

    // Popup Div button click event
    popupDivButton.addEventListener('click', function(e) {
        e.preventDefault();
        showCustomColorPopupDiv();
    });

    // Apply color button click event
    applyColorButton.addEventListener('click', function(e) {
        e.preventDefault();
        customColor = applyCustomColor();
        showCustomColorPopupDiv();
    });

    // Clear color button click event
    clearColorButton.addEventListener('click', function(e) {
        e.preventDefault();
        customColor = null;
        showCustomColorPopupDiv();
    });
});