// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generatePaletteBox, generateRandomColorPalette, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette, generateMonochromaticPalette } from './index.js';

import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';

import { randomInitialColorWithLogs, generateSelectedPaletteTypeWithLogs } from './index.js';


// Generate Initial Palette
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace = 'hex') {
    console.log('executing generatePalette');

    let colors = [];
    let baseColor;

    console.log('customColor: ', customColor, " data type: ", (typeof customColor));

    // Ensures customColor is an object. If not, reformats as an object
    if (customColor && typeof customColor === 'object' && customColor.value) {
        baseColor = customColor;
        console.log('customColor already exists as an object with an assigned value');
    } else {
        // Assign default values if customColor is not provided or is not an object
        console.log('formatting customColor as an object')
        baseColor = {
            format: initialColorSpace,
            value: customColor
        };
    }

    console.log('generatePalette() initialColorSpace switch expression complete');

    // Create random initial colors if user doesn't define a custom color
    randomInitialColorWithLogs(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight);

    // Generate user-selected palette type, with logs
    generateSelectedPaletteTypeWithLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

    if (!colors) {
        console.error('ERROR - ending generatePalette execution (cannot determine color scheme');
        return;
    }

    // Error logging if the colors array is malformed
    if (!colors || colors.length === 0) {
        console.error('colors array is empty or undefined');
    }

    console.log('colors: ', colors, ' data type: ', (typeof colors));
    console.log('numBoxes: ', numBoxes, ' data type: ', (typeof numBoxes));

    console.log('generatePalette execution complete; calling generatePaletteBox');

    generatePaletteBox(colors, numBoxes);
}


// Define default behavior for generateButton click event
function handleGenerateButtonClick() {
    console.loog('executing handleGenerateButtonClick');

    let paletteTypeOptions = document.getElementById('palette-type-options');
    let paletteNumberOptions = document.getElementById('palette-number-options');
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = parseInt(paletteTypeOptions.value, 10);
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;
    let initialColorSpace = document.getElementById('initial-colorspace-options').value || 'hsl' ;
    
    console.log(`selectedPaletteTypeOptionValue: ${selectedPaletteTypeOptionValue}, numBoxes: ${numBoxes}, limitGrayAndBlacK: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    
    console.log('execution of handleGenerateButtonClick complete; executing generatePalette')
    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace);
}


export { handleGenerateButtonClick, generatePalette };