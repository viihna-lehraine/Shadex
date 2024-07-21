// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generatePaletteBox, generateRandomColorPalette, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette, generateMonochromaticPalette } from './index.js';
import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';


// Generate Initial Palette
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace) {
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
    console.log('baseColor:', baseColor, 'data type:', typeof baseColor);


    switch (initialColorSpace) {
        case 'hex':
            console.log('calling randomHex from within generatePalette');
            baseColor = customColor || randomHex(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
            break;
        case 'rgb':
            console.log('calling randomRGB from within generatePalette');
            baseColor = customColor || randomRGB(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
            break;
        case 'hsl':
            console.log('calling randomHSL from within generatePalette');
            baseColor = customColor || randomHSL(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
            break;
        case 'hsv':
            console.log('calling randomHSV from within generatePalette');
            baseColor = customColor || randomHSV(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
            break;
        case 'cmyk':
            console.log('calling randomCMYK from within generatePalette');
            baseColor = customColor || randomCMYK(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
            break;
        case 'lab':
            console.log('calling randomLab from within generatePalette');
            baseColor = customColor || randomLab(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
            break;
        default:
            console.log('DEFAULT CASE - calling randomHex from within generatePalette');
            baseColor = customColor || randomHex(limitGrayAndBlack, limitLight);
            console.log('baseColor: ', baseColor, 'data type: ', (typeof baseColor));
    }

    console.log('generatePalette initialColorSpace switch expression complete');
    console.log('baseColor: ', baseColor);

    switch (paletteType) {
        case 1:
            console.log('calling generateRandomColorPalette');
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor);
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

    // Error logging if the colors array is malformed
    if (!colors || colors.length === 0) {
        console.error('colors array is empty or undefined');
    }

    console.log('colors: ', colors, ' data type: ', (typeof colors));
    console.log('numBoxes: ', numBoxes, ' data type: ', (typeof numBoxes));
    console.log('generatePalette execution complete; calling generatePaletteBox');

    generatePaletteBox(colors, numBoxes);
}


// What the fuck is this function actually doing anymore???
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