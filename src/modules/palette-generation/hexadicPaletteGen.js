// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomSL, populateColorTextOutputBox } from './index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';


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
function generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hsl') {
    if (numBoxes < 6) {
        window.alert('To generate a hexadic palette, please select a number of swatches greater than 5');
        return [];
    }

    // Generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        baseColor = generateAndStoreColorValues(customColor, initialColorSpace);
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'rgb':
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsl':
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsv':
                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'cmyk':
                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'lab':
                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            default:
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
        }
    }

    const hexadicHues = generateHexadicHues(baseColor.hue);

    for (let i = 0; i < numBoxes; i++) {
        const hue = hexadicHues[i % 6]; // Cycle through the hexadic hues
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);
        if (limitGrayAndBlack) {
            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }
        if (limitLight) {
            lightness = applyLimitLight(lightness);
        }
        const hexadicColor = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');
        colors.push(hexadicColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = hexadicColor.hsl;
            populateColorTextOutputBox(hexadicColor, i + 1);
        }
    }

    return colors;
}


export { generateHexadicPalette };