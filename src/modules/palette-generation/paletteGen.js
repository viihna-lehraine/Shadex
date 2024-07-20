// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generatePaletteBox, generateRandomColorPalette, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette, generateMonochromaticPalette } from './index.js';
import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';


// Generate Initial Palette
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace, customColor) {
    let colors = [];
    let baseColor;

    switch (initialColorSpace) {
        case 'hex':
            baseColor = customColor || randomHex(limitGrayAndBlack, limitLight);
            break;
        case 'rgb':
            baseColor = customColor || randomRGB(limitGrayAndBlack, limitLight);
            break;
        case 'hsl':
            baseColor = customColor || randomHSL(limitGrayAndBlack, limitLight);
            break;
        case 'hsv':
            baseColor = customColor || randomHSV(limitGrayAndBlack, limitLight);
            break;
        case 'cmyk':
            baseColor = customColor || randomCMYK(limitGrayAndBlack, limitLight);
            break;
        case 'lab':
            baseColor = customColor || randomLab(limitGrayAndBlack, limitLight);
            break;
        default:
            baseColor = customColor || randomHSL(limitGrayAndBlack, limitLight);
    }

    // Ensure baseColor is correctly generated
    console.log('Base color: ', baseColor);

    switch (paletteType) {
        case 1:
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor);
            break;
        case 2:
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 3:
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 4:
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 5:
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 6:
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 7:
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 8:
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        case 9:
            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace);
            break;
        default:
            console.error('Unable to determine color scheme (paletteGen.js)');
            break;
    }

    // Check value of colors array
    console.log('Colors Array: ', colors);

    // Error logging if colors array is empty or undefined
    if (!colors || colors.length === 0) {
        console.error('Colors array is empty or undefined');
    }

    generatePaletteBox(colors, numBoxes);
}


// Define default behavior for generateButton click event
function handleGenerateButtonClick() {
    let paletteTypeOptions = document.getElementById('palette-type-options');
    let paletteNumberOptions = document.getElementById('palette-number-options');
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = parseInt(paletteTypeOptions.value, 10);
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;
    let initialColorSpace = document.getElementById('initial-colorspace-options').value || 'hsl' ;
    
    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace);
}


export { handleGenerateButtonClick, generatePalette };