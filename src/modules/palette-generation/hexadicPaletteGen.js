// Color Palette Generator - version 0.4
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Leraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateColor1, randomSL, populateColorTextOutputBox } from './index.js';


// Generate hexadic hues
function generateHexadicHues(color) {
    const hexadicHues = [];
    const baseHue = color.hue;
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomDistance = Math.floor(Math.random() * 71 + 10);
    const hue3 = (hue1 + randomDistance) % 360;
    const hue4 = (hue3 + 180) % 360;
    const hue5 = (hue1 - randomDistance) % 360;
    const hue6 = (hue5 + 180) % 360;

    hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);
    return hexadicHues;
}


// Generate hexadic palette
function generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    const colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    const hexadicHues = generateHexadicHues(color);

    colors.push(color);

    for (let i = 0; i < hexadicHues.length; i++) {
        let hexadicHue = hexadicHues[i];
        let hexadicSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let hexadicColor = {
            hue: hexadicHue,
            saturation: hexadicSatAndLightness.saturation,
            lightness: hexadicSatAndLightness.lightness
        };

        colors.push(hexadicColor);

        let colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${hexadicColor.hue}, ${hexadicColor.saturation}%, ${hexadicColor.lightness}%)`;
            populateColorTextOutputBox(hexadicColor, i + 1);
        }
    }
    return colors;
}


export { generateHexadicPalette };