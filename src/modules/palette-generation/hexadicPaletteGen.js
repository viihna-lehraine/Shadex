// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

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
    const hue5 = (hue1 + 360 - randomDistance) % 360;
    const hue6 = (hue5 + 180) % 360;

    hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);
    return hexadicHues;
}


// Generate hexadic palette
function generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 6) {
        window.alert('To generate a hexadic palette, please select a number of swatches greater than 5');
        return [];
    }

    const colors = [];
    const color = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    console.log(colors);
    const hexadicHues = generateHexadicHues(color);

    for (let i = 0; i < numBoxes; i++) {
        let hexadicHue = hexadicHues[i % 6]; // Cycle through the hexadic hues
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
    console.log(colors);
    return colors;
}



export { generateHexadicPalette };