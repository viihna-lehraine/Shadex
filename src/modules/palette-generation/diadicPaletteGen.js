// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { generateColor1, randomSL } from './index.js';
import { populateColorTextOutputBox } from './index.js';
import { getWeightedRandomInterval } from '../../utils/index.js';
import { applyLimitGrayAndBlack, applyLimitLight } from './index.js';


// Generate diadic hues
function generateDiadicHues(baseHue) {
    const diadicHues = [];
    const randomDistance = getWeightedRandomInterval();
    const hue1 = baseHue;
    const hue2 = (hue1 + randomDistance) % 360;

    diadicHues.push(hue1, hue2);
    return diadicHues;
}


// Generate diadic color palette
function generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null) {
    if (numBoxes < 2) {
        window.alert('To generate a diadic palette, please select a number of swatches greater than 1');
        return;
    }

    const colors = [];
    const baseColor = customColor !== null && customColor !== undefined ? customColor : generateColor1(limitGrayAndBlack, limitLight);
    // Use baseColor.hue to generate diadic hues
    const diadicHues = generateDiadicHues(baseColor.hue);

    // First color is the base color (randomized or customColor)
    colors.push(baseColor);

    // Generate main diadic colors (colors 2, i = 1)
    for (let i = 0; i < 1; i++) {
        const hue = diadicHues[i + 1];
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);
        if (limitGrayAndBlack) {
            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }
        if (limitLight) {
            lightness = applyLimitLight(lightness);
        }
        colors.push({ hue, saturation, lightness });
    }

    // if numBoxes > 2, add additional variations within +/-5 of colors 1 or 2
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 2); // Randomly select color 1 or 2
        const baseHue = diadicHues[baseColorIndex]; // Use hues from color 1 or 2
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // Generate hue within +/-5 of baseHue
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
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }
            if (saturation < 0) {
                saturation = 0;
                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }
            if (lightness > 100) {
                lightness = 100;
                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }
            if (lightness < 0) {
                lightness = 0;
                if (limitGrayAndBlack) {
                    ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
                }
                if (limitLight) {
                    lightness = applyLimitLight(lightness);
                }
            }

            // Re-apply limits if necessary
            if (limitGrayAndBlack) {
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                lightness = applyLimitLight(lightness);
            }
        }

        colors.push({ hue, saturation, lightness });
    }


    // Update the DOM with generated colors
    colors.forEach((color, index) => {
        const colorBox = document.getElementById(`color-box-${index + 1}`);
        if (colorBox) {
            colorBox.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
            populateColorTextOutputBox(color, index + 1);
        }
    });

    return colors;
}


export { generateDiadicPalette };