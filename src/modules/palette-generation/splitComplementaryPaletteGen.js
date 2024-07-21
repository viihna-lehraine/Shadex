// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomSL } from '../../utils/index.js';
import { populateColorTextOutputBox } from './index.js';
import { applyLimitGrayAndBlack, applyLimitLight } from '../index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';


// Generate split complementary hues
function generateSplitComplementaryHues(baseHue) {
    console.log('executing generateSplitcomplementaryHues');
    console.log('baseHue: ', baseHue);

    const splitComplementaryHues = [];
    const baseComplementaryHue = (baseHue + 180) % 360;
    const modifier = Math.floor(Math.random() * 11) + 20;

    splitComplementaryHues.push((baseComplementaryHue + modifier) % 360);
    splitComplementaryHues.push((baseComplementaryHue - modifier + 360) % 360);

    return splitComplementaryHues;
}


// Generate split complementary palette
function generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hsl') {
    console.log('executing generateSplitcomplementaryPalette');
    console.log(`numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    if (numBoxes < 3) {
        window.alert('To generate a split complementary palette, please select a number of swatches greater than 2');
        return [];
    }

    const colors = [];
    let baseColor;

    // Generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        console.log('calling generateAndStoreColorValues to define baseColor');
        baseColor = generateAndStoreColorValues(customColor, initialColorSpace);
        console.log('baseColor: ', baseColor);
    } else {
        switch (initialColorSpace) {
            case 'hex':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'rgb':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsl':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsv':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'cmyk':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'lab':
                console.log('calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            default:
                console.log('DEFAULT CASE - calling generateAndStoreColorValues');
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
        }

        console.log('initialColorSpace switch expression complete for generateSplitComplementaryPalette');
    }

    // Use baseColor.hue to generate split complementary hues
    const splitComplementaryHues = generateSplitComplementaryHues(baseColor.hue);
    console.log('splitComplementaryHues: ', splitComplementaryHues);

    // First color is the base color (randomized or customColor)
    colors.push(baseColor);

    // Generate main split complementary colors (colors 2-3, i = 1 || 2)
    for (let i = 0; i < 2; i++) {
        const hue = splitComplementaryHues[i];
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
        const color = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');
        colors.push(color);
    }

    // if numBoxes > 3, add additional variations within ±5 of colors 2 and/or 3
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 2) + 1; // Randomly select color 2 or 3
        const baseHue = splitComplementaryHues[baseColorIndex - 1]; // Use hues from color 2 or 3
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

            // adjust if saturation or lightness are not inside the range 0-100
            if (saturation > 100) saturation = 100;
            if (saturation < 0) saturation = 0;
            if (lightness > 100) lightness = 100;
            if (lightness < 0) lightness = 0;

            // ensure limitGrayAndBlack and limitLight are still acting as additional limits
            if (limitGrayAndBlack) {
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                lightness = applyLimitLight(lightness);
            }

            if (Math.abs(saturation - baseColor.saturation) < 10 || Math.abs(lightness - baseColor.lightness) < 10) {
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
            console.log(`applying background color ${backgroundColor} for color-box #${index + 1}`);
            colorBox.style.backgroundColor = color.hsl;
            console.log(`calling populateColorTextOutputBox for palette-box #${index + 1}`);
            populateColorTextOutputBox(color, index + 1);
        }
    });

    console.log('colors: ', colors);
    console.log('execution complete for generateSplitcomplementaryPalette');
    return colors;
}


export { generateSplitComplementaryPalette };