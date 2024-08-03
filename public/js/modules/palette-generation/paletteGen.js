// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { generatePaletteBox, generatePaletteExitLogs, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck,randomInitialColor } from '../../export.js';


// Generate Initial Palette
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace = 'hex') {
    console.log('generatePalette() executing');

    let colors = [];
    let baseColor;

    console.log('generatePalette() - customColor: ', customColor, ' type: ', (typeof customColor));

    // First, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
    // If customColor has no value, will instead assign it a default value while formatting it as an object
    console.log('generatePalette() - calling paletteGenColorSpaceConditionCheck()');
    paletteGenColorSpaceConditionCheck(customColor, initialColorSpace);

    console.log('generatePalette() - calling randomInitialColor()');
    randomInitialColor(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight);

    // Generate user-selected palette type
    console.log('generatePalette() - calling generateSelectedPaletteType()');
    generateSelectedPaletteType(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

    console.log('generatePalette() - generated the user-selected paette')
    console.log('generatePalette() - colors: ', colors, ' type: ', (typeof colors));

    if (!colors) {
        console.error('generatePalette() - ERROR - Unable to determine palette type; returning');
        return;
    }

    // Error handling if colors array is malformed
    if (!colors || colors.length === 0) {
        console.error('generatePalette() - colors array is empty or undefined');
    }

    console.log('generatePalette() - calling generatePaletteBox()');
    generatePaletteBox(colors, numBoxes);

    generatePaletteExitLogs(colors, numBoxes);
};


// *DEV-NOTE* What the fuck is this function actually doing anymore???
// Define default behavior for generateButton click event
function handleGenerateButtonClick() {
    console.log('handleGenerateButtonClick() executing');
    
    console.log('handleGenerateButtonClick() - calling parameterAssignForGenerateButtonEventHandler() and declare its returned values as properties of a new, unnamed object');
    const {
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    } = parameterAssignForGenerateButtonEventHandler();

    console.log('handleGenerateButtonClick() - calling generatePalette()');
    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace);
    console.log('handleGenerateButtonClick() complete');
};


export { generatePalette, handleGenerateButtonClick };