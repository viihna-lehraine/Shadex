// KolorKraft - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, randomSL } from '../../utils/index.js';
import { populateColorTextOutputBox } from './index.js';
import { applyLimitGrayAndBlack, applyLimitLight } from './index.js';
import { generateAndStoreColorValues } from '../color-conversion/colorConversion.js';


function generateTetradicHues(baseHue) {
    console.log('executing generateTetradicHues');
    console.log('baseHues: ', baseHue);

    const tetradicHues = [];
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomOffset = Math.floor(Math.random() * 46) + 20;
    const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
    const hue3 = (hue1 + distance) % 360;
    const hue4 = (hue3 + 180) % 360;

    tetradicHues.push(hue1, hue2, hue3, hue4);
    console.log('tetradicHues: ', tetradicHues);

    return tetradicHues;
}


// Generate tetradic palette
function generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('calling generateTetradicPalette');
    console.log(`numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    if (numBoxes < 4) {
        window.alert('To generate a tetradic palette, please select a number of swatches greater than 3');
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
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'rgb':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsl':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsv':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'cmyk':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'lab':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            default:
                console.log('DEFAULT CASE - calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }
    }

    // Use baseColor.hue to generate tetradic hues
    const tetradicHues = generateTetradicHues(baseColor.hue);
    console.log('tetradicHues: ', tetradicHues);

    // First color is the base color (randomized or customColor)
    colors.push(baseColor);

    // Generate main tetradic colors (colors 2-4, i = (1 || 2 || 3))
    for (let i = 1; i < 4; i++) {
        const hue = tetradicHues[i];
        console.log('calling randomSL');
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);
        if (limitGrayAndBlack) {
            console.log('calling applyLimitGrayAndBlack');
            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }
        if (limitLight) {
            console.log('calling applyLimitLight');
            lightness = applyLimitLight(lightness);
        }

        console.log('calling generateAndStoreColorValues to define const color');
        const color = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');
        colors.push(color);
    }

    // if numBoxes = 5 || 6, add additional variations
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 4); // Randomly select one of the first four colors
        const baseHue = tetradicHues[baseColorIndex];
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // Generate hue within ±5 of baseHue
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);
        let isValid = false;
        let attempts = 0;
        const maxAttempts = 100;

        // ensure saturation and lightness are at least 10 units away
        while (!isValid && attempts < maxAttempts) {
            isValid = true;
            const baseColor = colors[baseColorIndex];
            if (Math.abs(saturation - baseColor.saturation) < 10) {
                saturation = baseColor.saturation + (saturation >= baseColor.saturation ? 10 : -10);
            }
            if (Math.abs(lightness - baseColor.lightness) < 10) {
                lightness = baseColor.lightness + (lightness >= baseColor.lightness ? 10 : -10);
            }

            // adjust if saturation or lightness are not inside the range 0-100
            if (saturation > 100) saturation = 100;
            if (saturation < 0) saturation = 0;
            if (lightness > 100) lightness = 100;
            if (lightness < 0) lightness = 0;

            // ensure limitGrayAndBlack and limitLight are still acting as additional limits
            if (limitGrayAndBlack) {
                console.log('calling applyLimitGrayAndBlack');
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                console.log('calling applyLimitLight');
                lightness = applyLimitLight(lightness);
            }

            if (Math.abs(saturation - baseColor.saturation) < 10 || Math.abs(lightness - baseColor.lightness) < 10) {
                console.log('calling randomSL to define const newSL');
                const newSL = randomSL(limitGrayAndBlack, limitLight);
                saturation = newSL.saturation;
                lightness = newSL.lightness;
                isValid = false;
            }
            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.warn('Reached maximum attempts to find valid saturation and lightness values.');
            console.log('Executing Option B - manually set saturation and lightness within acceptable range');
            // Generate valid values within accepted bounds, excluding the range ±10 relative to the base color (exclusive)
            const baseColor = colors[baseColorIndex];
            saturation = Math.random() > 0.5 ? baseColor.saturation + 10 : baseColor.saturation - 10;
            lightness = Math.random() > 0.5 ? baseColor.lightness + 10 : baseColor.lightness - 10;
            if (saturation > 100) {
                saturation = 100;
                if (limitGrayAndBlack) {
                    console.log('calling applyLimitGrayAndBlack');
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    console.log('calling applyLimitLight');
                    lightness = applyLimitLight(lightness);
                }
            }
            if (saturation < 0) {
                saturation = 0;
                if (limitGrayAndBlack) {
                    console.log('calling applyLimitGrayAndBlack');
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    console.log('calling applyLimitLight');
                    lightness = applyLimitLight(lightness);
                }
            }
            if (lightness > 100) {
                lightness = 100;
                if (limitGrayAndBlack) {
                    console.log('calling applyLimitGrayAndBlack');
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    console.log('calling applyLimitLight');
                    lightness = applyLimitLight(lightness);
                }
            }
            if (lightness < 0) {
                lightness = 0;
                if (limitGrayAndBlack) {
                    console.log('calling applyLimitGrayAndBlack');
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    console.log('calling applyLimitLight');
                    lightness = applyLimitLight(lightness);
                }
            }

            // Re-apply limits if necessary
            if (limitGrayAndBlack) {
                console.log('calling applyLimitGrayAndBlack');
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                console.log('calling applyLimitLight');
                lightness = applyLimitLight(lightness);
            }
        }

        const additionalColor = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');
        console.log('additionalColor: ', additionalColor);
        colors.push(additionalColor);
    }

    // Update the DOM with generated colors
    colors.forEach((color, index) => {
        const colorBox = document.getElementById(`color-box-${index + 1}`);
        if (colorBox) {
            console.log(`applying background color ${backgroundColor} to color-box #${index + 1}`);
            colorBox.style.backgroundColor = color.hsl;
            console.log(`calling populateColorTextOutputBox for palette-box #${index + 1}`);
            populateColorTextOutputBox(color, index + 1);
        }
    });

    console.log('execution complete for generateTetradicPalette');
    return colors;
}


export { generateTetradicPalette };