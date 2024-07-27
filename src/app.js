// ColorGen - version 0.5

// Author: Viihna Leraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// All code herein is STRICTLY free (as in freedom). You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful! I only ask that you show me what you did so that I can observe and learn.

// This program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND

// This file initializes the application before further handling by additional JS modules. Modules are located at /src/modules/ and /src/utils/


// BEGIN CODE



import { defineUIButtons, addConversionButtonEventListeners, pullParametersFromUI } from './appHelpers.js';
import { convertColors, showCustomColorPopupDiv, applyCustomColor } from './modules/index.js';
import { generateButtonExitLogs } from './utils/index.js';
import { generatePalette } from './modules/palette-generation/index.js';


// App Initialization - applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded. Initializing application');
    
    // Defines the buttons within the main UI 
    const {
        generateButton,
        saturateButton,
        desaturateButton,
        popupDivButton,
        applyColorButton,
        clearColorButton,
        advancedMenuToggleButton,
        applyInitialColorSpaceButton,
        selectedColor
    } = defineUIButtons();

    // Adds the Conversion Button event listeners
    addConversionButtonEventListeners();

    // Generate Button event listener
    generateButton.addEventListener('click', function(e) {
        e.preventDefault();

        let { paletteType, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace } = pullParametersFromUI();

        // Set default values if not provided by user
        initialColorSpace = initialColorSpace || 'hex';
        
        // Logs status information about variable values before exiting the generateButton event listener
        generateButtonExitLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace);

        //*DEV-NOTE* add descriptive comment
        generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace);
    });
    
    // Saturate Button event listener
    saturateButton.addEventListener('click', function(e) {
        e.preventDefault();

        console.log('calling saturateColor');
        
        //*DEV-NOTE* add descriptive comment
        saturateColor(selectedColor);
    });
    
    // Desaturate Button event listener
    desaturateButton.addEventListener('click', function(e) {
        e.preventDefault();

        console.log('calling desaturateColor');

        //*DEV-NOTE* add descriptive comment
        desaturateColor(selectedColor);
    });

    // Popup Div Button event listener
    popupDivButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('calling showCustomColorPopupDiv');
        
        //*DEV-NOTE* add descriptive comment
        showCustomColorPopupDiv();
    });

    // Apply Color Button event listener
    applyColorButton.addEventListener('click', function(e) {
        e.preventDefault();

        console.log('calling applyCustomColor');

        //*DEV-NOTE* add descriptive comment
        customColor = applyCustomColor();
        console.log('customColor: ', customColor, ' type: ', (typeof customColor));
        console.log('calling showCustomColorPopupDiv');

        // Displays an overlay div allowing the user to select a custom color
        showCustomColorPopupDiv();
    });

    // Clear Color Button event listener
    clearColorButton.addEventListener('click', function(e) {
        e.preventDefault();

        customColor = null;
        
        //*DEV-NOTE* add descriptive comment
        console.log('calling showCustomColorPopupDiv');

        // Displays an overlay div allowing the user to select a custom color
        showCustomColorPopupDiv();
    });

    // Advanced Menu Toggle Button event listener
    //*DEV-NOTE* add descriptive comment
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
        // applyInitialColorSpace(initialColorSpace);
    });
});