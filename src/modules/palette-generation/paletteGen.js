// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generatePaletteBox } from './index.js';
import { generatePaletteExitLogs } from '../../utils/index.js';
import { randomInitialColorWithLogs, generateSelectedPaletteTypeWithLogs, parameterAssignForGenerateButtonEventHandlerWithLogs, paletteGenColorSpaceConditionCheckWithLogs } from './index.js';


// Generate Initial Palett
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace = 'hex') {
    console.log('executing generatePalette');

    let colors = [];
    let baseColor;

    console.log('customColor: ', customColor, " data type: ", (typeof customColor));

    // First, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
    // If customColor has no value, will instead assign it a default value while formatting it as an object
    paletteGenColorSpaceConditionCheckWithLogs(customColor);

    console.log('generatePalette() initialColorSpace switch expression complete');

    // Create random initial colors if user doesn't define a custom color
    randomInitialColorWithLogs(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight);

    // Generate user-selected palette type
    generateSelectedPaletteTypeWithLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

    if (!colors) {
        console.error('ERROR - ending generatePalette execution (cannot determine color scheme');
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