import { genAndStoreColorValues } from '../../modules/color-convert/convert';
import { convert } from '../color-convert/conversion-index';
import { getWeightedRandomInterval } from '../../utils/palette-gen';
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

export function genDiadicHues(baseHue: number) {
    const diadicHues = [];
    const randomDistance = getWeightedRandomInterval();
    const hue1 = baseHue;
    const hue2 = (hue1 + randomDistance) % 360;

    diadicHues.push(hue1, hue2);

    return diadicHues;
};

export function genDiadicPalette(
    numBoxes: number,
    limitGrayAndBlack: boolean,
    limitLight: boolean,
    customColor: unknown = null,
    initialColorSpace: string = 'hex'
) {
    if (numBoxes < 2) {
        window.alert('To generate a diadic palette, please select a number of swatches greater than 1');

        return;
    }

    const colors = [];
    let baseColor;

    // generate base color using initial color space
    if (customColor !== null && customColor !== undefined) {
        baseColor = genAndStoreColorValues(
            customColor,
            initialColorSpace = 'hex'
        );
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = genAndStoreColorValues(
                    randomHex(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex');
                break;
            case 'rgb':
                baseColor = genAndStoreColorValues(
                    randomRGB(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex');
                break;
            case 'hsl':
                baseColor = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex');
                break;
            case 'hsv':
                baseColor = genAndStoreColorValues(
                    randomHSV(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex');
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

    // use baseColor.hsl to generate diadic hues
    const diadicHues = genDiadicHues(baseColor.hue);

    // first color is the base color (randomized or customColor)
    colors.push(baseColor);

    // generate the main diadic color (second color)
    const hue = diadicHues[1];

    let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);

    if (limitGrayAndBlack) {
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
    }

    if (limitLight) {
        lightness = applyLimitLight(lightness);
    }

    const diadicColor = genAndStoreColorValues({ hue, saturation, lightness }, 'hsl');

    colors.push(diadicColor);

    // if numBoxes > 2, add additional variations within +/-5 of colors 1 or 2
    while (colors.length < numBoxes) {
        const baseColorIndex = Math.floor(Math.random() * 2); // randomly select color 1 or 2
        const baseHue = diadicHues[baseColorIndex]; // use hues from color 1 or 2
        const hue = (baseHue + Math.floor(Math.random() * 11) - 5 + 360) % 360; // generate hue within +/-5 of baseHue

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

            // re-apply parameters if necessary
            if (limitGrayAndBlack) {
                ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
            }
            if (limitLight) {
                lightness = applyLimitLight(lightness);
            }
        }

        // *DEV-NOTE* !*this variable is never used*!
        // const additionalColor = generateAndStoreColorValues({ hue, saturation, lightness }, 'hsl');
    }

    // update the DOM with generated colors
    colors.forEach((color, index) => {
        let updateDOMWithGeneratedColorsParameters = [ color, index ];
        console.log(updateDOMWithGeneratedColorsParameters);
        let colorBox = document.getElementById(`color-box-${index + 1}`);
        
        if (colorBox) {
            colorBox.style.backgroundColor = color.hsl;
            populateColorTextOutputBox(color, index + 1);
        }
    })

    return colors;
};
