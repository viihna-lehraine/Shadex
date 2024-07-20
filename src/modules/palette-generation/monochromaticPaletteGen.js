// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { populateColorTextOutputBox } from './index.js';
import { randomHSL, randomSL } from '../../utils/index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';


function generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hsl') {
    if (numBoxes < 2) {
        window.alert('To generate a monochromatic palette, please select a number of swatches greater than 1');
        return [];
    }

    const colors = [];
    let baseColor;

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

    for (let i = 0; i < numBoxes; i++) {
        const slValues = randomSL(limitGrayAndBlack, limitLight);
        const monoColor = generateAndStoreColorValues({
            hue: baseColor.hue, // Use the hue from the base color
            saturation: slValues.saturation,
            lightness: slValues.lightness
        }, 'hsl');

        colors.push(monoColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = monoColor.hsl;
            populateColorTextOutputBox(monoColor, (i + 1));
        }
    }
    return colors;
}


export { generateMonochromaticPalette };