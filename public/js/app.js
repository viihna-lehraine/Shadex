// ColorGen - version 0.5.22-dev

// Author: Viihna Leraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)

// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful! I only ask that you to credit me as the original author, and more importantly, show me what you did. I'm still a rookie programmer, and would love to look at and learn from any changes you make!

// This program comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND

// This file initializes the application before further handling by additional JS modules


// BEGIN CODE



import { addConversionButtonEventListeners, applyCustomColor, defineUIButtons, generateButtonExitLogs, generatePalette, pullParametersFromUI, showCustomColorPopupDiv } from './export.js';


let customColor = null;


// App Initialization - applies all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js - DOM content loaded; initializing application');
    
    // Defines the buttons within the main UI
    console.log('app.js > DOM event listener - calling defineUIButtons() and defining its output as properties of an unnamed object'); 
    const {
        generateButton,
        saturateButton,
        desaturateButton,
        popupDivButton,
        applyCustomColorButton,
        clearCustomColorButton,
        advancedMenuToggleButton,
        applyInitialColorSpaceButton,
        selectedColor
    } = defineUIButtons();

    // Adds the Conversion Button event listeners
    console.log('app.js > DOM event listener - caling addConversionButtonEventListeners()');
    addConversionButtonEventListeners();

    // Generate Button event listener
    generateButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('app.js > generateButton event listener - calling pullParametersFromUI() and defining its output as properties of an unnamed object');
        let { paletteType, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace } = pullParametersFromUI();
        initialColorSpace = initialColorSpace || 'hex'; // set default values if not provided by user
        generateButtonExitLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace); // logs status information about variable values before exiting the generateButton event listener
        generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace); //*DEV-NOTE* add descriptive comment
    })
    
    // Saturate Button event listener
    saturateButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('app.js > saturateButton event listener- calling saturateColor()');
        saturateColor(selectedColor); //*DEV-NOTE* add descriptive comment
    })
    
    // Desaturate Button event listener
    desaturateButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('app.js > desaturateButton evenet listener- calling desaturateColor()');
        desaturateColor(selectedColor); //*DEV-NOTE* add descriptive comment
    })

    // Popup Div Button event listener
    popupDivButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('app.js > popupDivButton event listener - calling showCustomColorPopupDiv()');
        showCustomColorPopupDiv(); //*DEV-NOTE* add descriptive comment
    })

    // Apply Color Button event listener
    applyCustomColorButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('app.js > applyCustomColorButton event listener - calling applyCustomColor()');
        customColor = applyCustomColor(); //*DEV-NOTE* add descriptive comment above
        console.log('customColor: ', customColor, ' type: ', (typeof customColor));
        console.log('calling showCustomColorPopupDiv()');
        showCustomColorPopupDiv(); // displays an overlay div allowing the user to select a custom color
    })

    // Clear Color Button event listener
    clearCustomColorButton.addEventListener('click', function(e) {
        e.preventDefault();
        customColor = null;
        console.log('app.js > clearCustomColorButton event listener - calling showCustomColorPopupDiv()'); //*DEV-NOTE* add descriptive comment
        showCustomColorPopupDiv(); // displays an overlay div allowing the user to select a custom color
    })

    // Advanced Menu Toggle Button event listener / *DEV-NOTE* add descriptive comment
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
    })

    // Advanced Menu - Apply Initial Color Space Button event listener
    applyInitialColorSpaceButton.addEventListener('click', function(e) {
        e.preventDefault();
        let initialColorSpace = document.getElementById('initial-color-space-options').value;

        // function does not yet exist
        // applyInitialColorSpace(initialColorSpace);
    })
});