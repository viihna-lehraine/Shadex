import { genAndStoreColorValues } from '../color-convert/convert';
import { populateColorTextOutputBox } from '../dom/main';
import {
    randomCMYK,
    randomHex,
    randomHSL,
    randomHSV,
    randomLAB,
    randomRGB,
    randomSL
} from '../../utils/random';

export function genSplitComplementaryHues(baseHue) {
    const splitComplementaryHues = [];
    const baseComplementaryHue = (baseHue + 180) % 360;
    const modifier = Math.floor(Math.random() * 11) + 20;

    splitComplementaryHues.push((baseComplementaryHue + modifier) % 360);
    splitComplementaryHues.push((baseComplementaryHue - modifier + 360) % 360);

    return splitComplementaryHues;
}

export function genSplitComplementaryPalette(
    numBoxes: number,
    limitGrayAndBlack: boolean,
    limitLight: boolean,
    customColor: unknown = null,
    initialColorSpace: string = 'hex'
) {
    if (numBoxes < 3) {
        window.alert('To generate a split complementary palette, please select a number of swatches greater than 2');

        return [];
    }

    const colors = [];
    let baseColor;

    // generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        baseColor = genAndStoreColorValues(customColor, initialColorSpace = 'hsl');
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = generateAndStoreColorValues(
                    randomHex(
                        limitGrayAndBlack,
                        limitLight
                    ), initialColorSpace = 'hex'
                );
                break;
            case 'rgb':
                baseColor = genAndStoreColorValues(
                    randomRGB(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'hsl':
                baseColor = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'hsv':
                baseColor = genAndStoreColorValues(
                    randomHSV(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'cmyk':
                baseColor = genAndStoreColorValues(
                    randomCMYK(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'lab':
                baseColor = genAndStoreColorValues(
                    randomLAB(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            default:
                baseColor = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
        }
    }

    // use baseColor.hue to generate split complementary hues
    const splitComplementaryHues = geneSplitComplementaryHues(baseColor.hue);

    // first color is the base color (randomized or customColor)
    colors.push(baseColor);

    // generate main split complementary colors (colors 2-3, i = 1 || 2)
    for (let i = 0; i < 2; i++) {
        const hue = splitComplementaryHues[i];

        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);

        if (limitGrayAndBlack) {
            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }

        if (limitLight) {
            lightness = applyLimitLight(lightness);
        }

        const color = genAndStoreColorValues({ hue, saturation, lightness }, 'hsl');

        colors.push(color);
    }

    // if numBoxes > 3, add additional variations within ±5 of colors 2 and/or 3
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 2) + 1; // randomly select color 2 or 3
        const baseHue = splitComplementaryHues[baseColorIndex - 1]; // Use hues from color 2 or 3
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // generate hue within ±5 of baseHue

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

            // generate valid values within accepted bounds, excluding the range ±10 relative to the base color (exclusive)
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

            // re-apply limits if necessary
            if (limitGrayAndBlack) {
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }

            if (limitLight) {
                lightness = applyLimitLight(lightness);
            }
        }

        const additionalColor = genAndStoreColorValues({ hue, saturation, lightness }, 'hex');

        colors.push(additionalColor);
    }

    // update the DOM with generated colors
    colors.forEach((color, index) => {
        const colorBox = document.getElementById(`color-box-${index + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = color.hsl;

            populateColorTextOutputBox(color, index + 1);
        }
    })

    return colors;
};
