// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE


import { randomHSL, randomSL } from './index.js';
import { populateColorTextOutputBox } from './index.js';


// Generate a random color palette
function generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const baseColor = randomHSL(limitGrayAndBlack, limitLight);

    for (let i = 0; i < numBoxes; i++) {
        const slValues = randomSL(limitGrayAndBlack, limitLight);
        const monoColor = {
            hue: baseColor.hue,
            saturation: slValues.saturation,
            lightness: slValues.lightness
        };
        colors.push(monoColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${monoColor.hue}, ${monoColor.saturation}%, ${monoColor.lightness})`;
            populateColorTextOutputBox(monoColor, (i + 1));
        }

    }
}


export { generateMonochromaticPalette };