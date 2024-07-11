// Color Palette Generator - version 0.31
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { populateColorTextOutputBox } from '../dom.js';
import { generateColor1, randomSL } from './index.js';


// Generate complementary palette
function generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight) {
    const colors = [];
    const color = generateColor1(limitGrayAndBlack, limitLight);
    const complementaryHue = (color.hue + 180) % 360;

    colors.push(color);

    for (let i = 2; i <= numBoxes; i++) {
        let complementarySatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let complementaryColor = {
            hue: complementaryHue,
            saturation: complementarySatAndLightness.saturation,
            lightness: complementarySatAndLightness.lightness
        };

        colors.push(complementaryColor);

        let colorBox = document.getElementById(`color-box-${i}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${complementaryColor.hue}, ${complementaryColor.saturation}%, ${complementaryColor.lightness}%)`;
            populateColorTextOutputBox(complementaryColor, i);
        }
    }
    return colors;
}


export { generateComplementaryPalette };