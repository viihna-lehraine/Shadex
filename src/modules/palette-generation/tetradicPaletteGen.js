// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomSL, generateColor1 } from './index.js';
import { populateColorTextOutputBox } from './index.js';


// Generate tetradic hues
function generateTetradicHues(color) {
    const tetradicHues = [];
    const baseHue = color.hue;
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomOffset = Math.floor(Math.random() * 46) + 20;
    const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
    const hue3 = (hue1 + distance) % 360;
    const hue4 = (hue3 + 180) % 360;

    tetradicHues.push(hue1, hue2, hue3, hue4);
    return tetradicHues;
}


// Generate tetradic palette
function generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 4) {
        window.alert('To generate a tetradic palette, please select a number of swatches greater than 3');
        return;
    }

    const colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    const tetradicHues = generateTetradicHues(color);

    colors.push(color);

    for (let i = 0; i < tetradicHues.length; i++) {
        let tetradicHue = tetradicHues[i];
        let tetradicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let tetradicColor = {
            hue: tetradicHue,
            saturation: tetradicSatAndLightness.saturation,
            lightness: tetradicSatAndLightness.lightness
        };

        colors.push(tetradicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${tetradicColor.hue}, ${tetradicColor.saturation}%, ${tetradicColor.lightness}%)`;
            populateColorTextOutputBox(tetradicColor, i + 1);
        }
    }
    return colors;
}


export { generateTetradicPalette };