// KolorKraft - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { randomHSL, randomHSV, randomLab, randomSL, populateColorTextOutputBox, getWeightedRandomInterval } from '../../utils/index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';
import { applyLimitGrayAndBlack, applyLimitLight } from './index.js';


// Generate diadic hues
function generateDiadicHues(baseHue) {
    console.log('generateDiadicHues() executing');
    console.log('baseHue: ', baseHue);

    const diadicHues = [];
    const randomDistance = getWeightedRandomInterval();
    const hue1 = baseHue;
    const hue2 = (hue1 + randomDistance) % 360;

    diadicHues.push(hue1, hue2);

    console.log('diadicHues: ', diadicHues);
    console.log('generateDiadicHues() execution complete');

    return diadicHues;
}


// Generate diadic color palette
function generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {

    console.log('generateDiadicPalette() executing');
    let generateDiadicPaletteParameters = [ numBoxes, limitGrayAndBlack, limitLight, customColor, initialColorSpace ];
    console.log(generateDiadicPaletteParameters);

    if (numBoxes < 2) {
        window.alert('To generate a diadic palette, please select a number of swatches greater than 1');
        return;
    }

    const colors = [];
    let baseColor;

    // Generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        console.log('calling generateAndStoreColorValues');
        baseColor = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
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
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }

        console.log('initialColorSpace switch expression for generateDiadicPalette complete');
    }

    // Use baseColor.hsl to generate diadic hues
    const diadicHues = generateDiadicHues(baseColor.hue);
    console.log('diadicHues: ', diadicHues);

    // First color is the base color (randomized or customColor)
    colors.push(baseColor);

    // Generate the main diadic color (second color)
    const hue = diadicHues[1];
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

    console.log('calling generateAndStoreColorValues');
    const diadicColor = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');
    colors.push(diadicColor);

    // If numBoxes > 2, add additional variations within +/-5 of colors 1 or 2
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 2); // Randomly select color 1 or 2
        const baseHue = diadicHues[baseColorIndex]; // Use hues from color 1 or 2
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // Generate hue within +/-5 of baseHue
        console.log('calling randomSL');
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);
        let isValid = false;
        let attempts = 0;
        const maxAttempts = 100;

        // Ensure saturation and lightness are at least 10 units away
        while (!isValid && attempts < maxAttempts) {
            isValid = true;
            const baseColor = colors[baseColorIndex];
            if (Math.abs(saturation - baseColor.saturation) < 10) {
                saturation = baseColor.saturation + (saturation >= baseColor.saturation ? 10 : -10);
            }
            if (Math.abs(lightness - baseColor.lightness) < 10) {
                lightness = baseColor.lightness + (lightness >= baseColor.lightness ? 10 : -10);
            }

            // Adjust if saturation or lightness are not inside the range 0-100
            if (saturation > 100) saturation = 100;
            if (saturation < 0) saturation = 0;
            if (lightness > 100) lightness = 100;
            if (lightness < 0) lightness = 0;

            // Ensure limitGrayAndBlack and limitLight are still acting as additional limits
            if (limitGrayAndBlack) {
                console.log('calling applyLimitGrayAndBlack');
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                console.log('calling applyLimitLight');
                lightness = applyLimitLight(lightness);
            }

            if (Math.abs(saturation - baseColor.saturation) < 10 || Math.abs(lightness - baseColor.lightness) < 10) {
                console.log('calling randomSL');
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
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
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

            // Re-apply parameters if necessary
            if (limitGrayAndBlack) {
                console.log('calling applyLimitGrayAndBlack');
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                console.log('calling applyLimitLight');
                lightness = applyLimitLight(lightness);
            }
        }

        // !*this variable is never used*!
        const additionalColor = generateAndStoreColorValue({ hue, saturation, lightness }, 'hsl');
    }

    // Update the DOM with generated colors
    colors.forEach((color, index) => {
        console.log('updating DOM with generated colors');
        let updateDOMWithGeneratedColorsParameters = [ color, index ];
        console.log(updateDOMWithGeneratedColorsParameters);
        let colorBox = document.getElementById(`color-box-${index + 1}`);
        
        if (colorBox) {
            colorBox.style.backgroundColor = color.hsl;
            console.log(`applying background color to color-box #${index + 1}`);
            console.log(`calling populateColorTextOutputBox for color-box #${index + 1}`);
            populateColorTextOutputBox(color, index + 1);
        }
    })

    return colors;
}

export { generateDiadicPalette };