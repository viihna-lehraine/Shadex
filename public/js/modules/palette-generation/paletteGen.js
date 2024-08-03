// ColorGen - version 0.5.21-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { generatePaletteBox, generatePaletteExitLogs, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck,randomInitialColor } from '../../export.js';


// Generate Initial Palette
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace = 'hex') {
    console.log('executing generatePalette');

    let colors = [];
    let baseColor;

    console.log('customColor: ', customColor, " data type: ", (typeof customColor));

    // First, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
    // If customColor has no value, will instead assign it a default value while formatting it as an object
    paletteGenColorSpaceConditionCheck(customColor);

    randomInitialColor(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight);

    // Generate user-selected palette type
    generateSelectedPaletteType(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

    console.log('generated the user-selected paette')

    if (!colors) {
        console.error('ERROR - Unable to determine palette type');
        return;
    }

    // Error handling if colors array is malformed
    if (!colors || colors.length === 0) {
        console.error('colors array is empty or undefined');
    }

    // Logs value and data type for colors and numBoxes before announcing the successful completion of generatePalette 
    generatePaletteExitLogs(colors, numBoxes);

    generatePaletteBox(colors, numBoxes);
};


// *DEV-NOTE* What the fuck is this function actually doing anymore???
// Define default behavior for generateButton click event
function handleGenerateButtonClick() {
    console.log('executing handleGenerateButtonClick');
    
    const {
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    } = parameterAssignForGenerateButtonEventHandler();

    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace);
};


export { generatePalette, handleGenerateButtonClick };