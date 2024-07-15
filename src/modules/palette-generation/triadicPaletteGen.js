// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomSL, generateColor1 } from './index.js';
import { populateColorTextOutputBox } from './index.js';


// Generate triadic hues
function generateTriadicHues(color) {
    const triadicHues = [];
    const increments = [120, 240];

    increments.forEach(increment => {
        triadicHues.push((color.hue + increment) % 360);
    });
    return triadicHues;
}


// Generate triadic palette
function generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 3) {
        window.alert('To generate a triadic palette, please select a number of swatches greater than 2');
        return;
    }

    const colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    const triadicHues = generateTriadicHues(color);

    colors.push(color);

    for (let i = 0; i < numBoxes - 1; i++) {
        let triadicHue = triadicHues[i];
        let triadicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let triadicColor = {
            hue: triadicHue,
            saturation: triadicSatAndLightness.saturation,
            lightness: triadicSatAndLightness.lightness
        };

        colors.push(triadicColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${triadicColor.hue}, ${triadicColor.saturation}%, ${triadicColor.lightness}%)`;
            populateColorTextOutputBox(triadicColor, i + 2);
        }
    }
    return colors;
}


export { generateTriadicPalette };