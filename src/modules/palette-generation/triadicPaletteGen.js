// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { randomSL } from './index.js';
import { populateColorTextOutputBox } from './index.js';
import { applyLimitGrayAndBlack, applyLimitLight } from './index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';


// Generate triadic hues
function generateTriadicHues(baseHue) {
    console.log('executing generateTriadicHues');
    console.log('baseHue: ', baseHue);

    const triadicHues = [];
    const increments = [120, 240];

    increments.forEach(increment => {
        triadicHues.push((baseHue + increment) % 360);
    });

    console.log('triadicHues: ', triadicHues);
    return triadicHues;
}


// Generate triadic palette
function generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('executing generateTriadicColorPalette');
    console.log(`numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    if (numBoxes < 3) {
        window.alert('To generate a triadic palette, please select a number of swatches greater than 2');
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
        
        console.log('initialColorSpace switch expression complete for generateTriadicPalette');
    }

    console.log('calling generateTriadicHues');
    const triadicHues = generateTriadicHues(baseColor.hue);
    console.log('triadicHues: ', triadicHues);

    // First color is the base color (randomized or customColor)
    colors.push(baseColor);

    // Generate main triadic colors (colors 2-3, i = 1 || 2)
    for (let i = 0; i < 2; i++) {
        const hue = triadicHues[i];
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
        console.log(`triadic colors; color #${i}: ${color}`);
        colors.push(color);
    }

    // if numBoxes > 3, add additional variations within ±5 hue of colors 1-3
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 3); // Randomly select one of the first three colors
        const baseHue = colors[baseColorIndex].hue;
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // Generate hue within ±5 of baseHue
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

        console.log('calling generateAndStoreColorValues to define additionalColor');
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

    return colors;
}


export { generateTriadicPalette };