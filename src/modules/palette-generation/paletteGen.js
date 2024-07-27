// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



<<<<<<< HEAD
import { generatePaletteBox } from './index.js';
import { generatePaletteExitLogs } from '../../utils/index.js';
import { randomInitialColorWithLogs, generateSelectedPaletteTypeWithLogs, parameterAssignForGenerateButtonEventHandlerWithLogs, paletteGenColorSpaceConditionCheckWithLogs } from './index.js';
=======
import { generatePaletteBox, generateRandomColorPalette, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette, generateMonochromaticPalette } from './index.js';
import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';
>>>>>>> parent of 5f76951 (ok I lied. EOD for real now)


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
    console.log('baseColor: ', baseColor, ' type: ', (typeof baseColor));

    if (!baseColor.value) {
        switch (initialColorSpace) {
            case 'hex':
                console.log('calling randomHex from within generatePalette');
                baseColor.value = randomHex(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'rgb':
                console.log('calling randomRGB from within generatePalette');
                baseColor.value = randomRGB(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'hsl':
                console.log('calling randomHSL from within generatePalette');
                baseColor.value = randomHSL(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'hsv':
                console.log('calling randomHSV from within generatePalette');
                baseColor.value = randomHSV(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'cmyk':
                console.log('calling randomCMYK from within generatePalette');
                baseColor.value = randomCMYK(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'lab':
                console.log('calling randomLab from within generatePalette');
                baseColor.value = randomLab(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            default:
                console.log('DEFAULT CASE - calling randomHex from within generatePalette');
                baseColor.value = randomHex(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
        }

<<<<<<< HEAD
    // Generate user-selected palette type
    generateSelectedPaletteTypeWithLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
=======
        console.log ('baseColor.value: ', baseColor.value);
    }

    console.log('generatePalette initialColorSpace switch expression complete');
    console.log('baseColor: ', baseColor);

    switch (paletteType) {
        case 1:
            console.log('calling generateRandomColorPalette');
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 2:
            console.log('calling generateComplementaryPalette');
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 3:
            console.log('calling generateTriadicPalette');
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 4:
            console.log('calling generateTetradicPalette');
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 5:
            console.log('calling generateSplitComplementaryPalette');
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 6:
            console.log('calling generatAnalogousPalette');
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 7:
            console.log('calling generateHexadicPalette');
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 8:
            console.log('calling generateDiadicPalette');
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        case 9:
            console.log('calling generateMonochromaticPalette');
            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            break;
        default:
            console.error('unable to determine color scheme');
            break;
    }

    console.log('paletteType switch expression complete for generatePalette function');
>>>>>>> parent of 5f76951 (ok I lied. EOD for real now)

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