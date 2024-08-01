// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { populateColorTextOutputBox } from './index.js';
import { randomHSL, randomSL } from '../../utils/index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';


function generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('executing generateMonochromaticPalette');
    console.log(`numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    if (numBoxes < 2) {
        window.alert('To generate a monochromatic palette, please select a number of swatches greater than 1');
        return [];
    }

    const colors = [];
    let baseColor;

    // Generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        console.log('calling generateAndStoreColorValues to define baseColor');
        baseColor = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
        console.log('baseColor: ', baseColor);
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'rgb':
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsl':
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsv':
                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'cmyk':
                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'lab':
                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            default:
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }
        console.log('initialColorSpace switch expression complete for generateMonochromaticPalette');
    }

    for (let i = 0; i < numBoxes; i++) {
        console.log('calling randomSL');
        const slValues = randomSL(limitGrayAndBlack, limitLight);
        console.log('calling generateAndStoreColorValues');
        const monoColor = generateAndStoreColorValues({
            hue: baseColor.hue, // Use the hue from the base color
            saturation: slValues.saturation,
            lightness: slValues.lightness
        }, 'hsl');
        console.log('monoColor: ', monoColor);

        colors.push(monoColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);
        if (colorBox) {
            console.log(`applying background color ${monoColor.hsl} to color-box #${i + 1}`);
            colorBox.style.backgroundColor = monoColor.hsl;
            console.log('calling populateColorTextOutputBox');
            populateColorTextOutputBox(monoColor, (i + 1));
        }
    }

    console.log('execution complete for generateMonochromaticPalette');
    return colors;
}


export { generateMonochromaticPalette };