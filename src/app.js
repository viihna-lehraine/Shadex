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


// App Initialization - applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded. Initializing application');
    
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

    // Conversion Button event listeners
    document.getElementById('hex-conversion-button').addEventListener('click', () => convertColors('hex'));
    document.getElementById('rgb-conversion-button').addEventListener('click', () => convertColors('rgb'));
    document.getElementById('hsv-conversion-button').addEventListener('click', () => convertColors('hsv'));
    document.getElementById('hsl-conversion-button').addEventListener('click', () => convertColors('hsl'));
    document.getElementById('cmyk-conversion-button').addEventListener('click', () => convertColors('cmyk'));
    document.getElementById('lab-conversion-button').addEventListener('click', () => convertColors('lab'));

    // Generate Button event listener
    generateButton.addEventListener('click', function(e) {
        e.preventDefault();
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

        console.log('Generate Button clicked');
        console.log(`Generate Button - passing paletteType ${paletteType}, numBoxes ${numBoxes}, limitGrayAndBlack ${limitGrayAndBlack}, limitLight ${limitLight}, and customColor ${customColor}`);
        console.log(`Generate Button - passing initialColorSpace ${initialColorSpace} to generatePalette()`);
        console.log('Generate Button click event execution complete. Calling generatePalette()');

        generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace);
    });
    
    // Saturate Button event listener
    saturateButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('calling saturateColor');
        saturateColor(selectedColor);
    });
    
    // Desaturate Button event listener
    desaturateButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('calling desaturateColor');
        desaturateColor(selectedColor);
    });

    // Popup Div Button event litener
    popupDivButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('calling showCustomColorPopupDiv');
        showCustomColorPopupDiv();
    });

    // Apply Color Button event listener
    applyColorButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('calling applyCustomColor');
        customColor = applyCustomColor();
        console.log('customColor: ', customColor);
        console.log('calling showCustomColorPopupDiv');
        showCustomColorPopupDiv();
    });

    // Clear Color Button event listener
    clearColorButton.addEventListener('click', function(e) {
        e.preventDefault();
        customColor = null;
        console.log('calling showCustomColorPopupDiv');
        showCustomColorPopupDiv();
    });

    // Advanced Menu Toggle Button event listener
    advancedMenuToggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        let advancedMenu = document.getElementById('advanced-menu');
                
        if (advancedMenu.classList.contains('hidden')) {
            advancedMenu.classList.remove('hidden');
            advancedMenu.style.display = 'block';
        } else {
            advancedMenu.classList.add('hidden');
            advancedMenu.style.display = 'none';
        }
    });

    // Advanced Menu - Apply Initial Color Space Button event listener
    applyInitialColorSpaceButton.addEventListener('click', function(e) {
        e.preventDefault();
        let initialColorSpace = document.getElementById('initial-color-space-options').value;
        // function does not yet exist
    //    applyInitialColorSpace(initialColorSpace);
    });
});