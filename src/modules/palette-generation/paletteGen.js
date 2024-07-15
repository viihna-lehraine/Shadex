// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generatePaletteBox, generateRandomColorPalette, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette, generateMonochromaticPalette } from './index.js';
import { randomHSL } from './index.js';


// Generate Initial Palette
function generatePalette(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor) {
    let colors = [];
    const baseColor = customColor || randomHSL(limitGrayAndBlack, limitLight);

    switch (paletteType) {
        case 1:
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 2:
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 3:
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 4:
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 5:
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 6:
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 7:
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 8:
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
        case 9:
            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor);
            break;
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
    
    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight);
}


export { handleGenerateButtonClick, generatePalette };