// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { generatePaletteBox } from './index.js';
import { generatePaletteExitLogs } from '../../utils/index.js';
import { randomInitialColorWithLogs, generateSelectedPaletteTypeWithLogs, paletteGenColorSpaceConditionCheckWithLogs } from './index.js';


// Generate Initial Palett
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace = 'hex') {
    console.log('executing generatePalette');

    let colors = [];
    let baseColor;

    console.log('customColor: ', customColor, " data type: ", (typeof customColor));

    // First, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
    // If customColor has no value, will instead assign it a default value while formatting it as an object
    paletteGenColorSpaceConditionCheckWithLogs(customColor);

    randomInitialColorWithLogs(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight);

    // Generate user-selected palette type
    generateSelectedPaletteTypeWithLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

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
}


// What the fuck is this function actually doing anymore???
// Define default behavior for generateButton click event
function handleGenerateButtonClick() {
    console.log('executing handleGenerateButtonClick');
    
    const {
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    } = parameterAssignForGenerateButtonEventHandlerWithLogs();

    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace);
};


export { handleGenerateButtonClick, generatePalette };