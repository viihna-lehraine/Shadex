// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomHSL } from './index.js';
import { populateColorTextOutputBox } from './index.js';


function generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    
    for (let i = 0; i < numBoxes; i++) {
        const hslValues = randomHSL(limitGrayAndBlack, limitLight);
        const randomColor = {
            hue: hslValues.hue,
            saturation: hslValues.saturation,
            lightness: hslValues.lightness
        };

        colors.push(randomColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${randomColor.hue}, ${randomColor.saturation}%, ${randomColor.lightness})`;
            populateColorTextOutputBox(randomColor, (i + 1));
        }
    }
    return colors;
}


export { generateRandomColorPalette };