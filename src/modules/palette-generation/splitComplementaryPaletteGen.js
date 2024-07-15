// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateColor1, randomSL, populateColorTextOutputBox } from './index.js';


// Generate split complementary hues
function generateSplitComplementaryHues(color, numBoxes) {
    const splitComplementaryHues = [];
    const baseHue = color.hue;
    const baseComplementaryHue = (baseHue + 180) % 360;
    const modifier = Math.floor(Math.random() * 11) + 20;

    if (numBoxes >= 2) {
        splitComplementaryHues.push((baseComplementaryHue + modifier) % 360);
    }
    if (numBoxes >= 3) {
        splitComplementaryHues.push((baseComplementaryHue - modifier + 360) % 360);
    }
    return splitComplementaryHues;
}


// Generate split complementary palette
function generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 3) {
        window.alert('To generate a split complementary palette, please select a number of swatches greater than 2');
        return;
    }

    const colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    const splitComplementaryHues = generateSplitComplementaryHues(color, numBoxes);

    colors.push(color);

    for (let i = 0; i < splitComplementaryHues.length; i++) {
        let splitComplementaryHue = splitComplementaryHues[i];
        let splitComplementarySatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let splitComplementaryColor = {
            hue: splitComplementaryHue,
            saturation: splitComplementarySatAndLightness.saturation,
            lightness: splitComplementarySatAndLightness.lightness
        };

        colors.push(splitComplementaryColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${splitComplementaryColor.hue}, ${splitComplementaryColor.saturation}%, ${splitComplementaryColor.lightness}%)`;
            populateColorTextOutputBox(splitComplementaryColor, i + 2);
        }
    }
    return colors;
}


export { generateSplitComplementaryPalette };