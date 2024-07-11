// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateColor1, generatePaletteBox, generateComplementaryPalette, generateTriadicPalette, generateTetradicPalette, generateHexadicPalette, generateSplitComplementaryPalette, generateAnalogousPalette, generateDiadicPalette  } from './index.js';



// Define default behavior for generateButton click event
export function handleGenerateButtonClick() {
    let paletteTypeOptions = document.getElementById('palette-type-options');
    let paletteNumberOptions = document.getElementById('palette-number-options');
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = paletteTypeOptions.value;
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;
    let colors = [];

    if (selectedPaletteTypeOptionValue == "1") {
        if (numBoxes == 1) {
            colors = [generateColor1(limitGrayAndBlack, limitLight)];
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select "1" for "# of colors" to generate a single random color');
        }
    } else if (selectedPaletteTypeOptionValue == "2") {
        if (numBoxes !== 1) {
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate a complementary palette');
        }
    } else if (selectedPaletteTypeOptionValue == "3") {
        if (numBoxes == 3) {
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "3" for "# of colors" to generate a triadic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "4") {
        if (numBoxes == 4) {
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "4" for "# of colors" to generate a tetradic color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "5") {
        if (numBoxes == 3) {
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "3" for "# of colors" to generate a split complementary color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "6") {
        if (numBoxes !== 1) {
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select a number greater than "1" for "# of colors" to generate an analogous color palette');
        }
    } else if (selectedPaletteTypeOptionValue == "7") {
        if (numBoxes == 6) {
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "6" for "# of colors" to generate a hexadic palette');
        }
    } else if (selectedPaletteTypeOptionValue == "8") {
        if (numBoxes == 2) {
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight);
            generatePaletteBox(colors, numBoxes);
        } else {
            window.alert('Please select the number "2" for "# of colors" to generate a diadic palette');
        }
    }
}